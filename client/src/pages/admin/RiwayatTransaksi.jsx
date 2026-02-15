import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    History, Search, User, BookOpen 
} from 'lucide-react';

const RiwayatTransaksi = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Denda, Dipinjam
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Format Tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Ambil Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/peminjaman', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
                setFilteredData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // Logika Filter & Search
    useEffect(() => {
        let result = transactions;

        // 1. Filter Status
        if (filterStatus === 'Denda') {
            result = result.filter(item => item.Denda > 0);
        } else if (filterStatus === 'Dipinjam') {
            result = result.filter(item => item.StatusPeminjaman === 'Dipinjam');
        } else if (filterStatus === 'Dikembalikan') {
            result = result.filter(item => item.StatusPeminjaman === 'Dikembalikan');
        }

        // 2. Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(item => 
                item.JudulBuku.toLowerCase().includes(lower) ||
                item.NamaPeminjam.toLowerCase().includes(lower)
            );
        }

        setFilteredData(result);
    }, [searchTerm, filterStatus, transactions]);

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <History className="text-indigo-600" size={28} /> Riwayat Transaksi
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Rekap semua peminjaman, pengembalian, dan denda.</p>
                </div>

                {/* Search & Filter Tools */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari siswa atau buku..." 
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm font-medium text-gray-600"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">Semua Status</option>
                        <option value="Dipinjam">Sedang Dipinjam</option>
                        <option value="Dikembalikan">Sudah Kembali</option>
                        <option value="Denda">⚠️ Terkena Denda</option>
                    </select>
                </div>
            </div>

            {/* Tabel Riwayat */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100">
                            <tr>
                                <th className="p-4">Peminjam</th>
                                <th className="p-4">Buku</th>
                                <th className="p-4">Tgl Pinjam</th>
                                <th className="p-4">Tgl Kembali / Jatuh Tempo</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Denda</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center"><span className="loading loading-spinner text-primary"></span></td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.PeminjamanID} className="hover:bg-slate-50 transition-colors">
                                        
                                        {/* Kolom Peminjam */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{item.NamaPeminjam}</div>
                                                    <div className="text-xs text-gray-400">ID: {item.UserID}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom Buku */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <BookOpen size={16} className="text-gray-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700 line-clamp-1 max-w-[150px]" title={item.JudulBuku}>
                                                    {item.JudulBuku}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Tanggal Pinjam */}
                                        <td className="p-4 text-sm text-gray-500">{formatDate(item.TanggalPeminjaman)}</td>
                                        
                                        {/* Tanggal Kembali (Selalu muncul) */}
                                        <td className="p-4 text-sm text-gray-500 font-semibold">
                                            {formatDate(item.TanggalPengembalian)}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                item.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-100 text-indigo-700' :
                                                item.StatusPeminjaman === 'Dikembalikan' ? 'bg-emerald-100 text-emerald-700' :
                                                item.StatusPeminjaman === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                                {item.StatusPeminjaman}
                                            </span>
                                        </td>

                                        {/* Kolom Denda */}
                                        <td className="p-4 text-right">
                                            {item.Denda > 0 ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100 whitespace-nowrap">
                                                        {formatRupiah(item.Denda)}
                                                    </span>
                                                    <span className="text-[10px] text-red-400 mt-1 font-medium">Terlambat</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-400">
                Menampilkan {filteredData.length} transaksi
            </div>
        </div>
    );
};

export default RiwayatTransaksi;