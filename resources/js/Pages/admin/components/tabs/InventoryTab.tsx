/**
 * Smart inventory recommendations table.
 */

import React from 'react';
import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import type { InventoryRecommendation } from '../../types';

type InventoryTabProps = {
    items: InventoryRecommendation[];
};

export default function InventoryTab({ items }: InventoryTabProps) {
    return (
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
                        {items.map((item) => (
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
    );
}
