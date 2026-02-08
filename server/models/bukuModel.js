/**
 * Deskripsi File:
 * Model ini menangani interaksi database untuk tabel 'buku' dan relasinya dengan 'kategoribuku'.
 */

const db = require('../config/db');

class BukuModel {
    // Ambil semua buku dengan nama kategori yang digabung (comma separated)
    static async findAll() {
        const query = `
            SELECT b.*, 
            GROUP_CONCAT(k.NamaKategori SEPARATOR ', ') AS NamaKategori
            FROM buku b
            LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
            LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
            GROUP BY b.BukuID
            ORDER BY b.BukuID DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // Ambil detail buku beserta array ID kategori (untuk keperluan edit)
    static async findById(id) {
        const [buku] = await db.query("SELECT * FROM buku WHERE BukuID = ?", [id]);
        if (buku.length === 0) return null;

        const [kategori] = await db.query("SELECT KategoriID FROM kategoribuku_relasi WHERE BukuID = ?", [id]);

        return {
            ...buku[0],
            KategoriIDs: kategori.map(k => k.KategoriID)
        };
    }

    // Cek stok buku
    static async getStok(id) {
        const [rows] = await db.query("SELECT Stok FROM buku WHERE BukuID = ?", [id]);
        return rows.length ? rows[0].Stok : 0;
    }

    // Create Buku + Relasi Kategori
    static async create(data, kategoriIds) {
        const { judul, penulis, penerbit, tahunTerbit, stok, gambar } = data;
        
        // 1. Insert Buku
        const [result] = await db.query(
            "INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit, Stok, Gambar) VALUES (?, ?, ?, ?, ?, ?)",
            [judul, penulis, penerbit, tahunTerbit, stok, gambar]
        );
        const newBukuID = result.insertId;

        // 2. Insert Kategori (jika ada)
        if (kategoriIds && kategoriIds.length > 0) {
            const values = kategoriIds.map(kategoriID => [newBukuID, kategoriID]);
            await db.query("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES ?", [values]);
        }
        
        return newBukuID;
    }

    // Update Buku + Reset Relasi Kategori
    static async update(id, data, kategoriIds) {
        const { judul, penulis, penerbit, tahunTerbit, stok, gambar } = data;
        
        let query = "UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=?, Stok=?";
        let params = [judul, penulis, penerbit, tahunTerbit, stok];

        if (gambar) {
            query += ", Gambar=?";
            params.push(gambar);
        }

        query += " WHERE BukuID=?";
        params.push(id);

        await db.query(query, params);

        // Update Kategori: Hapus lama, insert baru
        if (kategoriIds) {
            await db.query("DELETE FROM kategoribuku_relasi WHERE BukuID = ?", [id]);
            if (kategoriIds.length > 0) {
                const values = kategoriIds.map(kategoriID => [id, kategoriID]);
                await db.query("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES ?", [values]);
            }
        }
        return true;
    }

    // Hapus Buku
    static async delete(id) {
        return db.query("DELETE FROM buku WHERE BukuID = ?", [id]);
    }
    
    // Update Stok (Helper untuk peminjaman)
    static async updateStok(id, perubahan) {
        // perubahan bisa +1 atau -1
        return db.query("UPDATE buku SET Stok = Stok + ? WHERE BukuID = ?", [perubahan, id]);
    }
}

module.exports = BukuModel;