const { z } = require('zod');

exports.updateProfileSchema = z.object({
    body: z.object({
        namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
        email: z.string().email("Format email tidak valid"),
        alamat: z.string().min(5, "Alamat minimal 5 karakter").optional()
    })
});

exports.changePasswordSchema = z.object({
    body: z.object({
        passwordLama: z.string().min(1, "Password lama wajib diisi"),
        passwordBaru: z.string().min(6, "Password baru minimal 6 karakter")
    })
});
