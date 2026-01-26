const db = require('./config/db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const password = 'admin123'; // Password yang kamu mau
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role) VALUES (?, ?, ?, ?, ?, ?)",
            ['admin', hashedPassword, 'admin@sekolah.com', 'Admin Perpus', 'Sekolah', 'admin']
        );
        console.log("✅ Admin berhasil dibuat!");
        process.exit();
    } catch (err) {
        console.error("❌ Gagal buat admin:", err.message);
        process.exit(1);
    }
};

createAdmin();