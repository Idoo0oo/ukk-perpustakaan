const db = require('../config/db');

// Ambil semua buku
exports.getAllBuku = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM buku");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tambah Buku Baru
exports.addBuku = async (req, res) => {
    const { judul, penulis, penerbit, tahunTerbit } = req.body;
    try {
        await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit) VALUES (?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit]
        );
        res.status(201).json({ message: "Buku berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Buku
exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, penerbit, tahunTerbit } = req.body;
    try {
        await db.query(
            "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=? WHERE BukuID=?",
            [judul, penulis, penerbit, tahunTerbit, id]
        );
        res.json({ message: "Data buku berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hapus Buku
exports.deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM buku WHERE BukuID=?", [id]);
        res.json({ message: "Buku berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};