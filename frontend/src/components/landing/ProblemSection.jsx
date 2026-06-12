import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, ServerCrash, ShieldAlert } from 'lucide-react';

const problems = [
    {
        icon: ServerCrash,
        title: 'Orphaned Resources',
        tone: 'text-rose-300 bg-rose-400/10',
        text: 'Developers spin up containers for experiments, demos, and feature branches. Work ends, but the runtime keeps burning compute in the background.',
    },
    {
        icon: BellRing,
        title: 'Alert Fatigue',
        tone: 'text-amber-300 bg-amber-400/10',
        text: 'Most governance tools stop at noisy alerts. IdleAxe turns findings into an evidence-backed cleanup plan that teams can actually approve.',
    },
    {
        icon: ShieldAlert,
        title: 'Fear Of Deletion',
        tone: 'text-emerald-300 bg-emerald-400/10',
        text: 'Nobody wants an automation system deleting the wrong workload. IdleAxe keeps cleanup policy-gated, auditable, and context aware.',
    },
];

export default function ProblemSection() {
    return (
        <section id="resources" className="relative overflow-hidden bg-[#4a4a4a] px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl rounded-[18px] border border-white/10 bg-[#050806] px-6 py-16 shadow-2xl sm:px-10 lg:px-14">
                <div className="mb-12 max-w-3xl">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-emerald-300/80">The Problem</p>
                    <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                        Cloud waste is easy to create.
                        <span className="block text-emerald-300">Safe cleanup is the hard part.</span>
                    </h2>
                    <p className="max-w-2xl text-base leading-7 text-white/65">
                        IdleAxe focuses on the uncomfortable gap between FinOps recommendations and platform engineering reality: proving what is idle, who owns it, and whether it is safe to remove.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {problems.map(({ icon: Icon, title, tone, text }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="rounded-lg border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-colors hover:border-emerald-300/25"
                        >
                            <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-3 text-xl font-black">{title}</h3>
                            <p className="text-sm leading-6 text-white/60">{text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
