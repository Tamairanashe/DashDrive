import React from 'react';
import {
 Landmark,
 HandCoins,
 TrendingDown,
 Clock,
 CheckCircle2,
 AlertCircle,
 BarChart3,
 Search,
 MoreVertical,
 Plus,
 ArrowRight,
 ShieldCheck,
 Building,
 Target,
 ExternalLink
} from 'lucide-react';
import { cn } from '../utils';

export const Loans: React.FC = () => {
 const loans = [
 { id: 'LN-8001', borrower: 'David Miller', type: 'Driver Micro-loan', amount: '$1,200', emi: '$100/mo', tenure: '12 Mo', remaining: '$800', status: 'Active', risk: 'Low' },
 { id: 'LN-8002', borrower: 'Pizza Fusion', type: 'Merchant Growth', amount: '$5,000', emi: '$450/mo', tenure: '24 Mo', remaining: '$5,000', status: 'Pending', risk: 'Medium' },
 { id: 'LN-8003', borrower: 'Michael Smith', type: 'Customer Credit', amount: '$500', emi: '$50/mo', tenure: '10 Mo', remaining: '$150', status: 'Active', risk: 'Low' },
 { id: 'LN-8004', borrower: 'Alex Thompson', type: 'Driver Micro-loan', amount: '$2,000', emi: '$180/mo', tenure: '12 Mo', remaining: '$1,440', status: 'Default', risk: 'High' },
 ];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Loans &amp; Credit Finance</h2>
 <p className="text-slate-500 text-sm font-medium">Approve micro-loans, track EMI repayments, and manage financial risk levels.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <BarChart3 className="w-4 h-4" />
 Loan Risk Analytics
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4" />
 New Loan Program
 </button>
 </div>
 </div>

 {/* Loan Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Total Active Loans', value: '$4.2M', icon: Landmark, color: 'text-primary' },
 { label: 'Expected Monthly EMI', value: '$342,000', icon: TrendingDown, color: 'text-blue-500' },
 { label: 'Loan Approval Rate', value: '42%', icon: Target, color: 'text-emerald-500' },
 { label: 'Default Exposure', value: '$84,500', icon: AlertCircle, color: 'text-rose-500' },
 ].map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-3 mb-4">
 <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", stat.color)}>
 <stat.icon className="w-5 h-5" />
 </div>
 <p className="text-[10px] font-bold text-slate-400 ">{stat.label}</p>
 </div>
 <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
 </div>
 ))}
 </div>

 {/* Main Table Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Loan Accounts Ledger</h3>
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by borrower or loan ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Borrower / Program</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Principal Amount</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">EMI &amp; Tenure</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Balance Remaining</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Risk &amp; Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {loans.map((loan) => (
 <tr key={loan.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <HandCoins className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{loan.borrower}</p>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold text-slate-400 ">{loan.id}</span>
 <span className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-bold text-primary italic">{loan.type}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {loan.amount}
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-700">{loan.emi}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">{loan.tenure} Duration</p>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <p className="text-sm font-black text-slate-900">{loan.remaining}</p>
 <div className="h-1.5 w-24 bg-slate-50 rounded-full overflow-hidden">
 <div
 className="h-full bg-primary rounded-full transition-all"
 style={{ width: `${(parseFloat(loan.remaining.replace('$', '').replace(',', '')) / parseFloat(loan.amount.replace('$', '').replace(',', ''))) * 100}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 loan.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : loan.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {loan.status === 'Default' ? <AlertCircle className="w-3 h-3" /> : (loan.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />)}
 {loan.status} â€¢ {loan.risk}
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2 text-slate-400">
 <button className="p-2 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Details">
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

 {/* Risk Mitigation Card */}
 <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30">
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
 <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
 <ShieldCheck className="w-10 h-10 text-primary" />
 </div>
 <div className="flex-1 space-y-2">
 <h3 className="text-xl font-black tracking-tight">EMI Collection - Automated Retry Logic</h3>
 <p className="text-sm opacity-60 font-medium max-w-2xl leading-relaxed">
 Based on historical data, we've enabled an adaptive retry window for EMI collections.
 Attempts are now prioritized based on top-up behavior and wallet activity to maximize collection success without manual intervention.
 </p>
 </div>
 <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:translate-x-2 transition-transform group flex items-center gap-2">
 Collection Dashboard
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <Building className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.03] rotate-12" />
 </div>
 </div>
 );
};
