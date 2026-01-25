const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User biasa (peminjam) boleh melihat buku tanpa login atau dengan login
router.get('/', bukuController.getAllBuku);

// Hanya Admin & Petugas yang boleh Menambah, Mengubah, dan Menghapus
router.post('/', verifyToken, isAdmin, bukuController.addBuku);
router.put('/:id', verifyToken, isAdmin, bukuController.updateBuku);
router.delete('/:id', verifyToken, isAdmin, bukuController.deleteBuku);

module.exports = router;