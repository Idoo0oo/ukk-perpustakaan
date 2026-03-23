/**
 * Deskripsi File:
 * Route untuk endpoint publik tanpa verifikasi token.
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Endpoint Landing Page (Tanpa verifyToken)
router.get('/landing', publicController.getLandingData);

module.exports = router;
