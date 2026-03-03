import React from 'react';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { cn } from '../types';

const revenueData = [
    { day: 'Mon', revenue: 2400 },
    { day: 'Tue', revenue: 1398 },
    { day: 'Wed', revenue: 9800 },
    { day: 'Thu', revenue: 3908 },
    { day: 'Fri', revenue: 4800 },
    { day: 'Sat', revenue: 3800 },
    { day: 'Sun', revenue: 4300 },
];

const retentionData = [
    { name: 'New Customers', value: 400 },
    { name: 'Returning', value: 600 },
];

const COLORS = ['#F97316', '#10B981'];

const Sales = () => {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-black tracking-tighter">Financial Insights</h1>
                    <p className="text-lg text-gray-400 font-medium">Network-wide revenue analysis and performance benchmarks.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                        <Calendar size={14} />
                        Feb 1 - Feb 20, 2026
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                        <Download size={14} />
                        Export Report
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl text-black tracking-tight">Revenue Velocity</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Network-wide daily gross volume</p>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <button className="px-4 py-1.5 text-[10px] font-black bg-white shadow-sm rounded-md uppercase tracking-wider">Day</button>
                            <button className="px-4 py-1.5 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider">Week</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FAFB" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 900 }}
                                    tickFormatter={(value) => `£${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#000', opacity: 0.05 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px'
                                    }}
                                    formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Retention */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-lg mb-2">Customer Retention</h3>
                    <p className="text-xs text-gray-400 mb-8">New vs. Returning customers this month.</p>

                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={retentionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {retentionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">New</p>
                            <p className="text-xl font-bold">40%</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Returning</p>
                            <p className="text-xl font-bold">60%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Avg Order Value', value: '$32.40', trend: '+5.2%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Orders', value: '1,240', trend: '+12.5%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Gross Sales', value: '$40,176', trend: '+8.1%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                            <ArrowUpRight size={16} />
                            {stat.trend}
                            <span className="text-gray-400 font-medium ml-1 text-xs">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sales;
