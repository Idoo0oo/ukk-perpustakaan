import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, ArrowRight, Star,
    Library, Zap, Shield, Heart, Menu, X,
    TrendingUp, Award, Quote, CheckCircle2,
    Users, BookMarked, MessageSquare, HelpCircle,
    ChevronDown, PlayCircle, Globe, Smartphone, Phone, Mail, MapPin, Instagram
} from 'lucide-react';
import axios from 'axios';
import { BookCardSkeleton } from '../components/Skeleton';
import usePageTitle from '../hooks/usePageTitle';

// Warna statis untuk merender dinamis data
const STATS_COLORS = ["bg-[#FFD600]", "bg-[#AEEA00]", "bg-[#00E5FF]", "bg-[#FF4081]"];
const KATEGORI_COLORS = ["bg-[#00E5FF]", "bg-[#FF4081]", "bg-[#AEEA00]", "bg-[#FFD600]"];
const KATEGORI_ICONS = [<Zap className="w-8 h-8" />, <Heart className="w-8 h-8" />, <Award className="w-8 h-8" />, <Library className="w-8 h-8" />];
const BUKU_COLORS = ["bg-[#FFD600]", "bg-[#AEEA00]", "bg-[#00E5FF]", "bg-[#FF4081]"];

const FEATURES = [
    { title: "Akses 24/7", desc: "Baca kapan saja dan di mana saja tanpa batasan waktu.", icon: <Globe />, color: "bg-[#00E5FF]" },
    { title: "Multi Platform", desc: "Tersedia di Web, Android, dan iOS untuk kenyamananmu.", icon: <Smartphone />, color: "bg-[#FFD600]" },
    { title: "Koleksi Premium", desc: "Ribuan buku eksklusif dari penerbit ternama dunia.", icon: <Star />, color: "bg-[#FF4081]" },
];

const HOW_IT_WORKS = [
    { step: "01", title: "Daftar Akun", desc: "Buat akun dalam hitungan detik dengan EMAIL kamu." },
    { step: "02", title: "Pilih Buku", desc: "Cari buku favoritmu dari ribuan koleksi kami." },
    { step: "03", title: "Pinjam & Baca", desc: "Klik pinjam dan mulai membaca sekarang!" },
];

const TESTIMONIALS = [
    { name: "Andi Saputra", role: "Pelajar", text: "Perpustakaan ini ngebantu banget buat ngerjain tugas sekolah. Koleksinya lengkap!", avatar: "https://i.pravatar.cc/150?u=andi" },
    { name: "Siti Aminah", role: "Mahasiswa", text: "UI-nya keren banget, beda dari perpus digital lain. Smooth dan gampang dipake.", avatar: "https://i.pravatar.cc/150?u=siti" },
    { name: "Budi Santoso", role: "Guru", text: "sangat bagus, banyak pilihan buku dan bisa dipinjam oleh siapapun.", avatar: "https://i.pravatar.cc/150?u=budi" },
];

const FAQ = [
    { q: "Apakah layanan ini gratis?", a: "Ya, 100% gratis untuk seluruh peminjam yang memiliki akun sastra.in valid." },
    { q: "Berapa lama durasi peminjaman?", a: "Peminjaman buku digital berlaku selama 14 hari dan dapat diperpanjang." },
    { q: "Apakah ada denda?", a: "Ya, Adanya denda tergantung pada durasi pengembalian buku." },
];

