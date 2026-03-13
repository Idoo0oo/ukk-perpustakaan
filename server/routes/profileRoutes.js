/**
 * Route untuk profil peminjam (self-service).
 * Semua route hanya memerlukan verifyToken — tidak perlu isAdmin.
 * Controller: profileController.js
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

// Multer setup — reuse uploads folder
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `profil_${req.user.id}_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB

// GET /api/profile — ambil profil diri sendiri
router.get('/', verifyToken, profileController.getProfile);

// PUT /api/profile — perbarui info pribadi
router.put('/', verifyToken, profileController.updateProfile);

// PUT /api/profile/password — ganti password
router.put('/password', verifyToken, profileController.changePassword);

// POST /api/profile/photo — upload foto profil
router.post('/photo', verifyToken, upload.single('foto'), profileController.uploadPhoto);

module.exports = router;
