const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// PERBAIKAN: Gunakan 'isAdmin' sesuai nama di authMiddleware.js
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Route untuk Admin mengelola user
// GET /api/users?status=Menunggu  -> Lihat user yg belum aktif
// PUT /api/users/:id/verify       -> Aktifkan user
// DELETE /api/users/:id           -> Hapus user

// PERBAIKAN: Ganti 'verifyAdmin' menjadi 'isAdmin' di setiap route
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:id/verify', verifyToken, isAdmin, userController.verifyUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;