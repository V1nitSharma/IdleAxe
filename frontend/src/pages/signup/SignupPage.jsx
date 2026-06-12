import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import IdleAxeLogo from '../../components/IdleAxeLogo';

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

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/dashboard');
    };

    return (
        <main className="min-h-screen bg-white selection:bg-emerald-200/60">
            {/* Subtle background grid */}
            <div className="fixed inset-0 landing-grid-bg pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                {/* ─── Header ─── */}
                <header className="flex items-center justify-between py-5 border-b border-gray-100">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900">
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
                        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Free to start
                        </div>

                        <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Sign up for
                            <span className="block text-emerald-600">safer cleanup.</span>
                        </h1>
                        <p className="max-w-md text-base leading-7 text-gray-500">
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
                                    className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-sm text-gray-600"
                                >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
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
                        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg sm:p-10"
                    >
                        <div className="mb-7">
                            <h2 className="mb-1.5 text-2xl font-black tracking-tight text-gray-900">Create account</h2>
                            <p className="text-sm text-gray-400">Three fields. One minute. No payment needed.</p>
                        </div>

                        <div className="space-y-5">
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Full Name</span>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:bg-white">
                                    <UserRound className="h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        name="name"
                                        value={form.name}
                                        onChange={updateField}
                                        placeholder="Aditya Sharma"
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Work Email</span>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:bg-white">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={updateField}
                                        placeholder="you@company.com"
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-gray-400">Password</span>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:bg-white">
                                    <LockKeyhole className="h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        minLength={8}
                                        type="password"
                                        autoComplete="new-password"
                                        name="password"
                                        value={form.password}
                                        onChange={updateField}
                                        placeholder="Minimum 8 characters"
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Create Account
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <p className="mt-5 text-center text-xs text-gray-400">
                            Already have access?{' '}
                            <Link to="/dashboard" className="font-bold text-emerald-600 transition-colors hover:text-emerald-700">
                                Open dashboard
                            </Link>
                        </p>
                    </motion.form>
                </div>
            </div>
        </main>
    );
}
