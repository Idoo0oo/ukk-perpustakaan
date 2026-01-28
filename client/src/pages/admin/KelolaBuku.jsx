import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, X, Layers, Calendar, User, Book, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const KelolaBuku = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    
    // State Form (Gambar dipisah)
    const [formData, setFormData] = useState({ 
        judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriId: '', stok: '' 
    });
    const [imageFile, setImageFile] = useState(null); // State khusus file
    const [previewUrl, setPreviewUrl] = useState(null); // Untuk preview gambar

    const token = localStorage.getItem('token');

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/buku', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) { console.error("Gagal ambil buku", err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/kategori', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) { console.error("Gagal ambil kategori", err); }
    };

    useEffect(() => { fetchBooks(); fetchCategories(); }, []);

    // Handler Input File
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat preview lokal
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // PENTING: Gunakan FormData untuk upload file
        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('penulis', formData.penulis);
        data.append('penerbit', formData.penerbit);
        data.append('tahunTerbit', formData.tahunTerbit);
        data.append('kategoriId', formData.kategoriId);
        data.append('stok', formData.stok);
        if (imageFile) {
            data.append('gambar', imageFile); // 'gambar' harus sesuai dengan backend upload.single('gambar')
        }

        try {
            const url = editingBook 
                ? `http://localhost:5000/api/buku/${editingBook.BukuID}` 
                : 'http://localhost:5000/api/buku';
            const method = editingBook ? 'put' : 'post';

            // Header Content-Type otomatis diurus axios untuk FormData
            await axios[method](url, data, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: editingBook ? 'Data buku diperbarui.' : 'Buku baru ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });
            
            closeModal();
            fetchBooks();
        } catch (err) { 
            Swal.fire('Error', err.response?.data?.error || 'Gagal memproses data.', 'error'); 
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Buku?',
            text: "Data akan dihapus permanen.",
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
                    fetchBooks();
                    Swal.fire('Terhapus!', 'Buku telah dihapus.', 'success');
                } catch (err) { Swal.fire('Gagal', 'Buku sedang dipinjam atau error server.', 'error'); }
            }
        });
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriId: '', stok: '' });
        setImageFile(null);
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({ 
            judul: book.Judul, penulis: book.Penulis, penerbit: book.Penerbit, 
            tahunTerbit: book.TahunTerbit, kategoriId: book.KategoriID, stok: book.Stok 
        });
        setImageFile(null); // Reset file baru
        // Set preview ke gambar lama dari server jika ada
        setPreviewUrl(book.Gambar ? `http://localhost:5000/uploads/${book.Gambar}` : null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setImageFile(null);
        setPreviewUrl(null);
    };

    const filteredBooks = books.filter(b => 
        b.Judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="text-indigo-600" size={28} /> Kelola Pustaka
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manajemen data buku, stok, dan gambar sampul.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari judul, penulis..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all" 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={openAddModal} 
                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl gap-2 shadow-md shadow-indigo-200"
                    >
                        <Plus size={18} /> <span className="hidden md:inline">Tambah Buku</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="p-5 text-center w-16">No</th>
                                <th className="p-5">Buku</th>
                                <th className="p-5">Kategori</th>
                                <th className="p-5">Penulis & Penerbit</th>
                                <th className="p-5 text-center">Stok</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBooks.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data buku tidak ditemukan.</td></tr>
                            ) : filteredBooks.map((book, index) => (
                                <tr key={book.BukuID} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-5 text-center text-gray-400 font-medium">{index + 1}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            {/* Tampilkan Gambar Kecil di Tabel */}
                                            <div className="w-12 h-16 rounded overflow-hidden shadow-sm shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                {book.Gambar ? (
                                                    <img src={`http://localhost:5000/uploads/${book.Gambar}`} alt={book.Judul} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Book size={20} className="text-gray-300" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 line-clamp-1">{book.Judul}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={12} /> {book.TahunTerbit}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                            <Layers size={12} /> {book.NamaKategori || 'Umum'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-700 flex items-center gap-1"><User size={14} className="text-gray-400"/> {book.Penulis}</p>
                                            <p className="text-gray-500 text-xs mt-0.5 ml-5">{book.Penerbit}</p>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className={`inline-flex flex-col items-center px-3 py-1 rounded-lg border ${book.Stok < 3 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                            <span className="text-lg font-bold">{book.Stok}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openEditModal(book)} className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(book.BukuID)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur">
                                <h3 className="font-bold text-lg text-gray-800">{editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Upload Gambar */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative w-32 h-44 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors group cursor-pointer">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
                                                <span className="text-xs text-gray-500 font-medium">Upload Cover</span>
                                                <span className="text-[10px] text-gray-400 block mt-1">(Opsional)</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        {previewUrl && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold">Ganti Foto</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="form-control">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Laskar Pelangi" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.kategoriId} onChange={(e) => setFormData({...formData, kategoriId: e.target.value})} required>
                                            <option value="">Pilih Kategori</option>
                                            {categories.map((cat) => (<option key={cat.KategoriID} value={cat.KategoriID}>{cat.NamaKategori}</option>))}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
                                        <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.tahunTerbit} onChange={(e) => setFormData({...formData, tahunTerbit: e.target.value})} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.penulis} onChange={(e) => setFormData({...formData, penulis: e.target.value})} required />
                                    </div>
                                    <div className="form-control">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.penerbit} onChange={(e) => setFormData({...formData, penerbit: e.target.value})} required />
                                    </div>
                                </div>

                                <div className="form-control pt-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stok Buku</label>
                                    <div className="flex items-center gap-3">
                                        <input type="number" className="w-24 px-4 py-2 rounded-lg border-2 border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-center" value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} required />
                                        <span className="text-sm text-gray-400">Unit tersedia</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl h-12 text-base shadow-lg shadow-indigo-200 transition-all">
                                        {editingBook ? 'Simpan Perubahan' : 'Tambah Buku ke Koleksi'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KelolaBuku;