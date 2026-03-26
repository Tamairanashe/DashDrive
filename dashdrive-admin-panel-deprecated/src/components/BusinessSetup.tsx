import React, { useState } from 'react';
import {
 Briefcase,
 Globe,
 MapPin,
 CreditCard,
 ShieldCheck,
 Building2,
 ChevronRight,
 Save,
 Upload,
 Info,
 MoreVertical,
 CheckCircle2,
 Smartphone,
 Mail,
 Activity,
 LayoutGrid,
 Percent,
 TrendingUp,
 FileText
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const BusinessSetup: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Enterprise Profile');

 const renderProfile = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Core Identity */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4 mb-2">
 <div className="p-3 bg-[#0089D1]/5 rounded-2xl text-[#0089D1]">
 <Building2 className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Identity</h3>
 <p className="text-xs font-medium text-slate-400 mt-1">Global brand and legal entity definition.</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex items-center gap-6">
 <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center group hover:border-[#0089D1]/30 transition-all cursor-pointer">
 <Upload className="w-6 h-6 text-slate-300 group-hover:text-[#0089D1]" />
 <span className="text-[8px] font-black text-slate-400 mt-2 ">Logo</span>
 </div>
 <div className="flex-1 space-y-4">
 <div className="space-y-1">
 <label className="text-[10px] font-black text-slate-400 ml-1">Legal Name</label>
 <input type="text" value="DashDrive Technologies Africa Ltd." placeholder="Legal Trading Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900" />
 </div>
 <div className="space-y-1">
 <label className="text-[10px] font-black text-slate-400 ml-1">Tax ID / TIN</label>
 <input type="text" value="NG-VAT-90123544" placeholder="Tax Registration Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900" />
 </div>
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-black text-slate-400 ml-1">Official Address</label>
 <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 h-24 resize-none" defaultValue="45 Tech Plaza, Herbert Macaulay Way, Yaba, Lagos, Nigeria" />
 </div>
 </div>
 </div>

 {/* Global Operations Hub */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
 <div className="flex items-center gap-4 mb-2">
 <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
 <Globe className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Market Settings</h3>
 <p className="text-xs font-medium text-slate-400 mt-1">Multi-regional operational parameters.</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {[
 { label: 'Primary Market', value: 'Nigeria', icon: MapPin },
 { label: 'Main Currency', value: 'NGN (â‚¦)', icon: CreditCard },
 { label: 'Timezone', value: 'WAT (UTC+1)', icon: Globe },
 { label: 'Measure Sys', value: 'Metric (km)', icon: Activity }
 ].map((m, i) => (
 <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:border-indigo-400/30 transition-all duration-300">
 <div className="p-3 bg-white rounded-xl w-fit text-slate-300 group-hover:text-indigo-400 transition-colors shadow-sm mb-4">
 <m.icon className="w-4 h-4" />
 </div>
 <p className="text-[9px] font-black text-slate-400 ">{m.label}</p>
 <p className="text-sm font-black text-slate-900 mt-1">{m.value}</p>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Corporate Branches */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-xl font-black text-slate-900">Branch Orchestration</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Manage physical operations and regional hubs.</p>
 </div>
 <button className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Add Operating Branch</button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 { name: 'Lagos Main Hub', zone: 'Ikeja', staff: 124, status: 'HQ' },
 { name: 'Abuja Regional', zone: 'Maitama', staff: 45, status: 'Branch' },
 { name: 'Port Harcourt Hub', zone: 'GRA Phase 2', staff: 28, status: 'Satellite' }
 ].map((branch, i) => (
 <div key={i} className="p-8 bg-slate-50 rounded-[36px] border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center justify-between mb-6">
 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0089D1]">
 <Building2 className="w-6 h-6" />
 </div>
 <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full tracking-tighter">{branch.status}</span>
 </div>
 <h4 className="text-base font-black text-slate-900 mb-1">{branch.name}</h4>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold text-slate-400">{branch.zone}</span>
 <span className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1]">{branch.staff} Staff</span>
 </div>
 <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
 <button className="text-[10px] font-black text-slate-900 hover:text-[#0089D1] transition-colors flex items-center gap-2">Manage Branch <ChevronRight className="w-3 h-3" /></button>
 <MoreVertical className="w-4 h-4 text-slate-200" />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Management</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Business</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Enterprise Setup</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Orchestrate legal compliance, regional identity, and operating branches.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Enterprise Profile', 'Compliance', 'Branches', 'Taxes'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 group">
 <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Persist Profile
 </button>
 </div>

 {activeTab === 'Enterprise Profile' && renderProfile()}
 {activeTab !== 'Enterprise Profile' && (
 <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <Building2 className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">{activeTab} Console</h2>
 <p className="text-sm font-medium">Provisioning regional {activeTab.toLowerCase()} data for Lagos Hub.</p>
 </div>
 )}
 </div>
 );
};