const LandingPage = () => {
    usePageTitle('Selamat Datang di Sastra.in');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const [landingData, setLandingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        const fetchLandingData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/landing');
                setLandingData(res.data);
            } catch (err) {
                console.error("Gagal memuat data landing:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLandingData();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFBEB] font-mono text-black selection:bg-[#FFD600] selection:text-black">

            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }}></div>

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 px-6 md:px-12' : 'py-4 px-6 md:px-12'
                }`}>
                <div className={`max-w-7xl mx-auto flex justify-between items-center bg-white brutal-border-heavy brutal-shadow p-2 md:p-3 transition-all duration-300 ${scrolled ? 'rounded-2xl' : 'rounded-none'
                    }`}>
                    <div className="flex items-center gap-0">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain hover:rotate-12 transition-transform" />
                        <span className="text-2xl font-black uppercase tracking-tighter -ml-2">Sastra<span className="bg-[#FFD600] px-1">.in</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-bold uppercase text-sm">
                        <a href="#features" className="hover:underline decoration-4 decoration-[#FFD600] underline-offset-4">Fitur</a>
                        <a href="#kategori" className="hover:underline decoration-4 decoration-[#FF4081] underline-offset-4">Kategori</a>
                        <a href="#faq" className="hover:underline decoration-4 decoration-[#00E5FF] underline-offset-4">Bantuan</a>
                        <Link to="/login" className="hover:underline decoration-4 decoration-[#AEEA00] underline-offset-4">Masuk</Link>
                        <Link to="/register" className="bg-[#FFD600] brutal-border brutal-shadow px-6 py-2 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                            Daftar
                        </Link>
                    </div>

                    <button className="md:hidden brutal-border p-2 bg-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="md:hidden mt-4 bg-white brutal-border-heavy brutal-shadow p-6 flex flex-col gap-4 font-black uppercase"
                        >
                            <a href="#features" onClick={() => setIsMenuOpen(false)}>Fitur</a>
                            <a href="#kategori" onClick={() => setIsMenuOpen(false)}>Kategori</a>
                            <Link to="/login">Masuk</Link>
                            <Link to="/register" className="bg-[#FFD600] brutal-border-heavy p-4 text-center">Daftar Akun</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* --- HERO SECTION --- */}
            {/* 1. Di sini px-6 diubah menjadi px-8 md:px-16 lg:px-24 agar jarak pinggirnya lebih luas */}
<header className="relative pt-32 pb-16 px-8 md:px-16 lg:px-24 z-10 overflow-hidden bg-[#FFFBEB]">
    
    {/* 2. max-w-7xl diubah menjadi max-w-6xl agar konten lebih merapat ke tengah */}
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center w-full">
        
        {/* === KONTEN KIRI === */}
        <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="inline-block bg-[#00E5FF] brutal-border px-2 py-1 font-black text-[15px] uppercase mb-5 brutal-shadow">
                Sastra.in aja yuk!
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.98] mb-6 uppercase tracking-tighter text-black">
                Akses <br />
                <span className="bg-[#FF4081] text-white px-3 md:px-4 inline-block -rotate-1 brutal-border-heavy my-1 brutal-shadow">Ribuan Buku</span> <br />
                di Sastra.in
            </h1>
            <p className="text-base md:text-lg font-bold text-black/80 mb-8 max-w-md leading-tight uppercase text-left">
                Platform literasi paling berani. <br />
                Baca sepuasnya, gratis selamanya.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/login" className="bg-[#AEEA00] brutal-border-heavy brutal-shadow px-5 py-4 text-lg md:text-xl font-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-block text-black">
                    Mulai Baca
                </Link>
                <a href="#features" className="bg-white brutal-border-heavy brutal-shadow px-5 py-4 flex items-center gap-2 font-black uppercase text-base md:text-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-black">
                    <PlayCircle size={24} /> Eksplor
                </a>
            </div>

            {/* === KONTEN STATS === */}
            <div className="flex gap-8 lg:gap-12 items-center border-t-4 border-black pt-6 w-fit">
                {loading ? (
                    <>
                        <div className="text-center animate-pulse">
                            <div className="w-16 h-10 bg-gray-300 mx-auto mb-2 brutal-border"></div>
                            <div className="w-24 h-3 bg-gray-300 mx-auto brutal-border"></div>
                        </div>
                        <div className="w-[4px] h-10 lg:h-12 bg-black"></div>
                        <div className="text-center animate-pulse">
                            <div className="w-16 h-10 bg-gray-300 mx-auto mb-2 brutal-border"></div>
                            <div className="w-24 h-3 bg-gray-300 mx-auto brutal-border"></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-black text-black">{landingData?.stats?.totalBuku > 1000 ? `${(landingData.stats.totalBuku / 1000).toFixed(1)}K+` : landingData?.stats?.totalBuku}</p>
                            <p className="text-[10px] lg:text-xs font-bold uppercase text-black/50 mt-1">Koleksi Buku</p>
                        </div>
                        <div className="w-[4px] h-10 lg:h-12 bg-black"></div>
                        <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-black text-black">{landingData?.stats?.totalPeminjam > 1000 ? `${(landingData.stats.totalPeminjam / 1000).toFixed(1)}K+` : landingData?.stats?.totalPeminjam}</p>
                            <p className="text-[10px] lg:text-xs font-bold uppercase text-black/50 mt-1">Peminjam Aktif</p>
                        </div>
                    </>
                )}
            </div>
        </motion.div>

        {/* === KONTEN KANAN (CARD) === */}
        <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden lg:block w-fit ml-auto"
        >
            <div className="bg-[#FFD600] brutal-border-heavy brutal-shadow-lg rotate-1 p-4 max-w-sm w-full">
                <img
                    src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Featured Book"
                    className="w-full brutal-border-heavy aspect-video object-cover"
                />
                <div className="bg-white brutal-border-heavy mt-3 p-4 font-black text-black">
                    <p className="text-[9px] uppercase text-black/50 mb-1">Pilihan Editor</p>
                    <p className="text-xl uppercase tracking-tighter">Tentang Kamu</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t-2 border-black/10">
                        <span className="bg-[#FF4081] text-white px-2 py-0.5 font-bold text-[10px] uppercase">Tere Liye</span>
                        <span className="flex items-center gap-1 text-base"><Star fill="black" size={14} /> 4.9</span>
                    </div>
                </div>
            </div>

            {/* Corner Badges */}
            <div className="absolute -top-3 -right-4 bg-[#00E5FF] brutal-border px-3 py-1 brutal-shadow font-black -rotate-12 text-sm z-10">
                GRATIS!
            </div>
            <div className="absolute -bottom-4 left-0 bg-[#AEEA00] brutal-border px-3 py-1 brutal-shadow font-black rotate-12 text-sm z-20">
                LOKAL!
            </div>
        </motion.div>

    </div>
</header>

            {/* --- STATS SECTION --- */}
            <section className="py-20 bg-black text-white relative z-10 border-y-8 border-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className={`${STATS_COLORS[idx]} text-black brutal-border-heavy p-8 brutal-shadow text-center animate-pulse opacity-70`}>
                                    <div className="h-12 bg-white/50 w-24 mx-auto mb-4 border-2 border-black"></div>
                                    <div className="h-4 bg-white/50 w-32 mx-auto border-2 border-black"></div>
                                </div>
                            ))
                        ) : (
                            [
                                { label: "Koleksi Buku", value: landingData?.stats?.totalBuku || 0 },
                                { label: "Peminjam Aktif", value: landingData?.stats?.totalPeminjam || 0 },
                                { label: "Total Pinjam", value: landingData?.stats?.totalPeminjaman || 0 },
                                { label: "Rating Apps", value: landingData?.stats?.ratingApps || "4.9/5.0" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`${STATS_COLORS[idx]} text-black brutal-border-heavy p-8 brutal-shadow text-center`}
                                >
                                    <h3 className="text-4xl md:text-5xl font-black mb-2">{stat.value}</h3>
                                    <p className="font-bold uppercase text-sm">{stat.label}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black uppercase mb-4 tracking-tighter">
                            Kenapa <span className="bg-[#00E5FF] px-4 brutal-border-heavy">Sastra.in?</span>
                        </h2>
                        <p className="text-xl font-bold uppercase text-black/60">Teknologi Terkini Untuk Literasi Masa Depan</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className={`${feature.color} brutal-border-heavy p-10 brutal-shadow-lg group text-black`}
                            >
                                <div className="bg-white brutal-border-heavy w-20 h-20 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-none">
                                    {React.cloneElement(feature.icon, { size: 40 })}
                                </div>
                                <h3 className="text-3xl font-black uppercase mb-4 leading-none">{feature.title}</h3>
                                <p className="font-bold uppercase text-black/70 leading-tight">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CATEGORIES (BENTO) --- */}
            <section id="kategori" className="py-24 px-6 relative z-10 bg-white border-y-8 border-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter text-black">
                                Jelajahi <br /> <span className="text-[#FF4081]">Kategori.</span>
                            </h2>
                        </div>
                        <p className="max-w-md font-bold uppercase text-black/60">
                            Kami mengelompokkan ribuan buku untuk memudahkan pencarian minat bakat kamu.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className={`${KATEGORI_COLORS[idx]} brutal-border-heavy p-8 brutal-shadow cursor-pointer group flex flex-col justify-between h-[300px] text-black animate-pulse opacity-70`}>
                                    <div className="bg-white/50 border-4 border-black w-16 h-16 rounded-none"></div>
                                    <div>
                                        <div className="h-8 bg-white/50 border-4 border-black mb-3 w-3/4"></div>
                                        <div className="h-6 bg-white/30 border-2 border-black w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : landingData?.categories?.length > 0 ? (
                            landingData.categories.map((cat, idx) => {
                                const colorIdx = idx % 4;
                                return (
                                    <motion.div
                                        key={cat.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`${KATEGORI_COLORS[colorIdx]} brutal-border-heavy p-8 brutal-shadow cursor-pointer group flex flex-col justify-between h-[300px] text-black`}
                                    >
                                        <div className="bg-white brutal-border-heavy w-16 h-16 flex items-center justify-center brutal-shadow group-hover:-translate-y-2 transition-transform shadow-none">
                                            {KATEGORI_ICONS[colorIdx]}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase mb-2 leading-none">{cat.title}</h3>
                                            <p className="font-bold uppercase bg-white/50 inline-block px-2">{cat.count}</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 p-12 text-center border-4 border-dashed border-black font-black uppercase opacity-50">
                                Belum ada kategori
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- TRENDING BOOKS --- */}
            <section className="py-24 px-6 relative z-10 bg-[#00E5FF] border-b-8 border-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-16 tracking-tighter text-center md:text-left text-black">
                        Trending <span className="bg-white px-4 brutal-border-heavy inline-block rotate-2">Minggu Ini</span>
                    </h2>

                    <div className="flex gap-8 overflow-x-auto pb-12 snap-x scrollbar-hide -mx-6 px-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="min-w-[320px] snap-center">
                                    <BookCardSkeleton hideRating={false} />
                                </div>
                            ))
                        ) : landingData?.popularBooks?.length > 0 ? (
                            landingData.popularBooks.map((buku, idx) => (
                                <motion.div
                                    key={buku.id}
                                    whileHover={{ rotate: 1 }}
                                    className="min-w-[320px] bg-white brutal-border-heavy brutal-shadow-lg snap-center flex flex-col text-black"
                                >
                                    <div className="p-4 flex-1">
                                        <img src={buku.img} alt={buku.title} className="w-full h-64 object-cover brutal-border-heavy mb-6" />
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-black uppercase leading-none">{buku.title}</h3>
                                            <div className="bg-[#FFD600] brutal-border px-2 py-1 flex items-center gap-1 font-black text-sm shadow-none">
                                                <Star size={14} fill="black" /> {buku.rating}
                                            </div>
                                        </div>
                                        <p className="font-bold uppercase text-black/50 mb-6">{buku.author}</p>
                                    </div>
                                    <Link to="/login" className="w-full bg-black text-white p-6 font-black uppercase text-xl hover:bg-[#FF4081] transition-colors flex items-center justify-center gap-3 border-t-4 border-black">
                                        Pinjam Sekarang <ArrowRight />
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full text-center p-12 border-4 border-dashed border-black font-black uppercase opacity-50">
                                Belum ada buku populer.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 px-6 relative z-10 bg-[#FFD600]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-20 text-center tracking-tighter text-black">
                        Gimana Caranya?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-[50px] left-0 right-0 h-2 bg-black z-0"></div>

                        {HOW_IT_WORKS.map((item, idx) => (
                            <div key={idx} className="relative z-10">
                                <div className="bg-[#AEEA00] brutal-border-heavy w-24 h-24 flex items-center justify-center text-4xl font-black brutal-shadow mx-auto mb-8 shadow-none border-4 border-black">
                                    {item.step}
                                </div>
                                <div className="bg-white brutal-border-heavy p-8 brutal-shadow text-center text-black">
                                    <h3 className="text-2xl font-black uppercase mb-4">{item.title}</h3>
                                    <p className="font-bold uppercase text-black/70 leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-24 px-6 relative z-10 bg-white border-y-8 border-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <Quote size={80} className="mx-auto mb-8 text-[#FF4081]" strokeWidth={3} />
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">Apa Kata Mereka?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testi, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ rotate: -2 }}
                                className="bg-white brutal-border-heavy p-8 brutal-shadow-lg flex flex-col gap-6 text-black"
                            >
                                <p className="text-lg font-black uppercase leading-tight">"{testi.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <img src={testi.avatar} alt={testi.name} className="w-16 h-16 rounded-full brutal-border-heavy" />
                                    <div>
                                        <p className="font-black uppercase">{testi.name}</p>
                                        <p className="font-bold text-sm text-black/50 uppercase">{testi.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-24 px-6 relative z-10 bg-[#FF4081] text-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black uppercase mb-16 text-center tracking-tighter">
                        Ada Pertanyaan?
                    </h2>

                    <div className="flex flex-col gap-6">
                        {FAQ.map((item, idx) => (
                            <div key={idx} className="bg-white text-black brutal-border-heavy brutal-shadow overflow-hidden shadow-none border-4 border-black">
                                <button
                                    className="w-full p-6 flex justify-between items-center text-left font-black uppercase text-xl"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    {item.q}
                                    <ChevronDown className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="px-6 pb-6 pr-12 font-bold uppercase text-black/70"
                                        >
                                            {item.a}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER & CTA --- */}
            <footer className="relative pt-32 pb-12 px-6 z-10 bg-[#AEEA00] border-t-8 border-black">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#00E5FF] brutal-border-heavy brutal-shadow-lg p-12 md:p-24 text-center mb-32 -mt-60 relative z-20 text-black">
                        <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 tracking-tighter">
                            Gabung Komunitas <br /> <span className="bg-[#FF4081] text-white px-4 brutal-border-heavy inline-block -rotate-2 my-4">Sastra.in!</span>
                        </h2>
                        <p className="text-lg md:text-xl font-black uppercase mb-12 max-w-2xl mx-auto leading-tight text-black/80">
                            Ngobrol bareng sesama pembaca, dapatkan info rilis buku terbaru, dan ikut diskusi seru setiap minggunya.
                        </p>
                        
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <a href="#" className="bg-[#25D366] text-black border-4 border-black px-8 py-5 text-xl font-black uppercase brutal-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                Saluran WhatsApp
                            </a>
                            
                            <a href="#" className="bg-[#5865F2] text-white border-4 border-black px-8 py-5 text-xl font-black uppercase brutal-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                                Server Discord
                            </a>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 font-black uppercase mb-20 text-black">
                        <div className="lg:col-span-1">
                            <span className="text-4xl font-black uppercase tracking-tighter mb-8 block">Sastra<span className="bg-white px-1 brutal-border border-2 border-black">.in</span></span>
                            <p className="font-bold text-black/70 leading-tight">Perpustakaan digital modern untuk masa depan Indonesia yang lebih cerdas.</p>
                        </div>
                        <div>
                            <h4 className="text-xl mb-6 bg-black text-white inline-block px-2">Link Cepat</h4>
                            <ul className="flex flex-col gap-3">
                                <li><a href="#" className="hover:underline">Beranda</a></li>
                                <li><a href="#features" className="hover:underline">Fitur</a></li>
                                <li><a href="#kategori" className="hover:underline">Kategori</a></li>
                                <li><a href="#faq" className="hover:underline">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl mb-6 bg-black text-white inline-block px-2">Kontak Kami</h4>
                            <ul className="flex flex-col gap-3">
                                <li className="flex items-center gap-2"><Phone size={20} /> 0812-3456-7890</li>
                                <li className="flex items-center gap-2"><Mail size={20} /> hello@sastra.in</li>
                                <li className="flex items-center gap-2"><MapPin size={20} /> Tangerang, Indonesia</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl mb-6 bg-black text-white inline-block px-2">Ikuti Kami</h4>
                            <div className="flex gap-4">
                                <a href="#" className="bg-white brutal-border border-2 border-black p-3 brutal-shadow hover:bg-[#E1306C] hover:text-white cursor-pointer transition-colors" title="Instagram">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="bg-white brutal-border border-2 border-black p-3 brutal-shadow hover:bg-[#000000] hover:text-white cursor-pointer transition-colors" title="X (Twitter)">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="bg-white brutal-border border-2 border-black p-3 brutal-shadow hover:bg-[#000000] hover:text-white cursor-pointer transition-colors" title="TikTok">
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 font-black uppercase text-black">
                        <p>&copy; 2026 Sastra.in - All Rights Reserved.</p>
                        <div className="flex gap-8 text-sm">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;