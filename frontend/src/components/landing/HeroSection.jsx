import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const proofPoints = [
    {
        icon: ShieldCheck,
        label: 'Policy gated',
        text: 'Dry-run first, approval before destructive cleanup.',
    },
    {
        icon: GitBranch,
        label: 'Context aware',
        text: 'Git lifecycle, owner metadata, usage signals, and idle time.',
    },
    {
        icon: FileText,
        label: 'Audit ready',
        text: 'PostgreSQL state ledger records every recommendation and action.',
    },
];

export default function HeroSection() {
    return (
        <main className="min-h-screen bg-[#4a4a4a] px-4 py-8 text-white sm:px-8 lg:px-12">
            <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[18px] border border-white/10 bg-black shadow-2xl">
                <div className="idleaxe-wave-field" aria-hidden="true">
                    <div className="idleaxe-wave idleaxe-wave-one" />
                    <div className="idleaxe-wave idleaxe-wave-two" />
                    <div className="idleaxe-wave idleaxe-wave-three" />
                    <div className="idleaxe-grid" />
                </div>

                <div className="relative z-10 flex w-full flex-col px-6 py-7 sm:px-10 lg:px-14">
                    <div className="flex flex-1 items-center py-12 lg:py-16">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-xl"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                                    <Sparkles className="h-3.5 w-3.5" />
                                </span>
                                Autonomous cleanup, governed by policy
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.08 }}
                                className="mb-5 max-w-4xl text-[2.8rem] font-black leading-[1.02] sm:text-6xl lg:text-7xl"
                            >
                                Make idle cloud work
                                <span className="block text-emerald-300">safer to find and remove</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.16 }}
                                className="mb-8 max-w-xl text-sm leading-6 text-white/72 sm:text-base"
                            >
                                IdleAxe scans Docker workloads, checks engineering context, scores waste risk, and turns cleanup into an approval-based governance workflow instead of another noisy alert.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.24 }}
                                className="mb-10 flex flex-col gap-3 sm:flex-row"
                            >
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-black transition-colors hover:bg-emerald-300"
                                >
                                    Get Started
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                                >
                                    Discover More
                                </a>
                            </motion.div>

                            <motion.div
                                id="features"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.75, delay: 0.32 }}
                                className="grid max-w-4xl gap-3 md:grid-cols-3"
                            >
                                {proofPoints.map(({ icon: Icon, label, text }) => (
                                    <div key={label} className="rounded-lg border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                                            <Icon className="h-4 w-4 text-emerald-300" />
                                            {label}
                                        </div>
                                        <p className="text-xs leading-5 text-white/62">{text}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
