import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, UserCheck, MapPin, Eye, EyeOff, BookOpen } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
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
                title: 'Berhasil!', 
                text: 'Akun terdaftar, silakan tunggu konfirmasi dari Admin.',
                confirmButtonColor: '#570df8'
            });
            navigate('/');
        } catch (err) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Registrasi Gagal', 
                text: err.response?.data?.error || 'Terjadi kesalahan sistem' 
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-indigo-100 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="card w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-3xl border border-white/50"
            >
                {/* SISI KIRI: Ilustrasi */}
                <div className="md:w-5/12 bg-violet-600 p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="relative z-10">
                        <UserPlus size={80} className="mb-6 opacity-90" />
                    </motion.div>
                    <h3 className="text-3xl font-bold relative z-10">Ayo Bergabung!</h3>
                    <p className="mt-4 text-violet-100 text-sm leading-relaxed relative z-10">
                        Daftarkan dirimu sekarang dan nikmati akses tanpa batas ke ribuan koleksi buku digital kami secara gratis.
                    </p>
                </div>

                {/* SISI KANAN: Form */}
                <div className="md:w-7/12 p-8 md:p-12">
                    {/* LOGO DI ATAS FORM */}
                    <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                         <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1.5 rounded-lg text-white shadow-md">
                             <BookOpen size={20} fill="currentColor" />
                         </div>
                         <span className="text-lg font-bold text-slate-900">Perpus<span className="text-violet-600">Digital</span>.</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center md:text-left">Buat Akun Baru</h2>
                    
                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Username</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400"><User size={16} /></span>
                                <input type="text" className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 focus:input-primary h-10 text-sm rounded-xl" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Email</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400"><Mail size={16} /></span>
                                <input type="email" className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 h-10 text-sm focus:input-primary rounded-xl" placeholder="email@gmail.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Password</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400"><Lock size={16} /></span>
                                <input type={showPassword ? "text" : "password"} className="input input-bordered w-full pl-10 pr-10 bg-gray-50 text-gray-900 h-10 text-sm focus:input-primary rounded-xl" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Nama Lengkap</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400"><UserCheck size={16} /></span>
                                <input type="text" className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 h-10 text-sm focus:input-primary rounded-xl" placeholder="Nama Lengkap" onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})} required />
                            </div>
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Alamat Lengkap</label>
                            <div className="relative">
                                <span className="absolute top-3 left-3 flex items-start z-10 pointer-events-none text-gray-400"><MapPin size={16} /></span>
                                <textarea className="textarea textarea-bordered w-full pl-10 bg-gray-50 text-gray-900 text-sm h-20 focus:textarea-primary rounded-xl" placeholder="Jl. Pendidikan No. 123..." onChange={(e) => setFormData({...formData, alamat: e.target.value})} required></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn bg-violet-600 hover:bg-violet-700 text-white md:col-span-2 mt-4 shadow-lg shadow-violet-200 hover:scale-[1.02] transition-transform rounded-xl border-none">
                            Daftar Sekarang
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Sudah punya akun? 
                        <Link to="/login" className="font-bold text-violet-600 hover:text-violet-800 ml-1">Masuk disini</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;