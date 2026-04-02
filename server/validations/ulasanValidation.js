const { z } = require('zod');

exports.addUlasanSchema = z.object({
    body: z.object({
        bukuID: z.number({ required_error: "BukuID wajib diisi", invalid_type_error: "BukuID harus berupa angka" }).int().positive("BukuID harus angka positif"),
        rating: z.number({ required_error: "Rating wajib diisi", invalid_type_error: "Rating harus berupa angka" }).int().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
        ulasan: z.string().max(500, "Ulasan maksimal 500 karakter").optional()
    })
});
