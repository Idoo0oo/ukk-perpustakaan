import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Printer, FileText, Calendar, RotateCcw } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';
import usePageTitle from '../../hooks/usePageTitle';

const Laporan = () => {
    usePageTitle('Laporan Perpustakaan');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async (start = dateRange.start, end = dateRange.end) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/laporan/peminjaman?startDate=${start}&endDate=${end}`, { headers: { Authorization: `Bearer ${token}` } });
            setTransactions(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil laporan:", error);
            setLoading(false);
        }
    };

    const filteredTransactions = transactions;

    const handlePrint = () => { window.print(); };

    const handleReset = () => {
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        const end = new Date().toISOString().split('T')[0];
        setDateRange({ start, end });
        fetchData(start, end);
    };

    const formatTanggalIndo = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const statusColors = {
        'Dikembalikan': 'bg-[#AEEA00]',
        'Dipinjam': 'bg-[#00E5FF]',
        'Menunggu': 'bg-[#FFD600]',
        'Ditolak': 'bg-[#FF4081] text-white',
    };

    return (
        <div className="space-y-6">
            {/* CSS untuk Print */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; font-family: monospace; }
                    table { page-break-inside: auto; width: 100%; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* --- HEADER (web only) --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 no-print">
                <div>
                    <div className="inline-block bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-2">Export</div>
                    <h2 className="text-4xl font-black uppercase leading-none tracking-tighter flex items-center gap-3">
                        <FileText size={32} /> Laporan Perpustakaan
                    </h2>
                    <p className="font-bold uppercase text-black/50 text-xs mt-2">Rekapitulasi sirkulasi perpustakaan.</p>
                </div>
                
                {/* Filter Tanggal */}
                <div className="flex flex-col md:flex-row gap-3 bg-white brutal-border-heavy brutal-shadow p-4 w-full xl:w-auto">
                    <div className="flex items-center gap-2 brutal-border px-3 py-2 bg-[#FFFBEB]">
                        <Calendar size={14} className="shrink-0" />
                        <span className="text-[10px] font-black uppercase">Dari:</span>
                        <input 
                            type="date" 
                            value={dateRange.start} 
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            className="bg-transparent text-sm font-black focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 brutal-border px-3 py-2 bg-[#FFFBEB]">
                        <Calendar size={14} className="shrink-0" />
                        <span className="text-[10px] font-black uppercase">Sampai:</span>
                        <input 
                            type="date" 
                            value={dateRange.end} 
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            className="bg-transparent text-sm font-black focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => fetchData(dateRange.start, dateRange.end)} className="px-5 py-2 bg-[#00E5FF] brutal-border text-black font-black uppercase text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                            Terapkan
                        </button>
                        <button onClick={handleReset} className="p-2 bg-white brutal-border hover:bg-[#FFD600] transition-colors" title="Reset Filter">
                            <RotateCcw size={16} />
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white font-black uppercase text-xs brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            <Printer size={16} /> Cetak
                        </button>
                    </div>
                </div>
            </div>

            {/* --- AREA CETAK --- */}
            <div id="printable-area" className="bg-white brutal-border-heavy brutal-shadow p-8">
                
                {/* KOP SURAT */}
                <div className="mb-8 text-center border-b-4 border-black pb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">
                        Sastra<span className="bg-[#FFD600] px-1 border-2 border-black">.in</span>
                    </h1>
                    <p className="font-bold uppercase text-xs text-black/60">Jl. Pendidikan No. 1, Kota Belajar, Indonesia</p>
                    <p className="font-bold uppercase text-xs text-black/60">Email: info@sastra.in | Website: www.sastra.in</p>
                </div>

                {/* Info Laporan */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase inline-block mb-2">Dokumen Resmi</div>
                        <h3 className="text-2xl font-black uppercase underline underline-offset-4 decoration-4">Laporan Sirkulasi Buku</h3>
                        <p className="text-sm font-bold uppercase text-black/70 mt-2">
                            Periode: <span className="font-black">{formatTanggalIndo(dateRange.start)}</span> s/d <span className="font-black">{formatTanggalIndo(dateRange.end)}</span>
                        </p>
                    </div>
                    <div className="text-right bg-[#FFD600] brutal-border p-3 print:bg-transparent print:border-none">
                        <p className="text-[10px] font-black uppercase">Total Data</p>
                        <p className="text-3xl font-black">{filteredTransactions.length} <span className="text-xs font-bold">Berkas</span></p>
                    </div>
                </div>

                {/* Tabel Data */}
                {loading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-mono">
                            <thead>
                                <tr className="bg-black text-white text-xs uppercase">
                                    <th className="p-3 font-black border border-black text-center w-10">No</th>
                                    <th className="p-3 font-black border border-black">Peminjam</th>
                                    <th className="p-3 font-black border border-black">Judul Buku</th>
                                    <th className="p-3 font-black border border-black text-center">Tgl Pinjam</th>
                                    <th className="p-3 font-black border border-black text-center">Tgl Kembali</th>
                                    <th className="p-3 font-black border border-black text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center font-black uppercase text-black/40">Tidak ada data pada periode ini.</td></tr>
                                ) : (
                                    filteredTransactions.map((item, index) => (
                                        <tr key={item.PeminjamanID} className="border-b-2 border-black/10 hover:bg-[#FFD600]/10 print:hover:bg-transparent">
                                            <td className="p-3 border border-black/20 text-center font-bold">{index + 1}</td>
                                            <td className="p-3 border border-black/20 font-black uppercase text-xs">{item.NamaPeminjam || item.NamaLengkap}</td>
                                            <td className="p-3 border border-black/20 font-bold text-xs">{item.JudulBuku || item.Judul}</td>
                                            <td className="p-3 border border-black/20 text-center font-bold text-xs whitespace-nowrap">{formatTanggalIndo(item.TanggalPeminjaman)}</td>
                                            <td className="p-3 border border-black/20 text-center font-bold text-xs whitespace-nowrap">{formatTanggalIndo(item.TanggalPengembalian)}</td>
                                            <td className="p-3 border border-black/20 text-center">
                                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black print:border-none print:bg-transparent ${statusColors[item.StatusPeminjaman] || 'bg-white'}`}>
                                                    {item.StatusPeminjaman}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer Tanda Tangan */}
                <div className="mt-12 flex justify-end print:flex">
                    <div className="text-center w-64">
                        <p className="text-sm font-bold uppercase text-black/70 mb-16">
                            Mengetahui,<br />Kepala Perpustakaan
                        </p>
                        <div className="border-b-4 border-black w-full"></div>
                        <p className="font-black uppercase text-xs mt-2">( _________________________ )</p>
                        <p className="text-[10px] font-bold text-black/50 mt-1 uppercase">NIP. 19850101 201001 1 001</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Laporan;