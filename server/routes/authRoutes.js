/**
 * Deskripsi File:
 * Route untuk autentikasi (Login & Register).
 * Controller: authController.js
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint: /api/auth/register
router.post('/register', authController.register);

// Endpoint: /api/auth/login
router.post('/login', authController.login);

module.exports = router;