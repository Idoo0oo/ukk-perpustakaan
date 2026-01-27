import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PinjamanSaya = () => {
    const [loans, setLoans] = useState([]);
    const token = localStorage.getItem('token');

    const fetchLoans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/peminjaman', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchLoans(); }, []);

    const calculateCountdown = (deadline) => {
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `${diff} Hari Lagi` : "Waktunya Kembali!";
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-sm mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Status Pinjaman Buku</h2>
            <div className="space-y-4">
                {loans.length === 0 && <p className="text-gray-400 italic">Belum ada riwayat peminjaman.</p>}
                {loans.map(loan => (
                    <div key={loan.PeminjamanID} className="border p-5 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{loan.JudulBuku}</h3>
                            <p className="text-xs text-gray-500">Tgl Pinjam: {loan.TanggalPeminjaman}</p>
                            {loan.StatusPeminjaman === 'Dipinjam' && (
                                <div className="mt-2 flex items-center gap-2 text-indigo-600 font-bold">
                                    <AlertCircle size={16} className="animate-pulse" />
                                    <span>Sisa: {calculateCountdown(loan.TanggalPengembalian)}</span>
                                </div>
                            )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className={`badge border-none text-white font-bold p-3 ${
                                loan.StatusPeminjaman === 'Dipinjam' ? 'bg-green-500' : 
                                loan.StatusPeminjaman === 'Menunggu' ? 'bg-orange-400' : 'bg-red-500'
                            }`}>
                                {loan.StatusPeminjaman}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">Batas: {loan.TanggalPengembalian}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinjamanSaya;