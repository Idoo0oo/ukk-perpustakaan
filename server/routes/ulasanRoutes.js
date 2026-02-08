/**
 * Deskripsi File:
 * File route untuk endpoints ulasan buku. GET bersifat publik, POST memerlukan autentikasi.
 */

const express = require('express');
const router = express.Router();
const ulasanController = require('../controllers/ulasanController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:bukuID', ulasanController.getUlasanByBuku);
router.post('/', verifyToken, ulasanController.addUlasan);

module.exports = router;