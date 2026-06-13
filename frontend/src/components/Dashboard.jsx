import React, { useEffect, useState } from 'react';
import { DollarSign, Server, Trash2, Crosshair } from 'lucide-react';
import KPICard from './KPICard';
import CloudSavingsChart from './CloudSavingsChart';
import ResourceStatusChart from './ResourceStatusChart';
import AgentActivityChart from './AgentActivityChart';
import TopWasteChart from './TopWasteChart';
import MonthlyCostReduction from './MonthlyCostReduction';
import LiveAuditFeed from './LiveAuditFeed';
import ApprovalQueue from './ApprovalQueue';
import InfrastructureGraph from './InfrastructureGraph';
import ActiveResources from '../features/dashboard/ActiveResources';
import { fetchStats, fetchLogs, fetchPending, fetchResources, approveAxe, rejectAxe } from '../api/client';

export default function Dashboard() {
    const [stats, setStats] = useState({
        money_saved: 0,
        active_containers: 0,
        terminated_containers: 0,
        total_resources: 0
    });
    const [resources, setResources] = useState([]);
    const [pending, setPending] = useState([]);
    const [logs, setLogs] = useState([]);

    const loadData = async () => {
        try {
            const [statsData, resourcesData, pendingData, logsData] = await Promise.all([
                fetchStats(),
                fetchResources(),
                fetchPending(),
                fetchLogs()
            ]);
            setStats(statsData);
            setResources(resourcesData);
            setPending(pendingData);
            setLogs(logsData);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        }
    };

    // Poll backend every 2.5 seconds
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 2500);
        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveAxe(id);
            // Instant feedback
            setPending(prev => prev.filter(p => p.container_id !== id));
            loadData();
        } catch (err) {
            console.error("Failed to approve resource:", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectAxe(id);
            // Instant feedback
            setPending(prev => prev.filter(p => p.container_id !== id));
            loadData();
        } catch (err) {
            console.error("Failed to reject resource:", err);
        }
    };

    const handleAxe = async (id) => {
        try {
            await approveAxe(id);
            // Instant feedback
            setResources(prev => prev.filter(r => r.container_id !== id));
            loadData();
        } catch (err) {
            console.error("Failed to direct-axe resource:", err);
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
            {/* ROW 1: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Money Saved" value={stats.money_saved} prefix="$" trend={18} trendLabel="this week" icon={DollarSign} color="emerald" />
                <KPICard title="Active Resources" value={stats.active_containers} icon={Server} color="emerald" />
                <KPICard title="Resources Terminated" value={stats.terminated_containers} icon={Trash2} color="amber" />
                <KPICard title="Waste Detection Rate" value={stats.active_containers > 0 ? 91 : 0} suffix="%" icon={Crosshair} color="red" />
            </div>

            {/* ROW 2: Sparklines / Active Resources Grid */}
            <div className="w-full">
                <ActiveResources resources={resources} onAxe={handleAxe} isSimulating={false} onSpawn={loadData} />
            </div>

            {/* ROW 3: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><CloudSavingsChart /></div>
                <div><ResourceStatusChart /></div>
            </div>

            {/* ROW 4: Live feeds and queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div><LiveAuditFeed logs={logs} /></div>
                <div><ApprovalQueue pending={pending} onApprove={handleApprove} onReject={handleReject} /></div>
            </div>

            {/* ROW 5: Flow charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div><AgentActivityChart /></div>
                <div><TopWasteChart /></div>
                <div><MonthlyCostReduction /></div>
            </div>

            {/* ROW 6: Topological Infra overview */}
            <div className="w-full">
                <InfrastructureGraph />
            </div>
        </div>
    );
}
