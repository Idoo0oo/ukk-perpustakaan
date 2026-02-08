/**
 * Deskripsi File:
 * Controller ini menangani fitur Ulasan Buku.
 * Menggunakan UlasanModel.
 */

const UlasanModel = require('../models/ulasanModel');

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

exports.getUlasanByBuku = async (req, res) => {
    try {
        const ulasan = await UlasanModel.findByBukuId(req.params.bukuID);
        res.json(ulasan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUlasan = async (req, res) => {
    try {
        const ulasan = await UlasanModel.findAll();
        res.json(ulasan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUlasan = async (req, res) => {
    const { id } = req.params;
    try {
        await UlasanModel.delete(id);
        res.json({ message: "Ulasan berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};