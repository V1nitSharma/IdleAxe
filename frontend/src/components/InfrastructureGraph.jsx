import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, BrainCircuit, ShieldAlert, Trash2 } from 'lucide-react';

export default function InfrastructureGraph() {
    const [activePath, setActivePath] = useState(0);

    // Animate paths periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setActivePath(p => (p + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const nodes = [
        { id: 'resources', icon: Database, label: 'Cloud Resources', color: 'bg-blue-100 text-blue-600', x: '10%', y: '50%' },
        { id: 'audit', icon: Search, label: 'Audit Agent', color: 'bg-indigo-100 text-indigo-600', x: '35%', y: '20%' },
        { id: 'context', icon: BrainCircuit, label: 'Context Agent', color: 'bg-purple-100 text-purple-600', x: '60%', y: '50%' },
        { id: 'guard', icon: ShieldAlert, label: 'Guard Agent', color: 'bg-amber-100 text-amber-600', x: '85%', y: '20%' },
        { id: 'terminated', icon: Trash2, label: 'Terminated', color: 'bg-red-100 text-red-600', x: '85%', y: '80%' },
    ];

    return (
        <div className="saas-card h-[400px] flex flex-col p-6 relative overflow-hidden bg-white">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight z-10">Infrastructure Overview</h3>
            
            <div className="flex-1 relative w-full h-full mt-4">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    {/* Path from Resources to Audit */}
                    <path d="M 15% 50% Q 25% 20% 35% 20%" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                    <motion.path 
                        d="M 15% 50% Q 25% 20% 35% 20%" 
                        fill="none" 
                        stroke="#4F46E5" 
                        strokeWidth="3"
                        strokeDasharray="5 5"
                        animate={{ strokeDashoffset: activePath === 0 ? 0 : 50, opacity: activePath === 0 ? 1 : 0.2 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Path from Audit to Context */}
                    <path d="M 35% 20% Q 47% 50% 60% 50%" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                    <motion.path 
                        d="M 35% 20% Q 47% 50% 60% 50%" 
                        fill="none" 
                        stroke="#9333EA" 
                        strokeWidth="3"
                        strokeDasharray="5 5"
                        animate={{ strokeDashoffset: activePath === 1 ? 0 : 50, opacity: activePath === 1 ? 1 : 0.2 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Path from Context to Guard */}
                    <path d="M 60% 50% Q 72% 20% 85% 20%" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                    <motion.path 
                        d="M 60% 50% Q 72% 20% 85% 20%" 
                        fill="none" 
                        stroke="#D97706" 
                        strokeWidth="3"
                        strokeDasharray="5 5"
                        animate={{ strokeDashoffset: activePath === 2 ? 0 : 50, opacity: activePath === 2 ? 1 : 0.2 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                     {/* Path from Context to Terminated (Direct Axe) */}
                     <path d="M 60% 50% Q 72% 80% 85% 80%" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <motion.div 
                        key={node.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                        style={{ left: node.x, top: node.y }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-2 border-white ${node.color} z-10`}>
                            <node.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-gray-100 shadow-sm whitespace-nowrap">
                            {node.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
