import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, ShieldAlert } from 'lucide-react';

type ModalTone = 'neutral' | 'warning' | 'danger' | 'success';

type UniversalModalProps = {
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ModalTone;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    isConfirmDisabled?: boolean;
    isLoading?: boolean;
};

const toneStyles: Record<ModalTone, {
    badgeBg: string;
    badgeIcon: string;
    button: string;
    border: string;
    shadow: string;
    topLine: string;
    defaultIcon: React.ReactNode;
}> = {
    // 1. NEUTRAL: Menggunakan Palette "Navy Mirage" (#141E30 - #3F5E96)
    // Cocok untuk konfirmasi umum dan Logout yang elegan (tidak menakutkan)
    neutral: {
        badgeBg: 'bg-[#3F5E96]/10',
        badgeIcon: 'text-[#3F5E96]',
        button: 'bg-[#141E30] hover:bg-[#3F5E96] text-white shadow-[#141E30]/20',
        border: 'border-[#3F5E96]/20',
        shadow: 'shadow-[#141E30]/10',
        topLine: 'bg-[#141E30]',
        defaultIcon: <Info size={24} />,
    },

    // 2. SUCCESS: Menggunakan Palette "Verdanthe" (#08262C - #124A59)
    success: {
        badgeBg: 'bg-[#124A59]/10',
        badgeIcon: 'text-[#124A59]',
        button: 'bg-[#124A59] hover:bg-[#08262C] text-white shadow-[#124A59]/20',
        border: 'border-[#124A59]/20',
        shadow: 'shadow-[#124A59]/10',
        topLine: 'bg-[#124A59]',
        defaultIcon: <CheckCircle size={24} />,
    },

    // 3. DANGER: Redesigned Rose (Lebih Deep & Premium)
    // Gunakan ini jika Logout ingin terasa 'berbahaya', jika tidak gunakan Neutral
    danger: {
        badgeBg: 'bg-rose-50',
        badgeIcon: 'text-rose-700',
        button: 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-900/20',
        border: 'border-rose-200',
        shadow: 'shadow-rose-900/10',
        topLine: 'bg-rose-600',
        defaultIcon: <ShieldAlert size={24} />,
    },

    // 4. WARNING: Premium Gold/Amber (Bukan Kuning Terang)
    warning: {
        badgeBg: 'bg-orange-50',
        badgeIcon: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20',
        border: 'border-orange-200',
        shadow: 'shadow-orange-900/10',
        topLine: 'bg-orange-500',
        defaultIcon: <AlertTriangle size={24} />,
    },
};

export default function UniversalModal({
    isOpen,
    title,
    description,
    onClose,
    onConfirm,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    tone = 'neutral',
    icon,
    children,
    isConfirmDisabled = false,
    isLoading = false,
}: UniversalModalProps) {
    if (!isOpen) return null;

    const styles = toneStyles[tone];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: Menggunakan warna dasar Navy Mirage dengan opacity rendah */}
            <div
                className="absolute inset-0 bg-[#141E30]/40 backdrop-blur-[6px] transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-lg bg-white/95 backdrop-blur-3xl border rounded-[2.5rem] shadow-2xl transform transition-all animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 overflow-hidden ${styles.border} ${styles.shadow}`}>

                <div className="p-8">
                    <div className="flex items-start gap-5">
                        {/* Icon Badge */}
                        <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-sm border border-white/50 ${styles.badgeBg} ${styles.badgeIcon}`}>
                            {icon ?? styles.defaultIcon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <h3 className="text-xl font-bold text-[#141E30] leading-tight mb-2">
                                {title}
                            </h3>
                            {description && (
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Custom Children Content Area */}
                    {children && (
                        <div className="mt-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-100/80 text-sm text-slate-600 inner-shadow-sm">
                            {children}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-0 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-50 text-sm border border-transparent"
                    >
                        {cancelLabel}
                    </button>

                    {onConfirm && (
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isConfirmDisabled || isLoading}
                            className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none`}
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
