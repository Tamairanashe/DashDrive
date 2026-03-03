import React from 'react';
import { AlertCircle, ShieldAlert, MessageSquare, Clock, ArrowRight, Search, Flag, MoreHorizontal, CheckCircle } from 'lucide-react';
import { cn } from '../types';

const cases = [
    { id: 'DD-9281', customer: 'Alex Thompson', store: 'Lynwood (82)', status: 'High Priority', type: 'SLA Breach', time: '14m ago' },
    { id: 'DD-9280', customer: 'Sarah Miller', store: 'Downtown (14)', status: 'Investigation', type: 'Missing Item', time: '42m ago' },
    { id: 'DD-9279', customer: 'James White', store: 'North Park', status: 'Resolved', type: 'Refund Request', time: '1h 12m ago' },
    { id: 'DD-9278', customer: 'Emma Davis', store: 'Central Hub', status: 'Pending', type: 'Support Dispute', time: '2h 5m ago' },
];

const Issues = () => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-black tracking-tighter">Resolution Hub</h1>
                    <p className="text-lg text-gray-400 font-medium">Monitor service level breaches and manage customer escalations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-black text-sm flex items-center gap-2">
                        <ShieldAlert size={18} />
                        Auto-Escalation: ON
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Alerts', value: '8', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Pending Response', value: '14', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg Solve Time', value: '42m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Resolved (24h)', value: '156', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="relative w-96">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Case ID or Store..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest animate-pulse">2 Critical Breaches Detected</div>
                    </div>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Case ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trigger & Store</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Elapsed</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {cases.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="text-sm font-black text-black">#{item.id}</div>
                                    <div className="text-[10px] text-gray-400 font-bold">{item.customer}</div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-black">{item.type}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.store}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight",
                                        item.status === 'High Priority' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                            item.status === 'Investigation' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                item.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                    "bg-gray-50 text-gray-500 border border-gray-100"
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-gray-500">{item.time}</td>
                                <td className="px-6 py-5 text-right">
                                    <button className="p-2 text-gray-300 hover:text-black hover:bg-gray-100 rounded-lg transition-all ml-auto">
                                        <ArrowRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Issues;
