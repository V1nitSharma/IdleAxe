import { useEffect, useState, useRef } from 'react';
import { fetchStats } from '../../api/client';

// Animated counter hook
function useAnimatedValue(target, duration = 600) {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);
    const raf = useRef(null);

    useEffect(() => {
        const start = prev.current;
        const diff = target - start;
        if (diff === 0) return;

        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + diff * eased));

            if (progress < 1) {
                raf.current = requestAnimationFrame(step);
            } else {
                prev.current = target;
            }
        };

        raf.current = requestAnimationFrame(step);
        return () => raf.current && cancelAnimationFrame(raf.current);
    }, [target, duration]);

    return display;
}

// SVG Icons
const DollarIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const ServerIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
);

const SkullIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="8" />
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        <circle cx="15" cy="9" r="1.5" fill="currentColor" />
        <path d="M9 18v3M12 18v3M15 18v3" />
        <path d="M10 14a2 2 0 0 0 4 0" />
    </svg>
);

export default function StatsTicker({ stats: propStats }) {
    const [localStats, setLocalStats] = useState({
        money_saved: 0,
        active_containers: 0,
        terminated_containers: 0,
        total_resources: 0,
    });

    useEffect(() => {
        if (propStats) return; // Use props if provided

        // Fetch immediately, then poll
        const doFetch = async () => {
            try {
                const data = await fetchStats();
                setLocalStats(data);
            } catch (e) { /* backend may be booting */ }
        };
        doFetch();
        const interval = setInterval(doFetch, 2000);
        return () => clearInterval(interval);
    }, [propStats]);

    const stats = propStats || localStats;

    const animatedSaved = useAnimatedValue(stats.money_saved);
    const animatedActive = useAnimatedValue(stats.active_containers, 400);
    const animatedTerminated = useAnimatedValue(stats.terminated_containers, 400);

    return (
        <div className="grid grid-cols-3 gap-4 animate-fade-in">
            {/* Hero: Money Saved */}
            <div className="col-span-3 glass-card stat-card stat-card-emerald p-5 text-center group hover:shadow-glow-emerald transition-shadow duration-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-emerald-500/50">
                        <DollarIcon />
                    </span>
                    <h2 className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-semibold">
                        Total Monthly Savings
                    </h2>
                </div>
                <div className="text-5xl sm:text-6xl font-black text-emerald-400 text-glow-emerald tracking-tight">
                    ${animatedSaved.toLocaleString()}
                </div>
                <p className="text-emerald-600/60 text-[10px] mt-2 font-mono">
                    est. ${(animatedSaved * 12).toLocaleString()}/yr
                </p>
            </div>

            {/* Active Resources */}
            <div className="glass-card stat-card stat-card-blue p-4 text-center group hover:shadow-glow-cyan transition-shadow duration-500 animate-fade-in-up animate-delay-100">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className="text-cyan-500/50"><ServerIcon /></span>
                    <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Active</h3>
                </div>
                <div className="text-3xl font-bold text-cyan-400">{animatedActive}</div>
                <p className="text-slate-700 text-[10px] mt-1 font-mono">resources</p>
            </div>

            {/* Axed Resources */}
            <div className="glass-card stat-card stat-card-red p-4 text-center group hover:shadow-glow-crimson transition-shadow duration-500 animate-fade-in-up animate-delay-200">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className="text-rose-500/50"><SkullIcon /></span>
                    <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Axed</h3>
                </div>
                <div className="text-3xl font-bold text-rose-400">{animatedTerminated}</div>
                <p className="text-slate-700 text-[10px] mt-1 font-mono">terminated</p>
            </div>

            {/* Efficiency Rate */}
            <div className="glass-card stat-card p-4 text-center group hover:border-purple-500/20 transition-all duration-500 animate-fade-in-up animate-delay-300">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className="text-purple-500/50">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    </span>
                    <h3 className="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-semibold">Efficiency</h3>
                </div>
                <div className="text-3xl font-bold text-purple-400">
                    {stats.total_resources > 0
                        ? Math.round((stats.terminated_containers / stats.total_resources) * 100)
                        : 0
                    }%
                </div>
                <p className="text-slate-700 text-[10px] mt-1 font-mono">waste cleaned</p>
            </div>
        </div>
    );
}