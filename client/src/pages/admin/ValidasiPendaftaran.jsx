import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, UserCheck, UserX, Clock } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const ValidasiPendaftaran = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users?status=Menunggu', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchPendingUsers(); }, []);

    const handleVerify = async (id, nama) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Aktifkan Peminjam?</span>',
            text: `Apakah Anda yakin ingin mengaktifkan akun "${nama}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Aktifkan!',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Memproses...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                await axios.put(`http://localhost:5000/api/users/${id}/verify`, {}, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Berhasil!</span>', text: `Akun ${nama} kini sudah aktif.`, timer: 2000, showConfirmButton: false });
                fetchPendingUsers();
            } catch (err) {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat mengaktifkan akun.', 'error');
            }
        }
    };

    const handleReject = async (id, nama) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Tolak Pendaftaran?</span>',
            text: `Akun "${nama}" akan dihapus permanen!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tolak & Hapus',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });
                await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Ditolak!</span>', timer: 2000, showConfirmButton: false });
                fetchPendingUsers();
            } catch (err) {
                Swal.fire('Gagal!', 'Gagal menghapus data.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-[#FFD600] brutal-border-heavy brutal-shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-3 brutal-border">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <div className="inline-block bg-black text-white px-2 py-0.5 font-black text-[10px] uppercase tracking-widest mb-1">Verifikasi</div>
                        <h2 className="text-3xl font-black uppercase leading-none tracking-tighter">Validasi Pendaftaran</h2>
                        <p className="font-bold uppercase text-black/60 text-xs mt-1">Kelola peminjam baru yang menunggu persetujuan akses.</p>
                    </div>
                </div>
                <div className="bg-black text-white px-4 py-2 brutal-border flex items-center gap-2 font-black uppercase text-sm shrink-0">
                    <Clock size={16} />
                    Menunggu: {users.length} Peminjam
                </div>
            </div>

            {/* Table */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : users.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center gap-4">
                        <div className="bg-[#AEEA00] brutal-border p-4 w-16 h-16 flex items-center justify-center">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase">Semua Beres!</h3>
                        <p className="font-bold uppercase text-black/50 text-xs">Tidak ada pendaftaran baru yang menunggu validasi.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-4 font-black uppercase text-xs">No</th>
                                    <th className="p-4 font-black uppercase text-xs">Calon Peminjam</th>
                                    <th className="p-4 font-black uppercase text-xs">Detail Akun</th>
                                    <th className="p-4 font-black uppercase text-xs text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.UserID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/20 transition-colors">
                                        <td className="p-4 font-black text-black/40 text-sm">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#FFD600] brutal-border flex items-center justify-center font-black text-lg">
                                                    {user.NamaLengkap.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-sm">{user.NamaLengkap}</p>
                                                    <p className="text-[10px] font-bold text-black/50 uppercase flex items-center gap-1">
                                                        <Clock size={10} /> Mendaftar baru saja
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-bold uppercase space-y-1">
                                                <p><span className="text-black/40 w-24 inline-block">Username:</span> {user.Username}</p>
                                                <p><span className="text-black/40 w-24 inline-block">Email:</span> {user.Email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button 
                                                    onClick={() => handleVerify(user.UserID, user.NamaLengkap)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-[#AEEA00] brutal-border brutal-shadow-sm font-black uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                                                >
                                                    <CheckCircle size={14} /> Terima
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(user.UserID, user.NamaLengkap)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-[#FF4081] text-white brutal-border brutal-shadow-sm font-black uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                                                >
                                                    <UserX size={14} /> Tolak
                                                </button>
                                            </div>
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

export default ValidasiPendaftaran;