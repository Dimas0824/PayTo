import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard, Package, FileText, Settings, Users,
    LogOut, Bell, Search, ArrowUpRight, ArrowDownRight,
    AlertTriangle, Printer, TrendingUp, Calendar, Filter,
    CheckCircle, XCircle, ChevronDown, Save, ShieldCheck,
    Edit, Trash2, Plus, ToggleLeft, ToggleRight, Lock, User,
    ShoppingBag, UploadCloud, X, Key, Mail, Phone, Clock, BellRing
} from 'lucide-react';

// --- Types ---
type InventoryRecommendation = {
    id: number;
    productName: string;
    sku: string;
    stock: number;
    avgSales7d: number;
    leadTime: number; // days
    reorderPoint: number;
    suggestedQty: number;
    status: 'SAFE' | 'WARNING' | 'CRITICAL';
};

type ApprovalLog = {
    id: string;
    action: 'DISCOUNT_OVERRIDE' | 'VOID_TRANSACTION';
    cashier: string;
    reason: string;
    time: string;
    status: 'APPROVED';
};

type StaffMember = {
    id: number;
    name: string;
    role: 'SUPERVISOR' | 'CASHIER';
    username: string;
    status: 'ACTIVE' | 'INACTIVE';
    lastLogin: string;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    discount: number; // in percent
    status: 'ACTIVE' | 'INACTIVE';
    image?: string;
};

type Notification = {
    id: number;
    title: string;
    message: string;
    type: 'ALERT' | 'INFO' | 'SUCCESS';
    time: string;
    read: boolean;
};

// --- Mock Data ---
const INVENTORY_DATA: InventoryRecommendation[] = [
    { id: 1, productName: "Kopi Susu Aren", sku: "BV-001", stock: 45, avgSales7d: 12.5, leadTime: 3, reorderPoint: 40, suggestedQty: 0, status: 'SAFE' },
    { id: 2, productName: "Croissant Butter", sku: "FD-001", stock: 5, avgSales7d: 8.0, leadTime: 2, reorderPoint: 16, suggestedQty: 11, status: 'CRITICAL' },
    { id: 3, productName: "Mineral Water", sku: "BV-003", stock: 18, avgSales7d: 15.0, leadTime: 1, reorderPoint: 20, suggestedQty: 2, status: 'WARNING' },
    { id: 4, productName: "Red Velvet Cake", sku: "FD-003", stock: 2, avgSales7d: 4.2, leadTime: 2, reorderPoint: 10, suggestedQty: 8, status: 'CRITICAL' },
    { id: 5, productName: "Beef Burger", sku: "FD-004", stock: 10, avgSales7d: 5.5, leadTime: 3, reorderPoint: 18, suggestedQty: 8, status: 'WARNING' },
];

const APPROVAL_LOGS: ApprovalLog[] = [
    { id: 'LOG-001', action: 'DISCOUNT_OVERRIDE', cashier: 'Budi S.', reason: 'Promo Member VIP', time: '10:45', status: 'APPROVED' },
    { id: 'LOG-002', action: 'VOID_TRANSACTION', cashier: 'Budi S.', reason: 'Salah input menu', time: '09:12', status: 'APPROVED' },
    { id: 'LOG-003', action: 'DISCOUNT_OVERRIDE', cashier: 'Siti A.', reason: 'Kompensasi Salah Menu', time: 'Kemarin', status: 'APPROVED' },
];

const STAFF_DATA: StaffMember[] = [
    { id: 1, name: "Budi Santoso", role: 'CASHIER', username: 'budi.s', status: 'ACTIVE', lastLogin: 'Sedang Online' },
    { id: 2, name: "Siti Aminah", role: 'SUPERVISOR', username: 'siti.admin', status: 'ACTIVE', lastLogin: '2 jam yang lalu' },
    { id: 3, name: "Joko Anwar", role: 'CASHIER', username: 'joko.a', status: 'INACTIVE', lastLogin: '3 hari yang lalu' },
];

