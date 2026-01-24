/**
 * User menu dropdown for profile, settings, and logout.
 */

import React from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import type { AdminProfile } from '../types';

type UserMenuProps = {
    profile: AdminProfile;
    onNavigateProfile: () => void;
    onNavigateSettings: () => void;
    onLogout: () => void;
};

export default function UserMenu({ profile, onNavigateProfile, onNavigateSettings, onLogout }: UserMenuProps) {
    return (
        <div className="absolute top-full right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl mb-1 border border-indigo-100">
                <p className="font-bold text-sm text-slate-800">{profile.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <p className="text-xs text-slate-500">{profile.role}</p>
                </div>
            </div>
            <button
                onClick={onNavigateProfile}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors w-full text-left"
            >
                <User size={16} /> Profil Saya
            </button>
            <button
                onClick={onNavigateSettings}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors w-full text-left"
            >
                <Settings size={16} /> Pengaturan
            </button>
            <div className="h-px bg-slate-200/50 my-1"></div>
            <button
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors w-full text-left font-bold"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
    );
}
