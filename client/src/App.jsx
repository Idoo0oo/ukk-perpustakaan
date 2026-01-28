import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Semua Halaman
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DashboardSiswa from './pages/DashboardSiswa';
import PinjamanSaya from './pages/PinjamanSaya'; // Pastikan ini di-import!

// Komponen Pelindung Route (Cek Login & Role)
const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Jika tidak ada token atau role tidak sesuai, tendang ke Login
    if (!token || (allowedRole && role !== allowedRole)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Route Publik */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* --- AREA ADMIN --- */}
                {/* Menggunakan /* karena di dalam AdminDashboard ada sub-routing sendiri */}
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* --- AREA SISWA (PEMINJAM) --- */}
                
                {/* 1. Halaman Utama (Katalog Buku) */}
                <Route path="/peminjam" element={
                    <ProtectedRoute allowedRole="peminjam">
                        <DashboardSiswa />
                    </ProtectedRoute>
                } />

                {/* 2. Halaman Pinjaman Saya */}
                <Route path="/peminjam/pinjaman-saya" element={
                    <ProtectedRoute allowedRole="peminjam">
                        <PinjamanSaya />
                    </ProtectedRoute>
                } />

                {/* Route Fallback (Jika halaman tidak ditemukan, kembali ke login) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;