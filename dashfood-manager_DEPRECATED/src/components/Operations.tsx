import React, { useState } from 'react';
import {
    Calendar,
    ChevronDown,
    HelpCircle,
    Download,
    Info
} from 'lucide-react';
import {
    LineChart,
    Line,
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

const lineData = [
    { date: '2/12', current: 4, previous: 4.2 },
    { date: '2/13', current: 2, previous: 2.5 },
    { date: '2/14', current: 1, previous: 1.8 },
    { date: '2/15', current: 5, previous: 3 },
    { date: '2/16', current: 0, previous: 2.2 },
    { date: '2/17', current: 5, previous: 4 },
    { date: '2/18', current: 3, previous: 2 }
];

const issueBreakdown = [
    { name: 'Missing customizations', value: 5, color: '#D8B4FE' },
    { name: 'Items missing', value: 90, color: '#581C87' },
    { name: 'Wrong order received', value: 5, color: '#F0ABFC' }
];

const storeIssuesData = [
    { name: 'Gourmet Sushi (Canary Wharf)', address: '123 Canary Wharf', orders: 6, rate: '3%', topIssue: 'Items missing', refunds: '£76.46' },
    { name: 'Gourmet Sushi (Spitalfields)', address: '32 Brushfield Street', orders: 4, rate: '1%', topIssue: 'Items missing', refunds: '£0.00' },
    { name: 'Gourmet Sushi (Camden)', address: '69 Randolph Street, Camden NW1 0SS', orders: 4, rate: '2%', topIssue: 'Items missing', refunds: '£10.40' },
    { name: 'Gourmet Sushi (Notting Hill)', address: '244 Notting Hill Gate', orders: 3, rate: '1%', topIssue: 'Items missing', refunds: '£11.35' },
    { name: 'Gourmet Sushi (Battersea)', address: '238 York Road', orders: 2, rate: '1%', topIssue: 'Items missing', refunds: '£9.19' },
    { name: 'Gourmet Sushi (Holborn)', address: '25 Southampton Row', orders: 2, rate: '2%', topIssue: 'Items missing', refunds: '£0.00' },
];

const heatmapIssues = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, '0'),
    mon: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
    tue: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
    wed: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
    thu: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0,
    fri: Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0,
    sat: Math.random() > 0.2 ? Math.floor(Math.random() * 6) : 0,
    sun: Math.random() > 0.2 ? Math.floor(Math.random() * 5) : 0,
}));

