import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Clock, CalendarDays, BookOpen, AlertCircle, 
    CheckCircle2, Hourglass, Book, LogOut 
} from 'lucide-react';

const PinjamanSaya = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // 1. Fungsi Format Tanggal Indonesia
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // 2. Hitung Sisa Hari (Countdown)
    const calculateCountdown = (deadline) => {
        const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: "Terlambat!", color: "text-red-600", bg: "bg-red-100" };
        if (diff === 0) return { text: "Hari Ini!", color: "text-orange-600", bg: "bg-orange-100" };
        return { text: `${diff} Hari Lagi`, color: "text-emerald-600", bg: "bg-emerald-100" };
    };

    const fetchLoans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/peminjaman', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(res.data);
            setLoading(false);
        } catch (err) { 
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchLoans(); }, []);

    // Handler Tombol Kembalikan (Logika: Mengajukan Pengembalian)
    const handleReturn = async (id, judul) => {
        const result = await Swal.fire({
            title: 'Kembalikan Buku?',
            text: `Apakah Anda ingin mengajukan pengembalian untuk buku "${judul}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6', // Biru
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Ajukan!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                // Tampilkan loading
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });

                // Panggil API Backend
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/kembali`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Diajukan!',
                    text: 'Status berubah menjadi "Menunggu Pengembalian". Silakan serahkan buku fisik ke Admin untuk verifikasi akhir.',
                });

                fetchLoans(); // Refresh halaman agar status berubah
            } catch (err) {
                console.error(err);
                Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            }
        }
    };

    // Handler Logout
    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?',
            text: "Sesi Anda akan berakhir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            confirmButtonColor: '#d33'
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* --- NAVBAR --- */}
            <nav className="bg-white shadow-sm sticky top-0 z-30 px-6 py-4 flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Book className="text-indigo-600" size={28} />
                    <span className="text-xl font-bold tracking-tight text-gray-800">PerpusDigital</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <Link to="/peminjam" className="font-medium text-gray-500 hover:text-indigo-600 transition">Katalog</Link>
                    <Link to="/peminjam/pinjaman-saya" className="font-medium text-indigo-600">Pinjaman Saya</Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm">
                        <LogOut size={18} /> Keluar
                    </button>
                </div>
            </nav>

            {/* --- KONTEN UTAMA --- */}
            <div className="p-6 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                    <BookOpen className="text-indigo-600" /> Pinjaman Saya
                </h2>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-400">Memuat data pinjaman...</p>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <BookOpen size={40} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">Kamu belum meminjam buku apapun.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {loans.map(loan => {
                            const countdown = calculateCountdown(loan.TanggalPengembalian);
                            
                            return (
                                <div key={loan.PeminjamanID} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    {/* Garis Warna Status di Kiri */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                        loan.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-500' :
                                        loan.StatusPeminjaman === 'Menunggu' ? 'bg-orange-400' :
                                        loan.StatusPeminjaman === 'Menunggu Pengembalian' ? 'bg-blue-500' :
                                        loan.StatusPeminjaman === 'Ditolak' ? 'bg-red-500' : 'bg-emerald-500'
                                    }`}></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                                        {/* Info Buku */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                                    loan.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-100 text-indigo-700' :
                                                    loan.StatusPeminjaman === 'Menunggu' ? 'bg-orange-100 text-orange-700' :
                                                    loan.StatusPeminjaman === 'Menunggu Pengembalian' ? 'bg-blue-100 text-blue-700' :
                                                    loan.StatusPeminjaman === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {loan.StatusPeminjaman}
                                                </span>
                                                {loan.StatusPeminjaman === 'Dipinjam' && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${countdown.bg} ${countdown.color}`}>
                                                        <Clock size={10} /> {countdown.text}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                                {loan.JudulBuku}
                                            </h3>
                                            
                                            {/* Tanggal yang sudah diformat */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={14} className="text-gray-400" />
                                                    <span>Pinjam: <span className="font-medium text-gray-700">{formatDate(loan.TanggalPeminjaman)}</span></span>
                                                </div>
                                                {loan.TanggalPengembalian && (
                                                    <div className="flex items-center gap-1.5">
                                                        <AlertCircle size={14} className="text-gray-400" />
                                                        <span>Batas: <span className="font-medium text-gray-700">{formatDate(loan.TanggalPengembalian)}</span></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tombol Aksi (Jika Status Dipinjam) */}
                                        {loan.StatusPeminjaman === 'Dipinjam' && (
                                            <button 
                                                onClick={() => handleReturn(loan.PeminjamanID, loan.JudulBuku)}
                                                className="btn btn-outline btn-sm border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 gap-2 normal-case font-medium w-full md:w-auto"
                                            >
                                                <CheckCircle2 size={16} />
                                                Kembalikan Buku
                                            </button>
                                        )}

                                        {/* Status Lain */}
                                        {loan.StatusPeminjaman === 'Menunggu' && (
                                            <div className="flex items-center gap-2 text-orange-500 text-sm font-medium bg-orange-50 px-3 py-2 rounded-lg">
                                                <Hourglass size={16} className="animate-pulse" />
                                                Menunggu Persetujuan Admin
                                            </div>
                                        )}
                                        {loan.StatusPeminjaman === 'Menunggu Pengembalian' && (
                                            <div className="flex items-center gap-2 text-blue-500 text-sm font-medium bg-blue-50 px-3 py-2 rounded-lg">
                                                <Hourglass size={16} className="animate-pulse" />
                                                Menunggu Konfirmasi Pengembalian
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinjamanSaya;