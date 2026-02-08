/**
 * Deskripsi File:
 * Controller ini HANYA menangani fitur Koleksi Pribadi (Bookmark).
 * Menggunakan KoleksiModel untuk akses database.
 */

const KoleksiModel = require('../models/koleksiModel');

// 1. Toggle Koleksi (Tambah/Hapus)
exports.toggleKoleksi = async (req, res) => {
    const { bukuID } = req.body;
    const userID = req.user.id;

    try {
        const isExist = await KoleksiModel.checkStatus(userID, bukuID);
        
        if (isExist) {
            await KoleksiModel.remove(userID, bukuID);
            return res.json({ message: "Dihapus dari koleksi", isSaved: false });
        } else {
            await KoleksiModel.add(userID, bukuID);
            return res.status(201).json({ message: "Ditambahkan ke koleksi", isSaved: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ambil Daftar Koleksi Saya
// Perhatikan nama fungsinya: getKoleksiSaya
exports.getKoleksiSaya = async (req, res) => {
    try { 
        const koleksi = await KoleksiModel.findByUser(req.user.id);
        res.json(koleksi);
    } catch (error) {
        console.error("ERROR KOLEKSI:", error); // <--- INI PENTING BIAR MUNCUL DI TERMINAL
        res.status(500).json({ error: error.message });
    }
};

// 3. Cek Status Koleksi (Untuk UI tombol bookmark)
exports.checkKoleksiStatus = async (req, res) => {
    try {
        const isSaved = await KoleksiModel.checkStatus(req.user.id, req.params.bukuID);
        res.json({ isSaved });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};