const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/peminjaman', verifyToken, isAdmin, laporanController.getLaporanPeminjaman);

module.exports = router;