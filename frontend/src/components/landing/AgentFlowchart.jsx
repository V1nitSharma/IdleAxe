import React from 'react';
import { motion } from 'framer-motion';

const agents = [
    {
        label: 'Orphaned Resources',
        dotColor: '#22c55e',
        borderColor: 'rgba(100, 116, 139, 0.5)',
        textColor: '#94a3b8',
        bgColor: 'rgba(30, 41, 59, 0.8)',
        glowColor: 'transparent',
    },
    {
        label: 'Audit Agent',
        dotColor: null,
        borderColor: 'rgba(96, 165, 250, 0.5)',
        textColor: '#93c5fd',
        bgColor: 'rgba(30, 58, 138, 0.25)',
        glowColor: 'rgba(59, 130, 246, 0.15)',
        lineColor: '#3b82f6',
        nodeDotColor: '#60a5fa',
    },
    {
        label: 'Context Agent',
        dotColor: null,
        borderColor: 'rgba(192, 132, 252, 0.5)',
        textColor: '#c084fc',
        bgColor: 'rgba(88, 28, 135, 0.25)',
        glowColor: 'rgba(147, 51, 234, 0.15)',
        lineColor: '#a855f7',
        nodeDotColor: '#c084fc',
    },
    {
        label: 'Guard Agent',
        dotColor: null,
        borderColor: 'rgba(248, 113, 113, 0.5)',
        textColor: '#f87171',
        bgColor: 'rgba(127, 29, 29, 0.25)',
        glowColor: 'rgba(239, 68, 68, 0.2)',
        lineColor: '#ef4444',
        nodeDotColor: '#f87171',
    },
];

export default function AgentFlowchart() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
        >
            <div
                style={{
                    background: 'linear-gradient(145deg, rgba(10,15,36,0.95), rgba(5,8,6,0.98))',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '32px 36px',
                    minWidth: '280px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                    {agents.map((agent, i) => (
                        <React.Fragment key={agent.label}>
                            {/* Connector line + dot */}
                            {i > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                                        style={{
                                            width: '2px',
                                            height: '28px',
                                            background: agent.lineColor,
                                            transformOrigin: 'top',
                                        }}
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.7 + i * 0.2 }}
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: agent.nodeDotColor,
                                            boxShadow: `0 0 8px ${agent.nodeDotColor}`,
                                        }}
                                    />
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ duration: 0.4, delay: 0.8 + i * 0.2 }}
                                        style={{
                                            width: '2px',
                                            height: '28px',
                                            background: agent.lineColor,
                                            transformOrigin: 'top',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Agent node */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 22px',
                                    borderRadius: '10px',
                                    border: `1.5px solid ${agent.borderColor}`,
                                    background: agent.bgColor,
                                    boxShadow: `0 0 20px ${agent.glowColor}`,
                                    minWidth: '200px',
                                    justifyContent: 'center',
                                }}
                            >
                                {agent.dotColor && (
                                    <span
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: agent.dotColor,
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <span
                                    style={{
                                        color: agent.textColor,
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {agent.label}
                                </span>
                            </motion.div>
                        </React.Fragment>
                    ))}

                    {/* TERMINATED label */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        style={{
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                            letterSpacing: '0.15em',
                            marginTop: '4px',
                        }}
                    >
                        [ TERMINATED ]
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
}
