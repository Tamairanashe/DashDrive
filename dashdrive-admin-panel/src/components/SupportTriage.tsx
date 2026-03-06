import React, { useState } from 'react';
import {
 LifeBuoy,
 ChevronRight,
 Search,
 Filter,
 MessageSquare,
 Clock,
 AlertTriangle,
 CheckCircle2,
 User,
 MoreVertical,
 Send,
 Info,
 Smartphone,
 Shield,
 Mail,
 Plus,
 ArrowRight,
 LayoutGrid,
 Zap,
 Activity,
 ArrowUpRight
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const SupportTriage: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Active Tickets');

 const tickets = [
 { id: 'TKT-7842', subject: 'Refund Request: Failed Transaction', user: 'Mike Okoro', type: 'Payment', priority: 'High', status: 'Open', time: '12m ago' },
 { id: 'TKT-7843', subject: 'Driver Identity Verification Delay', user: 'Samuel Ade', type: 'Onboarding', priority: 'Urgent', status: 'In Progress', time: '24m ago' },
 { id: 'TKT-7844', subject: 'Wrong Order Items Delivered', user: 'Janet Black', type: 'Food', priority: 'Medium', status: 'Open', time: '1h ago' },
 { id: 'TKT-7845', subject: 'App Crash on Android 14', user: 'Tech Support', type: 'Technical', priority: 'Low', status: 'Resolved', time: '4h ago' },
 ];

 const renderDashboard = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Unassigned', value: '18', trend: '+4', icon: LifeBuoy, color: 'text-amber-500', bg: 'bg-amber-50' },
 { label: 'Avg Respond', value: '4.2m', trend: '-15s', icon: Zap, color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
 { label: 'Customer CSAT', value: '98%', trend: 'Stable', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
 { label: 'Live Agents', value: '12', trend: 'Online', icon: User, color: 'text-indigo-500', bg: 'bg-indigo-50' }
 ].map((stat, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center justify-between mb-6">
 <div className={cn("p-4 rounded-2xl transition-colors duration-500", stat.bg)}>
 <stat.icon className={cn("w-6 h-6", stat.color)} />
 </div>
 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl ">{stat.trend}</span>
 </div>
 <p className="text-[10px] font-bold text-slate-400 mb-1">{stat.label}</p>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
 </div>
 ))}
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden text-black">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
 <div>
 <h3 className="text-xl font-black">Support Triage</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Real-time resolution desk for platform issues.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" className="w-64 pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none" placeholder="Search ticket # or user..." />
 </div>
 <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 border border-slate-100 transition-all"><Filter className="w-4 h-4" /></button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Subject & ID</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">User</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Priority</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Status</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Assigned To</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4 text-right">Age</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {tickets.map((t, i) => (
 <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="py-6 px-4">
 <div className="flex flex-col">
 <span className="text-xs font-black text-slate-900 line-clamp-1">{t.subject}</span>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[9px] font-bold text-slate-400 tracking-tight">{t.id}</span>
 <span className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[9px] font-black text-[#0089D1] ">{t.type}</span>
 </div>
 </div>
 </td>
 <td className="py-6 px-4">
 <span className="text-xs font-bold text-slate-700">{t.user}</span>
 </td>
 <td className="py-6 px-4">
 <div className={cn(
 "px-3 py-1 rounded-full text-[9px] font-black inline-block border",
 t.priority === 'Urgent' ? "bg-rose-50 text-rose-600 border-rose-100" :
 t.priority === 'High' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-100 text-slate-500 border-slate-200"
 )}>
 {t.priority}
 </div>
 </td>
 <td className="py-6 px-4">
 <div className={cn(
 "flex items-center gap-2 text-[10px] font-black ",
 t.status === 'Open' ? "text-amber-500" :
 t.status === 'In Progress' ? "text-[#0089D1]" : "text-emerald-500"
 )}>
 {t.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
 {t.status}
 </div>
 </td>
 <td className="py-6 px-4">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-slate-100 border border-white" />
 <span className="text-[10px] font-bold text-slate-400 italic">Unassigned</span>
 </div>
 </td>
 <td className="py-6 px-4 text-right text-[10px] font-bold text-slate-400 tracking-tighter">
 {t.time}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Service Desk</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Ticketing</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 font-display">Support Triage</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Orchestrate resolution across platform segments with AI-assisted triage.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Active Tickets', 'Agents', 'Performance', 'Settings'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
 <MessageSquare className="w-5 h-5" /> Live Console
 </button>
 </div>

 {activeTab === 'Active Tickets' && renderDashboard()}
 {activeTab !== 'Active Tickets' && (
 <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <LifeBuoy className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">{activeTab} Interface</h2>
 <p className="text-sm font-medium">Coming soon: Integrated Zendesk/Freshdesk bridging.</p>
 </div>
 )}
 </div>
 );
};
