/**
 * Deskripsi File:
 * Model untuk fitur Ulasan Buku.
 * Perbaikan: Menambahkan kolom 'b.Gambar' dan 'us.NamaLengkap' di query SELECT.
 */

const db = require('../config/db');

class UlasanModel {
    static async create(userID, bukuID, ulasan, rating) {
        return db.query(
            "INSERT INTO ulasanbuku (UserID, BukuID, Ulasan, Rating) VALUES (?, ?, ?, ?)",
            [userID, bukuID, ulasan, rating]
        );
    }

    // Ambil ulasan per buku (Public/User)
    static async findByBukuId(bukuID) {
        // PERBAIKAN: Tambahkan b.Gambar dan us.NamaLengkap
        const query = `
            SELECT u.*, us.Username, us.NamaLengkap, b.Gambar 
            FROM ulasanbuku u 
            JOIN user us ON u.UserID = us.UserID 
            JOIN buku b ON u.BukuID = b.BukuID
            WHERE u.BukuID = ?
            ORDER BY u.TanggalUlasan DESC
        `;
        const [rows] = await db.query(query, [bukuID]);
        return rows;
    }

    // Ambil SEMUA ulasan (Untuk Admin Dashboard)
    static async findAll() {
        // PERBAIKAN: Tambahkan b.Gambar dan us.NamaLengkap
        const query = `
            SELECT u.*, b.Judul, b.Gambar, us.Username, us.NamaLengkap
            FROM ulasanbuku u
            JOIN buku b ON u.BukuID = b.BukuID
            JOIN user us ON u.UserID = us.UserID
            ORDER BY u.TanggalUlasan DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async delete(id) {
        return db.query("DELETE FROM ulasanbuku WHERE UlasanID = ?", [id]);
    }
}

module.exports = UlasanModel;