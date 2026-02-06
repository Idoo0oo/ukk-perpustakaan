const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, peminjamanController.pinjamBuku);
router.get('/', verifyToken, peminjamanController.getAllPeminjaman); // Riwayat user sendiri

router.get('/pending', verifyToken, isAdmin, peminjamanController.getPeminjamanPending);
router.get('/history', verifyToken, isAdmin, peminjamanController.getAllHistory);
router.put('/:id/approve', verifyToken, isAdmin, peminjamanController.approvePeminjaman);
router.put('/:id/reject', verifyToken, isAdmin, peminjamanController.rejectPeminjaman)
router.put('/:id/return', verifyToken, isAdmin, peminjamanController.kembalikanBuku);
router.put('/:id/kembali', verifyToken, peminjamanController.ajukanPengembalian); 
router.get('/return-requests', verifyToken, isAdmin, peminjamanController.getPengembalianPending);
router.put('/:id/return', verifyToken, isAdmin, peminjamanController.kembalikanBuku);

module.exports = router;