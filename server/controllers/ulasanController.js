const db = require('../config/db');

// Tambah Ulasan
exports.addUlasan = async (req, res) => {
    const { bukuID, ulasan, rating } = req.body;
    const userID = req.user.id;

    try {
        await db.query(
            "INSERT INTO ulasanbuku (UserID, BukuID, Ulasan, Rating) VALUES (?, ?, ?, ?)",
            [userID, bukuID, ulasan, rating]
        );
        res.status(201).json({ message: "Ulasan berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ambil Ulasan berdasarkan Buku
exports.getUlasanByBuku = async (req, res) => {
    const { bukuID } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT u.*, us.Username 
             FROM ulasanbuku u 
             JOIN user us ON u.UserID = us.UserID 
             WHERE u.BukuID = ?`, 
            [bukuID]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};