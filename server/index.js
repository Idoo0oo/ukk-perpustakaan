/**
 * Deskripsi File:
 * File entry point utama untuk server Express. Menginisialisasi middleware
 * dan menghubungkan semua route ke aplikasi.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const rateLimit = require('express-rate-limit');

// Import semua routing modul
const authRoutes = require('./routes/authRoutes');
const bukuRoutes = require('./routes/bukuRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const ulasanRoutes = require('./routes/ulasanRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const userRoutes = require('./routes/userRoutes');
const fiturRoutes = require('./routes/fiturRoutes');
const profileRoutes = require('./routes/profileRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const jwt = require('jsonwebtoken');

// 1. Static Files: Pindahkan ke ATAS rate-limiter agar render gambar tidak menguras kuota API
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Global Rate Limiter dengan Skiplogic untuk Admin
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 500, // Limit 500 request per 5 menit
    message: { error: "Terlalu banyak request dari IP ini, silakan coba lagi setelah 5 menit." },
    skip: (req, res) => {
        // Abaikan limit jika user adalah Admin (cek via Header JWT)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_perpustakaan');
                if (decoded.role === 'admin') return true;
            } catch (err) { }
        }
        return false;
    }
});
app.use(limiter);

// Mount semua endpoint routing
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/ulasan', ulasanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fitur', fiturRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);

// Menjalankan server pada port yang ditentukan
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});