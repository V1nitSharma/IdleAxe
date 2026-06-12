import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, GitBranch, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import IdleAxeLogo from '../../components/IdleAxeLogo';

const features = [
    {
        icon: Shield,
        title: 'Policy-Gated Cleanup',
        text: 'Dry-run first, human approval before any destructive action. Every decision is auditable.',
    },
    {
        icon: GitBranch,
        title: 'Context-Aware Intelligence',
        text: 'Git lifecycle, owner metadata, usage signals, and idle duration inform every recommendation.',
    },
    {
        icon: FileText,
        title: 'Audit-Ready Ledger',
        text: 'PostgreSQL state ledger records every recommendation, approval, and action taken.',
    },
];

const stats = [
    { value: '$12K+', label: 'Avg. monthly savings' },
    { value: '91%', label: 'Waste detection rate' },
    { value: '<2min', label: 'Time to first insight' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function LandingPage() {
    return (
        <main className="theme-landing min-h-screen overflow-hidden selection:bg-emerald-200/60">
            {/* Subtle background grid */}
            <div className="fixed inset-0 landing-grid-bg pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                {/* ─── Header ─── */}
                <header className="flex items-center justify-between py-5 border-b border-gray-100">
                    <Link to="/" className="flex items-center">
                        <IdleAxeLogo size={30} />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/signup"
                            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
                        >
                            Get Started
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </header>

                {/* ─── Hero ─── */}
                <section className="flex flex-col items-center text-center pt-20 pb-16 lg:pt-28 lg:pb-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-700"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Autonomous cloud cleanup
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
                    >
                        Kill idle cloud spend
                        <span className="text-emerald-600"> without trusting a bot blindly.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8"
                    >
                        IdleAxe scans Docker workloads, proves what is safe to remove, routes cleanup
                        for approval, and keeps every recommendation tied to audit evidence.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        className="mt-10 flex flex-col gap-3 sm:flex-row"
                    >
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Get Started Free
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                        >
                            View Demo
                        </Link>
                    </motion.div>
                </section>

                {/* ─── Stats ─── */}
                <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    custom={0}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-gray-100 py-12 mb-16"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{stat.value}</p>
                            <p className="mt-1 text-sm text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </motion.section>

                {/* ─── Features ─── */}
                <section className="pb-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        custom={0}
                        className="text-center mb-14"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">How it works</p>
                        <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                            Three agents. One governed flow.
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((feature, i) => (
                            <motion.article
                                key={feature.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-40px' }}
                                custom={i}
                                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-lg hover:border-emerald-100 hover:-translate-y-1"
                            >
                                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm leading-6 text-gray-500">{feature.text}</p>
                            </motion.article>
                        ))}
                    </div>
                </section>

                {/* ─── Bottom CTA ─── */}
                <section className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-16 text-center text-white shadow-xl mb-12 overflow-hidden sm:py-20">
                    {/* Decorative circles */}
                    <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/[0.06]" aria-hidden="true" />
                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/[0.04]" aria-hidden="true" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                            Stop Paying For
                            <br />
                            Idle Infrastructure.
                        </h2>
                        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-emerald-100 sm:text-base">
                            Transform passive cloud monitoring into autonomous cloud optimization today.
                        </p>
                        <div className="mt-8">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Start Free
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="border-t border-gray-100 py-8 text-center">
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} IdleAxe · Autonomous Cloud Governance</p>
                </footer>
            </div>
        </main>
    );
}
