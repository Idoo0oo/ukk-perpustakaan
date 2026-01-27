const db = require('../config/db');

// 1. Siswa Mengajukan Pinjaman (Status: Menunggu)
exports.pinjamBuku = async (req, res) => {
    const { bukuID, lamaPinjam } = req.body; // Ambil lamaPinjam dari input siswa
    const userID = req.user.id;
    const tanggalPeminjaman = new Date().toISOString().split('T')[0];

    // Validasi maksimal 14 hari
    if (lamaPinjam > 14) {
        return res.status(400).json({ message: "Maksimal peminjaman adalah 14 hari!" });
    }

    // Hitung Tanggal Pengembalian berdasarkan input siswa
    const tglPinjam = new Date();
    const tglKembali = new Date(tglPinjam);
    tglKembali.setDate(tglPinjam.getDate() + parseInt(lamaPinjam)); 
    const tanggalPengembalian = tglKembali.toISOString().split('T')[0];

    try {
        const [buku] = await db.query("SELECT Stok FROM buku WHERE BukuID = ?", [bukuID]);
        if (buku[0].Stok <= 0) return res.status(400).json({ message: "Stok buku habis!" });

        await db.query(
            "INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman) VALUES (?, ?, ?, ?, 'Menunggu')",
            [userID, bukuID, tanggalPeminjaman, tanggalPengembalian, 'Menunggu']
        );

        res.status(201).json({ message: "Permintaan sedang diproses! Silakan tunggu ACC Admin." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 2. Admin ACC Peminjaman (Stok Berkurang)
exports.accPeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        const [data] = await db.query("SELECT BukuID FROM peminjaman WHERE PeminjamanID = ?", [id]);
        if (data.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

        await db.query("UPDATE buku SET Stok = Stok - 1 WHERE BukuID = ?", [data[0].BukuID]);
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Dipinjam' WHERE PeminjamanID = ?", [id]);

        res.json({ message: "Peminjaman disetujui!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 3. Admin Tolak Peminjaman
exports.tolakPeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Ditolak' WHERE PeminjamanID = ?", [id]);
        res.json({ message: "Peminjaman ditolak." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 4. Ambil Semua Data Peminjaman
exports.getAllPeminjaman = async (req, res) => {
    const userID = req.user.id;
    const role = req.user.role;
    try {
        let query = `
            SELECT p.*, b.Judul as JudulBuku, u.NamaLengkap as NamaPeminjam
            FROM peminjaman p 
            JOIN buku b ON p.BukuID = b.BukuID 
            JOIN user u ON p.UserID = u.UserID
        `;
        if (role === 'peminjam') {
            const [rows] = await db.query(query + " WHERE p.UserID = ? ORDER BY p.PeminjamanID DESC", [userID]);
            return res.json(rows);
        }
        const [rows] = await db.query(query + " ORDER BY p.PeminjamanID DESC");
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// 5. Kembalikan Buku (Stok Bertambah Lagi)
exports.kembalikanBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const [data] = await db.query("SELECT BukuID FROM peminjaman WHERE PeminjamanID = ?", [id]);
        await db.query("UPDATE buku SET Stok = Stok + 1 WHERE BukuID = ?", [data[0].BukuID]);
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Dikembalikan' WHERE PeminjamanID = ?", [id]);
        res.json({ message: "Buku berhasil dikembalikan!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};