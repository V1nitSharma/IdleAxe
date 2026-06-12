import React from 'react';

export default function TopNav() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            </div>

            <div className="flex items-center gap-6">
                {/* System Status */}
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Audit Agent
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Context Agent
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Guard Agent
                    </div>
                </div>
            </div>
        </header>
    );
}
