/**
 * Deskripsi File:
 * File route untuk endpoints autentikasi (login dan registrasi).
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;