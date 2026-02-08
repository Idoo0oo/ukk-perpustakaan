/**
 * Deskripsi File:
 * Model ini menangani interaksi langsung dengan tabel 'user' di database.
 * Semua query SQL terkait user harus ada di sini, bukan di Controller.
 */

const db = require('../config/db');

class UserModel {
    // Cari user berdasarkan username
    static async findByUsername(username) {
        const [rows] = await db.query("SELECT * FROM user WHERE Username = ?", [username]);
        return rows[0];
    }

    // Cari user berdasarkan email
    static async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM user WHERE Email = ?", [email]);
        return rows[0];
    }

    // Cek duplikasi saat register
    static async findByUsernameOrEmail(username, email) {
        const [rows] = await db.query(
            "SELECT * FROM user WHERE Username = ? OR Email = ?", 
            [username, email]
        );
        return rows[0];
    }

    // Create user baru
    static async create(userData) {
        const { username, password, email, namaLengkap, alamat, role, status } = userData;
        const [result] = await db.query(
            "INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, password, email, namaLengkap, alamat, role, status]
        );
        return result.insertId;
    }

    // Ambil semua user (bisa filter by status & role)
    static async getAllByRole(role, status = null) {
        let query = "SELECT UserID, Username, Email, NamaLengkap, Alamat, Role, Status FROM user WHERE Role = ?";
        let params = [role];

        if (status) {
            query += " AND Status = ?";
            params.push(status);
        }

        const [rows] = await db.query(query + " ORDER BY UserID DESC", params);
        return rows;
    }

    // Update status user (Verifikasi)
    static async updateStatus(id, newStatus) {
        return db.query("UPDATE user SET Status = ? WHERE UserID = ?", [newStatus, id]);
    }

    // Hapus user
    static async delete(id) {
        return db.query("DELETE FROM user WHERE UserID = ?", [id]);
    }
}

module.exports = UserModel;