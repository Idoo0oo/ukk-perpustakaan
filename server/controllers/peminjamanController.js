const db = require('../config/db');

// --- HELPER: AMBIL TANGGAL LOKAL (WIB/Server Time) ---
// Supaya tidak mundur 1 hari gara-gara UTC
const getLocalDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
};

// ==========================================
// 1. SISWA: Mengajukan Peminjaman
// ==========================================
exports.pinjamBuku = async (req, res) => {
    const { bukuID, lamaPinjam } = req.body; 
    const userID = req.user.id;
    
    // Validasi input (PENTING: Cegah minus atau 0)
    if (!lamaPinjam || parseInt(lamaPinjam) < 1) {
        return res.status(400).json({ message: "Lama pinjam minimal 1 hari!" });
    }
    if (parseInt(lamaPinjam) > 14) {
        return res.status(400).json({ message: "Maksimal peminjaman adalah 14 hari!" });
    }

    // HITUNG TANGGAL (Pakai Local Time)
    const tglPinjam = new Date();
    const tglKembali = new Date(tglPinjam);
    tglKembali.setDate(tglPinjam.getDate() + parseInt(lamaPinjam)); 

    // Konversi ke String YYYY-MM-DD (Tanpa UTC shift)
    const tanggalPeminjaman = getLocalDate(tglPinjam);
    const tanggalPengembalian = getLocalDate(tglKembali);

    try {
        const [buku] = await db.query("SELECT Stok FROM buku WHERE BukuID = ?", [bukuID]);
        if (!buku.length || buku[0].Stok <= 0) return res.status(400).json({ message: "Stok buku habis!" });

        await db.query(
            "INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman) VALUES (?, ?, ?, ?, 'Menunggu')",
            [userID, bukuID, tanggalPeminjaman, tanggalPengembalian]
        );

        res.status(201).json({ message: "Permintaan diajukan! Tanggal akan dimulai saat Admin menyetujui." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==========================================
// 2. ADMIN: Menyetujui Peminjaman (FIX TIMEZONE)
// ==========================================
exports.approvePeminjaman = async (req, res) => {
    const { id } = req.params;
    
    try {
        // 1. Ambil data draft
        const [draft] = await db.query("SELECT * FROM peminjaman WHERE PeminjamanID = ?", [id]);
        if (draft.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        
        const data = draft[0];

        // 2. Cek Stok
        const [buku] = await db.query("SELECT Stok FROM buku WHERE BukuID = ?", [data.BukuID]);
        if (buku[0].Stok <= 0) return res.status(400).json({ message: "Stok buku habis saat ini!" });

        // 3. LOGIKA RESET TANGGAL (FIX DURASI & TIMEZONE)
        const oldStart = new Date(data.TanggalPeminjaman);
        const oldEnd = new Date(data.TanggalPengembalian);
        
        // Hitung selisih hari (Pastikan minimal 1 hari)
        const diffTime = Math.abs(oldEnd - oldStart);
        let durasiHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (durasiHari < 1) durasiHari = 1; // Jaga-jaga error durasi 0

        // Set Tanggal BARU (Mulai Hari Ini)
        const today = new Date();
        const newDeadline = new Date(today);
        newDeadline.setDate(today.getDate() + durasiHari);

        // Konversi pakai helper getLocalDate
        const realStart = getLocalDate(today);
        const realEnd = getLocalDate(newDeadline);

        // 4. Update Database
        await db.query(
            "UPDATE peminjaman SET TanggalPeminjaman = ?, TanggalPengembalian = ?, StatusPeminjaman = 'Dipinjam' WHERE PeminjamanID = ?", 
            [realStart, realEnd, id]
        );
        await db.query("UPDATE buku SET Stok = Stok - 1 WHERE BukuID = ?", [data.BukuID]);

        res.json({ message: "Peminjaman disetujui! Tanggal mulai berjalan hari ini." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==========================================
// 3. ADMIN: Tolak Peminjaman
// ==========================================
exports.rejectPeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Ditolak' WHERE PeminjamanID = ?", [id]);
        res.json({ message: "Peminjaman ditolak." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==========================================
// 4. ADMIN: Konfirmasi Pengembalian (FIX DENDA)
// ==========================================
exports.kembalikanBuku = async (req, res) => {
    const { id } = req.params;
    const DENDA_PER_HARI = 1000; 

    try {
        const [data] = await db.query("SELECT * FROM peminjaman WHERE PeminjamanID = ?", [id]);
        if (data.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        
        const pinjam = data[0];
        
        // 1. Hitung Denda
        const tglJatuhTempo = new Date(pinjam.TanggalPengembalian);
        const tglDikembalikan = new Date(); // Hari ini
        
        // Reset jam ke 00:00:00 agar hitungan murni hari
        tglJatuhTempo.setHours(0,0,0,0);
        tglDikembalikan.setHours(0,0,0,0);

        let totalDenda = 0;
        let terlambatHari = 0;

        if (tglDikembalikan > tglJatuhTempo) {
            const selisihWaktu = tglDikembalikan - tglJatuhTempo;
            terlambatHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
            totalDenda = terlambatHari * DENDA_PER_HARI;
        }

        // 2. Ambil Tanggal Realisasi (Local Time) untuk History
        const tglRealDB = getLocalDate(new Date());

        // 3. Update DB
        await db.query(
            "UPDATE peminjaman SET StatusPeminjaman = 'Dikembalikan', Denda = ?, TanggalPengembalian = ? WHERE PeminjamanID = ?", 
            [totalDenda, tglRealDB, id]
        );

        // 4. Kembalikan Stok
        await db.query("UPDATE buku SET Stok = Stok + 1 WHERE BukuID = ?", [pinjam.BukuID]);

        res.json({ 
            message: "Buku berhasil dikembalikan.", 
            denda: totalDenda, 
            terlambat: terlambatHari 
        });

    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==========================================
// 5. SISWA: Ajukan Pengembalian
// ==========================================
exports.ajukanPengembalian = async (req, res) => {
    const { id } = req.params;
    try {
        const [cek] = await db.query("SELECT StatusPeminjaman FROM peminjaman WHERE PeminjamanID = ?", [id]);
        
        if (cek.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (cek[0].StatusPeminjaman !== 'Dipinjam') return res.status(400).json({ message: "Buku tidak sedang dipinjam!" });

        await db.query("UPDATE peminjaman SET StatusPeminjaman = 'Menunggu Pengembalian' WHERE PeminjamanID = ?", [id]);
        
        res.json({ message: "Pengajuan berhasil! Segera serahkan buku ke petugas." });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// ==========================================
// GETTERS
// ==========================================
exports.getAllPeminjaman = async (req, res) => {
    try {
        let query = `
            SELECT 
                p.PeminjamanID, p.UserID, p.BukuID,
                p.TanggalPeminjaman, p.TanggalPengembalian, p.StatusPeminjaman, p.Denda,
                b.Judul AS JudulBuku, b.Judul,
                u.NamaLengkap AS NamaPeminjam,
                (SELECT COUNT(*) FROM ulasanbuku ub WHERE ub.UserID = p.UserID AND ub.BukuID = p.BukuID) AS SudahDiulas
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
        `;
        
        const params = [];
        if (req.user.role !== 'admin' && req.user.role !== 'petugas') {
            query += " WHERE p.UserID = ?";
            params.push(req.user.id);
        }

        query += " ORDER BY p.PeminjamanID DESC";

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getPeminjamanPending = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, p.TanggalPeminjaman, p.StatusPeminjaman,
                b.Judul AS JudulBuku, b.Penulis, u.NamaLengkap AS NamaPeminjam
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            WHERE p.StatusPeminjaman = 'Menunggu'
            ORDER BY p.TanggalPeminjaman ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getPengembalianPending = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, p.TanggalPeminjaman, p.TanggalPengembalian,
                b.Judul AS JudulBuku, u.NamaLengkap AS NamaPeminjam
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            WHERE p.StatusPeminjaman = 'Menunggu Pengembalian'
            ORDER BY p.TanggalPengembalian ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getAllHistory = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PeminjamanID, p.TanggalPeminjaman, p.TanggalPengembalian, p.StatusPeminjaman,
                b.Judul AS JudulBuku, u.NamaLengkap AS NamaPeminjam, u.Username
            FROM peminjaman p
            JOIN buku b ON p.BukuID = b.BukuID
            JOIN user u ON p.UserID = u.UserID
            ORDER BY p.TanggalPeminjaman DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: error.message }); }
};