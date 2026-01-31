import React, { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

import CartPanel from './Pos/components/CartPanel';
import HeaderBar from './Pos/components/HeaderBar';
import PaymentModal from './Pos/components/PaymentModal';
import Sidebar from './Pos/components/Sidebar';
import CatalogView from './Pos/components/views/CatalogView';
import FavoritesView from './Pos/components/views/FavoritesView';
import HistoryView from './Pos/components/views/HistoryView';
import ProfileView from './Pos/components/views/ProfileView';
import SettingsView from './Pos/components/views/SettingsView';
import UniversalModal from '../Components/UniversalModal';
import { CATEGORIES, QUICK_CASH_AMOUNTS } from './Pos/data';
import type { CartItem, Product } from './Pos/types';

export default function PosInterface() {
    // authentication and role will be validated by the backend header/profile controller

    // State Management
    const [activeView, setActiveView] = useState<'menu' | 'history' | 'favorites' | 'profile' | 'settings'>('menu');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOffline, setIsOffline] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'syncing'>('synced');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
    const [lastPaymentSummary, setLastPaymentSummary] = useState<{
        method: 'CASH' | 'EWALLET';
        total: number;
        change: number;
    } | null>(null);
    const [approvalReason, setApprovalReason] = useState("");
    const [supervisorPin, setSupervisorPin] = useState("");

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'EWALLET'>('CASH');
    const [cashReceived, setCashReceived] = useState<string>("");

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { products: serverProducts = [], history: serverHistory = [], profile: serverProfile = {} } = usePage().props as any;

    const [productsData, setProductsData] = useState<any[]>(Array.isArray(serverProducts) ? serverProducts : []);
    const [historyData, setHistoryData] = useState<any[]>(Array.isArray(serverHistory) ? serverHistory : []);
    const [profileData, setProfileData] = useState<any>(serverProfile || {});
    const [displayName, setDisplayName] = useState<string>('');

    // --- Computed ---
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalDiscount = cart.reduce((acc, item) => acc + item.discount, 0);
    const grandTotal = subtotal - totalDiscount;
    const taxTotal = subtotal * 0.11;
    const totalDue = grandTotal + taxTotal;
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    const change = paymentMethod === 'CASH' && cashReceived
        ? Number(cashReceived) - totalDue
        : 0;

    // --- Handlers ---
    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { ...product, qty: 1, discount: 0 }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            return;
        }

        if (paymentMethod === 'CASH' && (!cashReceived || Number(cashReceived) < totalDue)) {
            return;
        }

        setSyncStatus('syncing');

        try {
            const response = await axios.post('/api/pos/checkout', {
                payment_method: paymentMethod,
                cash_received: paymentMethod === 'CASH' ? Number(cashReceived) : undefined,
                items: cart.map((item) => ({
                    product_id: item.id,
                    qty: item.qty,
                    discount_amount: item.discount,
                })),
            });

            const responseStatus = (response?.data?.status || response?.data?.data?.status || response?.data?.payment?.status || '').toString().toLowerCase();
            const isPaymentConfirmed = ['confirmed', 'success', 'paid', 'settlement'].includes(responseStatus);

            setShowPaymentModal(false);
            setCart([]);
            setCashReceived("");
            setSyncStatus(isOffline ? 'pending' : 'synced');

            if (isPaymentConfirmed) {
                setLastPaymentSummary({
                    method: paymentMethod,
                    total: totalDue,
                    change,
                });
                setShowPaymentSuccessModal(true);
            }
        } catch (e) {
            setSyncStatus('pending');
        }
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        setShowLogoutModal(true);
    }

    const confirmLogout = () => {
        localStorage.removeItem('pos_logged_in');
        localStorage.removeItem('pos_role');
        router.visit('/login');
    };

    const navigateTo = (view: typeof activeView) => {
        setActiveView(view);
        setShowUserMenu(false);
    }

    // --- Render Helpers ---
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    // If server props are empty, fetch via API once on mount
    useEffect(() => {
        let mounted = true;

        async function fetchIfEmpty() {
            try {
                // Fetch header first to get authenticated user info and role
                const headerRes = await axios.get('/api/pos/profile');
                const header = headerRes.data?.data || {};
                if (!mounted) return;
                setDisplayName(header.display_name || header.displayName || '');
                const role = (header.role || '').toString().toUpperCase();
                if (role !== 'KASIR' && role !== 'CASHIER') {
                    router.visit('/login');
                    return;
                }

                if ((!productsData || productsData.length === 0)) {
                    const res = await axios.get('/api/pos/products');
                    if (!mounted) return;
                    setProductsData(res.data.data || []);
                }

                if ((!historyData || historyData.length === 0)) {
                    const res = await axios.get('/api/pos/history?limit=10');
                    if (!mounted) return;
                    setHistoryData(res.data.data || []);
                }

                if ((!profileData || Object.keys(profileData).length === 0)) {
                    const res = await axios.get('/api/pos/profile');
                    if (!mounted) return;
                    setProfileData(res.data.data || {});
                }
            } catch (e) {
                // silent
            }
        }

        fetchIfEmpty();

        return () => {
            mounted = false;
        };
    }, []);

    // Use server-provided products (fallback to client-fetched)
    const PRODUCTS = productsData || [];
    const HISTORY = historyData || [];
    const PROFILE = profileData || {};

    // Filter products for Catalog
    const filteredProducts = PRODUCTS.filter((p: any) => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    // Filter products for Favorites
    const favoriteProducts = PRODUCTS.filter((p: any) => p.isFavorite);

    return (
        // Main Background
        <div className="h-screen w-full bg-[#f3f4f6] relative flex font-sans overflow-hidden text-slate-800 selection:bg-indigo-500 selection:text-white">

            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-200 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute top-[20%] right-[40%] w-[25%] h-[25%] bg-indigo-200 rounded-full blur-[100px] opacity-30"></div>

            {/* 1. SIDEBAR (Navigation) */}
            <Sidebar
                activeView={activeView}
                isOffline={isOffline}
                onToggleOffline={() => setIsOffline(!isOffline)}
                showUserMenu={showUserMenu}
                onToggleUserMenu={() => setShowUserMenu(!showUserMenu)}
                onNavigate={navigateTo}
                onLogout={handleLogout}
                userMenuRef={userMenuRef}
            />

            {/* 2. DYNAMIC CONTENT AREA */}
            <div className="flex-1 flex flex-col relative h-full py-4 px-6 gap-6 z-10">

                {/* Header (Dynamic) */}
                <HeaderBar
                    activeView={activeView}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onBack={() => setActiveView('menu')}
                    searchInputRef={searchInputRef}
                    displayName={displayName || PROFILE.displayName || 'Kasir'}
                />

                {/* --- VIEW: CATALOG (MENU) --- */}
                {activeView === 'menu' && (
                    <CatalogView
                        categories={CATEGORIES}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        products={filteredProducts}
                        onAddToCart={addToCart}
                        formatRupiah={formatRupiah}
                    />
                )}

                {/* --- VIEW: HISTORY --- */}
                {activeView === 'history' && (
                    <HistoryView history={HISTORY} formatRupiah={formatRupiah} />
                )}

                {/* --- VIEW: FAVORITES --- */}
                {activeView === 'favorites' && (
                    <FavoritesView favorites={favoriteProducts} onAddToCart={addToCart} formatRupiah={formatRupiah} />
                )}

                {/* --- VIEW: PROFILE --- */}
                {activeView === 'profile' && (
                    <ProfileView profile={PROFILE} />
                )}

                {/* --- VIEW: SETTINGS --- */}
                {activeView === 'settings' && (
                    <SettingsView />
                )}

            </div>

            {/* 3. CART PANEL (Unchanged Style) */}
            <CartPanel
                cart={cart}
                subtotal={subtotal}
                totalDiscount={totalDiscount}
                grandTotal={grandTotal}
                onClearCart={() => setCart([])}
                onUpdateQty={updateQty}
                onRemoveFromCart={removeFromCart}
                onOpenApprovalModal={() => setShowApprovalModal(true)}
                onCheckout={() => setShowPaymentModal(true)}
                formatRupiah={formatRupiah}
            />

            {/* --- PAYMENT MODAL (Modern Glass) --- */}
            <PaymentModal
                isOpen={showPaymentModal}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                cashReceived={cashReceived}
                onCashReceivedChange={setCashReceived}
                onClose={() => setShowPaymentModal(false)}
                onCheckout={handleCheckout}
                quickCashAmounts={QUICK_CASH_AMOUNTS}
                grandTotal={grandTotal}
                taxTotal={taxTotal}
                discountTotal={totalDiscount}
                totalDue={totalDue}
                subtotal={subtotal}
                change={change}
                formatRupiah={formatRupiah}
            />

            <UniversalModal
                isOpen={showLogoutModal}
                title="Keluar dari POS?"
                description="Anda akan keluar dari sesi kasir saat ini."
                tone="warning"
                confirmLabel="Ya, Keluar"
                cancelLabel="Batal"
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />

            <UniversalModal
                isOpen={showPaymentSuccessModal}
                title="Pembayaran Berhasil"
                description="Transaksi telah dikonfirmasi oleh sistem."
                tone="success"
                cancelLabel="Tutup"
                onClose={() => setShowPaymentSuccessModal(false)}
            >
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Metode</span>
                        <span className="font-bold text-slate-700">{lastPaymentSummary?.method === 'CASH' ? 'Tunai' : 'QRIS'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-mono font-bold text-slate-700">{formatRupiah(lastPaymentSummary?.total ?? 0)}</span>
                    </div>
                    {lastPaymentSummary?.method === 'CASH' && (
                        <div className="flex justify-between">
                            <span>Kembalian</span>
                            <span className="font-mono font-bold text-emerald-600">
                                {lastPaymentSummary?.change >= 0 ? formatRupiah(lastPaymentSummary.change).replace(",00", "") : '-'}
                            </span>
                        </div>
                    )}
                </div>
            </UniversalModal>

            {/* Approval Modal logic remains similar, styled with rounded-[2.5rem] and bg-white/90 backdrop-blur-xl */}
        </div>
    );
}
