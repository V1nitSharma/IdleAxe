import { useEffect, useState } from 'react';

// Single Resource Card with live sparkline and cost accumulator
function ResourceCard({ resource, onAxe, isSimulating }) {
    const [history, setHistory] = useState(resource.cpuHistory || Array(10).fill(5));
    const [cpu, setCpu] = useState(resource.cpuHistory ? resource.cpuHistory[resource.cpuHistory.length - 1] : 5);
    const [mem, setMem] = useState(32.4);
    const [costAccumulator, setCostAccumulator] = useState(0);

    useEffect(() => {
        // Accumulate cost dynamically ($0.05 per min -> $0.00083 per sec)
        const costInterval = setInterval(() => {
            setCostAccumulator(prev => prev + 0.000833);
        }, 1000);

        // Update telemetry every second to make it feel super dynamic
        const telemetryInterval = setInterval(() => {
            let nextCpu;
            if (isSimulating) {
                // If it's a simulated low-use container, fluctuate under 5%
                if (resource.id && parseInt(resource.id.replace(/\D/g, '')) % 3 !== 0) {
                    nextCpu = Math.max(0.1, Math.min(4.9, cpu + (Math.random() * 2 - 1)));
                } else {
                    nextCpu = Math.max(40, Math.min(85, cpu + (Math.random() * 10 - 5)));
                }
            } else {
                nextCpu = Math.max(0.5, Math.min(99, cpu + (Math.random() * 6 - 3)));
            }

            setCpu(parseFloat(nextCpu.toFixed(1)));
            setHistory(prev => [...prev.slice(1), nextCpu]);
            setMem(prev => Math.max(10, Math.min(90, parseFloat((prev + (Math.random() * 2 - 1)).toFixed(1)))));
        }, 1000);

        return () => {
            clearInterval(costInterval);
            clearInterval(telemetryInterval);
        };
    }, [cpu, isSimulating, resource.id]);

    // Build the SVG sparkline points
    const points = history.map((val, idx) => {
        const x = (idx / (history.length - 1)) * 100;
        // Map 0-100 CPU usage to 30-2 SVG height (upside down)
        const y = 30 - (val / 100) * 28;
        return `${x},${y}`;
    }).join(' ');

    const isHighWaste = cpu < 5.0;

    return (
        <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3.5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2.5">
                    <div className="min-w-0">
                        <h4 className="font-mono text-xs text-slate-300 truncate font-semibold" title={resource.name}>
                            {resource.name}
                        </h4>
                        <p className="text-[9px] text-slate-600 font-mono mt-0.5 truncate">
                            ID: {resource.container_id.substring(0, 12)}
                        </p>
                    </div>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                        isHighWaste
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                    }`}>
                        {isHighWaste ? 'WASTE ANOMALY' : 'OPTIMAL'}
                    </span>
                </div>

                {/* Telemetry Numbers */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-black/20 p-2 rounded-lg border border-white/[0.02]">
                    <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">CPU Usage</div>
                        <div className={`font-mono text-xs font-bold ${isHighWaste ? 'text-rose-400' : 'text-slate-300'}`}>
                            {cpu}%
                        </div>
                    </div>
                    <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Memory</div>
                        <div className="font-mono text-xs text-slate-300 font-semibold">{mem}%</div>
                    </div>
                </div>

                {/* Live Sparkline */}
                <div className="h-8 w-full bg-black/10 rounded overflow-hidden relative mb-3 border border-white/[0.01]">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                        {/* Sparkline Path */}
                        <polyline
                            fill="none"
                            stroke={isHighWaste ? '#f43f5e' : '#22d3ee'}
                            strokeWidth="1.5"
                            points={points}
                        />
                    </svg>
                </div>
            </div>

            {/* Footer / Costs */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1">
                <div>
                    <div className="text-[8px] text-slate-600 uppercase font-mono">Waste Cost Accumulator</div>
                    <div className={`text-[10px] font-mono font-bold ${isHighWaste ? 'text-rose-500' : 'text-slate-400'}`}>
                        ${costAccumulator.toFixed(4)}
                    </div>
                </div>
                <button
                    onClick={() => onAxe(resource.container_id)}
                    className="text-[9px] font-mono text-rose-500 hover:text-white hover:bg-rose-600/80 px-2 py-1 rounded border border-rose-500/20 hover:border-rose-500/0 transition-all"
                >
                    🪓 Axe
                </button>
            </div>
        </div>
    );
}

export default function ActiveResources({ resources, onAxe, isSimulating, onSpawn }) {
    return (
        <div className="glass-card p-5 h-full flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Active Resources Swarm
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/spawn', { method: 'POST' });
                                if (res.ok && onSpawn) {
                                    onSpawn();
                                }
                            } catch (err) {
                                console.error("Failed to spawn containers:", err);
                            }
                        }}
                        className="text-[10px] font-mono text-cyan-400 hover:text-white bg-cyan-500/5 hover:bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/25 transition-all duration-200 cursor-pointer"
                    >
                        + Provision 3 Containers
                    </button>
                    <span className="text-[10px] font-mono text-cyan-600/60 bg-cyan-500/5 px-2 py-0.5 rounded-full border border-cyan-500/10">
                        {resources.length} active
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-grow overflow-y-auto min-h-0 pr-1">
                {resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <svg className="w-10 h-10 text-slate-700 animate-float mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        </svg>
                        <p className="text-slate-600 text-xs font-semibold">No active resources</p>
                        <p className="text-slate-700 text-[9px] font-mono mt-0.5">Use the simulator panel to spawn assets</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {resources.map(res => (
                            <ResourceCard
                                key={res.container_id}
                                resource={res}
                                onAxe={onAxe}
                                isSimulating={isSimulating}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
