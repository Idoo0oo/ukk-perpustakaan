/**
 * Deskripsi File:
 * File entry point aplikasi React. Mengatur routing dan protected routes berdasarkan role (admin/peminjam).
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DashboardSiswa from './pages/DashboardSiswa';
import PinjamanSaya from './pages/PinjamanSaya';
import KoleksiSaya from './pages/KoleksiSaya';

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || (allowedRole && role !== allowedRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/peminjam" element={
                    <ProtectedRoute allowedRole="peminjam">
                        <DashboardSiswa />
                    </ProtectedRoute>
                } />

                <Route path="/peminjam/pinjaman-saya" element={
                    <ProtectedRoute allowedRole="peminjam">
                        <PinjamanSaya />
                    </ProtectedRoute>
                } />

                <Route path="/peminjam/koleksi" element={
                    <ProtectedRoute allowedRole="peminjam">
                        <KoleksiSaya />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;