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
        
        // Simpan data ke storage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('namaUser', res.data.nama);
        localStorage.setItem('userId', res.data.userId);
        
        Swal.fire({ 
            icon: 'success', 
            title: 'Login Berhasil', 
            showConfirmButton: false, 
            timer: 1500 
        });
        
        const userRole = res.data.role;

        if (userRole === 'admin' || userRole === 'petugas') {
            navigate('/admin');
        } else if (userRole === 'peminjam') {
            navigate('/peminjam'); 
        } else {
            navigate('/');
        }

    } catch (err) {
        Swal.fire({ 
            icon: 'error', 
            title: 'Login Gagal', 
            text: err.response?.data?.message || 'Terjadi kesalahan' 
        });
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-white shadow-2xl border border-white/50 rounded-3xl"
            >
                <div className="card-body p-8">
                    <div className="flex flex-col items-center mb-8">
                        {/* --- LOGO BRANDING BARU --- */}
                        <div className="flex items-center gap-2.5 mb-6 scale-110">
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-xl shadow-violet-500/20">
                                <BookOpen size={28} fill="currentColor" className="opacity-90" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                Perpus<span className="text-violet-600">Digital</span>.
                            </span>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800">Selamat Datang Kembali</h2>
                        <p className="text-gray-500 text-sm">Masuk untuk mengakses perpustakaan</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label text-xs font-bold text-gray-600 uppercase">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <User size={18} />
                                </span>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full pl-10 focus:input-primary transition-all bg-gray-50 text-gray-900 rounded-xl" 
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold text-gray-600 uppercase">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input input-bordered w-full pl-10 pr-10 bg-gray-50 text-gray-900 focus:input-primary transition-all rounded-xl" 
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

                        <button type="submit" className="btn bg-violet-600 hover:bg-violet-700 text-white w-full mt-6 shadow-lg shadow-violet-200 border-none rounded-xl h-12 text-base">
                            <LogIn size={20} className="mr-2" /> Masuk Sekarang
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Belum punya akun? 
                        <Link to="/register" className="text-violet-600 font-bold hover:underline ml-1">Daftar di sini</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;