import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Reduction',
    uv: 35,
    fill: '#2563EB',
  }
];

export default function MonthlyCostReduction() {
    return (
        <div className="saas-card p-6 h-[320px] flex flex-col items-center justify-center relative">
            <h3 className="text-lg font-semibold text-gray-900 absolute top-6 left-6 tracking-tight">Monthly Cost Reduction</h3>
            
            <div className="w-full h-full pt-10 relative flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                    <span className="text-4xl font-bold text-gray-900">35%</span>
                    <span className="text-sm text-gray-500 mt-1">Cloud waste reduced</span>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="70%" 
                        outerRadius="90%" 
                        barSize={15} 
                        data={data}
                        startAngle={90} 
                        endAngle={-270}
                    >
                        <RadialBar
                            minAngle={15}
                            background={{ fill: '#E5E7EB' }}
                            clockWise
                            dataKey="uv"
                            cornerRadius={10}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
