import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Trash2, BookOpen, LogOut, ArrowLeft } from 'lucide-react';

const KoleksiSaya = () => {
    const [books, setBooks] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                {/* LOGO BRANDING */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-violet-500/20">
                        <BookOpen size={24} fill="currentColor" className="opacity-90" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                        Perpus<span className="text-violet-600">Digital</span>.
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/peminjam" className="font-medium text-slate-500 hover:text-violet-600 transition">Katalog</Link>
                    <Link to="/peminjam/koleksi" className="font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg">Koleksi Saya</Link>
                    <Link to="/peminjam/pinjaman-saya" className="font-medium text-slate-500 hover:text-violet-600 transition">Pinjaman Saya</Link>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm">
                        <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link to="/peminjam" className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm mb-2"><ArrowLeft size={16} /> Kembali ke Katalog</Link>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="text-pink-500" /> Koleksi Pribadi
                    </h2>
                    <p className="text-gray-500 text-sm">Daftar buku favorit yang kamu simpan.</p>
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
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {book.Gambar ? (
                                        <img src={`http://localhost:5000/uploads/${book.Gambar}`} className="w-full h-full object-cover" alt={book.Judul} />
                                    ) : (
                                        <Book size={48} className="text-gray-300" />
                                    )}
                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={() => handleRemove(book.BukuID)}
                                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                                        title="Hapus dari Koleksi"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-2 inline-block">{book.NamaKategori || 'Umum'}</span>
                                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-1" title={book.Judul}>{book.Judul}</h3>
                                    <p className="text-sm text-gray-500">{book.Penulis}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KoleksiSaya;