const db = require('../config/db');

class KategoriModel {
    // Mengambil semua data kategori buku
    static async findAll() {
        const [rows] = await db.query("SELECT * FROM kategoribuku ORDER BY KategoriID DESC");
        return rows;
    }

    // Mencari kategori berdasarkan ID
    static async findById(id) {
        const [rows] = await db.query("SELECT * FROM kategoribuku WHERE KategoriID = ?", [id]);
        return rows[0];
    }

    // Menambahkan kategori baru
    static async create(namaKategori) {
        const [result] = await db.query("INSERT INTO kategoribuku (NamaKategori) VALUES (?)", [namaKategori]);
        return result.insertId;
    }

    // Memperbarui nama kategori
    static async update(id, namaKategori) {
        return db.query("UPDATE kategoribuku SET NamaKategori = ? WHERE KategoriID = ?", [namaKategori, id]);
    }

    // Menghapus kategori berdasarkan ID
    static async delete(id) {
        return db.query("DELETE FROM kategoribuku WHERE KategoriID = ?", [id]);
    }
}

module.exports = KategoriModel;