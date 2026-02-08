const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Import Model

exports.register = async (req, res) => {
    const { username, password, email, namaLengkap, alamat } = req.body;

    try {
        // Logika bisnis: Cek duplikasi
        const existingUser = await UserModel.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(400).json({ message: "Username atau Email sudah terdaftar!" });
        }

        // Logika bisnis: Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Panggil Model untuk simpan data
        await UserModel.create({
            username,
            password: hashedPassword,
            email,
            namaLengkap,
            alamat,
            role: 'peminjam',
            status: 'Menunggu'
        });

        res.status(201).json({ message: "Registrasi berhasil! Silakan lapor ke Admin untuk aktivasi akun." });
    } catch (error) {
        console.error(error); // Penting untuk debugging di server console
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Panggil Model
        const user = await UserModel.findByUsername(username);
        
        // Validasi User
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        // Validasi Status
        if (user.Status === 'Menunggu') {
            return res.status(403).json({ message: "Akun Anda belum diaktifkan oleh Admin!" });
        }
        
        // Validasi Password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Password salah" });

        // Generate Token
        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET || 'secret_perpustakaan',
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.Role, nama: user.NamaLengkap, userId: user.UserID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};