import React, { useEffect, useRef, useState } from 'react';
import {
    Zap, Wifi, Shield, ArrowRight, Layout, Database,
    TrendingUp, BarChart3, Lock, Star, CreditCard, Box, Users
} from 'lucide-react';

// --- CUSTOM HOOKS ---

const useScrollReveal = (threshold = 0.1) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
};

// --- COMPONENTS ---

// 1. DYNAMIC BACKGROUND (UPDATED: Abstract Lines & Fireflies)
const ImmersiveBackground = () => {
    // Generate static random values for fireflies to avoid re-render calculation issues
    const [fireflies] = useState(() =>
        Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 4 + 2, // 2px to 6px
            duration: Math.random() * 10 + 15, // 15s to 25s
            delay: Math.random() * 5,
            tx: Math.random() * 100 - 50, // -50px to 50px move
            ty: Math.random() * 100 - 50,
        }))
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute inset-0 bg-[#f8fafc]"></div>

            {/* 1. Large Gradient Orbs (Ambient - Existing but refined) */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-400/20 rounded-full blur-[120px] animate-blob mix-blend-multiply"></div>
            <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-purple-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-400/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply"></div>

            {/* 2. Abstract Lines (SVG Animation) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.4]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Wave 1 */}
                <path d="M-100,300 Q400,500 800,300 T1800,400" fill="none" stroke="url(#lineGrad)" strokeWidth="2" className="animate-float-slow" />
                {/* Wave 2 */}
                <path d="M-100,600 Q600,400 1200,700 T2200,500" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-float-slow delay-1000" style={{ animationDuration: '20s' }} />
                {/* Wave 3 (Subtle) */}
                <path d="M0,100 Q300,50 600,150 T1200,100" fill="none" stroke="url(#lineGrad)" strokeWidth="1" className="animate-float-slow" style={{ opacity: 0.3, animationDuration: '25s' }} />
            </svg>

            {/* 3. Firefly Orbs (Kunang-kunang) */}
            {fireflies.map((f) => (
                <div
                    key={f.id}
                    className="absolute rounded-full bg-indigo-300 blur-[1px] animate-firefly"
                    style={{
                        left: `${f.left}%`,
                        top: `${f.top}%`,
                        width: `${f.size}px`,
                        height: `${f.size}px`,
                        opacity: 0, // Controlled by keyframes
                        animationDuration: `${f.duration}s`,
                        animationDelay: `${f.delay}s`,
                        boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.3)', // Glow effect
                        // We use standard keyframes defined below for compatibility
                    }}
                />
            ))}

            {/* 4. Grid Texture (Maintained for structure) */}
            <div className="absolute inset-0 opacity-[0.3]"
                style={{
                    backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'linear-gradient(to bottom, transparent 5%, black 40%, transparent 95%)'
                }}>
            </div>

            <style>{`
        @keyframes firefly {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          50% { transform: translate(20px, -40px) scale(1.2); opacity: 0.4; }
          80% { opacity: 0.8; }
          100% { transform: translate(-30px, -80px) scale(0.8); opacity: 0; }
        }
        .animate-firefly {
          animation-name: firefly;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        /* Custom blobs from tailwind config usually, added here for standalone support */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

// 2. GLASS NAVBAR
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-3 shadow-lg shadow-indigo-500/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Zap size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">POS<span className="text-indigo-600">System</span></span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
                <a href="#features" className="hover:text-indigo-600 transition-colors">Keunggulan</a>
                <a href="#ui" className="hover:text-indigo-600 transition-colors">Tampilan</a>
                <a href="#pricing" className="hover:text-indigo-600 transition-colors">Harga</a>
            </div>
            <button className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                Coba Demo
            </button>
        </div>
    </nav>
);

// 3. IMMERSIVE HERO SECTION
const Hero = () => (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden text-center">
        <ImmersiveBackground />

        <div className="relative z-10 max-w-5xl flex flex-col items-center">

            {/* Badge removed */}

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1] drop-shadow-sm">
                <span className="block animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">Bukan Sekadar</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 pb-2">
                    Mesin Kasir.
                </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 font-medium">
                Sistem manajemen ritel <span className="text-slate-800 font-bold bg-white/50 px-2 rounded-lg">Offline-first</span> yang indah, cerdas, dan dirancang untuk pertumbuhan bisnis Anda.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                    Mulai Sekarang
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {/* Tonton Video button removed */}
            </div>

            {/* 3D FLOATING MOCKUP HERO */}
            <div className="mt-20 w-full max-w-5xl relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 perspective-1000">
                {/* Main Interface */}
                <div className="relative z-20 bg-white/80 backdrop-blur-2xl border border-white/60 p-3 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 transform rotate-x-12 hover:rotate-0 transition-transform duration-1000 ease-out">
                    <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 relative aspect-[21/9] shadow-inner">
                        {/* UI Header */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-100 flex items-center px-6 justify-between z-10">
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Online
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-800">Budi Santoso</p>
                                    <p className="text-[10px] text-slate-500">Kasir - Shift Pagi</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                            </div>
                        </div>

                        {/* UI Body */}
                        <div className="absolute inset-0 pt-16 flex">
                            {/* Sidebar */}
                            <div className="w-20 bg-white border-r border-slate-100 hidden sm:flex flex-col items-center py-6 gap-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"></div>
                                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 bg-slate-50/50">
                                <div className="grid grid-cols-4 gap-6 h-full">
                                    {/* Product Grid */}
                                    <div className="col-span-3 grid grid-cols-3 gap-4 auto-rows-min">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
                                                <div className="aspect-[4/3] bg-indigo-50 rounded-xl mb-3 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 to-transparent"></div>
                                                </div>
                                                <div className="h-4 w-3/4 bg-slate-800/10 rounded-md mb-2"></div>
                                                <div className="flex justify-between">
                                                    <div className="h-3 w-1/3 bg-slate-200 rounded-md"></div>
                                                    <div className="h-3 w-1/4 bg-emerald-100 rounded-md"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Cart Panel */}
                                    <div className="col-span-1 bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 p-5 flex flex-col h-full">
                                        <div className="h-6 w-1/2 bg-slate-800/10 rounded-full mb-6"></div>
                                        <div className="space-y-3 flex-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-12 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                            <div className="flex justify-between"><div className="h-2 w-10 bg-slate-200 rounded"></div><div className="h-2 w-10 bg-slate-200 rounded"></div></div>
                                            <div className="flex justify-between"><div className="h-2 w-10 bg-slate-200 rounded"></div><div className="h-2 w-10 bg-slate-200 rounded"></div></div>
                                            <div className="h-12 w-full bg-slate-900 rounded-2xl mt-4 shadow-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements for Depth */}
                <div className="absolute -right-12 top-1/4 bg-white p-4 rounded-3xl shadow-2xl shadow-purple-500/20 z-30 animate-bounce-slow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400">Total Sales</p>
                            <p className="text-lg font-bold text-slate-800">+24.5%</p>
                        </div>
                    </div>
                </div>

                <div className="absolute -left-8 bottom-1/4 bg-white p-4 rounded-3xl shadow-2xl shadow-indigo-500/20 z-30 animate-bounce-slow delay-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400">Security</p>
                            <p className="text-lg font-bold text-slate-800">Protected</p>
                        </div>
                    </div>
                </div>

                {/* Glow effect behind dashboard */}
                <div className="absolute -inset-10 bg-indigo-500/20 blur-[100px] -z-10 rounded-[3rem]"></div>
            </div>
        </div>
    </section>
);

// 4. FEATURE CARD (Updated to accept className for layout tweaks)
interface FeatureCardProps {
    icon: React.ComponentType<{ size?: number }>; // lucide icons accept size
    title: string;
    desc: string;
    delay?: string;
    color?: keyof typeof colorMap;
    className?: string;
}

const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600',
    rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
} as const;

const FeatureCard = ({ icon: Icon, title, desc, delay = '0ms', color = 'indigo', className = '' }: FeatureCardProps) => {
    const { ref, isVisible } = useScrollReveal();

    const colors = colorMap[color] ?? colorMap.indigo;

    return (
        <div
            ref={ref}
            className={`group p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 ${className}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}
            style={{ transitionDelay: delay }}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${colors} group-hover:text-white shadow-inner`}>
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
        </div>
    );
};

// 5. FEATURES SECTION (Layout Optimized for 5 Items)
const Features = () => (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-24 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Kekuatan Penuh,<br />Tanpa Kompromi.</h2>
                <p className="text-xl text-slate-500 font-medium">Setiap piksel dirancang untuk kecepatan operasional ritel Anda.</p>
            </div>

            {/* LAYOUT LOGIC:
         - Mobile: 1 column
         - Tablet: 2 columns
         - Desktop: 6 column grid to allow 3-up then 2-up layout
      */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

                {/* Row 1: 3 Items (Standard) */}
                <FeatureCard
                    icon={Wifi}
                    title="Offline Core"
                    desc="Tetap berjualan meski internet mati total. Data tersinkronisasi otomatis saat kembali online."
                    color="indigo"
                    delay="0ms"
                    className="lg:col-span-2"
                />
                <FeatureCard
                    icon={Shield}
                    title="Fraud Protection"
                    desc="Approval PIN supervisor untuk setiap tindakan sensitif seperti Void atau Diskon besar."
                    color="rose"
                    delay="100ms"
                    className="lg:col-span-2"
                />
                <FeatureCard
                    icon={Database}
                    title="Smart Inventory"
                    desc="Algoritma prediktif memberi tahu kapan stok menipis berdasarkan tren penjualan."
                    color="amber"
                    delay="200ms"
                    className="lg:col-span-2"
                />

                {/* Row 2: 2 Items (Wider & Centered visually) */}
                <FeatureCard
                    icon={Layout}
                    title="Adaptive UI"
                    desc="Desain responsif yang sempurna di Tablet (Sentuh) maupun Desktop (Mouse/Keyboard)."
                    color="purple"
                    delay="300ms"
                    className="lg:col-span-3"
                />
                <FeatureCard
                    icon={BarChart3}
                    title="Live Analytics"
                    desc="Pantau omzet, margin keuntungan, dan performa staf detik ini juga dari mana saja."
                    color="emerald"
                    delay="400ms"
                    // On Tablet (md), this is the 5th item. We make it span 2 cols to fill the gap at the bottom.
                    // On Desktop (lg), it shares the row with the item above, spanning 3 cols each (half width).
                    className="md:col-span-2 lg:col-span-3"
                />

            </div>
        </div>
    </section>
);

// 6. SHOWCASE SECTION (Interactive Layout)
const Showcase = () => {
    const { ref, isVisible } = useScrollReveal(0.3);

    return (
        <section id="ui" className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto" ref={ref}>
                <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">

                        {/* Text Content */}
                        <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                                <Star size={12} fill="currentColor" /> Premium Experience
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                Kendali Penuh di <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Genggaman Anda.</span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                Dashboard admin yang memberikan insight mendalam tentang bisnis Anda. Visualisasi data yang indah membantu Anda mengambil keputusan strategis tanpa pusing membaca angka mentah.
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: BarChart3, label: 'Sales Reports' },
                                    { icon: Users, label: 'Staff Audit' },
                                    { icon: Box, label: 'Stock Opname' },
                                    { icon: CreditCard, label: 'Payment Logs' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <item.icon size={20} className="text-indigo-400" />
                                        <span className="font-bold text-slate-200">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Content - Floating Cards Stack */}
                        <div className={`lg:w-1/2 w-full transition-all duration-1000 ease-out delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                            <div className="relative h-[500px] w-full perspective-1000">
                                {/* Card 3 (Back) */}
                                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-purple-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] transform translate-y-12 -translate-x-12 rotate-[-6deg] shadow-2xl"></div>

                                {/* Card 2 (Middle) */}
                                <div className="absolute top-8 right-8 w-3/4 h-3/4 bg-indigo-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] transform translate-y-6 -translate-x-6 rotate-[-3deg] shadow-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 animate-pulse"></div>
                                        <div className="h-3 w-24 bg-white/10 rounded-full mx-auto"></div>
                                    </div>
                                </div>

                                {/* Card 1 (Front - Main) */}
                                <div className="absolute top-16 right-16 w-3/4 h-3/4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl p-6 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-slate-400 text-sm font-bold uppercase">Total Revenue</p>
                                            <h3 className="text-4xl font-bold text-white mt-1">Rp 128.5jt</h3>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <TrendingUp size={12} /> +12.4%
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-2 h-32 mt-4">
                                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

// 7. CTA & FOOTER
const Footer = () => {
    const { ref, isVisible } = useScrollReveal(0.5);

    return (
        <footer className="bg-white pt-24 pb-12 px-6 border-t border-slate-100">
            <div ref={ref} className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">Siap Untuk Upgrade?</h2>
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                    Jangan biarkan teknologi lama menghambat pertumbuhan bisnis Anda. Beralih ke POS System v2.0 hari ini.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1">
                        Mulai Uji Coba Gratis
                    </button>
                    <button className="px-10 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
                        Hubungi Sales
                    </button>
                </div>
            </div>

            <div className="mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                <div className="flex items-center gap-2 mb-4 md:mb-0 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <Zap size={20} className="text-indigo-600" fill="currentColor" />
                    <span className="font-bold text-lg text-slate-800">POSSystem</span>
                </div>
                <p>&copy; 2026 POS System Inc. All rights reserved.</p>
            </div>
        </footer>
    );
};

// --- MAIN LAYOUT ---
export default function LandingPage() {
    return (
        <div className="bg-[#f8fafc] min-h-screen text-slate-800 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden scroll-smooth">
            <Navbar />
            <Hero />
            <Features />
            <Showcase />
            <Footer />
        </div>
    );
}
