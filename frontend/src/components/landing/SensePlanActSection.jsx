import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Zap } from 'lucide-react';

export default function SensePlanActSection() {
    return (
        <section className="py-24 bg-[#0A0F24] border-y border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Autonomous Cloud Governance</h2>
                </div>

                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 relative">
                    
                    {/* SENSE */}
                    <div className="flex-1 bg-[#0F172A] border border-blue-500/30 rounded-[20px] p-8 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                            <Activity className="w-8 h-8 text-blue-500" />
                            <h3 className="text-2xl font-black tracking-widest text-blue-500">SENSE</h3>
                        </div>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Real-time telemetry scanning</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> CPU & Memory monitoring</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Infrastructure discovery</li>
                        </ul>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center -mx-4 z-0">
                        <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </motion.div>
                    </div>

                    {/* PLAN */}
                    <div className="flex-1 bg-[#0F172A] border border-purple-500/30 rounded-[20px] p-8 relative z-10 shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                            <Brain className="w-8 h-8 text-purple-500" />
                            <h3 className="text-2xl font-black tracking-widest text-purple-500">PLAN</h3>
                        </div>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Engineering context analysis</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Git lifecycle intelligence</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Risk & Confidence scoring</li>
                        </ul>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex items-center justify-center -mx-4 z-0">
                        <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </motion.div>
                    </div>

                    {/* ACT */}
                    <div className="flex-1 bg-[#0F172A] border border-red-500/30 rounded-[20px] p-8 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                            <Zap className="w-8 h-8 text-red-500" />
                            <h3 className="text-2xl font-black tracking-widest text-red-500">ACT</h3>
                        </div>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Policy-guaranteed decommissioning</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Automated GitOps Pull Requests</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Audit-logged IAM action triggers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
