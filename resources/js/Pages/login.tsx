import React, { useState } from 'react';
import {
    Zap, User, Lock, ArrowRight, Eye, EyeOff,
    LayoutGrid, ShieldCheck, AlertCircle
} from 'lucide-react';

export default function PosLoginPage() {
    const [loginMethod, setLoginMethod] = useState<'CREDENTIALS' | 'PIN'>('CREDENTIALS');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulasi Login
        setTimeout(() => {
            setIsLoading(false);
            // Logic redirect ke main POS disini
            alert("Login Berhasil! Mengalihkan ke POS...");
        }, 1500);
    };

    const handlePinInput = (digit: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + digit);
        }
    };

    const handlePinDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    return (
        <div className="min-h-screen w-full bg-[#f3f4f6] relative flex items-center justify-center p-6 font-sans overflow-hidden text-slate-800">

            {/* --- Ambient Background (Sama dengan POS Main) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[120px] opacity-40"></div>

            {/* --- MAIN GLASS CARD --- */}
            <div className="w-full max-w-5xl h-[600px] bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-2xl flex overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">

                {/* LEFT SIDE: BRANDING & VISUAL */}
                <div className="w-1/2 hidden lg:flex flex-col relative bg-white/20 border-r border-white/30 p-12 justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>

                    {/* Brand */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-300/50">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <span className="font-bold text-2xl text-slate-800 tracking-tight">POS System</span>
                    </div>

                    {/* Illustration / Quote */}
                    <div className="relative z-10 space-y-6">
                        <div className="w-full aspect-[4/3] bg-white/30 rounded-3xl border border-white/40 shadow-sm backdrop-blur-sm flex items-center justify-center relative overflow-hidden group">
                            {/* Abstract Shapes */}
                            <div className="absolute w-24 h-24 bg-rose-300 rounded-full blur-2xl top-10 left-10 opacity-60 group-hover:translate-x-2 transition-transform duration-700"></div>
                            <div className="absolute w-32 h-32 bg-indigo-300 rounded-full blur-2xl bottom-10 right-10 opacity-60 group-hover:-translate-x-2 transition-transform duration-700"></div>

                            <div className="text-center p-6 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20">
                                <ShieldCheck size={48} className="mx-auto text-indigo-600 mb-4 drop-shadow-sm" />
                                <h3 className="font-bold text-lg text-slate-800">Aman & Terintegrasi</h3>
                                <p className="text-slate-500 text-sm mt-1">Sistem Point of Sale modern dengan keamanan data offline-first.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-xs text-slate-500 font-medium">
                        &copy; 2026 Toko Cabang Pusat. v2.0.1
                    </div>
                </div>

                {/* RIGHT SIDE: LOGIN FORM */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40 relative">

                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
                            <p className="text-slate-500">Silakan masuk untuk memulai shift Anda.</p>
                        </div>

                        {/* Login Method Toggle */}
                        <div className="flex p-1 bg-white/50 border border-white/60 rounded-2xl mb-8 relative">
                            <button
                                onClick={() => setLoginMethod('CREDENTIALS')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'CREDENTIALS'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <User size={16} /> Username
                            </button>
                            <button
                                onClick={() => setLoginMethod('PIN')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'PIN'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <LayoutGrid size={16} /> Quick PIN
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in slide-in-from-top-2">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* --- METHOD 1: USERNAME & PASSWORD --- */}
                        {loginMethod === 'CREDENTIALS' && (
                            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ID Pengguna / Username</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Masukan ID kasir..."
                                            className="w-full bg-white/60 border border-white/60 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-300 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kata Sandi</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/60 border border-white/60 focus:bg-white rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-300 transition-all text-slate-800 placeholder:text-slate-400 font-medium font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !username || !password}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-300/50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group mt-4"
                                >
                                    {isLoading ? (
                                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            Masuk Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* --- METHOD 2: PIN PAD --- */}
                        {loginMethod === 'PIN' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col items-center">
                                <div className="mb-8 flex gap-3 justify-center">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${i < pin.length
                                                    ? 'bg-indigo-600 border-indigo-600 scale-110'
                                                    : 'bg-white/50 border-slate-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePinInput(num.toString())}
                                            className="h-16 w-full bg-white/60 hover:bg-white rounded-2xl border border-white/60 shadow-sm text-2xl font-bold text-slate-700 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95 active:bg-indigo-50"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <div className="h-16"></div> {/* Empty slot */}
                                    <button
                                        onClick={() => handlePinInput('0')}
                                        className="h-16 w-full bg-white/60 hover:bg-white rounded-2xl border border-white/60 shadow-sm text-2xl font-bold text-slate-700 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95 active:bg-indigo-50"
                                    >
                                        0
                                    </button>
                                    <button
                                        onClick={handlePinDelete}
                                        className="h-16 w-full flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                                    >
                                        <ArrowRight className="rotate-180" size={24} />
                                    </button>
                                </div>

                                <div className="mt-6 w-full max-w-[280px]">
                                    <button
                                        onClick={handleLogin}
                                        disabled={pin.length < 6 || isLoading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                    >
                                        {isLoading ? 'Verifikasi...' : 'Masuk'}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
