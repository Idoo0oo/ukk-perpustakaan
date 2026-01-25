const db = require('../config/db');

exports.getAllKategori = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM kategoribuku");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addKategori = async (req, res) => {
    const { namaKategori } = req.body;
    try {
        await db.query("INSERT INTO kategoribuku (NamaKategori) VALUES (?)", [namaKategori]);
        res.status(201).json({ message: "Kategori berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateKategori = async (req, res) => {
    const { id } = req.params;
    const { namaKategori } = req.body;
    try {
        await db.query("UPDATE kategoribuku SET NamaKategori=? WHERE KategoriID=?", [namaKategori, id]);
        res.json({ message: "Kategori berhasil diperbarui!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteKategori = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM kategoribuku WHERE KategoriID=?", [id]);
        res.json({ message: "Kategori berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};