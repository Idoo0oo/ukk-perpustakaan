const db = require('../config/db');

// --- FITUR KOLEKSI PRIBADI (BOOKMARK) ---

// 1. Tambah/Hapus Koleksi (Toggle)
// Kalau belum ada -> Disimpan. Kalau sudah ada -> Dihapus.
exports.toggleKoleksi = async (req, res) => {
    const { bukuID } = req.body;
    const userID = req.user.id;

    try {
        // Cek apakah user sudah menyimpan buku ini?
        const [cek] = await db.query("SELECT * FROM koleksipribadi WHERE UserID = ? AND BukuID = ?", [userID, bukuID]);

        if (cek.length > 0) {
            // Jika sudah ada -> Hapus (Unsave)
            await db.query("DELETE FROM koleksipribadi WHERE KoleksiID = ?", [cek[0].KoleksiID]);
            return res.json({ message: "Buku dihapus dari koleksi", isSaved: false });
        } else {
            // Jika belum ada -> Tambah (Save)
            await db.query("INSERT INTO koleksipribadi (UserID, BukuID) VALUES (?, ?)", [userID, bukuID]);
            return res.json({ message: "Buku disimpan ke koleksi", isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ambil Daftar Koleksi Saya
exports.getKoleksi = async (req, res) => {
    const userID = req.user.id;
    try {
        const query = `
            SELECT k.KoleksiID, b.*, kb.NamaKategori 
            FROM koleksipribadi k
            JOIN buku b ON k.BukuID = b.BukuID
            LEFT JOIN kategoribuku kb ON b.KategoriID = kb.KategoriID
            WHERE k.UserID = ?
            ORDER BY k.KoleksiID DESC
        `;
        const [rows] = await db.query(query, [userID]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- FITUR ULASAN BUKU ---

// 3. Kirim Ulasan
exports.addUlasan = async (req, res) => {
    const { bukuID, rating, ulasan } = req.body;
    const userID = req.user.id;

    try {
        // Validasi: User WAJIB pernah meminjam & sudah mengembalikan buku tersebut
        const [history] = await db.query(`
            SELECT * FROM peminjaman 
            WHERE UserID = ? AND BukuID = ? AND StatusPeminjaman = 'Dikembalikan'
        `, [userID, bukuID]);

        if (history.length === 0) {
            return res.status(403).json({ message: "Eits! Kamu harus baca (pinjam & kembalikan) buku ini dulu sebelum memberi ulasan." });
        }

        // Cek apakah user sudah pernah mengulas buku ini sebelumnya? (Opsional, biar gak spam)
        const [existingReview] = await db.query("SELECT * FROM ulasanbuku WHERE UserID = ? AND BukuID = ?", [userID, bukuID]);
        if (existingReview.length > 0) {
            return res.status(400).json({ message: "Kamu sudah memberikan ulasan untuk buku ini." });
        }

        // Simpan Ulasan
        await db.query(
            "INSERT INTO ulasanbuku (UserID, BukuID, Rating, Ulasan) VALUES (?, ?, ?, ?)",
            [userID, bukuID, rating, ulasan]
        );

        res.json({ message: "Terima kasih! Ulasanmu berhasil dikirim." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Ambil Semua Ulasan di Suatu Buku (Untuk ditampilkan di Detail Buku nanti)
exports.getUlasanByBuku = async (req, res) => {
    const { bukuID } = req.params;
    try {
        const query = `
            SELECT u.NamaLengkap, ub.Rating, ub.Ulasan, ub.TanggalUlasan
            FROM ulasanbuku ub
            JOIN user u ON ub.UserID = u.UserID
            WHERE ub.BukuID = ?
            ORDER BY ub.TanggalUlasan DESC
        `;
        const [rows] = await db.query(query, [bukuID]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUlasan = async (req, res) => {
    try {
        const query = `
            SELECT ub.UlasanID, ub.Rating, ub.Ulasan, ub.TanggalUlasan,
                   u.NamaLengkap, b.Judul, b.Gambar
            FROM ulasanbuku ub
            JOIN user u ON ub.UserID = u.UserID
            JOIN buku b ON ub.BukuID = b.BukuID
            ORDER BY ub.TanggalUlasan DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUlasan = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM ulasanbuku WHERE UlasanID = ?", [id]);
        res.json({ message: "Ulasan berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};