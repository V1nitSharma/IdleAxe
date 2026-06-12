import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Active', value: 84 },
  { name: 'Flagged', value: 12 },
  { name: 'Pending Approval', value: 8 },
  { name: 'Terminated', value: 23 },
];

const COLORS = ['#2563EB', '#F59E0B', '#EF4444', '#10B981'];

export default function ResourceStatusChart() {
    return (
        <div className="saas-card p-6 h-[360px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Resource Status Distribution</h3>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
