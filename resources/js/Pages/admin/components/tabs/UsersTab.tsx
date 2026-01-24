/**
 * Staff management tab for supervisors.
 */

import React from 'react';
import { CheckCircle, Edit, Lock, Plus, Trash2, User } from 'lucide-react';
import type { StaffMember } from '../../types';

type UsersTabProps = {
    staff: StaffMember[];
};

export default function UsersTab({ staff }: UsersTabProps) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Daftar Pengguna</h3>
                    <p className="text-xs text-slate-500">Kelola akses Kasir dan Supervisor.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                    <Plus size={18} /> Tambah Staf Baru
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {staff.map(user => (
                    <div key={user.id} className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[2rem] p-6 shadow-sm relative group hover:bg-white/70 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${user.role === 'SUPERVISOR' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                <User size={24} />
                            </div>
                            <div className={`px-3 py-1 text-[10px] font-bold rounded-full border ${user.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                                }`}>
                                {user.status === 'ACTIVE' ? 'AKTIF' : 'NON-AKTIF'}
                            </div>
                        </div>

                        <h4 className="font-bold text-lg text-slate-800">{user.name}</h4>
                        <p className="text-sm text-slate-500 mb-4">@{user.username} • {user.role}</p>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
                            <CheckCircle size={12} /> Login Terakhir: {user.lastLogin}
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Lock size={14} /> Reset PIN
                            </button>
                            <button className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                <Edit size={16} />
                            </button>
                            <button className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
