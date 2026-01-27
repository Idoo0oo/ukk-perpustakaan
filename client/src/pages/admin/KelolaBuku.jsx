import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, X, Layers } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const KelolaBuku = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ 
        judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriId: '', stok: '' 
    });

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

    // --- Fetch Data Kategori ---
    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/kategori', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Gagal mengambil kategori", err);
        }
    };

    useEffect(() => { 
        fetchBooks(); 
        fetchCategories();
    }, []);

    // --- Handler Tambah/Edit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await axios.put(`http://localhost:5000/api/buku/${editingBook.BukuID}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil!', 'Data dan Stok diperbarui.', 'success');
            } else {
                await axios.post('http://localhost:5000/api/buku', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil!', 'Buku baru ditambahkan.', 'success');
            }
            setIsModalOpen(false);
            setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriId: '', stok: '' });
            fetchBooks();
        } catch (err) { Swal.fire('Error', 'Gagal memproses data.', 'error'); }
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
            judul: book.Judul, penulis: book.Penulis, penerbit: book.Penerbit, 
            tahunTerbit: book.TahunTerbit, kategoriId: book.KategoriID, stok: book.Stok 
        });
        setIsModalOpen(true);
    };

    const filteredBooks = books.filter(b => 
        b.Judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                            className="input input-bordered w-full pl-10 h-10 text-sm bg-white text-gray-900" 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                   <button onClick={() => { setEditingBook(null); setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriId: '', stok: '' }); setIsModalOpen(true); }} className="btn btn-primary btn-sm h-10">
                    <Plus size={18} /> Tambah Buku
                </button>
                </div>
            </div>

            {/* Table */}
            <div className="card bg-white shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="w-12 text-center">No</th>
                                <th>Judul Buku</th>
                                <th>Kategori</th>
                                <th className="text-center">Sisa Stok</th>
                                <th>Penulis</th>
                                <th>Penerbit</th>
                                <th className="text-center">Tahun</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredBooks.map((book, index) => (
                                <tr 
                                    key={book.BukuID} 
                                    className="transition-all duration-200 border-b border-gray-100 odd:bg-white odd:text-gray-800 even:bg-slate-800 even:text-white hover:bg-primary/10 hover:text-gray-900 group"
                                >
                                    <td className="text-center font-medium opacity-70">{index + 1}</td>
                                    <td className="font-bold">
                                        <span className="group-odd:text-primary group-even:text-blue-300">
                                            {book.Judul}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1 opacity-80">
                                            <Layers size={14} />
                                            {book.NamaKategori || <span className="text-xs italic opacity-50">Tanpa Kategori</span>}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                    <div className={`badge font-bold p-3 border-none ${book.Stok < 3 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {book.Stok}
                                    </div>
                                    </td>
                                    <td>{book.Penulis}</td>
                                    <td>{book.Penerbit}</td>
                                    <td className="text-center">
                                        <span className="badge badge-sm font-mono border-none bg-gray-400/20 text-current">
                                            {book.TahunTerbit}
                                        </span>
                                    </td>
                                    <td className="flex justify-center gap-2">
                                        {/* Tombol Edit */}
                                        <button 
                                            onClick={() => openEditModal(book)} 
                                            className="btn btn-ghost btn-xs text-info hover:bg-info/10"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        {/* Tombol Delete */}
                                        <button 
                                            onClick={() => handleDelete(book.BukuID)} 
                                            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
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
                            className="modal-box bg-white border border-gray-100 max-w-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">
                                {/* Judul Buku */}
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

                                {/* Dropdown Kategori */}
                                <div className="form-control">
                                    <label className="label mb-1.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Kategori Buku</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full bg-gray-50 focus:select-primary text-gray-900 px-4 font-normal"
                                        value={formData.kategoriId}
                                        onChange={(e) => setFormData({...formData, kategoriId: e.target.value})}
                                        required
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.KategoriID} value={cat.KategoriID}>
                                                {cat.NamaKategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Penulis */}
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
                                    {/* Penerbit */}
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Tahun Terbit */}
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
                                    {/* INPUT STOK BARU */}
                                    <div className="form-control">
                                        <label className="label mb-1.5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Jumlah Stok</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            placeholder="0"
                                            className="input input-bordered w-full bg-indigo-50/30 border-indigo-100 focus:input-primary text-gray-900 px-4 font-bold" 
                                            value={formData.stok} 
                                            onChange={(e) => setFormData({...formData, stok: e.target.value})} 
                                            required 
                                        />
                                    </div>
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