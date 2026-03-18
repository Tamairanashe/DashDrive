import React, { useState } from 'react';
import {
 Zap,
 RotateCcw,
 Save,
 Info,
 LayoutDashboard,
 MessageSquare,
 Sparkles,
 Shield,
 Bot,
 Key,
 ExternalLink,
 Lock
} from 'lucide-react';
import { cn } from '../utils';

export const AISetup: React.FC = () => {
 const [enabled, setEnabled] = useState(true);
 const [apiKey, setApiKey] = useState('');
 const [orgId, setOrgId] = useState('');

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Sparkles className="w-6 h-6 text-amber-400" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Intelligent Automation</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">AI Setup</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Connect and manage OpenAI services to power smart responses, automation, and intelligent platform features.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button
 onClick={() => { setApiKey(''); setOrgId(''); }}
 className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all focus:ring-4 focus:ring-slate-100"
 >
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display focus:ring-4 focus:ring-[#007AB8]/20">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}

 <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
 <div className="bg-white p-12 rounded-[80px] border border-slate-100 shadow-sm space-y-12 relative overflow-hidden group hover:shadow-2xl hover:border-amber-100 transition-all duration-500">
 {/* Decorative Background Gradient */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-amber-500/10" />

 <div className="flex items-center justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className="p-5 bg-amber-50 text-amber-600 rounded-[32px] shadow-sm animate-pulse">
 <Bot className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-3xl font-black text-slate-900 tracking-tight">AI Configuration</h3>
 <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mt-1">OpenAI API Connection Hub</p>
 </div>
 </div>

 <div className="flex items-center gap-8">
 <button className="flex items-center gap-2 text-[10px] font-black text-[#0089D1] hover:underline transition-all group/link">
 <ExternalLink className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" /> How it Works
 </button>
 <label className="flex items-center gap-4 cursor-pointer">
 <span className={cn(
 "text-[10px] font-black transition-colors",
 enabled ? "text-emerald-500" : "text-slate-400"
 )}>
 {enabled ? 'Active' : 'Disabled'}
 </span>
 <div
 onClick={() => setEnabled(!enabled)}
 className={cn(
 "w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center relative shadow-inner",
 enabled ? "bg-emerald-500" : "bg-slate-200"
 )}
 >
 <div className={cn(
 "w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-500 transform",
 enabled ? "translate-x-7" : "translate-x-0"
 )} />
 </div>
 </label>
 </div>
 </div>

 <div className="space-y-10 relative z-10">
 <div className="space-y-4">
 <div className="flex items-center justify-between px-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em]">OpenAI API Key *</label>
 <span className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
 <Shield className="w-3 h-3" /> Encrypted Storage
 </span>
 </div>
 <div className="relative group">
 <input
 type="password"
 value={apiKey}
 onChange={(e) => setApiKey(e.target.value)}
 placeholder="sk-â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
 className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none hover:border-amber-200 focus:ring-8 focus:ring-amber-500/5 transition-all shadow-sm"
 />
 <Key className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-4">OpenAI Organization ID *</label>
 <div className="relative group">
 <input
 type="text"
 value={orgId}
 onChange={(e) => setOrgId(e.target.value)}
 placeholder="org-â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
 className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[40px] text-xs font-mono text-slate-600 outline-none hover:border-amber-200 focus:ring-8 focus:ring-amber-500/5 transition-all shadow-sm"
 />
 <Lock className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
 </div>
 </div>
 </div>

 <div className="pt-4 flex flex-col gap-6 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3 hover:border-blue-100 transition-colors group/feat">
 <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-blue-500 group-hover/feat:bg-blue-500 group-hover/feat:text-white transition-all">
 <MessageSquare className="w-5 h-5" />
 </div>
 <h4 className="text-xs font-black text-slate-900 ">Smart Support</h4>
 <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
 Automated customer support replies and ticket triage powered by GPT-4.
 </p>
 </div>
 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3 hover:border-emerald-100 transition-colors group/feat">
 <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-emerald-500 group-hover/feat:bg-emerald-500 group-hover/feat:text-white transition-all">
 <Zap className="w-5 h-5" />
 </div>
 <h4 className="text-xs font-black text-slate-900 ">Auto Logistics</h4>
 <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
 Intelligent dispatching and route optimization using predictive modeling.
 </p>
 </div>
 </div>

 <button className="w-full py-6 bg-slate-900 text-white rounded-[40px] text-sm font-black tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:scale-[1.01] active:scale-95 transition-all active:shadow-none">
 Save AI Information
 </button>
 </div>
 </div>

 <div className="mt-8 flex items-start gap-4 p-8 bg-amber-50/50 rounded-[40px] border border-amber-100/50">
 <Info className="w-6 h-6 text-amber-600 mt-1" />
 <div className="space-y-2">
 <h4 className="text-sm font-black text-amber-900 italic">Security Best Practice</h4>
 <p className="text-xs font-medium text-amber-800/80 leading-relaxed">
 Your OpenAI API keys are never stored in plain text. We use AES-256 encryption at the bridge layer.
 Ensure your OpenAI account has sufficient credits to prevent API interruptions.
 </p>
 </div>
 </div>
 </div>
 </div>
 );
};
