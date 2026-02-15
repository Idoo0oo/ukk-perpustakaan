/**
 * Deskripsi File:
 * File ini bertanggung jawab untuk middleware autentikasi menggunakan JWT.
 * Menyediakan verifikasi token dan role-based access control.
 */

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ada!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_perpustakaan');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token tidak valid!" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses khusus Admin!" });
    }
    next();
};