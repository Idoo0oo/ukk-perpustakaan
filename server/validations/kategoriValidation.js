const { z } = require('zod');

const namaKategoriBody = z.object({
    namaKategori: z.string().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter")
});

exports.createKategoriSchema = z.object({
    body: namaKategoriBody
});

exports.updateKategoriSchema = z.object({
    body: namaKategoriBody,
    params: z.object({
        id: z.string().min(1, "ID kategori wajib ada")
    })
});
