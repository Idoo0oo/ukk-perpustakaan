/**
 * Deskripsi File:
 * Route untuk manajemen kategori buku.
 */

const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController'); // Pastikan path ini benar
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Debugging: Cek apakah controller terbaca
if (!kategoriController.createKategori || !kategoriController.getAllKategori) {
    console.error("ERROR: Fungsi Controller Kategori tidak ditemukan! Cek file controllers/kategoriController.js");
}

// Public Routes
router.get('/', kategoriController.getAllKategori);
// router.get('/:id', kategoriController.getKategoriById); // Optional jika ada

// Admin Routes (Protected)
// Baris 13 yang error biasanya ada di sini:
router.post('/', verifyToken, isAdmin, kategoriController.createKategori);
router.put('/:id', verifyToken, isAdmin, kategoriController.updateKategori);
router.delete('/:id', verifyToken, isAdmin, kategoriController.deleteKategori);

module.exports = router;