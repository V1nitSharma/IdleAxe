import React, { useEffect, useState } from 'react';
import { AlertOctagon } from 'lucide-react';

export default function TopNav() {
    const [isChaos, setIsChaos] = useState(false);

    const checkChaos = async () => {
        try {
            const res = await fetch('/api/chaos');
            if (res.ok) {
                const data = await res.json();
                setIsChaos(data.chaos_mode);
            }
        } catch (err) {
            console.error("Failed to check chaos state:", err);
        }
    };

    useEffect(() => {
        checkChaos();
        const interval = setInterval(checkChaos, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleToggle = async () => {
        const nextState = !isChaos;
        try {
            const res = await fetch('/api/chaos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: nextState })
            });
            if (res.ok) {
                setIsChaos(nextState);
            }
        } catch (err) {
            console.error("Failed to toggle chaos:", err);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Chaos Mode Toggle */}
                <button
                    onClick={handleToggle}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all duration-300 shadow-sm cursor-pointer border ${
                        isChaos
                            ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 animate-pulse shadow-rose-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200'
                    }`}
                >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {isChaos ? 'Chaos Active' : 'Engage Chaos'}
                </button>

                <div className="h-6 w-px bg-gray-200" />

                {/* System Status */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Audit Agent
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Context Agent
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Guard Agent
                    </div>
                </div>
            </div>
        </header>
    );
}
