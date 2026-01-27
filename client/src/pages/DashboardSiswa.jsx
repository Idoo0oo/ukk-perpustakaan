import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Bookmark, Info, GraduationCap, LogOut, Clock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PinjamanSaya from './PinjamanSaya'; // Pastikan file ini sudah kamu buat

const DashboardSiswa = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    
    // Ambil nama dari localStorage sesuai kunci yang kita simpan saat login
    const rawNama = localStorage.getItem('namaUser');
    const namaSiswa = (rawNama && rawNama !== "undefined") ? rawNama : 'Siswa';

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Kamu harus login kembali untuk meminjam buku.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Ya, Keluar!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/buku', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooks(res.data);
            } catch (err) { console.error(err); }
        };
        fetchBooks();
    }, [token]);

    const handlePinjam = (book) => {
        Swal.fire({
            title: 'Berapa hari ingin meminjam?',
            input: 'number',
            inputAttributes: { min: 1, max: 14, step: 1 },
            inputValue: 7,
            showCancelButton: true,
            confirmButtonText: 'Ajukan Pinjaman',
            confirmButtonColor: '#4f46e5',
            footer: '<b class="text-error text-xs text-red-500">Maksimal peminjaman 14 hari</b>'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const lamaPinjam = result.value;
                if (lamaPinjam > 14) return Swal.fire('Gagal', 'Maksimal 14 hari!', 'error');

                try {
                    // Endpoint sesuai dengan peminjamanRoutes.js kamu
                    await axios.post('http://localhost:5000/api/peminjaman/pinjam', {
                        bukuID: book.BukuID,
                        lamaPinjam: lamaPinjam
                    }, { headers: { Authorization: `Bearer ${token}` } });

                    Swal.fire({
                        icon: 'success',
                        title: 'Permintaan Terkirim',
                        text: 'Silakan tunggu persetujuan Admin di menu "Pinjaman Saya".',
                        confirmButtonColor: '#4f46e5'
                    });
                } catch (err) {
                    Swal.fire('Gagal', err.response?.data?.message || 'Server Error', 'error');
                }
            }
        });
    };

    const filteredBooks = books.filter(b => 
        b.Judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Komponen Tampilan Katalog
    const KatalogView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto mt-8 px-6">
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-3.5 text-indigo-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cari judul buku atau penulis..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 shadow-xl focus:ring-4 focus:ring-indigo-300 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Buku */}
            <div className="max-w-6xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <motion.div 
                            key={book.BukuID}
                            whileHover={{ y: -10 }}
                            className="card bg-white shadow-xl border border-gray-100 overflow-hidden group"
                        >
                            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                                <Book size={64} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute top-3 right-3">
                                    <span className="badge badge-primary font-bold text-[10px] uppercase">
                                        {book.NamaKategori || 'Umum'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{book.Judul}</h3>
                                <div className="text-sm text-gray-500">
                                    <p>Penulis: {book.Penulis}</p>
                                    <p className="font-semibold text-indigo-600">Stok: {book.Stok || 0}</p>
                                </div>
                                <div className="pt-2 flex gap-2">
                                    <button 
                                        onClick={() => handlePinjam(book)}
                                        className="btn btn-primary flex-1 shadow-lg shadow-indigo-200"
                                        disabled={book.Stok <= 0}
                                    >
                                        {book.Stok <= 0 ? 'Habis' : 'Pinjam'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {filteredBooks.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <Info size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Buku tidak ditemukan.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header Section */}
            <div className="bg-indigo-600 text-white py-12 px-6 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <GraduationCap size={40} /> Halo {namaSiswa}, Mau Baca Apa Hari Ini?
                            </h1>
                            {/* Navigasi Tab */}
                            <div className="mt-6 flex gap-6 border-b border-indigo-400/30">
                                <Link 
                                    to="/peminjam" 
                                    className={`pb-2 text-sm font-bold transition-all ${location.pathname === '/peminjam' ? 'border-b-4 border-white' : 'text-indigo-200 hover:text-white'}`}
                                >
                                    Katalog Buku
                                </Link>
                                <Link 
                                    to="/peminjam/saya" 
                                    className={`pb-2 text-sm font-bold transition-all ${location.pathname === '/peminjam/saya' ? 'border-b-4 border-white' : 'text-indigo-200 hover:text-white'}`}
                                >
                                    Pinjaman Saya
                                </Link>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="btn btn-ghost text-white bg-indigo-700/50 hover:bg-red-500 border border-indigo-400 gap-2 px-6 rounded-xl transition-all"
                        >
                            <LogOut size={20} /> <span className="font-bold">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Konten Dinamis */}
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<KatalogView />} />
                    <Route path="/saya" element={<PinjamanSaya />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
};

export default DashboardSiswa;