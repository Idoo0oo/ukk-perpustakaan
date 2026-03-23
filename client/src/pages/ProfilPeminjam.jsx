import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, Camera, Save, Lock, Eye, EyeOff, LogOut, 
    ArrowLeft, Mail, MapPin, AtSign 
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const API = 'http://localhost:5000/api';

const ProfilPeminjam = () => {
    usePageTitle('Profil Saya');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const fileRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    // --- Info form ---
    const [formInfo, setFormInfo] = useState({ namaLengkap: '', email: '', alamat: '' });

    // --- Password form ---
    const [formPass, setFormPass] = useState({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
    const [showPass, setShowPass] = useState({ lama: false, baru: false, konfirmasi: false });

    // --- Preview foto ---
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const headers = { Authorization: `Bearer ${token}` };

    /* ---- Fetch profil ---- */
    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API}/profile`, { headers });
            setProfile(res.data);
            setFormInfo({
                namaLengkap: res.data.NamaLengkap || '',
                email:       res.data.Email || '',
                alamat:      res.data.Alamat || '',
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    /* ---- Upload foto preview ---- */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    /* ---- Simpan foto ---- */
    const handleSavePhoto = async () => {
        if (!photoFile) return;
        setSaving(true);
        const fd = new FormData();
        fd.append('foto', photoFile);
        try {
            await axios.post(`${API}/profile/photo`, fd, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
            Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Foto Diperbarui!</span>', timer: 1500, showConfirmButton: false, customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono' } });
            setPhotoFile(null);
            fetchProfile();
        } catch (err) {
            Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
        } finally { setSaving(false); }
    };

    /* ---- Simpan info pribadi ---- */
    const handleSaveInfo = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(`${API}/profile`, formInfo, { headers });
            // Update nama di localStorage agar header ikut berubah
            localStorage.setItem('namaUser', res.data.user.NamaLengkap);
            Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Profil Diperbarui!</span>', timer: 1500, showConfirmButton: false, customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono' } });
            fetchProfile();
        } catch (err) {
            Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan.', 'error');
        } finally { setSaving(false); }
    };

    /* ---- Ganti password ---- */
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (formPass.passwordBaru !== formPass.konfirmasi) {
            return Swal.fire({ icon: 'error', title: '<span class="font-black uppercase">Password Tidak Cocok!</span>', text: 'Password baru dan konfirmasi harus sama.', customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono', confirmButton: 'bg-black text-white font-black uppercase brutal-border' } });
        }
        setSaving(true);
        try {
            await axios.put(`${API}/profile/password`, {
                passwordLama: formPass.passwordLama,
                passwordBaru: formPass.passwordBaru
            }, { headers });
            Swal.fire({ icon: 'success', title: '<span class="font-black uppercase">Password Diperbarui!</span>', timer: 1500, showConfirmButton: false, customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono' } });
            setFormPass({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
        } catch (err) {
            Swal.fire('Gagal', err.response?.data?.message || 'Password lama salah.', 'error');
        } finally { setSaving(false); }
    };

    const handleLogout = () => {
        Swal.fire({
            title: '<span class="font-black uppercase">Keluar?</span>', text: 'Sesi akan berakhir.', icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Ya, Keluar', confirmButtonColor: '#FF4081',
            customClass: { popup: 'brutal-border-heavy brutal-shadow font-mono', confirmButton: 'bg-[#FF4081] text-white font-black uppercase brutal-border brutal-shadow-sm', cancelButton: 'bg-white text-black font-black uppercase brutal-border brutal-shadow-sm' }
        }).then(r => { if (r.isConfirmed) { localStorage.clear(); navigate('/'); } });
    };

    const avatarSrc = photoPreview
        ? photoPreview
        : profile?.FotoProfil
            ? `${API.replace('/api', '')}/uploads/${profile.FotoProfil}`
            : null;

    if (loading) return (
        <div className="min-h-screen bg-[#FFFBEB] font-mono text-black">
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-32 bg-gray-300 animate-pulse brutal-border-heavy opacity-70"></div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                <div className="h-12 w-64 bg-gray-300 animate-pulse brutal-border-heavy opacity-70 mb-8"></div>
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    <div className="bg-gray-300 animate-pulse brutal-border-heavy opacity-70 h-80 md:sticky md:top-28"></div>
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-gray-300 animate-pulse brutal-border-heavy opacity-70 h-96"></div>
                        <div className="bg-gray-300 animate-pulse brutal-border-heavy opacity-70 h-80"></div>
                    </div>
                </div>
            </main>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBEB] font-mono text-black selection:bg-[#FFD600]">
            {/* Grid bg */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-10" style={{
                backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Header */}
            <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/peminjam" className="p-2 bg-white brutal-border hover:bg-[#FFD600] transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-black uppercase tracking-tighter">
                            Sastra<span className="bg-[#FFD600] px-1 border-2 border-black ml-1">.in</span>
                        </span>
                    </div>
                </div>
                <button onClick={handleLogout} className="group flex items-center gap-2 px-4 py-2 bg-white brutal-border hover:bg-[#FF4081] hover:text-white transition-colors font-black uppercase text-xs">
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10 relative z-10 space-y-8">

                {/* Page Title */}
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Akun Saya</div>
                    <h1 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <User size={32} /> Profil Saya
                    </h1>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Kelola informasi pribadi dan keamanan akunmu.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* ---- KOLOM KIRI: FOTO PROFIL ---- */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="md:sticky md:top-28 space-y-4">
                        
                        {/* Avatar */}
                        <div className="bg-white brutal-border-heavy brutal-shadow p-6 flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-32 h-32 brutal-border-heavy overflow-hidden bg-[#AEEA00] flex items-center justify-center">
                                    {avatarSrc
                                        ? <img src={avatarSrc} alt="Foto Profil" className="w-full h-full object-cover" />
                                        : <span className="text-5xl font-black">{profile?.NamaLengkap?.charAt(0)?.toUpperCase()}</span>
                                    }
                                </div>
                                <button 
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-black text-white w-9 h-9 flex items-center justify-center brutal-border hover:bg-[#FFD600] hover:text-black transition-colors"
                                    title="Ganti Foto"
                                >
                                    <Camera size={16} />
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>
                            <div className="text-center">
                                <h2 className="font-black uppercase text-lg leading-none">{profile?.NamaLengkap}</h2>
                                <p className="text-[10px] font-bold text-black/50 uppercase mt-1">@{profile?.Username}</p>
                                <span className="inline-block mt-2 bg-[#AEEA00] brutal-border px-2 py-0.5 text-[10px] font-black uppercase">
                                    {profile?.Status}
                                </span>
                            </div>
                        </div>

                        {/* Tombol simpan foto (muncul jika ada preview baru) */}
                        {photoFile && (
                            <motion.button 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                onClick={handleSavePhoto} disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#AEEA00] brutal-border-heavy brutal-shadow font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                            >
                                <Save size={18} /> Simpan Foto Ini
                            </motion.button>
                        )}

                        {/* Info card */}
                        <div className="bg-[#FFD600] brutal-border p-4 space-y-2 text-xs font-bold uppercase">
                            <div className="flex items-center gap-2"><Mail size={12} /> {profile?.Email}</div>
                            <div className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 shrink-0" /> {profile?.Alamat || '-'}</div>
                        </div>
                    </motion.div>

                    {/* ---- KOLOM KANAN: FORMS ---- */}
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="md:col-span-2 space-y-8">

                        {/* ---- FORM INFO PRIBADI ---- */}
                        <form onSubmit={handleSaveInfo} className="bg-white brutal-border-heavy brutal-shadow">
                            <div className="px-6 py-4 border-b-4 border-black bg-[#00E5FF] flex items-center gap-3">
                                <AtSign size={20} />
                                <h3 className="font-black uppercase text-lg">Informasi Pribadi</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase block mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" value={formInfo.namaLengkap}
                                        onChange={e => setFormInfo({...formInfo, namaLengkap: e.target.value})}
                                        className="w-full px-4 py-2.5 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase block mb-1">Email</label>
                                    <input 
                                        type="email" value={formInfo.email}
                                        onChange={e => setFormInfo({...formInfo, email: e.target.value})}
                                        className="w-full px-4 py-2.5 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase block mb-1">Alamat</label>
                                    <textarea 
                                        value={formInfo.alamat}
                                        onChange={e => setFormInfo({...formInfo, alamat: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-2.5 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors resize-none"
                                    />
                                </div>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-black text-white brutal-shadow font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50">
                                    <Save size={16} /> Simpan Perubahan
                                </button>
                            </div>
                        </form>

                        {/* ---- FORM GANTI PASSWORD ---- */}
                        <form onSubmit={handleChangePassword} className="bg-white brutal-border-heavy brutal-shadow">
                            <div className="px-6 py-4 border-b-4 border-black bg-[#FF4081] text-white flex items-center gap-3">
                                <Lock size={20} />
                                <h3 className="font-black uppercase text-lg">Ganti Password</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { key: 'passwordLama', label: 'Password Saat Ini', showKey: 'lama' },
                                    { key: 'passwordBaru', label: 'Password Baru (min. 6 karakter)', showKey: 'baru' },
                                    { key: 'konfirmasi', label: 'Konfirmasi Password Baru', showKey: 'konfirmasi' },
                                ].map(({ key, label, showKey }) => (
                                    <div key={key}>
                                        <label className="text-[10px] font-black uppercase block mb-1">{label}</label>
                                        <div className="relative">
                                            <input
                                                type={showPass[showKey] ? 'text' : 'password'}
                                                value={formPass[key]}
                                                onChange={e => setFormPass({...formPass, [key]: e.target.value})}
                                                className="w-full px-4 py-2.5 pr-12 brutal-border font-bold text-sm focus:outline-none focus:bg-[#AEEA00] transition-colors"
                                                required
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPass(p => ({...p, [showKey]: !p[showKey]}))}
                                                className="absolute right-3 top-2.5 text-black/40 hover:text-black"
                                            >
                                                {showPass[showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#FF4081] text-white brutal-border brutal-shadow font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50">
                                    <Lock size={16} /> Ganti Password
                                </button>
                            </div>
                        </form>

                    </motion.div>

                </div>
            </main>
        </div>
    );
};

export default ProfilPeminjam;
