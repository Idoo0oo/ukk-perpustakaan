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

// Gunakan .promise() agar kita bisa menggunakan async/await di controller
module.exports = db.promise();