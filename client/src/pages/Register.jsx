import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, UserCheck, MapPin, ShieldCheck, Eye, EyeOff } from 'lucide-react';
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
                text: 'Akun terdaftar, silakan login.',
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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-base-100 to-secondary/20 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="card w-full max-w-3xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
            >
                {/* SISI KIRI: Ilustrasi / Info */}
                <div className="md:w-1/3 bg-primary p-8 text-white flex flex-col justify-center items-center text-center">
                    <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <UserPlus size={70} className="mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold">Ayo Bergabung!</h3>
                    <p className="mt-2 text-primary-content/80 text-sm">
                        Satu akun untuk akses ke ribuan koleksi buku digital kami.
                    </p>
                </div>

                {/* SISI KANAN: Form */}
                <div className="md:w-2/3 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Buat Akun Baru</h2>
                    
                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Username</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <User size={16} />
                                </span>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 focus:input-primary h-10 text-sm" 
                                    placeholder="Username"
                                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Email</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input 
                                    type="email" 
                                    className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 h-10 text-sm" 
                                    placeholder="email@gmail.com"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Password</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input input-bordered w-full pl-10 pr-10 bg-gray-50 text-gray-900 h-10 text-sm focus:input-primary" 
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Nama Lengkap */}
                        <div className="form-control">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Nama Lengkap</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <UserCheck size={16} />
                                </span>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full pl-10 bg-gray-50 text-gray-900 h-10 text-sm" 
                                    placeholder="Nama Sesuai KTP"
                                    onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="form-control md:col-span-2">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Alamat Lengkap</label>
                            <div className="relative">
                                <span className="absolute top-3 left-3 flex items-start z-10 pointer-events-none text-gray-400">
                                    <MapPin size={16} />
                                </span>
                                <textarea 
                                    className="textarea textarea-bordered w-full pl-10 bg-gray-50 text-gray-900 text-sm h-20 focus:textarea-primary" 
                                    placeholder="Jl. Perpus No. 123..."
                                    onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                                    required 
                                ></textarea>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="form-control md:col-span-2">
                            <label className="label py-1 text-xs font-bold uppercase text-gray-500">Mendaftar Sebagai</label>
                            <div className="relative flex items-center">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none text-gray-400">
                                    <ShieldCheck size={16} />
                                </span>
                                <select 
                                    className="select select-bordered w-full pl-10 bg-gray-50 text-gray-900 h-10 min-h-0 text-sm focus:select-primary"
                                    value={formData.role} 
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="peminjam">Peminjam (Siswa)</option>
                                    <option value="petugas">Petugas</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary md:col-span-2 mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Daftar Sekarang
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Sudah punya akun? 
                        <Link to="/" className="text-primary font-bold hover:underline ml-1">Masuk di sini</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;