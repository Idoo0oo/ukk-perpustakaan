# Arsitektur Sistem - ukk-perpustakaan

## 📋 Gambaran Umum

**ukk-perpustakaan** adalah sistem manajemen perpustakaan digital berbasis web dengan arsitektur full-stack modern. Sistem ini memungkinkan pengelolaan peminjaman buku secara digital dengan role-based access control untuk admin dan peminjam, dibalut desain **Neo-Brutalism** yang modern.

## 🏗️ Struktur Folder

```
ukk-perpustakaan/
├── client/                      # Frontend React + Vite
│   ├── src/
│   │   ├── App.jsx             # Routing utama aplikasi
│   │   ├── main.jsx            # Entry point React
│   │   ├── index.css           # Global styles + Neo-Brutalism utilities
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── usePageTitle.js  # Dynamic document title
│   │   │   └── useProfilePhoto.js  # Fetch & cache foto profil user
│   │   └── pages/              # Halaman aplikasi
│   │        ├── LandingPage.jsx
│   │        ├── Login.jsx
│   │        ├── Register.jsx
│   │        ├── AdminDashboard.jsx    # Layout shell admin (navbar, header)
│   │        ├── DashboardSiswa.jsx   # Katalog buku peminjam
│   │        ├── PinjamanSaya.jsx     # Daftar pinjaman peminjam
│   │        ├── KoleksiSaya.jsx      # Koleksi/bookmark buku
│   │        ├── ProfilSiswa.jsx      # Profil peminjam (foto, info, password)
│   │        └── admin/              # Halaman khusus admin
│   │             ├── DashboardHome.jsx
│   │             ├── KelolaBuku.jsx
│   │             ├── KelolaKategori.jsx
│   │             ├── DataSiswa.jsx
│   │             ├── DataUlasan.jsx
│   │             ├── AdminPermintaan.jsx
│   │             ├── RiwayatTransaksi.jsx
│   │             ├── Laporan.jsx
│   │             └── ValidasiPendaftaran.jsx
│   ├── public/
│   └── package.json
│
└── server/                      # Backend Node.js + Express
    ├── config/
    │   └── db.js                # Konfigurasi database MySQL (connection pool)
    ├── controllers/             # Business logic
    │   ├── authController.js    # Autentikasi (login, register)
    │   ├── bukuController.js    # CRUD buku + multi-kategori + upload gambar
    │   ├── kategoriController.js
    │   ├── userController.js    # Manajemen user (admin only)
    │   ├── profileController.js # Self-service profil peminjam
    │   ├── peminjamanController.js  # Peminjaman & pengembalian
    │   ├── ulasanController.js
    │   ├── laporanController.js
    │   └── fiturController.js   # Koleksi & ulasan
    ├── middleware/
    │   └── authMiddleware.js    # JWT verification & role check
    ├── routes/                  # API endpoints
    │   ├── authRoutes.js
    │   ├── bukuRoutes.js
    │   ├── kategoriRoutes.js
    │   ├── userRoutes.js
    │   ├── profileRoutes.js     # Profil self-service + upload foto
    │   ├── peminjamanRoutes.js
    │   ├── ulasanRoutes.js
    │   ├── laporanRoutes.js
    │   └── fiturRoutes.js
    ├── uploads/                 # File upload storage (gambar buku & foto profil)
    ├── sql/
    │   └── db_perpustakaan_full.sql  # Database schema (lengkap dengan FotoProfil)
    ├── index.js                 # Server entry point
    ├── seedAdmin.js             # Data seeder admin
    └── package.json
```

## 💻 Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Router**: React Router DOM 7.13.0
- **CSS Framework**: TailwindCSS 4.1.18
- **Design System**: Neo-Brutalism (custom utility classes di `index.css`)
- **Animations**: Framer Motion 12.29.0
- **HTTP Client**: Axios 1.13.3
- **Notifications**: SweetAlert2 11.26.17
- **Charts**: Chart.js 4.5.1 + react-chartjs-2
- **Icons**: Lucide React 0.563.0
- **Date Handling**: date-fns 4.1.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MySQL dengan mysql2 3.16.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **File Upload**: Multer 2.0.2
- **CORS**: cors 2.8.6
- **Environment Variables**: dotenv 17.2.3

### Development
- **Server Dev**: nodemon 3.1.11
- **Code Quality**: ESLint 9.39.1

