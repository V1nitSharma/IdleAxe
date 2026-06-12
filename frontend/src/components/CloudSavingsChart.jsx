import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', savings: 4000 },
  { name: 'Tue', savings: 3000 },
  { name: 'Wed', savings: 5000 },
  { name: 'Thu', savings: 7500 },
  { name: 'Fri', savings: 8200 },
  { name: 'Sat', savings: 10500 },
  { name: 'Sun', savings: 12430 },
];

export default function CloudSavingsChart() {
    return (
        <div className="saas-card p-6 h-[360px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Cloud Savings Trend</h3>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value) => [`$${value}`, 'Savings']}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="savings" 
                            stroke="#2563EB" 
                            strokeWidth={3}
                            dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
