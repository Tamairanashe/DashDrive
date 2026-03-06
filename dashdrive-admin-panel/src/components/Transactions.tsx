import React, { useState } from 'react';
import {
 Search,
 Filter,
 Download,
 AlertCircle,
 CheckCircle2,
 XCircle,
 Clock,
 ArrowRight,
 MoreVertical,
 ChevronDown,
 User,
 CreditCard,
 Smartphone,
 Banknote,
 ExternalLink,
 ShieldEllipsis,
 RefreshCcw,
 Ban
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

type TransactionStatus = 'All' | 'Successful' | 'Failed' | 'Refunded' | 'Pending' | 'Disputed';

export const Transactions: React.FC = () => {
 const [activeTab, setActiveTab] = useState<TransactionStatus>('All');
 const [showFilters, setShowFilters] = useState(false);

 const stats = [
 { label: 'Total Transacted', value: '$42,805,120', trend: '+12%', icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-50' },
 { label: 'Platform Commission', value: '$3,842,500', trend: '+8%', icon: ShieldEllipsis, color: 'text-primary', bg: 'bg-primary/10' },
 { label: 'Failed Payments', value: '428', trend: '-2%', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
 ];

 const transactions = [
 {
 id: 'TX-15982',
 user: 'Sarah Jenkins',
 userType: 'Customer',
 service: 'Ride Hailing',
 method: 'Wallet',
 amount: '$18.50',
 commission: '$3.70',
 status: 'Successful',
 date: 'Feb 23, 2026, 14:28',
 ref: 'ORD-9012'
 },
 {
 id: 'TX-15981',
 user: 'Robert Paulson',
 userType: 'Driver',
 service: 'Food Delivery',
 method: 'Debit Card',
 amount: '$42.00',
 commission: '$8.40',
 status: 'Failed',
 date: 'Feb 23, 2026, 14:15',
 ref: 'ORD-8945'
 },
 {
 id: 'TX-15980',
 user: 'Michael Chen',
 userType: 'Customer',
 service: 'Mart',
 method: 'PayLater',
 amount: '$156.40',
 commission: '$23.46',
 status: 'Successful',
 date: 'Feb 23, 2026, 13:50',
 ref: 'ORD-8821'
 },
 {
 id: 'TX-15979',
 user: 'Emma Watson',
 userType: 'Customer',
 service: 'Shopping',
 method: 'Wallet',
 amount: '$240.00',
 commission: '$36.00',
 status: 'Refunded',
 date: 'Feb 23, 2026, 12:30',
 ref: 'ORD-8711'
 },
 {
 id: 'TX-15978',
 user: 'David Miller',
 userType: 'Driver',
 service: 'Withdrawal',
 method: 'Bank Transfer',
 amount: '$1,200.00',
 commission: '$5.00',
 status: 'Pending',
 date: 'Feb 23, 2026, 11:20',
 ref: 'WDR-402'
 },
 {
 id: 'TX-15977',
 user: 'John Doe',
 userType: 'Customer',
 service: 'Ride Hailing',
 method: 'Credit Card',
 amount: '$25.00',
 commission: '$5.00',
 status: 'Disputed',
 date: 'Feb 23, 2026, 10:45',
 ref: 'ORD-8604'
 }
 ];

 const getStatusStyle = (status: string) => {
 switch (status) {
 case 'Successful': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 case 'Failed': return 'bg-rose-50 text-rose-600 border-rose-100';
 case 'Refunded': return 'bg-amber-50 text-amber-600 border-amber-100';
 case 'Pending': return 'bg-blue-50 text-blue-600 border-blue-100';
 case 'Disputed': return 'bg-slate-100 text-slate-600 border-slate-200';
 default: return 'bg-slate-50 text-slate-400 border-slate-100';
 }
 };

 const getStatusIcon = (status: string) => {
 switch (status) {
 case 'Successful': return <CheckCircle2 className="w-3.5 h-3.5" />;
 case 'Failed': return <XCircle className="w-3.5 h-3.5" />;
 case 'Refunded': return <RefreshCcw className="w-3.5 h-3.5" />;
 case 'Pending': return <Clock className="w-3.5 h-3.5" />;
 case 'Disputed': return <AlertCircle className="w-3.5 h-3.5" />;
 default: return null;
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Financial Ledger</h2>
 <p className="text-slate-500 text-sm font-medium">Manage and monitor all transactions across the DashDrive ecosystem.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
 <Download className="w-4 h-4" />
 Export CSV
 </button>
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 New Manual Refund
 </button>
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {stats.map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
 <stat.icon className={cn("w-7 h-7", stat.color)} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 ">{stat.label}</p>
 <h4 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h4>
 <p className={cn("text-xs font-bold mt-1", stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500')}>
 {stat.trend} from last period
 </p>
 </div>
 </div>
 ))}
 </div>

 {/* Main Content Area */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 {/* Filters & Tabs */}
 <div className="p-8 border-b border-slate-50 space-y-6">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['All', 'Successful', 'Failed', 'Refunded', 'Pending', 'Disputed'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <div className="flex items-center gap-3">
 <div className="relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by ID, User, or Reference..."
 className="pl-11 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium w-[300px] outline-none focus:ring-2 ring-primary/20 transition-all"
 />
 </div>
 <button
 onClick={() => setShowFilters(!showFilters)}
 className={cn(
 "p-2.5 rounded-xl border transition-all",
 showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
 )}
 >
 <Filter className="w-5 h-5" />
 </button>
 </div>
 </div>

 {showFilters && (
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ">Service Type</label>
 <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
 <option>All Services</option>
 <option>Ride Hailing</option>
 <option>Food Delivery</option>
 <option>Mart &amp; Shopping</option>
 <option>Withdrawals</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ">Payment Method</label>
 <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
 <option>All Methods</option>
 <option>Wallet</option>
 <option>Credit/Debit Card</option>
 <option>PayLater (BNPL)</option>
 <option>Bank Transfer</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ">User Type</label>
 <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
 <option>All Users</option>
 <option>Customers</option>
 <option>Drivers / Providers</option>
 <option>Vendors / Stores</option>
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 ">Date Range</label>
 <button className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 text-left flex items-center justify-between">
 <span>Last 30 Days</span>
 <ChevronDown className="w-4 h-4" />
 </button>
 </div>
 </div>
 )}
 </div>

 {/* Transaction Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Transaction / User</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Service &amp; Reference</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Amount &amp; Method</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Platform Comm.</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 tracking-[0.2em] text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {transactions.map((tx) => (
 <tr key={tx.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <User className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900">{tx.user}</p>
 <div className="flex items-center gap-2">
 <span className="text-xs font-bold text-slate-400">{tx.id}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-[10px] font-black text-primary ">{tx.userType}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-700">{tx.service}</p>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
 <ExternalLink className="w-3 h-3" />
 {tx.ref}
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-black text-slate-900">{tx.amount}</p>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
 {tx.method === 'Wallet' && <Smartphone className="w-3 h-3" />}
 {tx.method === 'PayLater' && <Clock className="w-3 h-3 text-amber-500" />}
 {tx.method === 'Debit Card' && <CreditCard className="w-3 h-3 text-blue-500" />}
 {tx.method === 'Bank Transfer' && <Smartphone className="w-3 h-3" />}
 {tx.method}
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-emerald-600">{tx.commission}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">Automated</p>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ",
 getStatusStyle(tx.status)
 )}>
 {getStatusIcon(tx.status)}
 {tx.status}
 </div>
 <p className="text-[10px] text-slate-400 font-bold mt-1.5">{tx.date}</p>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
 <MoreVertical className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
 <p className="text-xs font-bold text-slate-400">
 Showing <span className="text-slate-900">1 to 6</span> of <span className="text-slate-900">1,284</span> transactions
 </p>
 <div className="flex items-center gap-2">
 <button className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
 <div className="flex items-center gap-1">
 <button className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold">1</button>
 <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 text-xs font-bold">2</button>
 <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 text-xs font-bold">3</button>
 <span className="px-2 text-slate-300">...</span>
 <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 text-xs font-bold">42</button>
 </div>
 <button className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">Next</button>
 </div>
 </div>
 </div>
 </div>
 );
};
