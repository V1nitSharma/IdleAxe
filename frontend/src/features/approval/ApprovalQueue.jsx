import { useEffect, useState } from 'react';
import { fetchPending, approveAxe } from '../../api/client';

function WasteBar({ score }) {
    const color =
        score >= 80 ? 'bg-gradient-to-r from-red-500 to-rose-400' :
        score >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                      'bg-gradient-to-r from-emerald-500 to-green-400';

    return (
        <div className="waste-bar-track mt-1.5">
            <div
                className={`waste-bar-fill ${color}`}
                style={{ width: `${score}%` }}
            />
        </div>
    );
}

export default function ApprovalQueue({ pending: propPending, onApprove }) {
    const [localPending, setLocalPending] = useState([]);
    const [approving, setApproving] = useState(null); // track which button is loading

    useEffect(() => {
        if (propPending) return; // Use props if provided

        const doFetch = async () => {
            try {
                const data = await fetchPending();
                setLocalPending(data);
            } catch (e) { /* backend may be booting */ }
        };
        doFetch();
        const interval = setInterval(doFetch, 3000);
        return () => clearInterval(interval);
    }, [propPending]);

    const pending = propPending || localPending;

    const handleApprove = async (id) => {
        setApproving(id);
        if (onApprove) {
            await onApprove(id);
        } else {
            try {
                await approveAxe(id);
                setLocalPending(prev => prev.filter(item => item.container_id !== id));
            } catch (e) {
                console.error('Approval failed:', e);
            }
        }
        setApproving(null);
    };

    return (
        <div className="glass-card-amber p-5 h-full flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-amber-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Human Approval Required
                </h2>
                <span className="text-[10px] font-mono text-amber-600/60 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                    {pending.length} pending
                </span>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto space-y-2.5 min-h-0 pr-1">
                {pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fade-in">
                        {/* Animated Axe Icon */}
                        <div className="animate-float mb-4">
                            <svg className="w-12 h-12 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 12l-4 4V8l4 4z" fill="currentColor" opacity="0.15" />
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8M12 8v8" strokeDasharray="2 2" />
                            </svg>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">No pending approvals</p>
                        <p className="text-slate-700 text-[10px] font-mono mt-1">swarm is operating autonomously</p>
                    </div>
                ) : (
                    pending.map((item, i) => (
                        <div
                            key={item.container_id}
                            className="approval-item bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 group hover:border-amber-500/15 transition-colors duration-300"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-slate-300 truncate">
                                        {item.container_id.substring(0, 12)}
                                    </span>
                                    {item.name && (
                                        <span className="text-[9px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded font-medium truncate">
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-600 font-mono">
                                        waste: {item.waste_score}/100
                                    </span>
                                </div>
                                <WasteBar score={item.waste_score} />
                            </div>
                            <button
                                onClick={() => handleApprove(item.container_id)}
                                disabled={approving === item.container_id}
                                className={`btn-axe flex-shrink-0 ${approving === item.container_id ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                {approving === item.container_id ? (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 60" />
                                        </svg>
                                        Axing...
                                    </span>
                                ) : (
                                    '🪓 Approve Axe'
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}