/**
 * Deskripsi File:
 * Middleware ini menangani konfigurasi upload file menggunakan Multer.
 * Mengatur destinasi penyimpanan, penamaan file, dan validasi tipe file (gambar).
 */

const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pastikan folder 'uploads' ada di root server
    },
    filename: (req, file, cb) => {
        // Format nama: timestamp + ekstensi asli (contoh: 1709882211.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter tipe file (Hanya Gambar)
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Hanya file gambar (jpg, jpeg, png) yang diperbolehkan!'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
    fileFilter: fileFilter
});

module.exports = upload;