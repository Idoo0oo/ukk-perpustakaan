import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            
            Swal.fire({ icon: 'success', title: 'Login Berhasil', showConfirmButton: false, timer: 1500 });
            
            if (res.data.role === 'admin' || res.data.role === 'petugas') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login Gagal', text: err.response?.data?.message || 'Terjadi kesalahan' });
        }
    };

    return (
        // Menggunakan bg-linear-to-br (Tailwind v4) untuk background konsisten
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-base-100 to-secondary/20 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-white shadow-2xl border border-gray-100"
            >
                <div className="card-body p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                            <BookOpen size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
                        <p className="text-gray-500">Masuk ke Perpustakaan Digital</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label text-sm font-semibold text-gray-600">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <User size={18} />
                                </span>
                                {/* Tambahkan text-gray-900 agar warna tulisan hitam pekat */}
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full pl-10 focus:input-primary transition-all bg-gray-50 text-gray-900" 
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-sm font-semibold text-gray-600">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input input-bordered w-full pl-10 pr-10 bg-gray-50 text-gray-900 focus:input-primary transition-all" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-primary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-6 shadow-lg shadow-primary/20">
                            <LogIn size={20} className="mr-2" /> Masuk Sekarang
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Belum punya akun? 
                        <Link to="/register" className="text-primary font-bold hover:underline ml-1">Daftar di sini</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;