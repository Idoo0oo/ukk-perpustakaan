const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'db_perpustakaan'
});

db.connect(err => {
    if (err) console.error('Gagal koneksi database:', err);
    else console.log('Database MySQL Terhubung!');
});

// --- 1. AUTHENTICATION & MEMBERSHIP ---

// Register / Daftar Anggota [cite: 51, 106]
app.post('/api/register', async (req, res) => {
    const { nama, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Status is_validated default 0 (Menunggu validasi admin sesuai flowmap) [cite: 50, 52]
    const query = "INSERT INTO users (nama, username, password, role, is_validated) VALUES (?, ?, ?, 'siswa', 0)";
    db.query(query, [nama, username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: "Username sudah digunakan" });
        res.status(201).json({ message: "Berhasil daftar, silakan tunggu validasi admin" });
    });
});

// Login Admin & Siswa [cite: 36, 42, 54, 105]
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "User tidak ditemukan" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Password salah" });

        // Validasi Login (Khusus Siswa) [cite: 42, 54]
        if (user.role === 'siswa' && user.is_validated === 0) {
            return res.status(403).json({ error: "Akun Anda belum divalidasi oleh admin" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: user.role, nama: user.nama, id: user.id });
    });
});

// Validasi Anggota oleh Admin [cite: 62, 69, 106]
app.get('/api/users/unvalidated', (req, res) => {
    db.query("SELECT id, nama, username FROM users WHERE role = 'siswa' AND is_validated = 0", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/api/users/validate/:id', (req, res) => {
    db.query("UPDATE users SET is_validated = 1 WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "User berhasil divalidasi" });
    });
});

// --- 2. MANAJEMEN DATA BUKU (CRUD) ---

// Ambil & Cari Buku [cite: 65, 106]
app.get('/api/books', (req, res) => {
    const search = req.query.search || '';
    const query = "SELECT * FROM books WHERE judul LIKE ?";
    db.query(query, [`%${search}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Tambah Buku (Admin) [cite: 60, 105]
app.post('/api/books', (req, res) => {
    const { judul, penulis, penerbit, tahun, stok } = req.body;
    const query = "INSERT INTO books (judul, penulis, penerbit, tahun, stok) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [judul, penulis, penerbit, tahun, stok], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Buku berhasil ditambahkan" });
    });
});

// Update Buku (Admin) [cite: 60, 106]
app.put('/api/books/:id', (req, res) => {
    const { judul, penulis, penerbit, tahun, stok } = req.body;
    const query = "UPDATE books SET judul=?, penulis=?, penerbit=?, tahun=?, stok=? WHERE id=?";
    db.query(query, [judul, penulis, penerbit, tahun, stok, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Buku berhasil diperbarui" });
    });
});

// Hapus Buku (Admin) [cite: 60, 106]
app.delete('/api/books/:id', (req, res) => {
    db.query("DELETE FROM books WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Buku berhasil dihapus" });
    });
});

// --- 3. TRANSAKSI PEMINJAMAN & PENGEMBALIAN ---

// Melakukan Peminjaman [cite: 63, 78, 105]
app.post('/api/transactions/borrow', (req, res) => {
    const { user_id, book_id, tgl_pinjam } = req.body;
    
    db.query("SELECT stok FROM books WHERE id = ?", [book_id], (err, results) => {
        if (results.length > 0 && results[0].stok > 0) {
            const queryTrans = "INSERT INTO transactions (user_id, book_id, tgl_pinjam, status) VALUES (?, ?, ?, 'dipinjam')";
            db.query(queryTrans, [user_id, book_id, tgl_pinjam], (err, result) => {
                db.query("UPDATE books SET stok = stok - 1 WHERE id = ?", [book_id]);
                res.json({ message: "Buku berhasil dipinjam" });
            });
        } else {
            res.status(400).json({ message: "Stok buku habis" });
        }
    });
});

// Melakukan Pengembalian [cite: 64, 79, 105]
app.put('/api/transactions/return/:id', (req, res) => {
    const { tgl_kembali, book_id } = req.body;
    const query = "UPDATE transactions SET tgl_kembali = ?, status = 'dikembalikan' WHERE id = ?";
    db.query(query, [tgl_kembali, req.params.id], (err, result) => {
        db.query("UPDATE books SET stok = stok + 1 WHERE id = ?", [book_id]);
        res.json({ message: "Buku berhasil dikembalikan" });
    });
});

// Riwayat Transaksi (Untuk Laporan Admin & Siswa) [cite: 61, 66]
app.get('/api/transactions', (req, res) => {
    const userId = req.query.user_id; 
    let query = `
        SELECT t.*, b.judul, u.nama 
        FROM transactions t 
        JOIN books b ON t.book_id = b.id 
        JOIN users u ON t.user_id = u.id`;
    if (userId) {
        query += " WHERE t.user_id = ?";
        db.query(query, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } else {
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));