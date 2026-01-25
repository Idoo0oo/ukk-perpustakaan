const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, email, namaLengkap, alamat, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role) VALUES (?, ?, ?, ?, ?, ?)",
            [username, hashedPassword, email, namaLengkap, alamat, role]
        );
        res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM user WHERE Username = ?", [username]);
        if (users.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET || 'secret_perpustakaan',
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.Role, nama: user.NamaLengkap });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};