const Operations = () => {
    const [activeSubTab, setActiveSubTab] = useState<'inaccurate' | 'unfulfilled'>('inaccurate');
    const [activeStoreTab, setActiveStoreTab] = useState<'inaccurate' | 'unfulfilled' | 'online' | 'efficiency'>('inaccurate');
    const [hoveredCell, setHoveredCell] = useState<{ day: string, hour: string, val: number } | null>(null);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
                    <div className="flex items-center gap-3 mt-4">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            All stores (6)
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            2024/02/12 - 2024/02/18
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        February 12 - 18, 2024 compared to February 5 - 11, 2024
                    </p>
                </div>

                <div className="flex items-center gap-4 self-start">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-100 max-w-[300px]">
                        <p className="text-xs font-medium">Click the '?' here to view definitions for all terms associated with inaccurate and canceled orders</p>
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-blue-50 absolute -right-3 top-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-black transition-colors">
                        Operations glossary
                        <HelpCircle size={14} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tight">Two-Clock Analytics</h3>
                            <p className="text-sm text-gray-400 font-medium">Monitoring the delay between Kitchen Completion and Logistic Pickup.</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                            <Download size={14} />
                            Export Data
                        </button>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveSubTab('inaccurate')}
                            className={cn(
                                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                                activeSubTab === 'inaccurate' ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            )}
                        >
                            Kitchen (Prep Time)
                        </button>
                        <button
                            onClick={() => setActiveSubTab('unfulfilled')}
                            className={cn(
                                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                                activeSubTab === 'unfulfilled' ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            )}
                        >
                            Logistics (Shelf Wait)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                <div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Avg Prep Time
                                        <Info size={14} className="text-gray-300" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-black">12.4m</span>
                                        <span className="text-xs font-bold text-emerald-500">↓ 8%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        Shelf Wait Time
                                        <Info size={14} className="text-gray-300" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-black">6.2m</span>
                                        <span className="text-xs font-bold text-rose-500">↑ 14%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                        SLA Fulfillment
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-black">94.2%</span>
                                        <span className="text-xs font-bold text-emerald-500">Stable</span>
                                    </div>
                                </div>
                            </div>


                            <div className="h-[300px] w-full" style={{ minHeight: 300 }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            domain={[0, 10]}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="current"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            name="This period"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="previous"
                                            stroke="#EF4444"
                                            strokeWidth={1}
                                            strokeDasharray="4 4"
                                            dot={false}
                                            name="Last period"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-red-500"></div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">This period</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-red-500 border-dashed border-t border-red-500"></div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Last period</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-l border-gray-100 pl-8">
                            <h4 className="font-bold text-gray-900 mb-6">Issue breakdown</h4>
                            <div className="h-[180px] w-full mb-8" style={{ minHeight: 180 }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <Pie
                                            data={issueBreakdown}
                                            innerRadius={0}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {issueBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3">
                                {issueBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-xs text-gray-600 font-medium group-hover:text-black transition-colors">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold text-gray-900">21 orders</span> were deemed inaccurate. {' '}
                        <button className="text-gray-900 underline font-medium hover:text-black">How do we determine order adjustments?</button>
                    </p>
                    <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-full text-xs font-bold hover:bg-gray-300 transition-colors">
                        View orders
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 relative">
                <div className="flex gap-8 border-b border-gray-100 mb-8 items-center">
                    <button className="pb-4 text-sm font-bold text-black border-b-2 border-black">Inaccurate Orders</button>
                    <button className="pb-4 text-sm font-bold text-gray-400 hover:text-gray-600">Unfulfilled orders</button>
                    <button className="pb-4 text-sm font-bold text-gray-400 hover:text-gray-600">Online Rate</button>
                    <div className="flex-1" />
                    <button className="pb-4 text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center gap-2">
                        <Download size={16} />
                        Download
                    </button>
                </div>

                <div className="mb-4">
                    <h2 className="text-2xl font-bold">10pm - 11pm</h2>
                    <p className="text-sm text-gray-500">Most order issues</p>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-4">
                    <div className="grid grid-rows-[repeat(24,1fr)] gap-1 text-[10px] font-bold text-gray-400 mt-6">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="h-6 flex items-center italic">{i.toString().padStart(2, '0')}</div>
                        ))}
                    </div>

                    <div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {heatmapIssues.map((row) => (
                                <React.Fragment key={row.hour}>
                                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                                        const val = (row as any)[day];
                                        return (
                                            <div
                                                key={`${row.hour}-${day}`}
                                                onMouseEnter={() => setHoveredCell({ day, hour: row.hour, val })}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                className="h-6 rounded-sm transition-all cursor-pointer relative group"
                                                style={{
                                                    backgroundColor: val === 0 ? '#F3F4F6' :
                                                        val <= 1 ? '#FEE2E2' :
                                                            val <= 2 ? '#FCA5A5' :
                                                                val <= 3 ? '#EF4444' : '#991B1B'
                                                }}
                                            >
                                                {hoveredCell?.day === day && hoveredCell?.hour === row.hour && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black text-white p-3 rounded-lg shadow-xl z-20 pointer-events-none">
                                                        <p className="text-[10px] font-bold mb-2 uppercase border-b border-white/20 pb-1 flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                                            {day.charAt(0).toUpperCase() + day.slice(1)} {row.hour}:00
                                                        </p>
                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="opacity-60 text-[9px] uppercase tracking-wider">Items missing</span>
                                                                <span className="font-bold">{val}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="opacity-60 text-[9px] uppercase tracking-wider">Missing customization</span>
                                                                <span className="font-bold">0</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px]">
                                                                <span className="opacity-60 text-[9px] uppercase tracking-wider">Wrong order delivered</span>
                                                                <span className="font-bold">0</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] border-t border-white/20 pt-1.5 mt-1.5 font-bold">
                                                                <span className="uppercase tracking-wider">Total</span>
                                                                <span>{val}</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-4 bg-gray-100 rounded-sm" />
                        <span className="text-[10px] font-bold text-gray-400">0</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-4 bg-red-100 rounded-sm" />
                        <span className="text-[10px] font-bold text-gray-400">0.75</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-4 bg-red-300 rounded-sm" />
                        <span className="text-[10px] font-bold text-gray-400">1.5</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-4 bg-red-500 rounded-sm" />
                        <span className="text-[10px] font-bold text-gray-400">2.25</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-8 h-4 bg-red-900 rounded-sm" />
                        <span className="text-[10px] font-bold text-gray-400">3+</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Order Issues by Store</h2>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download size={14} />
                        Download
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6">
                        <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {[
                                { id: 'inaccurate', label: 'Inaccurate Orders' },
                                { id: 'unfulfilled', label: 'Unfulfilled orders' },
                                { id: 'online', label: 'Online Rate' },
                                { id: 'efficiency', label: 'Efficiency by Store' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveStoreTab(tab.id as any)}
                                    className={cn(
                                        "pb-4 text-sm font-bold transition-all relative",
                                        activeStoreTab === tab.id ? "text-black" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {tab.label}
                                    {activeStoreTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-100">
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">#</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right px-4">Orders</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right px-4">Rate</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Top issue</th>
                                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right px-4">Refunds paid</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {storeIssuesData.map((store, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-6 text-sm font-bold text-gray-400 px-4">{i + 1}</td>
                                            <td className="py-6">
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900 leading-tight">{store.name}</h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">{store.address}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 text-sm font-medium text-gray-600 text-right px-4">{store.orders}</td>
                                            <td className="py-6 text-sm font-medium text-gray-600 text-right px-4">{store.rate}</td>
                                            <td className="py-6 text-sm font-medium text-gray-600 px-4">{store.topIssue}</td>
                                            <td className="py-6 text-sm font-bold text-gray-900 text-right px-4">{store.refunds}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Operations;
