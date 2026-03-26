import React from 'react';
import {
 ShoppingBag,
 Users,
 DollarSign,
 TrendingUp,
 ArrowUpRight,
 Package,
 Star,
 AlertCircle,
 BarChart3,
 PieChart,
 ChevronRight,
 Search,
 Filter,
 Calendar,
 Download
} from 'lucide-react';
import { cn } from '../utils';

export const ShoppingDashboard: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Shopping Insights</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Marketplace performance monitoring and multi-vendor analytics</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Calendar className="w-4 h-4 text-slate-400" />
 Last 30 Days
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Download className="w-4 h-4 text-white/50" />
 Download Report
 </button>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
 <KPICard title="GMV Today" value="$42,850" change="+12.5%" icon={<DollarSign />} color="emerald" />
 <KPICard title="Shop Orders" value="1,248" change="+8.2%" icon={<ShoppingBag />} color="primary" />
 <KPICard title="Active Vendors" value="312" change="+4" icon={<Users />} color="blue" />
 <KPICard title="Products" value="12.4k" change="+142" icon={<Package />} color="purple" />
 <KPICard title="Conv. Rate" value="3.85%" change="+0.4%" icon={<TrendingUp />} color="rose" />
 <KPICard title="Refund Rate" value="0.92%" change="-0.1%" icon={<AlertCircle />} color="orange" />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Sales Trend Chart (Mock) */}
 <div className="lg:col-span-8 bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Marketplace GMV Trend</h3>
 <p className="text-xs text-slate-400 font-bold font-small-caps mt-1 ">Revenue Growth vs Last Period</p>
 </div>
 <div className="flex bg-slate-50 p-1 rounded-xl">
 <button className="px-4 py-1.5 rounded-lg text-[9px] font-black bg-white shadow-sm text-primary">Daily</button>
 <button className="px-4 py-1.5 rounded-lg text-[9px] font-black text-slate-400 hover:text-slate-600">Weekly</button>
 </div>
 </div>

 <div className="h-[300px] w-full bg-slate-50/50 rounded-[32px] border border-dashed border-slate-100 flex items-end justify-between px-8 pb-4">
 {[40, 65, 45, 90, 75, 55, 85, 100, 80, 70, 95, 88].map((h, i) => (
 <div key={i} className="w-8 bg-primary/10 rounded-t-xl relative group transition-all hover:bg-primary/20" style={{ height: `${h}%` }}>
 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
 ${(h * 420).toLocaleString()}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Top Vendors Ranking */}
 <div className="lg:col-span-4 bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50 flex flex-col">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Top Performance</h3>
 <p className="text-xs text-slate-400 font-bold font-small-caps mt-1 ">Merchant Revenue Ranking</p>
 </div>
 <button className="text-[10px] font-bold text-primary hover:underline">View All</button>
 </div>

 <div className="space-y-6 flex-1">
 {[
 { name: 'ElectroHub Store', rev: '$24.5k', icon: 'https://logo.clearbit.com/apple.com' },
 { name: 'Urban Fashion', rev: '$18.2k', icon: 'https://logo.clearbit.com/nike.com' },
 { name: 'Beauty Palace', rev: '$16.9k', icon: 'https://logo.clearbit.com/sephora.com' },
 { name: 'Home Essentials', rev: '$12.4k', icon: 'https://logo.clearbit.com/ikea.com' },
 { name: 'Gadget World', rev: '$10.8k', icon: 'https://logo.clearbit.com/samsung.com' }
 ].map((vendor, i) => (
 <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 font-bold text-slate-400">
 <img src={vendor.icon} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-800 tracking-tight">{vendor.name}</p>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps ">#{i + 1} Marketplace Rank</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-sm font-black text-slate-950">{vendor.rev}</p>
 <p className="text-[9px] text-emerald-500 font-bold ">+4.2%</p>
 </div>
 </div>
 ))}
 </div>

 <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-bold font-small-caps hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
 Marketplace Insights
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
 {/* Product Performance (Pie Chart Mock) */}
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Category Mix</h3>
 <p className="text-xs text-slate-400 font-bold font-small-caps mt-1 ">GMV Contribution by Type</p>
 </div>
 <PieChart className="w-5 h-5 text-slate-300" />
 </div>
 <div className="space-y-5">
 <CategoryProgress label="Electronics" percent={45} color="bg-primary" />
 <CategoryProgress label="Fashion" percent={25} color="bg-blue-500" />
 <CategoryProgress label="Beauty" percent={15} color="bg-rose-500" />
 <CategoryProgress label="Home & Kitchen" percent={15} color="bg-emerald-500" />
 </div>
 </div>

 {/* Low Stock Alerts */}
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Stock Warnings</h3>
 <p className="text-xs text-slate-400 font-bold font-small-caps mt-1 ">High Demand / Low Inventory</p>
 </div>
 <AlertCircle className="w-5 h-5 text-orange-400" />
 </div>
 <div className="space-y-4">
 {[
 { name: 'Wireless Headphones V2', stock: 4, vendor: 'ElectroHub' },
 { name: 'Summer Cotton T-Shirt', stock: 2, vendor: 'Urban Fashion' },
 { name: 'OLED Smart Monitor 32"', stock: 0, vendor: 'Gadget World' }
 ].map((item, i) => (
 <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={cn(
 "w-2 h-2 rounded-full",
 item.stock === 0 ? "bg-red-500 animate-pulse" : "bg-orange-500"
 )} />
 <div>
 <p className="text-xs font-bold text-slate-800">{item.name}</p>
 <p className="text-[9px] text-slate-400 font-bold ">{item.vendor}</p>
 </div>
 </div>
 <span className={cn(
 "px-2 py-1 rounded-lg text-[10px] font-black",
 item.stock === 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
 )}>
 {item.stock === 0 ? 'OOS' : `${item.stock} LEFT`}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Growth Analysis */}
 <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
 <div className="relative z-10 space-y-8">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg font-display font-black text-white tracking-tight">Revenue AI Analysis</h3>
 <p className="text-xs text-white/40 font-bold font-small-caps mt-1 ">Smart Marketplace Insights</p>
 </div>
 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary">
 <TrendingUp className="w-6 h-6" />
 </div>
 </div>
 <p className="text-lg font-medium text-white/80 leading-snug">
 Fashion conversions are up <span className="text-primary font-black">18.4%</span> this week. Recommend launching a <span className="text-white font-bold italic underline border-white/20">"Spring Essentials"</span> promotion to capitalize on current traffic trends.
 </p>
 <div className="pt-8 border-t border-white/5 space-y-4">
 <div className="flex items-center justify-between text-[11px] font-bold font-small-caps text-white/40 ">
 <span>Projected Growth</span>
 <span className="text-primary">+24%</span>
 </div>
 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
 <div className="h-full bg-primary rounded-full w-3/4 animate-in slide-in-from-left duration-1000" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

interface KPICardProps {
 title: string;
 value: string;
 change: string;
 icon: React.ReactNode;
 color: 'emerald' | 'primary' | 'blue' | 'purple' | 'rose' | 'orange';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => (
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group">
 <div className="flex justify-between items-start mb-4">
 <div className={cn(
 "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
 color === 'emerald' && "bg-emerald-50 text-emerald-600",
 color === 'primary' && "bg-primary/10 text-primary",
 color === 'blue' && "bg-blue-50 text-blue-600",
 color === 'purple' && "bg-purple-50 text-purple-600",
 color === 'rose' && "bg-rose-50 text-rose-600",
 color === 'orange' && "bg-orange-50 text-orange-600"
 )}>
 <span className="w-5 h-5">{icon}</span>
 </div>
 <span className={cn(
 "text-[10px] font-black px-1.5 py-0.5 rounded-lg",
 change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
 )}>{change}</span>
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 font-small-caps mb-1">{title}</p>
 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">{value}</h3>
 </div>
 </div>
);

const CategoryProgress: React.FC<{ label: string, percent: number, color: string }> = ({ label, percent, color }) => (
 <div className="space-y-2">
 <div className="flex items-center justify-between text-[11px] font-bold font-small-caps ">
 <span className="text-slate-600">{label}</span>
 <span className="text-slate-900">{percent}%</span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percent}%` }} />
 </div>
 </div>
);
