import React, { useState } from 'react';
import {
 AlertCircle,
 Search,
 Filter,
 CheckCircle2,
 XCircle,
 Clock,
 DollarSign,
 FileText,
 User,
 ArrowRight,
 ShieldAlert,
 MoreVertical,
 BarChart3,
 Activity,
 Gem,
 Package,
 Navigation,
 Download
} from 'lucide-react';
import { cn } from '../utils';

interface RefundRequest {
 id: string;
 orderId: string;
 customer: { name: string; email: string; avatar: string };
 amount: string;
 reason: string;
 status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
 timestamp: string;
 proof: boolean;
 fraudScore: number;
}

const mockRefunds: RefundRequest[] = [
 {
 id: 'REF-8001',
 orderId: 'PRC-9042',
 customer: { name: 'Sarah Miller', email: 'sarah.m@gmail.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
 amount: '$142.50',
 reason: 'Significant physical damage to electronics packaging.',
 status: 'In Progress',
 timestamp: '2h ago',
 proof: true,
 fraudScore: 12
 },
 {
 id: 'REF-8002',
 orderId: 'PRC-9102',
 customer: { name: 'James Wilson', email: 'j.wilson@corporate.com', avatar: 'https://i.pravatar.cc/150?u=james' },
 amount: '$45.00',
 reason: 'Delayed delivery beyond 48-hour guarantee window.',
 status: 'Pending',
 timestamp: '4h ago',
 proof: false,
 fraudScore: 5
 },
 {
 id: 'REF-8003',
 orderId: 'PRC-8922',
 customer: { name: 'Elena Rodriguez', email: 'elena.rod@outlook.com', avatar: 'https://i.pravatar.cc/150?u=elena' },
 amount: '$890.00',
 reason: 'Total loss of item during transit (Assigned: DRV-401).',
 status: 'Pending',
 timestamp: '1d ago',
 proof: true,
 fraudScore: 68
 }
];

export const RefundRequests: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Recovery Audit</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage parcel refund claims, failed delivery reimbursements, and network liability audits</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl">
 <ShieldAlert className="w-5 h-5 text-rose-500" />
 <span className="text-[10px] font-black text-rose-600 ">High Fraud Alert: 2 Cases</span>
 </div>
 </div>
 </div>

 {/* Financial recovery stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <RecoveryStat label="Total Claim Volume" value="$42,850" sub="Last 30 days" color="text-slate-900" />
 <RecoveryStat label="Approved Payouts" value="$12,402" sub="Net loss" color="text-rose-500" />
 <RecoveryStat label="Blocked Fraud" value="$28,440" sub="Saved Revenue" color="text-emerald-500" />
 </div>

 {/* Refund Claims Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
 <div className="relative w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search Claims ID, Order ID..."
 className="w-full pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold font-small-caps text-slate-500 hover:text-primary transition-all">
 <Download className="w-4 h-4" /> Export Report
 </button>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Claim Entity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Loss Reason</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Amount</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Risk Level</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockRefunds.map((refund) => (
 <tr key={refund.id} className="hover:bg-slate-50/80 transition-all group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
 <img src={refund.customer.avatar} alt="" className="w-full h-full object-cover" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{refund.id}</p>
 <p className="text-[10px] font-bold text-slate-400 tracking-tighter">Order: {refund.orderId}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5 max-w-[240px]">
 <p className="text-xs font-bold text-slate-700 line-clamp-1">{refund.reason}</p>
 <div className="flex items-center gap-2">
 {refund.proof ? (
 <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
 <CheckCircle2 className="w-3 h-3" /> Proof Verified
 </span>
 ) : (
 <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
 <Clock className="w-3 h-3" /> Awaiting Proof
 </span>
 )}
 <span className="text-[9px] font-bold text-slate-300 ">{refund.timestamp}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 font-display font-black text-slate-900">{refund.amount}</td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
 <div
 className={cn(
 "h-full rounded-full transition-all duration-1000",
 refund.fraudScore > 50 ? "bg-rose-500" :
 refund.fraudScore > 20 ? "bg-amber-500" : "bg-emerald-500"
 )}
 style={{ width: `${refund.fraudScore}%` }}
 />
 </div>
 <span className={cn(
 "text-[10px] font-black",
 refund.fraudScore > 50 ? "text-rose-500" :
 refund.fraudScore > 20 ? "text-amber-500" : "text-emerald-500"
 )}>{refund.fraudScore}%</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border",
 refund.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
 refund.status === 'Rejected' ? "bg-rose-50 text-rose-600 border-rose-100/50" :
 refund.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100/50" :
 "bg-amber-50 text-amber-600 border-amber-100/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 refund.status === 'Approved' ? "bg-emerald-500" :
 refund.status === 'Rejected' ? "bg-rose-500" :
 refund.status === 'In Progress' ? "bg-blue-500" : "bg-amber-500"
 )} />
 {refund.status}
 </span>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
 <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10">
 Audit
 </button>
 <button className="p-2.5 bg-white text-slate-400 rounded-xl hover:text-primary transition-all border border-slate-100 shadow-sm">
 <MoreVertical className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

const RecoveryStat: React.FC<{ label: string, value: string, sub: string, color: string }> = ({ label, value, sub, color }) => (
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50 relative overflow-hidden group">
 <div className="relative z-10">
 <p className="text-[10px] font-bold text-slate-400 mb-1">{label}</p>
 <h3 className={cn("text-3xl font-display font-black tracking-tight", color)}>{value}</h3>
 <p className="text-[11px] font-bold text-slate-300 mt-2">{sub}</p>
 </div>
 <BarChart3 className="absolute bottom-0 right-0 w-24 h-24 text-slate-50 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-500 -z-0" />
 </div>
);
