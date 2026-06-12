import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1.5 }) {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // Easing function: easeOutExpo
            const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            
            setDisplayValue(Math.floor(easeOut * value));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return (
        <span>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
}

export default function KPICard({ title, value, prefix, suffix, trend, trendLabel, icon: Icon, color = "emerald" }) {
    const colorClasses = {
        emerald: "text-emerald-600 bg-emerald-50",
        green: "text-emerald-600 bg-emerald-50",
        blue: "text-emerald-600 bg-emerald-50",
        red: "text-rose-600 bg-rose-50",
        amber: "text-amber-600 bg-amber-50"
    };

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="saas-card p-5 relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className={`p-2 rounded-xl ${colorClasses[color] || colorClasses.emerald}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
                </h2>
            </div>
            
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    {trend > 0 ? (
                        <span className="flex items-center text-emerald-600 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                            {trend}%
                        </span>
                    ) : (
                        <span className="flex items-center text-red-600 font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                            {Math.abs(trend)}%
                        </span>
                    )}
                    <span className="text-gray-400 ml-2">{trendLabel}</span>
                </div>
            )}
        </motion.div>
    );
}
