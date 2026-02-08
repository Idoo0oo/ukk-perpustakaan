/**
 * Deskripsi File:
 * Route untuk endpoint buku. Menggunakan middleware upload yang sudah dipisahkan.
 */

const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import middleware baru

// Public / Authenticated Routes
router.get('/', verifyToken, bukuController.getAllBuku);
router.get('/:id', verifyToken, bukuController.getBukuById);

// Admin Routes (Upload logic ada di middleware 'upload')
router.post('/', verifyToken, isAdmin, upload.single('gambar'), bukuController.createBuku);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), bukuController.updateBuku);
router.delete('/:id', verifyToken, isAdmin, bukuController.deleteBuku);

module.exports = router;