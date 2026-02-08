/**
 * Deskripsi File:
 * File route untuk fitur tambahan: koleksi pribadi (bookmark) dan ulasan buku.
 * Menyediakan endpoints untuk user dan admin.
 */

const express = require('express');
const router = express.Router();
const fiturController = require('../controllers/fiturController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/koleksi', verifyToken, fiturController.toggleKoleksi);
router.get('/koleksi', verifyToken, fiturController.getKoleksi);

router.post('/ulasan', verifyToken, fiturController.addUlasan);
router.get('/ulasan/:bukuID', verifyToken, fiturController.getUlasanByBuku);

router.get('/admin/all-ulasan', verifyToken, isAdmin, fiturController.getAllUlasan);
router.delete('/admin/ulasan/:id', verifyToken, isAdmin, fiturController.deleteUlasan);

module.exports = router;