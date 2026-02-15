import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MessageSquare, Star, Trash2, Search, User, Calendar } from 'lucide-react';

const DataUlasan = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Fetch Data
    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ulasan/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
            setFilteredReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    // Filter Search
    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        const results = reviews.filter(r => {
            const nama = (r.NamaLengkap || '').toLowerCase();
            const judul = (r.Judul || '').toLowerCase();
            const ulasan = (r.Ulasan || '').toLowerCase();

            return nama.includes(lower) || judul.includes(lower) || ulasan.includes(lower);
        });
        setFilteredReviews(results);
    }, [searchTerm, reviews]);

    // Hapus Ulasan
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Ulasan?',
            text: "Ulasan ini akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/ulasan/admin/:id`, {
                    // headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Terhapus', 'Ulasan berhasil dihapus.', 'success');
                fetchReviews();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan server.', 'error');
            }
        }
    };

    // Helper: Render Bintang
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "text-red-400 fill-red-400" : "text-gray-300"} />
        ));
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="text-indigo-600" size={28} /> Ulasan Pembaca
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Pantau feedback dan rating dari siswa.</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari ulasan, buku, siswa..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List Ulasan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-16 text-center text-gray-400">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Belum ada ulasan masuk.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredReviews.map((item) => (
                            <div key={item.UlasanID} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 items-start">
                                {/* Info Buku (Kiri) */}
                                <div className="flex items-start gap-4 md:w-1/3 shrink-0">
                                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden shadow-sm shrink-0">
                                        {item.Gambar ? (
                                            <img src={`http://localhost:5000/uploads/${item.Gambar}`} alt={item.Judul} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Cover</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{item.judul}</h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {renderStars(item.Rating)}
                                            <span className="text-xs text-gray-500 ml-1">({item.Rating}/5)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Isi Ulasan (Tengah) */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-indigo-100 text-indigo-600 p-1 rounded-full">
                                            <User size={12} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item.NamaLengkap}</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                                            <Calendar size={12} /> {new Date(item.TanggalUlasan).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                        "{item.Ulasan}"
                                    </p>
                                </div>

                                {/* Aksi (Kanan) */}
                                <button 
                                    onClick={() => handleDelete(item.UlasanID)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Ulasan"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-400">
                Menampilkan {filteredReviews.length} ulasan
            </div>
        </div>
    );
};

export default DataUlasan;