/**
 * Dashboard tab with stats, chart, and activity list.
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import StatCard from '../StatCard';

type WeeklyTrendPoint = {
    date: string;
    total: number;
};

type LowStockItem = {
    id: number;
    name: string;
    sku: string | null;
    stock: number | null;
    safety_stock: number | null;
    reorder_point: number | null;
};

type RecentActivity = {
    id: number;
    title: string;
    amount: number;
    method: string;
    cashier: string;
    time: string;
};

type DashboardPayload = {
    today_sales_total: number;
    today_transactions: number;
    low_stock: {
        total: number;
        items: LowStockItem[];
    };
    weekly_sales_trend: WeeklyTrendPoint[];
    recent_activities: RecentActivity[];
};

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DashboardTab() {
    const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchDashboard = async () => {
            try {
                const response = await axios.get('/api/admin/dashboard');
                if (!isActive) {
                    return;
                }
                setDashboard(response.data?.data ?? null);
            } catch (error) {
                if (!isActive) {
                    return;
                }
                setErrorMessage('Gagal memuat data dashboard.');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        fetchDashboard();

        return () => {
            isActive = false;
        };
    }, []);

    const currencyFormatter = useMemo(() => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }), []);

    const weeklyTrend = dashboard?.weekly_sales_trend ?? [];
    const maxTrend = weeklyTrend.reduce((max, point) => Math.max(max, point.total), 0);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {errorMessage ? (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl px-4 py-3 text-sm font-semibold">
                    {errorMessage}
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Penjualan Hari Ini"
                    value={currencyFormatter.format(dashboard?.today_sales_total ?? 0)}
                    subtext="Diperbarui otomatis"
                />
                <StatCard
                    title="Total Transaksi Hari Ini"
                    value={(dashboard?.today_transactions ?? 0).toString()}
                    subtext="Transaksi selesai"
                />
                <StatCard
                    title="Butuh Restock"
                    value={`${dashboard?.low_stock?.total ?? 0} Item`}
                    subtext="Stok di bawah batas aman"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm min-h-[300px] lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Trend Penjualan (7 Hari)</h3>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Real-time</span>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-4 px-4">
                        {isLoading ? (
                            Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className="w-full bg-indigo-100/70 rounded-t-xl animate-pulse">
                                    <div className="h-10"></div>
                                </div>
                            ))
                        ) : weeklyTrend.length ? (
                            weeklyTrend.map((point, index) => {
                                const height = maxTrend > 0 ? Math.round((point.total / maxTrend) * 100) : 0;
                                return (
                                    <div key={point.date} className="w-full bg-indigo-100 rounded-t-xl relative group">
                                        <div
                                            style={{ height: `${height}%` }}
                                            className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl transition-all group-hover:bg-indigo-600"
                                        ></div>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                                            {currencyFormatter.format(point.total)}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-sm text-slate-400">Belum ada data penjualan.</div>
                        )}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-2">
                        {weeklyTrend.length
                            ? weeklyTrend.map(point => {
                                const dayIndex = new Date(point.date).getDay();
                                return <span key={point.date}>{dayLabels[dayIndex]}</span>;
                            })
                            : dayLabels.map(label => <span key={label}>{label}</span>)}
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm lg:col-span-1">
                    <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terkini</h3>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex gap-3 items-start animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 mt-0.5"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-slate-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : (dashboard?.recent_activities?.length ? (
                            dashboard.recent_activities.map(activity => (
                                <div key={activity.id} className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{activity.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {currencyFormatter.format(activity.amount)} • {activity.method} • {activity.cashier}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400">Belum ada aktivitas terbaru.</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Stok Hampir Habis</h3>
                    <span className="text-xs text-slate-500">Top {dashboard?.low_stock?.items?.length ?? 0}</span>
                </div>
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 animate-pulse">
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : (dashboard?.low_stock?.items?.length ? (
                        dashboard.low_stock.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.sku ?? 'Tanpa SKU'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-rose-600">{item.stock ?? 0}</p>
                                    <p className="text-[10px] text-slate-400">stok tersedia</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400">Semua stok aman saat ini.</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