## 🎯 Arsitektur Sistem

### Pattern: MVC (Model-View-Controller)

```
┌─────────────┐
│   Client    │  (View)
│   React UI  │
└──────┬──────┘
       │ HTTP Requests (Axios)
       ↓
┌─────────────────────────────────────┐
│         Express Server               │
│  ┌─────────────────────────────┐   │
│  │ Middleware Layer             │   │
│  │  • CORS                      │   │
│  │  • express.json()            │   │
│  │  • JWT Verification          │   │
│  │  • Role-based Access Control │   │
│  └───────────┬──────────────────┘   │
│              ↓                       │
│  ┌─────────────────────────────┐   │
│  │ Routes Layer                 │   │
│  │  /api/auth                   │   │
│  │  /api/buku                   │   │
│  │  /api/peminjaman             │   │
│  │  /api/kategori               │   │
│  │  /api/ulasan                 │   │
│  │  /api/users     (admin)      │   │
│  │  /api/laporan   (admin)      │   │
│  │  /api/fitur                  │   │
│  │  /api/profile   (peminjam)   │   │
│  └───────────┬──────────────────┘   │
│              ↓                       │
│  ┌─────────────────────────────┐   │
│  │ Controllers Layer            │   │
│  │  (Business Logic)            │   │
│  └───────────┬──────────────────┘   │
│              ↓                       │
│  ┌─────────────────────────────┐   │
│  │ Database Layer               │   │
│  │  (Connection Pool)           │   │
│  └───────────┬──────────────────┘   │
└──────────────┼──────────────────────┘
               ↓
         ┌──────────┐
         │  MySQL   │  (Model)
         │ Database │
         └──────────┘
```

## 🔐 Sistem Autentikasi

### Flow Autentikasi

1. **Registrasi**
   - User mendaftar dengan role default `'peminjam'`
   - Status account: `'Menunggu'` (requires admin approval)
   - Password di-hash dengan bcryptjs

2. **Login**
   - Validasi username & password
   - Check status account activation
   - Generate JWT token dengan payload: `{ id, role }`
   - Expire time: 1 hari

3. **Protected Routes**
   - Middleware `verifyToken` untuk autentikasi
   - Middleware `isAdmin` untuk role checking
   - Client menyimpan token di localStorage

### Role-Based Access Control (RBAC)

| Role | Access |
|------|--------|
| **Admin** | Semua endpoint admin (approval peminjaman, CRUD buku, laporan, validasi user) |
| **Peminjam** | Katalog buku, ajukan peminjaman, koleksi pribadi, ulasan, profil sendiri |
| **Public** | Landing page, login, register |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| POST | `/api/auth/register` | Public | Registrasi user baru |
| POST | `/api/auth/login` | Public | Login & generate JWT |

### Books
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| GET | `/api/buku` | Authenticated | Ambil semua buku |
| GET | `/api/buku/:id` | Authenticated | Detail buku |
| POST | `/api/buku` | Admin | Tambah buku baru (upload gambar) |
| PUT | `/api/buku/:id` | Admin | Update buku |
| DELETE | `/api/buku/:id` | Admin | Hapus buku |

### Categories
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| GET | `/api/kategori` | Public | Ambil semua kategori |
| POST | `/api/kategori` | Admin | Tambah kategori |
| PUT | `/api/kategori/:id` | Admin | Update kategori |
| DELETE | `/api/kategori/:id` | Admin | Hapus kategori |

### Borrowing (Peminjaman)
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| POST | `/api/peminjaman` | Peminjam | Ajukan peminjaman |
| GET | `/api/peminjaman` | Authenticated | Riwayat pinjaman (filtered by role) |
| GET | `/api/peminjaman/pending` | Admin | Daftar pending approval |
| GET | `/api/peminjaman/return-requests` | Admin | Daftar pending return |
| GET | `/api/peminjaman/history` | Admin | Semua riwayat |
| PUT | `/api/peminjaman/:id/approve` | Admin | Approve peminjaman |
| PUT | `/api/peminjaman/:id/reject` | Admin | Reject peminjaman |
| PUT | `/api/peminjaman/:id/kembali` | Peminjam | Ajukan pengembalian |
| PUT | `/api/peminjaman/:id/return` | Admin | Konfirmasi pengembalian + hitung denda |

