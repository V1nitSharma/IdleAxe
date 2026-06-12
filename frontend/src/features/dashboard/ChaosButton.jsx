import { useState, useEffect } from 'react';

export default function ChaosButton({ isChaos: propIsChaos, onToggle }) {
    const [localIsChaos, setLocalIsChaos] = useState(false);

    // Sync with prop if provided, otherwise fetch
    const isChaos = propIsChaos !== undefined ? propIsChaos : localIsChaos;

    useEffect(() => {
        if (propIsChaos === undefined) {
            fetch('/api/chaos')
                .then(res => res.json())
                .then(data => setLocalIsChaos(data.chaos_mode))
                .catch(e => console.log("Chaos state fetch ignored: backend offline"));
        }
    }, [propIsChaos]);

    const toggleChaos = async () => {
        const newState = !isChaos;
        if (onToggle) {
            onToggle(newState);
        } else {
            setLocalIsChaos(newState);
            try {
                await fetch('/api/chaos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled: newState })
                });
            } catch (e) {
                console.error("Toggle chaos failed: backend offline", e);
            }
        }
    };

    return (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-lg transition-all duration-300 ${
            isChaos 
                ? 'glass-card-red-active' 
                : 'glass-card-red'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isChaos ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'}`}>
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h3 className={`font-black uppercase tracking-wider text-sm transition-colors duration-300 ${
                        isChaos ? 'text-rose-400 text-glow-crimson' : 'text-slate-300'
                    }`}>
                        System Override: Chaos Mode
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                        {isChaos 
                            ? 'CRITICAL: Injecting artificial 99% CPU/Memory spikes across all containers!' 
                            : 'Force artificial CPU and Memory spikes across the simulated container fleet.'}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={toggleChaos}
                aria-label="Toggle Chaos Mode"
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    isChaos 
                        ? 'bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.6)]' 
                        : 'bg-slate-800 border border-white/5'
                }`}
            >
                <span 
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                        isChaos ? 'translate-x-9' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
