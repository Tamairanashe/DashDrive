import React from 'react';
import {
 Wallet,
 ArrowUpRight,
 ArrowDownRight,
 Search,
 MoreVertical,
 Plus,
 Snowflake,
 ShieldCheck,
 TrendingUp,
 History,
 CreditCard,
 User,
 ExternalLink,
 ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

export const CustomerWallet: React.FC = () => {
 const wallets = [
 { name: 'Sarah Jenkins', id: 'C-2041', balance: '$1,240.50', topups: '$5,400', spent: '$4,159.50', refunds: '$250', status: 'Active', lastTx: '2h ago' },
 { name: 'Michael Chen', id: 'C-2042', balance: '$85.20', topups: '$2,100', spent: '$2,014.80', refunds: '$0', status: 'Active', lastTx: '5h ago' },
 { name: 'Emma Watson', id: 'C-2043', balance: '$450.00', topups: '$1,200', spent: '$750', refunds: '$450', status: 'Frozen', lastTx: '1d ago' },
 { name: 'Robert Paulson', id: 'C-2044', balance: '$12.00', topups: '$800', spent: '$788', refunds: '$0', status: 'Active', lastTx: '4h ago' },
 ];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Customer Wallet</h2>
 <p className="text-slate-500 text-sm font-medium">Manage user credits, refunds, and spending limits.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4" />
 Bulk Credit Adjust
 </button>
 </div>
 </div>

 {/* Stats Breakdown */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Total Wallet Liquidity', value: '$8,450,200', icon: Wallet, color: 'text-primary' },
 { label: 'Avg. Balance / User', value: '$142.50', icon: TrendingUp, color: 'text-blue-500' },
 { label: 'Total Monthly Top-ups', value: '$1.4M', icon: ArrowUpRight, color: 'text-emerald-500' },
 { label: 'Pending Refunds', value: '$12,400', icon: History, color: 'text-amber-500' },
 ].map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <div className="flex items-center gap-3 mb-4">
 <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", stat.color)}>
 <stat.icon className="w-5 h-5 shadow-inner" />
 </div>
 <p className="text-[10px] font-bold text-slate-400 ">{stat.label}</p>
 </div>
 <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
 </div>
 ))}
 </div>

 {/* Wallet Table */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <h3 className="text-lg font-black text-slate-900 tracking-tight">User Wallet Balances</h3>
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by name or customer ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Customer</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Wallet Balance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Total Top-ups</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Spent / Refunds</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {wallets.map((wallet) => (
 <tr key={wallet.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <User className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{wallet.name}</p>
 <p className="text-xs font-bold text-slate-400">{wallet.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {wallet.balance}
 </td>
 <td className="px-8 py-6 text-sm font-bold text-slate-600">
 {wallet.topups}
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div>
 <p className="text-xs font-bold text-slate-700">{wallet.spent}</p>
 <p className="text-[10px] font-bold text-slate-400 ">Spent</p>
 </div>
 <div className="w-px h-6 bg-slate-100" />
 <div>
 <p className="text-xs font-bold text-emerald-600">{wallet.refunds}</p>
 <p className="text-[10px] font-bold text-slate-400 ">Refunds</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 wallet.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {wallet.status === 'Active' ? <ShieldCheck className="w-3 h-3" /> : <Snowflake className="w-3 h-3" />}
 {wallet.status}
 </div>
 <p className="text-[10px] text-slate-400 font-bold mt-1.5">Last TX: {wallet.lastTx}</p>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Details">
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
 <CreditCard className="w-10 h-10 text-primary" />
 </div>
 <div className="flex-1 space-y-2">
 <h3 className="text-xl font-black tracking-tight">Financial Resilience Program</h3>
 <p className="text-sm opacity-60 font-medium max-w-2xl leading-relaxed">
 Based on the new <span className="text-white font-bold italic">Dash Financial Score (DFS)</span>,
 we have automatically increased the PayLater limit for 12,400 top-tier customers.
 This program has increased super app transaction frequency by 1.8x.
 </p>
 </div>
 <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:translate-x-2 transition-transform group flex items-center gap-2">
 View Analytics
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.03] -rotate-12" />
 </div>
 </div>
 );
};
