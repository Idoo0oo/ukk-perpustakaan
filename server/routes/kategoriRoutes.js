/**
 * Deskripsi File:
 * File route untuk endpoints kategori buku. GET endpoint tersedia publik,
 * CUD endpoints hanya untuk admin.
 */

const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', kategoriController.getAllKategori);
router.post('/', verifyToken, isAdmin, kategoriController.addKategori);
router.put('/:id', verifyToken, isAdmin, kategoriController.updateKategori);
router.delete('/:id', verifyToken, isAdmin, kategoriController.deleteKategori);

module.exports = router;