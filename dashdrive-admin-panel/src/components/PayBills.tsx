import React from 'react';
import {
 Zap,
 Droplets,
 Wifi,
 Tv,
 Smartphone,
 Search,
 MoreVertical,
 CheckCircle2,
 AlertCircle,
 Clock,
 ExternalLink,
 ChevronRight,
 Plus,
 RefreshCcw,
 ShieldCheck
} from 'lucide-react';
import { cn } from '../utils';

export const PayBills: React.FC = () => {
 const bills = [
 { id: 'BILL-4021', customer: 'Sarah Jenkins', type: 'Electricity', amount: '$75.40', status: 'Success', provider: 'National Grid', date: 'Feb 23, 11:20' },
 { id: 'BILL-4022', customer: 'Michael Chen', type: 'Internet', amount: '$60.00', status: 'Success', provider: 'Starlink', date: 'Feb 23, 10:45' },
 { id: 'BILL-4023', customer: 'Emma Watson', type: 'Water', amount: '$25.10', status: 'Failed', provider: 'City Water Corp', date: 'Feb 23, 09:30', reason: 'Api Timeout' },
 { id: 'BILL-4024', customer: 'James Robert', type: 'Mobile Airtime', amount: '$10.00', status: 'Success', provider: 'AirTel', date: 'Feb 23, 08:15' },
 ];

 const getBillIcon = (type: string) => {
 switch (type) {
 case 'Electricity': return <Zap className="w-5 h-5 text-amber-500" />;
 case 'Water': return <Droplets className="w-5 h-5 text-blue-500" />;
 case 'Internet': return <Wifi className="w-5 h-5 text-primary" />;
 case 'TV': return <Tv className="w-5 h-5 text-rose-500" />;
 case 'Mobile Airtime': return <Smartphone className="w-5 h-5 text-emerald-500" />;
 default: return null;
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Bill Payments Management</h2>
 <p className="text-slate-500 text-sm font-medium">Monitor utility payments, API integrations with providers, and success rates.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <RefreshCcw className="w-4 h-4" />
 Reconcile Provider Logs
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4" />
 Add Bill Provider
 </button>
 </div>
 </div>

 {/* Bill Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Total Volume (Today)', value: '$124,500', trend: '+5.2%', color: 'text-primary' },
 { label: 'Success Rate', value: '98.8%', trend: '+0.2%', color: 'text-emerald-500' },
 { label: 'Avg. Bill Amount', value: '$42.10', trend: '-1.4%', color: 'text-blue-500' },
 { label: 'Failed Payments', value: '142', trend: '+12', color: 'text-rose-500' },
 ].map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 mb-2">{stat.label}</p>
 <div className="flex items-end gap-3">
 <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
 <span className={cn("text-[10px] font-black pb-1 ", stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500')}>{stat.trend}</span>
 </div>
 </div>
 ))}
 </div>

 {/* Main Table Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Bill Transactions</h3>
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by customer or bill ID..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Bill ID / Customer</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Service Provider</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Amount</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {bills.map((bill) => (
 <tr key={bill.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
 {getBillIcon(bill.type)}
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{bill.customer}</p>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold text-slate-400 ">{bill.id}</span>
 <span className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-bold text-slate-400 italic">{bill.date}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-700">{bill.provider}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">{bill.type}</p>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {bill.amount}
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 bill.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {bill.status === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
 {bill.status}
 </div>
 {bill.reason && <p className="text-[10px] text-rose-400 font-bold mt-1.5 italic">Error: {bill.reason}</p>}
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Transaction">
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
 <ShieldCheck className="w-10 h-10 text-primary" />
 </div>
 <div className="flex-1 space-y-2">
 <h3 className="text-xl font-black tracking-tight">Bill Provider Reconciller</h3>
 <p className="text-sm opacity-60 font-medium max-w-2xl leading-relaxed">
 Our automated system cross-references vendor API logs every 6 hours.
 Currently, <span className="text-white font-bold">14 providers</span> are in sync.
 Last reconciliation was completed 42 minutes ago with 0 mismatches found.
 </p>
 </div>
 <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl hover:translate-x-2 transition-transform group flex items-center gap-2">
 View Provider Health
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 </div>
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
 </div>
 </div>
 );
};
