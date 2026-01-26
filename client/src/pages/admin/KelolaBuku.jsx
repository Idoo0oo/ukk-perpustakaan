import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const KelolaBuku = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ judul: '', penulis: '', penerbit: '', tahunTerbit: '' });

    const token = localStorage.getItem('token');

    // --- Fetch Data Buku ---
    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/buku', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) {
            console.error("Gagal mengambil data buku", err);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    // --- Handler Tambah/Edit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await axios.put(`http://localhost:5000/api/buku/${editingBook.BukuID}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil!', 'Data buku diperbarui.', 'success');
            } else {
                await axios.post('http://localhost:5000/api/buku', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil!', 'Buku baru ditambahkan.', 'success');
            }
            setIsModalOpen(false);
            setEditingBook(null);
            setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '' });
            fetchBooks();
        } catch (err) {
            Swal.fire('Error', 'Gagal memproses data.', 'error');
        }
    };

    // --- Handler Hapus ---
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Buku?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/buku/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire('Terhapus!', 'Buku telah dihapus.', 'success');
                    fetchBooks();
                } catch (err) {
                    Swal.fire('Gagal', 'Buku tidak bisa dihapus (mungkin sedang dipinjam).', 'error');
                }
            }
        });
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({ 
            judul: book.Judul, 
            penulis: book.Penulis, 
            penerbit: book.Penerbit, 
            tahunTerbit: book.TahunTerbit 
        });
        setIsModalOpen(true);
    };

    const filteredBooks = books.filter(b => 
        b.Judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen className="text-primary" /> Kelola Koleksi Buku
                </h2>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari judul atau penulis..." 
                            className="input input-bordered w-full pl-10 h-10 text-sm bg-white"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => { setEditingBook(null); setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '' }); setIsModalOpen(true); }}
                        className="btn btn-primary btn-sm h-10 shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} /> Tambah Buku
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card bg-white shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="w-12">No</th>
                                <th>Judul Buku</th>
                                <th>Penulis</th>
                                <th>Penerbit</th>
                                <th>Tahun</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredBooks.map((book, index) => (
                                <tr 
                                    key={book.BukuID} 
                                    className={`
                                        transition-all duration-200 border-b border-gray-100
                                        /* Baris Ganjil (Putih) */
                                        odd:bg-white odd:text-gray-800 
                                        /* Baris Genap (Gelap) - Otomatis ganti warna teks ke putih */
                                        even:bg-slate-800 even:text-white
                                        /* Efek Hover */
                                        hover:bg-primary/10 hover:text-gray-900
                                    `}
                                >
                                    <td className="text-center font-medium opacity-70">{index + 1}</td>
                                    <td className="font-bold">
                                        {/* Gunakan warna primer di baris putih, dan warna cerah di baris gelap */}
                                        <span className="group-odd:text-primary group-even:text-blue-300">
                                            {book.Judul}
                                        </span>
                                    </td>
                                    <td>{book.Penulis}</td>
                                    <td>{book.Penerbit}</td>
                                    <td className="text-center">
                                        <span className="badge badge-sm font-mono border-none bg-gray-400/20 text-current">
                                            {book.TahunTerbit}
                                        </span>
                                    </td>
                                    <td className="flex justify-center gap-2">
                                        {/* Ikon Edit */}
                                        <button 
                                            onClick={() => openEditModal(book)} 
                                            className="btn btn-ghost btn-xs text-info hover:scale-125 transition-transform"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {/* Ikon Hapus */}
                                        <button 
                                            onClick={() => handleDelete(book.BukuID)} 
                                            className="btn btn-ghost btn-xs text-error hover:scale-125 transition-transform"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal modal-open">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-box bg-white border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                                <div className="form-control">
                                    <label className="label mb-1.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Judul Buku</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Laskar Pelangi"
                                        className="input input-bordered w-full bg-gray-50 focus:input-primary text-gray-900 px-4" 
                                        value={formData.judul} 
                                        onChange={(e) => setFormData({...formData, judul: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="form-control">
                                        <label className="label mb-1.5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Penulis</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Nama Penulis"
                                            className="input input-bordered w-full bg-gray-50 focus:input-primary text-gray-900 px-4" 
                                            value={formData.penulis} 
                                            onChange={(e) => setFormData({...formData, penulis: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label mb-1.5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Penerbit</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Nama Penerbit"
                                            className="input input-bordered w-full bg-gray-50 focus:input-primary text-gray-900 px-4" 
                                            value={formData.penerbit} 
                                            onChange={(e) => setFormData({...formData, penerbit: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label mb-1.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tahun Terbit</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="Contoh: 2024"
                                        className="input input-bordered w-full bg-gray-50 focus:input-primary text-gray-900 px-4" 
                                        value={formData.tahunTerbit} 
                                        onChange={(e) => setFormData({...formData, tahunTerbit: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="modal-action mt-8">
                                    <button type="submit" className="btn btn-primary w-full shadow-lg shadow-primary/30 text-white font-bold transition-all hover:scale-[1.01]">
                                        {editingBook ? 'Simpan Perubahan' : 'Simpan Buku'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default KelolaBuku;