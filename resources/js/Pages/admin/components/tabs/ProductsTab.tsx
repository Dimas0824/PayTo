/**
 * Products tab with list and add/edit modal.
 */

import React from 'react';
import { Edit, Plus, Save, Settings, Trash2, UploadCloud, X } from 'lucide-react';
import type { Product } from '../../types';

type ProductsTabProps = {
    products: Product[];
    showProductModal: boolean;
    editingProduct: Product | null;
    onOpenCreate: () => void;
    onEdit: (product: Product) => void;
    onCloseModal: () => void;
    onSave: () => void;
};

export default function ProductsTab({
    products,
    showProductModal,
    editingProduct,
    onOpenCreate,
    onEdit,
    onCloseModal,
    onSave,
}: ProductsTabProps) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex flex-col gap-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Master Data Barang</h3>
                    <p className="text-xs text-slate-500">Kelola stok, harga, dan diskon produk.</p>
                </div>
                <button
                    onClick={onOpenCreate}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all sm:w-auto"
                >
                    <Plus size={18} /> Tambah Barang
                </button>
            </div>

            <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
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
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                                                <span className="text-[10px]">IMG</span>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-800 break-words">{product.name}</div>
                                                <div className="text-xs text-slate-400 font-mono break-words">{product.sku} • {product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-slate-700">
                                            Rp {Math.round(product.price - (product.price * (product.discount ?? 0)) / 100).toLocaleString('id-ID')}
                                        </div>
                                        {product.discount > 0 && (
                                            <div className="text-[10px] font-mono text-slate-400 line-through">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </div>
                                        )}
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
                                                onClick={() => onEdit(product)}
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
            </div>

            {showProductModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">
                                    {editingProduct ? 'Edit Barang' : 'Tambah Barang Baru'}
                                </h3>
                                <p className="text-sm text-slate-500">Lengkapi informasi produk di bawah ini.</p>
                            </div>
                            <button onClick={onCloseModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar-light space-y-6">
                            <div className="flex justify-center">
                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all group">
                                    <UploadCloud size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold">Upload Foto</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
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

                                <div className="sm:col-span-2 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                                            <Settings size={14} /> Pengaturan Diskon
                                        </label>
                                        <span className="text-[10px] text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">Opsional</span>
                                    </div>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="flex-1">
                                            <input type="number" defaultValue={editingProduct?.discount} className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-300 outline-none text-center" placeholder="0" />
                                        </div>
                                        <span className="font-bold text-indigo-800">%</span>
                                        <div className="text-xs text-indigo-600 leading-tight sm:w-1/2">
                                            Diskon ini akan langsung memotong harga jual saat transaksi di kasir.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={onCloseModal} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm">
                                Batal
                            </button>
                            <button
                                onClick={onSave}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> Simpan Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
