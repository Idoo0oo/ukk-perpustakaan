import React from 'react';

// Konstanta base class animasi kedip dan garis neo-brutalism
const basePulse = "animate-pulse bg-gray-300 brutal-border-heavy opacity-70";

// 1. Skeleton untuk Buku Katalog (Box Model)
export const BookCardSkeleton = () => (
    <div className={`bg-white brutal-border-heavy brutal-shadow flex flex-col relative`}>
        <div className={`h-64 border-b-4 border-black ${basePulse}`}></div>
        <div className="p-6 flex-1 flex flex-col gap-4">
            <div className={`h-8 w-4/5 ${basePulse}`}></div>
            <div className={`h-4 w-1/2 ${basePulse}`}></div>
            <div className="mt-auto pt-6 border-t-4 border-black/5 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <div className={`h-3 w-12 ${basePulse}`}></div>
                    <div className={`h-8 w-8 ${basePulse}`}></div>
                </div>
                <div className={`h-12 w-28 ${basePulse}`}></div>
            </div>
        </div>
    </div>
);

// 2. Skeleton untuk Box Statistik Dashboard 
export const StatBoxSkeleton = () => (
    <div className={`bg-white brutal-border-heavy brutal-shadow p-6 flex flex-col`}>
        <div className={`w-10 h-10 mb-4 ${basePulse}`}></div>
        <div className={`h-10 w-20 mb-2 ${basePulse}`}></div>
        <div className={`h-4 w-24 ${basePulse}`}></div>
    </div>
);

// 3. Skeleton untuk List Horizontal (PinjamanSaya, KoleksiSaya)
export const ListSkeleton = () => (
    <div className="bg-white brutal-border-heavy brutal-shadow flex flex-col md:flex-row mb-6 overflow-hidden">
        <div className={`w-full md:w-56 h-72 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black shrink-0 ${basePulse}`}></div>
        <div className="p-8 md:p-10 flex-1 flex flex-col gap-6">
            <div className="flex justify-between">
                <div className={`h-6 w-24 ${basePulse}`}></div>
                <div className={`h-6 w-24 ${basePulse}`}></div>
            </div>
            <div className={`h-10 w-3/4 ${basePulse}`}></div>
            <div className="flex gap-4">
                <div className={`h-8 w-32 ${basePulse}`}></div>
                <div className={`h-8 w-32 ${basePulse}`}></div>
            </div>
            <div className={`mt-10 pt-8 border-t-4 border-black flex flex-wrap gap-4`}>
                <div className={`h-12 w-48 ${basePulse}`}></div>
                <div className={`h-12 w-48 ${basePulse}`}></div>
            </div>
        </div>
    </div>
);

// 4. Skeleton untuk Custom Tabel Admin
export const TableSkeleton = ({ rows = 5 }) => (
    <div className="bg-white brutal-border-heavy brutal-shadow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
                <thead className="bg-black text-white">
                    <tr>
                        <th className="p-4"><div className="h-4 bg-white/20 w-8"></div></th>
                        <th className="p-4"><div className="h-4 bg-white/20 w-32"></div></th>
                        <th className="p-4"><div className="h-4 bg-white/20 w-48"></div></th>
                        <th className="p-4"><div className="h-4 bg-white/20 w-24"></div></th>
                        <th className="p-4"><div className="h-4 bg-white/20 w-20"></div></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i} className="border-b-2 border-black/10">
                            <td className="p-4"><div className={`h-4 w-6 ${basePulse}`}></div></td>
                            <td className="p-4"><div className={`h-6 w-3/4 ${basePulse}`}></div></td>
                            <td className="p-4"><div className={`h-6 w-full ${basePulse}`}></div></td>
                            <td className="p-4"><div className={`h-5 w-24 ${basePulse}`}></div></td>
                            <td className="p-4 flex gap-2">
                                <div className={`h-8 w-16 ${basePulse}`}></div>
                                <div className={`h-8 w-16 ${basePulse}`}></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
