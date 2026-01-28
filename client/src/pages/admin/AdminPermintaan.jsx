import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    BookOpen, User, CheckCircle, XCircle, Clock, CalendarDays, 
    ArrowRightLeft, BookUp, BookDown 
} from 'lucide-react';

const AdminPermintaan = () => {
    const [borrowRequests, setBorrowRequests] = useState([]); // Data Peminjaman
    const [returnRequests, setReturnRequests] = useState([]); // Data Pengembalian
    const [activeTab, setActiveTab] = useState('borrow'); // 'borrow' atau 'return'
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Fetch Data (Peminjaman & Pengembalian)
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resBorrow, resReturn] = await Promise.all([
                axios.get('http://localhost:5000/api/peminjaman/pending', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/peminjaman/return-requests', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            setBorrowRequests(resBorrow.data);
            setReturnRequests(resReturn.data);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGIKA PEMINJAMAN ---
    const handleApproveBorrow = async (id, judul, nama) => {
        const result = await Swal.fire({
            title: 'Setujui Peminjaman?',
            html: `Izinkan <b>${nama}</b> meminjam <br/> "<i>${judul}</i>"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Setujui',
            confirmButtonColor: '#10b981'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire('Sukses', 'Peminjaman disetujui!', 'success');
                fetchData();
            } catch (err) { Swal.fire('Gagal', 'Terjadi kesalahan.', 'error'); }
        }
    };

    const handleRejectBorrow = async (id) => {
        const result = await Swal.fire({
            title: 'Tolak Peminjaman?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak',
            confirmButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire('Ditolak', 'Permintaan ditolak.', 'success');
                fetchData();
            } catch (err) { Swal.fire('Gagal', 'Terjadi kesalahan.', 'error'); }
        }
    };

    // --- LOGIKA PENGEMBALIAN ---
    const handleConfirmReturn = async (id, judul, nama) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Pengembalian?',
            html: `Pastikan buku "<i>${judul}</i>" dari <b>${nama}</b> sudah Anda terima fisiknya dengan kondisi baik.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ya, Buku Diterima',
            confirmButtonColor: '#3b82f6', // Biru
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                // Panggil endpoint kembalikanBuku yang sudah ada
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/return`, {}, { headers: { Authorization: `Bearer ${token}` } });
                
                Swal.fire('Selesai!', 'Buku berhasil dikembalikan ke stok.', 'success');
                fetchData();
            } catch (err) { Swal.fire('Gagal', err.response?.data?.message || 'Gagal memproses.', 'error'); }
        }
    };

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ArrowRightLeft className="text-indigo-600" /> Pusat Transaksi
                    </h2>
                    <p className="text-gray-500 text-sm">Kelola permintaan masuk dan keluar buku.</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveTab('borrow')}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
                        activeTab === 'borrow' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <BookUp size={18} /> Peminjaman Baru
                    {borrowRequests.length > 0 && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">{borrowRequests.length}</span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('return')}
                    className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
                        activeTab === 'return' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <BookDown size={18} /> Pengembalian Buku
                    {returnRequests.length > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{returnRequests.length}</span>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>
                ) : (
                    <>
                        {/* TAB 1: PEMINJAMAN BARU */}
                        {activeTab === 'borrow' && (
                            borrowRequests.length === 0 ? (
                                <EmptyState text="Tidak ada permintaan peminjaman baru." />
                            ) : (
                                <TableRequests 
                                    data={borrowRequests} 
                                    type="borrow" 
                                    onApprove={handleApproveBorrow} 
                                    onReject={handleRejectBorrow} 
                                    formatDate={formatDate}
                                />
                            )
                        )}

                        {/* TAB 2: PENGEMBALIAN BUKU */}
                        {activeTab === 'return' && (
                            returnRequests.length === 0 ? (
                                <EmptyState text="Tidak ada pengajuan pengembalian buku." />
                            ) : (
                                <TableRequests 
                                    data={returnRequests} 
                                    type="return" 
                                    onApprove={handleConfirmReturn} 
                                    formatDate={formatDate}
                                />
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Sub-Component untuk Empty State
const EmptyState = ({ text }) => (
    <div className="p-16 text-center text-gray-400 flex flex-col items-center">
        <div className="bg-gray-50 p-4 rounded-full mb-3"><BookOpen size={32} /></div>
        <p>{text}</p>
    </div>
);

// Sub-Component untuk Tabel (Reusable)
const TableRequests = ({ data, type, onApprove, onReject, formatDate }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                <tr>
                    <th className="p-4">No</th>
                    <th className="p-4">Buku</th>
                    <th className="p-4">Siswa</th>
                    <th className="p-4">{type === 'borrow' ? 'Tgl Ajuan' : 'Batas Kembali'}</th>
                    <th className="p-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {data.map((item, idx) => (
                    <tr key={item.PeminjamanID} className="hover:bg-slate-50">
                        <td className="p-4 text-gray-400">{idx + 1}</td>
                        <td className="p-4 font-bold text-gray-800">{item.JudulBuku}</td>
                        <td className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                    {item.NamaPeminjam?.charAt(0)}
                                </div>
                                <span className="text-sm">{item.NamaPeminjam}</span>
                            </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CalendarDays size={14} />
                                {formatDate(type === 'borrow' ? item.TanggalPeminjaman : item.TanggalPengembalian)}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            {type === 'borrow' ? (
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => onApprove(item.PeminjamanID, item.JudulBuku, item.NamaPeminjam)} className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none"><CheckCircle size={14}/> Terima</button>
                                    <button onClick={() => onReject(item.PeminjamanID)} className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"><XCircle size={14}/></button>
                                </div>
                            ) : (
                                <button onClick={() => onApprove(item.PeminjamanID, item.JudulBuku, item.NamaPeminjam)} className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none w-full md:w-auto">
                                    <CheckCircle size={14} className="mr-1"/> Konfirmasi Diterima
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminPermintaan;