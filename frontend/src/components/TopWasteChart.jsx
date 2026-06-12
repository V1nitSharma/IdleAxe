import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'staging-api', waste: 4000 },
  { name: 'dev-db', waste: 3000 },
  { name: 'feature-auth', waste: 2000 },
  { name: 'test-worker', waste: 1500 },
  { name: 'legacy-cache', waste: 500 },
];

export default function TopWasteChart() {
    return (
        <div className="saas-card p-6 h-[320px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Top Waste Sources</h3>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }}
                        />
                        <Tooltip 
                            cursor={{fill: '#F3F4F6'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value) => [`$${value}`, 'Waste/Month']}
                        />
                        <Bar dataKey="waste" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#EF4444' : '#FCA5A5'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
