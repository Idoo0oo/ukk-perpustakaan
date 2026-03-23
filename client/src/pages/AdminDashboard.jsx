// File: client/src/pages/AdminDashboard.jsx

import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
    LayoutDashboard, Book, Layers, Users, FileText, LogOut, 
    BellDot, UserCheck, BookOpen, History as HistoryIcon, MessageSquare
} from 'lucide-react';

// Import Halaman (Pages)
import DashboardHome from './admin/DashboardHome';
import KelolaBuku from './admin/KelolaBuku';
import DataPeminjam from './admin/DataPeminjam';
import KelolaKategori from './admin/KelolaKategori';
import AdminPermintaan from './admin/AdminPermintaan';
import ValidasiPendaftaran from './admin/ValidasiPendaftaran';
import RiwayatTransaksi from './admin/RiwayatTransaksi';
import DataUlasan from './admin/DataUlasan';
import Laporan from './admin/Laporan';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        const onOpen  = () => setIsModalOpen(true);
        const onClose = () => setIsModalOpen(false);
        window.addEventListener('admin:modal:open',  onOpen);
        window.addEventListener('admin:modal:close', onClose);
        return () => {
            window.removeEventListener('admin:modal:open',  onOpen);
            window.removeEventListener('admin:modal:close', onClose);
        };
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '<span class="font-black uppercase">Keluar?</span>',
            text: "Sesi Anda akan berakhir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            confirmButtonColor: '#FF4081',
            customClass: {
                popup: 'brutal-border-heavy brutal-shadow font-mono',
                confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm',
                cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm'
            }
        }).then((result) => { 
            if (result.isConfirmed) { 
                localStorage.clear(); 
                navigate('/'); 
            } 
        });
    };

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/permintaan', name: 'Permintaan', icon: <BellDot size={20} /> },
        { path: '/admin/riwayat', name: 'Riwayat', icon: <HistoryIcon size={20} /> },
        { path: '/admin/validasi-pendaftaran', name: 'Validasi', icon: <UserCheck size={20} /> },
        { path: '/admin/buku', name: 'Buku', icon: <Book size={20} /> },
        { path: '/admin/kategori', name: 'Kategori', icon: <Layers size={20} /> },
        { path: '/admin/ulasan', name: 'Ulasan', icon: <MessageSquare size={20} /> },
        { path: '/admin/peminjam', name: 'Peminjam', icon: <Users size={20} /> },
        { path: '/admin/laporan', name: 'Laporan', icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] font-mono text-black relative overflow-hidden selection:bg-[#FFD600]">

            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }}></div>

            {/* --- ANNOUNCEMENT MARQUEE --- */}
            <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap relative z-40 border-b-4 border-black">
                <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="inline-block"
                >
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Admin Panel Aktif</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Kelola Perpustakaan Sastra.in</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Pastikan data buku selalu update!</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Cek permintaan peminjaman hari ini</span>
                    {/* Duplikasi untuk seamless loop */}
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Admin Panel Aktif</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Kelola Perpustakaan Sastra.in</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Pastikan data buku selalu update!</span>
                    <span className="mx-8 font-black uppercase text-sm tracking-widest">Cek permintaan peminjaman hari ini</span>
                </motion.div>
            </div>

            {/* --- HEADER ATAS --- */}
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain hover:rotate-12 transition-transform" />
                    <span className="text-2xl font-black uppercase tracking-tighter">
                        Sastra<span className="bg-[#FFD600] px-1 border-2 border-black ml-1">.in</span>
                    </span>
                    <div className="hidden md:flex items-center gap-2 ml-3 px-3 py-1 bg-black text-white brutal-border">
                        <span className="text-[10px] font-black tracking-widest uppercase text-[#AEEA00]">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black uppercase leading-none">Administrator</p>
                        <p className="text-[10px] font-bold text-black/50 uppercase">admin@gmail.com</p>
                    </div>
                    <div className="w-12 h-12 bg-[#AEEA00] brutal-border brutal-shadow-sm flex items-center justify-center font-black text-xl cursor-pointer hover:bg-[#FFD600] transition-colors">
                        AD
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 pb-32 relative z-10">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/permintaan" element={<AdminPermintaan />} />
                        <Route path="/riwayat" element={<RiwayatTransaksi />} />
                        <Route path="/validasi-pendaftaran" element={<ValidasiPendaftaran />} />
                        <Route path="/buku" element={<KelolaBuku />} />
                        <Route path="/kategori" element={<KelolaKategori />} />
                        <Route path="/ulasan" element={<DataUlasan />} />
                        <Route path="/peminjam" element={<DataPeminjam />} />
                        <Route path="/laporan" element={<Laporan />} />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* --- FLOATING NAVBAR BAWAH (NEO-BRUTALISM) --- */}
            <AnimatePresence>
                {!isModalOpen && (
                    <motion.div
                        key="bottom-nav"
                        initial={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full flex justify-center"
                    >
                        <nav className="flex items-center gap-1 p-2 bg-white brutal-border-heavy brutal-shadow-lg max-w-full overflow-x-auto scrollbar-hide">
                            
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link 
                                        key={item.path} 
                                        to={item.path}
                                        className={`group flex items-center gap-2 py-3 transition-all duration-200 whitespace-nowrap
                                            ${isActive 
                                                ? 'bg-black text-white brutal-border brutal-shadow-sm px-4' 
                                                : 'bg-white text-black hover:bg-[#FFD600] hover:px-4 px-3 active:translate-y-0.5'
                                            }`}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        <span className={`font-black uppercase text-xs overflow-hidden whitespace-nowrap transition-all duration-200 ${
                                            isActive
                                                ? 'max-w-[100px] opacity-100'
                                                : 'max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100'
                                        }`}>{item.name}</span>
                                    </Link>
                                );
                            })}

                            {/* Pembatas vertikal */}
                            <div className="w-1 h-8 bg-black mx-1 shrink-0"></div>

                            {/* Tombol Logout */}
                            <button 
                                onClick={handleLogout} 
                                className="group flex items-center gap-2 px-3 py-3 bg-white text-black hover:bg-[#FF4081] hover:text-white hover:px-4 transition-all duration-200 active:translate-y-0.5 shrink-0"
                            >
                                <LogOut size={20} />
                                <span className="font-black uppercase text-xs max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-200 group-hover:max-w-[100px] group-hover:opacity-100">Logout</span>
                            </button>

                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;