import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Halaman (Nanti kita buat filenya satu-satu)
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SiswaDashboard from './pages/SiswaDashboard';

// Komponen Proteksi Halaman (Opsional tapi bagus untuk nilai UKK)
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur Umum */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Sesuai Flowmap: Daftar Anggota [cite: 51] */}

        {/* Jalur Admin [cite: 45] */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Jalur Siswa [cite: 55] */}
        <Route 
          path="/siswa/*" 
          element={
            <ProtectedRoute roleRequired="siswa">
              <SiswaDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirect otomatis jika ke halaman kosong */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;