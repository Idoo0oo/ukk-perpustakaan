import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, X, Book, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TableSkeleton } from '../../components/Skeleton';

const KelolaBuku = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ 
        judul: '', penulis: '', penerbit: '', tahunTerbit: '', 
        kategoriIds: [],
        stok: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 10;
    const token = localStorage.getItem('token');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/buku?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
            setBooks(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) { console.error("Gagal ambil buku", err); } finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/kategori', { headers: { Authorization: `Bearer ${token}` } });
            setCategories(res.data);
        } catch (err) { console.error("Gagal ambil kategori", err); }
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchBooks(); }, [page]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
    };

    const toggleCategory = (catId) => {
        setFormData(prev => {
            const currentIds = prev.kategoriIds;
            if (currentIds.includes(catId)) return { ...prev, kategoriIds: currentIds.filter(id => id !== catId) };
            else return { ...prev, kategoriIds: [...currentIds, catId] };
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
        data.append('kategoriIds', JSON.stringify(formData.kategoriIds));
        if (imageFile) data.append('gambar', imageFile);

        try {
            const url = editingBook ? `http://localhost:5000/api/buku/${editingBook.BukuID}` : 'http://localhost:5000/api/buku';
            const method = editingBook ? 'put' : 'post';
            await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Berhasil!</span>', timer: 1500, showConfirmButton: false });
            closeModal();
            fetchBooks();
        } catch (err) { 
            if (err.response?.status === 400 && err.response?.data?.errors) {
                const errorMsg = err.response.data.errors.map(e => `• ${e.message}`).join('<br/>');
                Swal.fire({
                    icon: 'error',
                    title: '<span class="font-black uppercase text-sm">Validasi Gagal</span>',
                    html: `<div class="text-left font-bold text-xs font-mono mt-2">${errorMsg}</div>`,
                    customClass: { popup: 'brutal-border-heavy brutal-shadow' }
                });
            } else {
                Swal.fire('Error', err.response?.data?.error || err.response?.data?.message?.error || 'Gagal memproses data.', 'error'); 
            }
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '<span class="font-black uppercase">Hapus Buku?</span>',
            text: "Data akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/buku/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    fetchBooks();
                    Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Terhapus!</span>', timer: 1500, showConfirmButton: false });
                } catch (err) { Swal.fire('Gagal', 'Error server.', 'error'); }
            }
        });
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({ judul: '', penulis: '', penerbit: '', tahunTerbit: '', kategoriIds: [], stok: '' });
        setImageFile(null); setPreviewUrl(null);
        setIsModalOpen(true);
        window.dispatchEvent(new CustomEvent('admin:modal:open'));
    };

    const openEditModal = async (book) => {
        setEditingBook(book);
        try {
            const res = await axios.get(`http://localhost:5000/api/buku/${book.BukuID}`, { headers: { Authorization: `Bearer ${token}` } });
            const detail = res.data;
            setFormData({ judul: detail.Judul, penulis: detail.Penulis, penerbit: detail.Penerbit, tahunTerbit: detail.TahunTerbit, kategoriIds: detail.KategoriIDs || [], stok: detail.Stok });
            setImageFile(null);
            setPreviewUrl(detail.Gambar ? `http://localhost:5000/uploads/${detail.Gambar}` : null);
            setIsModalOpen(true);
            window.dispatchEvent(new CustomEvent('admin:modal:open'));
        } catch (err) { console.error(err); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setImageFile(null);
        setPreviewUrl(null);
        window.dispatchEvent(new CustomEvent('admin:modal:close'));
    };

    const filteredBooks = books.filter(b => 
        b.Judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.Penulis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">CRUD</div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <BookOpen size={32} /> Kelola Pustaka
                    </h2>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Manajemen data buku & kategori.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-3 text-black" size={18} />
                        <input type="text" placeholder="CARI JUDUL..." className="w-full pl-10 pr-4 py-2.5 bg-white brutal-border font-black uppercase text-xs focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-2.5 bg-[#AEEA00] brutal-border brutal-shadow font-black uppercase text-xs whitespace-nowrap">
                        <Plus size={18} /> Tambah Buku
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-4 font-black uppercase text-xs text-center w-16">No</th>
                                    <th className="p-4 font-black uppercase text-xs">Buku</th>
                                    <th className="p-4 font-black uppercase text-xs">Kategori</th>
                                    <th className="p-4 font-black uppercase text-xs text-center">Stok</th>
                                    <th className="p-4 font-black uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book, index) => (
                                    <tr key={book.BukuID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/20 transition-colors">
                                        <td className="p-4 text-center font-black text-black/40 text-sm">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 bg-[#FFFBEB] brutal-border overflow-hidden shrink-0">
                                                    {book.Gambar ? <img src={`http://localhost:5000/uploads/${book.Gambar}`} className="w-full h-full object-cover" /> : <Book size={20} className="m-auto mt-4 text-black/20" />}
                                                </div>
                                                <div>
                                                    <div className="font-black uppercase text-sm">{book.Judul}</div>
                                                    <div className="text-[10px] font-bold text-black/50 uppercase">{book.Penulis}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {book.NamaKategori ? book.NamaKategori.split(', ').map((k, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-[#00E5FF] brutal-border text-[10px] font-black uppercase">{k}</span>
                                                )) : <span className="text-black/30 text-xs font-bold">-</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center font-black text-xl">{book.Stok}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(book)} className="p-2 bg-white brutal-border hover:bg-[#00E5FF] transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(book.BukuID)} className="p-2 bg-white brutal-border hover:bg-[#FF4081] hover:text-white transition-colors" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBooks.length === 0 && (
                                    <tr><td colSpan="5" className="p-12 text-center font-black uppercase text-black/30">Belum ada data buku.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 bg-white brutal-border border-black text-xs font-black uppercase hover:bg-[#FFD600] disabled:opacity-50 transition-colors">Sebelumnya</button>
                    <span className="text-xs font-black uppercase px-6 py-2.5 bg-black text-white brutal-border border-black">Halaman {page} dari {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-5 py-2.5 bg-white brutal-border border-black text-xs font-black uppercase hover:bg-[#AEEA00] disabled:opacity-50 transition-colors">Selanjutnya</button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-32 pb-6 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={closeModal} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white brutal-border-heavy brutal-shadow-lg w-full max-w-lg max-h-full overflow-y-auto">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b-4 border-black flex justify-between items-center sticky top-0 bg-[#FFD600] z-10">
                                <h3 className="font-black uppercase text-lg">{editingBook ? 'Edit Buku' : 'Tambah Buku'}</h3>
                                <button onClick={closeModal} className="bg-black text-white p-1 hover:bg-[#FF4081] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono">
                                {/* Image Upload */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative w-32 h-44 bg-[#FFFBEB] brutal-border flex items-center justify-center overflow-hidden cursor-pointer group hover:bg-[#AEEA00] transition-colors">
                                        {previewUrl 
                                            ? <img src={previewUrl} className="w-full h-full object-cover" />
                                            : <div className="text-center"><ImageIcon className="mx-auto text-black/40" /><span className="text-xs font-black uppercase">Upload</span></div>
                                        }
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase block mb-1">Judul</label>
                                    <input type="text" className="w-full px-4 py-2 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} required />
                                </div>

                                {/* Multi Kategori */}
                                <div>
                                    <label className="text-[10px] font-black uppercase block mb-2">Kategori (Bisa Lebih dari 1)</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto brutal-border p-3 bg-[#FFFBEB]">
                                        {categories.map((cat) => {
                                            const isSelected = formData.kategoriIds.includes(cat.KategoriID);
                                            return (
                                                <div 
                                                    key={cat.KategoriID} 
                                                    onClick={() => toggleCategory(cat.KategoriID)}
                                                    className={`flex items-center gap-2 p-2 cursor-pointer transition-colors brutal-border ${
                                                        isSelected ? 'bg-[#AEEA00]' : 'bg-white hover:bg-[#FFD600]'
                                                    }`}
                                                >
                                                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-black/40" />}
                                                    <span className="text-xs font-black uppercase">{cat.NamaKategori}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[10px] font-bold uppercase text-black/40 mt-1">*Klik untuk memilih / membatalkan.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase block mb-1">Penulis</label>
                                        <input type="text" className="w-full px-4 py-2 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors" value={formData.penulis} onChange={e => setFormData({...formData, penulis: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase block mb-1">Penerbit</label>
                                        <input type="text" className="w-full px-4 py-2 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors" value={formData.penerbit} onChange={e => setFormData({...formData, penerbit: e.target.value})} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase block mb-1">Tahun</label>
                                        <input type="number" className="w-full px-4 py-2 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors" value={formData.tahunTerbit} onChange={e => setFormData({...formData, tahunTerbit: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase block mb-1">Stok</label>
                                        <input type="number" className="w-full px-4 py-2 brutal-border font-black text-sm text-center focus:outline-none focus:bg-[#AEEA00] transition-colors" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} required />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-black text-white py-3 font-black uppercase brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4">
                                    Simpan Data
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default KelolaBuku;