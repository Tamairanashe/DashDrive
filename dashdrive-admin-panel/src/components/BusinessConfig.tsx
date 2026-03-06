import React, { useState } from 'react';
import {
 Briefcase,
 Settings2,
 Lock,
 Settings,
 ChevronRight,
 Plus,
 Search,
 ShieldCheck,
 Smartphone,
 Globe,
 Bell,
 LayoutGrid,
 UserCheck,
 Key,
 Shield,
 Zap,
 Clock,
 RefreshCw,
 MoreVertical,
 CheckCircle2,
 AlertCircle
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const BusinessConfig: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Business Setup');

 const roles = [
 { role: 'Super Admin', users: 3, permissions: 'All Access', status: 'Core' },
 { role: 'Operation Manager', users: 12, permissions: 'Fleet, Orders, Drivers', status: 'Custom' },
 { role: 'Merchant Admin', users: 45, permissions: 'Store Mgmt only', status: 'Restricted' },
 { role: 'Financial Auditor', users: 2, permissions: 'Reports, Transactions', status: 'Read-only' },
 ];

 const renderSetup = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { title: 'Global Operations', icon: Globe, items: ['Country: Nigeria', 'Currency: NGN (₦)', 'Timezone: UTC+1', 'Language: English'] },
 { title: 'Platform Controls', icon: Zap, items: ['Multi-currency: Enabled', 'Real-time Tracking: ON', 'Auto-assign: Optimized', 'Dynamic Pricing: Active'] },
 { title: 'System Health', icon: RefreshCw, items: ['API Latency: 45ms', 'DB Status: Healthy', 'Queue Status: Empty', 'Last Backup: 1hr ago'] }
 ].map((box, i) => (
 <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8 group hover:border-[#0089D1]/30 transition-all duration-500">
 <div className="p-4 bg-slate-50 rounded-2xl w-fit text-slate-400 group-hover:text-[#0089D1] transition-colors">
 <box.icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 mb-6">{box.title}</h3>
 <div className="space-y-3">
 {box.items.map((item, j) => (
 <div key={j} className="flex items-center justify-between py-2 text-xs font-bold">
 <span className="text-slate-400">{item.split(': ')[0]}</span>
 <span className="text-slate-900">{item.split(': ')[1]}</span>
 </div>
 ))}
 </div>
 </div>
 <button className="w-full py-4 text-[#0089D1] text-[10px] font-black hover:bg-[#0089D1]/5 rounded-2xl transition-all border border-[#0089D1]/10">Manage {box.title.split(' ')[0]}</button>
 </div>
 ))}
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-black">
 <h3 className="text-xl font-black mb-8">Role Based Access Control (RBAC)</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Role Designation</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Permissions Scope</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4 text-center">Active Users</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Type</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {roles.map((r, i) => (
 <tr key={i} className="group hover:bg-slate-50/50 transition-all">
 <td className="py-6 px-4">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
 <Shield className="w-5 h-5 text-white" />
 </div>
 <span className="text-xs font-black text-slate-900">{r.role}</span>
 </div>
 </td>
 <td className="py-6 px-4">
 <span className="text-xs font-bold text-slate-500">{r.permissions}</span>
 </td>
 <td className="py-6 px-4 text-center">
 <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{r.users} Users</span>
 </td>
 <td className="py-6 px-4">
 <span className={cn(
 "text-[9px] font-black px-3 py-1 rounded-full",
 r.status === 'Core' ? "bg-amber-50 text-amber-600" :
 r.status === 'Custom' ? "bg-[#0089D1]/5 text-[#0089D1]" : "bg-slate-100 text-slate-500"
 )}>{r.status}</span>
 </td>
 <td className="py-6 px-4 text-right">
 <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
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
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-black">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Administration</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Config</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Governance & Config</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Global system parameters and enterprise security controls.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Business Setup', 'Configuration', 'Roles & Permissions', 'Settings'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <div className="flex items-center gap-3">
 <div className="flex flex-col items-end mr-2">
 <span className="text-[10px] font-black text-slate-400 ">Environment</span>
 <span className="text-xs font-black text-emerald-500">PRODUCTION</span>
 </div>
 <button className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 transition-all"><RefreshCw className="w-5 h-5" /></button>
 </div>
 </div>

 {activeTab === 'Business Setup' && renderSetup()}
 {activeTab !== 'Business Setup' && (
 <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <Settings2 className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">{activeTab} Interface</h2>
 <p className="text-sm font-medium">Undergoing security audit for multi-tenancy support.</p>
 </div>
 )}
 </div>
 );
};
