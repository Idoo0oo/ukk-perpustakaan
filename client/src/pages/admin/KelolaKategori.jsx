import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TableSkeleton } from '../../components/Skeleton';

const KelolaKategori = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/kategori', { headers: { Authorization: `Bearer ${token}` } });
            setCategories(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/kategori', { namaKategori: newCategory }, { headers: { Authorization: `Bearer ${token}` } });
            setNewCategory('');
            fetchCategories();
            Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Berhasil!</span>', text: 'Kategori baru ditambahkan.', timer: 1500, showConfirmButton: false });
        } catch (err) { Swal.fire('Error', 'Gagal menambah kategori', 'error'); }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '<span class="font-black uppercase">Hapus Kategori?</span>',
            text: "Kategori tidak bisa dihapus jika masih ada buku di dalamnya.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/kategori/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    fetchCategories();
                    Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Terhapus!</span>', timer: 1500, showConfirmButton: false });
                } catch (err) { Swal.fire('Gagal', 'Kategori sedang digunakan oleh buku.', 'error'); }
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Manajemen</div>
                <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                    <Layers size={32} /> Kelola Kategori
                </h2>
                <p className="font-bold uppercase text-black/50 text-xs mt-2">Atur pengelompokan buku (Novel, Komik, Pelajaran, dll).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Form Card */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="bg-[#FFD600] brutal-border-heavy brutal-shadow p-6 md:sticky md:top-24"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-black">
                        <div className="bg-black text-white p-2">
                            <Plus size={20} />
                        </div>
                        <h3 className="font-black uppercase text-lg">Tambah Baru</h3>
                    </div>
                    
                    <form onSubmit={handleAdd} className="space-y-4 font-mono">
                        <div>
                            <label className="block text-[10px] font-black uppercase mb-2">Nama Kategori</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 text-black" size={16} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-white brutal-border font-black uppercase text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30" 
                                    placeholder="MISAL: FIKSI ILMIAH"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button className="w-full bg-black text-white py-3 font-black uppercase brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                            Simpan Kategori <ArrowRight size={16} />
                        </button>
                    </form>
                </motion.div>

                {/* Table Card */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="md:col-span-2 bg-white brutal-border-heavy brutal-shadow overflow-hidden"
                >
                    {loading ? (
                        <TableSkeleton rows={5} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="p-4 font-black uppercase text-xs text-center w-16">No</th>
                                        <th className="p-4 font-black uppercase text-xs">Nama Kategori</th>
                                        <th className="p-4 font-black uppercase text-xs text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="p-12 text-center font-black uppercase text-black/30">Belum ada kategori.</td>
                                        </tr>
                                    ) : categories.map((cat, index) => (
                                        <tr key={cat.KategoriID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/20 transition-colors">
                                            <td className="p-4 text-center font-black text-black/40 text-sm">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-8 bg-black"></div>
                                                    <span className="font-black uppercase text-lg">{cat.NamaKategori}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => handleDelete(cat.KategoriID)} 
                                                    className="p-2 bg-white brutal-border hover:bg-[#FF4081] hover:text-white transition-colors mx-auto flex items-center justify-center"
                                                    title="Hapus Kategori"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default KelolaKategori;