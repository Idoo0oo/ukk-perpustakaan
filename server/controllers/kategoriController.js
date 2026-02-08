const KategoriModel = require('../models/kategoriModel');

// Pastikan nama fungsinya sama persis dengan yang dipanggil di route
exports.getAllKategori = async (req, res) => {
    try {
        const kategori = await KategoriModel.findAll();
        res.json(kategori);
    } catch (error) {
        console.error("ERROR KATEGORI:", error); // <--- Tambahkan ini
        res.status(500).json({ error: error.message });
    }
};
exports.getKategoriById = async (req, res) => { // Tambahkan ini jika belum ada
    const { id } = req.params;
    try {
        const kategori = await KategoriModel.findById(id);
        if (!kategori) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        res.json(kategori);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createKategori = async (req, res) => {
    const { namaKategori } = req.body;
    if (!namaKategori) return res.status(400).json({ message: "Nama kategori wajib diisi!" });

    try {
        await KategoriModel.create(namaKategori);
        res.status(201).json({ message: "Kategori berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateKategori = async (req, res) => {
    const { id } = req.params;
    const { namaKategori } = req.body;

    try {
        const existing = await KategoriModel.findById(id);
        if (!existing) return res.status(404).json({ message: "Kategori tidak ditemukan" });

        await KategoriModel.update(id, namaKategori);
        res.json({ message: "Kategori berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteKategori = async (req, res) => {
    try {
        await KategoriModel.delete(req.params.id);
        res.json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus (Mungkin sedang digunakan oleh buku)" });
    }
};