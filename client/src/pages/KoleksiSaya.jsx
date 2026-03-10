// File: client/src/pages/KoleksiSaya.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Book, Trash2, BookOpen, LogOut, ArrowLeft, LayoutGrid, Heart } from 'lucide-react';

const KoleksiSaya = () => {
    const [books, setBooks] = useState([]);
    const token = localStorage.getItem('token');
    const namaUser = localStorage.getItem('namaUser') || 'Siswa';
    const navigate = useNavigate();
    const location = useLocation();

    const fetchKoleksi = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fitur/koleksi', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchKoleksi(); }, []);

    const handleRemove = async (bukuID) => {
        try {
            await axios.post('http://localhost:5000/api/fitur/koleksi', { bukuID }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchKoleksi(); // Refresh otomatis setelah dihapus
            Swal.fire({
                icon: 'success',
                title: 'Dihapus',
                text: 'Buku dihapus dari koleksi.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?', text: "Sesi Anda akan berakhir.", icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Ya, Keluar', confirmButtonColor: '#d33'
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
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-gray-900 relative overflow-hidden">
            
            {/* --- HEADER ATAS --- */}
            <header className="h-20 bg-white/60 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm z-30 sticky top-0">
                <div className="flex items-center gap- 0">
                    <div className="flex items-center justify-center bg-transparent drop-shadow-md w-14 h-14">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-150 drop-shadow-[0_4px_12px_rgba(124,58,237,0.3)]" />
                            </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                        Sastra<span className="text-violet-600 italic">.in</span>
                    </span>
                    
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

            {/* --- KONTEN UTAMA --- */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-8 pb-32 overflow-y-auto overflow-x-hidden">
                <div className="mb-8">
                    <Link to="/peminjam" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm mb-2 w-max"><ArrowLeft size={16} /> Kembali ke Katalog</Link>
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
                        <Heart className="text-pink-500" fill="currentColor" size={28} /> Koleksi Pribadi
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Daftar buku favorit yang kamu simpan.</p>
                </div>

                {books.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Belum ada buku yang disimpan.</p>
                        <Link to="/peminjam" className="text-indigo-600 hover:underline font-medium mt-2 inline-block">Cari buku dulu yuk!</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map(book => (
                            <div key={book.KoleksiID} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative group hover:shadow-md transition-all">
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                    {book.Gambar ? (
                                        <img src={`http://localhost:5000/uploads/${book.Gambar}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={book.Judul} />
                                    ) : (
                                        <Book size={48} className="text-gray-300" />
                                    )}
                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={() => handleRemove(book.BukuID)}
                                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors z-10"
                                        title="Hapus dari Koleksi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 w-max px-2 py-0.5 rounded mb-2 inline-block">{book.NamaKategori || 'Umum'}</span>
                                    <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight mb-1" title={book.Judul}>{book.Judul}</h3>
                                    <p className="text-sm text-gray-500 mt-auto">{book.Penulis}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- FLOATING NAVBAR BAWAH --- */}
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
                                <span className="shrink-0 flex items-center justify-center">
                                    {item.icon}
                                </span>
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

                    <div className="w-[2px] h-8 bg-gray-300/50 mx-1 rounded-full shrink-0"></div>

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

export default KoleksiSaya; 