const express = require('express');
const router = express.Router();
const ulasanController = require('../controllers/ulasanController');
const { verifyToken } = require('../middleware/authMiddleware');

// Siapapun bisa melihat ulasan
router.get('/:bukuID', ulasanController.getUlasanByBuku);

// Hanya yang login bisa kasih ulasan
router.post('/', verifyToken, ulasanController.addUlasan);

module.exports = router;