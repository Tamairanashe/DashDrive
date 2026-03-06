import React from 'react';
import {
 CreditCard,
 Zap,
 TrendingDown,
 Users,
 AlertTriangle,
 Clock,
 CheckCircle2,
 Calendar,
 MoreVertical,
 Search,
 ArrowUpRight,
 ShieldEllipsis,
 ExternalLink,
 ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

export const PayLaterBNPL: React.FC = () => {
 const accounts = [
 { name: 'Sarah Jenkins', id: 'PL-501', limit: '$500', used: '$420.50', outstanding: '$420.50', dueDate: 'Mar 01, 2026', risk: 'Low', status: 'Active' },
 { name: 'Michael Chen', id: 'PL-502', limit: '$250', used: '$0', outstanding: '$0', dueDate: '-', risk: 'Low', status: 'Active' },
 { name: 'Emma Watson', id: 'PL-503', limit: '$1,000', used: '$850', outstanding: '$920', dueDate: 'Feb 15, 2026', risk: 'High', status: 'Overdue' },
 { name: 'Robert Paulson', id: 'PL-504', limit: '$750', used: '$120', outstanding: '$120', dueDate: 'Mar 15, 2026', risk: 'Medium', status: 'Active' },
 ];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">PayLater (BNPL) Dashboard</h2>
 <p className="text-slate-500 text-sm font-medium">Manage user credit limits, outstanding balances, and repayment health.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <Calendar className="w-4 h-4" />
 Payment Collection Cycle
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 Auto-Penalty Setup
 </button>
 </div>
 </div>

 {/* BNPL KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Total Credit Issued', value: '$1.84M', trend: '+14%', color: 'text-primary' },
 { label: 'Total Outstanding', value: '$642,800', trend: '+4%', color: 'text-blue-500' },
 { label: 'Default Rate', value: '1.24%', trend: '-0.2%', color: 'text-emerald-500' },
 { label: 'Active BNPL Users', value: '42,800', trend: '+800', color: 'text-amber-500' },
 ].map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 mb-2">{stat.label}</p>
 <div className="flex items-end gap-3">
 <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
 <span className={cn("text-[10px] font-black pb-1 ", stat.trend.startsWith('+') ? 'text-primary' : 'text-emerald-500')}>{stat.trend}</span>
 </div>
 </div>
 ))}
 </div>

 {/* Account Table */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <h3 className="text-lg font-black text-slate-900 tracking-tight">BNPL Accounts</h3>
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by name or PL ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[250px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
 <ShieldEllipsis className="w-5 h-5" />
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Customer Account</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Credit Limit</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Used / Outstanding</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Expected Repayment</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Risk Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {accounts.map((acc) => (
 <tr key={acc.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <Users className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{acc.name}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{acc.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {acc.limit}
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex justify-between text-[10px] font-bold text-slate-400 ">
 <span>{acc.used} Used</span>
 <span className="text-primary">{acc.outstanding} Bal.</span>
 </div>
 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
 <div
 className="h-full bg-primary rounded-full transition-all duration-1000"
 style={{ width: `${(parseFloat(acc.used.replace('$', '')) / parseFloat(acc.limit.replace('$', ''))) * 100}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-bold text-slate-600">
 {acc.dueDate}
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 acc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {acc.status === 'Overdue' ? <AlertTriangle className="w-3 h-3" /> : (acc.risk === 'Low' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />)}
 {acc.status} • {acc.risk} Risk
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Credit Report">
 <ExternalLink className="w-5 h-5" />
 </button>
 <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
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

 {/* Featured Insight Card */}
 <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
 <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
 <Zap className="w-10 h-10 text-primary" />
 </div>
 <div className="flex-1 space-y-2">
 <h3 className="text-xl font-black tracking-tight">Auto-Repayment Optimization</h3>
 <p className="text-sm opacity-60 font-medium max-w-2xl leading-relaxed">
 Super app wallet auto-sweeps are currently enabled for <span className="text-white font-bold">82%</span> of PayLater users.
 This has reduced manual collection efforts by 40% and improved repayment rates within the first 3 days of the month by 15%.
 </p>
 </div>
 <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:translate-x-2 transition-transform group flex items-center gap-2">
 Repayment Settings
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <TrendingDown className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.03] -rotate-12" />
 </div>
 </div>
 );
};
