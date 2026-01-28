import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 agar notifikasi cantik
import { CheckCircle, XCircle, UserCheck, UserX, Clock } from 'lucide-react';

const ValidasiPendaftaran = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Ambil data user yang statusnya 'Menunggu'
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

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // 1. Fungsi Terima (Aktifkan Akun) dengan SweetAlert
    const handleVerify = async (id, nama) => {
        const result = await Swal.fire({
            title: 'Aktifkan Siswa?',
            text: `Apakah Anda yakin ingin mengaktifkan akun atas nama "${nama}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Warna Hijau (Emerald)
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Aktifkan!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Tampilkan loading saat proses
                Swal.fire({
                    title: 'Memproses...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading() }
                });

                await axios.put(`http://localhost:5000/api/users/${id}/verify`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: `Akun ${nama} kini sudah aktif dan bisa login.`,
                    timer: 2000,
                    showConfirmButton: false
                });
                
                fetchPendingUsers(); // Refresh data tabel
            } catch (err) {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat mengaktifkan akun.', 'error');
            }
        }
    };

    // 2. Fungsi Tolak (Hapus Akun) dengan SweetAlert
    const handleReject = async (id, nama) => {
        const result = await Swal.fire({
            title: 'Tolak Pendaftaran?',
            text: `Akun "${nama}" akan dihapus permanen dari database. Tindakan ini tidak bisa dibatalkan!`,
            icon: 'warning', // Ikon peringatan
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Warna Merah
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Tolak & Hapus',
            cancelButtonText: 'Batal',
            focusCancel: true
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });

                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire('Ditolak!', 'Pendaftaran telah ditolak dan data dihapus.', 'success');
                fetchPendingUsers();
            } catch (err) {
                Swal.fire('Gagal!', 'Gagal menghapus data.', 'error');
            }
        }
    };

    return (
        <div className="p-6 min-h-screen">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Validasi Pendaftaran</h2>
                        <p className="text-gray-500 text-sm">Kelola siswa baru yang menunggu persetujuan akses.</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg flex items-center gap-2 text-sm font-semibold border border-orange-100">
                    <Clock size={16} />
                    Menunggu: {users.length} Siswa
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-400">Memuat data pendaftaran...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Semua Beres!</h3>
                        <p className="text-gray-500">Tidak ada pendaftaran baru yang menunggu validasi.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-5 font-semibold">No</th>
                                    <th className="p-5 font-semibold">Calon Siswa</th>
                                    <th className="p-5 font-semibold">Detail Akun</th>
                                    <th className="p-5 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user, index) => (
                                    <tr key={user.UserID} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5 text-gray-400 font-medium w-16">{index + 1}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-indigo-100 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                                                        {user.NamaLengkap.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{user.NamaLengkap}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} /> Mendaftar baru saja
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm">
                                                <p className="text-gray-600"><span className="font-semibold text-gray-400 w-20 inline-block">Username:</span> {user.Username}</p>
                                                <p className="text-gray-600"><span className="font-semibold text-gray-400 w-20 inline-block">Email:</span> {user.Email}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center items-center gap-2">
                                                <button 
                                                    onClick={() => handleVerify(user.UserID, user.NamaLengkap)}
                                                    className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 border-none text-white gap-2 font-normal shadow-sm group-hover:shadow-md transition-all"
                                                >
                                                    <CheckCircle size={16} /> Terima
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(user.UserID, user.NamaLengkap)}
                                                    className="btn btn-sm bg-white hover:bg-red-50 text-red-500 border border-red-200 gap-2 font-normal hover:border-red-300"
                                                >
                                                    <UserX size={16} /> Tolak
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