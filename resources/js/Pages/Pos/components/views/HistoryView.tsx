import React, { useState } from 'react';
import {
    Banknote,
    CheckCircle,
    Clock,
    CreditCard,
    RefreshCw,
    ShoppingBag,
    ChevronDown
} from 'lucide-react';

import type { TransactionHistory } from '../../types';

type HistoryViewProps = {
    history: TransactionHistory[];
    formatRupiah: (num: number) => string;
};

export default function HistoryView({ history, formatRupiah }: HistoryViewProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div className="flex-1 overflow-y-auto pr-2 pb-4 -mr-2 custom-scrollbar-light">
            <div className="flex flex-col gap-3">
                {history.map((tx) => {
                    const isOpen = expandedId === tx.id;

                    return (
                        <div key={tx.id} className="group">
                            {/* CARD */}
                            <button
                                type="button"
                                onClick={() => toggle(tx.id)}
                                className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner
                                        ${tx.status === 'VOID'
                                                ? 'bg-rose-100 text-rose-500'
                                                : 'bg-emerald-100 text-emerald-600'
                                            }`}
                                    >
                                        {tx.paymentMethod === 'CASH'
                                            ? <Banknote size={20} />
                                            : <CreditCard size={20} />}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800">{tx.invoiceNo}</h4>
                                            {tx.status === 'VOID' && (
                                                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">
                                                    VOID
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {tx.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ShoppingBag size={12} /> {tx.items} items
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-lg text-slate-800">
                                            {formatRupiah(tx.total).replace(',00', '')}
                                        </div>

                                        {tx.syncStatus === 'SYNCED' ? (
                                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1 inline-flex">
                                                <CheckCircle size={10} /> Terkirim
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 mt-1 inline-flex">
                                                <RefreshCw size={10} className="animate-spin" /> Menunggu Sync
                                            </span>
                                        )}
                                    </div>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </button>

                            {/* DETAIL */}
                            <div
                                className={`overflow-hidden transition-all duration-300
    ${isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
    `}
                            >
                                <div className="bg-white/60 border border-slate-200/60 rounded-2xl p-4 space-y-4">

                                    {/* INFO RINGKAS */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400">Metode Pembayaran</p>
                                            <p className="font-semibold">{tx.paymentMethod}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">Status</p>
                                            <p className="font-semibold">{tx.status}</p>
                                        </div>
                                    </div>

                                    {/* LIST ITEM */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 mb-2">
                                            Detail Item ({tx.itemsDetail.length})
                                        </p>

                                        <div className="divide-y divide-slate-200/60">
                                            {tx.itemsDetail.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between items-center py-2 text-sm"
                                                >
                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {item.qty} × {formatRupiah(item.price)}
                                                        </p>
                                                    </div>

                                                    <div className="font-mono font-semibold text-slate-700">
                                                        {formatRupiah(item.qty * item.price).replace(',00', '')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* TOTAL */}
                                    <div className="flex justify-between items-center border-t border-slate-200/60 pt-3 text-sm">
                                        <span className="font-bold text-slate-600">Total</span>
                                        <span className="font-mono font-bold text-slate-800">
                                            {formatRupiah(tx.total).replace(',00', '')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}

                <button className="w-full py-4 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors border-t border-slate-200/50 mt-2">
                    Lihat Semua Riwayat
                </button>
            </div>
        </div>
    );
}
