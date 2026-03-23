const BukuModel = require('../models/bukuModel');
const fs = require('fs');
const path = require('path');

// Mengambil semua data buku dari database dengan Server-Side Pagination
exports.getAllBuku = async (req, res) => {
    try {
        // Ambil parameter dari frontend (default page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Eksekusi query data buku dan jumlah total secara paralel
        const [buku, totalData] = await Promise.all([
            BukuModel.findAll(limit, offset),
            BukuModel.countAll()
        ]);

        const totalPages = Math.ceil(totalData / limit);

        // Balikan Struktur JSON Pagination
        res.json({
            data: buku,
            pagination: {
                totalData,
                currentPage: page,
                totalPages,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mengambil detail buku berdasarkan ID
exports.getBukuById = async (req, res) => {
    try {
        const buku = await BukuModel.findById(req.params.id);
        if (!buku) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(buku);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Menambahkan buku baru peserta relasi kategorinya
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

// Memperbarui data buku dan mengganti gambar jika ada file baru
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

// Menghapus buku beserta file gambar fisiknya
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