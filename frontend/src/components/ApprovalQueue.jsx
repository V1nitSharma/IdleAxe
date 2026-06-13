import React from 'react';
import { Server, AlertTriangle, CheckSquare } from 'lucide-react';

export default function ApprovalQueue({ pending = [], onApprove, onReject }) {
    return (
        <div className="saas-card h-[400px] flex flex-col overflow-hidden bg-white shadow-sm border border-gray-200/50 rounded-2xl">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Human Approval Queue ({pending.length})
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {pending.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <CheckSquare className="w-8 h-8 mb-2 opacity-50 text-emerald-500" />
                        <p className="text-sm font-medium">No pending approvals</p>
                    </div>
                ) : (
                    pending.map(item => {
                        // Deriving Environment from container name
                        let env = 'Development';
                        if (item.name?.toLowerCase().includes('prod')) env = 'Production';
                        else if (item.name?.toLowerCase().includes('stage') || item.name?.toLowerCase().includes('billing')) env = 'Staging';

                        // Derive Risk Score from Waste Score
                        const riskScore = Math.max(12, Math.floor((item.waste_score || 65) * 0.85));

                        return (
                            <div key={item.container_id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all bg-white group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Server className="w-4 h-4 text-gray-400 shrink-0" />
                                            <h4 className="font-semibold text-gray-900 truncate" title={item.name}>
                                                {item.name}
                                            </h4>
                                        </div>
                                        <div className="flex gap-2 items-center mt-1.5">
                                            <span className="text-[10px] font-mono text-gray-400">
                                                ID: {item.container_id?.substring(0, 12)}
                                            </span>
                                            <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                {env}
                                            </span>
                                        </div>
                                    </div>
                                    {riskScore > 50 && (
                                        <div className="flex items-center text-amber-600 text-[10px] font-medium bg-amber-50 px-2 py-0.5 rounded shrink-0">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            High Risk
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-4 mb-4 text-xs">
                                    <div>
                                        <span className="text-gray-500">Waste Score:</span>
                                        <span className={`ml-1 font-semibold ${item.waste_score > 80 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {item.waste_score}/100
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Risk Assessment:</span>
                                        <span className={`ml-1 font-semibold ${riskScore > 50 ? 'text-amber-600' : 'text-gray-900'}`}>
                                            {riskScore}/100
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onApprove && onApprove(item.container_id)}
                                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-lg transition-smooth shadow-sm cursor-pointer"
                                    >
                                        Approve Axe
                                    </button>
                                    <button 
                                        onClick={() => onReject && onReject(item.container_id)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 rounded-lg transition-smooth cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
