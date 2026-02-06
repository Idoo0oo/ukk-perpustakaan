const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. Ambil Semua Buku (Support Multi Kategori Tampil)
exports.getAllBuku = async (req, res) => {
    try {
        // Kita pakai GROUP_CONCAT untuk menggabungkan nama kategori jadi satu string (misal: "Novel, Fiksi")
        const query = `
            SELECT b.*, 
            GROUP_CONCAT(k.NamaKategori SEPARATOR ', ') AS NamaKategori
            FROM buku b
            LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
            LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
            GROUP BY b.BukuID
            ORDER BY b.BukuID DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Ambil Buku Berdasarkan ID (Untuk Edit)
exports.getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        // Ambil Data Buku
        const [buku] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (buku.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });

        // Ambil Daftar ID Kategori yang dipilih (Untuk pre-fill checkbox nanti)
        const [kategori] = await db.query("SELECT KategoriID FROM kategoribuku_relasi WHERE BukuID = ?", [id]);
        
        // Return format: Data buku + Array ID Kategori
        const result = {
            ...buku[0],
            KategoriIDs: kategori.map(k => k.KategoriID) // Contoh: [1, 3, 5]
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Tambah Buku Baru (Support Multi Kategori)
exports.createBuku = async (req, res) => {
    try {
        const { judul, penulis, penerbit, tahunTerbit, stok, kategoriIds } = req.body;
        const gambar = req.file ? req.file.filename : null;

        if (!judul || !penulis || !penerbit || !tahunTerbit || !stok) {
            return res.status(400).json({ message: "Field wajib diisi!" });
        }

        // 1. Insert ke Tabel Buku Dulu
        const [result] = await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit, Stok, Gambar) VALUES (?, ?, ?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit, stok, gambar]
        );
        
        const newBukuID = result.insertId;

        // 2. Insert ke Tabel Relasi (Looping Array Kategori)
        if (kategoriIds) {
            // Karena dari FormData bentuknya string JSON, kita parse dulu
            const ids = JSON.parse(kategoriIds); 
            if (ids.length > 0) {
                const values = ids.map(kategoriID => [newBukuID, kategoriID]);
                await db.query("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES ?", [values]);
            }
        }
        
        res.status(201).json({ message: "Buku berhasil ditambahkan!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Buku (Support Multi Kategori)
exports.updateBuku = async (req, res) => {
    const { id } = req.params;
    const { judul, penulis, penerbit, tahunTerbit, stok, kategoriIds } = req.body;
    
    try {
        const [oldBook] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (oldBook.length === 0) return res.status(404).json({ message: "Buku tidak ditemukan" });

        // 1. Update Tabel Buku Utama
        let query = "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=?, Stok=?";
        let params = [judul, penulis, penerbit, tahunTerbit, stok];

        if (req.file) {
            query += ", Gambar=?";
            params.push(req.file.filename);
            if (oldBook[0].Gambar) {
                const oldPath = path.join(__dirname, '../uploads', oldBook[0].Gambar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        query += " WHERE BukuID=?";
        params.push(id);
        await db.query(query, params);

        // 2. Update Relasi Kategori (Strategi: Hapus Semua Lama -> Insert Baru)
        if (kategoriIds) {
            const ids = JSON.parse(kategoriIds);
            
            // Hapus relasi lama
            await db.query("DELETE FROM kategoribuku_relasi WHERE BukuID = ?", [id]);

            // Insert relasi baru jika ada yang dipilih
            if (ids.length > 0) {
                const values = ids.map(kategoriID => [id, kategoriID]);
                await db.query("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES ?", [values]);
            }
        }

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

        // Relasi di kategoribuku_relasi otomatis terhapus karena ON DELETE CASCADE di database
        await db.query("DELETE FROM buku WHERE BukuID = ?", [id]);
        res.json({ message: "Buku berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menghapus buku (mungkin sedang dipinjam)." });
    }
};