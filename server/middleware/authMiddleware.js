const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari "Bearer <token>"

    if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ada!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_perpustakaan');
        req.user = decoded; // Menyimpan data user (id & role) ke request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token tidak valid!" });
    }
};

// Middleware tambahan untuk mengecek Role (Misal: Hanya Admin)
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'petugas') {
        return res.status(403).json({ message: "Akses khusus Admin/Petugas!" });
    }
    next();
};