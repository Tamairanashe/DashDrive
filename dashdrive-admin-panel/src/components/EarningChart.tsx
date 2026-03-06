import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
    { name: 'Aug', value: 6500 },
    { name: 'Sep', value: 8000 },
    { name: 'Oct', value: 7500 },
    { name: 'Nov', value: 9000 },
    { name: 'Dec', value: 8500 },
];

export const EarningChart = () => {
    return (
        <div className="bg-white p-6 rounded-[20px] shadow-soft border border-slate-50 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Admin Earning Statistics</h3>
                    <p className="text-sm text-slate-500">Overview of total earnings across all zones</p>
                </div>
                <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 cursor-pointer">
                    <option>All time</option>
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                </select>
            </div>

            <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00A884" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#00A884" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                fontSize: '12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#00A884"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
