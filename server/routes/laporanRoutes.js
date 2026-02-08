/**
 * Deskripsi File:
 * File route untuk endpoint laporan peminjaman.
 * Hanya dapat diakses oleh admin untuk generate laporan berdasarkan tanggal.
 */

const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/peminjaman', verifyToken, isAdmin, laporanController.getLaporanPeminjaman);

module.exports = router;