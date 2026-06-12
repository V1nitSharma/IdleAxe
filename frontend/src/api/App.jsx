import { useState, useEffect, useRef } from 'react';
import StatsTicker from '../features/dashboard/StatsTicker';
import ChaosButton from '../features/dashboard/ChaosButton';
import PredictiveSavingsChart from '../features/dashboard/PredictiveSavingsChart';
import ApprovalQueue from '../features/approval/ApprovalQueue';
import AuditFeed from '../features/audit-feed/AuditFeed';
import ActiveResources from '../features/dashboard/ActiveResources';
import { fetchStats, fetchLogs, fetchPending, approveAxe } from './client';
import Login from '../features/auth/Login';

const MOCK_RESOURCE_NAMES = [
    'billing-service-v3', 'auth-worker-2', 'cache-memcached', 
    'payment-router', 'analytics-pipeline', 'user-sync-cron', 
    'pdf-generator-service', 'email-gateway', 'search-index-worker', 
    'log-aggregator-agent', 'session-store-redis', 'image-resizer-v2'
];

export default function App() {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('idleaxe_auth') === 'true';
    });

    // Mode toggles
    const [isSimulatedMode, setIsSimulatedMode] = useState(true);
    const [swarmSpeed, setSwarmSpeed] = useState(3000); // interval ms for swarm cycles
    const [isChaosMode, setIsChaosMode] = useState(false);

    // Swarm State
    const [resources, setResources] = useState([]);
    const [pending, setPending] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        money_saved: 1245,
        active_containers: 0,
        terminated_containers: 27,
        total_resources: 27
    });

    const simulationInterval = useRef(null);

    // Initial load: spawn some mock resources if simulating
    useEffect(() => {
        if (isSimulatedMode && resources.length === 0) {
            spawnMockContainers(6);
            injectLog('System', 'Demo Simulation initiated. Standing by for Swarm Scan.');
        }
    }, [isSimulatedMode]);

    // Polling effect for API Mode OR Simulation Engine for Mock Mode
    useEffect(() => {
        // Clear previous intervals
        if (simulationInterval.current) clearInterval(simulationInterval.current);

        if (!isSimulatedMode) {
            // LIVE BACKEND API MODE
            const pollData = async () => {
                try {
                    const statsData = await fetchStats();
                    setStats(statsData);
                    
                    const logsData = await fetchLogs();
                    setLogs(logsData);

                    const pendingData = await fetchPending();
                    setPending(pendingData);

                    // Poll chaos mode from API to keep state synchronized
                    try {
                        const chaosRes = await fetch('/api/chaos');
                        const chaosData = await chaosRes.json();
                        setIsChaosMode(chaosData.chaos_mode);
                    } catch (err) {
                        console.warn("Failed to fetch chaos state:", err);
                    }

                    // Fetch real database resources including CPU histories
                    try {
                        const resourcesRes = await fetch('/api/resources');
                        const resourcesData = await resourcesRes.json();
                        setResources(resourcesData);
                    } catch (err) {
                        console.warn("Failed to fetch real database resources:", err);
                    }
                } catch (e) {
                    console.error("Backend offline or unreachable. Reverting to simulator mode.", e);
                }
            };
            pollData();
            simulationInterval.current = setInterval(pollData, 3000);
        } else {
            // SIMULATED SWARM ENGINE MODE
            simulationInterval.current = setInterval(() => {
                runSimulationCycle();
            }, swarmSpeed);
        }

        return () => {
            if (simulationInterval.current) clearInterval(simulationInterval.current);
        };
    }, [isSimulatedMode, resources, pending, logs, stats, swarmSpeed, isChaosMode]);

    // Helper: generate log
    const injectLog = (agent, action, containerId = null) => {
        const newLog = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            agent_name: agent,
            action: action,
            container_id: containerId
        };
        setLogs(prev => [...prev.slice(-19), newLog]); // Keep last 20 logs
    };

    // Helper: Spawn mock containers
    const spawnMockContainers = (count) => {
        const newRes = [];
        for (let i = 0; i < count; i++) {
            const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const name = MOCK_RESOURCE_NAMES[Math.floor(Math.random() * MOCK_RESOURCE_NAMES.length)];
            const isWaste = Math.random() > 0.3; // 70% waste candidate
            const initialCpu = isWaste ? Math.random() * 4 : Math.random() * 50 + 30;

            newRes.push({
                container_id: id,
                name: `${name}-${Math.floor(Math.random() * 100)}`,
                status: 'ACTIVE',
                cpuHistory: Array(10).fill(initialCpu),
                isWasteCandidate: isWaste
            });
        }
        setResources(prev => [...prev, ...newRes]);
        setStats(prev => ({
            ...prev,
            active_containers: prev.active_containers + count,
            total_resources: prev.total_resources + count
        }));
    };

    // Trigger Swarm Scan Cycle manually/automatically
    const runSimulationCycle = () => {
        if (resources.length === 0) return;

        // Pick one active or failed resource that is not pending approval yet
        const scanCandidate = resources.find(r => r.status === 'ACTIVE' || r.status === 'EXECUTION_FAILED');
        if (!scanCandidate) return;

        // Perform Audit Agent step
        const prevFailed = scanCandidate.status === 'EXECUTION_FAILED';
        const isWaste = isChaosMode ? false : scanCandidate.isWasteCandidate;
        const cpuReading = isChaosMode ? Math.random() * 14 + 85 : (isWaste ? Math.random() * 4 : Math.random() * 60 + 20);

        if (isWaste || prevFailed) {
            if (prevFailed) {
                injectLog('Audit Agent', `Re-evaluating failed container. Metrics check: CPU at ${cpuReading.toFixed(2)}%. Routing to Context for Reflection.`, scanCandidate.container_id);
            } else {
                injectLog('Audit Agent', `Detected anomaly. CPU at ${cpuReading.toFixed(2)}%. Marked as FLAGGED.`, scanCandidate.container_id);
            }
            
            // Mark candidate in resources list
            setResources(prev => prev.map(r => 
                r.container_id === scanCandidate.container_id ? { ...r, status: prevFailed ? 'EXECUTION_FAILED' : 'FLAGGED' } : r
            ));

            // Context Agent analyzes it immediately
            setTimeout(() => {
                if (prevFailed) {
                    // LLM reflection: degrade to alert_only fallback
                    setResources(prev => prev.map(r => 
                        r.container_id === scanCandidate.container_id 
                            ? { ...r, status: 'PENDING_APPROVAL', waste_score: 65 } 
                            : r
                    ));
                    injectLog('Context Agent', `Reflected on previous execution failure (Docker stop timeout). Recommendation: ALERT ONLY (HITL).`, scanCandidate.container_id);
                    setPending(prev => [...prev, {
                        container_id: scanCandidate.container_id,
                        name: scanCandidate.name,
                        status: 'PENDING_APPROVAL',
                        waste_score: 65
                    }]);
                } else {
                    const wasteScore = Math.floor(Math.random() * 50) + 50; // 50 to 100
                    const isAutoAxe = wasteScore >= 80;

                    setResources(prev => prev.map(r => 
                        r.container_id === scanCandidate.container_id 
                            ? { ...r, status: isAutoAxe ? 'MARKED_FOR_TERMINATION' : 'PENDING_APPROVAL', waste_score: wasteScore } 
                            : r
                    ));

                    if (isAutoAxe) {
                        injectLog('Context Agent', `High waste score (${wasteScore}/100). Branch merged 5 days ago. Routing to Guard.`, scanCandidate.container_id);
                        
                        // In simulated mode, let's say 25% of the time, the physical actuation fails!
                        const willFail = Math.random() < 0.25;
                        setTimeout(() => {
                            if (willFail) {
                                setResources(prev => prev.map(r => 
                                    r.container_id === scanCandidate.container_id 
                                        ? { ...r, status: 'EXECUTION_FAILED' } 
                                        : r
                                ));
                                injectLog('Guard Agent', `ACTUATION FAILURE: Failed to stop physical container (socket timeout). Routing back to Context Agent.`, scanCandidate.container_id);
                            } else {
                                axeContainer(scanCandidate.container_id, 'Guard Agent', 'Physical Execution Success. Container stopped.');
                            }
                        }, 1500);
                    } else {
                        injectLog('Context Agent', `Ambiguous score (${wasteScore}/100). Low traffic. Requesting HITL approval.`, scanCandidate.container_id);
                        setPending(prev => [...prev, {
                            container_id: scanCandidate.container_id,
                            name: scanCandidate.name,
                            status: 'PENDING_APPROVAL',
                            waste_score: wasteScore
                        }]);
                    }
                }
            }, 1000);
        } else {
            injectLog('Audit Agent', `Checked metrics. CPU at ${cpuReading.toFixed(2)}%. Resource utilization healthy.`, scanCandidate.container_id);
            // Move to end of queue so we don't scan it immediately again
            setResources(prev => {
                const filtered = prev.filter(r => r.container_id !== scanCandidate.container_id);
                return [...filtered, scanCandidate];
            });
        }
    };

    // Axe / Terminate routine
    const axeContainer = (id, executor = 'Guard Agent', actionMsg = 'Physical Execution Success. Container stopped.') => {
        setResources(prev => prev.filter(r => r.container_id !== id));
        setPending(prev => prev.filter(p => p.container_id !== id));
        injectLog(executor, actionMsg, id);

        setStats(prev => {
            const nextTerminated = prev.terminated_containers + 1;
            return {
                ...prev,
                active_containers: Math.max(0, prev.active_containers - 1),
                terminated_containers: nextTerminated,
                money_saved: nextTerminated * 45
            };
        });
    };

    const handleApprove = async (id) => {
        if (!isSimulatedMode) {
            try {
                await approveAxe(id);
                setPending(prev => prev.filter(p => p.container_id !== id));
            } catch (e) {
                console.error("API Approve error", e);
            }
        } else {
            // Simulated approve
            injectLog('Human Override', 'Manual termination approved via Dashboard. Routing to Guard.', id);
            setTimeout(() => {
                axeContainer(id, 'Guard Agent', 'Physical execution authorized by Human Override. stopped.');
            }, 1000);
        }
    };

    const handleAxeDirect = (id) => {
        if (!isSimulatedMode) {
            // Directly push to mark for termination backend if possible, or simulate
            handleApprove(id);
        } else {
            axeContainer(id, 'Human Override', 'Direct override. Container terminated immediately.');
        }
    };

    const handleLoginSuccess = () => {
        localStorage.setItem('idleaxe_auth', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('idleaxe_auth');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Animated Grid Background */}
            <div className="grid-bg" />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 lg:px-8 py-5 max-w-[1600px] mx-auto w-full">

                {/* Header */}
                <header className="mb-5 flex justify-between items-center pb-4 border-b border-white/5 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <svg className="w-8 h-8 text-neon-crimson" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M14 12l-4 4V8l4 4z" fill="currentColor" opacity="0.3" />
                                <path d="M3 3l18 18M8 5h8l4 4v8M5 8v8l4 4h8" />
                            </svg>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                                IDLE<span className="text-neon-crimson text-glow-crimson">AXE</span>
                            </h1>
                        </div>
                        <span className="hidden sm:block text-slate-600 text-xs font-semibold uppercase tracking-[0.2em] border-l border-slate-800 pl-4">
                            FinOps Swarm Command
                        </span>
                    </div>

                    <div className="flex items-center gap-3 animate-fade-in">
                        {/* Quick Demo Controller */}
                        <div className="flex items-center gap-3 bg-obsidian-900 border border-white/5 px-4 py-2 rounded-xl">
                            {/* Simulation Toggle */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-mono text-slate-500">Demo Simulation</span>
                                <button
                                    onClick={() => setIsSimulatedMode(!isSimulatedMode)}
                                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                                        isSimulatedMode ? 'bg-emerald-500' : 'bg-slate-800'
                                    }`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                        isSimulatedMode ? 'translate-x-5.5' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>

                            {/* Action buttons inside Simulator Mode */}
                            {isSimulatedMode && (
                                <div className="flex gap-2 border-l border-white/5 pl-3">
                                    <button
                                        onClick={() => spawnMockContainers(3)}
                                        className="text-[9px] font-mono text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/10"
                                    >
                                        + Spawn 3
                                    </button>
                                    <button
                                        onClick={runSimulationCycle}
                                        className="text-[9px] font-mono text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-2 py-1 rounded border border-amber-500/10"
                                    >
                                        ⚡ Scan Cycle
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="text-[10px] font-mono text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-300 px-3 py-2 rounded-xl border border-rose-500/15 hover:border-rose-500/35 transition-all duration-300 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                            <span>🔒</span> Logout
                        </button>
                    </div>
                </header>

                {/* Stats Ticker */}
                <div className="mb-5">
                    <StatsTicker stats={stats} />
                </div>

                {/* System Override / Chaos Switch */}
                <div className="mb-5">
                    <ChaosButton 
                        isChaos={isChaosMode} 
                        onToggle={async (newState) => {
                            setIsChaosMode(newState);
                            if (!isSimulatedMode) {
                                try {
                                    await fetch('/api/chaos', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ enabled: newState })
                                    });
                                } catch (e) {
                                    console.error("Failed to toggle chaos on backend", e);
                                }
                            } else {
                                // Inject custom log in simulation mode
                                injectLog(
                                    'System Override', 
                                    `CHAOS MODE ${newState ? 'ENGAGED' : 'DISENGAGED'}. Injecting artificial CPU spikes.`
                                );
                            }
                        }}
                    />
                </div>

                {/* Dashboard layout */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
                    
                    {/* Left & Middle Column (3/5): Active Grid & Approvals */}
                    <div className="lg:col-span-3 flex flex-col gap-5 min-h-0">
                        {/* Active resources with sparklines */}
                        <div className="flex-grow min-h-0">
                            <ActiveResources
                                resources={resources}
                                onAxe={handleAxeDirect}
                                isSimulating={isSimulatedMode}
                                isChaosMode={isChaosMode}
                            />
                        </div>
                        {/* Approvals */}
                        <div className="h-[280px] flex-shrink-0">
                            <ApprovalQueue
                                pending={pending}
                                onApprove={handleApprove}
                            />
                        </div>
                    </div>

                    {/* Right Column (2/5): Swarm Logs & ROI */}
                    <div className="lg:col-span-2 min-h-0 flex flex-col gap-5">
                        <div className="flex-grow min-h-[350px]">
                            <AuditFeed logs={logs} />
                        </div>
                        <div className="flex-shrink-0">
                            <PredictiveSavingsChart stats={stats} />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <footer className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-700 font-mono">
                    <span>IDLE<span className="text-neon-crimson/50">AXE</span> Swarm Console v1.0 // Status nominal</span>
                    <div className="flex gap-4">
                        <span>Mode: {isSimulatedMode ? 'DEMO SIMULATION' : 'LIVE API PROXY'}</span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            connected
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}