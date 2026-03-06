import React from 'react';
import {
 TrendingUp,
 TrendingDown,
 DollarSign,
 Wallet,
 ArrowUpRight,
 ArrowDownRight,
 Clock,
 AlertTriangle,
 PieChart,
 Activity,
 CreditCard,
 Building,
 RefreshCcw,
 ShieldCheck
} from 'lucide-react';
import { StatCard } from './StatCard';
import { EarningChart } from './EarningChart';
import { cn } from '../utils';

export const FintechDashboard: React.FC = () => {
 return (
 <div className="space-y-8 pb-8 animate-in fade-in duration-700">
 {/* Header Info */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Fintech Dashboard</h2>
 <p className="text-slate-500 text-sm font-medium">Real-time financial monitoring across all super app services.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-xs font-bold text-slate-600 ">Live System Status</span>
 </div>
 <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <RefreshCcw className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Top KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard
 title="Total Transaction Volume"
 value="$1,284,502"
 icon={<Activity className="text-emerald-500 w-6 h-6" />}
 color="bg-emerald-500"
 trend="+14.2% from yesterday"
 />
 <StatCard
 title="Total Revenue (Platform)"
 value="$342,800"
 icon={<TrendingUp className="text-blue-500 w-6 h-6" />}
 color="bg-blue-500"
 trend="+8.4% from last week"
 />
 <StatCard
 title="Global Wallet Balance"
 value="$8,450,200"
 icon={<Wallet className="text-primary w-6 h-6" />}
 color="bg-primary"
 trend="+5.1% growth"
 />
 <StatCard
 title="PayLater Outstanding"
 value="$452,100"
 icon={<CreditCard className="text-amber-500 w-6 h-6" />}
 color="bg-amber-500"
 trend="+2.4% risk level"
 />
 </div>

 {/* Secondary Financial Stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/50">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 ">Withdraw Pending</p>
 <h4 className="text-2xl font-black text-slate-900 mt-0.5">$84,200</h4>
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
 <span className="text-slate-400 font-bold">428 Requests</span>
 <button className="text-primary font-bold hover:underline">Process Now</button>
 </div>
 </div>

 <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/50">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
 <AlertTriangle className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 ">Fraud Alerts</p>
 <h4 className="text-2xl font-black text-slate-900 mt-0.5">12 High Risk</h4>
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
 <span className="text-slate-400 font-bold">24 Medium Risk</span>
 <button className="text-amber-600 font-bold hover:underline">Review All</button>
 </div>
 </div>

 <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/50">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
 <ShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-400 ">Refund Success Rate</p>
 <h4 className="text-2xl font-black text-slate-900 mt-0.5">99.4%</h4>
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
 <span className="text-slate-400 font-bold">0.6% Disputed</span>
 <button className="text-emerald-600 font-bold hover:underline">View Policy</button>
 </div>
 </div>
 </div>

 {/* Main Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Transaction Trend</h3>
 <p className="text-sm text-slate-500 font-medium">Daily volume comparison across all services</p>
 </div>
 <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2.5 outline-none focus:ring-2 ring-primary/20">
 <option>Last 7 Days</option>
 <option>Last 30 Days</option>
 </select>
 </div>
 <div className="h-[350px]">
 <EarningChart />
 </div>
 </div>

 <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-black text-slate-900 tracking-tight">Service-wise Revenue</h3>
 <p className="text-sm text-slate-500 font-medium">Earnings breakdown by vertical</p>
 </div>
 <div className="flex gap-2">
 <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
 <PieChart className="w-5 h-5" />
 </button>
 </div>
 </div>

 <div className="space-y-6">
 {[
 { label: 'Ride Hailing', value: '$120,400', percent: 35, color: 'bg-blue-500' },
 { label: 'Food Delivery', value: '$92,800', percent: 27, color: 'bg-emerald-500' },
 { label: 'Mart &amp; Shopping', value: '$68,200', percent: 20, color: 'bg-primary' },
 { label: 'Fintech Fees', value: '$34,500', percent: 10, color: 'bg-amber-500' },
 { label: 'Others', value: '$26,900', percent: 8, color: 'bg-slate-300' }
 ].map((service) => (
 <div key={service.label} className="space-y-2">
 <div className="flex justify-between items-end">
 <span className="text-sm font-bold text-slate-700">{service.label}</span>
 <span className="text-sm font-black text-slate-900">{service.value}</span>
 </div>
 <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
 <div
 className={cn("h-full rounded-full transition-all duration-1000", service.color)}
 style={{ width: `${service.percent}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Bottom Row: Payment Methods & Failed Transactions */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50">
 <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Failed Transactions Monitor</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-4 text-[10px] font-bold text-slate-400 text-center">ID</th>
 <th className="pb-4 text-[10px] font-bold text-slate-400 ">User</th>
 <th className="pb-4 text-[10px] font-bold text-slate-400 ">Service</th>
 <th className="pb-4 text-[10px] font-bold text-slate-400 ">Amount</th>
 <th className="pb-4 text-[10px] font-bold text-slate-400 ">Reason</th>
 <th className="pb-4 text-[10px] font-bold text-slate-400 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {[
 { id: 'TX-9042', user: 'James Wilson', service: 'Food', amount: '$45.20', reason: 'Insufficient Funds', time: '2m ago' },
 { id: 'TX-9041', user: 'Maria Garcia', service: 'Ride', amount: '$12.00', reason: 'Gateway Timeout', time: '5m ago' },
 { id: 'TX-9040', user: 'Robert Chen', service: 'Mart', amount: '$156.40', reason: '3DS Failure', time: '12m ago' }
 ].map((tx) => (
 <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="py-4 text-xs font-black text-slate-400 text-center">{tx.id}</td>
 <td className="py-4">
 <p className="text-sm font-bold text-slate-900">{tx.user}</p>
 <p className="text-[10px] text-slate-400 font-medium">{tx.time}</p>
 </td>
 <td className="py-4 text-xs font-bold text-slate-600">{tx.service}</td>
 <td className="py-4 text-sm font-black text-slate-900">{tx.amount}</td>
 <td className="py-4">
 <span className="px-2 py-1 bg-rose-50 text-rose-500 text-[10px] font-bold rounded-lg">{tx.reason}</span>
 </td>
 <td className="py-4 text-right">
 <button className="text-xs font-bold text-primary hover:underline">Re-verify</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
 <div className="relative z-10">
 <h3 className="text-lg font-black tracking-tight mb-8">Payment Mix</h3>
 <div className="space-y-6">
 {[
 { label: 'Dash Wallet', value: '42%', color: 'bg-primary' },
 { label: 'Credit/Debit Card', value: '38%', color: 'bg-blue-400' },
 { label: 'Cash on Delivery', value: '15%', color: 'bg-amber-400' },
 { label: 'PayLater (BNPL)', value: '5%', color: 'bg-rose-400' }
 ].map((method) => (
 <div key={method.label} className="space-y-2">
 <div className="flex justify-between items-center text-xs font-bold opacity-80">
 <span>{method.label}</span>
 <span>{method.value}</span>
 </div>
 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
 <div className={cn("h-full rounded-full", method.color)} style={{ width: method.value }} />
 </div>
 </div>
 ))}
 </div>
 <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
 <p className="text-xs font-bold opacity-60 mb-2">Wallet vs External</p>
 <div className="flex items-end gap-1 mb-1">
 <span className="text-3xl font-black">1.4x</span>
 <span className="text-sm font-bold text-emerald-400 mb-1">More Wallet Usage</span>
 </div>
 <p className="text-[10px] opacity-40 leading-relaxed font-medium">Digital wallet adoption has increased by 12% following the recent Dash Rewards campaign.</p>
 </div>
 </div>
 <Building className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.03] rotate-12" />
 </div>
 </div>
 </div>
 );
};
