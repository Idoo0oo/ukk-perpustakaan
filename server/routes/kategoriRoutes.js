const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const kategoriValidation = require('../validations/kategoriValidation');

// Debugging: Cek apakah controller terbaca
if (!kategoriController.createKategori || !kategoriController.getAllKategori) {
    console.error("ERROR: Fungsi Controller Kategori tidak ditemukan! Cek file controllers/kategoriController.js");
}

// Public Routes
router.get('/', kategoriController.getAllKategori);

// Admin Routes (Protected)
router.post('/', verifyToken, isAdmin, validate(kategoriValidation.createKategoriSchema), kategoriController.createKategori);
router.put('/:id', verifyToken, isAdmin, validate(kategoriValidation.updateKategoriSchema), kategoriController.updateKategori);
router.delete('/:id', verifyToken, isAdmin, kategoriController.deleteKategori);

module.exports = router;