const db = require('../config/db');

class LaporanModel {
    static async getPeminjamanByDateRange(startDate, endDate) {
        const query = `
            SELECT 
                p.PeminjamanID, 
                p.TanggalPeminjaman, 
                p.TanggalPengembalian, 
                p.StatusPeminjaman, 
                p.Denda,
                u.NamaLengkap AS NamaPeminjam,
                b.Judul AS JudulBuku
            FROM peminjaman p
            JOIN user u ON p.UserID = u.UserID
            JOIN buku b ON p.BukuID = b.BukuID
            WHERE p.TanggalPeminjaman BETWEEN ? AND ?
            ORDER BY p.TanggalPeminjaman ASC
        `;
        const [rows] = await db.query(query, [startDate, endDate]);
        return rows;
    }
}

module.exports = LaporanModel;