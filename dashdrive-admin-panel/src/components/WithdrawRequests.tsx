import React, { useState } from 'react';
import {
 Clock,
 CheckCircle2,
 XCircle,
 AlertTriangle,
 ArrowDownRight,
 Search,
 MoreVertical,
 Banknote,
 Smartphone,
 Building,
 Filter,
 Eye,
 Check,
 X,
 CreditCard,
 History,
 ShieldCheck
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

type PayoutStatus = 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Processed';

export const WithdrawRequests: React.FC = () => {
 const [activeTab, setActiveTab] = useState<PayoutStatus>('Pending');

 const requests = [
 { id: 'WDR-904', driver: 'David Miller', amount: '$450.20', method: 'Bank Transfer', destination: 'Chase ****8921', date: 'Feb 23, 10:45', status: 'Pending', risk: 'Low' },
 { id: 'WDR-903', driver: 'Sarah Jenkins', amount: '$120.00', method: 'Mobile Money', destination: '+1 234 *** 890', date: 'Feb 23, 09:30', status: 'Pending', risk: 'Medium' },
 { id: 'WDR-902', driver: 'Alex Thompson', amount: '$1,400.00', method: 'Bank Transfer', destination: 'Wells Fargo ****1102', date: 'Feb 22, 18:20', status: 'Approved', risk: 'Low' },
 { id: 'WDR-901', driver: 'Jessica Chen', amount: '$85.00', method: 'Wallet Refund', destination: 'Internal Wallet', date: 'Feb 22, 14:15', status: 'Rejected', risk: 'High', reason: 'Suspicious Activity' },
 { id: 'WDR-900', driver: 'Michael Smith', amount: '$340.50', method: 'Bank Transfer', destination: 'Citi ****5523', date: 'Feb 21, 12:00', status: 'Processed', risk: 'Low' },
 ];

 const getStatusStyle = (status: string) => {
 switch (status) {
 case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
 case 'Approved': return 'bg-blue-50 text-blue-600 border-blue-100';
 case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
 case 'Processed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 default: return 'bg-slate-50 text-slate-400 border-slate-100';
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Withdrawal Requests</h2>
 <p className="text-slate-500 text-sm font-medium">Review and process payout requests from drivers and partners.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-rose-500" />
 <span className="text-xs font-bold text-rose-600 ">3 High Risk Flagged</span>
 </div>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 Batch Process All
 </button>
 </div>
 </div>

 {/* Main Table Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 {/* Navigation & Search */}
 <div className="p-8 border-b border-slate-50 space-y-6">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Pending', 'Approved', 'Rejected', 'Processed', 'All'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by ID or driver name..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[250px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
 <Filter className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>

 {/* Requests Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Request / Driver</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Amount</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Method &amp; Destination</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Risk Level</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {requests.map((req) => (
 <tr key={req.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <History className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{req.driver}</p>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold text-slate-400 ">{req.id}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-[10px] font-bold text-slate-400">{req.date}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-black text-slate-900">{req.amount}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">Automated Check: Pass</p>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
 {req.method === 'Bank Transfer' && <Building className="w-3.5 h-3.5" />}
 {req.method === 'Mobile Money' && <Smartphone className="w-3.5 h-3.5 text-primary" />}
 {req.method === 'Wallet Refund' && <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
 {req.method}
 </div>
 <p className="text-[10px] font-bold text-slate-400 mt-1">{req.destination}</p>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "flex items-center gap-1 text-[10px] font-black ",
 req.risk === 'Low' ? 'text-emerald-500' : req.risk === 'Medium' ? 'text-amber-500' : 'text-rose-500'
 )}>
 {req.risk === 'Low' ? <CheckCircle2 className="w-3.5 h-3.5" /> : req.risk === 'Medium' ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
 {req.risk} Risk
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 getStatusStyle(req.status)
 )}>
 {req.status === 'Pending' && <Clock className="w-3 h-3" />}
 {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
 {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
 {req.status === 'Processed' && <Banknote className="w-3 h-3" />}
 {req.status}
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 {req.status === 'Pending' ? (
 <>
 <button className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all shadow-sm" title="Approve">
 <Check className="w-4 h-4" />
 </button>
 <button className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all shadow-sm" title="Reject">
 <X className="w-4 h-4" />
 </button>
 </>
 ) : (
 <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
 <Eye className="w-5 h-5" />
 </button>
 )}
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

 {/* Manual Ad-hoc Card */}
 <div className="bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
 <Smartphone className="w-8 h-8 text-primary" />
 </div>
 <div>
 <h4 className="text-lg font-black text-slate-900 tracking-tight">Need to issue an ad-hoc payout?</h4>
 <p className="text-sm text-slate-500 font-medium leading-relaxed">You can manually process a payout to any driver by their phone number or direct bank reference.</p>
 </div>
 </div>
 <button className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap">
 Launch Manual Payout Tool
 </button>
 </div>
 </div>
 );
};
