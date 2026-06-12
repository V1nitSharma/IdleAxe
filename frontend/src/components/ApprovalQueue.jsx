import React, { useState } from 'react';
import { Server, AlertTriangle } from 'lucide-react';

const mockApprovals = [
  { id: 1, name: 'feature-auth-db', env: 'Staging', wasteScore: 82, riskScore: 14 },
  { id: 2, name: 'legacy-cache-node', env: 'Production', wasteScore: 91, riskScore: 88 },
  { id: 3, name: 'temp-worker-pool', env: 'Development', wasteScore: 75, riskScore: 5 },
];

export default function ApprovalQueue() {
    const [queue, setQueue] = useState(mockApprovals);

    const handleAction = (id) => {
        setQueue(q => q.filter(item => item.id !== id));
    };

    return (
        <div className="saas-card h-[400px] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                    Human Approval Queue ({queue.length})
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {queue.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <CheckSquare className="w-8 h-8 mb-2 opacity-50" />
                        <p>No pending approvals</p>
                    </div>
                ) : (
                    queue.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all bg-white group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Server className="w-4 h-4 text-gray-400" />
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                                        {item.env}
                                    </span>
                                </div>
                                {item.riskScore > 50 && (
                                    <div className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        High Risk
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-4 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Waste:</span>
                                    <span className={`ml-1 font-semibold ${item.wasteScore > 80 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {item.wasteScore}/100
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Risk:</span>
                                    <span className={`ml-1 font-semibold ${item.riskScore > 50 ? 'text-amber-600' : 'text-gray-900'}`}>
                                        {item.riskScore}/100
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAction(item.id)}
                                    className="flex-1 btn-danger text-sm py-2"
                                >
                                    Approve Axe
                                </button>
                                <button 
                                    onClick={() => handleAction(item.id)}
                                    className="flex-1 btn-secondary text-sm py-2"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
