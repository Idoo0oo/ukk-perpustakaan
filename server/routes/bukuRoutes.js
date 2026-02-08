/**
 * Deskripsi File:
 * File route untuk endpoints buku. Menyediakan CRUD buku dengan multer middleware
 * untuk upload gambar cover buku. Validasi file: JPG, JPEG, PNG max 2MB.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bukuController = require('../controllers/bukuController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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

router.get('/', verifyToken, bukuController.getAllBuku);
router.get('/:id', verifyToken, bukuController.getBukuById);

router.post('/', verifyToken, isAdmin, upload.single('gambar'), bukuController.createBuku);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), bukuController.updateBuku);
router.delete('/:id', verifyToken, isAdmin, bukuController.deleteBuku);

module.exports = router;