import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Dashboard from '../components/Dashboard';

export default function DashboardLayout() {
    return (
        <div className="theme-dashboard">
            <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans text-[#111827]">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <TopNav />
                    <main className="flex-1 overflow-y-auto">
                        <Dashboard />
                    </main>
                </div>
            </div>
        </div>
    );
}
