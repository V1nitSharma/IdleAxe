import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Dashboard from '../components/Dashboard';

export default function DashboardLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('idleaxe_auth') !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

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
