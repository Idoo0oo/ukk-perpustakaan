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
    try {
        let query = `
            SELECT 
                p.PeminjamanID, 
                p.UserID,
                p.BukuID,
                p.TanggalPeminjaman, 
                p.TanggalPengembalian, 
                p.StatusPeminjaman,
                p.Denda,
                b.Judul AS JudulBuku, 
                b.Judul,
                -- b.Gambar,  <-- SAYA KOMENTAR DULU BIAR GAK ERROR KALAU KOLOM GAK ADA
                u.NamaLengkap AS NamaPeminjam,
                -- Subquery Cek Ulasan
                (SELECT COUNT(*) FROM ulasanbuku ub WHERE ub.UserID = p.UserID AND ub.BukuID = p.BukuID) AS SudahDiulas
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
        `;
        
        const params = [];

        // Filter User Biasa
        if (req.user.role !== 'admin' && req.user.role !== 'petugas') {
            query += " WHERE p.UserID = ?";
            params.push(req.user.id);
        }

        query += " ORDER BY p.PeminjamanID DESC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        // Log Error ke Terminal Biar Kelihatan
        console.error("ERROR DATABASE:", error.message); 
        res.status(500).json({ error: error.message });
    }
};

exports.kembalikanBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const [data] = await db.query("SELECT BukuID FROM peminjaman WHERE PeminjamanID = ?", [id]);
        await db.query("UPDATE buku SET Stok = Stok + 1 WHERE BukuID = ?", [data[0].BukuID]);
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Dikembalikan' WHERE PeminjamanID = ?", [id]);
        res.json({ message: "Buku berhasil dikembalikan!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getPeminjamanPending = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, 
                p.TanggalPeminjaman, 
                p.StatusPeminjaman,
                b.Judul AS JudulBuku, 
                b.Penulis,
                u.NamaLengkap AS NamaPeminjam
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            WHERE p.StatusPeminjaman = 'Menunggu'
            ORDER BY p.TanggalPeminjaman ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approvePeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        // Cek stok dulu
        const [cek] = await db.query("SELECT b.Stok, p.BukuID FROM peminjaman p JOIN buku b ON p.BukuID = b.BukuID WHERE p.PeminjamanID = ?", [id]);
        
        if (cek.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (cek[0].Stok <= 0) return res.status(400).json({ message: "Stok buku habis!" });

        // Kurangi stok dan ubah status
        await db.query("UPDATE buku SET Stok = Stok - 1 WHERE BukuID = ?", [cek[0].BukuID]);
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Dipinjam' WHERE PeminjamanID = ?", [id]);

        res.json({ message: "Peminjaman disetujui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectPeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Ditolak' WHERE PeminjamanID = ?", [id]);
        res.json({ message: "Peminjaman ditolak." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.ajukanPengembalian = async (req, res) => {
    const { id } = req.params;
    try {
        // Cek dulu apakah statusnya memang 'Dipinjam'
        const [cek] = await db.query("SELECT StatusPeminjaman FROM peminjaman WHERE PeminjamanID = ?", [id]);
        
        if (cek.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (cek[0].StatusPeminjaman !== 'Dipinjam') return res.status(400).json({ message: "Buku tidak sedang dipinjam!" });

        // Ubah status jadi 'Menunggu Pengembalian'
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Menunggu Pengembalian' WHERE PeminjamanID = ?", [id]);
        
        res.json({ message: "Pengajuan berhasil! Segera serahkan buku ke petugas." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPengembalianPending = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, 
                p.TanggalPeminjaman, 
                p.TanggalPengembalian,
                b.Judul AS JudulBuku, 
                u.NamaLengkap AS NamaPeminjam
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            WHERE p.StatusPeminjaman = 'Menunggu Pengembalian'
            ORDER BY p.TanggalPengembalian ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllHistory = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, 
                p.TanggalPeminjaman, 
                p.TanggalPengembalian, 
                p.StatusPeminjaman,
                b.Judul AS JudulBuku, 
                u.NamaLengkap AS NamaPeminjam,
                u.Username
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            ORDER BY p.TanggalPeminjaman DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};