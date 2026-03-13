/**
 * Controller untuk profil user/peminjam sendiri.
 * Semua endpoint menggunakan req.user.id dari JWT token.
 */

const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

// GET /api/profile — ambil data profil sendiri
exports.getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// PUT /api/profile — update nama, email, alamat
exports.updateProfile = async (req, res) => {
    const { namaLengkap, email, alamat } = req.body;
    try {
        if (!namaLengkap || !email) {
            return res.status(400).json({ message: 'Nama lengkap dan email wajib diisi.' });
        }
        await UserModel.updateProfile(req.user.id, { namaLengkap, email, alamat });
        const updated = await UserModel.findById(req.user.id);
        res.json({ message: 'Profil berhasil diperbarui!', user: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// PUT /api/profile/password — ganti password
exports.changePassword = async (req, res) => {
    const { passwordLama, passwordBaru } = req.body;
    try {
        if (!passwordLama || !passwordBaru) {
            return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
        }
        if (passwordBaru.length < 6) {
            return res.status(400).json({ message: 'Password baru minimal 6 karakter.' });
        }

        // Ambil password hash dari DB
        const [rows] = await require('../config/db').query(
            'SELECT Password FROM user WHERE UserID = ?', [req.user.id]
        );
        if (!rows[0]) return res.status(404).json({ message: 'User tidak ditemukan.' });

        const isMatch = await bcrypt.compare(passwordLama, rows[0].Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password lama tidak sesuai.' });
        }

        const hashed = await bcrypt.hash(passwordBaru, 10);
        await UserModel.updatePassword(req.user.id, hashed);
        res.json({ message: 'Password berhasil diperbarui!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};

// POST /api/profile/photo — upload foto profil
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
        const filename = req.file.filename;
        // Hanya update kolom FotoProfil saja
        await require('../config/db').query(
            'UPDATE user SET FotoProfil = ? WHERE UserID = ?',
            [filename, req.user.id]
        );
        res.json({ message: 'Foto profil berhasil diperbarui!', foto: filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};
