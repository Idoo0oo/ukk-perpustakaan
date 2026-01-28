import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const KelolaKategori = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const token = localStorage.getItem('token');

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/kategori', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/kategori', { namaKategori: newCategory }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewCategory('');
            fetchCategories();
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Kategori baru ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) { Swal.fire('Error', 'Gagal menambah kategori', 'error'); }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Hapus Kategori?',
            text: "Kategori tidak bisa dihapus jika masih ada buku di dalamnya.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Hapus'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/kategori/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchCategories();
                    Swal.fire('Terhapus!', 'Kategori telah dihapus.', 'success');
                } catch (err) { Swal.fire('Gagal', 'Kategori sedang digunakan oleh buku.', 'error'); }
            }
        });
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="text-indigo-600" size={28} /> Kelola Kategori
                </h2>
                <p className="text-gray-500 text-sm mt-1">Atur pengelompokan buku (Novel, Komik, Pelajaran, dll).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Form Card (Sebelah Kiri) */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="card bg-white p-6 shadow-sm border border-gray-100 rounded-2xl md:sticky md:top-24"
                >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Plus size={20} />
                        </div>
                        <h3 className="font-bold text-gray-800">Tambah Baru</h3>
                    </div>
                    
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Kategori</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                                    placeholder="Misal: Fiksi Ilmiah"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl h-11 shadow-md shadow-indigo-200">
                            Simpan Kategori <ArrowRight size={16} />
                        </button>
                    </form>
                </motion.div>

                {/* Table Card (Sebelah Kanan) */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-center w-16">No</th>
                                    <th className="p-5">Nama Kategori</th>
                                    <th className="p-5 text-center w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-gray-400">Belum ada kategori.</td>
                                    </tr>
                                ) : categories.map((cat, index) => (
                                    <tr key={cat.KategoriID} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 text-center text-gray-400 font-medium">{index + 1}</td>
                                        <td className="p-5">
                                            <span className="font-bold text-gray-700 text-lg">{cat.NamaKategori}</span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDelete(cat.KategoriID)} 
                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors mx-auto"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default KelolaKategori;