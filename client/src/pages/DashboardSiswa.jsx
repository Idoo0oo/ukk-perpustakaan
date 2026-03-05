// File: client/src/pages/DashboardSiswa.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, Filter, LogOut, LayoutGrid, Book, User, Heart } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

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
    const location = useLocation(); // Tambahkan useLocation untuk mengecek URL aktif
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Siswa';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resBuku = await axios.get('http://localhost:5000/api/buku', { headers: { Authorization: `Bearer ${token}` } });
                setBooks(resBuku.data);
                setFilteredBooks(resBuku.data);

                const resKategori = await axios.get('http://localhost:5000/api/kategori', { headers: { Authorization: `Bearer ${token}` } });
                setCategories(resKategori.data);

                const resKoleksi = await axios.get('http://localhost:5000/api/fitur/koleksi', { headers: { Authorization: `Bearer ${token}` } });
                const ids = resKoleksi.data.map(item => item.BukuID);
                setSavedBookIds(ids);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate('/');
                }
            }
        };
        fetchData();
    }, [navigate, token]);

    useEffect(() => {
        let result = books;

        // 1. Filter Kategori
        if (selectedCategory !== 'All') {
            result = result.filter(book => {
                if (!book.NamaKategori) return false;
                const kategoriBuku = book.NamaKategori.split(', '); 
                return kategoriBuku.includes(selectedCategory);
            });
        }
        
        // 2. Filter Pencarian
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
            confirmButtonColor: '#4f46e5',
            cancelButtonText: 'Batal'
        });

        if (lamaPinjam) {
            if (lamaPinjam > 14 || lamaPinjam < 1) return Swal.fire('Error', 'Lama peminjaman harus 1 - 14 hari.', 'error');
            try {
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
                await axios.post('http://localhost:5000/api/peminjaman', { bukuID, lamaPinjam }, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: 'Berhasil Diajukan!', text: 'Silakan tunggu persetujuan dari Admin.', timer: 2000, showConfirmButton: false });
                navigate('/peminjam/pinjaman-saya');
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            }
        }
    };

    const handleBookmark = async (bukuID) => {
        try {
            const isCurrentlySaved = savedBookIds.includes(bukuID);
            setSavedBookIds(prev => isCurrentlySaved ? prev.filter(id => id !== bukuID) : [...prev, bukuID]);

            const res = await axios.post('http://localhost:5000/api/fitur/koleksi', { bukuID }, { headers: { Authorization: `Bearer ${token}` } });
            
            Swal.fire({
                icon: 'success', title: 'Sukses', text: res.data.isSaved ? 'Disimpan ke Koleksi!' : 'Dihapus dari Koleksi.',
                timer: 1000, showConfirmButton: false, toast: true, position: 'top-end'
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Gagal', 'Terjadi kesalahan koneksi.', 'error');
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?', text: "Sesi Anda akan berakhir.", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Ya, Keluar', confirmButtonColor: '#d33'
        }).then((res) => { if (res.isConfirmed) { localStorage.clear(); navigate('/'); } });
    };

    // --- Definisi Menu Items untuk Navbar Bawah ---
    const menuItems = [
        { path: '/peminjam', name: 'Katalog', icon: <LayoutGrid size={22} /> },
        { path: '/peminjam/koleksi', name: 'Koleksi Saya', icon: <Heart size={22} /> },
        { path: '/peminjam/pinjaman-saya', name: 'Pinjaman Saya', icon: <Book size={22} /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-gray-900 relative overflow-hidden">
            
            {/* --- HEADER ATAS (Style Baru, Mirip Admin) --- */}
            <header className="h-20 bg-white/60 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm z-30 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/30">
                        <BookOpen size={24} fill="currentColor" className="opacity-90" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                        Perpus<span className="text-violet-600">Digital</span>.
                    </span>
                    
                    {/* Badge Siswa Panel */}
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

            {/* --- HERO BANNER --- */}
            <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-12 px-6 shadow-xl shadow-indigo-200">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                        Halo, {namaUser}
                    </h1>
                    <p className="text-violet-100 text-lg">Temukan buku favoritmu dan mulai membaca hari ini.</p>
                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            {/* Perhatikan penambahan pb-32 di sini agar konten paling bawah tidak tertutup oleh navbar mengambang */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-32 overflow-y-auto overflow-x-hidden">
                {/* Search & Filter Component */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8 z-20">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="text" placeholder="Cari judul buku atau penulis..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <Filter size={20} className="text-gray-400 min-w-[20px]" />
                        <button onClick={() => setSelectedCategory('All')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Semua</button>
                        {categories.map(cat => (
                            <button key={cat.KategoriID} onClick={() => setSelectedCategory(cat.NamaKategori)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.NamaKategori ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {cat.NamaKategori}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Buku */}
                {loading ? (
                    <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Buku tidak ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredBooks.map(book => (
                            <div key={book.BukuID} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                                <div className="h-56 bg-slate-100 relative overflow-hidden group">
                                    {book.Gambar ? (
                                        <img src={`http://localhost:5000/uploads/${book.Gambar}`} alt={book.Judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
                                            <Book size={64} className="text-violet-200" />
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => handleBookmark(book.BukuID)}
                                        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-md z-10 ${savedBookIds.includes(book.BukuID) ? "bg-white text-pink-500" : "bg-white/90 text-slate-400 hover:text-pink-500"}`}
                                        title={savedBookIds.includes(book.BukuID) ? "Hapus dari Koleksi" : "Simpan ke Koleksi"}
                                    >
                                        <Heart size={18} fill={savedBookIds.includes(book.BukuID) ? "currentColor" : "none"} />
                                    </button>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 shadow-sm z-10">
                                        {book.NamaKategori || 'Umum'}
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2 leading-tight" title={book.Judul}>{book.Judul}</h3>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1"><User size={14} /> {book.Penulis}</p>
                                    
                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="text-xs">
                                            <span className="block text-slate-400">Stok</span>
                                            <span className={`font-bold text-lg ${book.Stok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{book.Stok}</span>
                                        </div>
                                        <button 
                                            onClick={() => handlePinjam(book.BukuID, book.Judul)}
                                            disabled={book.Stok <= 0}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${book.Stok > 0 ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                        >
                                            {book.Stok > 0 ? 'Pinjam' : 'Habis'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- FLOATING NAVBAR BAWAH (GLASSMORPHISM) --- */}
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
                                {/* Ikon Menu */}
                                <span className="shrink-0 flex items-center justify-center">
                                    {item.icon}
                                </span>

                                {/* Teks menu: tampil melebar saat aktif / hover */}
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

                    {/* Garis Pembatas Vertikal */}
                    <div className="w-[2px] h-8 bg-gray-300/50 mx-1 rounded-full shrink-0"></div>

                    {/* Tombol Logout */}
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

export default DashboardSiswa;