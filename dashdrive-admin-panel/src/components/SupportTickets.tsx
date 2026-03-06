import React, { useState } from 'react';
import {
 LifeBuoy,
 RotateCcw,
 Save,
 Search,
 Filter,
 MoreVertical,
 Clock,
 User,
 CheckCircle2,
 XCircle,
 AlertCircle,
 ChevronRight,
 MessageSquare,
 Users,
 TrendingUp,
 Settings,
 Plus,
 Edit3,
 Trash2,
 Mail,
 Bell,
 Shield,
 Zap,
 BarChart3,
 Activity,
 Calendar,
 ArrowRight,
 Info,
 Layout,
 Check,
 Terminal,
 Cpu
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface Ticket {
 id: string;
 customer: string;
 subject: string;
 status: 'Open' | 'Pending' | 'Closed';
 priority: 'Low' | 'Medium' | 'High' | 'Urgent';
 agent: string;
 date: string;
}

interface Agent {
 id: string;
 name: string;
 email: string;
 role: string;
 ticketsCount: number;
 status: 'Active' | 'Inactive';
 avatar: string;
}

const TICKETS_DATA: Ticket[] = [
 { id: 'TK-1024', customer: 'John Doe', subject: 'Payment failed for trip #4829', status: 'Open', priority: 'High', agent: 'Sarah Connor', date: 'Oct 24, 2023' },
 { id: 'TK-1025', customer: 'Jane Smith', subject: 'Unable to upload KYC documents', status: 'Pending', priority: 'Medium', agent: 'Mike Ross', date: 'Oct 25, 2023' },
 { id: 'TK-1026', customer: 'Robert Brown', subject: 'Lost item in vehicle V-401', status: 'Open', priority: 'Urgent', agent: 'Sarah Connor', date: 'Oct 25, 2023' },
 { id: 'TK-1027', customer: 'Alice Wilson', subject: 'Refund request for cancelled order', status: 'Closed', priority: 'Low', agent: 'Rachel Zane', date: 'Oct 22, 2023' },
 { id: 'TK-1028', customer: 'David Miller', subject: 'Account blocked after verification', status: 'Open', priority: 'High', agent: 'Harvey Specter', date: 'Oct 26, 2023' },
];

const AGENTS_DATA: Agent[] = [
 { id: 'AG-01', name: 'Sarah Connor', email: 'sarah.c@dashdrive.com', role: 'Senior Specialist', ticketsCount: 12, status: 'Active', avatar: 'SC' },
 { id: 'AG-02', name: 'Mike Ross', email: 'mike.r@dashdrive.com', role: 'Support Associate', ticketsCount: 8, status: 'Active', avatar: 'MR' },
 { id: 'AG-03', name: 'Rachel Zane', email: 'rachel.z@dashdrive.com', role: 'Support Associate', ticketsCount: 15, status: 'Inactive', avatar: 'RZ' },
 { id: 'AG-04', name: 'Harvey Specter', email: 'harvey.s@dashdrive.com', role: 'Lead Supervisor', ticketsCount: 5, status: 'Active', avatar: 'HS' },
];

interface SupportTicketsProps {
 initialTab?: 'Active' | 'Agents' | 'Performance' | 'Settings' | 'Console';
}

export const SupportTickets: React.FC<SupportTicketsProps> = ({ initialTab = 'Active' }) => {
 const [activeTab, setActiveTab] = useState<'Active' | 'Agents' | 'Performance' | 'Settings' | 'Console'>(
 initialTab === ('Support Tickets' as any) ? 'Active' : initialTab
 );
 const [searchTerm, setSearchTerm] = useState('');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <LifeBuoy className="w-6 h-6 text-[#0089D1]" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Service</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Support Triage</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Support Tickets</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Manage customer inquiries, monitor agent performance, and optimize resolution workflows.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 const renderTabs = () => (
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Active', 'Agents', 'Performance', 'Settings', 'Console'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />
 );

 const renderActiveTickets = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="relative group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#0089D1] transition-colors" />
 <input
 type="text"
 placeholder="Search tickets by ID or customer..."
 className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-xs font-bold text-slate-600 outline-none w-[400px] hover:border-slate-300 focus:ring-8 focus:ring-[#0089D1]/5 transition-all"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
 <Filter className="w-5 h-5" />
 </button>
 <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
 <Plus className="w-5 h-5" /> New Ticket
 </button>
 </div>
 </div>

 <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-100">
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Ticket Information</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Status</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Priority</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 ">Assignee</th>
 <th className="px-10 py-6 text-[10px] font-black text-slate-400 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {TICKETS_DATA.map((ticket) => (
 <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="px-10 py-8">
 <div className="flex items-center gap-4">
 <div className={cn(
 "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold",
 ticket.status === 'Open' ? "bg-blue-50 text-blue-600" :
 ticket.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"
 )}>
 {ticket.id.split('-')[1]}
 </div>
 <div>
 <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0089D1] transition-colors">{ticket.subject}</h4>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{ticket.customer}</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{ticket.date}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-10 py-8">
 <div className={cn(
 "px-4 py-1.5 rounded-full text-[10px] font-black w-fit flex items-center gap-2",
 ticket.status === 'Open' ? "bg-blue-50 text-blue-600" :
 ticket.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
 )}>
 {ticket.status === 'Open' ? <Clock className="w-3.5 h-3.5" /> :
 ticket.status === 'Pending' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
 {ticket.status}
 </div>
 </td>
 <td className="px-10 py-8">
 <span className={cn(
 "text-[10px] font-black ",
 ticket.priority === 'Urgent' ? "text-rose-600" :
 ticket.priority === 'High' ? "text-orange-600" :
 ticket.priority === 'Medium' ? "text-amber-600" : "text-slate-400"
 )}>
 {ticket.priority}
 </span>
 </td>
 <td className="px-10 py-8">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
 {ticket.agent.split(' ').map(n => n[0]).join('')}
 </div>
 <span className="text-[10px] font-bold text-slate-600">{ticket.agent}</span>
 </div>
 </td>
 <td className="px-10 py-8 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-[#0089D1] hover:bg-blue-50 rounded-2xl transition-all">
 <Edit3 className="w-5 h-5" />
 </button>
 <button className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
 <Trash2 className="w-5 h-5" />
 </button>
 <button className="p-3 bg-[#0089D1] text-white rounded-2xl hover:scale-110 active:scale-95 transition-all">
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );

 const renderAgents = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
 <div className="flex items-center justify-between px-4">
 <div className="space-y-1">
 <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Support Staff</h3>
 <p className="text-xs font-medium text-slate-500">Manage support agents and monitor their active workload.</p>
 </div>
 <button className="flex items-center gap-3 px-8 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-lg shadow-[#0089D1]/20">
 <Plus className="w-5 h-5" /> Add New Agent
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {AGENTS_DATA.map((agent) => (
 <div key={agent.id} className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6 hover:shadow-2xl hover:border-[#0089D1]/20 transition-all duration-500 group">
 <div className="flex items-center justify-between">
 <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-xl font-black text-[#0089D1] group-hover:scale-110 transition-transform duration-500">
 {agent.avatar}
 </div>
 <div className={cn(
 "px-3 py-1 rounded-full text-[9px] font-black ",
 agent.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
 )}>
 {agent.status}
 </div>
 </div>
 <div>
 <h4 className="text-lg font-black text-slate-900 group-hover:text-[#0089D1] transition-colors">{agent.name}</h4>
 <p className="text-[10px] font-bold text-slate-400 ">{agent.role}</p>
 </div>
 <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
 <span className="text-[10px] font-black text-slate-400 ">Active Tickets</span>
 <span className="text-sm font-black text-slate-900">{agent.ticketsCount}</span>
 </div>
 <div className="flex items-center gap-2">
 <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-all">Edit</button>
 <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 );

 const renderPerformance = () => (
 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
 {[
 { label: 'Total Tickets', value: '4,829', trend: '+12%', icon: MessageSquare, color: 'blue' },
 { label: 'Avg Resolution', value: '2.4 Hrs', trend: '-18%', icon: Clock, color: 'emerald' },
 { label: 'Customer CSAT', value: '4.82/5', trend: '+0.4', icon: TrendingUp, color: 'purple' },
 { label: 'Pending Load', value: '142', trend: '+5%', icon: AlertCircle, color: 'rose' },
 ].map((stat, i) => (
 <div key={i} className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-4 hover:shadow-xl transition-all">
 <div className={cn(
 "w-12 h-12 rounded-2xl flex items-center justify-center",
 stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
 stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
 stat.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-rose-50 text-rose-600"
 )}>
 <stat.icon className="w-6 h-6" />
 </div>
 <div className="space-y-1">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">{stat.label}</span>
 <div className="flex items-end justify-between">
 <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
 <span className={cn(
 "text-[10px] font-black px-2 py-1 rounded-lg",
 stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
 )}>{stat.trend}</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
 <div className="bg-slate-900 rounded-[64px] p-12 text-white space-y-10 relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089D1]/10 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="space-y-2 relative z-10">
 <h3 className="text-2xl font-black tracking-tight italic">Resolution Trends</h3>
 <p className="text-sm font-medium text-white/50 leading-relaxed">Daily ticket volume and resolution velocity over the last 30 days.</p>
 </div>
 <div className="h-64 flex items-end gap-3 relative z-10">
 {Array.from({ length: 12 }).map((_, i) => (
 <div key={i} className="flex-1 group relative">
 <div
 className="w-full bg-[#0089D1]/20 rounded-t-xl group-hover:bg-[#0089D1] transition-all duration-500"
 style={{ height: `${Math.random() * 80 + 20}%` }}
 />
 <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-white/20 ">W{i + 1}</div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white rounded-[64px] border border-slate-100 p-12 space-y-10 shadow-sm">
 <div className="space-y-2">
 <h3 className="text-2xl font-black text-slate-900 tracking-tight italic text-center">Top Performing Agents</h3>
 <p className="text-sm font-medium text-slate-500 text-center leading-relaxed">Staff members with the highest resolution rates and satisfaction scores.</p>
 </div>
 <div className="space-y-6">
 {AGENTS_DATA.slice(0, 3).map((agent, i) => (
 <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all group">
 <div className="p-4 bg-slate-900 rounded-2xl text-white font-black group-hover:scale-110 transition-transform">
 {i + 1}
 </div>
 <div className="flex-1">
 <h4 className="text-base font-black text-slate-900">{agent.name}</h4>
 <p className="text-[10px] font-bold text-slate-400 ">{agent.role}</p>
 </div>
 <div className="text-right">
 <div className="text-sm font-black text-[#0089D1]">{Math.floor(Math.random() * 20 + 90)}%</div>
 <p className="text-[10px] font-bold text-slate-400 ">Satisfaction</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 const renderSettings = () => (
 <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 <div className="bg-white rounded-[48px] border border-slate-100 p-12 space-y-10 shadow-sm">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-blue-50 text-[#0089D1] rounded-2xl">
 <Zap className="w-5 h-5" />
 </div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Assignment Rules</h3>
 </div>
 <p className="text-xs font-medium text-slate-500 leading-relaxed">Configure how incoming tickets are distributed among staff.</p>
 </div>

 <div className="space-y-6">
 {[
 { label: 'Auto-Assignment', desc: 'Automatically assign tickets to idle agents', active: true },
 { label: 'Escalation Logic', desc: 'Auto-upgrad priority if ticket is unanswered', active: true },
 { label: 'Workload Balance', desc: 'Limit max active tickets per agent', active: false },
 ].map((rule, i) => (
 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] group hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
 <div className="space-y-1">
 <h5 className="text-[11px] font-black text-slate-900 tracking-tight">{rule.label}</h5>
 <p className="text-[10px] font-bold text-slate-400">{rule.desc}</p>
 </div>
 <button className={cn(
 "w-12 h-6 rounded-full p-1 transition-all duration-500",
 rule.active ? "bg-[#0089D1]" : "bg-slate-200"
 )}>
 <div className={cn(
 "w-4 h-4 bg-white rounded-full transition-transform duration-500",
 rule.active ? "translate-x-6" : "translate-x-0"
 )} />
 </button>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white rounded-[48px] border border-slate-100 p-12 space-y-10 shadow-sm">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
 <Layout className="w-5 h-5" />
 </div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Support Categories</h3>
 </div>
 <p className="text-xs font-medium text-slate-500 leading-relaxed">Manage ticket classification for better organization.</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {['Technical Issue', 'Billing & Payments', 'Account Access', 'Trip Dispatch', 'Merchant Support', 'General Inquiry'].map((cat, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#0089D1]/20 hover:bg-white transition-all">
 <span className="text-[10px] font-black text-slate-600 ">{cat}</span>
 <button className="p-1 text-slate-300 hover:text-rose-500 transition-colors">
 <XCircle className="w-4 h-4" />
 </button>
 </div>
 ))}
 <button className="flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] hover:bg-slate-800 transition-all">
 <Plus className="w-4 h-4" /> Add Category
 </button>
 </div>
 </div>
 </div>

 <div className="bg-slate-900 rounded-[64px] p-12 text-white space-y-10 relative overflow-hidden shadow-2xl mt-12">
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
 <div className="p-8 bg-white/10 rounded-[40px] text-[#0089D1] shrink-0 border border-white/10">
 <Mail className="w-12 h-12" />
 </div>
 <div className="flex-1">
 <h4 className="text-2xl font-black tracking-tight italic">Automated Notifications</h4>
 <p className="text-sm font-medium text-white/50 leading-relaxed mt-4">
 Configure system-wide email and push alert triggers for ticket events.
 Enable these to keep customers informed about resolution progress in real-time.
 </p>
 </div>
 <div className="flex flex-col gap-3">
 <button className="px-8 py-3 bg-[#0089D1] text-white rounded-2xl text-[10px] font-black hover:bg-[#007AB8] transition-all">Enable All Alerts</button>
 <button className="px-8 py-3 bg-white/10 text-white/60 rounded-2xl text-[10px] font-black hover:bg-white/20 transition-all">Custom Rules</button>
 </div>
 </div>
 </div>
 </div>
 );

 const renderLiveConsole = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
 <div className="flex items-center justify-between px-4">
 <div className="space-y-1">
 <h3 className="text-xl font-black text-slate-900 tracking-tight italic text-primary">Live Operations Console</h3>
 <p className="text-xs font-medium text-slate-500 italic">Real-time system events and automated triage logs.</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-[10px] font-black text-emerald-600 ">Live Stream Active</span>
 </div>
 </div>
 </div>

 <div className="bg-slate-950 rounded-[48px] border border-slate-800 shadow-2xl overflow-hidden relative group">
 {/* Terminal Header */}
 <div className="bg-slate-900 px-10 py-4 border-b border-slate-800 flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
 <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
 <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
 </div>
 <div className="h-4 w-[1px] bg-slate-800" />
 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 ">
 <Cpu className="w-3.5 h-3.5" />
 dashdrive_triage_engine_v4.log
 </div>
 </div>
 <div className="flex items-center gap-4 text-[10px] font-black text-slate-500">
 <span className=" ">Buffer: 4.2 MB</span>
 <span className="bg-slate-800 px-2 py-1 rounded text-slate-400">SSH: SECURE</span>
 </div>
 </div>

 {/* Log Content */}
 <div className="p-10 font-mono text-[11px] h-[500px] overflow-y-auto space-y-3 leading-relaxed selection:bg-[#0089D1] selection:text-white scrollbar-hide">
 {[
 { time: '07:24:12', level: 'SYSTEM', msg: 'Kernel triage engine initialized on Node-12', color: 'text-indigo-400' },
 { time: '07:24:15', level: 'EVENT', msg: 'New ticket incoming: TK-1028 (High Priority)', color: 'text-amber-400' },
 { time: '07:24:16', level: 'AUTO', msg: 'Analyzing ticket sentiment... [Positive: 12%, Warning: 88%]', color: 'text-slate-400' },
 { time: '07:24:18', level: 'ACTION', msg: 'Auto-assigning TK-1028 to specialist: Harvey Specter', color: 'text-[#0089D1]' },
 { time: '07:24:22', level: 'NETWORK', msg: 'CDN cache invalidated for edge zone: US-EAST-1', color: 'text-emerald-400' },
 { time: '07:24:35', level: 'AUTH', msg: 'Agent "Sarah Connor" logged in from 192.168.1.1', color: 'text-purple-400' },
 { time: '07:24:40', level: 'LOG', msg: 'Ticket #TK-1024 status changed: Open -> Pending', color: 'text-blue-400' },
 { time: '07:24:45', level: 'SYSCALL', msg: 'Executing auto-refund procedure for Trip-482... [SUCCESS]', color: 'text-emerald-500' },
 { time: '07:24:50', level: 'WARN', msg: 'Queue threshold exceeded: Billing Category', color: 'text-rose-400 font-bold' },
 { time: '07:24:52', level: 'INFO', msg: 'Daily summary report generated and mailed to admin@dashdrive.com', color: 'text-slate-500' },
 { time: '07:25:01', level: 'EXEC', msg: 'sh ./scripts/auto_dispatch.sh --mode adaptive --threshold 0.8', color: 'text-emerald-400 italic' },
 ].map((log, i) => (
 <div key={i} className="flex gap-6 group">
 <span className="text-slate-600 shrink-0">[{log.time}]</span>
 <span className={cn("font-black shrink-0 w-20", log.color)}>{log.level}</span>
 <span className="text-slate-300 group-hover:text-white transition-colors">{log.msg}</span>
 </div>
 ))}
 <div className="flex gap-4 items-center pt-2">
 <span className="text-[#0089D1] animate-pulse">❯</span>
 <div className="h-4 w-2 bg-[#0089D1] animate-pulse" />
 <span className="text-slate-700 italic">Listening for system events...</span>
 </div>
 </div>

 {/* Console Footer */}
 <div className="px-10 py-6 bg-slate-900 border-t border-slate-800 flex items-center gap-6">
 <div className="flex-1 flex gap-4 items-center bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 group-focus-within:border-[#0089D1] transition-all">
 <span className="text-[#0089D1] font-black font-mono">dashdrive@triage:~$</span>
 <input
 type="text"
 placeholder="Type command (e.g. /reassign TK-1028 --agent Sarah)..."
 className="bg-transparent border-none outline-none text-[11px] font-mono text-slate-300 w-full placeholder:text-slate-700"
 />
 </div>
 <button className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black transition-all border border-white/10 group">
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Execute
 </button>
 <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all">
 <Settings className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Bottom Insight Card */}
 <div className="max-w-4xl mx-auto p-12 bg-slate-900 rounded-[64px] text-white space-y-10 relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mt-32" />
 <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
 <div className="p-8 bg-white/10 rounded-[40px] text-emerald-400 shrink-0 border border-white/10">
 <Activity className="w-12 h-12" />
 </div>
 <div>
 <h4 className="text-2xl font-black tracking-tight italic underline decoration-[#0089D1] decoration-4 underline-offset-8">Real-time Triage Logic</h4>
 <p className="text-sm font-medium text-white/50 leading-relaxed mt-6">
 The console connects directly to the triage websocket stream. All actions taken here are prioritized in the execution queue.
 Use the command interface for direct database interaction and manual queue manipulation.
 </p>
 </div>
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="space-y-8">
 <div className="flex justify-center md:justify-start px-4">
 {renderTabs()}
 </div>

 <div className="px-4">
 {activeTab === 'Active' && renderActiveTickets()}
 {activeTab === 'Agents' && renderAgents()}
 {activeTab === 'Performance' && renderPerformance()}
 {activeTab === 'Settings' && renderSettings()}
 {activeTab === 'Console' && renderLiveConsole()}
 </div>
 </div>

 {/* Support Statistics Summary */}
 <div className="max-w-4xl mx-auto p-12 bg-white rounded-[64px] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089D1]/5 rounded-full blur-[80px] -mr-32 -mt-32" />
 <div className="flex flex-col md:flex-row items-center gap-10">
 <div className="p-8 bg-slate-900 rounded-[40px] text-[#0089D1] shrink-0">
 <Activity className="w-12 h-12" />
 </div>
 <div>
 <h4 className="text-2xl font-black text-slate-900 tracking-tight italic">Operational Health</h4>
 <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
 The support system is currently operating at <span className="text-[#0089D1] font-black">94% efficiency</span>.
 Average ticket wait time is within the SLA threshold of 15 minutes.
 </p>
 <div className="flex items-center gap-6 mt-6">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-[10px] font-black text-slate-400 ">SLA Compliant</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-blue-500" />
 <span className="text-[10px] font-black text-slate-400 ">Agents Online: 14/15</span>
 </div>
 </div>
 </div>
 <button className="shrink-0 p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-3xl transition-all">
 <Info className="w-6 h-6" />
 </button>
 </div>
 </div>
 </div>
 );
};
