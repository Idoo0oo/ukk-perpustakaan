/**
 * Deskripsi File:
 * File ini bertanggung jawab untuk konfigurasi koneksi database MySQL dengan connection pooling.
 * Menggunakan mysql2/promise untuk mendukung async/await pattern.
 */

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ukk_perpustakaan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db.promise();