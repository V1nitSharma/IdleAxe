import React, { useEffect, useRef, useState } from 'react';

const mockLogs = [
    { time: '12:01', msg: 'Resource scanned: staging-api-worker' },
    { time: '12:02', msg: 'CPU anomaly detected on test-db-4' },
    { time: '12:03', msg: 'Git branch inactive for 14 days: feature-auth-v2' },
    { time: '12:04', msg: 'Waste score 94 calculated for feature-auth-v2' },
    { time: '12:05', msg: 'Resource terminated by Guard Agent' },
    { time: '12:06', msg: 'Savings +$14/month' },
];

export default function LiveAuditFeed() {
    const scrollRef = useRef(null);
    const [logs, setLogs] = useState(mockLogs);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Simulate incoming logs
    useEffect(() => {
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const actions = [
                'Context scan completed',
                'Waste score 88 generated',
                'Awaiting human approval',
                'Resource idle for 48h',
                'Guard Agent dispatched'
            ];
            const msg = actions[Math.floor(Math.random() * actions.length)];
            setLogs(prev => [...prev.slice(-20), { time, msg }]);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="saas-card h-[400px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center">
                    Live Audit Feed
                    <span className="ml-3 relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                </h3>
            </div>
            <div 
                ref={scrollRef}
                className="flex-1 terminal-feed p-4 m-4 scroll-smooth"
            >
                {logs.map((log, i) => (
                    <div key={i} className="py-2 terminal-entry text-sm hover:bg-gray-50 flex gap-4 transition-colors">
                        <span className="text-gray-400 shrink-0">[{log.time}]</span>
                        <span className="text-gray-700">{log.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
