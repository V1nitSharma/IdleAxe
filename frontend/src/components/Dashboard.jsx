import React from 'react';
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

export default function Dashboard() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
            {/* ROW 1: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Money Saved" value={12430} prefix="$" trend={18} trendLabel="this week" icon={DollarSign} color="emerald" />
                <KPICard title="Active Resources" value={84} icon={Server} color="emerald" />
                <KPICard title="Resources Terminated" value={23} icon={Trash2} color="amber" />
                <KPICard title="Waste Detection Rate" value={91} suffix="%" icon={Crosshair} color="red" />
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><CloudSavingsChart /></div>
                <div><ResourceStatusChart /></div>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div><AgentActivityChart /></div>
                <div><TopWasteChart /></div>
                <div><MonthlyCostReduction /></div>
            </div>

            {/* ROW 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div><LiveAuditFeed /></div>
                <div><ApprovalQueue /></div>
            </div>

            {/* ROW 5 */}
            <div className="w-full">
                <InfrastructureGraph />
            </div>
        </div>
    );
}
