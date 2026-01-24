/**
 * Admin header with contextual title, notifications, and user menu.
 */

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import type { AdminTab } from '../types';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import type { AdminProfile, Notification } from '../types';

type HeaderProps = {
    activeTab: AdminTab;
    showNotifications: boolean;
    onToggleNotifications: () => void;
    showUserMenu: boolean;
    onToggleUserMenu: () => void;
    notificationRef: React.RefObject<HTMLDivElement | null>;
    userMenuRef: React.RefObject<HTMLDivElement | null>;
    notifications: Notification[];
    profile: AdminProfile;
    onNavigateProfile: () => void;
    onNavigateSettings: () => void;
    onLogout: () => void;
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
};

const headerTitleMap: Record<AdminTab, string> = {
    DASHBOARD: 'Overview Hari Ini',
    INVENTORY: 'Smart Inventory Logic',
    RECEIPT: 'Template Struk',
    APPROVALS: 'Audit Log Supervisor',
    USERS: 'Manajemen Staf',
    SETTINGS: 'Pengaturan Aplikasi',
    PRODUCTS: 'Katalog & Stok Barang',
    PROFILE: 'Profil Admin',
};

const headerSubtitleMap: Record<AdminTab, string> = {
    DASHBOARD: 'Pantau performa outlet secara real-time.',
    INVENTORY: 'Rekomendasi restock otomatis berdasarkan rata-rata penjualan 7 hari.',
    RECEIPT: 'Atur tampilan struk yang dicetak di kasir.',
    APPROVALS: 'Audit log approval untuk aksi sensitif.',
    USERS: 'Kelola akses login untuk Kasir dan Supervisor.',
    SETTINGS: 'Konfigurasi toko dan parameter sistem POS.',
    PRODUCTS: 'Kelola master produk, stok, harga, dan diskon.',
    PROFILE: 'Kelola informasi akun dan PIN keamanan Anda.',
};

export default function Header({
    activeTab,
    showNotifications,
    onToggleNotifications,
    showUserMenu,
    onToggleUserMenu,
    notificationRef,
    userMenuRef,
    notifications,
    profile,
    onNavigateProfile,
    onNavigateSettings,
    onLogout,
    onToggleSidebar,
    isSidebarOpen,
}: HeaderProps) {
    return (
        <header className="px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    aria-expanded={isSidebarOpen}
                    className="lg:hidden w-10 h-10 rounded-xl border border-white/40 bg-white/50 backdrop-blur transition hover:bg-white/70"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {headerTitleMap[activeTab]}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {headerSubtitleMap[activeTab]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={onToggleNotifications}
                        className="w-10 h-10 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-all shadow-sm relative"
                    >
                        <Bell size={18} />
                        {notifications.some(n => !n.read) && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <NotificationDropdown notifications={notifications} />
                    )}
                </div>

                <div className="relative" ref={userMenuRef}>
                    <div
                        onClick={onToggleUserMenu}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-white p-0.5 shadow-md cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all"
                    >
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor" className="rounded-full bg-white w-full h-full" alt="Admin" />
                    </div>

                    {showUserMenu && (
                        <UserMenu
                            profile={profile}
                            onNavigateProfile={onNavigateProfile}
                            onNavigateSettings={onNavigateSettings}
                            onLogout={onLogout}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
