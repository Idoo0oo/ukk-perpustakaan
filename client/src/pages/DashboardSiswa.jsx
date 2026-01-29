import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Filter, LogOut, LayoutGrid, Book, User, Heart } from 'lucide-react';

const DashboardSiswa = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('nama');

    // 1. Fetch Data Buku & Kategori
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil Buku
                const resBuku = await axios.get('http://localhost:5000/api/buku', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooks(resBuku.data);
                setFilteredBooks(resBuku.data);

                // Ambil Kategori (Untuk Filter)
                const resKategori = await axios.get('http://localhost:5000/api/kategori', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(resKategori.data);

                const resKoleksi = await axios.get('http://localhost:5000/api/fitur/koleksi', {
                    headers: { Authorization: `Bearer ${token}` }
                });

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

    // 2. Filter Logic (Search + Category)
    useEffect(() => {
        let result = books;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(book => book.NamaKategori === selectedCategory);
        }

        // Filter by Search Term
        if (searchTerm) {
            result = result.filter(book => 
                book.Judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBooks(result);
    }, [searchTerm, selectedCategory, books]);

    // 3. Handler Pinjam Buku
    const handlePinjam = async (bukuID, judul) => {
        // Validasi input hari (SweetAlert Input)
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
            if (lamaPinjam > 14 || lamaPinjam < 1) {
                return Swal.fire('Error', 'Lama peminjaman harus 1 - 14 hari.', 'error');
            }

            try {
                Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });

                await axios.post('http://localhost:5000/api/peminjaman', {
                    bukuID,
                    lamaPinjam
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Diajukan!',
                    text: 'Silakan tunggu persetujuan dari Admin.',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Opsional: Redirect ke halaman "Pinjaman Saya" agar siswa melihat statusnya
                navigate('/peminjam/pinjaman-saya');

            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
            }
        }
    };

    const handleBookmark = async (bukuID) => {
        try {
            // Optimistic Update: Ubah tampilan dulu biar cepat
            const isCurrentlySaved = savedBookIds.includes(bukuID);
            
            if (isCurrentlySaved) {
                // Kalau sudah ada, berarti mau dihapus -> Buang dari state
                setSavedBookIds(prev => prev.filter(id => id !== bukuID));
            } else {
                // Kalau belum ada, berarti mau disimpan -> Tambah ke state
                setSavedBookIds(prev => [...prev, bukuID]);
            }

            // Kirim ke Backend
            const res = await axios.post('http://localhost:5000/api/fitur/koleksi', { bukuID }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Tampilkan Notifikasi
            const pesan = res.data.isSaved ? 'Disimpan ke Koleksi!' : 'Dihapus dari Koleksi.';
            
            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: pesan,
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

        } catch (err) {
            console.error(err);
            // Kalau error, kembalikan state ke semula (Rollback) - Opsional
            Swal.fire('Gagal', 'Terjadi kesalahan koneksi.', 'error');
        }
    };

const [savedBookIds, setSavedBookIds] = useState([]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?',
            text: "Sesi Anda akan berakhir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            confirmButtonColor: '#d33'
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* --- NAVBAR --- */}
            <nav className="bg-white shadow-sm sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Book className="text-indigo-600" size={28} />
                    <span className="text-xl font-bold tracking-tight text-gray-800">PerpusDigital</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <Link to="/peminjam" className="font-medium text-indigo-600">Katalog</Link>
                    <Link to="/peminjam/koleksi" className="font-medium text-gray-500 hover:text-indigo-600 transition">Koleksi Saya</Link>
                    <Link to="/peminjam/pinjaman-saya" className="font-medium text-gray-500 hover:text-indigo-600 transition">Pinjaman Saya</Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm">
                        <LogOut size={18} /> Keluar
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION (Welcome) --- */}
            <header className="bg-indigo-600 text-white py-12 px-6 mb-8 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Halo, {namaUser}! 👋</h1>
                    <p className="text-indigo-100 text-lg">Temukan buku favoritmu dan mulai membaca hari ini.</p>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-6xl mx-auto px-6 pb-12">
                
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8 sticky top-20 z-20">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Cari judul buku atau penulis..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Filter size={20} className="text-gray-400 min-w-[20px]" />
                        <button 
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Semua
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.KategoriID}
                                onClick={() => setSelectedCategory(cat.NamaKategori)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    selectedCategory === cat.NamaKategori ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat.NamaKategori}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Buku */}
                {loading ? (
                    <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                ) : filteredBooks.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Buku tidak ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map(book => (
                            <div key={book.BukuID} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
                                {/* Cover Placeholder (Bisa diganti <img> jika ada fitur upload gambar) */}
                                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                                    {book.Gambar ? (
                                        <img src={`http://localhost:5000/uploads/${book.Gambar}`} alt={book.Judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                                            <Book size={64} className="text-indigo-200" />
                                        </div>
                                    )}
                                    <button 
                                    onClick={() => handleBookmark(book.BukuID)}
                                    className={`absolute top-2 right-2 p-2 rounded-full transition-all shadow-sm z-10 ${
                                        savedBookIds.includes(book.BukuID) 
                                            ? "bg-pink-50 text-pink-500"  // Jika tersimpan: Background pink muda, Ikon Pink
                                            : "bg-white/80 text-gray-400 hover:text-pink-500 hover:bg-white" // Jika tidak: Standar
                                    }`}
                                    title={savedBookIds.includes(book.BukuID) ? "Hapus dari Koleksi" : "Simpan ke Koleksi"}
                                >
                                    {/* Logika Fill: Jika tersimpan, isi warnanya (currentColor). Jika tidak, kosongkan ('none') */}
                                    <Heart 
                                        size={18} 
                                        fill={savedBookIds.includes(book.BukuID) ? "currentColor" : "none"} 
                                    />
                                </button>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-gray-600 shadow-sm z-10">
                                        {book.NamaKategori || 'Umum'}
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 leading-tight" title={book.Judul}>
                                        {book.Judul}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <User size={14} /> {book.Penulis}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="text-xs">
                                            <span className="block text-gray-400">Stok</span>
                                            <span className={`font-bold text-lg ${book.Stok > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {book.Stok}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handlePinjam(book.BukuID, book.Judul)}
                                            disabled={book.Stok <= 0}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                                                book.Stok > 0 
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
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
        </div>
    );
};

export default DashboardSiswa;