### Users (Admin Only)
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| GET | `/api/users?status=Menunggu` | Admin | Daftar user (filter by status) |
| PUT | `/api/users/:id/verify` | Admin | Aktivasi akun user |
| DELETE | `/api/users/:id` | Admin | Hapus user |

### Profile (Self-Service Peminjam)
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| GET | `/api/profile` | Peminjam | Ambil data profil sendiri |
| PUT | `/api/profile` | Peminjam | Update nama, email, alamat |
| PUT | `/api/profile/password` | Peminjam | Ganti password (verifikasi password lama) |
| POST | `/api/profile/photo` | Peminjam | Upload foto profil (multipart/form-data) |

### Features (Koleksi & Ulasan)
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| POST | `/api/fitur/koleksi` | Authenticated | Toggle bookmark |
| GET | `/api/fitur/koleksi` | Authenticated | Daftar koleksi pribadi |
| POST | `/api/fitur/ulasan` | Authenticated | Tambah ulasan (dengan validasi) |
| GET | `/api/fitur/ulasan/:bukuID` | Authenticated | Ulasan per buku |
| GET | `/api/fitur/admin/all-ulasan` | Admin | Semua ulasan |
| DELETE | `/api/fitur/admin/ulasan/:id` | Admin | Hapus ulasan |

### Reports
| Method | Endpoint | Access | Deskripsi |
|--------|----------|--------|-----------|
| GET | `/api/laporan/peminjaman?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Admin | Laporan peminjaman by date range |

## 🗄️ Database Schema (Simplified)

```sql
-- Users
user
├── UserID (PK)
├── Username
├── Password (hashed bcrypt)
├── Email
├── NamaLengkap
├── Alamat
├── FotoProfil (filename, nullable)   -- ← Foto profil peminjam
├── Role ('admin', 'peminjam')
├── Status ('Menunggu', 'Aktif', 'Ditolak')
└── CreatedAt

-- Books
buku
├── BukuID (PK)
├── Judul
├── Penulis
├── Penerbit
├── TahunTerbit
├── Stok
├── Gambar (filename)
└── CreatedAt

-- Categories
kategoribuku
├── KategoriID (PK)
└── NamaKategori

-- Book-Category Relation (Many-to-Many)
kategoribuku_relasi
├── BukuID (FK → buku)
└── KategoriID (FK → kategoribuku)

-- Borrowing
peminjaman
├── PeminjamanID (PK)
├── UserID (FK → user)
├── BukuID (FK → buku)
├── TanggalPeminjaman
├── TanggalPengembalian
├── StatusPeminjaman ('Menunggu', 'Dipinjam', 'Menunggu Pengembalian', 'Dikembalikan', 'Ditolak')
└── Denda

-- Reviews
ulasanbuku
├── UlasanID (PK)
├── UserID (FK → user)
├── BukuID (FK → buku)
├── Rating (1-5)
├── Ulasan (text)
└── TanggalUlasan

-- Personal Collection
koleksipribadi
├── KoleksiID (PK)
├── UserID (FK → user)
└── BukuID (FK → buku)
```

## 🔄 Data Flow Example: Peminjaman Buku

```
1. Peminjam Request
   └─> POST /api/peminjaman { bukuID, lamaPinjam }
       └─> Controller: pinjamBuku()
           ├─> Validate: 1-14 hari
           ├─> Check stok > 0
           ├─> Insert peminjaman dengan status 'Menunggu'
           └─> Response: "Permintaan diajukan"

2. Admin Approve
   └─> PUT /api/peminjaman/:id/approve
       └─> Controller: approvePeminjaman()
           ├─> Get request data
           ├─> Set TanggalPeminjaman = TODAY
           ├─> Set TanggalPengembalian = TODAY + durasi
           ├─> Update status = 'Dipinjam'
           ├─> Kurangi stok buku
           └─> Response: "Peminjaman disetujui"

3. Peminjam Return Request
   └─> PUT /api/peminjaman/:id/kembali
       └─> Controller: ajukanPengembalian()
           ├─> Validate status = 'Dipinjam'
           ├─> Update status = 'Menunggu Pengembalian'
           └─> Response: "Pengajuan berhasil"

