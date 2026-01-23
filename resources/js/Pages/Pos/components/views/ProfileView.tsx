import React from 'react';
import { Banknote, Clock } from 'lucide-react';

export default function ProfileView() {
    return (
        <div className="flex-1 overflow-y-auto pr-2 pb-4 -mr-2 custom-scrollbar-light animate-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Budi" className="w-full h-full rounded-full object-cover bg-slate-100" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Budi Santoso</h2>
                            <p className="text-slate-500 font-medium">Kasir • ID: KSR-009</p>
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl p-6 shadow-sm flex flex-col justify-center gap-4">
                    <div className="flex justify-between items-center">
                        <div className="text-slate-500 text-sm font-medium">Total Penjualan Hari Ini</div>
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Banknote size={18} /></div>
                    </div>
                    <div className="text-3xl font-mono font-bold text-slate-800">Rp 4.250.000</div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Target: Rp 6.000.000</span>
                        <span>70%</span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl p-6 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-slate-400" /> Informasi Shift
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/50 rounded-2xl border border-gray-200">
                            <div className="text-xs text-slate-500 mb-1">Jam Masuk</div>
                            <div className="font-bold text-lg text-slate-800">08:00 WIB</div>
                        </div>
                        <div className="p-4 bg-white/50 rounded-2xl border border-gray-200">
                            <div className="text-xs text-slate-500 mb-1">Durasi Kerja</div>
                            <div className="font-bold text-lg text-slate-800">4h 30m</div>
                        </div>
                        <div className="p-4 bg-white/50 rounded-2xl border border-gray-200">
                            <div className="text-xs text-slate-500 mb-1">Transaksi</div>
                            <div className="font-bold text-lg text-slate-800">24 Struk</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
