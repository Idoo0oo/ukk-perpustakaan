import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    BookOpen, CheckCircle, XCircle, Clock, CalendarDays, 
    ArrowRightLeft, BookUp, BookDown 
} from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const AdminPermintaan = () => {
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('borrow');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

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

    const handleApproveBorrow = async (id, judul, nama) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Setujui Peminjaman?</span>',
            html: `Izinkan <b>${nama}</b> meminjam <br/> "<i>${judul}</i>"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Setujui',
            confirmButtonColor: '#AEEA00',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });
        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Berhasil!</span>', text: 'Peminjaman disetujui!', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (err) { Swal.fire('Gagal', 'Terjadi kesalahan.', 'error'); }
        }
    };

    const handleRejectBorrow = async (id) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Tolak Peminjaman?</span>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });
        if (result.isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Ditolak!</span>', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (err) { Swal.fire('Gagal', 'Terjadi kesalahan.', 'error'); }
        }
    };

    const handleConfirmReturn = async (id, judul, nama) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Konfirmasi Pengembalian?</span>',
            text: `Pastikan buku "${judul}" dari ${nama} sudah diterima fisiknya.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Terima Buku',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                Swal.showLoading();
                const res = await axios.put(`http://localhost:5000/api/peminjaman/${id}/return`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { denda, terlambat } = res.data;
                if (denda > 0) {
                    Swal.fire({
                        title: '<span class="font-black uppercase">TERLAMBAT!</span>',
                        html: `<div class="text-left bg-red-50 p-4 border-4 border-black font-mono">
                            <p class="mb-2 font-bold uppercase text-sm">Terlambat <b>${terlambat} hari</b>.</p>
                            <p class="text-xl font-black uppercase">Denda: Rp ${denda.toLocaleString('id-ID')}</p>
                            <p class="text-xs font-bold uppercase mt-2 text-black/50">*Tagih denda sebelum klik Oke.</p>
                        </div>`,
                        icon: 'warning',
                        confirmButtonText: 'Oke, Mengerti',
                        customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono', confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm' }
                    });
                } else {
                    Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Berhasil!</span>', text: 'Buku dikembalikan tepat waktu. Tidak ada denda.', timer: 2000, showConfirmButton: false });
                }
                fetchData();
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Gagal memproses.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">
                    Manajemen
                </div>
                <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                    <ArrowRightLeft size={32} /> Pusat Transaksi
                </h2>
                <p className="font-bold uppercase text-black/50 text-xs mt-2">Kelola permintaan masuk dan keluar buku.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-3">
                <button 
                    onClick={() => setActiveTab('borrow')}
                    className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm brutal-border transition-all ${
                        activeTab === 'borrow' 
                        ? 'bg-black text-white brutal-shadow-sm' 
                        : 'bg-white text-black hover:bg-[#FFD600]'
                    }`}
                >
                    <BookUp size={18} /> Peminjaman Baru
                    {borrowRequests.length > 0 && (
                        <span className="bg-[#FF4081] text-white text-[10px] px-2 py-0.5 font-black">{borrowRequests.length}</span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('return')}
                    className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm brutal-border transition-all ${
                        activeTab === 'return' 
                        ? 'bg-black text-white brutal-shadow-sm' 
                        : 'bg-white text-black hover:bg-[#00E5FF]'
                    }`}
                >
                    <BookDown size={18} /> Pengembalian Buku
                    {returnRequests.length > 0 && (
                        <span className="bg-[#00E5FF] text-black text-[10px] px-2 py-0.5 font-black">{returnRequests.length}</span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden min-h-[300px]">
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <>
                        {activeTab === 'borrow' && (
                            borrowRequests.length === 0 
                                ? <EmptyState text="Tidak ada permintaan peminjaman baru." />
                                : <TableRequests data={borrowRequests} type="borrow" onApprove={handleApproveBorrow} onReject={handleRejectBorrow} formatDate={formatDate} />
                        )}
                        {activeTab === 'return' && (
                            returnRequests.length === 0 
                                ? <EmptyState text="Tidak ada pengajuan pengembalian buku." />
                                : <TableRequests data={returnRequests} type="return" onApprove={handleConfirmReturn} formatDate={formatDate} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ text }) => (
    <div className="p-16 text-center flex flex-col items-center gap-4">
        <div className="bg-[#AEEA00] brutal-border p-4 w-16 h-16 flex items-center justify-center">
            <BookOpen size={32} />
        </div>
        <p className="font-black uppercase text-sm">{text}</p>
    </div>
);

const TableRequests = ({ data, type, onApprove, onReject, formatDate }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left font-mono">
            <thead className="bg-black text-white">
                <tr>
                    <th className="p-4 font-black uppercase text-xs">No</th>
                    <th className="p-4 font-black uppercase text-xs">Buku</th>
                    <th className="p-4 font-black uppercase text-xs">Peminjam</th>
                    <th className="p-4 font-black uppercase text-xs">Tgl Pinjam</th>
                    <th className="p-4 font-black uppercase text-xs">{type === 'borrow' ? 'Rencana Kembali' : 'Batas Kembali'}</th>
                    <th className="p-4 font-black uppercase text-xs text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => (
                    <tr key={item.PeminjamanID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/20 transition-colors">
                        <td className="p-4 font-black text-black/40 text-sm">{idx + 1}</td>
                        <td className="p-4 font-black uppercase text-sm">{item.JudulBuku}</td>
                        <td className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#AEEA00] brutal-border flex items-center justify-center text-xs font-black">
                                    {item.NamaPeminjam?.charAt(0)}
                                </div>
                                <span className="text-sm font-bold uppercase">{item.NamaPeminjam}</span>
                            </div>
                        </td>
                        <td className="p-4 text-sm font-bold uppercase text-black/60">
                            <div className="flex items-center gap-2">
                                <CalendarDays size={14} />
                                {formatDate(item.TanggalPeminjaman)}
                            </div>
                        </td>
                        <td className="p-4 text-sm font-bold uppercase">
                            <div className="flex items-center gap-2 text-[#FF4081]">
                                <CalendarDays size={14} />
                                {formatDate(item.TanggalPengembalian)}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            {type === 'borrow' ? (
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => onApprove(item.PeminjamanID, item.JudulBuku, item.NamaPeminjam)} className="flex items-center gap-1 px-4 py-2 bg-[#AEEA00] brutal-border brutal-shadow-sm font-black uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                                        <CheckCircle size={14} /> Terima
                                    </button>
                                    <button onClick={() => onReject(item.PeminjamanID)} className="flex items-center gap-1 px-3 py-2 bg-white brutal-border brutal-shadow-sm font-black uppercase text-xs hover:bg-[#FF4081] hover:text-white transition-all">
                                        <XCircle size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => onApprove(item.PeminjamanID, item.JudulBuku, item.NamaPeminjam)} className="flex items-center gap-1 px-4 py-2 bg-[#00E5FF] brutal-border brutal-shadow-sm font-black uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all mx-auto">
                                    <CheckCircle size={14} /> Konfirmasi
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