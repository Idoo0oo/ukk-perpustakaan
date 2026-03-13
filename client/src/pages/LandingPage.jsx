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
import usePageTitle from '../hooks/usePageTitle';

// --- DATA ---
const KATEGORI = [
    { title: "Teknologi & AI", count: "120+ Buku", color: "bg-[#00E5FF]", icon: <Zap className="w-8 h-8" /> },
    { title: "Fiksi Best Seller", count: "300+ Buku", color: "bg-[#FF4081]", icon: <Heart className="w-8 h-8" /> },
    { title: "Sains Modern", count: "80+ Buku", color: "bg-[#AEEA00]", icon: <Award className="w-8 h-8" /> },
    { title: "Sejarah Dunia", count: "50+ Buku", color: "bg-[#FFD600]", icon: <Library className="w-8 h-8" /> },
];

const STATS = [
    { label: "Koleksi Buku", value: "15,000+", color: "bg-[#FFD600]" },
    { label: "Peminjam Aktif", value: "8,500+", color: "bg-[#AEEA00]" },
    { label: "Peminjaman/Bln", value: "12,000+", color: "bg-[#00E5FF]" },
    { label: "Rating Apps", value: "4.9/5.0", color: "bg-[#FF4081]" },
];

const FEATURES = [
    { title: "Akses 24/7", desc: "Baca kapan saja dan di mana saja tanpa batasan waktu.", icon: <Globe />, color: "bg-[#00E5FF]" },
    { title: "Multi Platform", desc: "Tersedia di Web, Android, dan iOS untuk kenyamananmu.", icon: <Smartphone />, color: "bg-[#FFD600]" },
    { title: "Koleksi Premium", desc: "Ribuan buku eksklusif dari penerbit ternama dunia.", icon: <Star />, color: "bg-[#FF4081]" },
];

const BUKU_POPULER = [
    { title: "Atomic Habits", author: "James Clear", rating: "4.9", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&q=80", color: "bg-[#FFD600]" },
    { title: "Filosofi Teras", author: "Henry Manampiring", rating: "4.8", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80", color: "bg-[#AEEA00]" },
    { title: "Laskar Pelangi", author: "Andrea Hirata", rating: "4.9", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80", color: "bg-[#00E5FF]" },
    { title: "Dunia Sophie", author: "Jostein Gaarder", rating: "4.7", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80", color: "bg-[#FF4081]" },
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
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
                <div className="text-center">
                    <p className="text-3xl lg:text-4xl font-black text-black">15K+</p>
                    <p className="text-[10px] lg:text-xs font-bold uppercase text-black/50 mt-1">Koleksi Buku</p>
                </div>
                <div className="w-[4px] h-10 lg:h-12 bg-black"></div>
                <div className="text-center">
                    <p className="text-3xl lg:text-4xl font-black text-black">8K+</p>
                    <p className="text-[10px] lg:text-xs font-bold uppercase text-black/50 mt-1">Peminjam Aktif</p>
                </div>
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
                        {STATS.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0.5, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`${stat.color} text-black brutal-border-heavy p-8 brutal-shadow text-center`}
                            >
                                <h3 className="text-4xl md:text-5xl font-black mb-2">{stat.value}</h3>
                                <p className="font-bold uppercase text-sm">{stat.label}</p>
                            </motion.div>
                        ))}
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
                        {KATEGORI.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className={`${cat.color} brutal-border-heavy p-8 brutal-shadow cursor-pointer group flex flex-col justify-between h-[300px] text-black`}
                            >
                                <div className="bg-white brutal-border-heavy w-16 h-16 flex items-center justify-center brutal-shadow group-hover:-translate-y-2 transition-transform shadow-none">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase mb-2 leading-none">{cat.title}</h3>
                                    <p className="font-bold uppercase bg-white/50 inline-block px-2">{cat.count}</p>
                                </div>
                            </motion.div>
                        ))}
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
                        {BUKU_POPULER.map((buku, idx) => (
                            <motion.div
                                key={idx}
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
                                <button className="w-full bg-black text-white p-6 font-black uppercase text-xl hover:bg-[#FF4081] transition-colors flex items-center justify-center gap-3 border-t-4 border-black">
                                    Pinjam Sekarang <ArrowRight />
                                </button>
                            </motion.div>
                        ))}
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
                    <div className="bg-white brutal-border-heavy brutal-shadow-lg p-12 md:p-24 text-center mb-32 -mt-60 relative z-20 text-black">
                        <h2 className="text-5xl md:text-8xl font-black uppercase leading-none mb-10 tracking-tighter">
                            Ayo Gabung <br /> <span className="bg-[#FFD600] px-4 brutal-border-heavy inline-block -rotate-2 my-4">Sekarang Juga!</span>
                        </h2>
                        <p className="text-xl md:text-2xl font-black uppercase mb-12 max-w-2xl mx-auto leading-tight">
                            Ribuan petualangan menantimu <br /> di setiap lembar buku. <br /> Gratis, Tanpa Ribet.
                        </p>
                        <Link to="/register" className="bg-black text-white px-12 py-8 text-3xl font-black uppercase brutal-shadow-lg hover:scale-105 transition-transform inline-block">
                            Daftar Akun Gratis
                        </Link>
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