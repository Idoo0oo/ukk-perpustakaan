-- ==========================================
-- DATABASE INITIALIZATION
-- ==========================================
-- Hapus database lama jika ada (agar bersih saat reset)
DROP DATABASE IF EXISTS ukk_perpustakaan;

-- Buat database baru
CREATE DATABASE ukk_perpustakaan;
USE ukk_perpustakaan;

-- ==========================================
-- 1. Tabel User
-- ==========================================
CREATE TABLE user (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    NamaLengkap VARCHAR(255) NOT NULL,
    Alamat TEXT,
    Role ENUM('admin', 'peminjam') DEFAULT 'peminjam',
    Status ENUM('Menunggu', 'Aktif', 'Ditolak') DEFAULT 'Menunggu', -- Penting: Default Menunggu untuk Peminjam
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- 2. Tabel Kategori Buku
-- ==========================================
CREATE TABLE kategoribuku (
    KategoriID INT AUTO_INCREMENT PRIMARY KEY,
    NamaKategori VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- ==========================================
-- 3. Tabel Buku
-- ==========================================
CREATE TABLE buku (
    BukuID INT AUTO_INCREMENT PRIMARY KEY,
    Judul VARCHAR(255) NOT NULL,
    Penulis VARCHAR(255) NOT NULL,
    Penerbit VARCHAR(255) NOT NULL,
    TahunTerbit INT NOT NULL,
    Stok INT DEFAULT 0,
    Gambar VARCHAR(255) DEFAULT NULL,
    -- RatingRataRata & Deskripsi TIDAK DIMASUKKAN (Sesuai kode backend saat ini)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- 4. Tabel Relasi Kategori & Buku
-- ==========================================
CREATE TABLE kategoribuku_relasi (
    KategoriBukuID INT AUTO_INCREMENT PRIMARY KEY,
    BukuID INT NOT NULL,
    KategoriID INT NOT NULL,
    FOREIGN KEY (BukuID) REFERENCES buku(BukuID) ON DELETE CASCADE,
    FOREIGN KEY (KategoriID) REFERENCES kategoribuku(KategoriID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 5. Tabel Peminjaman (CORE SYSTEM)
-- ==========================================
CREATE TABLE peminjaman (
    PeminjamanID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    BukuID INT NOT NULL,
    TanggalPeminjaman DATE NOT NULL,
    TanggalPengembalian DATE NOT NULL,
    StatusPeminjaman ENUM('Menunggu', 'Dipinjam', 'Ditolak', 'Menunggu Pengembalian', 'Dikembalikan') DEFAULT 'Menunggu',
    Denda DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE,
    FOREIGN KEY (BukuID) REFERENCES buku(BukuID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 6. Tabel Ulasan Buku
-- ==========================================
CREATE TABLE ulasanbuku (
    UlasanID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    BukuID INT NOT NULL,
    Ulasan TEXT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    TanggalUlasan TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ganti CreatedAt jadi TanggalUlasan agar sesuai kode (opsional)
    FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE,
    FOREIGN KEY (BukuID) REFERENCES buku(BukuID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- 7. Tabel Koleksi Pribadi
-- ==========================================
CREATE TABLE koleksipribadi (
    KoleksiID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    BukuID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE,
    FOREIGN KEY (BukuID) REFERENCES buku(BukuID) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- DATA SEEDING (DATA AWAL)
-- ==========================================

-- 1. Insert Kategori Default
INSERT INTO kategoribuku (NamaKategori) VALUES 
('Fiksi'), 
('Non-Fiksi'), 
('Sains & Teknologi'), 
('Sejarah'), 
('Komik');

-- 2. Insert Admin Default
-- PENTING: Password ini hash dari 'admin123'
-- Jika login gagal, jalankan 'node seedAdmin.js' di terminal server
INSERT INTO user (Username, Password, Email, NamaLengkap, Alamat, Role, Status) 
VALUES 
('admin', '$2b$10$YourGeneratedHashHere', 'admin@sekolah.sch.id', 'Administrator Perpustakaan', 'Ruang IT', 'admin', 'Aktif'),

-- Catatan untuk Pengguna (Git Clone):
-- Password admin di atas hanyalah contoh hash placeholder.
-- SANGAT DISARANKAN untuk menjalankan perintah: 'npm run seed' atau 'node seedAdmin.js' 
-- di folder server setelah import database ini agar mendapatkan akun admin yang valid.