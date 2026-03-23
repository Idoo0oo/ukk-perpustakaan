/**
 * Deskripsi File:
 * Route untuk autentikasi (Login & Register).
 * Controller: authController.js
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validateMiddleware');
const authValidation = require('../validations/authValidation');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, // Maksimal 10 percobaan per 15 menit
    message: { error: "Terlalu banyak percobaan, coba lagi setelah 15 menit." }
});

// Endpoint: /api/auth/register
router.post('/register', authLimiter, validate(authValidation.registerSchema), authController.register);

// Endpoint: /api/auth/login
router.post('/login', authLimiter, validate(authValidation.loginSchema), authController.login);

module.exports = router;