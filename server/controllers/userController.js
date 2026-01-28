const db = require('../config/db');

// Ambil semua user (bisa difilter status via query param ?status=Menunggu)
exports.getAllUsers = async (req, res) => {
    try {
        const { status } = req.query;
        let query = "SELECT UserID, Username, Email, NamaLengkap, Alamat, Role, Status FROM user WHERE Role = 'peminjam'";
        let params = [];

        if (status) {
            query += " AND Status = ?";
            params.push(status);
        }

        const [rows] = await db.query(query + " ORDER BY UserID DESC", params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fitur Admin: Verifikasi Akun User
exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("UPDATE user SET Status = 'Aktif' WHERE UserID = ?", [id]);
        res.json({ message: "Akun pengguna berhasil diaktifkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fitur Admin: Hapus User (jika pendaftaran ditolak)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM user WHERE UserID = ?", [id]);
        res.json({ message: "Data pengguna berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};