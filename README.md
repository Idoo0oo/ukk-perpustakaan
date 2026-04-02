# Sastra.in — Sistem Manajemen Perpustakaan Digital

Sistem manajemen perpustakaan digital full-stack berbasis web dengan desain **Neo-Brutalism** modern. Mendukung role-based access control untuk **Admin** dan **Peminjam**.

## ✨ Fitur Utama

**Admin**
- Dashboard statistik + grafik peminjaman
- Kelola buku (tambah, edit, hapus, upload cover)
- Kelola kategori buku
- Approval & penolakan permintaan pinjam / pengembalian
- Validasi pendaftaran akun siswa baru
- Manajemen data siswa & ulasan
- Laporan sirkulasi (filter rentang tanggal, cetak)

**Peminjam**
- Katalog buku + filter kategori + pencarian
- Pengajuan & pengembalian buku
- Koleksi pribadi (bookmark)
- Riwayat pinjaman & ulasan buku
- **Profil self-service**: ubah foto, nama, email, alamat & password

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS, DaisyUI, Framer Motion |
| Backend | Node.js, Express 5, MySQL |
| Auth | JWT + bcryptjs |
| Validation | Zod (input schema validation) |
| Rate Limiting | express-rate-limit |
| Upload | Multer (gambar buku & foto profil) |
| UI | Neo-Brutalism custom design system |

## 🚀 Cara Menjalankan

### 1. Clone & Setup Database
```bash
# Import schema database
mysql -u root -p < server/sql/db_perpustakaan_full.sql

# Buat akun admin default
cd server && node seedAdmin.js
```

### 2. Konfigurasi Environment
```bash
# server/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ukk_perpustakaan
JWT_SECRET=secret_perpustakaan
```

### 3. Jalankan Server
```bash
cd server && npm install && npm run dev
# → http://localhost:5000
```

### 4. Jalankan Client
```bash
cd client && npm install && npm run dev
# → http://localhost:5173
```

## 📁 Struktur Proyek

Lihat [ARCHITECTURE.md](./ARCHITECTURE.md) untuk:
- Struktur folder lengkap
- Semua API endpoints
- Database schema
- Data flow diagram
- Security implementation
- Design system Neo-Brutalism

## 🎨 Design System

Neo-Brutalism dengan palet:
- 🟡 `#FFD600` — Yellow (form, header)
- 🟢 `#AEEA00` — Lime (approve, sukses)
- 🔵 `#00E5FF` — Cyan (info, return)
- 🔴 `#FF4081` — Pink (danger, delete)
- ⬛ `#000000` — Border & tabel header

## 📄 Lisensi

Proyek ini dibuat untuk keperluan **Ujian Kompetensi Keahlian (UKK)**.