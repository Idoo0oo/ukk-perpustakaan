const db = require('./config/db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Coba Insert Admin Baru dengan Status Aktif
        await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['admin', hashedPassword, 'admin@sekolah.com', 'Admin Perpus', 'Sekolah', 'admin', 'Aktif']
        );
        console.log("✅ Admin berhasil dibuat dan berstatus AKTIF!");
        process.exit();
    } catch (err) {
        // Jika Error karena 'Duplicate entry', kita Update saja statusnya
        if (err.code === 'ER_DUP_ENTRY' || err.message.includes('Duplicate entry')) {
            console.log("⚠️ Admin sudah ada, sedang mengupdate status menjadi AKTIF...");
            await db.query("UPDATE user SET Status = 'Aktif', Password = ? WHERE Username = 'admin'", [hashedPassword]);
            console.log("✅ Status Admin berhasil diperbarui menjadi AKTIF!");
            process.exit();
        } else {
            console.error("❌ Error lain:", err.message);
            process.exit(1);
        }
    }
};

createAdmin();