import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Users, Search, Trash2, MapPin, Mail, ShieldCheck } from 'lucide-react';

const DataSiswa = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Fitur pencarian
    const token = localStorage.getItem('token');

    // Ambil data user yang statusnya HANYA 'Aktif'
    const fetchActiveStudents = async () => {
        try {
            // Filter ?status=Aktif ditambahkan di sini
            const res = await axios.get('http://localhost:5000/api/users?status=Aktif', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveStudents();
    }, []);

    // Fitur Hapus Anggota (CRUD - Delete)
    const handleDelete = async (id, nama) => {
        const result = await Swal.fire({
            title: 'Hapus Anggota?',
            text: `Anda yakin ingin menghapus "${nama}"? Data peminjaman terkait mungkin akan ikut terhapus atau error.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Terhapus!', 'Data anggota berhasil dihapus.', 'success');
                fetchActiveStudents();
            } catch (err) {
                Swal.fire('Gagal!', 'Gagal menghapus data anggota.', 'error');
            }
        }
    };

    // Filter Pencarian di sisi Client
    const filteredStudents = students.filter(student => 
        student.NamaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen">
            {/* --- Header & Search --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-indigo-600" /> Data Anggota Perpustakaan
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Daftar siswa yang sudah aktif dan terverifikasi.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search size={18} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Cari nama atau username..." 
                        className="input input-bordered w-full pl-10 bg-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Stats Card Kecil --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Total Anggota Aktif</p>
                        <p className="text-xl font-bold text-gray-800">{students.length}</p>
                    </div>
                </div>
            </div>

            {/* --- Table Content --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-2 text-gray-400">Memuat data anggota...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <p>Tidak ada data anggota yang ditemukan.</p>
                        {searchTerm && <p className="text-sm">Coba kata kunci pencarian lain.</p>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-5 font-semibold">No</th>
                                    <th className="p-5 font-semibold">Profil Siswa</th>
                                    <th className="p-5 font-semibold">Kontak</th>
                                    <th className="p-5 font-semibold">Alamat</th>
                                    <th className="p-5 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.UserID} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5 text-gray-400 font-medium w-16">{index + 1}</td>
                                        
                                        {/* Profil */}
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                        {student.NamaLengkap.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{student.NamaLengkap}</p>
                                                    <p className="text-xs text-gray-500">@{student.Username}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kontak */}
                                        <td className="p-5 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-gray-400" />
                                                {student.Email}
                                            </div>
                                        </td>

                                        {/* Alamat */}
                                        <td className="p-5 text-sm text-gray-600">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <MapPin size={14} className="text-gray-400 mt-1 min-w-[14px]" />
                                                <span className="truncate">{student.Alamat || '-'}</span>
                                            </div>
                                        </td>

                                        {/* Aksi */}
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDelete(student.UserID, student.NamaLengkap)}
                                                className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50"
                                                title="Hapus Anggota"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataSiswa;