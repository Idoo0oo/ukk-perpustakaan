const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. Ambil Semua Buku
exports.getAllBuku = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT buku.*, kategoribuku.NamaKategori 
            FROM buku 
            LEFT JOIN kategoribuku ON buku.KategoriID = kategoribuku.KategoriID
            ORDER BY buku.BukuID DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ambil Buku Berdasarkan ID
exports.getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT buku.*, kategoribuku.NamaKategori 
            FROM buku 
            LEFT JOIN kategoribuku ON buku.KategoriID = kategoribuku.KategoriID
            WHERE buku.BukuID = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Tambah Buku Baru (Bersih & Aman)
exports.createBuku = async (req, res) => {
    try {
        const { judul, penulis, penerbit, tahunTerbit, stok, kategoriId } = req.body;
        const gambar = req.file ? req.file.filename : null;

        // Validasi field wajib
        if (!judul || !penulis || !penerbit || !tahunTerbit || !stok) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        // Sanitasi KategoriID (ubah string kosong/'null' jadi null beneran)
        const safeKategoriId = (kategoriId && kategoriId !== 'null' && kategoriId !== '') ? kategoriId : null;

        await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit, KategoriID, Stok, Gambar) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit, safeKategoriId, stok, gambar]
        );
        
        res.status(201).json({ message: "Buku berhasil ditambahkan!" });

    } catch (error) {
        console.error(error); // Hanya log error sistem jika terjadi crash
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Buku (Bersih & Aman)
exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, penerbit, tahunTerbit, stok, kategoriId } = req.body;
    
    try {
        const [oldBook] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (oldBook.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });

        let query = "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=?, Stok=?, KategoriID=?";
        const safeKategoriId = (kategoriId && kategoriId !== 'null' && kategoriId !== '') ? kategoriId : null;
        
        let params = [judul, penulis, penerbit, tahunTerbit, stok, safeKategoriId];

        if (req.file) {
            query += ", Gambar=?";
            params.push(req.file.filename);
            
            // Hapus gambar lama jika ada
            if (oldBook[0].Gambar) {
                const oldPath = path.join(__dirname, '../uploads', oldBook[0].Gambar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        query += " WHERE BukuID=?";
        params.push(id);

        await db.query(query, params);
        res.json({ message: "Data buku berhasil diperbarui!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// 5. Hapus Buku
exports.deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const [book] = await db.query("SELECT Gambar FROM buku WHERE BukuID = ?", [id]);
        
        if (book.length > 0 && book[0].Gambar) {
            const filePath = path.join(__dirname, '../uploads', book[0].Gambar);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await db.query("DELETE FROM buku WHERE BukuID = ?", [id]);
        res.json({ message: "Buku berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus buku (mungkin sedang dipinjam)." });
    }
};