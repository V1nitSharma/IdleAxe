import React, { useEffect, useRef } from 'react';

export default function LiveAuditFeed({ logs = [] }) {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Helper to get agent specific color tags
    const getAgentBadge = (agent) => {
        switch (agent?.toLowerCase()) {
            case 'audit agent':
                return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
            case 'context agent':
                return 'bg-purple-50 text-purple-600 border border-purple-100';
            case 'guard agent':
                return 'bg-rose-50 text-rose-600 border border-rose-100';
            case 'human override':
                return 'bg-amber-50 text-amber-600 border border-amber-100';
            case 'system override':
                return 'bg-red-50 text-red-600 border border-red-100';
            default:
                return 'bg-gray-50 text-gray-600 border border-gray-100';
        }
    };

    return (
        <div className="saas-card h-[400px] flex flex-col overflow-hidden bg-white shadow-sm border border-gray-200/50 rounded-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center">
                    Live Audit Feed
                    <span className="ml-3 relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </h3>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 font-mono text-xs"
            >
                {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 font-sans">
                        <p>Waiting for Swarm Scan Activity...</p>
                    </div>
                ) : (
                    logs.map((log) => {
                        const timeString = log.timestamp 
                            ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : '00:00';

                        return (
                            <div key={log.id} className="p-2.5 rounded-lg border border-gray-200/40 bg-white shadow-sm flex items-start gap-3 transition-colors hover:bg-gray-50/30">
                                <span className="text-gray-400 font-semibold shrink-0 mt-0.5">[{timeString}]</span>
                                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider w-fit font-sans ${getAgentBadge(log.agent_name)}`}>
                                        {log.agent_name}
                                    </span>
                                    <span className="text-gray-700 leading-normal break-words">{log.action}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
