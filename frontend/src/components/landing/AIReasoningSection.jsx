import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function AIReasoningSection() {
    return (
        <section className="py-24 bg-[#0A0F24] border-y border-white/5 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explainable Decisions</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Explainable decisions combining LLM context with deterministic policy gates.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-2xl p-1 border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="bg-[#050816] rounded-xl p-8">
                            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Target Resource</div>
                                    <div className="text-2xl font-mono text-white font-semibold">dev-cache-replica</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 mb-1">Decision</div>
                                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-semibold border border-green-500/20">
                                        <ShieldCheck className="w-4 h-4" />
                                        Scale Down Proposed
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">CPU Avg</div>
                                    <div className="text-xl font-semibold text-white">1.2%</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Mem Avg</div>
                                    <div className="text-xl font-semibold text-white">3.8%</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Branch</div>
                                    <div className="text-xl font-semibold text-gray-400 line-through">Merged</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Last Deploy</div>
                                    <div className="text-xl font-semibold text-amber-400">11 days ago</div>
                                </div>
                            </div>

                            <div className="bg-[#0F172A] rounded-lg p-6 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-gray-400">Policy Match Score</div>
                                    <div className="text-2xl font-bold text-blue-400">94%</div>
                                </div>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '94%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Risk Score: <span className="text-green-400">14/100</span> (Low)</span>
                                    <span className="text-gray-500">Est. Savings: <span className="text-green-400">+$24/mo</span></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
