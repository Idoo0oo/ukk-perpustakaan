import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Printer, FileText, Calendar, Filter, RotateCcw } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const Laporan = () => {
    usePageTitle('Laporan Perpustakaan');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk Filter Tanggal (Default: Tanggal 1 bulan ini s/d Hari ini)
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/peminjaman', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Urutkan dari yang terbaru
            const sortedData = res.data.sort((a, b) => new Date(b.TanggalPeminjaman) - new Date(a.TanggalPeminjaman));
            setTransactions(sortedData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // --- LOGIKA FILTERING ---
    const filteredTransactions = transactions.filter(item => {
        // Ambil bagian tanggal saja (YYYY-MM-DD) dari data
        const tglPinjam = new Date(item.TanggalPeminjaman).toISOString().split('T')[0];
        return tglPinjam >= dateRange.start && tglPinjam <= dateRange.end;
    });

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        setDateRange({
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
        });
    };

    // Helper format tanggal indo
    const formatTanggalIndo = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
            {/* --- CSS KHUSUS PRINT --- */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-area, #printable-area * { visibility: visible; }
                    #printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
                    .no-print-style { box-shadow: none !important; border: none !important; }
                    table { page-break-inside: auto; width: 100%; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    /* Sembunyikan elemen filter saat print */
                    .no-print { display: none !important; }
                }
            `}</style>

            {/* --- HEADER HALAMAN (WEB ONLY) --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="text-indigo-600" /> Laporan Perpustakaan
                    </h2>
                    <p className="text-gray-500 text-sm">Rekapitulasi sirkulasi perpustakaan.</p>
                </div>
                
                {/* --- INPUT FILTER TANGGAL --- */}
                <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-full xl:w-auto">
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50">
                        <Calendar size={16} className="text-gray-400"/>
                        <span className="text-xs font-bold text-gray-500">Dari:</span>
                        <input 
                            type="date" 
                            value={dateRange.start} 
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            className="bg-transparent text-sm font-medium focus:outline-none text-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50">
                        <Calendar size={16} className="text-gray-400"/>
                        <span className="text-xs font-bold text-gray-500">Sampai:</span>
                        <input 
                            type="date" 
                            value={dateRange.end} 
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            className="bg-transparent text-sm font-medium focus:outline-none text-gray-700"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleReset} className="btn btn-square btn-ghost btn-sm border border-gray-200 text-gray-500" title="Reset Filter">
                            <RotateCcw size={16} />
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="btn bg-indigo-600 hover:bg-indigo-700 text-white btn-sm px-4 gap-2 border-none"
                        >
                            <Printer size={16} /> Cetak
                        </button>
                    </div>
                </div>
            </div>

            {/* --- AREA YANG AKAN DICETAK --- */}
            <div id="printable-area" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 no-print-style">
                
                {/* 1. KOP SURAT */}
                <div className="mb-8 text-center border-b-2 border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">Perpustakaan Digital Sekolah</h1>
                    <p className="text-gray-600 text-sm">Jl. Pendidikan No. 1, Kota Belajar, Indonesia | Telp: (021) 123-4567</p>
                    <p className="text-gray-600 text-sm">Email: info@perpussekolah.sch.id | Website: www.perpussekolah.sch.id</p>
                </div>

                {/* 2. Info Laporan Dinamis */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 uppercase underline decoration-2 underline-offset-4">Laporan Sirkulasi Buku</h3>
                        {/* TANGGAL PERIODE SESUAI FILTER */}
                        <p className="text-sm text-gray-700 mt-2 font-medium">
                            Periode: <span className="font-bold">{formatTanggalIndo(dateRange.start)}</span> s/d <span className="font-bold">{formatTanggalIndo(dateRange.end)}</span>
                        </p>
                    </div>
                    <div className="text-right bg-gray-50 p-3 rounded-lg border border-gray-200 print:bg-transparent print:border-none">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Data</p>
                        {/* JUMLAH DATA SESUAI FILTER */}
                        <p className="text-xl font-bold text-indigo-600 print:text-black">{filteredTransactions.length} <span className="text-sm font-normal text-gray-500">Berkas</span></p>
                    </div>
                </div>

                {/* 3. Tabel Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider border-y-2 border-gray-300 print:bg-gray-200 print:text-black">
                                <th className="p-3 font-bold border-x border-gray-200 text-center w-10">No</th>
                                <th className="p-3 font-bold border-x border-gray-200">Siswa</th>
                                <th className="p-3 font-bold border-x border-gray-200">Judul Buku</th>
                                <th className="p-3 font-bold border-x border-gray-200 text-center">Tgl Pinjam</th>
                                <th className="p-3 font-bold border-x border-gray-200 text-center">Tgl Kembali</th>
                                <th className="p-3 font-bold border-x border-gray-200 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center">Memuat data...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center italic text-gray-400">Tidak ada data pada periode ini.</td></tr>
                            ) : (
                                // LOOPING DATA YANG SUDAH DIFILTER
                                filteredTransactions.map((item, index) => (
                                    <tr key={item.PeminjamanID} className="border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent">
                                        <td className="p-3 border-x border-gray-200 text-center">{index + 1}</td>
                                        <td className="p-3 border-x border-gray-200 font-semibold">{item.NamaPeminjam || item.NamaLengkap}</td>
                                        <td className="p-3 border-x border-gray-200 italic">{item.JudulBuku || item.Judul}</td>
                                        <td className="p-3 border-x border-gray-200 text-center whitespace-nowrap">
                                            {formatTanggalIndo(item.TanggalPeminjaman)}
                                        </td>
                                        <td className="p-3 border-x border-gray-200 text-center whitespace-nowrap">
                                            {formatTanggalIndo(item.TanggalPengembalian)}
                                        </td>
                                        <td className="p-3 border-x border-gray-200 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border print:border-none print:px-0 
                                                ${item.StatusPeminjaman === 'Dikembalikan' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 print:text-black print:bg-transparent' : 
                                                  item.StatusPeminjaman === 'Dipinjam' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 print:text-black print:bg-transparent' : 
                                                  'bg-gray-100 text-gray-600 border-gray-200 print:text-black print:bg-transparent'}`}>
                                                {item.StatusPeminjaman}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. Footer Tanda Tangan */}
                <div className="mt-12 flex justify-end print:flex break-inside-avoid">
                    <div className="text-center w-64">
                        <p className="text-sm text-gray-600 mb-16">
                            Mengetahui,<br/>Kepala Perpustakaan
                        </p>
                        <p className="font-bold underline decoration-dotted text-gray-800">( ....................................... )</p>
                        <p className="text-xs text-gray-500 mt-1">NIP. 19850101 201001 1 001</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Laporan;