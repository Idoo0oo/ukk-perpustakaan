/**
 * Deskripsi File:
 * Route untuk manajemen User (Peminjam).
 * Hanya bisa diakses oleh Admin.
 * Controller: userController.js
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Ambil semua user (bisa filter ?status=Menunggu)
// Endpoint: /api/users
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// Verifikasi/Aktivasi akun user
// Endpoint: /api/users/:id/verify
router.put('/:id/verify', verifyToken, isAdmin, userController.verifyUser);

// Hapus user (Tolak pendaftaran atau hapus siswa)
// Endpoint: /api/users/:id
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;