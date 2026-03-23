const { z } = require('zod');

exports.registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username minimal 3 karakter").max(50, "Username maksimal 50 karakter"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        email: z.string().email("Format email tidak valid"),
        namaLengkap: z.string().min(3, "Nama lengkap wajib diisi"),
        alamat: z.string().min(5, "Alamat wajib diisi")
    })
});

exports.loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username wajib diisi"),
        password: z.string().min(1, "Password wajib diisi")
    })
});
