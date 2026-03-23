/**
 * Deskripsi File:
 * Halaman registrasi pengguna baru dengan form multi-kolom dan validasi.
 * Status akun default 'Menunggu' untuk approval admin.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, UserCheck, MapPin, Eye, EyeOff, BookOpen, Star } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import usePageTitle from '../hooks/usePageTitle';

const Register = () => {
    usePageTitle('Daftar');
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', namaLengkap: '', alamat: '', role: 'peminjam'
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            Swal.fire({
                icon: 'success',
                title: '<span class="font-black uppercase">Berhasil!</span>',
                html: '<div class="font-bold text-xs uppercase">Akun terdaftar, silakan tunggu konfirmasi Admin.</div>',
                confirmButtonText: 'BAIKLAH',
                customClass: { 
                    popup: 'brutal-border-heavy brutal-shadow font-mono',
                    confirmButton: 'bg-[#AEEA00] text-black font-black uppercase brutal-border brutal-shadow py-2 px-6' 
                }
            });
            navigate('/');
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
                    title: '<span class="font-black uppercase">Registrasi Gagal</span>',
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

            {/* MAIN CARD CONTAINER */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                /* PENTING: overflow-hidden dihapus agar badge bisa keluar border */
                className="relative z-10 w-full max-w-3xl bg-white brutal-border-heavy brutal-shadow flex flex-col md:flex-row"
            >
                {/* LEFT SIDE - DECORATIVE (PINK) */}
                <div className="md:w-1/3 bg-[#FF4081] p-6 text-white flex flex-col justify-center items-center text-center relative border-b-4 md:border-b-0 md:border-r-4 border-black overflow-visible">
                    
                    {/* Bumper Badge - Dipaksa keluar dengan nilai negatif & shadow tebal */}
                    <div className="absolute -top-5 -left-5 bg-[#AEEA00] brutal-border px-3 py-1 text-black font-black text-[10px] uppercase -rotate-6 z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                        AKSES GRATIS
                    </div>

                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="bg-white brutal-border-heavy p-4 brutal-shadow mb-6"
                    >
                        <UserPlus size={48} className="text-black" strokeWidth={3} />
                    </motion.div>
                    
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-[0.9] mb-3">Ayo <br /> Bergabung!</h3>
                    <p className="text-white font-bold uppercase text-[10px] leading-relaxed max-w-[150px]">
                        Daftarkan dirimu dan nikmati akses ribuan buku secara gratis selamanya.
                    </p>
                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="md:w-2/3 p-6 md:p-8 bg-white">
                    <div className="flex flex-col items-center md:items-start mb-6">
                        <Link to="/" className="flex items-center gap-0 mb-4 group scale-75 md:scale-90 origin-left">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform" />
                            <span className="text-xl font-black uppercase tracking-tighter -ml-2">Sastra<span className="bg-[#FFD600] px-1 border-2 border-black">.in</span></span>
                        </Link>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Buat Akun Baru</h2>
                    </div>

                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* USERNAME */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black uppercase block">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black"><User size={14} strokeWidth={3} /></span>
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 bg-white brutal-border font-bold text-xs text-black focus:outline-none focus:bg-[#00E5FF] transition-colors placeholder:text-black/30"
                                    placeholder="USERNAME"
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black uppercase block">Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black"><Mail size={14} strokeWidth={3} /></span>
                                <input
                                    type="email"
                                    className="w-full pl-9 pr-3 py-2 bg-white brutal-border font-bold text-xs text-black focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30"
                                    placeholder="EMAIL@GMAIL.COM"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black uppercase block">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black"><Lock size={14} strokeWidth={3} /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-9 pr-9 py-2 bg-white brutal-border font-bold text-xs text-black focus:outline-none focus:bg-[#FFD600] transition-colors placeholder:text-black/30"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-2 flex items-center z-20 text-black hover:scale-110 transition-transform" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={14} strokeWidth={3} /> : <Eye size={14} strokeWidth={3} />}
                                </button>
                            </div>
                        </div>

                        {/* NAMA LENGKAP */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black uppercase block">Nama Lengkap</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-black"><UserCheck size={14} strokeWidth={3} /></span>
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 bg-white brutal-border font-bold text-xs text-black focus:outline-none focus:bg-[#AEEA00] transition-colors placeholder:text-black/30"
                                    placeholder="NAMA LENGKAP"
                                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* ALAMAT */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-black uppercase block">Alamat Lengkap</label>
                            <div className="relative">
                                <span className="absolute top-2.5 left-3 flex items-start z-10 pointer-events-none text-black"><MapPin size={14} strokeWidth={3} /></span>
                                <textarea
                                    className="w-full pl-9 pr-3 py-2 bg-white brutal-border font-bold text-xs text-black focus:outline-none focus:bg-[#00E5FF] transition-colors h-16 placeholder:text-black/30"
                                    placeholder="JL. PENDIDIKAN NO. 123..."
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="md:col-span-2 bg-[#AEEA00] brutal-border-heavy brutal-shadow py-3 text-lg font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            Daftar Sekarang
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t-2 border-black text-center md:text-left">
                        <p className="font-bold uppercase text-[10px] text-black/60">
                            Sudah punya akun?
                            <Link to="/login" className="bg-[#FFD600] text-black px-2 brutal-border font-black ml-2 hover:bg-black hover:text-white transition-colors">
                                Masuk disini
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;