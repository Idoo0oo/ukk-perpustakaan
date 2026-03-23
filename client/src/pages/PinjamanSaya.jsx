// File: client/src/pages/PinjamanSaya.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid, Heart, Book, LogOut, Info,
    Calendar, Clock, CheckCircle, AlertCircle, Star, Send, UserCircle
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import useProfilePhoto from '../hooks/useProfilePhoto';
import { ListSkeleton } from '../components/Skeleton';

const PinjamanSaya = () => {
    usePageTitle('Pinjaman Saya');
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Peminjam';
    const { fotoUrl } = useProfilePhoto();

    const fetchLoans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/peminjaman', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remap flat response to nested structure expected by UI
            const formattedData = res.data.map(item => ({
                ...item,
                Buku: {
                    Judul: item.Judul,
                    Penulis: item.Penulis,
                    Gambar: item.Gambar
                }
            }));
            setLoans(formattedData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching loans:", err);
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchLoans();
    }, []);

    const handleUlasan = async (bukuID, judul) => {
        const { value: formValues } = await Swal.fire({
            title: `<span class="font-black uppercase">Ulas "${judul}"</span>`,
            html:
                '<div class="flex flex-col gap-4 p-4">' +
                '<label class="text-left font-black uppercase text-xs">Rating (1-5)</label>' +
                '<input id="swal-input1" type="number" min="1" max="5" class="w-full brutal-border p-3 font-black" placeholder="5">' +
                '<label class="text-left font-black uppercase text-xs">Ulasan Kamu</label>' +
                '<textarea id="swal-input2" class="w-full brutal-border p-3 font-black h-32" placeholder="Tuliskan pendapatmu..."></textarea>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Kirim Ulasan',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow',
                confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            },
            preConfirm: () => {
                return {
                    rating: document.getElementById('swal-input1').value,
                    ulasan: document.getElementById('swal-input2').value
                }
            }
        });

        if (formValues) {
            try {
                await axios.post('http://localhost:5000/api/fitur/ulasan', {
                    bukuID, rating: formValues.rating, ulasan: formValues.ulasan
                }, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({
                    icon: 'success',
                    title: '<span class="font-black uppercase">BERHASIL!</span>',
                    text: 'Ulasanmu berhasil dikirim.',
                    customClass: {
                        popup: 'brutal-border-heavy brutal-shadow',
                        confirmButton: 'bg-black text-white font-black uppercase brutal-border brutal-shadow-sm'
                    }
                });
                fetchLoans();
            } catch (err) {
                Swal.fire('Gagal!', 'Terjadi kesalahan.', 'error');
            }
        }
    };

    const handleReturn = async (id, judul) => {
        const result = await Swal.fire({
            title: `<span class="font-black uppercase">Kembalikan Buku?</span>`,
            text: `Apakah Anda ingin mengajukan pengembalian untuk buku "${judul}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Ajukan!',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow',
                confirmButton: 'bg-[#00E5FF] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
                await axios.put(`http://localhost:5000/api/peminjaman/${id}/kembali`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    icon: 'success',
                    title: '<span class="font-black uppercase text-sm">BERHASIL DIAJUKAN!</span>',
                    text: 'Silakan serahkan buku fisik ke Admin untuk verifikasi.',
                    customClass: {
                        popup: 'brutal-border-heavy brutal-shadow bg-[#AEEA00]',
                        title: 'font-black',
                        htmlContainer: 'font-bold uppercase text-xs text-black'
                    }
                });
                fetchLoans();
            } catch (err) {
                Swal.fire('Gagal!', 'Terjadi kesalahan.', 'error');
            }
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: '<span class="font-black uppercase">Keluar Sesi?</span>',
            text: "Pastikan semua buku sudah kamu cek, ya!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
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
        { path: '/peminjam/profil', name: 'Profil', icon: <UserCircle size={22} /> },
    ];

    if (loading) return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] font-mono text-black relative">
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="text-2xl font-black uppercase tracking-tighter">Sastra<span className="bg-[#FFD600] px-1 border-2 border-black ml-1">.in</span></div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-32">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                        Pinjaman <span className="bg-[#00E5FF] px-3 rotate-1 inline-block my-1 brutal-border-heavy">Saya.</span>
                    </h1>
                </div>
                {Array.from({ length: 3 }).map((_, i) => <ListSkeleton key={i} />)}
            </main>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] font-mono text-black relative selection:bg-[#FFD600]">
            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }}></div>

            {/* --- HEADER --- */}
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Link to="/peminjam" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <span className="text-2xl font-black uppercase tracking-tighter">Sastra<span className="bg-[#FFD600] px-1 border-2 border-black ml-1">.in</span></span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-black uppercase leading-none">{namaUser}</p>
                        <p className="text-[10px] font-bold text-black/50 uppercase">PEMINJAM</p>
                    </div>
                    <Link to="/peminjam/profil" className="w-12 h-12 brutal-border brutal-shadow-sm overflow-hidden hover:scale-105 transition-transform flex-shrink-0">
                        {fotoUrl
                            ? <img src={fotoUrl} alt="Profil" className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="#9CA3AF"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                              </div>
                        }
                    </Link>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-32 relative z-10">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                        Pinjaman <br /> <span className="bg-[#00E5FF] px-3 rotate-1 inline-block my-1 brutal-border-heavy">Saya.</span>
                    </h1>
                    <p className="text-lg font-black uppercase text-black/60 max-w-md leading-tight">
                        Pantau status peminjaman buku kamu di sini. Jangan lupa dikembalikan tepat waktu ya!
                    </p>
                </div>

                {loans.length === 0 ? (
                    <div className="bg-white brutal-border-heavy p-20 text-center brutal-shadow flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#F3F4F6] brutal-border flex items-center justify-center mb-6">
                            <Book size={48} className="opacity-20" />
                        </div>
                        <h2 className="text-2xl font-black uppercase mb-4">Kamu belum punya pinjaman</h2>
                        <p className="font-bold uppercase text-black/40 mb-8 max-w-xs mx-auto">Ayo jelajahi katalog dan temukan buku yang ingin kamu baca!</p>
                        <Link to="/peminjam" className="bg-[#FFD600] brutal-border px-8 py-4 font-black uppercase brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-block">
                            Jelajahi Katalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {loans.map((loan) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                key={loan.PeminjamanID}
                                className="bg-white brutal-border-heavy brutal-shadow-lg flex flex-col md:flex-row overflow-visible group transition-all"
                            >
                                {/* LEFT: BOOK COVER */}
                                <div className="w-full md:w-56 h-72 md:h-auto bg-[#F3F4F6] relative border-b-4 md:border-b-0 md:border-r-4 border-black overflow-hidden shrink-0">
                                    {loan.Buku?.Gambar ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${loan.Buku.Gambar}`}
                                            alt={loan.Buku.Judul}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20"><Book size={64} /></div>
                                    )}
                                    
                                    {/* STATUS BADGE - ROTATED */}
                                    <div className={`absolute top-4 -left-2 px-4 py-1 font-black uppercase text-xs brutal-border brutal-shadow-sm z-10 -rotate-12 transition-transform group-hover:rotate-0 ${
                                        loan.StatusPeminjaman === 'Dipinjam' ? 'bg-[#AEEA00]' :
                                        loan.StatusPeminjaman === 'Kembali' ? 'bg-[#FFD600]' : 'bg-gray-200'
                                    }`}>
                                        {loan.StatusPeminjaman}
                                    </div>
                                </div>

                                {/* RIGHT: CONTENT */}
                                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between relative">
                                    {/* DECORATIVE ELEMENT */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD600]/10 rounded-full -mr-12 -mt-12 pointer-events-none"></div>

                                    <div>
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase brutal-border border-black">
                                                ID: #{loan.PeminjamanID}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                                {loan.StatusPeminjaman === 'Dipinjam' ? (() => {
                                                    const today = new Date(); today.setHours(0,0,0,0);
                                                    const deadline = new Date(loan.TanggalPengembalian); deadline.setHours(0,0,0,0);
                                                    const sisaHari = Math.ceil((deadline - today) / (1000 * 3600 * 24));
                                                    if (sisaHari > 0) return (
                                                        <span className="bg-white brutal-border border-red-500 text-red-500 px-3 py-1 flex items-center gap-1 animate-pulse">
                                                            <AlertCircle size={14} /> SISA {sisaHari} HARI!
                                                        </span>
                                                    );
                                                    if (sisaHari === 0) return (
                                                        <span className="bg-[#FF4081] text-white brutal-border px-3 py-1 flex items-center gap-1 animate-pulse">
                                                            <AlertCircle size={14} /> HARI INI!
                                                        </span>
                                                    );
                                                    return (
                                                        <span className="bg-[#FF4081] text-white brutal-border px-3 py-1 flex items-center gap-1 animate-pulse">
                                                            <AlertCircle size={14} /> TERLAMBAT {Math.abs(sisaHari)} HARI!
                                                        </span>
                                                    );
                                                })() : (
                                                    <span className="bg-white brutal-border border-[#AEEA00] text-[#AEEA00] px-3 py-1 flex items-center gap-1">
                                                        <CheckCircle size={14} /> SELESAI
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4 group-hover:text-[#FF4081] transition-colors line-clamp-2">
                                            {loan.Buku?.Judul}
                                        </h3>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <div className="bg-[#00E5FF] brutal-border px-3 py-2 flex items-center gap-2 text-xs font-black uppercase brutal-shadow-sm">
                                                <Calendar size={16} /> 
                                                <span>Pinjam: {new Date(loan.TanggalPeminjaman).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="bg-[#FFD600] brutal-border px-3 py-2 flex items-center gap-2 text-xs font-black uppercase brutal-shadow-sm">
                                                <Clock size={16} /> 
                                                <span>Kembali: {new Date(loan.TanggalPengembalian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t-4 border-black">
                                        <div className="flex flex-wrap gap-4">
                                            {loan.StatusPeminjaman === 'Dipinjam' && (
                                                <button
                                                    onClick={() => handleReturn(loan.PeminjamanID, loan.Buku?.Judul)}
                                                    className="bg-[#00E5FF] brutal-border-heavy px-8 py-4 font-black uppercase text-sm brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 active:bg-white"
                                                >
                                                    <LogOut size={18} className="rotate-180" /> Kembalikan Buku
                                                </button>
                                            )}
                                            {loan.StatusPeminjaman === 'Kembali' && (
                                                <button
                                                    onClick={() => handleUlasan(loan.BukuID, loan.Buku?.Judul)}
                                                    className="bg-[#FF4081] text-white brutal-border-heavy px-8 py-4 font-black uppercase text-sm brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 active:bg-white active:text-black"
                                                >
                                                    <Star size={18} fill="currentColor" /> Kasih Ulasan
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="text-[10px] font-black uppercase text-black/40 italic">
                                            *Denda berlaku jika terlambat
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- FLOATING NAVBAR BAWAH --- */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full flex justify-center">
                <nav className="flex items-center gap-2 p-2 bg-white brutal-border-heavy brutal-shadow-lg max-w-full overflow-x-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-2 px-6 py-3 transition-all duration-200
                                    ${isActive
                                        ? 'bg-black text-white brutal-border brutal-shadow-sm'
                                        : 'bg-white text-black hover:bg-[#FFD600] active:translate-y-1'
                                    }`}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="font-black uppercase text-xs whitespace-nowrap">{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="w-1 h-8 bg-black mx-1"></div>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-[#FF4081] hover:text-white transition-all duration-200 active:translate-y-1"
                    >
                        <LogOut size={22} />
                        <span className="font-black uppercase text-xs whitespace-nowrap">Logout</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default PinjamanSaya;