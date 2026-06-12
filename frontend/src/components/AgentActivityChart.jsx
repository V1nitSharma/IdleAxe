import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', audit: 400, context: 240, guard: 50 },
  { time: '04:00', audit: 300, context: 139, guard: 30 },
  { time: '08:00', audit: 200, context: 980, guard: 200 },
  { time: '12:00', audit: 278, context: 390, guard: 120 },
  { time: '16:00', audit: 189, context: 480, guard: 80 },
  { time: '20:00', audit: 239, context: 380, guard: 90 },
  { time: '24:00', audit: 349, context: 430, guard: 150 },
];

export default function AgentActivityChart() {
    return (
        <div className="saas-card p-6 h-[320px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Agent Activity (24h)</h3>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAudit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorContext" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorGuard" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Area type="monotone" dataKey="audit" stroke="#2563EB" fillOpacity={1} fill="url(#colorAudit)" stackId="1" />
                        <Area type="monotone" dataKey="context" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorContext)" stackId="1" />
                        <Area type="monotone" dataKey="guard" stroke="#10B981" fillOpacity={1} fill="url(#colorGuard)" stackId="1" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
