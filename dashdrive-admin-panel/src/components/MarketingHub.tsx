import React, { useState } from 'react';
import {
 Ticket,
 Percent,
 Bell,
 Flag,
 Mail,
 Plus,
 Search,
 Filter,
 ChevronRight,
 Zap,
 Users,
 BarChart3,
 Calendar,
 MoreVertical,
 CheckCircle2,
 XCircle,
 Clock,
 Send,
 Smartphone,
 MousePointer2,
 LayoutGrid,
 TrendingUp,
 Target
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const MarketingHub: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Campaigns');

 const campaigns = [
 { name: 'Ramadan 2024 Special', type: 'Coupon', performance: '12.4k Uses', cost: '$4,250', status: 'Active', color: 'text-emerald-500', bg: 'bg-emerald-50' },
 { name: 'New User 50% Off', type: 'Discount', performance: '45.1k Uses', cost: '$12,900', status: 'Active', color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
 { name: 'Weekend Surge Free', type: 'Notification', performance: '2.5% CTR', cost: '$150', status: 'Scheduled', color: 'text-indigo-500', bg: 'bg-indigo-50' },
 { name: 'Late Night Ride Promo', type: 'Banner', performance: '850 Clicks', cost: '$300', status: 'Paused', color: 'text-amber-500', bg: 'bg-amber-50' },
 ];

 const renderCampaigns = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Active Coupons', value: '42', trend: '+5', icon: Ticket, color: 'text-pink-500', bg: 'bg-pink-50' },
 { label: 'Live Banners', value: '18', trend: '+2', icon: Flag, color: 'text-amber-500', bg: 'bg-amber-50' },
 { label: 'Avg Promo Margin', value: '12.4%', trend: '-1.2%', icon: Percent, color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
 { label: 'Total Reach', value: '2.4M', trend: '+125k', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' }
 ].map((stat, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center justify-between mb-6">
 <div className={cn("p-4 rounded-2xl transition-colors duration-500", stat.bg)}>
 <stat.icon className={cn("w-6 h-6", stat.color)} />
 </div>
 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl ">{stat.trend}</span>
 </div>
 <p className="text-[10px] font-bold text-slate-400 mb-1">{stat.label}</p>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-12 gap-8">
 <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-xl font-black text-slate-900">Campaign Performance</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Conversion rate across all marketing channels</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 ">Day</button>
 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold ">Week</button>
 </div>
 </div>

 <div className="h-[350px] flex items-end justify-between gap-2 px-4 relative">
 <div className="absolute inset-0 flex flex-col justify-between opacity-5">
 {[...Array(5)].map((_, i) => <div key={i} className="border-t border-slate-900 w-full" />)}
 </div>
 {[45, 60, 55, 85, 70, 95, 65, 80, 50, 75, 90, 85].map((h, i) => (
 <div key={i} className="flex-1 bg-gradient-to-t from-[#0089D1] to-[#00AEEF] rounded-t-xl group relative cursor-help" style={{ height: `${h}%` }}>
 <div className="absolute -top-10 left-1/2 -track-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
 {h}% Conv
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="col-span-12 lg:col-span-4 bg-slate-900 p-10 rounded-[40px] text-white overflow-hidden relative">
 <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#0089D1]/10 rounded-full blur-[100px]" />
 <h3 className="text-xl font-black mb-8">Audience Segments</h3>
 <div className="space-y-8">
 {[
 { label: 'Elite Drivers', count: '1,240', percent: 12, icon: Zap, color: 'text-amber-400' },
 { label: 'Frequent Commuters', count: '45.8k', percent: 65, icon: Target, color: 'text-[#0089D1]' },
 { label: 'Inactive Merchants', count: '850', percent: 5, icon: Clock, color: 'text-rose-400' },
 { label: 'Mart Power Users', count: '12.4k', percent: 18, icon: MousePointer2, color: 'text-indigo-400' }
 ].map((seg, i) => (
 <div key={i} className="group cursor-pointer">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-3">
 <seg.icon className={cn("w-4 h-4", seg.color)} />
 <span className="text-xs font-black">{seg.label}</span>
 </div>
 <span className="text-[10px] font-bold opacity-40">{seg.count}</span>
 </div>
 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
 <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${seg.percent}%` }} />
 </div>
 </div>
 ))}
 </div>
 <button className="w-full mt-10 py-5 bg-[#0089D1] hover:bg-[#007AB8] text-white rounded-[24px] text-xs font-black transition-all">
 Define New Segment
 </button>
 </div>
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
 <div className="flex items-center justify-between mb-10">
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Promotions Registry</h3>
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" className="w-64 pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none" placeholder="Search campaign..." />
 </div>
 <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 border border-slate-100 transition-all"><Filter className="w-4 h-4" /></button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {campaigns.map((c, i) => (
 <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex items-center justify-between">
 <div className="flex items-center gap-6">
 <div className={cn("p-5 rounded-[24px] bg-white shadow-sm", c.bg)}>
 <Ticket className={cn("w-6 h-6", c.color)} />
 </div>
 <div>
 <h4 className="text-base font-black text-slate-900 mb-1">{c.name}</h4>
 <div className="flex items-center gap-4">
 <span className="text-[10px] font-bold text-slate-400 tracking-[0.1em]">{c.type}</span>
 <span className="w-1 h-1 rounded-full bg-slate-300" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.1em]">{c.performance}</span>
 </div>
 </div>
 </div>
 <div className="flex flex-col items-end gap-3">
 <div className={cn(
 "px-3 py-1 rounded-full text-[9px] font-black tracking-[0.15em]",
 c.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
 c.status === 'Scheduled' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
 )}>
 {c.status}
 </div>
 <span className="text-xs font-black text-slate-900">{c.cost}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Promotion</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Marketing Hub</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Marketing Hub</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Omni-channel marketing engine for engagement and retention.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Campaigns', 'Audiences', 'Vouchers', 'Notifications'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 group">
 <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> Create Promotion
 </button>
 </div>

 {activeTab === 'Campaigns' && renderCampaigns()}
 {activeTab !== 'Campaigns' && (
 <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <LayoutGrid className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">Optimizing {activeTab}</h2>
 <p className="text-sm font-medium">Coming soon: Advanced targeting and analytics integrations.</p>
 </div>
 )}
 </div>
 );
};
