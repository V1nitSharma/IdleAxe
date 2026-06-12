import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LiveSwarmExecution() {
    const [containerState, setContainerState] = useState('ACTIVE');

    useEffect(() => {
        const interval = setInterval(() => {
            setContainerState(prev => prev === 'ACTIVE' ? 'TERMINATED' : 'ACTIVE');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="demo" className="py-24 bg-[#050816] relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Terminal */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Live Swarm Orchestration</h2>
                        <p className="text-gray-400 mb-8 text-lg">Watch as the autonomous agents scan, context-check, and safely suggest optimizations in real-time.</p>
                        
                        <div className="bg-[#0A0A0A] border border-green-500/30 rounded-xl p-4 font-mono text-sm h-[320px] shadow-[0_0_20px_rgba(34,197,94,0.1)] overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-8 bg-[#1A1A1A] border-b border-white/10 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-4 text-xs text-gray-500">swarm-agent-executor</span>
                            </div>
                            <div className="mt-10 space-y-2 text-green-400">
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}><span>[12:01:04]</span> <span className="text-white">Telemetry scanning: CPU anomaly detected on </span><span className="text-yellow-400">dev-service-c</span></motion.div>
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}><span>[12:01:06]</span> <span className="text-white">Context checking: </span><span className="text-blue-400">Git branch merged 14 days ago. PR closed.</span></motion.div>
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5}}><span>[12:01:08]</span> <span className="text-white">Policy check: Waste Score </span><span className="text-red-400">94/100</span><span className="text-white">. Verification required.</span></motion.div>
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3.5}}><span>[12:01:10]</span> <span className="text-white">Action decided: </span><span className="text-blue-400 font-bold">Propose scale-down</span></motion.div>
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:4.5}}><span>[12:01:12]</span> <span className="text-gray-400">$ gh pr create --title "FinOps: Scale down dev-service-c" --body "Idle container detected. Savings: $24/mo."</span></motion.div>
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:5.0}}><span>[12:01:14]</span> <span className="text-green-500 font-bold">Dry-run complete: Pull Request #412 created. Status: Awaiting Approval.</span></motion.div>
                                <motion.div animate={{opacity: [0, 1, 0]}} transition={{repeat: Infinity, duration: 1}} className="inline-block w-2 h-4 bg-green-400 ml-1 translate-y-1"></motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Infrastructure Viz */}
                    <div className="bg-[#0F172A] border border-white/10 rounded-[20px] p-8 h-[400px] flex flex-col justify-center relative">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl flex items-center justify-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="font-mono text-sm text-blue-400">service-auth</span>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl flex items-center justify-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="font-mono text-sm text-blue-400">service-api</span>
                            </div>
                            
                            <motion.div 
                                animate={containerState === 'ACTIVE' 
                                    ? { borderColor: 'rgba(239, 68, 68, 0.5)', backgroundColor: 'rgba(239, 68, 68, 0.1)', opacity: 1, scale: 1 } 
                                    : { borderColor: 'rgba(107, 114, 128, 0.2)', backgroundColor: 'transparent', opacity: 0.5, scale: 0.95 }}
                                className="border p-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden"
                            >
                                {containerState === 'ACTIVE' ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                        <span className="font-mono text-sm text-red-400">dev-service-c</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-mono text-sm text-gray-500 line-through">dev-service-c</span>
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm text-blue-500 font-bold text-xs tracking-widest uppercase">
                                            PR Opened
                                        </div>
                                    </>
                                )}
                            </motion.div>

                            <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded-xl flex items-center justify-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="font-mono text-sm text-blue-400">service-web</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
