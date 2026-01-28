const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. Ambil Semua Buku (Termasuk Stok)
exports.getAllBuku = async (req, res) => {
    try {
        const query = `
            SELECT 
                buku.*, 
                kategoribuku.NamaKategori 
            FROM buku 
            LEFT JOIN kategoribuku ON buku.KategoriID = kategoribuku.KategoriID
            ORDER BY buku.BukuID DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ambil Satu Buku berdasarkan ID (Endpoint Baru untuk Detail/Edit)
exports.getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Tambah Buku Baru (Support Upload Gambar)
exports.createBuku = async (req, res) => {
    // Ambil data dari body
    const { judul, penulis, penerbit, tahunTerbit, stok, kategoriId } = req.body;
    // Ambil filename gambar jika ada upload
    const gambar = req.file ? req.file.filename : null;

    try {
        await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit, KategoriID, Stok, Gambar) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit, stok, kategoriId || null, gambar]
        );
        res.status(201).json({ message: "Buku berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Buku (Support Upload Gambar)
exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, penerbit, tahunTerbit, stok, kategoriId } = req.body;
    
    try {
        // Cek data lama dulu (untuk hapus gambar lama jika perlu - opsional)
        const [oldBook] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (oldBook.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });

        let query = "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=?, Stok=?, KategoriID=?";
        let params = [judul, penulis, penerbit, tahunTerbit, stok, kategoriId];

        // Jika ada upload gambar baru
        if (req.file) {
            query += ", Gambar=?";
            params.push(req.file.filename);
            
            // (Opsional) Hapus gambar lama dari folder uploads agar hemat storage
            // if (oldBook[0].Gambar) {
            //     const oldPath = path.join(__dirname, '../uploads', oldBook[0].Gambar);
            //     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            // }
        }

        query += " WHERE BukuID=?";
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Data buku berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Hapus Buku
exports.deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM buku WHERE BukuID=?", [id]);
        res.json({ message: "Buku berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};