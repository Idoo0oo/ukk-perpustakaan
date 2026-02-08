/**
 * Deskripsi File:
 * Route untuk mencetak laporan peminjaman.
 * Controller: laporanController.js
 */

const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Get Laporan by Date Range
// Endpoint: /api/laporan/peminjaman?startDate=...&endDate=...
router.get('/peminjaman', verifyToken, isAdmin, laporanController.getLaporanPeminjaman);

module.exports = router;