const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken } = require('../middleware/authMiddleware');

// Semua rute di bawah ini wajib login
router.use(verifyToken);

router.post('/pinjam', peminjamanController.pinjamBuku);
router.get('/', peminjamanController.getAllPeminjaman);
router.put('/kembali/:id', peminjamanController.kembalikanBuku);

module.exports = router;