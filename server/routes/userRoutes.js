/**
 * Deskripsi File:
 * File route untuk endpoints manajemen user peminjam.
 * Semua endpoint hanya dapat diakses oleh admin untuk approval dan pengelolaan user.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:id/verify', verifyToken, isAdmin, userController.verifyUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;