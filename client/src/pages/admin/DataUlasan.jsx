import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MessageSquare, Star, Trash2, Search, User, Calendar } from 'lucide-react';
import { ListSkeleton } from '../../components/Skeleton';

const DataUlasan = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/ulasan/admin/all', { headers: { Authorization: `Bearer ${token}` } });
            setReviews(res.data);
            setFilteredReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '<span class="font-black uppercase">Hapus Ulasan?</span>',
            text: "Ulasan ini akan dihapus permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/ulasan/admin/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Terhapus!</span>', timer: 1500, showConfirmButton: false });
                fetchReviews();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan server.', 'error');
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "text-[#FF4081] fill-[#FF4081]" : "text-black/20"} />
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Moderasi</div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <MessageSquare size={32} /> Ulasan Pembaca
                    </h2>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Pantau feedback dan rating dari peminjam.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3 text-black" size={18} />
                    <input 
                        type="text" 
                        placeholder="CARI ULASAN, BUKU, PEMINJAM..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white brutal-border font-black uppercase text-xs focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reviews */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                {loading ? (
                    <ListSkeleton items={4} />
                ) : filteredReviews.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center gap-4">
                        <div className="bg-[#AEEA00] brutal-border p-4 w-16 h-16 flex items-center justify-center">
                            <MessageSquare size={32} />
                        </div>
                        <p className="font-black uppercase text-sm">Belum ada ulasan masuk.</p>
                    </div>
                ) : (
                    <div>
                        {filteredReviews.map((item, i) => (
                            <div key={item.UlasanID} className={`p-6 flex flex-col md:flex-row gap-6 items-start border-b-2 border-black/10 hover:bg-[#FFD600]/10 transition-colors`}>
                                {/* Book Info */}
                                <div className="flex items-start gap-4 md:w-1/3 shrink-0">
                                    <div className="w-12 h-16 bg-[#FFFBEB] brutal-border overflow-hidden shrink-0">
                                        {item.Gambar 
                                            ? <img src={`http://localhost:5000/uploads/${item.Gambar}`} alt={item.Judul} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-xs text-black/30 font-black uppercase">No</div>
                                        }
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase text-sm line-clamp-2">{item.Judul}</h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {renderStars(item.Rating)}
                                            <span className="text-[10px] font-black text-black/50 ml-1">({item.Rating}/5)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#AEEA00] brutal-border p-1 w-6 h-6 flex items-center justify-center">
                                            <User size={12} />
                                        </div>
                                        <span className="text-sm font-black uppercase">{item.NamaLengkap}</span>
                                        <span className="text-[10px] font-bold text-black/40 flex items-center gap-1 ml-2">
                                            <Calendar size={10} /> {new Date(item.TanggalUlasan).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="font-bold text-sm bg-[#FFFBEB] brutal-border p-3 text-black/70 leading-relaxed">
                                        "{item.Ulasan}"
                                    </p>
                                </div>

                                {/* Delete */}
                                <button 
                                    onClick={() => handleDelete(item.UlasanID)}
                                    className="p-2 bg-white brutal-border hover:bg-[#FF4081] hover:text-white transition-colors shrink-0"
                                    title="Hapus Ulasan"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="text-center font-black uppercase text-xs text-black/40">
                Menampilkan {filteredReviews.length} ulasan
            </div>
        </div>
    );
};

export default DataUlasan;