const PRODUCTS_DATA: Product[] = [
    { id: 1, name: "Kopi Susu Aren", sku: "BV-001", category: "Minuman", price: 18000, stock: 45, discount: 0, status: 'ACTIVE' },
    { id: 2, name: "Croissant Butter", sku: "FD-001", category: "Makanan", price: 22000, stock: 5, discount: 10, status: 'ACTIVE' },
    { id: 3, name: "Mineral Water", sku: "BV-003", category: "Minuman", price: 5000, stock: 18, discount: 0, status: 'ACTIVE' },
    { id: 4, name: "Red Velvet Cake", sku: "FD-003", category: "Dessert", price: 28000, stock: 2, discount: 0, status: 'INACTIVE' },
];

const NOTIFICATIONS_DATA: Notification[] = [
    { id: 1, title: "Stok Kritis", message: "Croissant Butter & Red Velvet sisa sedikit.", type: 'ALERT', time: "Baru saja", read: false },
    { id: 2, title: "Permintaan Approval", message: "Budi S. meminta void transaksi #INV-2050.", type: 'INFO', time: "10 menit lalu", read: false },
    { id: 3, title: "Sync Berhasil", message: "24 Transaksi offline berhasil diunggah ke server.", type: 'SUCCESS', time: "1 jam lalu", read: true },
];

const ADMIN_PROFILE = {
    name: "Siti Aminah",
    role: "SUPERVISOR",
    id: "SPV-001",
    email: "siti.aminah@tokokopi.com",
    phone: "+62 812 3456 7890",
    joinDate: "12 Januari 2024",
    lastLogin: "Hari ini, 08:00 WIB"
};

