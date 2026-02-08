const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Route Peminjam (Siswa)
router.post('/', verifyToken, peminjamanController.pinjamBuku);
router.get('/', verifyToken, peminjamanController.getAllPeminjaman); // Siswa lihat punya sendiri
router.put('/:id/kembali', verifyToken, peminjamanController.ajukanPengembalian);

// Route Admin (Approval & History)
// Pastikan urutan route benar (yang spesifik di atas yang dinamis :id)
router.get('/pending', verifyToken, isAdmin, peminjamanController.getPeminjamanPending);
router.get('/return-requests', verifyToken, isAdmin, peminjamanController.getPengembalianPending);
router.get('/history', verifyToken, isAdmin, peminjamanController.getAllHistory);

// Aksi Admin
router.put('/:id/approve', verifyToken, isAdmin, peminjamanController.approvePeminjaman);
router.put('/:id/reject', verifyToken, isAdmin, peminjamanController.rejectPeminjaman);
router.put('/:id/return', verifyToken, isAdmin, peminjamanController.kembalikanBuku);

module.exports = router;