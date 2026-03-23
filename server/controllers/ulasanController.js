/**
 * Deskripsi File:
 * Controller ini menangani fitur Ulasan Buku.
 * Menggunakan UlasanModel.
 */

const UlasanModel = require('../models/ulasanModel');

// Menambahkan ulasan baru untuk buku
exports.addUlasan = async (req, res) => {
    const { bukuID, ulasan, rating } = req.body;
    const userID = req.user.id;

    if (!rating) return res.status(400).json({ message: "Rating wajib diisi!" });

    try {
        // Validasi bisa ditambahkan di sini atau di Model
        await UlasanModel.create(userID, bukuID, ulasan, rating);
        res.status(201).json({ message: "Ulasan berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mengambil semua ulasan berdasarkan ID buku
exports.getUlasanByBuku = async (req, res) => {
    try {
        const ulasan = await UlasanModel.findByBukuId(req.params.bukuID);
        res.json(ulasan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mengambil semua ulasan dari semua buku (untuk dashboard Admin)
exports.getAllUlasan = async (req, res) => {
    try {
        const ulasan = await UlasanModel.findAll();
        res.json(ulasan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Menghapus ulasan berdasarkan ID
exports.deleteUlasan = async (req, res) => {
    const { id } = req.params;
    try {
        await UlasanModel.delete(id);
        res.json({ message: "Ulasan berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};