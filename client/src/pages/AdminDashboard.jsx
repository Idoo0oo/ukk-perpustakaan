import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Book, Layers, Users, 
    FileText, LogOut, Menu, X 
} from 'lucide-react';
import Swal from 'sweetalert2';
import KelolaBuku from './admin/KelolaBuku';
import DataSiswa from './admin/DataSiswa';

// --- Komponen View (Isi Konten) ---
const DashboardHome = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ringkasan Perpustakaan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stats shadow bg-white border border-gray-100">
                <div className="stat">
                    <div className="stat-title text-gray-500">Total Buku</div>
                    <div className="stat-value text-primary">124</div>
                    <div className="stat-desc text-gray-400">2 buku baru minggu ini</div>
                </div>
            </div>
            <div className="stats shadow bg-white border border-gray-100">
                <div className="stat">
                    <div className="stat-title text-gray-500">Peminjaman Aktif</div>
                    <div className="stat-value text-secondary">45</div>
                    <div className="stat-desc text-gray-400">Harus segera kembali</div>
                </div>
            </div>
            <div className="stats shadow bg-white border border-gray-100">
                <div className="stat">
                    <div className="stat-title text-gray-500">Total Anggota</div>
                    <div className="stat-value text-accent">1,200</div>
                    <div className="stat-desc text-gray-400">Siswa terdaftar</div>
                </div>
            </div>
        </div>
    </motion.div>
);

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
        { path: '/admin/buku', name: 'Kelola Buku', icon: <Book size={20} /> },
        { path: '/admin/kategori', name: 'Kategori', icon: <Layers size={20} /> },
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

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* TOP NAVBAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-2">
                         <span className="text-gray-400 text-sm italic">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-800">Administrator</p>
                            <p className="text-[10px] text-gray-500">admin@sekolah.com</p>
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
                            <Route path="/buku" element={<KelolaBuku />} />
                            <Route path="/kategori" element={<div className="text-gray-400 italic">Halaman Kategori (Sedang dikerjakan...)</div>} />
                            <Route path="/siswa" element={<DataSiswa />} />
                            <Route path="/laporan" element={<div className="text-gray-400 italic">Halaman Laporan (Sedang dikerjakan...)</div>} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;