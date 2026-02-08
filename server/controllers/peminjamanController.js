/**
 * Deskripsi File:
 * Controller lengkap untuk peminjaman. Menangani logika request/response
 * dan memanggil Model untuk operasi database.
 */

const PeminjamanModel = require('../models/peminjamanModel');
const BukuModel = require('../models/bukuModel');

// Helper timezone
const getLocalDate = (date = new Date()) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};

// 1. Ajukan Peminjaman
exports.pinjamBuku = async (req, res) => {
    const { bukuID, lamaPinjam } = req.body;
    const userID = req.user.id;

    if (!lamaPinjam || lamaPinjam < 1 || lamaPinjam > 14) {
        return res.status(400).json({ message: "Lama pinjam harus 1-14 hari!" });
    }

    try {
        const stok = await BukuModel.getStok(bukuID);
        if (stok <= 0) return res.status(400).json({ message: "Stok buku habis!" });

        const tglPinjam = new Date();
        const tglKembali = new Date();
        tglKembali.setDate(tglPinjam.getDate() + parseInt(lamaPinjam));

        await PeminjamanModel.create(
            userID, 
            bukuID, 
            getLocalDate(tglPinjam), 
            getLocalDate(tglKembali)
        );

        res.status(201).json({ message: "Permintaan diajukan! Menunggu persetujuan Admin." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Admin Approve Peminjaman
exports.approvePeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        const pinjam = await PeminjamanModel.findById(id);
        if (!pinjam) return res.status(404).json({ message: "Data tidak ditemukan" });

        const stok = await BukuModel.getStok(pinjam.BukuID);
        if (stok <= 0) return res.status(400).json({ message: "Stok buku habis saat ini!" });

        // Hitung ulang durasi agar fair (dimulai hari ini)
        const oldStart = new Date(pinjam.TanggalPeminjaman);
        const oldEnd = new Date(pinjam.TanggalPengembalian);
        const durasiHari = Math.max(1, Math.ceil((oldEnd - oldStart) / (1000 * 3600 * 24)));

        const today = new Date();
        const newDeadline = new Date(today);
        newDeadline.setDate(today.getDate() + durasiHari);

        await PeminjamanModel.updateStatus(id, 'Dipinjam', getLocalDate(today), getLocalDate(newDeadline));
        await BukuModel.updateStok(pinjam.BukuID, -1); // Kurangi stok

        res.json({ message: "Peminjaman disetujui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Admin Reject Peminjaman
exports.rejectPeminjaman = async (req, res) => {
    const { id } = req.params;
    try {
        await PeminjamanModel.updateStatus(id, 'Ditolak');
        res.json({ message: "Peminjaman ditolak." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. User Ajukan Pengembalian
exports.ajukanPengembalian = async (req, res) => {
    const { id } = req.params;
    try {
        const pinjam = await PeminjamanModel.findById(id);
        if (!pinjam) return res.status(404).json({ message: "Data tidak ditemukan" });
        if (pinjam.StatusPeminjaman !== 'Dipinjam') return res.status(400).json({ message: "Buku tidak sedang dipinjam!" });

        await PeminjamanModel.updateStatus(id, 'Menunggu Pengembalian');
        res.json({ message: "Pengajuan berhasil! Segera serahkan buku ke petugas." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Admin Konfirmasi Pengembalian (Cek Denda)
exports.kembalikanBuku = async (req, res) => {
    const { id } = req.params;
    const DENDA_PER_HARI = 1000;

    try {
        const pinjam = await PeminjamanModel.findById(id);
        if (!pinjam) return res.status(404).json({ message: "Data tidak ditemukan" });

        const tglJatuhTempo = new Date(pinjam.TanggalPengembalian);
        const tglDikembalikan = new Date();
        tglJatuhTempo.setHours(0,0,0,0);
        tglDikembalikan.setHours(0,0,0,0);

        let denda = 0;
        let terlambat = 0;

        if (tglDikembalikan > tglJatuhTempo) {
            terlambat = Math.ceil((tglDikembalikan - tglJatuhTempo) / (1000 * 3600 * 24));
            denda = terlambat * DENDA_PER_HARI;
        }

        await PeminjamanModel.finalizeReturn(id, 'Dikembalikan', denda, getLocalDate(tglDikembalikan));
        await BukuModel.updateStok(pinjam.BukuID, 1); // Tambah stok kembali

        res.json({ message: "Buku dikembalikan.", denda, terlambat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Get All (Untuk User biasa lihat pinjaman sendiri, atau base query)
exports.getAllPeminjaman = async (req, res) => {
    try {
        const userID = (req.user.role === 'admin' || req.user.role === 'petugas') ? null : req.user.id;
        const data = await PeminjamanModel.findAll(userID);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Get Pending Approval (Khusus Admin)
exports.getPeminjamanPending = async (req, res) => {
    try {
        const data = await PeminjamanModel.findPending();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 8. Get Return Requests (Khusus Admin)
exports.getPengembalianPending = async (req, res) => {
    try {
        const data = await PeminjamanModel.findReturnRequests();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 9. Get History (Khusus Admin)
exports.getAllHistory = async (req, res) => {
    try {
        const data = await PeminjamanModel.findAllHistory();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};