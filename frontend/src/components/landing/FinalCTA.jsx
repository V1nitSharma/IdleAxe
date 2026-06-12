import React from 'react';
import { LockKeyhole, ScrollText } from 'lucide-react';

export default function FinalCTA() {
    return (
        <section id="governance" className="relative overflow-hidden bg-[#4a4a4a] px-4 pb-8 sm:px-8 lg:px-12">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[18px] border border-white/10 bg-black px-6 py-16 shadow-2xl sm:px-10 lg:px-14">
                <div className="idleaxe-wave-field opacity-70" aria-hidden="true">
                    <div className="idleaxe-wave idleaxe-wave-two" />
                    <div className="idleaxe-grid" />
                </div>

                <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-emerald-300/80">Production Guardrails</p>
                        <h2 className="mb-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                            Stop paying for idle infrastructure without giving a bot root-level trust.
                        </h2>
                        <p className="mb-8 max-w-2xl text-base leading-7 text-white/68">
                            Use IdleAxe to inspect workloads, explain cleanup evidence, require approval, and leave an auditable trail before Docker stop or remove actions are executed.
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/45 p-5 backdrop-blur-md">
                        <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                <LockKeyhole className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-black">Execution Policy</h3>
                                <p className="text-xs text-white/55">Default remediation posture</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-white/70">
                            <div className="flex items-center justify-between rounded-md bg-white/[0.05] px-4 py-3">
                                <span>Read-only discovery</span>
                                <span className="font-bold text-emerald-300">On</span>
                            </div>
                            <div className="flex items-center justify-between rounded-md bg-white/[0.05] px-4 py-3">
                                <span>Human approval</span>
                                <span className="font-bold text-emerald-300">Required</span>
                            </div>
                            <div className="flex items-center justify-between rounded-md bg-white/[0.05] px-4 py-3">
                                <span>Audit ledger</span>
                                <span className="font-bold text-emerald-300">PostgreSQL</span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-start gap-3 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-xs leading-5 text-emerald-50/80">
                            <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                            Every cleanup recommendation includes observed idle signals, Git context, waste score, and the final action record.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
