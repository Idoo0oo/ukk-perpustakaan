import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { StatBoxSkeleton } from '../../components/Skeleton';
import { 
    Book, Layers, Users, BellDot, BookOpen, Activity, ArrowRight, Zap
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

// --- CHART IMPORTS ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
    usePageTitle('Dashboard Admin');
    const [stats, setStats] = useState({
        totalBuku: 0,
        totalPeminjam: 0,
        sedangDipinjam: 0,
        menungguValidasi: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    const getEffectiveDate = (item) => {
        if (item.StatusPeminjaman === 'Dikembalikan') return item.TanggalPengembalian;
        return item.TanggalPeminjaman;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); 

        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
        
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [resBuku, resPeminjam, resPinjam] = await Promise.all([
                    axios.get('http://localhost:5000/api/buku', { headers }),
                    axios.get('http://localhost:5000/api/users?status=Aktif', { headers }),
                    axios.get('http://localhost:5000/api/peminjaman', { headers })
                ]);

                const dataPinjam = resPinjam.data;

                setStats({
                    totalBuku: resBuku.data.pagination?.totalData || resBuku.data.data?.length || 0,
                    totalPeminjam: resPeminjam.data.length,
                    sedangDipinjam: dataPinjam.filter(p => p.StatusPeminjaman === 'Dipinjam').length,
                    menungguValidasi: dataPinjam.filter(p => p.StatusPeminjaman === 'Menunggu' || p.StatusPeminjaman === 'Menunggu Pengembalian').length
                });

                const sortedActivity = [...dataPinjam].sort((a, b) => 
                    new Date(getEffectiveDate(b)) - new Date(getEffectiveDate(a))
                ).slice(0, 5);
                setRecentActivities(sortedActivity);

                const bookCounts = {};
                dataPinjam.forEach(p => {
                    const judul = p.JudulBuku || p.Judul || 'Buku Tanpa Judul';
                    bookCounts[judul] = (bookCounts[judul] || 0) + 1;
                });
                const topBooks = Object.entries(bookCounts)
                    .map(([title, count]) => ({ title, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3);
                setPopularBooks(topBooks);

                const last7Days = [...Array(7)].map((_, i) => subDays(new Date(), i)).reverse();
                const labels = last7Days.map(date => format(date, 'dd MMM', { locale: localeId }));
                const dataMenunggu = [];
                const dataDipinjam = [];
                const dataDikembalikan = [];
                const dataDitolak = [];

                last7Days.forEach(dayDate => {
                    const targetDateStr = format(dayDate, 'yyyy-MM-dd');
                    
                    // Filter per status dengan tanggal yang relevan (Pinjam vs Kembali)
                    const countStatus = (statusList, dateField) => {
                        return dataPinjam.filter(p => 
                            statusList.includes(p.StatusPeminjaman) && 
                            p[dateField] && 
                            format(new Date(p[dateField]), 'yyyy-MM-dd') === targetDateStr
                        ).length;
                    };
                    
                    dataMenunggu.push(countStatus(['Menunggu'], 'TanggalPeminjaman'));
                    dataDipinjam.push(countStatus(['Dipinjam', 'Menunggu Pengembalian'], 'TanggalPeminjaman'));
                    dataDikembalikan.push(countStatus(['Dikembalikan'], 'TanggalPengembalian'));
                    dataDitolak.push(countStatus(['Ditolak'], 'TanggalPeminjaman'));
                });

                setChartData({
                    labels,
                    datasets: [
                        { label: 'Dikembalikan', data: dataDikembalikan, backgroundColor: '#AEEA00', borderColor: '#000', borderWidth: 2, borderRadius: 0 },
                        { label: 'Sedang Dipinjam', data: dataDipinjam, backgroundColor: '#00E5FF', borderColor: '#000', borderWidth: 2, borderRadius: 0 },
                        { label: 'Menunggu ACC', data: dataMenunggu, backgroundColor: '#FFD600', borderColor: '#000', borderWidth: 2, borderRadius: 0 },
                        { label: 'Ditolak', data: dataDitolak, backgroundColor: '#FF4081', borderColor: '#000', borderWidth: 2, borderRadius: 0 },
                    ],
                });
                setLoading(false);
            } catch (err) {
                console.error("Gagal memuat data dashboard:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, font: { size: 11, family: 'monospace', weight: 'bold' } } },
            title: { display: false },
            tooltip: { backgroundColor: '#000', padding: 12, cornerRadius: 0, displayColors: true, titleFont: { family: 'monospace', weight: 'bold' }, bodyFont: { family: 'monospace' } }
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11, family: 'monospace', weight: 'bold' } } },
            y: { stacked: true, beginAtZero: true, grid: { color: '#000', lineWidth: 0.5 }, ticks: { stepSize: 1, font: { size: 11, family: 'monospace', weight: 'bold' } } },
        },
    };

    if (loading) return (
        <div className="p-6 md:p-12 space-y-12 font-mono">
            <div>
                <div className="h-10 w-64 bg-gray-300 animate-pulse brutal-border-heavy opacity-70 mb-2"></div>
                <div className="h-4 w-48 bg-gray-300 animate-pulse brutal-border-heavy opacity-70"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <StatBoxSkeleton key={i} />)}
            </div>
        </div>
    );

    const statusColors = {
        'Dipinjam': 'bg-[#00E5FF]',
        'Dikembalikan': 'bg-[#AEEA00]',
        'Ditolak': 'bg-[#FF4081]',
        'Menunggu': 'bg-[#FFD600]',
        'Menunggu Pengembalian': 'bg-[#FFD600]',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* HERO BANNER */}
            <div className="bg-[#AEEA00] brutal-border-heavy brutal-shadow-lg p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-tighter mb-2">
                        Halo, <span className="bg-black text-white px-2">Administrator</span>
                    </h1>
                    <p className="font-black uppercase text-black/70 text-sm max-w-md leading-tight">
                        {stats.menungguValidasi > 0 ? (
                            <>Ada <span className="bg-[#FF4081] text-white px-1">{stats.menungguValidasi} permintaan</span> yang butuh persetujuanmu.</>
                        ) : "Semua aman terkendali. Tidak ada permintaan tertunda."}
                    </p>
                </div>
                <Link to="/admin/permintaan" className="bg-black text-white px-8 py-4 font-black uppercase text-sm brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 shrink-0">
                    Tinjau Sekarang <ArrowRight size={18} />
                </Link>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Koleksi', val: stats.totalBuku, icon: <Book size={24} />, color: 'bg-[#FFD600]' },
                    { label: 'Anggota Aktif', val: stats.totalPeminjam, icon: <Users size={24} />, color: 'bg-[#00E5FF]' },
                    { label: 'Sedang Dipinjam', val: stats.sedangDipinjam, icon: <BookOpen size={24} />, color: 'bg-[#FF4081]' },
                    { label: 'Perlu Tindakan', val: stats.menungguValidasi, icon: <BellDot size={24} />, color: 'bg-[#AEEA00]' },
                ].map((item, idx) => (
                    <div key={idx} className={`${item.color} brutal-border-heavy brutal-shadow p-6 group`}>
                        <div className="bg-white brutal-border w-10 h-10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-4xl font-black mb-1">{item.val}</h3>
                        <p className="text-[10px] font-black uppercase tracking-wider text-black/60 leading-none">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* CHART + POPULAR BOOKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white brutal-border-heavy brutal-shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <span className="bg-black text-white px-2 py-0.5 font-black text-[10px] uppercase">Statistik</span>
                            <h3 className="font-black uppercase text-lg mt-1 leading-none">Transaksi 7 Hari</h3>
                        </div>
                        <Layers size={24} className="opacity-30" />
                    </div>
                    <div className="h-64 w-full">
                        {chartData.labels.length > 0 
                            ? <Bar options={chartOptions} data={chartData} /> 
                            : <div className="h-full flex items-center justify-center font-black uppercase text-black/30 text-sm border-4 border-dashed border-black">Belum ada data transaksi.</div>
                        }
                    </div>
                </div>

                {/* Popular Books */}
                <div className="bg-white brutal-border-heavy brutal-shadow p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={20} />
                        <h3 className="font-black uppercase text-lg leading-none">Buku Populer</h3>
                    </div>
                    <div className="space-y-3 flex-1">
                        {popularBooks.length === 0 
                            ? <div className="text-center py-8 font-black uppercase text-black/30 text-xs border-4 border-dashed border-black">Belum ada data.</div>
                            : popularBooks.map((book, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border-4 border-black hover:bg-[#FFD600] transition-colors group">
                                    <div className={`font-black text-lg w-10 h-10 flex items-center justify-center border-2 border-black shrink-0 ${
                                        i === 0 ? 'bg-[#FFD600]' : i === 1 ? 'bg-[#00E5FF]' : 'bg-[#AEEA00]'
                                    }`}>#{i+1}</div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm truncate uppercase" title={book.title}>{book.title}</h4>
                                        <p className="text-[10px] font-bold uppercase text-black/50">Sering dipinjam</p>
                                    </div>
                                    <div className="bg-black text-white text-xs font-black px-2 py-1 shrink-0">{book.count}x</div>
                                </div>
                            ))
                        }
                    </div>
                    <Link to="/admin/buku" className="mt-6 bg-black text-white px-4 py-3 font-black uppercase text-xs brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                        Kelola Katalog <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* RECENT ACTIVITY TABLE */}
            <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
                <div className="p-6 border-b-4 border-black flex justify-between items-center bg-black text-white">
                    <h3 className="font-black uppercase text-lg">Riwayat Transaksi Terakhir</h3>
                    <Link to="/admin/riwayat" className="text-[#AEEA00] font-black uppercase text-xs hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-mono">
                        <thead className="bg-[#FFD600] border-b-4 border-black">
                            <tr>
                                <th className="p-4 font-black uppercase text-xs">Peminjam</th>
                                <th className="p-4 font-black uppercase text-xs">Buku</th>
                                <th className="p-4 font-black uppercase text-xs">Status</th>
                                <th className="p-4 font-black uppercase text-xs text-right">Waktu Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivities.length === 0 
                                ? <tr><td colSpan="4" className="p-8 text-center font-black uppercase text-black/40">Belum ada aktivitas.</td></tr>
                                : recentActivities.map((row, i) => (
                                    <tr key={i} className="border-b-2 border-black/10 hover:bg-[#AEEA00]/20 transition-colors">
                                        <td className="p-4 font-black uppercase">{row.NamaPeminjam || row.NamaLengkap || 'User'}</td>
                                        <td className="p-4 font-bold text-black/70 uppercase text-xs">{row.JudulBuku || row.Judul || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 brutal-border text-[10px] font-black uppercase ${statusColors[row.StatusPeminjaman] || 'bg-white'}`}>
                                                {row.StatusPeminjaman}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-xs text-black/50 uppercase">
                                            {formatDate(getEffectiveDate(row))}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardHome;