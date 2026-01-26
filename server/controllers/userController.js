const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Ambil semua data siswa/petugas
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT UserID, Username, Email, NamaLengkap, Alamat, Role FROM user WHERE Role != 'admin'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Admin tambah User baru (Siswa/Petugas)
exports.createUser = async (req, res) => {
    const { username, password, email, namaLengkap, alamat, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role) VALUES (?, ?, ?, ?, ?, ?)",
            [username, hashedPassword, email, namaLengkap, alamat, role || 'peminjam']
        );
        res.status(201).json({ message: "User berhasil dibuat oleh Admin!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Admin Update data User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, namaLengkap, alamat, role } = req.body;
    try {
        await db.query(
            "UPDATE user SET Email=?, NamaLengkap=?, Alamat=?, Role=? WHERE UserID=?",
            [email, namaLengkap, alamat, role, id]
        );
        res.json({ message: "Data user berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Admin Hapus User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM user WHERE UserID=?", [id]);
        res.json({ message: "User telah dihapus dari sistem!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};