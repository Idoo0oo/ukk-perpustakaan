const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const peminjamanValidation = require('../validations/peminjamanValidation');

// Route Peminjam
router.post('/', verifyToken, validate(peminjamanValidation.pinjamBukuSchema), peminjamanController.pinjamBuku);
router.get('/', verifyToken, peminjamanController.getAllPeminjaman); // Peminjam lihat punya sendiri
router.put('/:id/kembali', verifyToken, peminjamanController.ajukanPengembalian);

// Route Admin (Approval & History)
// Pastikan urutan route benar (yang spesifik di atas yang dinamis :id)
router.get('/pending', verifyToken, isAdmin, peminjamanController.getPeminjamanPending);
router.get('/return-requests', verifyToken, isAdmin, peminjamanController.getPengembalianPending);
router.get('/history', verifyToken, isAdmin, peminjamanController.getAllHistory);
router.get('/most-borrowed-week', verifyToken, peminjamanController.getMostBorrowedThisWeek);

// Aksi Admin
router.put('/:id/approve', verifyToken, isAdmin, peminjamanController.approvePeminjaman);
router.put('/:id/reject', verifyToken, isAdmin, peminjamanController.rejectPeminjaman);
router.put('/:id/return', verifyToken, isAdmin, peminjamanController.kembalikanBuku);

module.exports = router;