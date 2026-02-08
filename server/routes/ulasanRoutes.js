/**
 * Deskripsi File:
 * Route KHUSUS untuk Ulasan Buku.
 * Endpoint base di index.js biasanya: /api/ulasan
 * Controller: ulasanController.js
 */

const express = require('express');
const router = express.Router();
const ulasanController = require('../controllers/ulasanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User: Tambah Ulasan
router.post('/', verifyToken, ulasanController.addUlasan);

// User/Public: Lihat Ulasan per Buku
router.get('/:bukuID', verifyToken, ulasanController.getUlasanByBuku);

// Admin: Lihat Semua Ulasan
router.get('/admin/all', verifyToken, isAdmin, ulasanController.getAllUlasan);

// Admin: Hapus Ulasan (Moderasi)
router.delete('/admin/:id', verifyToken, isAdmin, ulasanController.deleteUlasan);

module.exports = router;