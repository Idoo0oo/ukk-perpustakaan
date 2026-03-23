const { z } = require('zod');

// FormData dari Client biasanya mengirim semuanya sebagai string
exports.createBukuSchema = z.object({
    body: z.object({
        judul: z.string().min(1, "Judul buku wajib diisi"),
        penulis: z.string().min(1, "Penulis wajib diisi"),
        penerbit: z.string().min(1, "Penerbit wajib diisi"),
        tahunTerbit: z.string().regex(/^\d{4}$/, "Tahun terbit harus berupa 4 digit angka"),
        stok: z.string().regex(/^\d+$/, "Stok harus berupa angka positif"),
        kategoriIds: z.string().optional() // Bersifat opsional karena dikirim via stringified array
    })
});

exports.updateBukuSchema = z.object({
    body: z.object({
        judul: z.string().min(1, "Judul buku wajib diisi"),
        penulis: z.string().min(1, "Penulis wajib diisi"),
        penerbit: z.string().min(1, "Penerbit wajib diisi"),
        tahunTerbit: z.string().regex(/^\d{4}$/, "Tahun terbit harus berupa 4 digit angka"),
        stok: z.string().regex(/^\d+$/, "Stok harus berupa angka positif"),
        kategoriIds: z.string().optional() 
    }),
    params: z.object({
        id: z.string().min(1, "Buku ID wajib ada")
    })
});
