import React, { useState } from 'react';
import {
 Ticket,
 Percent,
 Image as ImageIcon,
 Plus,
 Search,
 Filter,
 Calendar,
 MousePointer2,
 TrendingUp,
 MoreVertical,
 Clock,
 Tag,
 Globe,
 AlertCircle,
 CheckCircle2,
 XCircle,
 Eye,
 Edit3,
 BarChart3
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface Promotion {
 id: string;
 code: string;
 type: 'Flat' | 'Percentage';
 discount: string;
 minOrder: string;
 expiry: string;
 status: 'Active' | 'Scheduled' | 'Expired';
 usage: number;
 limit: number;
}

const mockPromotions: Promotion[] = [
 {
 id: 'PRM-501',
 code: 'WELCOME50',
 type: 'Percentage',
 discount: '50%',
 minOrder: '$20.00',
 expiry: '2026-12-31',
 status: 'Active',
 usage: 1240,
 limit: 5000
 },
 {
 id: 'PRM-502',
 code: 'WEEKEND10',
 type: 'Flat',
 discount: '$10.00',
 minOrder: '$40.00',
 expiry: '2026-03-01',
 status: 'Scheduled',
 usage: 0,
 limit: 1000
 },
 {
 id: 'PRM-503',
 code: 'FREESHIP',
 type: 'Flat',
 discount: 'Free Delivery',
 minOrder: '$15.00',
 expiry: '2026-01-01',
 status: 'Expired',
 usage: 2500,
 limit: 2500
 }
];

export const PromotionsManagement: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Coupons');
 const tabs = ['Coupons', 'Discounts', 'Banners', 'Campaigns', 'Promo Codes'];

 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Growth Engine</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage marketing campaigns, coupons, and app-wide banners</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <BarChart3 className="w-4 h-4" />
 Campaign ROI
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Create {activeTab.slice(0, -1)}
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <HighlightCard title="Active Campaigns" value="12" sub="Across 4 categories" icon={<TrendingUp />} color="primary" />
 <HighlightCard title="Total Redemption" value="48.2k" sub="+8% this month" icon={<MousePointer2 />} color="emerald" />
 <HighlightCard title="Avg Discount" value="18.5%" sub="Budget optimization" icon={<Percent />} color="purple" />
 </div>

 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />
 <div className="relative w-full md:w-72 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search codes..."
 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 </div>

 {activeTab === 'Coupons' ? (
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Coupon Details</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Logic</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Validity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Reach & Usage</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockPromotions.map((promo) => (
 <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
 <Ticket className="w-5 h-5 text-primary" />
 </div>
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{promo.code}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">{promo.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <p className="text-sm font-bold text-slate-700">{promo.discount} OFF</p>
 <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold font-small-caps">
 <Tag className="w-3 h-3" />
 Min: {promo.minOrder}
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <Calendar className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-xs font-bold text-slate-700">{promo.expiry}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2">
 <div className="flex justify-between items-center w-32">
 <span className="text-[9px] font-bold text-slate-400 font-small-caps ">{promo.usage} used</span>
 <span className="text-[9px] font-bold text-slate-300 leading-none">{Math.round((promo.usage / promo.limit) * 100)}%</span>
 </div>
 <div className="h-1 w-32 bg-slate-50 rounded-full overflow-hidden">
 <div
 className="h-full bg-primary rounded-full"
 style={{ width: `${(promo.usage / promo.limit) * 100}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black ",
 promo.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" :
 promo.status === 'Scheduled' ? "bg-amber-50 text-amber-600 border border-amber-100/50" : "bg-red-50 text-red-600 border border-red-100/50"
 )}>
 {promo.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
 {promo.status}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <Edit3 className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-slate-600">
 <MoreVertical className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 ) : (
 <div className="bg-white p-24 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center justify-center text-center">
 <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100/50 shadow-inner">
 <Globe className="w-10 h-10 text-slate-200" />
 </div>
 <h3 className="text-xl font-display font-black text-slate-800 tracking-tight">{activeTab} Manager</h3>
 <p className="text-sm text-slate-400 max-w-xs mt-3 leading-relaxed">
 The global control center for **{activeTab}** is currently being prepared for campaign scaling.
 </p>
 <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 ">
 Initialize {activeTab}
 </button>
 </div>
 )}
 </div>
 );
};

const HighlightCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode; color: string }> = ({ title, value, sub, icon, color }) => (
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 group transition-all duration-300 hover:scale-[1.02]">
 <div className="flex items-center gap-5">
 <div className={cn(
 "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
 color === 'primary' ? "bg-primary/10 text-primary shadow-primary/5" :
 color === 'emerald' ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/5" :
 "bg-purple-50 text-purple-500 shadow-purple-500/5"
 )}>
 <span className="w-5 h-5">{icon}</span>
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">{title}</p>
 <div className="flex items-baseline gap-2 mt-1">
 <p className="text-2xl font-display font-black text-slate-800 tracking-tight">{value}</p>
 <p className="text-[10px] font-bold text-slate-500 tracking-tighter">{sub}</p>
 </div>
 </div>
 </div>
 </div>
);
