const db = require('../config/db');

// 1. Prosedur Meminjam Buku
exports.pinjamBuku = async (req, res) => {
    const { bukuID } = req.body;
    const userID = req.user.id; // Diambil dari token JWT via middleware
    const tanggalPeminjaman = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    try {
        // Cek apakah buku sedang dipinjam oleh user ini dan belum dikembalikan
        const [existing] = await db.query(
            "SELECT * FROM peminjaman WHERE UserID = ? AND BukuID = ? AND StatusPeminjaman = 'Dipinjam'",
            [userID, bukuID]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Anda masih meminjam buku ini!" });
        }

        await db.query(
            "INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, StatusPeminjaman) VALUES (?, ?, ?, 'Dipinjam')",
            [userID, bukuID, tanggalPeminjaman]
        );

        res.status(201).json({ message: "Buku berhasil dipinjam!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Melihat Daftar Pinjaman (Untuk Siswa atau Admin)
exports.getAllPeminjaman = async (req, res) => {
    const userID = req.user.id;
    const role = req.user.role;

    try {
        let query = `
            SELECT p.*, b.Judul, u.NamaLengkap 
            FROM peminjaman p 
            JOIN buku b ON p.BukuID = b.BukuID 
            JOIN user u ON p.UserID = u.UserID
        `;
        
        // Jika yang akses adalah 'peminjam', hanya tampilkan milik dia sendiri
        if (role === 'peminjam') {
            query += " WHERE p.UserID = ?";
            const [rows] = await db.query(query, [userID]);
            return res.json(rows);
        }

        // Jika admin/petugas, tampilkan semua
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Prosedur Pengembalian Buku
exports.kembalikanBuku = async (req, res) => {
    const { id } = req.params; // PeminjamanID
    const tanggalPengembalian = new Date().toISOString().split('T')[0];

    try {
        const [peminjaman] = await db.query("SELECT * FROM peminjaman WHERE PeminjamanID = ?", [id]);
        
        if (peminjaman.length === 0) {
            return res.status(404).json({ message: "Data peminjaman tidak ditemukan" });
        }

        await db.query(
            "UPDATE peminjaman SET TanggalPengembalian = ?, StatusPeminjaman = 'Dikembalikan' WHERE PeminjamanID = ?",
            [tanggalPengembalian, id]
        );

        res.json({ message: "Buku telah berhasil dikembalikan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};