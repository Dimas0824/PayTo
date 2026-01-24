/**
 * Dashboard KPI card for a single metric.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type StatCardProps = {
    title: string;
    value: string;
    subtext: string;
    trend: 'up' | 'down';
    trendVal: string;
};

export default function StatCard({ title, value, subtext, trend, trendVal }: StatCardProps) {
    return (
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
}
