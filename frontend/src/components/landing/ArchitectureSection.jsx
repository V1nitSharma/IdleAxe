import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Server, Database, Code, Cpu } from 'lucide-react';

export default function ArchitectureSection() {
    return (
        <section id="architecture" className="py-24 bg-[#050816] relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">How IdleAxe Works</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Enterprise-grade architecture designed for scale, security, and performance.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 opacity-20 hidden md:block"></div>
                    
                    <div className="space-y-6">
                        {[
                            { icon: Layers, name: 'React Dashboard', desc: 'Command Center UI', color: 'blue' },
                            { icon: Server, name: 'FastAPI Control Plane', desc: 'High-performance orchestration API', color: 'indigo' },
                            { icon: Database, name: 'PostgreSQL State Ledger', desc: 'Tamper-evident, locked-down activity history', color: 'purple' },
                            { icon: Cpu, name: 'NVIDIA NIM Agent Swarm', desc: 'Context parsing engine (scanning commits & logs)', color: 'red' },
                            { icon: Code, name: 'Cloud & K8s Infrastructure', desc: 'Kubernetes / GitOps deployment target', color: 'amber' },
                        ].map((layer, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#0F172A] border border-white/10 rounded-xl p-6 flex items-center gap-6 relative z-10 hover:border-white/30 transition-colors cursor-default"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${layer.color}-500/10 border border-${layer.color}-500/20 shrink-0`}>
                                    <layer.icon className={`w-6 h-6 text-${layer.color}-500`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{layer.name}</h3>
                                    <p className="text-gray-400 text-sm">{layer.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
