import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, UserRound, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import IdleAxeLogo from '../../components/IdleAxeLogo';
import ParticleWave from '../../components/ParticleWave';

const benefits = [
    'Full action logging',
    'Encrypted credentials',
    'Real-time audit log',
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldShake, setShouldShake] = useState(false);

    const triggerError = (msg) => {
        setError(msg);
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShouldShake(false);
        setLoading(true);

        const credentials = { username, password };

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (res.ok) {
                navigate('/dashboard');
            } else {
                const data = await res.json().catch(() => ({}));
                triggerError(data.detail || 'Authentication failed. Please verify credentials.');
            }
        } catch (err) {
            console.warn("Backend offline or unreachable. Using fallback local authentication.");
            if (username === 'admin' && password === 'idleaxe') {
                navigate('/dashboard');
            } else {
                triggerError('Invalid credentials. (Try admin / idleaxe)');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Global fixed particle canvas — sits behind everything */}
            <ParticleWave />

            <main className="theme-landing min-h-screen selection:bg-emerald-400/20" style={{ position: 'relative', zIndex: 1 }}>
                <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                    {/* ─── Header ─── */}
                    <header className="flex items-center justify-between py-5 border-b border-white/10">
                        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <IdleAxeLogo size={28} />
                        <div className="w-16" aria-hidden="true" />
                    </header>

                    {/* ─── Content ─── */}
                    <div className="flex flex-col lg:flex-row items-start justify-center gap-16 pt-16 pb-24 lg:pt-24">
                        {/* Left — Marketing copy */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            className="max-w-lg lg:pt-8"
                        >
                            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#4ade80]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                FinOps Swarm Command Plane
                            </div>

                            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Welcome back,
                                <span className="block text-[#22c55e]">Operator.</span>
                            </h1>
                            <p className="max-w-md text-base leading-7 text-white/55">
                                Enter your security credentials to access the IdleAxe command plane, manage recommendations, and authorize cleanups.
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {benefits.map((benefit, i) => (
                                    <motion.div
                                        key={benefit}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i + 2}
                                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80"
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22c55e]" />
                                        <span className="font-medium">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — Login form */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className={`w-full max-w-md rounded-2xl border border-white/10 bg-[#050f0a]/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-10 ${
                                shouldShake ? 'animate-shake border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : ''
                            }`}
                        >
                            <div className="mb-7">
                                <h2 className="mb-1.5 text-2xl font-black tracking-tight text-white">Sign In</h2>
                                <p className="text-sm text-white/50">Enter credentials to initialize command plane.</p>
                            </div>

                            {/* Error Box */}
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                                    <span className="text-sm">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/50">Operator Username</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-[#00e676] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-[#00e676]/30">
                                        <UserRound className="h-4 w-4 text-white/40" />
                                        <input
                                            required
                                            disabled={loading}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="e.g. admin"
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/50">Security Credentials</span>
                                    <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-[#00e676] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-[#00e676]/30">
                                        <LockKeyhole className="h-4 w-4 text-white/40" />
                                        <input
                                            required
                                            disabled={loading}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30 pr-10"
                                        />
                                        <button
                                            type="button"
                                            tabIndex="-1"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00e676] hover:bg-[#39ff14] disabled:bg-[#00e676]/40 text-black px-6 py-3.5 text-sm font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Authorizing Swarm...
                                        </>
                                    ) : (
                                        <>
                                            Initialize Command
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <p className="mt-5 text-center text-xs text-white/50">
                                    Don't have command access?{' '}
                                    <Link to="/signup" className="font-bold text-[#00e676] transition-colors hover:text-[#39ff14]">
                                        Request access
                                    </Link>
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
        </>
    );
}
