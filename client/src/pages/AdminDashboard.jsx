// File: client/src/pages/AdminDashboard.jsx

import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
    LayoutDashboard, Book, Layers, Users, FileText, LogOut, Menu, X, 
    BellDot, UserCheck, BookOpen, History as HistoryIcon, MessageSquare
} from 'lucide-react';

// Import Halaman (Pages)
import DashboardHome from './admin/DashboardHome'; // <--- Import baru
import KelolaBuku from './admin/KelolaBuku';
import DataSiswa from './admin/DataSiswa';
import KelolaKategori from './admin/KelolaKategori';
import AdminPermintaan from './admin/AdminPermintaan';
import ValidasiPendaftaran from './admin/ValidasiPendaftaran';
import RiwayatTransaksi from './admin/RiwayatTransaksi';
import DataUlasan from './admin/DataUlasan';
import Laporan from './admin/Laporan';

const AdminDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        Swal.fire({
            title: 'Keluar?', text: "Anda akan keluar dari sesi ini!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#570df8', cancelButtonColor: '#d33', confirmButtonText: 'Ya, Keluar!'
        }).then((result) => { if (result.isConfirmed) { localStorage.clear(); navigate('/'); } });
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
            {/* --- SIDEBAR --- */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-white border-r border-gray-200 flex flex-col relative z-20 shadow-lg"
            >
                <div className="p-6 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2.5 min-w-max">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-lg text-white shadow-md shadow-violet-500/20">
                            <BookOpen size={22} fill="currentColor" className="opacity-90" />
                        </div>
                        {isSidebarOpen && (
                            <motion.span 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Perpus<span className="text-violet-600">Digital</span>.
                            </motion.span>
                        )}
                    </div>
                    
                    {isSidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm btn-circle absolute right-2 text-gray-400">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {!isSidebarOpen && (
                    <div className="flex justify-center mb-4">
                        <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm">
                            <Menu size={20} />
                        </button>
                    </div>
                )}

                <nav className="flex-1 mt-2 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} to={item.path}
                            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${location.pathname === item.path ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200' : 'text-gray-500 hover:bg-gray-50 hover:text-violet-600'}`}
                        >
                            <span className="min-w-[20px]">{item.icon}</span>
                            {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3 font-semibold text-sm">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* HEADER */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-500 hover:text-indigo-600 transition-colors">
                            <Menu size={20} />
                            </button>
                        )}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
                            <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest text-indigo-700 uppercase">
                            Admin Panel
                            </span>
                        </div>
                        <span className="sm:hidden text-sm font-bold text-gray-800">Admin</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-800">Administrator</p>
                            <p className="text-xs text-gray-500">admin@sekolah.com</p>
                        </div>
                        <div className="avatar placeholder">
                            <div className="bg-violet-600 text-white rounded-full w-10 flex items-center justify-center shadow-md">
                                <span className="text-sm font-bold">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT ROUTES */}
                <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
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
            </div>
        </div>
    );
};

export default AdminDashboard;