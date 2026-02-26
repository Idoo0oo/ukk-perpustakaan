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
import DataSiswa from './admin/DataSiswa';
import KelolaKategori from './admin/KelolaKategori';
import AdminPermintaan from './admin/AdminPermintaan';
import ValidasiPendaftaran from './admin/ValidasiPendaftaran';
import RiwayatTransaksi from './admin/RiwayatTransaksi';
import DataUlasan from './admin/DataUlasan';
import Laporan from './admin/Laporan';

const AdminDashboard = () => {
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
        { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={22} /> },
        { path: '/admin/permintaan', name: 'Permintaan', icon: <BellDot size={22} /> },
        { path: '/admin/riwayat', name: 'Riwayat', icon: <HistoryIcon size={22} /> },
        { path: '/admin/validasi-pendaftaran', name: 'Validasi', icon: <UserCheck size={22} /> },
        { path: '/admin/buku', name: 'Buku', icon: <Book size={22} /> },
        { path: '/admin/kategori', name: 'Kategori', icon: <Layers size={22} /> },
        { path: '/admin/ulasan', name: 'Ulasan', icon: <MessageSquare size={22} /> },
        { path: '/admin/siswa', name: 'Siswa', icon: <Users size={22} /> },
        { path: '/admin/laporan', name: 'Laporan', icon: <FileText size={22} /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-gray-900 relative overflow-hidden">
            
            {/* --- HEADER ATAS --- */}
            <header className="h-20 bg-white/60 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/30">
                        <BookOpen size={24} fill="currentColor" className="opacity-90" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 hidden sm:block">
                        Perpus<span className="text-violet-600">Digital</span>.
                    </span>
                    
                    <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest text-indigo-700 uppercase">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">Administrator</p>
                        <p className="text-xs text-gray-500 font-medium">admin@sekolah.com</p>
                    </div>
                    <div className="avatar placeholder cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all rounded-full">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold">AD</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 pb-32 overflow-y-auto overflow-x-hidden">
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
                        <Route path="/laporan" element={<Laporan />} />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* --- FLOATING NAVBAR (GLASSMORPHISM) --- */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-max">
                <nav className="flex items-center gap-2 px-3 py-3 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-x-auto scrollbar-hide">
                    
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`group relative flex items-center h-12 rounded-full transition-all duration-300 ease-in-out
                                    ${isActive 
                                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/40 px-4' 
                                        : 'bg-transparent text-gray-600 hover:bg-white/80 hover:text-violet-600 px-3'
                                    }`}
                            >
                                {/* Ikon */}
                                <span className="shrink-0 flex items-center justify-center">
                                    {item.icon}
                                </span>

                                {/* Teks yang melebar saat aktif ATAU saat di-hover */}
                                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-medium text-sm
                                    ${isActive 
                                        ? 'max-w-[200px] ml-2.5 opacity-100' 
                                        : 'max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:ml-2.5 group-hover:opacity-100'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Pembatas vertikal */}
                    <div className="w-[2px] h-8 bg-gray-300/50 mx-1 rounded-full shrink-0"></div>

                    {/* Tombol Logout */}
                    <button 
                        onClick={handleLogout} 
                        className="group relative flex items-center h-12 px-3 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out shrink-0"
                    >
                        <span className="shrink-0 flex items-center justify-center">
                            <LogOut size={22} />
                        </span>
                        <span className="overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-medium text-sm max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:ml-2.5 group-hover:opacity-100">
                            Logout
                        </span>
                    </button>

                </nav>
            </div>

        </div>
    );
};

export default AdminDashboard;