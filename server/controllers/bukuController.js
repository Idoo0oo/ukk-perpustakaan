const db = require('../config/db');

// Ambil semua buku (Termasuk Stok)
exports.getAllBuku = async (req, res) => {
    try {
        const query = `
            SELECT 
                buku.*, 
                kategoribuku.NamaKategori 
            FROM buku 
            LEFT JOIN kategoribuku ON buku.KategoriID = kategoribuku.KategoriID
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tambah Buku Baru (Dengan Stok)
exports.addBuku = async (req, res) => {
    const { judul, penulis, penerbit, tahunTerbit, kategoriId, stok } = req.body;
    try {
        await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit, KategoriID, Stok) VALUES (?, ?, ?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit, kategoriId || null, stok || 0]
        );
        res.status(201).json({ message: "Buku berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Buku (Termasuk Stok)
exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, penerbit, tahunTerbit, kategoriId, stok } = req.body;
    try {
        await db.query(
            "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=?, KategoriID=?, Stok=? WHERE BukuID=?",
            [judul, penulis, penerbit, tahunTerbit, kategoriId || null, stok || 0, id]
        );
        res.json({ message: "Data buku dan stok berhasil diperbarui!" });
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