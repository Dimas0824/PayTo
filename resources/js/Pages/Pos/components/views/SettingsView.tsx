import React from 'react';
import { Database, Printer, RefreshCw, Smartphone, Trash2 } from 'lucide-react';

export default function SettingsView() {
    return (
        <div className="flex-1 overflow-y-auto pr-2 pb-4 -mr-2 custom-scrollbar-light animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-6">
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Perangkat Keras</h3>
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-white/40 flex items-center justify-between hover:bg-white/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <Printer size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Printer Thermal</div>
                                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Terhubung (Epson TM-T82)
                                    </div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50">
                                Test Print
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Barcode Scanner</div>
                                    <div className="text-xs text-slate-400">Mode HID (Keyboard)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Aktif</span>
                                <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Data & Sinkronisasi</h3>
                    <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-white/40 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Penyimpanan Offline</div>
                                    <div className="text-xs text-slate-500">24 Transaksi belum tersinkron</div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                                <RefreshCw size={14} /> Force Sync
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Hapus Cache Lokal</div>
                                    <div className="text-xs text-slate-500">Gunakan jika aplikasi terasa lambat</div>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors">
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </section>

                <div className="text-center pt-4 pb-8">
                    <div className="text-xs font-bold text-slate-400">POS System v2.0.1 (Build 20260120)</div>
                    <div className="text-[10px] text-slate-300 mt-1">Licensed to Toko Cabang Pusat</div>
                </div>
            </div>
        </div>
    );
}
