const { z } = require('zod');

exports.pinjamBukuSchema = z.object({
    body: z.object({
        bukuID: z.number({ required_error: "BukuID wajib diisi", invalid_type_error: "BukuID harus berupa angka" }).int().positive("BukuID harus angka positif"),
        lamaPinjam: z.number({ required_error: "Lama pinjam wajib diisi", invalid_type_error: "Lama pinjam harus berupa angka" }).int().min(1, "Minimal 1 hari").max(14, "Maksimal 14 hari")
    })
});
