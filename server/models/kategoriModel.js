const db = require('../config/db');

class KategoriModel {
    // 1. INI FUNGSI YANG HILANG (Penyebab Error)
    static async findAll() {
        const [rows] = await db.query("SELECT * FROM kategoribuku");
        return rows;
    }

    // 2. Fungsi cari berdasarkan ID
    static async findById(id) {
        const [rows] = await db.query("SELECT * FROM kategoribuku WHERE KategoriID = ?", [id]);
        return rows[0];
    }

    // 3. Fungsi Tambah Kategori
    static async create(namaKategori) {
        const [result] = await db.query("INSERT INTO kategoribuku (NamaKategori) VALUES (?)", [namaKategori]);
        return result.insertId;
    }

    // 4. Fungsi Update Kategori
    static async update(id, namaKategori) {
        return db.query("UPDATE kategoribuku SET NamaKategori = ? WHERE KategoriID = ?", [namaKategori, id]);
    }

    // 5. Fungsi Hapus Kategori
    static async delete(id) {
        return db.query("DELETE FROM kategoribuku WHERE KategoriID = ?", [id]);
    }
}

module.exports = KategoriModel;