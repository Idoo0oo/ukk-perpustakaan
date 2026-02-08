/**
 * Deskripsi File:
 * File ini bertanggung jawab untuk generate laporan peminjaman berdasarkan rentang tanggal.
 */

const db = require('../config/db');

exports.getLaporanPeminjaman = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Tanggal awal dan akhir harus diisi!" });
        }

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
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};