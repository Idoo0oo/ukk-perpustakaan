const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- SETUP MULTER ---
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder 'uploads' ada di root server
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Hanya file gambar (jpg, jpeg, png) yang diperbolehkan!'));
    }
});

// --- ROUTES ---
router.get('/', verifyToken, bukuController.getAllBuku);
router.get('/:id', verifyToken, bukuController.getBukuById); // <-- Ini yang bikin error tadi kalau functionnya ga ada

// Admin Routes
router.post('/', verifyToken, isAdmin, upload.single('gambar'), bukuController.createBuku);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), bukuController.updateBuku);
router.delete('/:id', verifyToken, isAdmin, bukuController.deleteBuku);

module.exports = router;