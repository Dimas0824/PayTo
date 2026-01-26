/**
 * Dashboard tab with stats, chart mock, and activity list.
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import StatCard from '../StatCard';

export default function DashboardTab() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Penjualan (Net)"
                    value="Rp 4.250.000"
                    subtext="dibanding kemarin"
                    trend="up"
                    trendVal="12.5%"
                />
                <StatCard
                    title="Total Transaksi"
                    value="48"
                    subtext="struk tercetak"
                    trend="up"
                    trendVal="8"
                />
                <StatCard
                    title="Butuh Restock"
                    value="3 Item"
                    subtext="stok kritis (< safety stock)"
                    trend="down"
                    trendVal="Alert"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm min-h-[300px] lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Trend Penjualan (7 Hari)</h3>
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Lihat Detail</button>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-4 px-4">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-100 rounded-t-xl relative group">
                                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl transition-all group-hover:bg-indigo-600"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
                        <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm lg:col-span-1">
                    <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terkini</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Pembayaran #INV-204{9 - i}</p>
                                    <p className="text-xs text-slate-500">Rp 125.000 • Cash • Kasir 1</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Baru saja</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
