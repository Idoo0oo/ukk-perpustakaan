const db = require('../config/db');

exports.getLaporanPeminjaman = async (req, res) => {
    try {
        // Kita JOIN 3 tabel: peminjaman, user, dan buku
        const query = `
            SELECT 
                p.PeminjamanID,
                u.NamaLengkap,
                b.Judul,
                p.TanggalPeminjaman,
                p.TanggalPengembalian,
                p.StatusPeminjaman
            FROM peminjaman p
            JOIN user u ON p.UserID = u.UserID
            JOIN buku b ON p.BukuID = b.BukuID
            ORDER BY p.TanggalPeminjaman DESC
        `;

        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};