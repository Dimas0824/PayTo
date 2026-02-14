/**
 * Notifications dropdown panel for admin header.
 */

import React from 'react';
import { AlertTriangle, BellRing, CheckCircle } from 'lucide-react';
import type { Notification } from '../types';

type NotificationDropdownProps = {
    notifications: Notification[];
};

export default function NotificationDropdown({ notifications }: NotificationDropdownProps) {
    return (
        <div className="absolute top-full right-0 mt-3 w-[min(20rem,calc(100vw-1rem))] sm:w-80 bg-white/95 backdrop-blur-xl border border-white/70 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
            <div className="px-4 py-2 flex justify-between items-center border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-800">Notifikasi</h4>
                <button className="text-[10px] text-indigo-600 font-bold hover:underline">Tandai Dibaca</button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto custom-scrollbar-light">
                {notifications.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 text-center">
                        Tidak ada notifikasi baru.
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className={`p-3 border-b border-slate-50 hover:bg-white/50 transition-colors flex gap-3 ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${notif.type === 'ALERT' ? 'bg-rose-100 text-rose-600' :
                                notif.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                {notif.type === 'ALERT' ? <AlertTriangle size={14} /> :
                                    notif.type === 'SUCCESS' ? <CheckCircle size={14} /> :
                                        <BellRing size={14} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 break-words">{notif.title}</p>
                                <p className="text-xs text-slate-500 leading-snug my-0.5 break-words">{notif.message}</p>
                                <p className="text-[10px] text-slate-400">{notif.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-b-xl transition-colors">
                Lihat Semua Notifikasi
            </button>
        </div>
    );
}
