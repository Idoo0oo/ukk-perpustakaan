import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    BookOpen, Search, ArrowRight, Star, 
    Library, Zap, Shield, Heart, Menu, X, 
    TrendingUp, Award, Quote, CheckCircle2 
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

// --- DATA ---
const KATEGORI = [
    { title: "Teknologi & AI", count: "120+ Buku", color: "bg-blue-50 text-blue-600 border-blue-100", icon: <Zap /> },
    { title: "Fiksi Best Seller", count: "300+ Buku", color: "bg-pink-50 text-pink-600 border-pink-100", icon: <Heart /> },
    { title: "Sains Modern", count: "80+ Buku", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <Award /> },
    { title: "Sejarah Dunia", count: "50+ Buku", color: "bg-orange-50 text-orange-600 border-orange-100", icon: <Library /> },
];

const BUKU_POPULER = [
    { title: "Atomic Habits", author: "James Clear", rating: "4.9", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&q=80" },
    { title: "Filosofi Teras", author: "Henry Manampiring", rating: "4.8", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80" },
    { title: "Laskar Pelangi", author: "Andrea Hirata", rating: "4.9", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" },
    { title: "Dunia Sophie", author: "Jostein Gaarder", rating: "4.7", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80" },
    { title: "Sapiens", author: "Yuval Noah Harari", rating: "4.8", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80" },
];

const LandingPage = () => {
    usePageTitle('Selamat Datang');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Efek Navbar berubah saat di-scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden selection:bg-violet-200 selection:text-violet-900">
            
            {/* BACKGROUND PATTERN (DOT GRID) - Memberikan tekstur modern */}
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}></div>

            {/* --- FLOATING NAVBAR (ULTRA MODERN) --- */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
                <nav className={`w-full max-w-7xl transition-all duration-300 ${
                    scrolled 
                    ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 rounded-2xl border border-white/50 py-3 px-6" 
                    : "bg-transparent py-5 px-6"
                }`}>
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-violet-500/20">
                                <BookOpen size={20} fill="currentColor" className="opacity-90" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Perpus<span className="text-violet-600">Digital</span>.
                            </span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-violet-600 px-4 py-2 transition">
                                Masuk
                            </Link>
                            <Link to="/register" className="group relative px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-900/10 overflow-hidden hover:scale-105 transition-all duration-300">
                                <span className="relative z-10">Daftar Gratis</span>
                                <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-violet-600/100 bg-slate-900"></div>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2"
                        >
                            <Link to="/login" className="w-full py-3 text-center rounded-xl bg-slate-50 text-slate-700 font-semibold">Masuk Akun</Link>
                            <Link to="/register" className="w-full py-3 text-center rounded-xl bg-violet-600 text-white font-semibold shadow-lg shadow-violet-200">Daftar Sekarang</Link>
                        </motion.div>
                    )}
                </nav>
            </div>

            {/* --- HERO SECTION (PRECISION FIT) --- */}
            {/* min-h-screen memastikan tinggi minimal 1 layar. flex items-center memastikan konten di tengah vertikal */}
            <header className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden z-10">
                
                {/* Decorative Gradients */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-300/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100/50 border border-violet-200 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping"></span>
                            Platform Perpustakaan Digital #1
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            Jelajahi Dunia <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500">
                                Tanpa Batas.
                            </span>
                        </h1>
                        
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg font-medium">
                            Akses ribuan koleksi buku, jurnal, dan referensi akademik langsung dari genggamanmu. Mudah, Cepat, dan Gratis untuk Siswa.
                        </p>

                        {/* Search Input Modern */}
                        <div className="relative max-w-md group z-20">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-full p-2 flex items-center shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="pl-4 pr-2 text-slate-400">
                                    <Search size={22} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Cari buku favoritmu..." 
                                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium h-10"
                                />
                                <button className="bg-slate-900 hover:bg-slate-800 text-white h-10 px-6 rounded-full font-bold text-sm transition-all hover:shadow-lg">
                                    Cari
                                </button>
                            </div>
                        </div>

                        {/* Stats / Trust Badges */}
                        <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={18} /> Gratis Akses
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={18} /> Terverifikasi
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={18} /> 24/7 Online
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Image (3D Floating Effect) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block perspective-1000"
                    >
                        {/* Main Image */}
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-500/20 border-8 border-white bg-white"
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Library App" 
                                className="w-full h-[550px] object-cover"
                            />
                            
                            {/* Glass Card Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-white/50 shadow-lg flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Buku Minggu Ini</p>
                                    <p className="font-bold text-slate-800">Filosofi Teras</p>
                                </div>
                                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
                                    Pinjam
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Background Elements behind image */}
                        <div className="absolute top-10 -right-10 w-full h-full bg-slate-100 rounded-[3rem] -z-10 rotate-6 border border-slate-200"></div>
                    </motion.div>
                </div>
            </header>

            {/* --- SECTION: CATEGORY (BENTO GRID) --- */}
            <section className="py-24 px-6 relative z-10 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Kategori Populer</h2>
                        <p className="text-slate-500">Kami telah mengurasi ribuan buku ke dalam kategori yang mudah dijelajahi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {KATEGORI.map((cat, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -8 }}
                                className={`p-8 rounded-[2rem] border ${cat.color} bg-white hover:border-transparent hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 cursor-pointer group`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.title}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-500 text-sm font-medium">{cat.count}</p>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-slate-900">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION: TRENDING HORIZONTAL SCROLL (NETFLIX STYLE) --- */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Sedang Trending</h2>
                            <p className="text-slate-400">Buku yang paling banyak dipinjam minggu ini.</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                             {/* Hint scroll buttons could go here */}
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-10 snap-x scrollbar-hide -mx-6 px-6">
                        {BUKU_POPULER.map((buku, idx) => (
                            <div key={idx} className="min-w-[260px] md:min-w-[300px] snap-center group">
                                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden mb-5 bg-slate-800 shadow-2xl shadow-black/50 border border-white/10">
                                    <img 
                                        src={buku.img} 
                                        alt={buku.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                                    
                                    {/* Hover Action */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-slate-900/40 backdrop-blur-sm">
                                        <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition">
                                            Lihat Detail
                                        </button>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-white/10">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" /> {buku.rating}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold truncate pr-4">{buku.title}</h3>
                                <p className="text-slate-400 text-sm">{buku.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* --- SECTION: CTA FOOTER --- */}
             <footer className="bg-white border-t border-slate-200 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-violet-200">
                        {/* Patterns */}
                        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500 rounded-full blur-[80px] opacity-40"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-40"></div>
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                                Mulai Perjalanan Literasimu Hari Ini.
                            </h2>
                            <p className="text-violet-100 text-lg md:text-xl mb-10 font-medium">
                                Bergabung dengan ribuan siswa lainnya. Tanpa biaya, tanpa ribet.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register" className="px-10 py-4 bg-white text-violet-700 rounded-full font-bold text-lg hover:bg-slate-50 transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                    Daftar Akun Gratis
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-16 text-slate-400 text-sm font-medium">
                        <p>&copy; 2026 PerpusDigital.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="#" className="hover:text-violet-600 transition">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-violet-600 transition">Syarat & Ketentuan</a>
                            <a href="#" className="hover:text-violet-600 transition">Bantuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;