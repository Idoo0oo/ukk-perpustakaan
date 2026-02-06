import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Printer, Search, Calendar, Filter, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const Laporan = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const token = localStorage.getItem('token');

    // Helper: Format Tanggal Indonesia
    const formatDateIndo = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: localeId });
    };

    // Helper: Format Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Fungsi Ambil Data
    const handleFilter = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        
        setLoading(true);
        setHasSearched(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/laporan/peminjaman`, {
                params: { startDate, endDate },
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi Cetak
    const handlePrint = () => {
        window.print();
    };

    // Hitung Ringkasan
    const totalDenda = data.reduce((acc, curr) => acc + (Number(curr.Denda) || 0), 0);
    const totalTransaksi = data.length;

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 font-sans">
            {/* HEADER HALAMAN */}
            <div className="print:hidden mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-indigo-600" size={28} /> 
                        Laporan Peminjaman
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Rekapitulasi data peminjaman perpustakaan.</p>
                </div>
            </div>

            {/* CARD FILTER (INPUT TANGGAL) */}
            <div className="print:hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleFilter}>
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="w-full md:w-auto flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500"/> Dari Tanggal
                            </label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="hidden md:block pb-3 text-gray-300">
                            <ArrowRightIcon />
                        </div>

                        <div className="w-full md:w-auto flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500"/> Sampai Tanggal
                            </label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full md:w-auto flex gap-3">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="btn flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl h-[46px] px-6 gap-2 shadow-lg shadow-indigo-200"
                            >
                                {loading ? <span className="loading loading-spinner loading-sm"></span> : <Filter size={18} />}
                                Tampilkan Data
                            </button>
                            
                            {data.length > 0 && (
                                <button 
                                    type="button"
                                    onClick={handlePrint}
                                    className="btn flex-1 md:flex-none btn-outline border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl h-[46px] gap-2"
                                >
                                    <Printer size={18} /> Cetak Laporan
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* AREA HASIL LAPORAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] print:shadow-none print:border-none">
                
                {/* KOP SURAT (Hanya Tampil Saat Print) */}
                <div className="hidden print:block p-8 pb-0 text-center border-b-2 border-gray-800 mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Perpustakaan Digital Sekolah</h1>
                    <p className="text-gray-600 text-sm mt-1">Jl. Pendidikan No. 1, Kota Belajar, Indonesia</p>
                    <div className="mt-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-semibold">
                        Laporan Periode: {formatDateIndo(startDate)} s/d {formatDateIndo(endDate)}
                    </div>
                </div>

                {!hasSearched ? (
                    // State: Belum Cari Data
                    <div className="flex flex-col items-center justify-center py-20 text-center print:hidden">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Menunggu Input Tanggal</h3>
                        <p className="text-gray-500 max-w-sm mt-2">Silakan pilih rentang tanggal di atas untuk melihat laporan transaksi peminjaman.</p>
                    </div>
                ) : data.length === 0 ? (
                    // State: Data Kosong
                    <div className="flex flex-col items-center justify-center py-20 text-center print:hidden">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} className="text-orange-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Tidak Ada Data Ditemukan</h3>
                        <p className="text-gray-500">Tidak ada transaksi peminjaman pada periode tanggal tersebut.</p>
                    </div>
                ) : (
                    // State: Ada Data
                    <div className="p-0 print:p-8">
                        {/* RINGKASAN DATA (Statistik Kecil) */}
                        <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-100 print:hidden bg-gray-50/50">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{totalTransaksi} <span className="text-sm font-normal text-gray-400">Peminjaman</span></p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Pendapatan Denda</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatRupiah(totalDenda)}</p>
                            </div>
                        </div>

                        {/* TABEL DATA */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider print:bg-gray-200 print:text-black">
                                    <tr>
                                        <th className="p-5 border-b border-gray-200 w-16 text-center">No</th>
                                        <th className="p-5 border-b border-gray-200">Siswa Peminjam</th>
                                        <th className="p-5 border-b border-gray-200">Judul Buku</th>
                                        <th className="p-5 border-b border-gray-200">Tgl Pinjam</th>
                                        <th className="p-5 border-b border-gray-200">Tgl Kembali</th>
                                        <th className="p-5 border-b border-gray-200 text-center">Status</th>
                                        <th className="p-5 border-b border-gray-200 text-right">Denda</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                    {data.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors print:border-b print:border-gray-300">
                                            <td className="p-5 text-center font-medium text-gray-400 print:text-black">{index + 1}</td>
                                            <td className="p-5 font-bold text-gray-800 print:text-black">{item.NamaPeminjam}</td>
                                            <td className="p-5 italic text-gray-600 print:text-black">{item.JudulBuku}</td>
                                            <td className="p-5 whitespace-nowrap">{formatDateIndo(item.TanggalPeminjaman)}</td>
                                            <td className="p-5 whitespace-nowrap">
                                                {item.TanggalPengembalian ? formatDateIndo(item.TanggalPengembalian) : '-'}
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border print:border-none ${
                                                    item.StatusPeminjaman === 'Dikembalikan' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 print:text-black print:bg-transparent' 
                                                        : item.StatusPeminjaman === 'Dipinjam'
                                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100 print:text-black print:bg-transparent'
                                                        : 'bg-orange-50 text-orange-700 border-orange-100 print:text-black print:bg-transparent'
                                                }`}>
                                                    {item.StatusPeminjaman}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right font-mono font-medium">
                                                {item.Denda > 0 ? (
                                                    <span className="text-red-600 print:text-black">{formatRupiah(item.Denda)}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* AREA TANDA TANGAN (Print Only) */}
                        <div className="hidden print:flex justify-end mt-16 pr-10">
                            <div className="text-center">
                                <p className="mb-20">Kota Belajar, {formatDateIndo(new Date())}</p>
                                <p className="font-bold underline">Raffael Aditya</p>
                                <p className="text-sm">Kepala Perpustakaan</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Print Styles */}
            <style>{`
                @media print {
                    @page { size: landscape; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    nav, aside, .print\\:hidden { display: none !important; }
                    /* Paksa Background Warna Tercetak */
                    .bg-gray-100 { background-color: #f3f4f6 !important; }
                }
            `}</style>
        </div>
    );
};

// Ikon Panah Sederhana
const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default Laporan;