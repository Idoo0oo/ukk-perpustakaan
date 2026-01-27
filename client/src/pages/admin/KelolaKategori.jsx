import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';
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
            Swal.fire('Berhasil!', 'Kategori ditambahkan', 'success');
        } catch (err) { Swal.fire('Error', 'Gagal menambah kategori', 'error'); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/kategori/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (err) { Swal.fire('Gagal', 'Kategori mungkin sedang digunakan oleh buku', 'error'); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <Layers className="text-primary" /> Kelola Kategori Buku
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Tambah */}
                <div className="card bg-white p-6 shadow-lg border border-gray-100 h-fit">
                    <h3 className="font-bold mb-4">Tambah Kategori</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <input 
                            type="text" 
                            className="input input-bordered w-full bg-gray-50 text-gray-900" 
                            placeholder="Nama Kategori..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            required
                        />
                        <button className="btn btn-primary w-full text-white">Simpan Kategori</button>
                    </form>
                </div>

                {/* Daftar Tabel */}
                <div className="md:col-span-2 card bg-white shadow-lg border border-gray-100 overflow-hidden">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="w-16 text-center">No</th>
                                <th>Nama Kategori</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr key={cat.KategoriID} className="border-b odd:bg-white even:bg-slate-800 even:text-white">
                                    <td className="text-center opacity-50">{index + 1}</td>
                                    <td className="font-semibold">{cat.NamaKategori}</td>
                                    <td className="text-center">
                                        <button onClick={() => handleDelete(cat.KategoriID)} className="btn btn-ghost btn-xs text-error">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default KelolaKategori;