const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/pinjam', peminjamanController.pinjamBuku);
router.get('/', peminjamanController.getAllPeminjaman);
router.put('/acc/:id', peminjamanController.accPeminjaman); // Baris 11 (Tersangka Error)
router.put('/tolak/:id', peminjamanController.tolakPeminjaman);
router.put('/kembali/:id', peminjamanController.kembalikanBuku);

module.exports = router;