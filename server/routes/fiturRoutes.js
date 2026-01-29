const express = require('express');
const router = express.Router();
const fiturController = require('../controllers/fiturController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Route Koleksi Pribadi
// URL: http://localhost:5000/api/fitur/koleksi
router.post('/koleksi', verifyToken, fiturController.toggleKoleksi);
router.get('/koleksi', verifyToken, fiturController.getKoleksi);

// Route Ulasan Buku
// URL: http://localhost:5000/api/fitur/ulasan
router.post('/ulasan', verifyToken, fiturController.addUlasan);
router.get('/ulasan/:bukuID', verifyToken, fiturController.getUlasanByBuku);

router.get('/admin/all-ulasan', verifyToken, isAdmin, fiturController.getAllUlasan);
router.delete('/admin/ulasan/:id', verifyToken, isAdmin, fiturController.deleteUlasan);

module.exports = router;