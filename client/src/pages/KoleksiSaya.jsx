// File: client/src/pages/KoleksiSaya.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Book, Trash2, BookOpen, LogOut, ArrowLeft, LayoutGrid, Heart, User, UserCircle } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import useProfilePhoto from '../hooks/useProfilePhoto';
import { BookCardSkeleton } from '../components/Skeleton';

const KoleksiSaya = () => {
    usePageTitle('Koleksi Saya');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Peminjam';
    const { fotoUrl } = useProfilePhoto();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchKoleksi = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fitur/koleksi', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
            setLoading(false);
        } catch (err) { 
            console.error(err); 
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchKoleksi();
    }, []);

    const handleRemove = async (bukuID) => {
        const result = await Swal.fire({
            title: 'Hapus dari Koleksi?',
            text: "Buku ini tidak akan lagi ada di daftar favoritmu.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            confirmButtonColor: '#FF4081',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.post('http://localhost:5000/api/fitur/koleksi', { bukuID }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchKoleksi();
                Swal.fire({
                    icon: 'success',
                    title: '<span class="font-black uppercase text-sm">DIHAPUS</span>',
                    text: 'Buku dihapus dari koleksi.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'brutal-border-heavy brutal-shadow border-4 border-black bg-[#FF4081]',
                        title: 'text-black font-black',
                        htmlContainer: 'font-black uppercase text-xs text-black/80'
                    }
                });
            } catch (err) { console.error(err); }
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?', text: "Sesi Anda akan berakhir.", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Ya, Keluar', confirmButtonColor: '#FF4081',
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

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] font-mono text-black relative selection:bg-[#FFD600]">

            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }}></div>

            {/* --- HEADER --- */}
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2 text-black">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain hover:rotate-12 transition-transform" />
                    <span className="text-2xl font-black uppercase tracking-tighter">Sastra<span className="bg-[#FFD600] px-1 border-2 border-black ml-1">.in</span></span>
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

            {/* --- KONTEN UTAMA --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-32 relative z-10">
                <div className="mb-12">
                    <Link to="/peminjam" className="inline-flex items-center gap-2 bg-white brutal-border px-4 py-2 font-black uppercase text-xs brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all mb-8">
                        <ArrowLeft size={16} /> Kembali ke Katalog
                    </Link>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                        Koleksi <br /> <span className="text-[#FF4081]">Saya.</span>
                    </h2>
                    <p className="font-black uppercase text-black/50 max-w-md">Daftar buku favorit yang kamu simpan untuk dibaca nanti.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
                    </div>
                ) : books.length === 0 ? (
                    <div className="bg-white brutal-border-heavy p-20 text-center brutal-shadow mt-8">
                        <Heart size={80} className="mx-auto text-[#FF4081] mb-6 opacity-20" strokeWidth={3} />
                        <p className="text-2xl font-black uppercase mb-2">Belum ada koleksi.</p>
                        <p className="font-bold uppercase text-black/40 mb-8 leading-tight">Mulai cari buku yang kamu suka <br /> dan tambahkan ke favorit!</p>
                        <Link to="/peminjam" className="bg-[#AEEA00] brutal-border px-10 py-4 font-black uppercase brutal-shadow inline-block hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Jelajahi Katalog</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {books.map(book => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={book.KoleksiID}
                                className="bg-white brutal-border-heavy brutal-shadow flex flex-col relative group"
                            >
                                <div className="h-64 bg-[#F3F4F6] relative overflow-hidden border-b-4 border-black">
                                    {book.Gambar ? (
                                        <img src={`http://localhost:5000/uploads/${book.Gambar}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.Judul} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20"><BookOpen size={80} /></div>
                                    )}
                                    <button
                                        onClick={() => handleRemove(book.BukuID)}
                                        className="absolute top-4 right-4 bg-white brutal-border-heavy p-3 text-red-500 brutal-shadow-sm hover:bg-black hover:text-white transition-colors z-10"
                                        title="Hapus dari Koleksi"
                                    >
                                        <Trash2 size={20} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <span className="bg-[#00E5FF] brutal-border px-2 py-0.5 font-black text-[10px] uppercase w-max mb-3 border-2 border-black">
                                        {book.NamaKategori || 'UMUM'}
                                    </span>
                                    <h3 className="font-black text-xl uppercase mb-1 line-clamp-2 leading-none" title={book.Judul}>{book.Judul}</h3>
                                    <p className="text-xs font-bold text-black/50 uppercase mt-auto flex items-center gap-1">
                                        <User size={12} /> {book.Penulis}
                                    </p>
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

export default KoleksiSaya;