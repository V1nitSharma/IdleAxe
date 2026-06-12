import { useEffect, useState } from 'react';

export default function PredictiveSavingsChart({ stats }) {
    const [points, setPoints] = useState('');
    const [projected, setProjected] = useState(0);

    const terminatedCount = stats.terminated_containers || 0;
    const currentSavings = stats.money_saved || 0;

    useEffect(() => {
        // Project 30-day savings
        const dailyRate = terminatedCount * 1.5; // $1.5/day per terminated container
        const nextProjected = currentSavings + (dailyRate * 30);
        setProjected(Math.round(nextProjected));

        // Generate SVG points for a 30-day curve
        const curvePoints = [];
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * 100;
            // Compound curve for visual growth
            const progress = i / steps;
            const savingsVal = currentSavings + (nextProjected - currentSavings) * Math.pow(progress, 1.2);
            // Map savings to SVG height 60-10 (inverted)
            const y = 60 - ((savingsVal / (nextProjected || 1)) * 45);
            curvePoints.push(`${x},${y}`);
        }
        setPoints(curvePoints.join(' '));
    }, [terminatedCount, currentSavings]);

    return (
        <div className="glass-card p-5 flex flex-col justify-between h-[200px] relative overflow-hidden">
            {/* Ambient savings glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
                    <svg className="w-4.5 h-4.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Predictive ROI Analytics
                </h3>
                <p className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-wider">
                    Projected 30-Day Enterprise Savings
                </p>
            </div>

            {/* Glowing Chart */}
            <div className="h-16 w-full relative my-1 bg-black/10 rounded overflow-hidden border border-white/[0.01]">
                <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    {/* Area fill */}
                    {points && (
                        <polygon
                            fill="url(#area-grad)"
                            points={`0,60 ${points} 100,60`}
                        />
                    )}
                    {/* Glow stroke */}
                    <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        points={points}
                    />
                </svg>
            </div>

            {/* Savings stats */}
            <div className="flex justify-between items-baseline mt-1 border-t border-white/5 pt-2 font-mono">
                <div>
                    <span className="text-[8px] text-slate-600 uppercase">Current Savings</span>
                    <div className="text-sm font-black text-slate-300">${currentSavings}</div>
                </div>
                <div className="text-right">
                    <span className="text-[8px] text-emerald-600 uppercase font-bold">Projected Net</span>
                    <div className="text-base font-black text-emerald-400 text-glow-emerald">${projected}</div>
                </div>
            </div>
        </div>
    );
}
