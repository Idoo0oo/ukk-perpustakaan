const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, email, namaLengkap, alamat } = req.body;
    // Default role 'peminjam' (siswa), status otomatis 'Menunggu'
    const role = 'peminjam'; 
    const status = 'Menunggu';

    try {
        // Cek username/email duplikat
        const [existingUser] = await db.query("SELECT * FROM user WHERE Username = ? OR Email = ?", [username, email]);
        if (existingUser.length > 0) return res.status(400).json({ message: "Username atau Email sudah terdaftar!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, hashedPassword, email, namaLengkap, alamat, role, status]
        );
        
        res.status(201).json({ message: "Registrasi berhasil! Silakan lapor ke Admin untuk aktivasi akun." });
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

        // --- VALIDASI STATUS AKUN ---
        if (user.Status === 'Menunggu') {
            return res.status(403).json({ message: "Akun Anda belum diaktifkan oleh Admin!" });
        }
        // ----------------------------

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET || 'secret_perpustakaan',
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.Role, nama: user.NamaLengkap, userId: user.UserID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};