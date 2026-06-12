import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Server, Activity, CheckSquare, BarChart2, Settings } from 'lucide-react';
import IdleAxeLogo from './IdleAxeLogo';

export default function Sidebar() {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Server, label: 'Resources' },
        { icon: Activity, label: 'Audit Feed' },
        { icon: CheckSquare, label: 'Approvals' },
        { icon: BarChart2, label: 'Analytics' },
        { icon: Settings, label: 'Settings' }
    ];

    return (
        <aside className="w-20 lg:w-64 flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 z-20">
            <Link to="/" className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <IdleAxeLogo size={28} showText={false} className="lg:hidden" />
                <span className="hidden lg:block"><IdleAxeLogo size={28} /></span>
            </Link>

            <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
                            item.active 
                                ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0 mx-auto lg:mx-0" />
                        <span className="ml-3 font-medium text-sm hidden lg:block">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-center lg:justify-start p-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center text-emerald-700 text-xs font-bold">
                        A
                    </div>
                    <div className="ml-3 hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Cloud Operations</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
