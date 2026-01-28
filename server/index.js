const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bukuRoutes = require('./routes/bukuRoutes');
const peminjamanRoutes = require('./routes/peminjamanRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const ulasanRoutes = require('./routes/ulasanRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Hubungkan Rute
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/ulasan', ulasanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});