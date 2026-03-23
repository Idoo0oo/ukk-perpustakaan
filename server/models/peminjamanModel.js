/**
 * Deskripsi File:
 * Model lengkap untuk transaksi peminjaman.
 */

const db = require('../config/db');

class PeminjamanModel {
    // Membuat transaksi peminjaman buku baru
    static async create(userID, bukuID, tglPinjam, tglKembali) {
        const [result] = await db.query(
            "INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman) VALUES (?, ?, ?, ?, 'Menunggu')",
            [userID, bukuID, tglPinjam, tglKembali]
        );
        return result.insertId;
    }

    // Mencari data transaksi peminjaman berdasarkan ID
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
                b.Judul AS JudulBuku, b.Judul, b.Penulis, b.Gambar,
                u.NamaLengkap AS NamaPeminjam, u.Username,
                (SELECT COUNT(*) FROM ulasanbuku ub WHERE ub.UserID = p.UserID AND ub.BukuID = p.BukuID) AS SudahDiulas
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            ${whereClause}
            ORDER BY p.TanggalPeminjaman DESC
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
        return this._baseQuery("WHERE p.StatusPeminjaman IN ('Dikembalikan', 'Ditolak')");
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

    // [NEW] Fitur ACID Transaction: Admin Approve Peminjaman
    static async approveTransaction(peminjamanID, bukuID, status, tglPinjam, tglKembali) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            
            await conn.query(
                "UPDATE peminjaman SET StatusPeminjaman = ?, TanggalPeminjaman = ?, TanggalPengembalian = ? WHERE PeminjamanID = ?",
                [status, tglPinjam, tglKembali, peminjamanID]
            );
            
            await conn.query("UPDATE buku SET Stok = Stok - 1 WHERE BukuID = ?", [bukuID]);
            
            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    // [NEW] Fitur ACID Transaction: Finalisasi Pengembalian
    static async returnTransaction(peminjamanID, bukuID, status, denda, tglReal) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            
            await conn.query(
                "UPDATE peminjaman SET StatusPeminjaman = ?, Denda = ?, TanggalPengembalian = ? WHERE PeminjamanID = ?",
                [status, denda, tglReal, peminjamanID]
            );
            
            await conn.query("UPDATE buku SET Stok = Stok + 1 WHERE BukuID = ?", [bukuID]);
            
            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    // Ambil buku yang paling sering dipinjam dalam 7 hari terakhir
    static async findMostBorrowedThisWeek() {
        const query = `
            SELECT 
                b.BukuID, b.Judul, b.Penulis, b.Gambar,
                GROUP_CONCAT(DISTINCT k.NamaKategori SEPARATOR ', ') AS NamaKategori,
                COUNT(DISTINCT p.PeminjamanID) AS JumlahPinjam
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
            LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
            WHERE p.TanggalPeminjaman >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY b.BukuID, b.Judul, b.Penulis, b.Gambar
            ORDER BY JumlahPinjam DESC
            LIMIT 1
        `;
        const [rows] = await db.query(query);
        return rows[0] || null;
    }
}

module.exports = PeminjamanModel;