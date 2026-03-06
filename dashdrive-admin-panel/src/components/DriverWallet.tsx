import React from 'react';
import {
 Car,
 DollarSign,
 TrendingUp,
 Clock,
 ArrowDownLeft,
 Search,
 MoreVertical,
 Banknote,
 Ban,
 ShieldCheck,
 Calendar,
 ChevronRight,
 ExternalLink,
 Target
} from 'lucide-react';
import { cn } from '../utils';

export const DriverWallet: React.FC = () => {
 const wallets = [
 { name: 'David Miller', id: 'D-8012', earnings: '$12,450', balance: '$842.20', pending: '$1,200', withdrawable: '$842.20', status: 'Active', lastPayout: 'Feb 15, 2026' },
 { name: 'Alex Thompson', id: 'D-8013', earnings: '$8,200', balance: '$2,140.50', pending: '$450', withdrawable: '$2,140.50', status: 'Active', lastPayout: 'Feb 18, 2026' },
 { name: 'Jessica Chen', id: 'D-8014', earnings: '$15,680', balance: '$25.00', pending: '$2,400', withdrawable: '$25.00', status: 'Suspended', lastPayout: 'Feb 10, 2026' },
 { name: 'Michael Smith', id: 'D-8015', earnings: '$10,120', balance: '$450.75', pending: '$890', withdrawable: '$450.75', status: 'Active', lastPayout: 'Feb 20, 2026' },
 ];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Driver Earnings &amp; Payouts</h2>
 <p className="text-slate-500 text-sm font-medium">Manage partner earnings, manual payouts, and billing history.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <Calendar className="w-4 h-4" />
 Payout Schedule
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 Process Manual Payout
 </button>
 </div>
 </div>

 {/* Driver Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Total Driver Earnings', value: '$2.42M', icon: DollarSign, color: 'text-emerald-500' },
 { label: 'Avg. Weekly Earnings', value: '$1,240', icon: TrendingUp, color: 'text-blue-500' },
 { label: 'Total Withdrawable', value: '$184,500', icon: Banknote, color: 'text-primary' },
 { label: 'Pending Payouts', value: '$42,800', icon: Clock, color: 'text-amber-500' },
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
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Driver Wallet Status</h3>
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by name or driver ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Driver</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Total Lifetime Earnings</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Current Balance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Pending / Withdrawable</th>
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
 <Car className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{wallet.name}</p>
 <p className="text-xs font-bold text-slate-400">{wallet.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {wallet.earnings}
 </td>
 <td className="px-8 py-6 text-sm font-bold text-slate-600">
 {wallet.balance}
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div>
 <p className="text-xs font-bold text-amber-600">{wallet.pending}</p>
 <p className="text-[10px] font-bold text-slate-400 ">Pending</p>
 </div>
 <div className="w-px h-6 bg-slate-100" />
 <div>
 <p className="text-xs font-bold text-emerald-600">{wallet.withdrawable}</p>
 <p className="text-[10px] font-bold text-slate-400 ">Avail.</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 wallet.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {wallet.status === 'Active' ? <ShieldCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
 {wallet.status}
 </div>
 <p className="text-[10px] text-slate-400 font-bold mt-1.5">Last Payout: {wallet.lastPayout}</p>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Process Payout">
 <ArrowDownLeft className="w-5 h-5" />
 </button>
 <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Logs">
 <ExternalLink className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Incentive Insight Card */}
 <div className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-primary/30">
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
 <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
 <Target className="w-10 h-10 text-white" />
 </div>
 <div className="flex-1 space-y-2">
 <h3 className="text-xl font-black tracking-tight text-white">Driver Retention Bonus Status</h3>
 <p className="text-sm opacity-90 font-medium max-w-2xl leading-relaxed">
 We've allocated <span className="text-white font-bold">$245,000</span> for the March "Dash Pro" bonuses.
 Top drivers (DFS Score &gt; 85) will receive their payouts directly in their withdrawable balance tomorrow at 00:00.
 </p>
 </div>
 <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:translate-x-2 transition-transform group flex items-center gap-2">
 Configure Payout
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
 </div>
 </div>
 );
};
