import { useEffect, useState, useRef } from 'react';
import { fetchLogs } from '../../api/client';

// Agent name → color mapping
const agentColors = {
    'Audit Agent':    { text: 'text-cyan-400',    dot: 'bg-cyan-400',    border: 'border-cyan-500/30' },
    'Context Agent':  { text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
    'Guard Agent':    { text: 'text-rose-400',     dot: 'bg-rose-400',    border: 'border-rose-500/30' },
    'Human Override': { text: 'text-purple-400',   dot: 'bg-purple-400',  border: 'border-purple-500/30' },
};

const defaultColor = { text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' };

export default function AuditFeed({ logs: propLogs }) {
    const [localLogs, setLocalLogs] = useState([]);
    const scrollRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (propLogs) return; // Use props if provided

        const doFetch = async () => {
            try {
                const data = await fetchLogs();
                setLocalLogs(data);
            } catch (e) { /* backend may be booting */ }
        };
        doFetch();
        const interval = setInterval(doFetch, 2000);
        return () => clearInterval(interval);
    }, [propLogs]);

    const logs = propLogs || localLogs;

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [logs, autoScroll]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        // If user scrolled up more than 80px from bottom, disable auto-scroll
        setAutoScroll(scrollHeight - scrollTop - clientHeight < 80);
    };

    return (
        <div className="terminal h-full flex flex-col animate-fade-in">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    {/* Traffic light dots */}
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                    </div>
                    <span className="text-slate-600 text-[10px] font-mono ml-2">
                        agent-swarm-terminal
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${autoScroll ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className="text-slate-600 text-[10px] font-mono uppercase">
                        {autoScroll ? 'live' : 'paused'}
                    </span>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-grow px-4 pt-3 pb-2 relative z-10 min-h-0">
                {/* Prompt Line */}
                <div className="text-[10px] font-mono text-slate-700 mb-3">
                    <span className="text-emerald-700">idleaxe</span>
                    <span className="text-slate-700">@</span>
                    <span className="text-cyan-700">swarm</span>
                    <span className="text-slate-700">:~$ </span>
                    <span className="text-slate-500">tail -f /var/log/agents.log</span>
                </div>

                {/* Log Entries */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 pr-1"
                    style={{ maxHeight: 'calc(100% - 40px)' }}
                >
                    {logs.length === 0 ? (
                        <div className="text-slate-700 animate-glow-pulse py-8 text-center">
                            waiting for agent activity...
                            <span className="terminal-cursor"></span>
                        </div>
                    ) : (
                        <>
                            {logs.map((log, i) => {
                                const colors = agentColors[log.agent_name] || defaultColor;
                                return (
                                    <div
                                        key={log.id}
                                        className={`log-entry border-l-2 ${colors.border} pl-2.5 py-1 hover:bg-white/[0.015] rounded-r transition-colors`}
                                        style={{ animationDelay: `${i * 20}ms` }}
                                    >
                                        <span className="text-slate-600">
                                            [{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}]
                                        </span>
                                        <span className={`${colors.text} ml-1.5 font-bold`}>
                                            {log.agent_name}
                                        </span>
                                        <span className="text-slate-500 mx-1">→</span>
                                        <span className="text-slate-400">{log.action}</span>
                                        {log.container_id && (
                                            <span className="text-slate-700 ml-1.5 text-[10px]">
                                                [{log.container_id.substring(0, 8)}]
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Blinking cursor at end */}
                            <div className="pl-2.5 py-1">
                                <span className="terminal-cursor"></span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}