4. Admin Konfirmasi Return
   └─> PUT /api/peminjaman/:id/return
       └─> Controller: kembalikanBuku()
           ├─> Get deadline & today
           ├─> Calculate denda (Rp 1.000/hari if terlambat)
           ├─> Update status = 'Dikembalikan'
           ├─> Tambah stok buku
           └─> Response: { denda, terlambat }
```

## 🎨 UI/UX Design System — Neo-Brutalism

Seluruh antarmuka menggunakan tema **Neo-Brutalism** yang konsisten:

### Color Palette
| Token | Hex | Penggunaan |
|-------|-----|------------|
| Background | `#FFFBEB` | Latar belakang halaman |
| Lime | `#AEEA00` | Aksi positif, approve, avatar |
| Yellow | `#FFD600` | Header, form card, hover |
| Cyan | `#00E5FF` | Return, koleksi, info |
| Pink | `#FF4081` | Danger, delete, reject |
| Black | `#000000` | Border, header tabel, teks |

### Utility Classes (`index.css`)
```css
.brutal-border       /* border: 2px solid black */
.brutal-border-heavy /* border: 3-4px solid black */
.brutal-shadow       /* box-shadow: 4px 4px 0 black */
.brutal-shadow-lg    /* box-shadow: 6px 6px 0 black */
.brutal-shadow-sm    /* box-shadow: 2px 2px 0 black */
```

### Typography
- Font: `font-mono` (monospace) untuk seluruh antarmuka
- Heading: `font-black uppercase tracking-tighter`
- Label: `font-black uppercase text-[10px]`

### Animations
- Framer Motion untuk page transitions & modal animations
- Hover effects: `hover:translate-x-1 hover:translate-y-1 hover:shadow-none`
- Navbar hide: `AnimatePresence` dengan `y: 80, opacity: 0` saat modal terbuka

## 🔒 Security Implementation

1. **Password Security**: bcryptjs hashing (10 rounds) — pada register & ganti password
2. **JWT Authentication**: Token expire 1 hari, payload `{ id, role }`
3. **CORS**: Configured untuk cross-origin requests
4. **File Upload**: Multer dengan batas 5MB untuk foto profil, 2MB untuk gambar buku
5. **SQL Injection Prevention**: Parameterized queries dengan mysql2
6. **Role Verification**: Middleware `verifyToken` + `isAdmin` di semua route sensitif
7. **Password Change Verification**: `bcrypt.compare` memastikan password lama sebelum update

## 📦 File Upload System

**Path**: `server/uploads/`

**Buku** (via `bukuRoutes.js`):
- Filename: `timestamp + ext`
- Filter: JPG, JPEG, PNG only
- Size limit: 2MB

**Foto Profil** (via `profileRoutes.js`):
- Filename: `profil_{userID}_{timestamp}.ext`
- Filter: semua image
- Size limit: 5MB

Static serve: `GET /uploads/:filename`

## 🧪 Custom Hooks

| Hook | File | Fungsi |
|------|------|--------|
| `usePageTitle(title)` | `hooks/usePageTitle.js` | Set `document.title` dinamis |
| `useProfilePhoto()` | `hooks/useProfilePhoto.js` | Fetch & return URL foto profil, `null` jika belum upload |

## 🚀 Development Workflow

### Backend
```bash
cd server
npm install
npm run dev  # nodemon localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev  # vite localhost:5173
```

### Database Setup
```bash
# Import schema (sudah termasuk kolom FotoProfil)
mysql -u root -p < server/sql/db_perpustakaan_full.sql

# Seed admin user
node server/seedAdmin.js
```

## 📝 Notes

- **Timezone Handling**: Helper function `getLocalDate()` untuk prevent UTC shift
- **Multi-Category**: Buku support multiple categories via junction table `kategoribuku_relasi`
- **Auto-Calculation**: Denda terlambat dihitung otomatis (Rp 1.000/hari)
- **Review Validation**: User harus sudah pinjam & kembalikan buku sebelum review
- **Status Workflow**: `Menunggu → Dipinjam → Menunggu Pengembalian → Dikembalikan`
- **Modal UX**: Bottom navbar otomatis tersembunyi saat modal terbuka via custom window events (`admin:modal:open` / `admin:modal:close`)
- **Navbar Hover**: Bottom nav admin menampilkan label saat hover, hanya ikon saat idle
- **Profile Photo Fallback**: Avatar peminjam menampilkan foto profil jika ada, atau silhouette abu-abu (default) jika belum diunggah