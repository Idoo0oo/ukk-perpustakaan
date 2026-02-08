const LaporanModel = require('../models/laporanModel');

exports.getLaporanPeminjaman = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Tanggal awal dan akhir harus diisi!" });
    }

    try {
        const laporan = await LaporanModel.getPeminjamanByDateRange(startDate, endDate);
        res.json(laporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};