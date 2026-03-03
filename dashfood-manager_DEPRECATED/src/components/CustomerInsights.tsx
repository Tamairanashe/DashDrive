import React from 'react';
import {
    Users,
    TrendingUp,
    UserPlus,
    Repeat,
    Target,
    Star,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { api } from '../api';

export default function CustomerInsights() {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        api.customers.getInsights()
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const stats = [
        { label: 'Total Customers', value: data?.total_customers || '...', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'New This Month', value: '1,204', change: '+18%', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Repeat Rate', value: data ? `${data.repeat_rate.toFixed(1)}%` : '...', change: '-2%', icon: Repeat, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Customer LTV', value: data ? `$${data.average_ltv.toFixed(2)}` : '...', change: '+5%', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const segments = [
        { name: 'VIP Spenders', count: '482', percentage: '12%', color: 'bg-black' },
        { name: 'Regulars', count: '3,240', percentage: '45%', color: 'bg-emerald-500' },
        { name: 'Casuals', count: '5,120', percentage: '30%', color: 'bg-blue-500' },
        { name: 'At Risk', count: '840', percentage: '13%', color: 'bg-red-400' },
    ];

    return (
        <div className="p-8 pb-20 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <Users size={22} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tightest">Customer Insights</h1>
                        </div>
                        <p className="text-gray-500 font-medium tracking-tight">Deep dive into your audience, loyalty metrics, and spending behavior.</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-5 py-2.5 bg-gray-100 text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Export Data</button>
                        <button className="px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-gray-200">Segment Settings</button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                    <stat.icon className={stat.color} size={24} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-black",
                                    stat.change.startsWith('+') ? "text-emerald-600" : "text-red-600"
                                )}>
                                    {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Segmentation Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black tracking-tighter">Audience Segmentation</h2>
                            <select className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-0">
                                <option>All Stores</option>
                                <option>Starbucks Lynwood</option>
                            </select>
                        </div>

                        <div className="flex h-12 w-full rounded-2xl overflow-hidden mb-10">
                            {segments.map((seg, i) => (
                                <div
                                    key={i}
                                    className={cn("h-full transition-all hover:brightness-110", seg.color)}
                                    style={{ width: seg.percentage }}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {segments.map((seg, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={cn("w-3 h-3 rounded-full", seg.color)}></div>
                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">{seg.name}</span>
                                    </div>
                                    <div className="text-xl font-black leading-none mb-1">{seg.count}</div>
                                    <div className="text-[10px] font-bold text-gray-400">{seg.percentage} of audience</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Customers Card */}
                    <div className="bg-black text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/30 transition-all duration-500"></div>

                        <h2 className="text-xl font-black tracking-tighter mb-6 relative z-10">Top Loyalists</h2>

                        <div className="space-y-6 relative z-10">
                            {[
                                { name: 'Sarah Jenkins', orders: 42, spent: '$1,240', score: 98 },
                                { name: 'Marcus Chen', orders: 38, spent: '$940', score: 95 },
                                { name: 'Eliza Thorne', orders: 35, spent: '$1,020', score: 92 },
                            ].map((customer, i) => (
                                <div key={i} className="flex items-center justify-between group/item cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-sm text-emerald-400">
                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black tracking-tight">{customer.name}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{customer.orders} Orders</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-emerald-400">{customer.spent}</div>
                                        <div className="flex items-center justify-end gap-1">
                                            <Star size={10} className="fill-emerald-400 text-emerald-400" />
                                            <span className="text-[10px] font-black">{customer.score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            View All Customers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
