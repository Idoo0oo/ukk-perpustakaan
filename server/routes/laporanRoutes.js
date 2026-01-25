const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Hanya Admin dan Petugas yang bisa mengakses laporan
router.get('/', verifyToken, isAdmin, laporanController.getLaporanPeminjaman);

module.exports = router;