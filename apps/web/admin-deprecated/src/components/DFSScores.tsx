import React, { useState } from 'react';
import {
 Brain,
 ShieldCheck,
 AlertTriangle,
 TrendingUp,
 TrendingDown,
 Target,
 Zap,
 Users,
 Search,
 MoreVertical,
 ChevronRight,
 ExternalLink,
 Activity,
 Award,
 BarChart3
} from 'lucide-react';
import { cn } from '../utils';

type DFSUserType = 'Drivers' | 'Customers';

export const DFSScores: React.FC = () => {
 const [activeType, setActiveType] = useState<DFSUserType>('Drivers');

 const scores = [
 { name: 'David Miller', id: 'D-8012', score: 92, risk: 'Low', eligibility: 'High (Pre-approved)', history: 'Stable', factor: 'Earnings consistency' },
 { name: 'Alex Thompson', id: 'D-8013', score: 78, risk: 'Low', eligibility: 'Medium', history: 'Improving', factor: 'Repayment behavior' },
 { name: 'Jessica Chen', id: 'D-8014', score: 42, risk: 'High', eligibility: 'No', history: 'Declining', factor: 'High cancellation rate' },
 { name: 'Michael Smith', id: 'D-8015', score: 65, risk: 'Medium', eligibility: 'Limited', history: 'Stable', factor: 'Low wallet activity' },
 { name: 'Sarah Jenkins', id: 'C-2041', score: 88, risk: 'Low', eligibility: 'High', history: 'Stable', factor: 'On-time PayLater' },
 ];

 const getScoreColor = (score: number) => {
 if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
 if (score >= 60) return 'text-blue-500 bg-blue-50 border-blue-100';
 if (score >= 40) return 'text-amber-500 bg-amber-50 border-amber-100';
 return 'text-rose-500 bg-rose-50 border-rose-100';
 };

 const getRiskColor = (risk: string) => {
 switch (risk) {
 case 'Low': return 'text-emerald-500';
 case 'Medium': return 'text-amber-500';
 case 'High': return 'text-rose-500';
 default: return 'text-slate-400';
 }
 };

 return (
 <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-[24px] bg-slate-900 flex items-center justify-center text-primary shadow-xl shadow-slate-900/20">
 <Brain className="w-8 h-8" />
 </div>
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Dash Financial Score (DFS)</h2>
 <p className="text-slate-500 text-sm font-medium italic">Context-aware algorithmic risk assessment engine.</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
 <Zap className="w-4 h-4 text-amber-500" />
 <span className="text-xs font-bold text-slate-600 ">AI Model v4.2 Active</span>
 </div>
 <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <BarChart3 className="w-4 h-4" />
 Re-calibrate Scores
 </button>
 </div>
 </div>

 {/* Analytics Summary */}
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 {[
 { label: 'Avg. Driver DFS', value: '78.4', icon: Award, color: 'text-primary' },
 { label: 'Avg. Customer DFS', value: '82.1', icon: ShieldCheck, color: 'text-emerald-500' },
 { label: 'Risk Exposure', value: 'Medium', icon: AlertTriangle, color: 'text-amber-500' },
 { label: 'Loan Eligibility', value: '12.4k users', icon: Target, color: 'text-blue-500' },
 ].map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 mb-2">{stat.label}</p>
 <div className="flex items-center gap-3">
 <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
 <stat.icon className={cn("w-5 h-5", stat.color)} />
 </div>
 </div>
 ))}
 </div>

 {/* Main Scoring Table Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="flex p-1 bg-slate-50 rounded-2xl w-fit">
 {['Drivers', 'Customers'].map((type) => (
 <button
 key={type}
 onClick={() => setActiveType(type as DFSUserType)}
 className={cn(
 "px-6 py-2 text-xs font-bold rounded-xl transition-all",
 activeType === type
 ? "bg-white text-slate-900 shadow-sm"
 : "text-slate-400 hover:text-slate-600"
 )}
 >
 {type}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by name or ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[250px] outline-none focus:ring-2 ring-primary/20 transition-all font-display"
 />
 </div>
 <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
 <Activity className="w-5 h-5" />
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Partner / Identity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">DFS Score (0-100)</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Risk Potential</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Loan Eligibility</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Primary Factor</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {scores.map((s) => (
 <tr key={s.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <Users className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{s.name}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{s.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-black border group-hover:scale-110 transition-transform shadow-sm",
 getScoreColor(s.score)
 )}>
 {s.score}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-1">
 <span className={cn("text-xs font-black ", getRiskColor(s.risk))}>{s.risk} Risk</span>
 <div className="flex items-center gap-1">
 {s.history === 'Stable' ? <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> : (s.history === 'Improving' ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />)}
 <span className="text-[10px] font-bold text-slate-400 ">{s.history}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className="text-sm font-bold text-slate-700">{s.eligibility}</span>
 </td>
 <td className="px-8 py-6">
 <p className="text-[10px] font-black text-slate-900 ">{s.factor}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">Algorithmic Weight: 82%</p>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2 text-slate-400">
 <button className="p-2 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Full AI Profile">
 <ExternalLink className="w-5 h-5" />
 </button>
 <button className="p-2 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
 <MoreVertical className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* AI Strategy Insights Card */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
 <div className="relative z-10 space-y-4">
 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
 <ShieldCheck className="w-8 h-8 text-primary" />
 </div>
 <h3 className="text-2xl font-black tracking-tight italic">Fraud Defense Active</h3>
 <p className="text-lg opacity-60 font-medium leading-relaxed">
 The DFS engine has identified suspicious refund patterns in <span className="text-white font-bold italic">0.42%</span> of active accounts.
 Automatic freezing has been applied to high-risk transactions pending manual admin review.
 </p>
 <button className="flex items-center gap-2 text-primary font-black text-sm pt-4 hover:translate-x-2 transition-transform">
 REVIEW DEFENSE LOGS
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
 </div>

 <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 group overflow-hidden flex flex-col justify-between">
 <div className="space-y-4">
 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
 <Award className="w-8 h-8 text-blue-500" />
 </div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Inclusion Metrics</h3>
 <p className="text-lg text-slate-500 font-medium leading-relaxed">
 By leveraging non-traditional data (trip frequency, rating stability), we have safely extended credit to <span className="text-slate-900 font-bold italic">4,200</span> unbanked partners.
 Collection success for this segment remains at an impressive <span className="text-emerald-500 font-bold">96.8%</span>.
 </p>
 </div>
 <div className="pt-8">
 <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 ">
 <Users className="w-4 h-4" />
 Growth segment: Level 2 &amp; 3 Drivers
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
