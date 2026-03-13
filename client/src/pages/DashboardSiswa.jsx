// File: client/src/pages/DashboardSiswa.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Search, BookOpen, LogOut, LayoutGrid, Book,
    User, Heart, Zap, Shield, Users,
    MessageSquare, ArrowRight, Info, Clock, UserCircle
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import useProfilePhoto from '../hooks/useProfilePhoto';

const DashboardSiswa = () => {
    usePageTitle('Dashboard Siswa');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [savedBookIds, setSavedBookIds] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Siswa';
    const { fotoUrl } = useProfilePhoto();

    const fetchBooks = useCallback(async () => {
        try {
            const resBuku = await axios.get('http://localhost:5000/api/buku', { headers: { Authorization: `Bearer ${token}` } });
            setBooks(resBuku.data);
            setFilteredBooks(resBuku.data);
        } catch (err) {
            console.error("Error fetching books:", err);
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        }
    }, [token, navigate]);

    const fetchCategories = useCallback(async () => {
        try {
            const resKategori = await axios.get('http://localhost:5000/api/kategori', { headers: { Authorization: `Bearer ${token}` } });
            setCategories(resKategori.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    }, [token]);

    const fetchSavedBooks = useCallback(async () => {
        try {
            const resKoleksi = await axios.get('http://localhost:5000/api/fitur/koleksi', { headers: { Authorization: `Bearer ${token}` } });
            const ids = resKoleksi.data.map(item => item.BukuID);
            setSavedBookIds(ids);
        } catch (err) {
            console.error("Error fetching saved books:", err);
        }
    }, [token]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchBooks(),
                fetchCategories(),
                fetchSavedBooks()
            ]);
            setLoading(false);
        };
        loadAllData();
    }, [fetchBooks, fetchCategories, fetchSavedBooks]);

    useEffect(() => {
        let result = books;
        if (selectedCategory !== 'All') {
            result = result.filter(book => {
                if (!book.NamaKategori) return false;
                const kategoriBuku = book.NamaKategori.split(', ');
                return kategoriBuku.includes(selectedCategory);
            });
        }
        if (searchTerm) {
            result = result.filter(book =>
                book.Judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredBooks(result);
    }, [searchTerm, selectedCategory, books]);

    const handlePinjam = async (bukuID, judul) => {
        const { value: lamaPinjam } = await Swal.fire({
            title: `Pinjam "${judul}"?`,
            text: "Berapa hari Anda ingin meminjam buku ini? (Maks 14 Hari)",
            input: 'number',
            inputPlaceholder: 'Contoh: 3',
            inputAttributes: { min: 1, max: 14 },
            showCancelButton: true,
            confirmButtonText: 'Ajukan Pinjaman',
            confirmButtonColor: '#000',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow',
                confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (lamaPinjam) {
            if (lamaPinjam > 14 || lamaPinjam < 1) return Swal.fire('Error', 'Lama peminjaman harus 1 - 14 hari.', 'error');
            try {
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
                await axios.post('http://localhost:5000/api/peminjaman', { bukuID, lamaPinjam }, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({
                    icon: 'success',
                    title: '<span class="font-black uppercase">BERHASIL!</span>',
                    text: 'Silakan tunggu persetujuan dari Admin.',
                    timer: 2500,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'brutal-border-heavy brutal-shadow bg-[#AEEA00]',
                        title: 'font-black uppercase',
                        htmlContainer: 'font-bold uppercase text-xs'
                    }
                });
                navigate('/peminjam/pinjaman-saya');
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '<span class="font-black uppercase">GAGAL</span>',
                    text: err.response?.data?.message || 'Terjadi kesalahan.',
                    customClass: {
                        popup: 'brutal-border-heavy brutal-shadow',
                        confirmButton: 'bg-black text-white font-black uppercase brutal-border brutal-shadow-sm'
                    }
                });
            }
        }
    };

    const handleBookmark = async (bukuID) => {
        try {
            const isCurrentlySaved = savedBookIds.includes(bukuID);
            setSavedBookIds(prev => isCurrentlySaved ? prev.filter(id => id !== bukuID) : [...prev, bukuID]);
            await axios.post('http://localhost:5000/api/fitur/koleksi', { bukuID }, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({
                icon: 'success',
                title: `<span class="font-black uppercase text-sm">${isCurrentlySaved ? 'DIHAPUS' : 'DISIMPAN'}</span>`,
                text: isCurrentlySaved ? 'Buku dihapus dari Koleksi.' : 'Buku disimpan ke Koleksi!',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                customClass: {
                    popup: `brutal-border-heavy brutal-shadow border-4 border-black ${isCurrentlySaved ? 'bg-[#FF4081]' : 'bg-[#AEEA00]'}`,
                    title: 'text-black font-black',
                    htmlContainer: 'font-black uppercase text-xs text-black/80'
                }
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Gagal', 'Terjadi kesalahan koneksi.', 'error');
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
        }).then((res) => { if (res.isConfirmed) { localStorage.clear(); navigate('/'); } });
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

            {/* --- ANNOUNCEMENT MARQUEE --- */}
            <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap relative z-40 border-b-4 border-black">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="inline-block"
                >
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Perhatian: Perpustakaan tutup pada hari libur nasional!</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Koleksi baru bulan Maret telah tersedia!</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Ayo ulas buku yang sudah kamu baca untuk poin ekstra!</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Perhatian: Perpustakaan tutup pada hari libur nasional!</span>
                </motion.div>
            </div>

            {/* --- HEADER --- */}
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
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

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-32 relative z-10">
                {/* --- HERO / WELCOME --- */}
                <div className="mb-16 grid lg:grid-cols-[1fr_0.4fr] gap-8 items-center">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <div className="inline-block bg-[#00E5FF] brutal-border px-2 py-1 font-black text-xs uppercase mb-4 brutal-shadow-sm">
                            Selamat Datang Kembali!
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
                            Waktunya <br /> <span className="bg-[#FF4081] text-white px-3 rotate-1 inline-block my-1 brutal-border-heavy">Berpetualang</span> <br /> di Lembar Buku.
                        </h1>
                        <p className="text-lg font-black uppercase text-black/60 max-w-md leading-tight">
                            Pinjam buku favoritmu sekarang, <br /> baca di mana saja, kapan saja.
                        </p>
                    </motion.div>

                    <div className="hidden lg:block">
                        <div className="bg-[#FFD600] brutal-border-heavy brutal-shadow p-6 rotate-2 hover:rotate-0 transition-transform cursor-help group">
                            <Info size={32} className="mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-black uppercase mb-2 leading-none">Status Akun</h3>
                            <div className="bg-white brutal-border p-3 font-black text-xs uppercase space-y-2">
                                <div className="flex justify-between"><span>Status</span> <span className="text-green-600">Aktif</span></div>
                                <div className="flex justify-between"><span>Limit</span> <span>UNLIMITED</span></div>
                                <div className="w-full bg-black h-2 mt-2">
                                    <div className="bg-[#AEEA00] h-full w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Buku Dipinjam', value: '2', color: 'bg-[#AEEA00]', icon: <Book /> },
                        { label: 'Buku Terlambat', value: '0', color: 'bg-[#FF4081]', icon: <Clock /> },
                        { label: 'Koleksi Saya', value: savedBookIds.length, color: 'bg-[#00E5FF]', icon: <Heart /> },
                        { label: 'Point Literasi', value: '450', color: 'bg-[#FFD600]', icon: <Zap /> },
                    ].map((s, i) => (
                        <div key={i} className={`${s.color} brutal-border-heavy brutal-shadow p-6 group`}>
                            <div className="bg-white brutal-border w-10 h-10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-none">
                                {s.icon}
                            </div>
                            <h3 className="text-4xl font-black mb-1">{s.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-wider text-black/60 leading-none">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* --- FEATURED SECTION --- */}
                <div className="grid lg:grid-cols-2 gap-12 mb-24">
                    <div className="bg-[#FFD600] brutal-border-heavy brutal-shadow-lg p-10 flex flex-col justify-between">
                        <div>
                            <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase mb-6 inline-block">Book of the Week</span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tighter mb-4">Filosofi Teras</h2>
                            <p className="font-black uppercase text-black/60 mb-8 max-w-sm leading-tight">
                                Belajar Stoikisme dengan cara yang asik dan relevan buat anak muda zaman sekarang.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-black text-white px-8 py-4 font-black uppercase text-lg brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                                Pinjam Sekarang <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#00E5FF] brutal-border-heavy brutal-shadow p-6 flex flex-col justify-center items-center text-center">
                            <Zap size={48} className="mb-4" />
                            <h3 className="text-xl font-black uppercase leading-tight">Pinjam Instan</h3>
                            <p className="text-[10px] font-bold uppercase mt-2">Persetujuan otomatis untuk member VIP.</p>
                        </div>
                        <div className="bg-[#AEEA00] brutal-border-heavy brutal-shadow p-6 flex flex-col justify-center items-center text-center">
                            <Shield size={48} className="mb-4" />
                            <h3 className="text-xl font-black uppercase leading-tight">Aman & Nyaman</h3>
                            <p className="text-[10px] font-bold uppercase mt-2">Data kamu terlindungi 100%.</p>
                        </div>
                    </div>
                </div>

                {/* --- BORROWING GUIDE --- */}
                <div className="mb-24">
                    <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter text-center">Mau Pinjam? <span className="bg-[#FF4081] text-white px-3">Gampang Banget!</span></h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Pilih Buku', desc: 'Cari buku yang kamu suka di katalog kami.' },
                            { step: '02', title: 'Klik Pinjam', desc: 'Isi durasi pinjam dan ajukan permintaan.' },
                            { step: '03', title: 'Baca Sepuasnya', desc: 'Setelah disetujui, buku siap kamu nikmati!' },
                        ].map((g, i) => (
                            <div key={i} className="bg-white brutal-border-heavy brutal-shadow p-8 relative pt-12">
                                <div className="absolute -top-6 left-8 w-14 h-14 bg-black text-white brutal-border flex items-center justify-center font-black text-2xl">
                                    {g.step}
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-3 leading-none">{g.title}</h3>
                                <p className="font-bold uppercase text-black/50 text-sm leading-tight">{g.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CATALOG --- */}
                <div id="katalog-section">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                Katalog <br /> <span className="text-[#FF4081]">Buku.</span>
                            </h2>
                            <p className="mt-4 text-xs font-black uppercase text-black/50 max-w-[200px]">Ribuan koleksi menantimu di sini. Temukan duniamu.</p>
                        </div>

                        {/* INTEGRATED SEARCH */}
                        <div className="w-full md:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
                                <input
                                    type="text"
                                    placeholder="CARI JUDUL / PENULIS..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black font-black uppercase text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors brutal-shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* INTEGRATED CATEGORY FILTERS */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-5 py-2 brutal-border font-black uppercase text-xs transition-all ${selectedCategory === 'All' ? 'bg-black text-white -translate-y-1 brutal-shadow-sm' : 'bg-white text-black hover:bg-[#FFD600]'}`}
                        >
                            Semua
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.KategoriID}
                                onClick={() => setSelectedCategory(cat.NamaKategori)}
                                className={`px-5 py-2 brutal-border font-black uppercase text-xs transition-all ${selectedCategory === cat.NamaKategori ? 'bg-black text-white -translate-y-1 brutal-shadow-sm' : 'bg-white text-black hover:bg-[#FFD600]'}`}
                            >
                                {cat.NamaKategori}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-16 h-16 border-8 border-black border-t-[#FFD600] animate-spin"></div>
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="bg-white brutal-border-heavy p-20 text-center brutal-shadow">
                            <BookOpen size={64} className="mx-auto mb-6 opacity-20" />
                            <p className="text-2xl font-black uppercase">Ups! Buku tidak ditemukan.</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All') }} className="mt-6 bg-[#AEEA00] brutal-border px-6 py-2 font-black uppercase brutal-shadow-sm">Reset Filter</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredBooks.map(book => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={book.BukuID}
                                    className="bg-white brutal-border-heavy brutal-shadow flex flex-col relative overflow-visible group"
                                >
                                    <div className="h-64 bg-[#F3F4F6] relative overflow-hidden border-b-4 border-black">
                                        {book.Gambar ? (
                                            <img src={`http://localhost:5000/uploads/${book.Gambar}`} alt={book.Judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20"><Book size={80} /></div>
                                        )}
                                        <button
                                            onClick={() => handleBookmark(book.BukuID)}
                                            className={`absolute top-4 right-4 p-3 brutal-border-heavy brutal-shadow-sm z-10 transition-colors ${savedBookIds.includes(book.BukuID) ? "bg-[#FF4081] text-white" : "bg-white text-black hover:bg-[#FF4081] hover:text-white"}`}
                                        >
                                            <Heart size={20} fill={savedBookIds.includes(book.BukuID) ? "currentColor" : "none"} />
                                        </button>
                                        <div className="absolute bottom-4 left-4 bg-[#00E5FF] brutal-border px-2 py-0.5 font-black text-[10px] uppercase shadow-none z-10 border-2 border-black">
                                            {book.NamaKategori || 'UMUM'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-black text-xl uppercase mb-1 line-clamp-2 leading-none" title={book.Judul}>{book.Judul}</h3>
                                        <p className="text-xs font-bold text-black/50 uppercase flex items-center gap-1 mb-6"><User size={12} /> {book.Penulis}</p>

                                        <div className="mt-auto pt-6 border-t-4 border-black/5 flex items-center justify-between">
                                            <div>
                                                <span className="block text-[10px] font-black text-black/40 uppercase">Tersedia</span>
                                                <span className={`text-2xl font-black ${book.Stok > 0 ? 'text-black' : 'text-red-500'}`}>{book.Stok}</span>
                                            </div>
                                            <button
                                                onClick={() => handlePinjam(book.BukuID, book.Judul)}
                                                disabled={book.Stok <= 0}
                                                className={`px-6 py-3 font-black uppercase text-sm brutal-border brutal-shadow-sm transition-all ${book.Stok > 0 ? 'bg-[#AEEA00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none'}`}
                                            >
                                                {book.Stok > 0 ? 'Pinjam' : 'Habis'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- COMMUNITY HUB & NEWSLETTER --- */}
                <div className="mt-32 grid md:grid-cols-[1.2fr_0.8fr] gap-8">
                    <div className="bg-[#AEEA00] brutal-border-heavy brutal-shadow-lg p-12">
                        <MessageSquare size={48} className="mb-6" />
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">Join the Sastra.in Community!</h2>
                        <p className="font-black uppercase text-black/60 mb-8 max-w-md leading-tight">Dapatkan Update koleksi terbaru dan info event literasi seru setiap minggunya.</p>
                        <div className="flex gap-4">
                            <input type="email" placeholder="EMAIL@KAMU.COM" className="flex-1 bg-white brutal-border px-4 py-3 font-black placeholder:text-black/30 outline-none" />
                            <button className="bg-black text-white px-6 py-3 font-black uppercase brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">GABUNG</button>
                        </div>
                    </div>

                    <div className="bg-white brutal-border-heavy brutal-shadow p-8 flex flex-col justify-center">
                        <Users size={32} className="mb-4" />
                        <h3 className="text-2xl font-black uppercase mb-4 leading-none">Diskusi Buku</h3>
                        <p className="font-bold uppercase text-black/50 text-sm mb-6 leading-tight">Belum ada fitur diskusi, tapi tenang... bakal segera hadir kok buat kamu!</p>
                        <div className="w-full bg-black/5 h-12 flex items-center justify-center font-black uppercase text-xs opacity-50 border-2 border-dashed border-black">Coming Soon</div>
                    </div>
                </div>
            </main>

            {/* --- FLOATING NAVBAR BAWAH --- */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full flex justify-center">
                <nav className="flex items-center gap-2 p-2 bg-white brutal-border-heavy brutal-shadow-lg max-w-max overflow-x-auto scrollbar-hide">
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

export default DashboardSiswa;