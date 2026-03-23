import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Search, User, BookOpen } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const RiwayatTransaksi = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(number);
    };

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

    useEffect(() => {
        let result = transactions;
        if (filterStatus === 'Denda') result = result.filter(item => item.Denda > 0);
        else if (filterStatus === 'Dipinjam') result = result.filter(item => item.StatusPeminjaman === 'Dipinjam');
        else if (filterStatus === 'Dikembalikan') result = result.filter(item => item.StatusPeminjaman === 'Dikembalikan');

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(item => 
                item.JudulBuku.toLowerCase().includes(lower) ||
                item.NamaPeminjam.toLowerCase().includes(lower)
            );
        }
        setFilteredData(result);
    }, [searchTerm, filterStatus, transactions]);

    const statusColors = {
        'Dipinjam': 'bg-[#00E5FF]',
        'Dikembalikan': 'bg-[#AEEA00]',
        'Ditolak': 'bg-[#FF4081] text-white',
        'Menunggu': 'bg-[#FFD600]',
        'Menunggu Pengembalian': 'bg-[#FFD600]',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Rekap</div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <History size={32} /> Riwayat Transaksi
                    </h2>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Rekap semua peminjaman, pengembalian, dan denda.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-black" size={18} />
                        <input 
                            type="text" 
                            placeholder="CARI PEMINJAM ATAU BUKU..." 
                            className="pl-10 pr-4 py-2.5 bg-white brutal-border font-black uppercase text-xs focus:outline-none focus:bg-[#AEEA00] transition-colors w-full sm:w-64 placeholder:text-black/30"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2.5 bg-white brutal-border font-black uppercase text-xs focus:outline-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">Semua Status</option>
                        <option value="Dipinjam">Sedang Dipinjam</option>
                        <option value="Dikembalikan">Sudah Kembali</option>
                        <option value="Denda">Terkena Denda</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-4 font-black uppercase text-xs">Peminjam</th>
                                    <th className="p-4 font-black uppercase text-xs">Buku</th>
                                    <th className="p-4 font-black uppercase text-xs">Tgl Pinjam</th>
                                    <th className="p-4 font-black uppercase text-xs">Tgl Kembali</th>
                                    <th className="p-4 font-black uppercase text-xs text-center">Status</th>
                                    <th className="p-4 font-black uppercase text-xs text-right">Denda</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center font-black uppercase text-black/40">Data tidak ditemukan.</td></tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={item.PeminjamanID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/20 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#AEEA00] brutal-border flex items-center justify-center">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-sm uppercase">{item.NamaPeminjam}</div>
                                                        <div className="text-[10px] font-bold text-black/40 uppercase">ID: {item.UserID}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen size={14} className="text-black/40 shrink-0" />
                                                    <span className="text-sm font-bold uppercase line-clamp-1 max-w-[150px]" title={item.JudulBuku}>{item.JudulBuku}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-bold text-black/60 uppercase">{formatDate(item.TanggalPeminjaman)}</td>
                                            <td className="p-4 text-xs font-bold uppercase">{formatDate(item.TanggalPengembalian)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 brutal-border text-[10px] font-black uppercase ${statusColors[item.StatusPeminjaman] || 'bg-white'}`}>
                                                    {item.StatusPeminjaman}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {item.Denda > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="bg-[#FF4081] text-white font-black text-xs px-2 py-1 brutal-border whitespace-nowrap">{formatRupiah(item.Denda)}</span>
                                                        <span className="text-[10px] font-black uppercase text-[#FF4081] mt-1">Terlambat</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-black/30 text-sm font-black">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="text-center font-black uppercase text-xs text-black/40">
                Menampilkan {filteredData.length} transaksi
            </div>
        </div>
    );
};

export default RiwayatTransaksi;