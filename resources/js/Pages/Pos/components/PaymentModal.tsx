import React from 'react';
import { Banknote, CreditCard, Printer } from 'lucide-react';

type PaymentModalProps = {
    isOpen: boolean;
    paymentMethod: 'CASH' | 'EWALLET';
    onPaymentMethodChange: (method: 'CASH' | 'EWALLET') => void;
    cashReceived: string;
    onCashReceivedChange: (value: string) => void;
    onClose: () => void;
    onCheckout: () => void;
    quickCashAmounts: number[];
    grandTotal: number;
    subtotal: number;
    change: number;
    formatRupiah: (num: number) => string;
};

export default function PaymentModal({
    isOpen,
    paymentMethod,
    onPaymentMethodChange,
    cashReceived,
    onCashReceivedChange,
    onClose,
    onCheckout,
    quickCashAmounts,
    grandTotal,
    subtotal,
    change,
    formatRupiah,
}: PaymentModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white/80 backdrop-blur-2xl w-full max-w-4xl h-150 rounded-[3rem] shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300 ring-1 ring-white/60">
                <div className="w-70 bg-slate-50/50 p-6 flex flex-col gap-3 relative border-r border-slate-200/50">
                    <h3 className="font-bold text-xl mb-4 text-slate-800">Payment</h3>

                    {[
                        { id: 'CASH', label: 'Tunai', icon: Banknote, desc: 'Uang fisik' },
                        { id: 'EWALLET', label: 'QRIS', icon: CreditCard, desc: 'Scan code' },
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => onPaymentMethodChange(m.id as 'CASH' | 'EWALLET')}
                            className={`p-4 rounded-2xl flex items-center gap-4 transition-all border text-left group relative overflow-hidden ${paymentMethod === m.id
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white border-slate-200/60 text-slate-500 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                                }`}
                        >
                            <div className={`p-2.5 rounded-xl ${paymentMethod === m.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'} transition-colors`}>
                                <m.icon size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-sm">{m.label}</div>
                                <div className={`text-xs ${paymentMethod === m.id ? 'text-white/60' : 'text-slate-400'}`}>{m.desc}</div>
                            </div>
                        </button>
                    ))}

                    <button onClick={onClose} className="mt-auto py-4 font-bold text-xs text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                        Batalkan
                    </button>
                </div>

                <div className="flex-1 bg-white/40 p-8 flex flex-col justify-center relative">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="text-center mb-8">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Harus Dibayar</p>
                            <h2 className="text-5xl font-mono font-bold text-slate-800 tracking-tighter">{formatRupiah(grandTotal + (subtotal * 0.11)).replace(",00", "")}</h2>
                        </div>

                        {paymentMethod === 'CASH' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">Rp</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-4 text-3xl font-mono font-bold shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-800 placeholder:text-slate-200"
                                        placeholder="0"
                                        value={cashReceived}
                                        onChange={(e) => onCashReceivedChange(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {quickCashAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => onCashReceivedChange(amt.toString())}
                                            className="py-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-600 text-xs hover:border-indigo-500 hover:text-indigo-600 active:scale-95 transition-all shadow-sm"
                                        >
                                            {amt / 1000}k
                                        </button>
                                    ))}
                                    <button onClick={() => onCashReceivedChange((grandTotal + (subtotal * 0.11)).toString())} className="bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                        Uang Pas
                                    </button>
                                </div>

                                <div className="py-4 flex justify-between items-center border-t border-slate-200/50 mt-4">
                                    <span className="font-bold text-slate-400 text-sm">Kembalian</span>
                                    <span className={`text-2xl font-mono font-bold ${change < 0 ? 'text-slate-300' : 'text-emerald-500'}`}>
                                        {change >= 0 ? formatRupiah(change).replace(",00", "") : '-'}
                                    </span>
                                </div>

                                <button
                                    disabled={!cashReceived || parseInt(cashReceived) < grandTotal}
                                    onClick={onCheckout}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-300/50 disabled:opacity-50 disabled:shadow-none hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                                >
                                    <Printer size={20} /> Cetak Struk
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