export default function SupervisorDashboard() {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'INVENTORY' | 'RECEIPT' | 'APPROVALS' | 'USERS' | 'SETTINGS' | 'PRODUCTS' | 'PROFILE'>('DASHBOARD');

    // States
    const [receiptHeader, setReceiptHeader] = useState("TOKO CABANG PUSAT\nJl. Sudirman No. 45, Jakarta");
    const [receiptFooter, setReceiptFooter] = useState("Terima kasih atas kunjungan Anda\nFollow IG: @tokokopi");
    const [storeName, setStoreName] = useState("Toko Cabang Pusat");
    const [discountLimit, setDiscountLimit] = useState(20);
    const [allowNegativeStock, setAllowNegativeStock] = useState(false);

    // Product Modal States
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Notification & User Menu States
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Refs for click outside
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Click Outside Handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- Components ---

    const SidebarItem = ({ icon: Icon, label, id, isActive }: { icon: any, label: string, id: string, isActive: boolean }) => (
        <button
            onClick={() => setActiveTab(id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                ? 'bg-white shadow-md text-indigo-600'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                }`}
        >
            <Icon size={20} className={isActive ? 'stroke-[2.5px]' : ''} />
            <span className="font-medium text-sm">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
        </button>
    );

    const StatCard = ({ title, value, subtext, trend, trendVal }: any) => (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-xl ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? '+' : ''}{trendVal}
                </span>
                <span className="text-slate-400">{subtext}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-[#f3f4f6] flex font-sans text-slate-800 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

            {/* Background Ambience */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-[0%] left-[0%] w-[30%] h-[30%] bg-blue-200 rounded-full blur-[100px] opacity-30"></div>

            {/* --- SIDEBAR --- */}
            <aside className="w-64 m-4 flex flex-col bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 p-6 z-20">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-10 h-10 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Admin<span className="text-indigo-600">Panel</span></h1>
                        <p className="text-[10px] text-slate-500 font-medium">Supervisor Access</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar-light pr-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" id="DASHBOARD" isActive={activeTab === 'DASHBOARD'} />
                    <SidebarItem icon={ShoppingBag} label="Manajemen Barang" id="PRODUCTS" isActive={activeTab === 'PRODUCTS'} />
                    <SidebarItem icon={Package} label="Smart Inventory" id="INVENTORY" isActive={activeTab === 'INVENTORY'} />
                    <SidebarItem icon={Printer} label="Receipt Settings" id="RECEIPT" isActive={activeTab === 'RECEIPT'} />
                    <SidebarItem icon={ShieldCheck} label="Approval Logs" id="APPROVALS" isActive={activeTab === 'APPROVALS'} />
                    <div className="pt-4 pb-2">
                        <div className="h-px bg-slate-200/50 mx-4"></div>
                    </div>
                    <SidebarItem icon={Users} label="Staff Management" id="USERS" isActive={activeTab === 'USERS'} />
                    <SidebarItem icon={Settings} label="App Settings" id="SETTINGS" isActive={activeTab === 'SETTINGS'} />
                </nav>

                <button className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-auto font-medium text-sm shrink-0">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">

                {/* Header */}
                <header className="px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {activeTab === 'DASHBOARD' && "Overview Hari Ini"}
                            {activeTab === 'INVENTORY' && "Smart Inventory Logic"}
                            {activeTab === 'RECEIPT' && "Template Struk"}
                            {activeTab === 'APPROVALS' && "Audit Log Supervisor"}
                            {activeTab === 'USERS' && "Manajemen Staf"}
                            {activeTab === 'SETTINGS' && "Pengaturan Aplikasi"}
                            {activeTab === 'PRODUCTS' && "Katalog & Stok Barang"}
                            {activeTab === 'PROFILE' && "Profil Admin"}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {activeTab === 'DASHBOARD' && "Pantau performa outlet secara real-time."}
                            {activeTab === 'INVENTORY' && "Rekomendasi restock otomatis berdasarkan rata-rata penjualan 7 hari."}
                            {activeTab === 'RECEIPT' && "Atur tampilan struk yang dicetak di kasir."}
                            {activeTab === 'USERS' && "Kelola akses login untuk Kasir dan Supervisor."}
                            {activeTab === 'SETTINGS' && "Konfigurasi toko dan parameter sistem POS."}
                            {activeTab === 'PRODUCTS' && "Kelola master produk, stok, harga, dan diskon."}
                            {activeTab === 'PROFILE' && "Kelola informasi akun dan PIN keamanan Anda."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Notification Bell */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-all shadow-sm relative"
                            >
                                <Bell size={18} />
                                {NOTIFICATIONS_DATA.some(n => !n.read) && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 flex justify-between items-center border-b border-slate-100">
                                        <h4 className="font-bold text-sm text-slate-800">Notifikasi</h4>
                                        <button className="text-[10px] text-indigo-600 font-bold hover:underline">Tandai Dibaca</button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar-light">
                                        {NOTIFICATIONS_DATA.map(notif => (
                                            <div key={notif.id} className={`p-3 border-b border-slate-50 hover:bg-white/50 transition-colors flex gap-3 ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${notif.type === 'ALERT' ? 'bg-rose-100 text-rose-600' :
                                                    notif.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                                                        'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {notif.type === 'ALERT' ? <AlertTriangle size={14} /> :
                                                        notif.type === 'SUCCESS' ? <CheckCircle size={14} /> :
                                                            <BellRing size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                                                    <p className="text-xs text-slate-500 leading-snug my-0.5">{notif.message}</p>
                                                    <p className="text-[10px] text-slate-400">{notif.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-b-xl transition-colors">
                                        Lihat Semua Notifikasi
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Avatar with Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <div
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-white p-0.5 shadow-md cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all"
                            >
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Supervisor" className="rounded-full bg-white w-full h-full" alt="Admin" />
                            </div>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl mb-1 border border-indigo-100">
                                        <p className="font-bold text-sm text-slate-800">{ADMIN_PROFILE.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <p className="text-xs text-slate-500">{ADMIN_PROFILE.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setActiveTab('PROFILE'); setShowUserMenu(false); }}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors w-full text-left"
                                    >
                                        <User size={16} /> Profil Saya
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('SETTINGS'); setShowUserMenu(false); }}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors w-full text-left"
                                    >
                                        <Settings size={16} /> Pengaturan
                                    </button>
                                    <div className="h-px bg-slate-200/50 my-1"></div>
                                    <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors w-full text-left font-bold">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar-light">

                    {/* === DASHBOARD TAB === */}
                    {activeTab === 'DASHBOARD' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Stats Row */}
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

                            {/* Charts & Recent (Simplified for UI) */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm min-h-[300px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800">Trend Penjualan (7 Hari)</h3>
                                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Lihat Detail</button>
                                    </div>
                                    {/* Mock Chart Visualization */}
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

                                <div className="col-span-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
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
                    )}

                    {/* === ADMIN PROFILE TAB === */}
                    {activeTab === 'PROFILE' && (
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
                                                <h2 className="text-3xl font-bold text-slate-800">{ADMIN_PROFILE.name}</h2>
                                                <p className="text-slate-500 font-medium text-lg">{ADMIN_PROFILE.role} • {ADMIN_PROFILE.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    Akun Aktif
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2">Login terakhir: {ADMIN_PROFILE.lastLogin}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-6 mt-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                                <Mail size={16} className="text-indigo-500" /> {ADMIN_PROFILE.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                                <Phone size={16} className="text-indigo-500" /> {ADMIN_PROFILE.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                                                <Clock size={16} className="text-indigo-500" /> Bergabung: {ADMIN_PROFILE.joinDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Security Settings */}
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

                                {/* Recent Activity Log */}
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
                    )}

                    {/* === PRODUCTS TAB (CRUD) === */}
                    {activeTab === 'PRODUCTS' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">

                            {/* Header Actions */}
                            <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Master Data Barang</h3>
                                    <p className="text-xs text-slate-500">Kelola stok, harga, dan diskon produk.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                                    className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                                >
                                    <Plus size={18} /> Tambah Barang
                                </button>
                            </div>

                            {/* Product Grid / Table */}
                            <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200/50">
                                        <tr>
                                            <th className="px-6 py-4">Produk Info</th>
                                            <th className="px-6 py-4">Harga Dasar</th>
                                            <th className="px-6 py-4">Diskon</th>
                                            <th className="px-6 py-4">Stok (Pcs)</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {PRODUCTS_DATA.map((product) => (
                                            <tr key={product.id} className="hover:bg-white/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                                                            {/* Placeholder Img */}
                                                            <span className="text-[10px]">IMG</span>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800">{product.name}</div>
                                                            <div className="text-xs text-slate-400 font-mono">{product.sku} • {product.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-bold text-slate-700">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.discount > 0 ? (
                                                        <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-lg text-xs font-bold border border-rose-200">
                                                            {product.discount}% OFF
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${product.stock < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg w-fit border ${product.status === 'ACTIVE'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                                        {product.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                                                            className="p-2 bg-white border border-slate-200 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* MODAL: ADD/EDIT PRODUCT */}
                            {showProductModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                                    <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                                        {/* Modal Header */}
                                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-800">
                                                    {editingProduct ? 'Edit Barang' : 'Tambah Barang Baru'}
                                                </h3>
                                                <p className="text-sm text-slate-500">Lengkapi informasi produk di bawah ini.</p>
                                            </div>
                                            <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Modal Body (Scrollable) */}
                                        <div className="p-8 overflow-y-auto custom-scrollbar-light space-y-6">

                                            {/* Photo Upload */}
                                            <div className="flex justify-center">
                                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all group">
                                                    <UploadCloud size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-bold">Upload Foto</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Produk</label>
                                                    <input type="text" defaultValue={editingProduct?.name} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="Contoh: Kopi Susu Gula Aren" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SKU / Kode Barang</label>
                                                    <input type="text" defaultValue={editingProduct?.sku} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="BV-001" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                                                    <select
                                                        defaultValue={editingProduct?.category}
                                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                    >
                                                        <option value="Minuman">Minuman</option>
                                                        <option value="Makanan">Makanan</option>
                                                        <option value="Dessert">Dessert</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga Jual (Rp)</label>
                                                    <input type="number" defaultValue={editingProduct?.price} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="0" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stok Awal</label>
                                                    <input type="number" defaultValue={editingProduct?.stock} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="0" />
                                                </div>

                                                <div className="col-span-2 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                                                            <Settings size={14} /> Pengaturan Diskon
                                                        </label>
                                                        <span className="text-[10px] text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">Opsional</span>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <div className="flex-1">
                                                            <input type="number" defaultValue={editingProduct?.discount} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-300 outline-none text-center" placeholder="0" />
                                                        </div>
                                                        <span className="font-bold text-indigo-800">%</span>
                                                        <div className="text-xs text-indigo-600 w-1/2 leading-tight">
                                                            Diskon ini akan langsung memotong harga jual saat transaksi di kasir.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Modal Footer */}
                                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                            <button onClick={() => setShowProductModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm">
                                                Batal
                                            </button>
                                            <button
                                                onClick={() => { alert("Data berhasil disimpan!"); setShowProductModal(false); }}
                                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                                            >
                                                <Save size={18} /> Simpan Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* === SMART INVENTORY TAB === */}
                    {activeTab === 'INVENTORY' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-white/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Rekomendasi Pembelian (Restock)</h3>
                                        <p className="text-xs text-slate-500">Dihitung otomatis: (Avg Sales 7 Hari × Lead Time) + Safety Stock</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                                        <FileText size={16} /> Export PDF
                                    </button>
                                </div>

                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Produk</th>
                                            <th className="px-6 py-4">Avg Sales (7d)</th>
                                            <th className="px-6 py-4">Current Stock</th>
                                            <th className="px-6 py-4">Reorder Point</th>
                                            <th className="px-6 py-4">Saran Order</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {INVENTORY_DATA.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{item.productName}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{item.sku}</div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-600">{item.avgSales7d.toFixed(1)} /hari</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{item.stock}</td>
                                                <td className="px-6 py-4 text-slate-500">{item.reorderPoint}</td>
                                                <td className="px-6 py-4">
                                                    {item.suggestedQty > 0 ? (
                                                        <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                                            +{item.suggestedQty}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status === 'CRITICAL' && (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full w-fit">
                                                            <AlertTriangle size={12} /> CRITICAL
                                                        </span>
                                                    )}
                                                    {item.status === 'WARNING' && (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                                                            <AlertTriangle size={12} /> LOW
                                                        </span>
                                                    )}
                                                    {item.status === 'SAFE' && (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                                            <CheckCircle size={12} /> SAFE
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* === RECEIPT SETTINGS TAB === */}
                    {activeTab === 'RECEIPT' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Editor */}
                            <div className="space-y-6">
                                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Settings size={20} className="text-slate-400" /> Konfigurasi Template
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Header Struk</label>
                                            <textarea
                                                rows={4}
                                                value={receiptHeader}
                                                onChange={(e) => setReceiptHeader(e.target.value)}
                                                className="w-full p-4 bg-white/60 border border-white/60 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-200 outline-none"
                                                placeholder="Nama Toko, Alamat, Telp..."
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1">*Mendukung placeholder: {"{store_name}"}, {"{date}"}</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Footer Struk</label>
                                            <textarea
                                                rows={3}
                                                value={receiptFooter}
                                                onChange={(e) => setReceiptFooter(e.target.value)}
                                                className="w-full p-4 bg-white/60 border border-white/60 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-indigo-200 outline-none"
                                                placeholder="Ucapan terima kasih, info wifi, sosmed..."
                                            />
                                        </div>

                                        <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-900 transition-all">
                                            <Save size={18} /> Simpan Template
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex justify-center">
                                <div className="w-[320px] bg-white p-6 rounded-none shadow-2xl relative font-mono text-xs text-slate-800 border-t-8 border-slate-200">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCA0IiB3aWR0aD0iMjAiIGhlaWdodD0iNCI+PHBhdGggZD0iTTAgNGw1LTRsNSA0bDUtNGw1IDR2LTRoLTIweiIgZmlsbD0iI2UzZTNiOCIvPjwvc3ZnPg==')] opacity-50"></div>

                                    {/* Header Preview */}
                                    <div className="text-center mb-4 whitespace-pre-wrap leading-tight">
                                        {receiptHeader}
                                    </div>

                                    <div className="border-b border-dashed border-slate-300 my-2"></div>
                                    <div className="flex justify-between mb-1"><span>20/01/2026</span><span>14:30</span></div>
                                    <div className="flex justify-between mb-2"><span>Inv: #INV-001</span><span>Kasir: Budi</span></div>
                                    <div className="border-b border-dashed border-slate-300 my-2"></div>

                                    {/* Item Preview */}
                                    <div className="space-y-1 mb-2">
                                        <div className="flex justify-between font-bold"><span>Kopi Susu Aren</span><span>18.000</span></div>
                                        <div className="text-slate-500">1 x 18.000</div>

                                        <div className="flex justify-between font-bold mt-2"><span>Croissant</span><span>22.000</span></div>
                                        <div className="text-slate-500">1 x 22.000</div>
                                    </div>

                                    <div className="border-b border-dashed border-slate-300 my-2"></div>
                                    <div className="flex justify-between"><span>Subtotal</span><span>40.000</span></div>
                                    <div className="flex justify-between"><span>Tax (10%)</span><span>4.000</span></div>
                                    <div className="flex justify-between text-lg font-bold mt-2"><span>TOTAL</span><span>44.000</span></div>
                                    <div className="border-b border-dashed border-slate-300 my-2"></div>

                                    {/* Footer Preview */}
                                    <div className="text-center mt-4 whitespace-pre-wrap leading-tight text-slate-600">
                                        {receiptFooter}
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCA0IiB3aWR0aD0iMjAiIGhlaWdodD0iNCI+PHBhdGggZD0iTTAgMGw1IDRsNS00bDUgNHY0aC0yMHoiIGZpbGw9IiNlM2UzYjgiLz48L3N2Zz4=')] opacity-50 rotate-180"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === APPROVALS TAB === */}
                    {activeTab === 'APPROVALS' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 gap-4">
                                {APPROVAL_LOGS.map(log => (
                                    <div key={log.id} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.action === 'VOID_TRANSACTION' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-slate-800">{log.action.replace('_', ' ')}</h4>
                                                <span className="text-xs font-mono text-slate-400">{log.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Kasir: <span className="font-medium text-slate-800">{log.cashier}</span> •
                                                Alasan: <span className="italic">"{log.reason}"</span>
                                            </p>
                                        </div>
                                        <div>
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                                                {log.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* === USERS TAB (STAFF MANAGEMENT) === */}
                    {activeTab === 'USERS' && (
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
                                {STAFF_DATA.map(user => (
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
                    )}

                    {/* === SETTINGS TAB === */}
                    {activeTab === 'SETTINGS' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* General Settings */}
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm h-fit">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                    <Settings size={20} className="text-slate-400" /> Umum
                                </h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Toko</label>
                                        <input
                                            type="text"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                            className="w-full p-4 bg-white/60 border border-white/60 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Batas Diskon Kasir (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={discountLimit}
                                                onChange={(e) => setDiscountLimit(Number(e.target.value))}
                                                className="w-full p-4 bg-white/60 border border-white/60 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2">Diskon di atas nilai ini membutuhkan Approval Supervisor.</p>
                                    </div>
                                </div>
                            </div>

                            {/* System Controls */}
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm h-fit">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                    <ShieldCheck size={20} className="text-slate-400" /> Kontrol Sistem
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50">
                                        <div>
                                            <div className="font-bold text-sm text-slate-700">Izinkan Stok Negatif</div>
                                            <div className="text-xs text-slate-500">Transaksi tetap jalan meski stok 0</div>
                                        </div>
                                        <button
                                            onClick={() => setAllowNegativeStock(!allowNegativeStock)}
                                            className={`text-2xl transition-colors ${allowNegativeStock ? 'text-indigo-600' : 'text-slate-300'}`}
                                        >
                                            {allowNegativeStock ? <ToggleRight size={40} fill="currentColor" /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/50">
                                        <div>
                                            <div className="font-bold text-sm text-slate-700">Mode Debug / Dev</div>
                                            <div className="text-xs text-slate-500">Menampilkan log error detail</div>
                                        </div>
                                        <button className="text-2xl text-slate-300">
                                            <ToggleLeft size={40} />
                                        </button>
                                    </div>

                                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 mt-4">
                                        <h4 className="font-bold text-sm text-rose-700 mb-1 flex items-center gap-2">
                                            <AlertTriangle size={16} /> Danger Zone
                                        </h4>
                                        <p className="text-xs text-rose-600 mb-3">Menghapus semua data transaksi lokal yang belum tersinkron.</p>
                                        <button className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100">
                                            Factory Reset Local Data
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="md:col-span-2 flex justify-end">
                                <button className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-900 transition-all">
                                    <Save size={20} /> Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
