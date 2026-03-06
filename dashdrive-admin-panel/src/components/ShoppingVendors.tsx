import React, { useState } from 'react';
import {
 Search,
 Filter,
 MoreVertical,
 Eye,
 CheckCircle2,
 XCircle,
 Store,
 DollarSign,
 TrendingUp,
 PieChart,
 ArrowUpRight,
 Plus,
 ChevronRight,
 RefreshCcw,
 Users,
 Wallet,
 Calendar,
 Clock,
 MapPin,
 Star,
 AlertCircle,
 UserPlus,
 Package
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface ShoppingVendor {
 id: string;
 name: string;
 businessName: string;
 category: string;
 productsCount: number;
 ordersCount: string;
 earnings: string;
 commission: string;
 rating: number;
 status: 'Active' | 'Pending Approval' | 'Suspended';
 image: string;
}

const mockVendors: ShoppingVendor[] = [
 {
 id: 'VND-SHP-001',
 name: 'John Electro',
 businessName: 'ElectroHub Store',
 category: 'Electronics',
 productsCount: 420,
 ordersCount: '12.4k',
 earnings: '$142,500',
 commission: '12%',
 rating: 4.8,
 status: 'Active',
 image: 'https://logo.clearbit.com/apple.com'
 },
 {
 id: 'VND-SHP-002',
 name: 'Sarah Fashion',
 businessName: 'Urban Fashion',
 category: 'Fashion',
 productsCount: 1250,
 ordersCount: '38.2k',
 earnings: '$285,000',
 commission: '15%',
 rating: 4.7,
 status: 'Active',
 image: 'https://logo.clearbit.com/nike.com'
 },
 {
 id: 'VND-SHP-003',
 name: 'Dr. Beauty',
 businessName: 'Beauty Palace',
 category: 'Beauty',
 productsCount: 185,
 ordersCount: '4.2k',
 earnings: '$52,100',
 commission: '18%',
 rating: 4.6,
 status: 'Pending Approval',
 image: 'https://logo.clearbit.com/sephora.com'
 },
 {
 id: 'VND-SHP-004',
 name: 'IKEA Global',
 businessName: 'Home Essentials',
 category: 'Home & Kitchen',
 productsCount: 940,
 ordersCount: '8.9k',
 earnings: '$112,400',
 commission: '10%',
 rating: 4.9,
 status: 'Suspended',
 image: 'https://logo.clearbit.com/ikea.com'
 }
];

export const ShoppingVendors: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Vendors');
 const [searchQuery, setSearchQuery] = useState('');

 const tabs = ['All Vendors', 'Pending Approval', 'Active Vendors', 'Suspended Vendors', 'Vendor Requests'];

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Merchant Ecosystem</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage multi-vendor seller profiles, marketplace onboarding, and global commission fees</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <Wallet className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Payout Management
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <UserPlus className="w-4 h-4" />
 Invite Vendor
 </button>
 </div>
 </div>

 {/* KPI Stats Section */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatBox title="Total Partners" value="1,420" subValue="+12 this month" color="emerald" />
 <StatBox title="Pending Validation" value="28" subValue="Awaiting Review" color="amber" />
 <StatBox title="Active GMV Contribution" value="68.4%" subValue="+4.2% Growth" color="primary" />
 <StatBox title="Avg Vendor Rating" value="4.72" subValue="Based on 122k reviews" color="blue" />
 </div>

 {/* Sub-Tabs / Search Bar */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-[32px] shadow-soft border border-slate-100/50">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search merchant name or ID..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:bg-white focus:border-primary/30 outline-none transition-all"
 />
 </div>
 </div>

 {/* Vendors Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Merchant Profile</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Dept & Load</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Market Performance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Admin Economics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockVendors.map((vendor) => (
 <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 animate-pulse-slow">
 <img src={vendor.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="" />
 </div>
 <div>
 <span className="text-sm font-black text-slate-900 block leading-tight tracking-tight">{vendor.businessName}</span>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[10px] font-bold text-slate-400 font-small-caps ">Owner: {vendor.name}</span>
 <span className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-bold text-primary font-small-caps whitespace-nowrap">{vendor.id}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <PieChart className="w-3.5 h-3.5 text-primary" />
 <span className="text-xs font-bold text-slate-700">{vendor.category}</span>
 </div>
 <div className="flex items-center gap-2">
 <Package className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[11px] font-medium text-slate-500">{vendor.productsCount} SKUs Active</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1">
 <div className="flex items-baseline gap-2">
 <span className="text-lg font-display font-black text-slate-950 tracking-tight">{vendor.earnings}</span>
 <span className="text-[9px] font-bold text-emerald-500 ">+12%</span>
 </div>
 <div className="flex items-center gap-1.5 text-amber-500">
 <Star className="w-3 h-3 fill-amber-500" />
 <span className="text-[11px] font-black">{vendor.rating}</span>
 <span className="text-[10px] text-slate-400 font-bold ml-1">• {vendor.ordersCount} Total Orders</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center justify-between">
 <div className="space-y-1">
 <p className="text-[10px] font-bold text-slate-400 font-small-caps leading-none">Global Fee</p>
 <p className="text-base font-display font-black text-slate-900 tracking-tight">{vendor.commission}</p>
 </div>
 <VendorStatusBadge status={vendor.status} />
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="View Full Profile">
 <Eye className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Administrative Access">
 <Plus className="w-4.5 h-4.5" />
 </button>
 <div className="w-px h-6 bg-slate-100 mx-1" />
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Restrict Store">
 <XCircle className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Quick Policy Reminder */}
 <div className="bg-slate-900 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
 <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-primary/20 blur-3xl group-hover:w-1/3 transition-all duration-700 pointer-events-none" />
 <div className="flex items-center gap-6 relative z-10">
 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
 <AlertCircle className="w-7 h-7" />
 </div>
 <div className="max-w-xl">
 <h4 className="text-white text-lg font-display font-black tracking-tight leading-tight">Vendor Compliance Snapshot</h4>
 <p className="text-white/40 text-[11px] font-bold font-medium mt-1 leading-relaxed">
 Marketplace commissions are calculated per order. Changes to commission rates will trigger an
 <span className="text-primary mx-1">automatically scheduled notification</span> to the vendor 24 hours before activation.
 </p>
 </div>
 </div>
 <button className="mt-6 md:mt-0 px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-bold font-small-caps hover:bg-primary hover:text-white transition-all shadow-2xl relative z-10">
 Global Fee Engine
 </button>
 </div>
 </div>
 );
};

const StatBox: React.FC<{ title: string, value: string, subValue: string, color: string }> = ({ title, value, subValue, color }) => (
 <div className="bg-white p-7 rounded-[40px] shadow-soft border border-slate-100/50 group hover:shadow-xl transition-all">
 <div className="flex flex-col gap-1">
 <span className="text-[10px] font-bold text-slate-400 font-small-caps mb-2">{title}</span>
 <span className="text-3xl font-display font-black text-slate-900 tracking-tight mb-2">{value}</span>
 <div className="flex items-center gap-2">
 <TrendingUp className={cn(
 "w-3.5 h-3.5",
 color === 'emerald' ? "text-emerald-500" :
 color === 'amber' ? "text-amber-500" :
 color === 'primary' ? "text-primary" : "text-blue-500"
 )} />
 <span className="text-[10px] font-bold text-slate-400 font-small-caps leading-none">{subValue}</span>
 </div>
 </div>
 </div>
);

const VendorStatusBadge: React.FC<{ status: ShoppingVendor['status'] }> = ({ status }) => (
 <span className={cn(
 "px-4 py-1.5 rounded-xl text-[9px] font-black border",
 status === 'Active' && "bg-emerald-50 text-emerald-600 border-emerald-100/50",
 status === 'Pending Approval' && "bg-amber-50 text-amber-600 border-amber-100/50",
 status === 'Suspended' && "bg-red-50 text-red-600 border-red-100/50"
 )}>
 {status}
 </span>
);
