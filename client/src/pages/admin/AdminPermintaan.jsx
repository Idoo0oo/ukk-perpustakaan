import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, User } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminPermintaan = () => {
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem('token');

    const fetchRequests = async () => {
        const res = await axios.get('http://localhost:5000/api/peminjaman', {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Filter hanya yang statusnya 'Menunggu'
        setRequests(res.data.filter(r => r.StatusPeminjaman === 'Menunggu'));
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleAction = async (id, action) => {
        try {
            const url = action === 'acc' ? `/acc/${id}` : `/tolak/${id}`;
            await axios.put(`http://localhost:5000/api/peminjaman${url}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire('Berhasil', `Permintaan telah di-${action.toUpperCase()}`, 'success');
            fetchRequests();
        } catch (err) { Swal.fire('Error', 'Gagal memproses', 'error'); }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Persetujuan Peminjaman</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th>Siswa</th>
                            <th>Buku</th>
                            <th>Batas Kembali</th>
                            <th className="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.PeminjamanID}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="avatar placeholder"><div className="bg-neutral text-neutral-content rounded-full w-8"><span>{req.NamaPeminjam[0]}</span></div></div>
                                        {req.NamaPeminjam}
                                    </div>
                                </td>
                                <td className="font-bold">{req.JudulBuku}</td>
                                <td>{req.TanggalPengembalian}</td>
                                <td className="flex justify-center gap-2">
                                    <button onClick={() => handleAction(req.PeminjamanID, 'acc')} className="btn btn-success btn-sm text-white"><Check size={16}/> Terima</button>
                                    <button onClick={() => handleAction(req.PeminjamanID, 'tolak')} className="btn btn-error btn-sm text-white"><X size={16}/> Tolak</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPermintaan;