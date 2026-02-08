/**
 * Deskripsi File:
 * File ini bertanggung jawab untuk mengelola data pengguna (user) peminjam.
 * Menggunakan UserModel untuk memisahkan logic database.
 */

const UserModel = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const { status } = req.query;
        // Panggil model untuk ambil user dengan role 'peminjam'
        // Logic filter status sudah ditangani di dalam Model
        const users = await UserModel.getAllByRole('peminjam', status);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Panggil method updateStatus di model
        await UserModel.updateStatus(id, 'Aktif');
        res.json({ message: "Akun pengguna berhasil diaktifkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.delete(id);
        res.json({ message: "Data pengguna berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};