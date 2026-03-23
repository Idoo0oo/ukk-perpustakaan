import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Users, Search, Trash2, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const DataPeminjam = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    const fetchActiveStudents = async () => {
        try {
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

    useEffect(() => { fetchActiveStudents(); }, []);

    const handleDelete = async (id, nama) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Hapus Anggota?</span>',
            text: `Anda yakin ingin menghapus "${nama}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Terhapus!</span>', timer: 1500, showConfirmButton: false });
                fetchActiveStudents();
            } catch (err) {
                Swal.fire('Gagal!', 'Gagal menghapus data anggota.', 'error');
            }
        }
    };

    const filteredStudents = students.filter(student => 
        student.NamaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Data</div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <Users size={32} /> Data Anggota
                    </h2>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Daftar peminjam yang sudah aktif dan terverifikasi.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3 text-black" size={18} />
                    <input 
                        type="text" 
                        placeholder="CARI NAMA ATAU USERNAME..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white brutal-border font-black uppercase text-xs focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#00E5FF] brutal-border-heavy brutal-shadow p-4 flex items-center gap-4">
                    <div className="bg-black p-3 brutal-border text-white">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase">Total Anggota Aktif</p>
                        <p className="text-3xl font-black">{students.length}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center font-black uppercase text-black/30">
                        {searchTerm ? 'Anggota tidak ditemukan. Coba kata kunci lain.' : 'Tidak ada data anggota.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-4 font-black uppercase text-xs">No</th>
                                    <th className="p-4 font-black uppercase text-xs">Profil Peminjam</th>
                                    <th className="p-4 font-black uppercase text-xs">Kontak</th>
                                    <th className="p-4 font-black uppercase text-xs">Alamat</th>
                                    <th className="p-4 font-black uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr key={student.UserID} className="border-b-2 border-black/10 hover:bg-[#00E5FF]/20 transition-colors">
                                        <td className="p-4 font-black text-black/40 text-sm w-16">{index + 1}</td>
                                        
                                        {/* Profil */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#AEEA00] brutal-border flex items-center justify-center font-black text-lg">
                                                    {student.NamaLengkap.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-sm">{student.NamaLengkap}</p>
                                                    <p className="text-[10px] font-bold text-black/50 uppercase">@{student.Username}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kontak */}
                                        <td className="p-4 text-xs font-bold text-black/60">
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} />
                                                {student.Email}
                                            </div>
                                        </td>

                                        {/* Alamat */}
                                        <td className="p-4 text-xs font-bold text-black/60">
                                            <div className="flex items-start gap-2 max-w-xs">
                                                <MapPin size={12} className="mt-0.5 shrink-0" />
                                                <span className="truncate">{student.Alamat || '-'}</span>
                                            </div>
                                        </td>

                                        {/* Aksi */}
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(student.UserID, student.NamaLengkap)}
                                                className="p-2 bg-white brutal-border hover:bg-[#FF4081] hover:text-white transition-colors mx-auto flex items-center justify-center"
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

export default DataPeminjam;