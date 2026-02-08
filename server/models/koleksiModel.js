const db = require('../config/db');

class KoleksiModel {
    static async add(userID, bukuID) {
        const [exist] = await db.query(
            "SELECT * FROM koleksipribadi WHERE UserID = ? AND BukuID = ?", 
            [userID, bukuID]
        );
        if (exist.length > 0) return false;

        await db.query(
            "INSERT INTO koleksipribadi (UserID, BukuID) VALUES (?, ?)", 
            [userID, bukuID]
        );
        return true;
    }

    static async findByUser(userID) {
        // PERHATIKAN: Tidak ada b.Deskripsi di sini
        const query = `
            SELECT k.KoleksiID, k.BukuID, b.Judul, b.Penulis, b.Gambar
            FROM koleksipribadi k
            JOIN buku b ON k.BukuID = b.BukuID
            WHERE k.UserID = ?
            ORDER BY k.KoleksiID DESC
        `;
        const [rows] = await db.query(query, [userID]);
        return rows;
    }

    static async remove(userID, bukuID) {
        return db.query(
            "DELETE FROM koleksipribadi WHERE UserID = ? AND BukuID = ?", 
            [userID, bukuID]
        );
    }
    
    static async checkStatus(userID, bukuID) {
         const [rows] = await db.query(
            "SELECT KoleksiID FROM koleksipribadi WHERE UserID = ? AND BukuID = ?", 
            [userID, bukuID]
        );
        return rows.length > 0;
    }
}

module.exports = KoleksiModel;