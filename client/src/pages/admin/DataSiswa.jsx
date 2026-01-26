import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trash2, Search, UserCheck, MapPin, Mail } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DataSiswa = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            // Mengambil data user (API ini sudah kita buat sebelumnya di backend)
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Gagal mengambil data siswa", err);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Anggota?',
            text: "Siswa ini tidak akan bisa login lagi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/users/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire('Berhasil!', 'Akun siswa telah dihapus.', 'success');
                    fetchUsers();
                } catch (err) {
                    Swal.fire('Gagal', 'Tidak bisa menghapus user ini.', 'error');
                }
            }
        });
    };

    const filteredUsers = users.filter(u => 
        u.NamaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-primary" /> Data Anggota Perpustakaan
                </h2>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau username..." 
                        className="input input-bordered w-full pl-10 h-10 text-sm bg-white"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card bg-white shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-center">No</th>
                                <th>Informasi Siswa</th>
                                <th>Username</th>
                                <th>Alamat</th>
                                <th className="text-center">Role</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredUsers.map((user, index) => (
                                <tr key={user.UserID} className="border-b border-gray-100 transition-all odd:bg-white even:bg-slate-800 even:text-white group">
                                    <td className="text-center opacity-50">{index + 1}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold flex items-center gap-1">
                                                <UserCheck size={14} className="text-primary group-even:text-blue-300" /> 
                                                {user.NamaLengkap}
                                            </span>
                                            <span className="text-xs opacity-60 flex items-center gap-1">
                                                <Mail size={12} /> {user.Email}
                                            </span>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-ghost group-even:bg-slate-700 group-even:text-white border-none">{user.Username}</span></td>
                                    <td className="max-w-xs truncate">
                                        <div className="flex items-center gap-1 opacity-80 italic">
                                            <MapPin size={14} /> {user.Alamat}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge badge-sm font-bold uppercase ${user.Role === 'admin' ? 'badge-error' : 'badge-success text-white'}`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => handleDelete(user.UserID)} className="btn btn-ghost btn-xs text-error hover:bg-error/10 hover:scale-110">
                                            <Trash2 size={18} />
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

export default DataSiswa;