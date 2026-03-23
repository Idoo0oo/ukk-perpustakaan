/**
 * Deskripsi File:
 * Controller untuk mengambil data publik pada Landing Page (Statistik, Buku Populer, Kategori)
 */

const db = require('../config/db');

exports.getLandingData = async (req, res) => {
    try {
        // 1. STATS
        const [totalBuku] = await db.query("SELECT COUNT(*) AS total FROM buku");
        const [totalPeminjam] = await db.query("SELECT COUNT(*) AS total FROM user WHERE Role = 'Peminjam' AND Status = 'Aktif'");
        const [totalPeminjaman] = await db.query("SELECT COUNT(*) AS total FROM peminjaman");

        // 2. BUKU POPULER (4 buku yang paling sering dipinjam)
        const popularBooksQuery = `
            SELECT b.BukuID, b.Judul, b.Penulis, b.Gambar, COUNT(p.PeminjamanID) as total_pinjam
            FROM buku b
            LEFT JOIN peminjaman p ON b.BukuID = p.BukuID
            GROUP BY b.BukuID
            ORDER BY total_pinjam DESC
            LIMIT 4
        `;
        const [popularBooks] = await db.query(popularBooksQuery);

        // 3. KATEGORI (Top 4 Kategori dengan jumlah buku terbanyak)
        const categoryQuery = `
            SELECT k.KategoriID, k.NamaKategori, COUNT(kr.BukuID) as total_buku
            FROM kategoribuku k
            LEFT JOIN kategoribuku_relasi kr ON k.KategoriID = kr.KategoriID
            GROUP BY k.KategoriID
            ORDER BY total_buku DESC
            LIMIT 4
        `;
        const [categories] = await db.query(categoryQuery);

        res.json({
            stats: {
                totalBuku: totalBuku[0].total,
                totalPeminjam: totalPeminjam[0].total,
                totalPeminjaman: totalPeminjaman[0].total,
                ratingApps: "4.9/5.0" // Hardcoded since we don't have an app rating table
            },
            popularBooks: popularBooks.map(b => ({
                id: b.BukuID,
                title: b.Judul,
                author: b.Penulis,
                img: b.Gambar ? `http://localhost:5000/uploads/${b.Gambar}` : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
                borrows: b.total_pinjam,
                rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1) // Simulate high rating for popular books
            })),
            categories: categories.map(c => ({
                id: c.KategoriID,
                title: c.NamaKategori,
                count: `${c.total_buku} Buku`
            }))
        });
    } catch (error) {
        console.error("Error getLandingData:", error);
        res.status(500).json({ error: "Gagal memuat data landing page" });
    }
};
