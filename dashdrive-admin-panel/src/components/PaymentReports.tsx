import React, { useState } from 'react';
import {
 FileText,
 Download,
 Calendar,
 Filter,
 BarChart3,
 TrendingUp,
 ArrowUpRight,
 ArrowDownRight,
 ChevronDown,
 PieChart,
 Target,
 Clock,
 ExternalLink,
 MoreVertical,
 Activity,
 Zap
} from 'lucide-react';
import { cn } from '../utils';

type ReportType = 'Daily Revenue' | 'Service-wise' | 'Wallet Usage' | 'Refunds' | 'Commissions';

export const PaymentReports: React.FC = () => {
 const [activeReport, setActiveReport] = useState<ReportType>('Daily Revenue');

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Financial Reports &amp; Analytics</h2>
 <p className="text-slate-500 text-sm font-medium">Generate multi-dimensional financial insights and audit-ready exports.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <Calendar className="w-4 h-4" />
 Select Range
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Download className="w-4 h-4" />
 Batch Export PDF
 </button>
 </div>
 </div>

 {/* Report Types Sidebar/Sub-nav */}
 <div className="flex flex-wrap gap-3">
 {['Daily Revenue', 'Service-wise', 'Wallet Usage', 'Refunds', 'Commissions'].map((report) => (
 <button
 key={report}
 onClick={() => setActiveReport(report as ReportType)}
 className={cn(
 "px-6 py-3 rounded-2xl text-xs font-black transition-all",
 activeReport === report
 ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
 : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
 )}
 >
 {report}
 </button>
 ))}
 </div>

 {/* Analytics Summary */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group">
 <div className="relative z-10 flex justify-between items-start mb-8">
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeReport} Analysis</h3>
 <p className="text-sm text-slate-500 font-medium">Growth and distribution trends for the selected period.</p>
 </div>
 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 animate-pulse">
 <Activity className="w-4 h-4" />
 <span className="text-[10px] font-black ">Live Feed</span>
 </div>
 </div>

 <div className="h-[400px] flex items-end gap-2 px-4 pt-10">
 {[45, 62, 58, 75, 90, 82, 95, 88, 72, 85, 92, 110].map((val, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
 <div className="w-full relative">
 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
 ${val}k
 </div>
 <div
 className={cn(
 "w-full rounded-t-xl transition-all duration-1000",
 i === 11 ? "bg-primary" : "bg-slate-100 group-hover/bar:bg-slate-200"
 )}
 style={{ height: `${val * 3}px` }}
 />
 </div>
 <span className="text-[10px] font-bold text-slate-400 ">M{i + 1}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
 <div className="space-y-1">
 <p className="text-xs font-bold text-slate-400 ">Net Revenue Delta</p>
 <h4 className="text-3xl font-black text-slate-900">+$242,500</h4>
 <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs pt-2">
 <ArrowUpRight className="w-4 h-4" />
 <span>12.4% vs Prev. Month</span>
 </div>
 </div>
 <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
 <TrendingUp className="w-10 h-10" />
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group overflow-hidden relative">
 <div className="space-y-1">
 <p className="text-xs font-bold text-slate-400 ">Platform Fees (Avg.)</p>
 <h4 className="text-3xl font-black text-slate-900">18.2%</h4>
 <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs pt-2">
 <ArrowDownRight className="w-4 h-4" />
 <span>-1.2% Fee Attrition</span>
 </div>
 </div>
 <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
 <Target className="w-10 h-10" />
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden">
 <h3 className="text-lg font-black tracking-tight mb-8">Report Insights</h3>
 <div className="space-y-6">
 {[
 { title: 'Top Vertical', value: 'Food Delivery', sub: '38.2% Share' },
 { title: 'Primary Method', value: 'Dash Wallet', sub: 'Increased 12%' },
 { title: 'Refund Impact', value: '$12,400', sub: '0.8% of Gross' }
 ].map((insight) => (
 <div key={insight.title} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
 <p className="text-[10px] font-bold text-white/40 ">{insight.title}</p>
 <div className="flex justify-between items-center mt-1">
 <span className="text-sm font-black">{insight.value}</span>
 <span className="text-[10px] font-bold text-primary">{insight.sub}</span>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-8 pt-8 border-t border-white/10">
 <p className="text-xs font-medium opacity-40 leading-relaxed italic">
 * Data is automatically reconciled every 4 hours from the Stripe &amp; Dash Wallet ledger APIs.
 </p>
 </div>
 <Zap className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.03] rotate-12" />
 </div>

 <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
 <div className="flex justify-between items-center mb-2">
 <h4 className="text-sm font-black text-slate-900 ">Scheduled Reports</h4>
 <button className="text-[10px] font-black text-primary hover:underline">Manage All</button>
 </div>
 <div className="space-y-4">
 {[
 { name: 'Monthly Finance Audit', date: 'Mar 01', freq: 'Monthly' },
 { name: 'Daily Ops Revenue', date: 'Tomorrow', freq: 'Daily' },
 { name: 'Partner Payout Report', date: 'Friday', freq: 'Weekly' }
 ].map((rep) => (
 <div key={rep.name} className="flex items-center gap-4 group">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
 <Clock className="w-5 h-5" />
 </div>
 <div className="flex-1">
 <p className="text-sm font-black text-slate-900 leading-tight">{rep.name}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{rep.freq} • Next: {rep.date}</p>
 </div>
 <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
