import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, X, Layers, Calendar, User, Book, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const KelolaBuku = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    
    // STATE BARU: kategoriIds adalah Array
    const [formData, setFormData] = useState({ 
        judul: '', penulis: '', penerbit: '', tahunTerbit: '', 
        kategoriIds: [], // Ubah jadi Array
        stok: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- FUNGSI BARU: TOGGLE KATEGORI ---
    const toggleCategory = (catId) => {
        setFormData(prev => {
            const currentIds = prev.kategoriIds;
            if (currentIds.includes(catId)) {
                // Kalau sudah ada, hapus (uncheck)
                return { ...prev, kategoriIds: currentIds.filter(id => id !== catId) };
            } else {
                // Kalau belum ada, tambah (check)
                return { ...prev, kategoriIds: [...currentIds, catId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('penulis', formData.penulis);
        data.append('penerbit', formData.penerbit);
        data.append('tahunTerbit', formData.tahunTerbit);
        data.append('stok', formData.stok);
        
        // PENTING: Kirim Array Kategori sebagai JSON String
        data.append('kategoriIds', JSON.stringify(formData.kategoriIds));

        if (imageFile) {
            data.append('gambar', imageFile);
        }

        try {
            const url = editingBook 
                ? `http://localhost:5000/api/buku/${editingBook.BukuID}` 
                : 'http://localhost:5000/api/buku';
            const method = editingBook ? 'put' : 'post';

            await axios[method](url, data, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            Swal.fire('Sukses', editingBook ? 'Data diperbarui' : 'Buku ditambahkan', 'success');
            closeModal();
            fetchBooks();
        } catch (err) { 
            Swal.fire('Error', err.response?.data?.error || 'Gagal memproses data.', 'error'); 
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Buku?', text: "Data akan dihapus permanen.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/buku/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchBooks();
                    Swal.fire('Terhapus!', 'Buku telah dihapus.', 'success');
                } catch (err) { Swal.fire('Gagal', 'Error server.', 'error'); }
            }
        });
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriIds: [], stok: '' });
        setImageFile(null);
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (book) => {
        setEditingBook(book);
        
        // Ambil detail lengkap (termasuk array kategori) dari backend
        try {
            const res = await axios.get(`http://localhost:5000/api/buku/${book.BukuID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const detail = res.data;
            
            setFormData({ 
                judul: detail.Judul, 
                penulis: detail.Penulis, 
                penerbit: detail.Penerbit, 
                tahunTerbit: detail.TahunTerbit, 
                kategoriIds: detail.KategoriIDs || [], // Array ID
                stok: detail.Stok 
            });
            
            setImageFile(null);
            setPreviewUrl(detail.Gambar ? `http://localhost:5000/uploads/${detail.Gambar}` : null);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
        }
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
                    <p className="text-gray-500 text-sm mt-1">Manajemen data buku & kategori.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" placeholder="Cari judul..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={openAddModal} className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl gap-2 shadow-md shadow-indigo-200">
                        <Plus size={18} /> Tambah Buku
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="p-5 text-center w-16">No</th>
                                <th className="p-5">Buku</th>
                                <th className="p-5">Kategori (Multi)</th>
                                <th className="p-5 text-center">Stok</th>
                                <th className="p-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBooks.map((book, index) => (
                                <tr key={book.BukuID} className="hover:bg-slate-50">
                                    <td className="p-5 text-center text-gray-400 font-medium">{index + 1}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                                {book.Gambar ? <img src={`http://localhost:5000/uploads/${book.Gambar}`} className="w-full h-full object-cover"/> : <Book size={20} className="m-auto mt-4 text-gray-300"/>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{book.Judul}</div>
                                                <div className="text-xs text-gray-500">{book.Penulis}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-wrap gap-1">
                                            {/* Tampilkan Nama Kategori (Hasil GROUP_CONCAT dari backend) */}
                                            {book.NamaKategori ? book.NamaKategori.split(', ').map((k, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded border border-indigo-100 uppercase">
                                                    {k}
                                                </span>
                                            )) : <span className="text-gray-400 text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center font-bold text-gray-600">{book.Stok}</td>
                                    <td className="p-5 text-center flex justify-center gap-2">
                                        <button onClick={() => openEditModal(book)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(book.BukuID)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h3 className="font-bold text-lg">{editingBook ? 'Edit Buku' : 'Tambah Buku'}</h3>
                                <button onClick={closeModal}><X size={24} className="text-gray-400" /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="flex justify-center mb-4">
                                    <div className="relative w-32 h-44 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer group">
                                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon className="mx-auto text-gray-400"/><span className="text-xs text-gray-500">Upload</span></div>}
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="text-sm font-medium mb-1 block">Judul</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                                </div>

                                {/* MULTI SELECT KATEGORI */}
                                <div className="form-control">
                                    <label className="text-sm font-medium mb-1 block">Pilih Kategori (Bisa Lebih dari 1)</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                                        {categories.map((cat) => {
                                            const isSelected = formData.kategoriIds.includes(cat.KategoriID);
                                            return (
                                                <div 
                                                    key={cat.KategoriID} 
                                                    onClick={() => toggleCategory(cat.KategoriID)}
                                                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors border ${
                                                        isSelected ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {isSelected ? <CheckSquare size={18} className="text-indigo-600"/> : <Square size={18} className="text-gray-400"/>}
                                                    <span className="text-sm font-medium">{cat.NamaKategori}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">*Klik untuk memilih atau membatalkan pilihan.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Penulis</label>
                                        <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.penulis} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Penerbit</label>
                                        <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.penerbit} onChange={e => setFormData({...formData, penerbit: e.target.value})} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Tahun</label>
                                        <input type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.tahunTerbit} onChange={e => setFormData({...formData, tahunTerbit: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Stok</label>
                                        <input type="number" className="w-full px-4 py-2 border rounded-lg font-bold text-center" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} required />
                                    </div>
                                </div>

                                <button type="submit" className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl mt-4">Simpan</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KelolaBuku;