/**
 * Deskripsi File:
 * Route KHUSUS untuk Koleksi Pribadi (Bookmark).
 * Controller: fiturController.js
 */

const express = require('express');
const router = express.Router();
const fiturController = require('../controllers/fiturController');
const { verifyToken } = require('../middleware/authMiddleware');

// Koleksi Pribadi
router.post('/koleksi', verifyToken, fiturController.toggleKoleksi);
router.get('/koleksi', verifyToken, fiturController.getKoleksiSaya);
router.get('/koleksi/status/:bukuID', verifyToken, fiturController.checkKoleksiStatus);

module.exports = router;