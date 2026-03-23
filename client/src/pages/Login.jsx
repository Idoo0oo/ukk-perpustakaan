/**
 * Deskripsi File:
 * Halaman login dengan validasi role dan redirect otomatis ke dashboard sesuai role.
 * Mendukung show/hide password dan status account activation check.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
    usePageTitle('Masuk');
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
                title: '<span class="font-black uppercase">Login Berhasil!</span>',
                showConfirmButton: false,
                timer: 1500,
                customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono bg-[#AEEA00]' }
            });

            const userRole = res.data.role;

            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'peminjam') {
                navigate('/peminjam');
            } else {
                navigate('/');
            }

        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.errors) {
                const errorMsg = err.response.data.errors.map(e => `• ${e.message}`).join('<br/>');
                Swal.fire({
                    icon: 'error',
                    title: '<span class="font-black uppercase text-sm">Validasi Gagal</span>',
                    html: `<div class="text-left font-bold text-xs font-mono mt-2">${errorMsg}</div>`,
                    customClass: { popup: 'brutal-border-heavy brutal-shadow' }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '<span class="font-black uppercase">Login Gagal</span>',
                    html: `<div class="font-bold uppercase text-xs">${err.response?.data?.message || err.response?.data?.error || 'Terjadi kesalahan sistem'}</div>`,
                    confirmButtonText: 'COBA LAGI',
                    customClass: { 
                        popup: 'brutal-border-heavy brutal-shadow font-mono',
                        confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow py-2 px-6' 
                    }
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBEB] font-mono text-black selection:bg-[#FFD600] selection:text-black flex items-center justify-center p-4 relative overflow-hidden">

            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                /* PENTING: overflow-hidden dihapus agar badge bisa keluar border */
                className="relative z-10 w-full max-sm:max-w-[320px] max-w-sm bg-white brutal-border-heavy brutal-shadow p-6 md:p-8"
            >
                {/* Bumper Badge - Dipaksa keluar dengan nilai negatif & shadow tebal */}
                <div className="absolute -top-5 -left-5 bg-[#00E5FF] brutal-border px-3 py-1 text-black font-black text-[10px] uppercase -rotate-6 z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                    AYO BACA BUKU
                </div>
                <div className="flex flex-col items-center mb-6">
                    <Link to="/" className="flex items-center gap-0 mb-4 group scale-90">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-14 h-14 object-contain group-hover:rotate-12 transition-transform"
                        />
                        <span className="text-2xl font-black uppercase tracking-tighter -ml-2">
                            Sastra<span className="bg-[#FFD600] px-1 border-2 border-black">.in</span>
                        </span>
                    </Link>

                    <h2 className="text-2xl font-black text-black uppercase tracking-tight text-center">Selamat Datang</h2>
                    <p className="text-black/60 font-bold uppercase text-[10px] mt-1">Masuk untuk mengakses perpustakaan</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-black uppercase block">Username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black">
                                <User size={16} strokeWidth={3} />
                            </span>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-white brutal-border font-bold text-sm text-black focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30"
                                placeholder="USERNAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-black uppercase block">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black">
                                <Lock size={16} strokeWidth={3} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-3 bg-white brutal-border font-bold text-sm text-black focus:outline-none focus:bg-[#FF4081] focus:text-white transition-colors placeholder:text-black/30 placeholder:focus:text-white/50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-black hover:scale-110 transition-transform"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#AEEA00] brutal-border-heavy brutal-shadow py-3 text-lg font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} strokeWidth={3} /> Masuk Sekarang
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t-2 border-black text-center">
                    <p className="font-bold uppercase text-[10px]">
                        Belum punya akun? <br />
                        <Link to="/register" className="bg-[#FFD600] px-2 brutal-border mt-1 inline-block hover:bg-black hover:text-white transition-colors">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;