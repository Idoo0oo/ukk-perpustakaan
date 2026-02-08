const BukuModel = require('../models/bukuModel');
const fs = require('fs');
const path = require('path');

exports.getAllBuku = async (req, res) => {
    try {
        const buku = await BukuModel.findAll();
        res.json(buku);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBukuById = async (req, res) => {
    try {
        const buku = await BukuModel.findById(req.params.id);
        if (!buku) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(buku);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBuku = async (req, res) => {
    try {
        const { judul, penulis, penerbit, tahunTerbit, stok, kategoriIds } = req.body;
        const gambar = req.file ? req.file.filename : null;

        if (!judul || !stok) return res.status(400).json({ message: "Data wajib diisi!" });

        const parsedKategori = kategoriIds ? JSON.parse(kategoriIds) : [];
        
        await BukuModel.create(
            { judul, penulis, penerbit, tahunTerbit, stok, gambar },
            parsedKategori
        );

        res.status(201).json({ message: "Buku berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const oldBook = await BukuModel.findById(id);
        if (!oldBook) return res.status(404).json({ message: "Buku tidak ditemukan" });

        // Handle Gambar Lama
        if (req.file && oldBook.Gambar) {
            const oldPath = path.join(__dirname, '../uploads', oldBook.Gambar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const gambar = req.file ? req.file.filename : null;
        const parsedKategori = req.body.kategoriIds ? JSON.parse(req.body.kategoriIds) : null;

        await BukuModel.update(
            id,
            { ...req.body, gambar }, // Spread body, override gambar jika ada
            parsedKategori
        );

        res.json({ message: "Data buku berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBuku = async (req, res) => {
    try {
        const book = await BukuModel.findById(req.params.id);
        if (book && book.Gambar) {
            const filePath = path.join(__dirname, '../uploads', book.Gambar);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await BukuModel.delete(req.params.id);
        res.json({ message: "Buku berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus buku (sedang dipinjam)." });
    }
};