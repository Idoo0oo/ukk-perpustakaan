import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
    LayoutDashboard, Book, Layers, Users, FileText, LogOut, Menu, X, 
    BellDot, UserCheck, BookOpen, Activity, ArrowRight, History as HistoryIcon, MessageSquare
} from 'lucide-react';

// --- IMPORTS UNTUK CHART ---
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
import { format, subDays, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale'; // Locale Indonesia

// --- REGISTER CHART COMPONENTS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Import halaman-halaman Admin
import KelolaBuku from './admin/KelolaBuku';
import DataSiswa from './admin/DataSiswa';
import KelolaKategori from './admin/KelolaKategori';
import AdminPermintaan from './admin/AdminPermintaan';
import ValidasiPendaftaran from './admin/ValidasiPendaftaran';
import RiwayatTransaksi from './admin/RiwayatTransaksi';
import DataUlasan from './admin/DataUlasan';
import Laporan from './admin/Laporan'; // <--- INI YG DITAMBAHKAN

// --- KOMPONEN DASHBOARD HOME (REALTIME & MODERN) ---
const DashboardHome = () => {
    // State untuk menyimpan data Real dari Database
    const [stats, setStats] = useState({
        totalBuku: 0,
        totalSiswa: 0,
        sedangDipinjam: 0,
        menungguValidasi: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    
    // State untuk Chart
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [loading, setLoading] = useState(true);

    // Format Tanggal untuk aktivitas
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Ambil Semua Data Secara Paralel
                const [resBuku, resSiswa, resPinjam] = await Promise.all([
                    axios.get('http://localhost:5000/api/buku', { headers }),
                    axios.get('http://localhost:5000/api/users?status=Aktif', { headers }),
                    axios.get('http://localhost:5000/api/peminjaman', { headers })
                ]);

                const dataPinjam = resPinjam.data;

                // 2. Hitung Statistik Utama
                setStats({
                    totalBuku: resBuku.data.length,
                    totalSiswa: resSiswa.data.length,
                    sedangDipinjam: dataPinjam.filter(p => p.StatusPeminjaman === 'Dipinjam').length,
                    menungguValidasi: dataPinjam.filter(p => p.StatusPeminjaman === 'Menunggu' || p.StatusPeminjaman === 'Menunggu Pengembalian').length
                });

                // 3. Proses "Aktivitas Terbaru" (5 Transaksi Terakhir)
                const sortedActivity = [...dataPinjam].sort((a, b) => 
                    new Date(b.TanggalPeminjaman) - new Date(a.TanggalPeminjaman)
                ).slice(0, 5);
                setRecentActivities(sortedActivity);

                // 4. Proses "Buku Terpopuler"
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

                // 5. PROSES DATA GRAFIK STACKED (7 Hari Terakhir)
                // Generate 7 hari terakhir
                const last7Days = [...Array(7)].map((_, i) => {
                    return subDays(new Date(), i);
                }).reverse();

                const labels = last7Days.map(date => format(date, 'dd MMM', { locale: localeId }));

                // Siapkan array kosong untuk setiap status
                const dataMenunggu = [];
                const dataDipinjam = [];
                const dataDikembalikan = [];
                const dataDitolak = [];

                last7Days.forEach(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    
                    // Filter transaksi pada tanggal tersebut
                    const transaksiHariIni = dataPinjam.filter(p => p.TanggalPeminjaman.startsWith(dateStr));

                    // Hitung jumlah per status
                    dataMenunggu.push(transaksiHariIni.filter(p => p.StatusPeminjaman === 'Menunggu').length);
                    
                    // Digabung: Dipinjam & Menunggu Pengembalian dianggap "Aktif Dipinjam"
                    dataDipinjam.push(transaksiHariIni.filter(p => p.StatusPeminjaman === 'Dipinjam' || p.StatusPeminjaman === 'Menunggu Pengembalian').length);
                    
                    dataDikembalikan.push(transaksiHariIni.filter(p => p.StatusPeminjaman === 'Dikembalikan').length);
                    dataDitolak.push(transaksiHariIni.filter(p => p.StatusPeminjaman === 'Ditolak').length);
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Dikembalikan',
                            data: dataDikembalikan,
                            backgroundColor: '#10b981', // Emerald-500
                            borderRadius: 4,
                        },
                        {
                            label: 'Sedang Dipinjam',
                            data: dataDipinjam,
                            backgroundColor: '#6366f1', // Indigo-500
                            borderRadius: 4,
                        },
                        {
                            label: 'Menunggu ACC',
                            data: dataMenunggu,
                            backgroundColor: '#f59e0b', // Amber-500
                            borderRadius: 4,
                        },
                        {
                            label: 'Ditolak',
                            data: dataDitolak,
                            backgroundColor: '#ef4444', // Red-500
                            borderRadius: 4,
                        },
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

    // Konfigurasi Opsi Chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 11 }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
            }
        },
        scales: {
            x: {
                stacked: true, // WAJIB: Agar bertumpuk
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: {
                stacked: true, // WAJIB: Agar bertumpuk
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { stepSize: 1, font: { size: 11 } }
            },
        },
    };

    if (loading) return (
        <div className="p-10 text-center flex flex-col items-center justify-center h-96">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-gray-400 animate-pulse">Sedang sinkronisasi data database...</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
        >
            {/* HERO BANNER */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-200">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">Halo, Administrator! 👋</h1>
                        <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
                            {stats.menungguValidasi > 0 ? (
                                <>Ada <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white">{stats.menungguValidasi} permintaan</span> yang membutuhkan persetujuanmu hari ini.</>
                            ) : (
                                "Semua aman terkendali. Tidak ada permintaan tertunda saat ini."
                            )}
                        </p>
                    </div>
                    <Link to="/admin/permintaan" className="btn bg-white text-indigo-600 border-none hover:bg-indigo-50 font-bold px-8 h-12 rounded-xl shadow-lg transition-transform hover:scale-105">
                        Tinjau Sekarang
                    </Link>
                </div>
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* KARTU STATISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Koleksi', val: stats.totalBuku, icon: <Book size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Anggota Aktif', val: stats.totalSiswa, icon: <Users size={24}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Sedang Dipinjam', val: stats.sedangDipinjam, icon: <BookOpen size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                    { label: 'Perlu Tindakan', val: stats.menungguValidasi, icon: <BellDot size={24}/>, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
                ].map((item, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl border ${item.border} shadow-sm hover:shadow-lg transition-all duration-300 group`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wider">{item.label}</p>
                                <h3 className="text-3xl font-extrabold text-gray-800">{item.val}</h3>
                            </div>
                            <div className={`p-3.5 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* GRID GRAFIK & POPULER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- GRAFIK STACKED BAR CHART --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <Layers className="text-indigo-500" /> Statistik Transaksi (7 Hari)
                        </h3>
                    </div>
                    
                    {/* Container Chart */}
                    <div className="h-64 w-full">
                        {chartData.labels.length > 0 ? (
                            <Bar options={chartOptions} data={chartData} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 italic">
                                Belum ada data transaksi minggu ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* BUKU POPULER */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="text-orange-500" /> Sedang Populer
                    </h3>
                    <div className="space-y-4 flex-1">
                        {popularBooks.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 italic text-sm">Belum ada data.</div>
                        ) : popularBooks.map((book, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-lg ${
                                    i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                    i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'
                                }`}>#{i+1}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-sm truncate" title={book.title}>{book.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Sering dipinjam</p>
                                </div>
                                <div className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md border border-indigo-100">{book.count}x</div>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/buku" className="btn btn-outline btn-sm w-full mt-6 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border-gray-200 font-normal">
                        Kelola Katalog <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* TABEL AKTIVITAS TERBARU */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-lg text-gray-800">Riwayat Transaksi Terakhir</h3>
                    <Link to="/admin/riwayat" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                        Lihat Semua Transaksi
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold">Siswa</th>
                                <th className="p-5 font-semibold">Buku</th>
                                <th className="p-5 font-semibold">Status</th>
                                <th className="p-5 font-semibold text-right">Waktu Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentActivities.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada aktivitas.</td></tr>
                            ) : recentActivities.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 font-bold text-gray-800">{row.NamaPeminjam || row.NamaLengkap || 'User'}</td>
                                    <td className="p-5 text-gray-600 font-medium">{row.JudulBuku || row.Judul || '-'}</td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            row.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            row.StatusPeminjaman === 'Dikembalikan' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            row.StatusPeminjaman === 'Ditolak' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>{row.StatusPeminjaman}</span>
                                    </td>
                                    <td className="p-5 text-right text-gray-400 text-xs">{formatDate(row.TanggalPeminjaman)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// --- KOMPONEN UTAMA ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?',
            text: "Anda akan keluar dari sesi ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#570df8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Keluar!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/permintaan', name: 'Permintaan Pinjam', icon: <BellDot size={20} /> },
        { path: '/admin/riwayat', name: 'Riwayat Transaksi', icon: <HistoryIcon size={20} /> },
        { path: '/admin/validasi-pendaftaran', name: 'Validasi Pendaftaran', icon: <UserCheck size={20} /> },
        { path: '/admin/buku', name: 'Kelola Buku', icon: <Book size={20} /> },
        { path: '/admin/kategori', name: 'Kategori', icon: <Layers size={20} /> },
        { path: '/admin/ulasan', name: 'Ulasan Buku', icon: <MessageSquare size={20} /> },
        { path: '/admin/siswa', name: 'Data Siswa', icon: <Users size={20} /> },
        { path: '/admin/laporan', name: 'Laporan', icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* SIDEBAR */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-white border-r border-gray-200 flex flex-col relative z-20 shadow-lg"
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <motion.span 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="font-bold text-xl text-primary italic"
                        >
                            PerpusDigital
                        </motion.span>
                    )}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="btn btn-ghost btn-sm p-1">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 mt-4 px-3 space-y-2">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        {isSidebarOpen && <span className="font-semibold text-sm">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOP NAVBAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-2">
                         <span className="text-gray-400 text-sm italic">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-800">Administrator</p>
                            <p className="text-xs text-gray-500">admin@sekolah.com</p>
                        </div>
                        <div className="avatar placeholder">
                            <div className="bg-primary text-white rounded-full w-10 flex items-center justify-center shadow-md">
                                <span className="text-sm font-bold">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* AREA KONTEN (Dinamis) */}
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<DashboardHome />} />
                            <Route path="/permintaan" element={<AdminPermintaan />} />
                            <Route path="/riwayat" element={<RiwayatTransaksi />} />
                            <Route path="/validasi-pendaftaran" element={<ValidasiPendaftaran />} />
                            <Route path="/buku" element={<KelolaBuku />} />
                            <Route path="/kategori" element={<KelolaKategori />} />
                            <Route path="/ulasan" element={<DataUlasan />} />
                            <Route path="/siswa" element={<DataSiswa />} />
                            {/* Route ke Halaman Laporan yang ASLI */}
                            <Route path="/laporan" element={<Laporan />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;