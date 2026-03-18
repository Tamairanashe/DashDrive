import React, { useState } from 'react';
import {
 DollarSign,
 TrendingUp,
 ArrowUpRight,
 ArrowDownRight,
 Download,
 Filter,
 Calendar,
 PieChart,
 BarChart3,
 CreditCard,
 Wallet,
 ArrowRight,
 ChevronRight,
 Search,
 MoreVertical,
 Activity,
 Percent,
 Layers,
 FileText
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const FinanceReports: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Overview');
 const [timeRange, setTimeRange] = useState('All time');

 const stats = [
 { label: 'Total Revenue', value: '$1,294,560.00', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
 { label: 'Total Commission', value: '$155,347.20', trend: '+10.2%', isUp: true, icon: Percent, color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
 { label: 'Driver Payouts', value: '$1,139,212.80', trend: '+13.1%', isUp: true, icon: Wallet, color: 'text-indigo-500', bg: 'bg-indigo-50' },
 { label: 'Pending Payouts', value: '$45,200.00', trend: '-2.4%', isUp: false, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' }
 ];

 const transactions = [
 { id: 'TX-9012', entity: 'Fast Food Express', type: 'Merchant Payout', amount: '$1,240.00', status: 'Completed', date: 'Oct 24, 2023' },
 { id: 'TX-9013', entity: 'John Doe (Driver)', type: 'Driver Earnings', amount: '$450.20', status: 'Processing', date: 'Oct 24, 2023' },
 { id: 'TX-9014', entity: 'Grocery Mart', type: 'Commission Fee', amount: '$120.00', status: 'Completed', date: 'Oct 23, 2023' },
 { id: 'TX-9015', entity: 'Sarah Smith (Driver)', type: 'Driver Earnings', amount: '$890.00', status: 'Failed', date: 'Oct 23, 2023' },
 ];

 const renderOverview = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {stats.map((stat, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center justify-between mb-6">
 <div className={cn("p-4 rounded-2xl transition-colors duration-500", stat.bg)}>
 <stat.icon className={cn("w-6 h-6", stat.color)} />
 </div>
 <div className={cn(
 "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black ",
 stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
 )}>
 {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
 {stat.trend}
 </div>
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 mb-1">{stat.label}</p>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-12 gap-8">
 {/* Main Chart Placeholder */}
 <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-xl font-black text-slate-900 leading-none">Earnings Performance</h3>
 <p className="text-xs font-medium text-slate-400 mt-3">Revenue vs Payouts over time</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
 <div className="w-2 h-2 rounded-full bg-[#0089D1]" />
 <span className="text-[10px] font-bold text-slate-600 ">Revenue</span>
 </div>
 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
 <div className="w-2 h-2 rounded-full bg-indigo-400" />
 <span className="text-[10px] font-bold text-slate-600 ">Payouts</span>
 </div>
 </div>
 </div>

 <div className="h-[400px] flex items-end justify-between gap-4 px-4">
 {[65, 45, 75, 55, 90, 70, 85, 60, 95, 80, 75, 85].map((val, i) => (
 <div key={i} className="flex-1 space-y-3 group cursor-pointer">
 <div className="relative h-full flex items-end justify-center gap-1">
 <div
 className="w-full bg-[#0089D1]/10 group-hover:bg-[#0089D1]/20 rounded-t-lg transition-all duration-500"
 style={{ height: `${val}%` }}
 />
 <div
 className="w-full bg-indigo-500/10 group-hover:bg-indigo-500/20 rounded-t-lg transition-all duration-500"
 style={{ height: `${val * 0.8}%` }}
 />
 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
 ${(val * 1200).toLocaleString()}
 </div>
 </div>
 <p className="text-[10px] font-bold text-slate-300 text-center tracking-tighter">
 {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
 </p>
 </div>
 ))}
 </div>
 </div>

 {/* Breakdown Card */}
 <div className="col-span-12 lg:col-span-4 space-y-8">
 <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
 <h3 className="text-xl font-black mb-10 relative z-10">Revenue Source</h3>
 <div className="space-y-6 relative z-10">
 {[
 { label: 'Ride Hailing', value: 65, color: 'bg-[#0089D1]' },
 { label: 'Food Delivery', value: 20, color: 'bg-emerald-400' },
 { label: 'Mart Delivery', value: 10, color: 'bg-indigo-400' },
 { label: 'Parcel & Other', value: 5, color: 'bg-slate-400' }
 ].map((item, i) => (
 <div key={i} className="space-y-2">
 <div className="flex items-center justify-between text-[11px] font-bold">
 <span className="opacity-60">{item.label}</span>
 <span>{item.value}%</span>
 </div>
 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
 <div
 className={cn("h-full rounded-full transition-all duration-1000", item.color)}
 style={{ width: `${item.value}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 <button className="w-full mt-10 py-5 bg-white/10 hover:bg-white/20 rounded-[24px] text-xs font-black transition-all border border-white/10">
 Generate Report
 </button>
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
 <h3 className="text-sm font-black text-slate-900 tracking-[0.2em] mb-8">Quick Limits</h3>
 <div className="space-y-4">
 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl">
 <CreditCard className="w-4 h-4 text-slate-400" />
 </div>
 <span className="text-[11px] font-bold text-slate-600">Daily Payout Cap</span>
 </div>
 <span className="text-xs font-black text-slate-900">$50,000</span>
 </div>
 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl">
 <Activity className="w-4 h-4 text-slate-400" />
 </div>
 <span className="text-[11px] font-bold text-slate-600">Auto-Approval Min</span>
 </div>
 <span className="text-xs font-black text-slate-900">$1,000</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Recent Transactions Table */}
 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
 <div>
 <h3 className="text-xl font-black text-slate-900">Recent Financial Activity</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Latest payouts and service charges across the platform</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search transaction..."
 className="w-64 pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0089D1]/20 outline-none transition-all placeholder:text-slate-300"
 />
 </div>
 <button className="p-3.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-100 transition-all">
 <Filter className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Transaction ID</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Entity</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Type</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Amount</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Status</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4 text-right">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {transactions.map((tx, i) => (
 <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
 <td className="py-6 px-4">
 <span className="text-xs font-black text-slate-900">{tx.id}</span>
 </td>
 <td className="py-6 px-4">
 <span className="text-xs font-bold text-slate-700">{tx.entity}</span>
 </td>
 <td className="py-6 px-4">
 <span className="text-[10px] font-bold text-slate-400 ">{tx.type}</span>
 </td>
 <td className="py-6 px-4">
 <span className="text-sm font-black text-slate-900">{tx.amount}</span>
 </td>
 <td className="py-6 px-4">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ",
 tx.status === 'Completed' ? "bg-emerald-50 text-emerald-600" :
 tx.status === 'Processing' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 tx.status === 'Completed' ? "bg-emerald-500" :
 tx.status === 'Processing' ? "bg-amber-500" : "bg-rose-500"
 )} />
 {tx.status}
 </div>
 </td>
 <td className="py-6 px-4 text-right">
 <span className="text-[10px] font-bold text-slate-400">{tx.date}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Finance & Reports</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Insights</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Financial Hub</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Comprehensive overview of platform revenue, margins, and financial performance across all services.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Overview', 'Earn Reports', 'Comm Reports', 'Analytics'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2 px-6 py-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
 <Calendar className="w-4 h-4 text-[#0089D1]" />
 <span className="text-xs font-black text-slate-900 leading-none">{timeRange}</span>
 </div>
 <button className="flex items-center gap-3 px-8 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
 <Download className="w-4 h-4" /> Export CSV
 </button>
 </div>
 </div>

 {activeTab === 'Overview' && renderOverview()}
 {activeTab !== 'Overview' && (
 <div className="h-[60vh] bg-white rounded-[60px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <Layers className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">Refining {activeTab}</h2>
 <p className="text-sm font-medium">This granular section is being optimized for real-time data sync.</p>
 </div>
 )}
 </div>
 );
};

// Re-using Clock from lucide to fix lint if needed
const Clock = ({ className }: { className?: string }) => (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className={className}
 >
 <circle cx="12" cy="12" r="10" />
 <polyline points="12 6 12 12 16 14" />
 </svg>
);
