import React, { useState } from 'react';
import {
 Heart,
 Globe,
 Users,
 TrendingUp,
 Search,
 MoreVertical,
 Plus,
 Target,
 ArrowRight,
 ExternalLink,
 ShieldCheck,
 Building2,
 Calendar,
 ChevronRight,
 UserPlus,
 FileCheck,
 AlertCircle,
 HandHeart,
 UserCheck,
 Smartphone,
 CreditCard,
 Send,
 History,
 Info,
 ArrowUpRight,
 Filter,
 CheckCircle2,
 XCircle,
 Clock,
 User
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

type DonationTab = 'Donation Ledger' | 'Ad-hoc Initiation' | 'Analytics';

export const Donations: React.FC = () => {
 const [activeTab, setActiveTab] = useState<DonationTab>('Donation Ledger');
 const [recipientType, setRecipientType] = useState<'Account' | 'Phone'>('Phone');

 const donationTransactions = [
 { id: 'DON-4001', donor: 'Alex Rivera', recipient: 'Local Hunger Relief', amount: '$50.00', date: 'Feb 23, 16:45', status: 'Completed', method: 'Dash Wallet' },
 { id: 'DON-4002', donor: 'Sarah Jenkins', recipient: 'Medical Relief: Robert B.', amount: '$150.00', date: 'Feb 23, 14:20', status: 'Processing', method: 'Direct Debit' },
 { id: 'DON-4003', donor: 'James Wilson', recipient: 'Clean Water Init.', amount: '$25.00', date: 'Feb 23, 12:10', status: 'Completed', method: 'Dash Wallet' },
 { id: 'DON-4004', donor: 'Michael Brown', recipient: 'Driver Wellness', amount: '$500.00', date: 'Feb 22, 18:30', status: 'Flagged', method: 'Credit Card' },
 { id: 'DON-4005', donor: 'Emily Davis', recipient: 'Community Fund', amount: '$10.00', date: 'Feb 22, 10:15', status: 'Completed', method: 'Dash Wallet' },
 ];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Donations Management Ledger</h2>
 <p className="text-slate-500 text-sm font-medium italic">Monitor and audit individual wallet-based contributions across the ecosystem.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4 text-primary" />
 New Initiation
 </button>
 </div>
 </div>

 {/* High-Level Stats */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Total Volume (MTD)', value: '$148,200', icon: TrendingUp, color: 'text-emerald-500' },
 { label: 'Avg. Donation Size', value: '$34.50', icon: HandHeart, color: 'text-rose-500' },
 { label: 'Active Contributors', value: '42,400', icon: Users, color: 'text-primary' },
 { label: 'Flagged Transactions', value: '12', icon: AlertCircle, color: 'text-amber-500' },
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

 {/* Navigation Tabs */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Donation Ledger', 'Ad-hoc Initiation', 'Analytics'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 {/* Main Management Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[500px]">
 {activeTab === 'Donation Ledger' && (
 <div className="animate-in fade-in duration-500">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="flex items-center gap-3">
 <History className="w-5 h-5 text-primary" />
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Transaction History</h3>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by donor or recipient..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all font-display"
 />
 </div>
 <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
 <Filter className="w-5 h-5" />
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Donation ID / Date</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Donor &rarr; Recipient</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Amount</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Method</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {donationTransactions.map((tx) => (
 <tr key={tx.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <p className="text-sm font-black text-slate-900">{tx.id}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{tx.date}</p>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-0.5">
 <div className="flex items-center gap-2">
 <User className="w-3 h-3 text-slate-400" />
 <span className="text-sm font-bold text-slate-700">{tx.donor}</span>
 </div>
 <div className="flex items-center gap-2">
 <ArrowUpRight className="w-3 h-3 text-emerald-500" />
 <span className="text-[10px] font-black text-slate-400 ">Recipient</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">
 {tx.amount}
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 w-fit">
 <CreditCard className="w-3 h-3" />
 {tx.method}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
 tx.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
 )}>
 {tx.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : (tx.status === 'Processing' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />)}
 {tx.status}
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
 <MoreVertical className="w-5 h-5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeTab === 'Ad-hoc Initiation' && (
 <div className="p-10 flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500">
 <div className="lg:w-1/2 space-y-8">
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Process Disbursement</h3>
 <p className="text-slate-500 text-sm font-medium mt-1 italic">Initiate a donation transfer from system or individual funds.</p>
 </div>

 <div className="space-y-6">
 <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl w-fit">
 <button
 onClick={() => setRecipientType('Phone')}
 className={cn(
 "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all",
 recipientType === 'Phone' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
 )}
 >
 <Smartphone className="w-4 h-4" />
 Phone Number
 </button>
 <button
 onClick={() => setRecipientType('Account')}
 className={cn(
 "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all",
 recipientType === 'Account' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
 )}
 >
 <CreditCard className="w-4 h-4" />
 Account Number
 </button>
 </div>

 <div className="space-y-4">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-1">Recipient {recipientType}</label>
 <input
 type="text"
 placeholder={recipientType === 'Phone' ? "+1 (555) 000-0000" : "Enter Account Number..."}
 className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:border-primary/20 focus:bg-white transition-all font-display text-lg font-bold"
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-1">Amount ($)</label>
 <input
 type="number"
 placeholder="0.00"
 className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:border-primary/20 focus:bg-white transition-all font-display text-lg font-bold"
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] ml-1">Allocation Code</label>
 <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] outline-none focus:border-primary/20 focus:bg-white transition-all font-display text-sm font-bold appearance-none">
 <option>Emergency Fund (EF-202)</option>
 <option>CSR Budget (CSR-11)</option>
 <option>System Disbursement</option>
 </select>
 </div>
 </div>
 </div>

 <button className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
 <Send className="w-5 h-5 text-primary" />
 Process Disbursement now
 </button>
 </div>
 </div>

 <div className="lg:w-1/2 bg-slate-50/50 rounded-[40px] p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
 <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary shadow-lg mb-6">
 <History className="w-10 h-10" />
 </div>
 <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">Audit & Reconciliation</h4>
 <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
 Donations are treated as restricted wallet transfers. All manual actions require system-wide reconciliation and admin ID logging.
 </p>
 </div>
 </div>
 )}

 {activeTab === 'Analytics' && (
 <div className="p-8 text-center py-20 animate-in fade-in duration-500">
 <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-4" />
 <p className="text-slate-400 font-bold text-xs font-display">Donation Analytics Module Loading...</p>
 </div>
 )}
 </div>

 {/* Featured Insight Card */}
 <div className="bg-rose-500 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-rose-500/30 flex flex-col lg:flex-row items-center gap-10">
 <div className="lg:w-2/3 space-y-4 relative z-10 text-center lg:text-left">
 <h3 className="text-2xl font-black tracking-tight italic">Direct Wallet Philanthropy</h3>
 <p className="text-lg opacity-90 font-medium leading-relaxed max-w-2xl">
 Users are directly empowering each other.
 Donation monitoring allows admins to verify that community funds reach their intended destinations safely.
 </p>
 </div>
 <div className="lg:w-1/3 flex justify-end">
 <HandHeart className="w-32 h-32 text-white/20 fill-white/10 animate-pulse" />
 </div>
 </div>
 </div>
 );
};
