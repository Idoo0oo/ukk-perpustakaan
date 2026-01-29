import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    History as HistoryIcon, Search, Filter, Download, Calendar, 
    User, BookOpen, ArrowUpRight 
} from 'lucide-react';

const RiwayatTransaksi = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    const token = localStorage.getItem('token');

    // Format Tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/peminjaman/history', {
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
    }, []);

    // Logic Filter (Search + Status)
    useEffect(() => {
        let result = transactions;

        // 1. Filter Status
        if (statusFilter !== 'Semua') {
            result = result.filter(item => item.StatusPeminjaman === statusFilter);
        }

        // 2. Filter Search (Nama Siswa / Judul Buku)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item => 
                item.NamaPeminjam.toLowerCase().includes(lowerTerm) ||
                item.JudulBuku.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredData(result);
    }, [searchTerm, statusFilter, transactions]);

    // Helper Warna Status
    const getStatusBadge = (status) => {
        const styles = {
            'Dipinjam': 'bg-indigo-50 text-indigo-700 border-indigo-100',
            'Dikembalikan': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Ditolak': 'bg-red-50 text-red-700 border-red-100',
            'Menunggu': 'bg-orange-50 text-orange-700 border-orange-100',
            'Menunggu Pengembalian': 'bg-blue-50 text-blue-700 border-blue-100'
        };
        return styles[status] || 'bg-gray-50 text-gray-600';
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                       <HistoryIcon className="text-indigo-600" size={28} /> Riwayat Transaksi
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Rekapan lengkap semua peminjaman dan pengembalian buku.
                    </p>
                </div>
                
                {/* Tombol Cetak/Export (Opsional untuk pengembangan lanjut) */}
                <button className="btn btn-outline btn-sm gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400">
                    <Download size={16} /> Export Data
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama siswa atau judul buku..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Filter size={18} className="text-gray-400 min-w-[18px]" />
                    {['Semua', 'Dipinjam', 'Dikembalikan', 'Menunggu', 'Ditolak'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                                statusFilter === status 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>
                ) : filteredData.length === 0 ? (
                    <div className="p-16 text-center text-gray-400">
                        <HistoryIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Tidak ada riwayat transaksi yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-5 w-16 text-center">No</th>
                                    <th className="p-5">Siswa</th>
                                    <th className="p-5">Buku Dipinjam</th>
                                    <th className="p-5">Waktu Transaksi</th>
                                    <th className="p-5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredData.map((item, index) => (
                                    <tr key={item.PeminjamanID} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 text-center text-gray-400 font-medium">{index + 1}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{item.NamaPeminjam}</p>
                                                    <p className="text-xs text-gray-500">@{item.Username || 'user'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <BookOpen size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700 truncate" title={item.JudulBuku}>
                                                    {item.JudulBuku}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col text-xs text-gray-500 gap-1">
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpRight size={14} className="text-emerald-500" />
                                                    Pinjam: <span className="font-medium text-gray-700">{formatDate(item.TanggalPeminjaman)}</span>
                                                </div>
                                                {item.TanggalPengembalian && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-blue-500" />
                                                        Kembali: <span className="font-medium text-gray-700">{formatDate(item.TanggalPengembalian)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.StatusPeminjaman)}`}>
                                                {item.StatusPeminjaman}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-400">
                Menampilkan {filteredData.length} dari {transactions.length} total transaksi
            </div>
        </div>
    );
};

export default RiwayatTransaksi;