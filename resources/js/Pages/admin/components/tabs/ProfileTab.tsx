/**
 * Profile tab showing supervisor info and security actions.
 */

import React from 'react';
import { Edit, Mail, Phone, Clock, ShieldCheck, FileText, Key, Lock } from 'lucide-react';
import type { AdminProfile } from '../../types';

type ProfileTabProps = {
    profile: AdminProfile;
};

export default function ProfileTab({ profile }: ProfileTabProps) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full blur-[80px] opacity-40 -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full p-1 bg-white shadow-xl shadow-indigo-100 relative group cursor-pointer">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor" alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-50" />
                        <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit size={16} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">{profile.name}</h2>
                                <p className="text-slate-500 font-medium text-lg">{profile.role} • {profile.id}</p>
                            </div>
                            <div className="text-right">
                                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Akun Aktif
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Login terakhir: {profile.lastLogin}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                <Mail size={16} className="text-indigo-500" /> {profile.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                <Phone size={16} className="text-indigo-500" /> {profile.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                <Clock size={16} className="text-indigo-500" /> Bergabung: {profile.joinDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-slate-400" /> Keamanan Akun
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-2xl border border-white/50">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="font-bold text-sm text-slate-700">PIN Approval Supervisor</div>
                                    <div className="text-xs text-slate-500">Digunakan untuk otorisasi void/diskon kasir</div>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <Key size={20} />
                                </div>
                            </div>
                            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md">
                                Ganti PIN (6 Digit)
                            </button>
                        </div>

                        <div className="p-4 bg-white/50 rounded-2xl border border-white/50">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="font-bold text-sm text-slate-700">Password Login</div>
                                    <div className="text-xs text-slate-500">Terakhir diganti: 3 bulan lalu</div>
                                </div>
                                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                                    <Lock size={20} />
                                </div>
                            </div>
                            <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-all">
                                Ubah Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-slate-400" /> Aktivitas Anda
                    </h3>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start p-3 hover:bg-white/30 rounded-xl transition-colors">
                                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Melakukan Stock Opname (Kopi Susu)</p>
                                    <p className="text-xs text-slate-400">Hari ini, 10:30 WIB • via Inventory</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 items-start p-3 hover:bg-white/30 rounded-xl transition-colors">
                            <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">Mengubah Template Struk</p>
                                <p className="text-xs text-slate-400">Kemarin, 16:45 WIB • via Settings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
