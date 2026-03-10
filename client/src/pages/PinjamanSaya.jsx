// File: client/src/pages/PinjamanSaya.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Clock, CalendarDays, BookOpen, AlertCircle,
    CheckCircle2, Hourglass, Book, Star, LogOut, LayoutGrid, Heart
} from 'lucide-react';

const PinjamanSaya = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Siswa';
    const navigate = useNavigate();
    const location = useLocation();

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

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

    const handleUlasan = async (bukuID, judul) => {
        const { value: formValues } = await Swal.fire({
            title: `<h3 class="text-lg font-bold">Ulas Buku</h3><p class="text-sm text-gray-500">${judul}</p>`,
            html:
                '<div class="text-left mb-1 text-sm font-medium">Rating:</div>' +
                '<select id="swal-rating" class="swal2-input mb-4" style="margin: 0 0 1rem 0; width: 100%;">' +
                '<option value="5">⭐⭐⭐⭐⭐ (Sangat Bagus)</option>' +
                '<option value="4">⭐⭐⭐⭐ (Bagus)</option>' +
                '<option value="3">⭐⭐⭐ (Cukup)</option>' +
                '<option value="2">⭐⭐ (Kurang)</option>' +
                '<option value="1">⭐ (Buruk)</option>' +
                '</select>' +
                '<div class="text-left mb-1 text-sm font-medium">Komentar:</div>' +
                '<textarea id="swal-ulasan" class="swal2-textarea" style="margin: 0; width: 100%;" placeholder="Tulis pendapatmu..."></textarea>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Kirim Ulasan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                return {
                    rating: document.getElementById('swal-rating').value,
                    ulasan: document.getElementById('swal-ulasan').value
                }
            }
        });

        if (formValues) {
            try {
                await axios.post('http://localhost:5000/api/ulasan', {
                    bukuID, rating: formValues.rating, ulasan: formValues.ulasan
                }, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire('Terima Kasih!', 'Ulasanmu berhasil dikirim.', 'success');
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan', 'error');
            }
        }
    };

    const handleReturn = async (id, judul) => {
        const result = await Swal.fire({
            title: 'Kembalikan Buku?',
            text: `Apakah Anda ingin mengajukan pengembalian untuk buku "${judul}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Ajukan!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/kembali`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success', title: 'Berhasil Diajukan!',
                    text: 'Status berubah menjadi "Menunggu Pengembalian". Silakan serahkan buku fisik ke Admin untuk verifikasi akhir.',
                });
                fetchLoans();
            } catch (err) {
                console.error(err);
                Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            }
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?', text: "Sesi Anda akan berakhir.", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Ya, Keluar', confirmButtonColor: '#d33'
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    const menuItems = [
        { path: '/peminjam', name: 'Katalog', icon: <LayoutGrid size={22} /> },
        { path: '/peminjam/koleksi', name: 'Koleksi Saya', icon: <Heart size={22} /> },
        { path: '/peminjam/pinjaman-saya', name: 'Pinjaman Saya', icon: <Book size={22} /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-gray-900 relative overflow-hidden">
            
            {/* --- HEADER ATAS --- */}
            <header className="h-20 bg-white/60 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm z-30 sticky top-0">
                <div className="flex items-center gap- 0">
                    <div className="flex items-center justify-center bg-transparent drop-shadow-md w-14 h-14">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-150 drop-shadow-[0_4px_12px_rgba(124,58,237,0.3)]" />
                            </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                        Sastra<span className="text-violet-600 italic">.in</span>
                    </span>
                    
                    <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest text-indigo-700 uppercase">
                            Siswa Panel
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{namaUser}</p>
                        <p className="text-xs text-gray-500 font-medium">Siswa</p>
                    </div>
                    <div className="avatar placeholder cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all rounded-full">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold">{namaUser.substring(0, 2).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- KONTEN UTAMA --- */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-8 pb-32 overflow-y-auto overflow-x-hidden">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                    <Book className="text-indigo-600" size={28} /> Pinjaman Saya
                </h2>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-400">Memuat data pinjaman...</p>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <Book size={40} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">Kamu belum meminjam buku apapun.</p>
                        <Link to="/peminjam" className="text-indigo-600 hover:underline font-medium mt-2 inline-block">Mulai Pinjam Buku</Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {loans.map(loan => {
                            const countdown = calculateCountdown(loan.TanggalPengembalian);

                            return (
                                <div key={loan.PeminjamanID} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${loan.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-500' :
                                        loan.StatusPeminjaman === 'Menunggu' ? 'bg-orange-400' :
                                            loan.StatusPeminjaman === 'Menunggu Pengembalian' ? 'bg-blue-500' :
                                                loan.StatusPeminjaman === 'Ditolak' ? 'bg-red-500' : 'bg-emerald-500'
                                        }`}></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${loan.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-100 text-indigo-700' :
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

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={14} className="text-gray-400" />
                                                    <span>Pinjam: <span className="font-medium text-gray-700">{formatDate(loan.TanggalPeminjaman)}</span></span>
                                                </div>
                                                {loan.TanggalPengembalian && (
                                                    <div className="flex items-center gap-1.5">
                                                        {loan.StatusPeminjaman === 'Dikembalikan' ? (
                                                            <>
                                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                                <span className="text-emerald-600 font-medium">
                                                                    Dikembalikan: <span className="text-gray-700 font-bold">{formatDate(loan.TanggalPengembalian)}</span>
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertCircle size={14} className="text-orange-400" />
                                                                <span>
                                                                    Batas Kembali: <span className="font-medium text-gray-700">{formatDate(loan.TanggalPengembalian)}</span>
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {loan.Denda > 0 && (
                                                <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-bold border border-red-200 w-full md:w-auto">
                                                    <span className="animate-pulse">⚠️</span>
                                                    <span>Terlambat! Denda: Rp {loan.Denda.toLocaleString('id-ID')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {loan.StatusPeminjaman === 'Dipinjam' && (
                                            <button
                                                onClick={() => handleReturn(loan.PeminjamanID, loan.JudulBuku)}
                                                className="btn btn-outline btn-sm border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 gap-2 normal-case font-medium w-full md:w-auto"
                                            >
                                                <CheckCircle2 size={16} />
                                                Kembalikan Buku
                                            </button>
                                        )}

                                        {loan.StatusPeminjaman === 'Dikembalikan' && loan.SudahDiulas === 0 && (
                                            <button
                                                onClick={() => handleUlasan(loan.BukuID, loan.JudulBuku)}
                                                className="btn btn-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 gap-2 normal-case font-bold w-full md:w-auto"
                                            >
                                                <Star size={16} fill="currentColor" /> Beri Ulasan
                                            </button>
                                        )}

                                        {loan.StatusPeminjaman === 'Dikembalikan' && loan.SudahDiulas > 0 && (
                                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                                <CheckCircle2 size={16} /> Transaksi Selesai
                                            </div>
                                        )}

                                        {loan.StatusPeminjaman === 'Menunggu' && (
                                            <div className="flex items-center gap-2 text-orange-500 text-sm font-medium bg-orange-50 px-3 py-2 rounded-lg">
                                                <Hourglass size={16} className="animate-pulse" />
                                                Menunggu Persetujuan
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
            </main>

            {/* --- FLOATING NAVBAR BAWAH --- */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-max">
                <nav className="flex items-center gap-2 px-3 py-3 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-x-auto scrollbar-hide">
                    
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`group relative flex items-center h-12 rounded-full transition-all duration-300 ease-in-out
                                    ${isActive 
                                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/40 px-4' 
                                        : 'bg-transparent text-gray-600 hover:bg-white/80 hover:text-violet-600 px-3'
                                    }`}
                            >
                                <span className="shrink-0 flex items-center justify-center">
                                    {item.icon}
                                </span>
                                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-medium text-sm
                                    ${isActive 
                                        ? 'max-w-[200px] ml-2.5 opacity-100' 
                                        : 'max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:ml-2.5 group-hover:opacity-100'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    <div className="w-[2px] h-8 bg-gray-300/50 mx-1 rounded-full shrink-0"></div>

                    <button 
                        onClick={handleLogout} 
                        className="group relative flex items-center h-12 px-3 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out shrink-0"
                    >
                        <span className="shrink-0 flex items-center justify-center">
                            <LogOut size={22} />
                        </span>
                        <span className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-medium text-sm max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:ml-2.5 group-hover:opacity-100">
                            Logout
                        </span>
                    </button>
                </nav>
            </div>

        </div>
    );
};

export default PinjamanSaya;