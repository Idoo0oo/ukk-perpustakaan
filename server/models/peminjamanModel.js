/**
 * Deskripsi File:
 * Model lengkap untuk transaksi peminjaman.
 */

const db = require('../config/db');

class PeminjamanModel {
    static async create(userID, bukuID, tglPinjam, tglKembali) {
        const [result] = await db.query(
            "INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman) VALUES (?, ?, ?, ?, 'Menunggu')",
            [userID, bukuID, tglPinjam, tglKembali]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query("SELECT * FROM peminjaman WHERE PeminjamanID = ?", [id]);
        return rows[0];
    }

    // Base query helper untuk menghindari duplikasi
    static async _baseQuery(whereClause = "", params = []) {
        const query = `
            SELECT 
                p.PeminjamanID, p.UserID, p.BukuID,
                p.TanggalPeminjaman, p.TanggalPengembalian, p.StatusPeminjaman, p.Denda,
                b.Judul AS JudulBuku, b.Judul, b.Penulis,
                u.NamaLengkap AS NamaPeminjam, u.Username,
                (SELECT COUNT(*) FROM ulasanbuku ub WHERE ub.UserID = p.UserID AND ub.BukuID = p.BukuID) AS SudahDiulas
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            ${whereClause}
            ORDER BY p.TanggalPeminjaman ASC
        `;
        const [rows] = await db.query(query, params);
        return rows;
    }

    // Ambil semua (bisa filter by user)
    static async findAll(userID = null) {
        if (userID) {
            return this._baseQuery("WHERE p.UserID = ?", [userID]);
        }
        return this._baseQuery("", []);
    }

    // Khusus Admin: Ambil yang statusnya 'Menunggu' (Approval Peminjaman)
    static async findPending() {
        return this._baseQuery("WHERE p.StatusPeminjaman = 'Menunggu'");
    }

    // Khusus Admin: Ambil yang statusnya 'Menunggu Pengembalian' (Approval Pengembalian)
    static async findReturnRequests() {
        return this._baseQuery("WHERE p.StatusPeminjaman = 'Menunggu Pengembalian'");
    }

    // Khusus Admin: Semua history transaksi selesai
    static async findAllHistory() {
        return this._baseQuery("WHERE p.StatusPeminjaman IN ('Dikembalikan', 'Ditolak') ORDER BY p.PeminjamanID DESC");
    }

    // Update Status
    static async updateStatus(id, status, tglPinjam = null, tglKembali = null) {
        let query = "UPDATE peminjaman SET StatusPeminjaman = ?";
        let params = [status];

        if (tglPinjam && tglKembali) {
            query += ", TanggalPeminjaman = ?, TanggalPengembalian = ?";
            params.push(tglPinjam, tglKembali);
        }

        query += " WHERE PeminjamanID = ?";
        params.push(id);

        return db.query(query, params);
    }

    // Finalisasi Pengembalian (Status & Denda)
    static async finalizeReturn(id, status, denda, tglReal) {
        return db.query(
            "UPDATE peminjaman SET StatusPeminjaman = ?, Denda = ?, TanggalPengembalian = ? WHERE PeminjamanID = ?",
            [status, denda, tglReal, id]
        );
    }
}

module.exports = PeminjamanModel;