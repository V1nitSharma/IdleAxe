import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import IdleAxeLogo from '../../components/IdleAxeLogo';
import ParticleWave from '../../components/ParticleWave';

const benefits = [
    'Read-only by default',
    'Approval-based cleanup',
    'Auditable actions',
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('idleaxe_auth', 'true');
                localStorage.setItem('idleaxe_user', data.name || form.name);
                navigate('/dashboard');
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.detail || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError('Server connection error. Please verify the backend is running.');
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
                                Free to start
                            </div>

                            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Sign up for
                                <span className="block text-[#22c55e]">safer cleanup.</span>
                            </h1>
                            <p className="max-w-md text-base leading-7 text-white/55">
                                Create an account to review idle resources, inspect cleanup evidence, and open your governance dashboard.
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

                        {/* Right — Sign-up form */}
                        <motion.form
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            onSubmit={handleSubmit}
                            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#050f0a]/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-10"
                        >
                            <div className="mb-7">
                                <h2 className="mb-1.5 text-2xl font-black tracking-tight text-white">Create account</h2>
                                <p className="text-sm text-white/50">Three fields. One minute. No payment needed.</p>
                            </div>

                            {/* Error Box */}
                            {error && (
                                <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                                    <span className="text-sm">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-5">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/50">Full Name</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-[#00e676] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-[#00e676]/30">
                                        <UserRound className="h-4 w-4 text-white/40" />
                                        <input
                                            required
                                            disabled={loading}
                                            name="name"
                                            value={form.name}
                                            onChange={updateField}
                                            placeholder="Aditya Sharma"
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/50">Work Email</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-[#00e676] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-[#00e676]/30">
                                        <Mail className="h-4 w-4 text-white/40" />
                                        <input
                                            required
                                            disabled={loading}
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={updateField}
                                            placeholder="you@company.com"
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-white/50">Password</span>
                                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all focus-within:border-[#00e676] focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-[#00e676]/30">
                                        <LockKeyhole className="h-4 w-4 text-white/40" />
                                        <input
                                            required
                                            disabled={loading}
                                            minLength={8}
                                            type="password"
                                            autoComplete="new-password"
                                            name="password"
                                            value={form.password}
                                            onChange={updateField}
                                            placeholder="Minimum 8 characters"
                                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                                        />
                                    </div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00e676] hover:bg-[#39ff14] disabled:bg-[#00e676]/40 text-black px-6 py-3.5 text-sm font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <p className="mt-5 text-center text-xs text-white/50">
                                Already have access?{' '}
                                <Link to="/login" className="font-bold text-[#00e676] transition-colors hover:text-[#39ff14]">
                                    Log in
                                </Link>
                            </p>
                        </motion.form>
                    </div>
                </div>
            </main>
        </>
    );
}
