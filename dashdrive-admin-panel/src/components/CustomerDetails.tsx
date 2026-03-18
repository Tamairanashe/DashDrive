import React, { useState } from 'react';
import {
  User, Phone, Mail, CheckCircle2, XCircle,
  TrendingUp, Star, Download, FileText,
  Search, Filter, ChevronRight, ArrowLeft,
  CreditCard, History, ShieldCheck, AlertCircle,
  Eye, MoreVertical, Zap, Car, Utensils,
  ShoppingBag, Box, MessageSquare, ShieldAlert,
  Wallet, Award, Clock, Edit, Activity, Plus,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface CustomerDetailsProps {
 customerId: string;
 onBack: () => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customerId, onBack }) => {
 const [activeTab, setActiveTab] = useState('Overview');
 const [historyCategory, setHistoryCategory] = useState<'All' | 'Ride' | 'Food' | 'Mart' | 'Shopping' | 'Parcel'>('All');

 const customer = {
 id: customerId,
 name: 'Sarah Jenkins',
 phone: '+1 555-****-901',
 email: 's****@gmail.com',
 avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
 isDashPlus: true,
 loyaltyLevel: 'Power Customer',
 dfsScore: 842,
 kycStatus: 'Verified',
 stats: {
 digitalPayment: 92.5,
 successRate: 98.2,
 reviewGiven: 4.8,
 cancellationRate: 2.1,
 completedTrips: 154,
 cancelTrips: 3,
 totalSpend: 12450.00,
 walletBalance: 450.25
 },
 documents: [
 { name: 'Identity_Verification.jpg', type: 'JPG', size: '1.2 MB' },
 { name: 'Address_Proof.png', type: 'PNG', size: '2.4 MB' }
 ]
 };

 const serviceHistory = [
 { id: 'ORD-9021', date: 'Feb 23, 14:30', service: 'Food', provider: 'Burger King', amount: 25.00, status: 'Delivered', icon: Utensils },
 { id: 'TRP-8821', date: 'Feb 23, 11:20', service: 'Ride', provider: 'Alex Rivera', amount: 18.50, status: 'Completed', icon: Car },
 { id: 'ORD-7742', date: 'Feb 22, 18:45', service: 'Mart', provider: 'Whole Foods', amount: 112.00, status: 'Completed', icon: ShoppingBag },
 { id: 'PKG-1102', date: 'Feb 22, 10:15', service: 'Parcel', provider: 'Express Delivery', amount: 15.00, status: 'In Transit', icon: Box },
 { id: 'ORD-4401', date: 'Feb 21, 16:30', service: 'Shopping', provider: 'Apple Store', amount: 1200.00, status: 'Processing', icon: ShoppingBag },
 ];

 const complaints = [
 { id: 'TKT-441', subject: 'Late Delivery', category: 'Food', date: 'Feb 20', status: 'Resolved' },
 { id: 'TKT-229', subject: 'Wrong Item', category: 'Mart', date: 'Feb 15', status: 'Refunded' },
 ];

 return (
 <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-700">
 {/* Header with Dashboard Context */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex items-center gap-5">
 <button
 onClick={onBack}
 className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm text-slate-500 hover:text-slate-900 transition-all group"
 >
 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
 </button>
 <div>
 <div className="flex items-center gap-3 mb-1">
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Customer Intelligence</h2>
 {customer.isDashPlus && (
 <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black shadow-lg shadow-rose-500/20">
 <Zap className="w-3 h-3 fill-current" />
 DashPlus MEMBER
 </div>
 )}
 </div>
 <p className="text-slate-500 text-sm font-medium italic truncate max-w-md">Comprehensive 360&deg; audit of {customer.name}&apos;s activity.</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
 <ShieldAlert className="w-4 h-4" />
 Risk Analysis
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
 <Edit className="w-4 h-4 text-primary" />
 Manage Profile
 </button>
 </div>
 </div>

 {/* Primary Identity Section */}
 <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
 {/* Profile Card */}
 <div className="xl:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-full h-24 bg-slate-50 group-hover:bg-primary/5 transition-colors" />
 <div className="relative mt-4 mb-6">
 <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-10">
 <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
 </div>
 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white z-20 shadow-lg">
 <ShieldCheck className="w-5 h-5" />
 </div>
 </div>
 <div className="z-10">
 <h3 className="text-xl font-black text-slate-900">{customer.name}</h3>
 <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mt-1">ID: {customer.id}</p>

 <div className="flex flex-col gap-2 mt-6">
 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
 <Phone className="w-3.5 h-3.5 text-slate-400" />
 {customer.phone}
 </div>
 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
 <Mail className="w-3.5 h-3.5 text-slate-400" />
 {customer.email}
 </div>
 </div>
 </div>
 </div>

 {/* DFS & Financial Score Visualizer */}
 <div className="xl:col-span-2 bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <div className="relative z-10 flex flex-col h-full">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h4 className="text-lg font-black tracking-tight italic flex items-center gap-2">
 <Award className="w-5 h-5 text-primary" />
 Dash Financial Score (DFS)
 </h4>
 <p className="text-white/50 text-[10px] font-bold mt-1">AI Behavior Rating</p>
 </div>
 <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black ">
 Top 2% Globally
 </div>
 </div>

 <div className="flex-1 flex items-center justify-around gap-12">
 <div className="relative w-40 h-40 flex items-center justify-center">
 <svg className="w-full h-full -rotate-90">
 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * (customer.dfsScore / 1000))} className="text-primary transition-all duration-1000 ease-out" strokeLinecap="round" />
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span className="text-4xl font-black tracking-tight">{customer.dfsScore}</span>
 <span className="text-[10px] font-bold text-white/40 ">Out of 1000</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-x-12 gap-y-6">
 {[
 { label: 'Reliability', value: 'Excellent' },
 { label: 'Refund Ratio', value: '< 0.1%' },
 { label: 'Avg Spend', value: `$${customer.stats.totalSpend / 12}/mo` },
 { label: 'Tier Status', value: customer.loyaltyLevel },
 ].map(idx => (
 <div key={idx.label}>
 <p className="text-[10px] font-bold text-white/30 ">{idx.label}</p>
 <p className="text-sm font-black mt-1">{idx.value}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Global Stats Matrix */}
 <div className="xl:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
 <div className="space-y-6">
 {[
 { label: 'Wallet Balance', value: `$${customer.stats.walletBalance}`, icon: Wallet, color: 'text-primary' },
 { label: 'Success Rate', value: `${customer.stats.successRate}%`, icon: TrendingUp, color: 'text-emerald-500' },
 { label: 'Cancellation', value: `${customer.stats.cancellationRate}%`, icon: XCircle, color: 'text-rose-500' },
 ].map(stat => (
 <div key={stat.label} className="flex items-center justify-between group">
 <div className="flex items-center gap-3">
 <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-all group-hover:scale-110", stat.color)}>
 <stat.icon className="w-5 h-5" />
 </div>
 <span className="text-[10px] font-bold text-slate-400 ">{stat.label}</span>
 </div>
 <span className="text-sm font-black text-slate-900">{stat.value}</span>
 </div>
 ))}
 </div>

 <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-100 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all">
 Withdrawal History
 </button>
 </div>
 </div>

 {/* Tabs Navigation */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Overview', 'History', 'Support', 'Review'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 {/* Dynamic Content Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[400px]">
 {activeTab === 'Overview' && (
 <div className="p-10 animate-in fade-in duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
 <div className="space-y-8">
 <div>
 <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
 <Activity className="w-5 h-5 text-primary" />
 Usage Penetration
 </h4>
 <p className="text-slate-400 text-xs font-bold mt-1">Multi-Service Utilization Score</p>
 </div>

 <div className="space-y-6">
 {[
 { service: 'Ride Hailing', usage: 85, color: 'bg-primary' },
 { service: 'Food Delivery', usage: 60, color: 'bg-emerald-500' },
 { service: 'Mart Shopping', usage: 45, color: 'bg-amber-500' },
 { service: 'Parcel Post', usage: 15, color: 'bg-blue-500' },
 ].map(svc => (
 <div key={svc.service} className="space-y-2">
 <div className="flex justify-between items-center px-1">
 <span className="text-[10px] font-black text-slate-900 ">{svc.service}</span>
 <span className="text-[10px] font-black text-slate-400 italic">{svc.usage}%</span>
 </div>
 <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
 <div className={cn("h-full rounded-full transition-all duration-1000", svc.color)} style={{ width: `${svc.usage}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 flex flex-col justify-between">
 <div className="flex items-start justify-between mb-8">
 <div>
 <h4 className="text-sm font-black text-slate-900 ">Attached KYC Documents</h4>
 <p className="text-slate-400 text-[10px] font-bold mt-1">Legally verified documents</p>
 </div>
 <button className="text-primary hover:text-primary-dark transition-colors">
 <Plus className="w-5 h-5" />
 </button>
 </div>

 <div className="space-y-4">
 {customer.documents.map(doc => (
 <div key={doc.name} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:shadow-lg hover:shadow-slate-200/50 transition-all">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs font-black text-slate-900">{doc.name}</p>
 <p className="text-[10px] font-bold text-slate-400 ">{doc.size} &bull; {doc.type}</p>
 </div>
 </div>
 <button className="p-2 text-slate-400 hover:text-slate-900">
 <Download className="w-4 h-4" />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {activeTab === 'History' && (
 <div className="animate-in fade-in duration-500">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto scrollbar-hide p-1">
 {['All', 'Ride', 'Food', 'Mart', 'Shopping', 'Parcel'].map((cat) => (
 <button
 key={cat}
 onClick={() => setHistoryCategory(cat as any)}
 className={cn(
 "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
 historyCategory === cat ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
 )}
 >
 {cat}
 </button>
 ))}
 </div>
 <div className="relative group w-full md:w-64">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" placeholder="Filter orders..." className="w-full pl-11 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none border border-transparent focus:border-primary/20 transition-all" />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Service / ID</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Provider</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Date</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Amount</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em] text-right">Details</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {serviceHistory.map((history) => (
 <tr key={history.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-all">
 <history.icon className="w-4 h-4" />
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 ">{history.service}</p>
 <p className="text-sm font-black text-slate-900">{history.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-sm font-bold text-slate-700">{history.provider}</td>
 <td className="px-8 py-6 text-[10px] font-black text-slate-400 ">{history.date}</td>
 <td className="px-8 py-6 text-sm font-black text-slate-900">${history.amount.toFixed(2)}</td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border",
 history.status === 'Completed' || history.status === 'Delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
 history.status === 'Cancelled' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"
 )}>
 {history.status}
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
 <ChevronRight className="w-5 h-5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeTab === 'Support' && (
 <div className="p-10 animate-in fade-in duration-500">
 <div className="max-w-4xl mx-auto space-y-10">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-primary shadow-xl">
 <MessageSquare className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Support &amp; Resolution Hub</h3>
 <p className="text-slate-400 text-sm font-medium">Logged complaints and resolution tracking for 30 days.</p>
 </div>
 </div>
 <button className="btn-primary-2026 px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs shadow-xl">
 New Internal Ticket
 </button>
 </div>

 <div className="space-y-4">
 {complaints.map(tkt => (
 <div key={tkt.id} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
 <ShieldAlert className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="text-[10px] font-black text-slate-900 bg-slate-200/50 px-2 py-0.5 rounded-md ">{tkt.category}</span>
 <span className="text-[10px] font-bold text-slate-400 ">{tkt.date}</span>
 </div>
 <h4 className="text-sm font-black text-slate-900">{tkt.subject}</h4>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">Reference: {tkt.id}</p>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className={cn(
 "px-4 py-2 rounded-xl text-[10px] font-black border shadow-sm",
 tkt.status === 'Resolved' ? "bg-emerald-500 text-white border-emerald-400" : "bg-amber-500 text-white border-amber-400"
 )}>
 {tkt.status}
 </div>
 <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
 <ChevronRight className="w-6 h-6" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'Review' && (
 <div className="p-10 animate-in fade-in duration-500 flex flex-col items-center justify-center text-center py-24 space-y-6">
 <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
 <Star className="w-12 h-12 fill-current" />
 </div>
 <div>
 <h4 className="text-xl font-black text-slate-900">Rating &amp; Review Metrics</h4>
 <p className="text-slate-400 text-sm font-medium mt-1 italic">Aggregating reviews from drivers and merchants...</p>
 </div>
 </div>
 )}
 </div>

 {/* Featured Insight Overlay */}
 <div className="bg-emerald-500 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/30 flex flex-col lg:flex-row items-center gap-10">
 <div className="lg:w-2/3 space-y-4 relative z-10 text-center lg:text-left">
 <h3 className="text-2xl font-black tracking-tight italic flex items-center justify-center lg:justify-start gap-2">
 <TrendingUp className="w-8 h-8" />
 High Retention Analysis
 </h3>
 <p className="text-lg opacity-90 font-medium leading-relaxed max-w-2xl">
 This customer exhibits atypical loyalty metrics. Their DFS score suggests
 eligibility for the <strong>DashDrive Preferred Loan Program</strong> and advanced
 repayment terms for PayLater (BNPL) services.
 </p>
 </div>
 <div className="lg:w-1/3 flex justify-end">
 <div className="p-6 bg-white/10 rounded-[32px] border border-white/20 backdrop-blur-xl flex flex-col items-center gap-2">
 <p className="text-[10px] font-black tracking-[0.2em] text-white/50">Customer LTV</p>
 <h4 className="text-3xl font-black italic">$42.8k</h4>
 <div className="flex items-center gap-1 text-[10px] font-black text-emerald-200">
 <ArrowUpRight className="w-3 h-3" />
 +12% TREND
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
