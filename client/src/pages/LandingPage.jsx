import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ShieldCheck, ArrowRight, Library, Users, Star, HelpCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <BookOpen className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">PerpusDigital</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 font-medium hover:text-indigo-600 transition hidden sm:block">
                            Masuk
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
                    {/* Teks Hero */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
                            🚀 Perpustakaan Masa Depan
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Jelajahi Dunia Lewat <span className="text-indigo-600 relative">
                                Genggamanmu
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Akses ribuan koleksi buku digital, manajemen peminjaman yang mudah, dan pengalaman membaca yang menyenangkan. Gratis untuk semua siswa.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                                Mulai Baca <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition flex items-center justify-center">
                                Punya Akun?
                            </Link>
                        </div>
                        
                        {/* Trust Badges */}
                        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-emerald-500" size={18} /> Data Aman & Terenkripsi
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-500" size={18} /> Fitur Favorit Siswa
                            </div>
                        </div>
                    </div>

                    {/* Gambar Hero */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="Reading Book" 
                            className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500 w-full object-cover h-[400px] lg:h-[550px]"
                        />
                    </div>
                </div>
            </header>

            {/* --- SECTION: STATISTIK (BARU) --- */}
            <section className="bg-indigo-900 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')]"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    <div>
                        <div className="text-4xl font-extrabold text-indigo-300 mb-2">1.2K+</div>
                        <div className="text-indigo-100 font-medium">Koleksi Buku</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-indigo-300 mb-2">500+</div>
                        <div className="text-indigo-100 font-medium">Siswa Aktif</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-indigo-300 mb-2">24/7</div>
                        <div className="text-indigo-100 font-medium">Akses Sistem</div>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold text-indigo-300 mb-2">50+</div>
                        <div className="text-indigo-100 font-medium">Kategori</div>
                    </div>
                </div>
            </section>

            {/* --- SECTION: FITUR UNGGULAN --- */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Kenapa Memilih PerpusDigital?</h2>
                        <p className="text-gray-500 text-lg">Kami menyediakan fitur terbaik untuk memudahkan siswa dan guru dalam kegiatan literasi sekolah.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition">
                                <Library className="text-indigo-600 group-hover:text-white transition" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Koleksi Lengkap</h3>
                            <p className="text-gray-500 leading-relaxed">Temukan berbagai genre buku mulai dari Fiksi, Sains, Sejarah, hingga Teknologi terbaru.</p>
                        </div>

                        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition">
                                <Clock className="text-indigo-600 group-hover:text-white transition" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Pinjam Mudah</h3>
                            <p className="text-gray-500 leading-relaxed">Tidak perlu antre. Cukup klik pinjam dari rumah, dan ambil bukunya di perpustakaan.</p>
                        </div>

                        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition">
                                <Users className="text-indigo-600 group-hover:text-white transition" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Ulasan Komunitas</h3>
                            <p className="text-gray-500 leading-relaxed">Lihat apa kata teman-temanmu tentang buku favorit mereka sebelum kamu meminjamnya.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION: FAQ (BARU) --- */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
                        <p className="text-gray-500">Hal-hal yang sering ditanyakan oleh siswa baru.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="collapse collapse-plus bg-gray-50 rounded-xl">
                            <input type="radio" name="my-accordion-3" defaultChecked /> 
                            <div className="collapse-title text-lg font-medium text-gray-800">
                                Berapa lama durasi peminjaman buku?
                            </div>
                            <div className="collapse-content"> 
                                <p className="text-gray-600">Siswa dapat meminjam buku maksimal selama 14 hari. Jika terlambat, akan dikenakan denda sesuai ketentuan.</p>
                            </div>
                        </div>
                        <div className="collapse collapse-plus bg-gray-50 rounded-xl">
                            <input type="radio" name="my-accordion-3" /> 
                            <div className="collapse-title text-lg font-medium text-gray-800">
                                Apakah saya bisa meminjam lebih dari satu buku?
                            </div>
                            <div className="collapse-content"> 
                                <p className="text-gray-600">Ya, setiap siswa diperbolehkan meminjam hingga 3 buku dalam satu waktu.</p>
                            </div>
                        </div>
                        <div className="collapse collapse-plus bg-gray-50 rounded-xl">
                            <input type="radio" name="my-accordion-3" /> 
                            <div className="collapse-title text-lg font-medium text-gray-800">
                                Bagaimana cara mendaftar akun?
                            </div>
                            <div className="collapse-content"> 
                                <p className="text-gray-600">Klik tombol "Daftar Sekarang" di pojok kanan atas, isi data diri dengan lengkap, dan tunggu verifikasi dari Admin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION: CTA (BARU) --- */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto bg-indigo-600 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Siap Menjelajahi Dunia Buku?</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Bergabunglah dengan ratusan siswa lainnya dan mulai petualangan literasimu hari ini. Gratis dan mudah.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg">
                                Daftar Akun Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <BookOpen className="text-indigo-400" size={28} />
                            <span className="text-xl font-bold">PerpusDigital</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Platform perpustakaan digital modern untuk mendukung kegiatan literasi sekolah dengan mudah dan efisien.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">Menu</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link to="/" className="hover:text-indigo-400 transition">Beranda</Link></li>
                            <li><Link to="/login" className="hover:text-indigo-400 transition">Katalog Buku</Link></li>
                            <li><Link to="/register" className="hover:text-indigo-400 transition">Pendaftaran</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">Kategori Populer</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><span className="hover:text-indigo-400 cursor-pointer">Teknologi</span></li>
                            <li><span className="hover:text-indigo-400 cursor-pointer">Fiksi & Novel</span></li>
                            <li><span className="hover:text-indigo-400 cursor-pointer">Sains</span></li>
                            <li><span className="hover:text-indigo-400 cursor-pointer">Sejarah</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">Kontak</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3"><span className="text-indigo-400">Email:</span> admin@sekolah.sch.id</li>
                            <li className="flex gap-3"><span className="text-indigo-400">Telp:</span> (021) 555-0123</li>
                            <li className="flex gap-3"><span className="text-indigo-400">Alamat:</span> Jl. Pendidikan No. 1, Jakarta</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2026 Perpustakaan Digital. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;