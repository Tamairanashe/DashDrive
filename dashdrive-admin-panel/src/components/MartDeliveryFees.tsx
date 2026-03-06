import React, { useState } from 'react';
import {
 DollarSign,
 MapPin,
 Navigation,
 Zap,
 Clock,
 Plus,
 Save,
 ChevronRight,
 ArrowUpRight,
 Map as MapIcon,
 Settings,
 Edit3,
 Trash2,
 Calendar,
 Percent,
 TrendingUp,
 Shield,
 ShoppingBag
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface DeliveryRule {
 id: string;
 zone: string;
 baseFee: string;
 extraFee: string;
 avgTime: string;
 activeRiders: number;
 status: 'Active' | 'Inactive';
}

const mockRules: DeliveryRule[] = [
 { id: 'RULE-001', zone: 'Gulshan 2', baseFee: '$2.50', extraFee: '$0.50', avgTime: '22 min', activeRiders: 42, status: 'Active' },
 { id: 'RULE-002', zone: 'Banani', baseFee: '$3.00', extraFee: '$0.00', avgTime: '18 min', activeRiders: 28, status: 'Active' },
 { id: 'RULE-003', zone: 'Dhanmondi', baseFee: '$2.00', extraFee: '$1.00', avgTime: '35 min', activeRiders: 15, status: 'Inactive' }
];

export const MartDeliveryFees: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Base & Zone Fees');

 const tabs = ['Base & Zone Fees', 'Distance Pricing', 'Surge Delivery Fee', 'Fee Logs'];

 return (
 <div className="space-y-8">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Pricing Engine</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Configure delivery costs, surge multipliers, and threshold-based free delivery</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <Clock className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Scheduled Changes
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Save className="w-4 h-4 text-white/50" />
 Apply Global Rules
 </button>
 </div>
 </div>

 {/* Sub-Tabs */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />

 {activeTab === 'Base & Zone Fees' && (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Global Base Setup */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50 space-y-8">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Main Delivery Setup</h3>
 <p className="text-xs text-slate-400 font-medium mt-1">Platform-wide default economics</p>
 </div>

 <div className="space-y-6">
 <PricingField label="Base Delivery Fee" value="2.50" icon={<DollarSign />} suffix="USD" />
 <PricingField label="Min Order Value" value="15.00" icon={<ShoppingBag />} suffix="USD" />
 <PricingField label="Free Delivery Limit" value="45.00" icon={<Shield />} suffix="USD" />
 <PricingField label="Handling Fee" value="1.20" icon={<Settings />} suffix="USD" />
 </div>

 <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
 Update Base Constants
 </button>
 </div>

 {/* Summary Box */}
 <div className="bg-emerald-900 p-8 rounded-[40px] text-white/90 space-y-4">
 <div className="flex items-center gap-3">
 <TrendingUp className="w-5 h-5 text-emerald-400" />
 <span className="text-[10px] font-bold font-small-caps tracking-[0.2em]">Efficiency Insight</span>
 </div>
 <p className="text-sm font-medium leading-relaxed">Lowering the <span className="text-white font-black">Free Delivery Limit</span> to $35 currently matches competitor pricing and may increase order volume by 12% in Gulshan segments.</p>
 </div>
 </div>

 {/* Zone-Based Pricing Table */}
 <div className="lg:col-span-2 space-y-6">
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
 <div>
 <h3 className="text-lg font-display font-black text-slate-900 tracking-tight">Zone Pricing Table</h3>
 <p className="text-xs text-slate-400 font-medium mt-1">Modify fees per geographic fulfillment zone</p>
 </div>
 <button className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-primary/10 transition-colors">
 <Plus className="w-5 h-5" />
 </button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/30">
 <th className="px-8 py-5 text-[9px] font-bold text-slate-400 ">Zone Profile</th>
 <th className="px-8 py-5 text-[9px] font-bold text-slate-400 ">Pricing Structure</th>
 <th className="px-8 py-5 text-[9px] font-bold text-slate-400 ">Service Status</th>
 <th className="px-8 py-5 text-[9px] font-bold text-slate-400 ">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockRules.map((rule) => (
 <tr key={rule.id} className="hover:bg-slate-50/30 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
 <MapPin className="w-5 h-5" />
 </div>
 <div>
 <span className="text-sm font-bold text-slate-800 block leading-tight">{rule.zone}</span>
 <span className="text-[10px] text-slate-400 font-bold tracking-tighter">{rule.activeRiders} Active Riders</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-6">
 <div className="space-y-1">
 <p className="text-[9px] text-slate-400 font-bold font-small-caps ">Base Fee</p>
 <p className="text-sm font-black text-slate-900">{rule.baseFee}</p>
 </div>
 <div className="space-y-1">
 <p className="text-[9px] text-slate-400 font-bold font-small-caps ">Extra Surge</p>
 <p className="text-sm font-black text-emerald-600">+{rule.extraFee}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className={cn(
 "px-3 py-1 rounded-lg text-[9px] font-black ",
 rule.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
 )}>
 {rule.status}
 </span>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-2.5 hover:bg-slate-100 text-slate-300 hover:text-primary rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
 <button className="p-2.5 hover:bg-slate-100 text-slate-300 hover:text-red-500 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Surge Preview Bar */}
 <div className="bg-slate-900 rounded-[32px] p-8 flex items-center justify-between overflow-hidden relative">
 <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
 <div className="flex items-center gap-6 relative z-10">
 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary animate-pulse">
 <Zap className="w-7 h-7 fill-primary" />
 </div>
 <div>
 <h4 className="text-white text-lg font-display font-black tracking-tight">Active Surge Multipliers</h4>
 <p className="text-white/40 text-[10px] font-bold font-small-caps mt-1">Global imbalance: Moderately High</p>
 </div>
 </div>
 <div className="flex items-center gap-4 relative z-10">
 <div className="text-right">
 <p className="text-white font-black text-2xl tracking-tighter">1.25x</p>
 <p className="text-emerald-400 text-[9px] font-bold ">Recommended</p>
 </div>
 <button className="px-6 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-bold font-small-caps tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
 Trigger Global Surge
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {activeTab === 'Distance Pricing' && (
 <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-soft text-center space-y-8">
 <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
 <Navigation className="w-12 h-12 text-slate-300" />
 </div>
 <div className="max-w-xl mx-auto space-y-4">
 <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Distance-Based Logistics Tuning</h3>
 <p className="text-slate-500 font-medium">Fine-tune how much customers pay based on the exact road distance from the store.</p>
 <div className="py-6 px-8 bg-slate-50/50 rounded-3xl border border-slate-100 text-left font-mono text-[13px] text-slate-600">
 <span className="text-blue-600 font-bold">FEES</span> = <span className="text-slate-900 font-black">BASE_FEE</span> + (<span className="text-emerald-600 font-black">RATE_PER_KM</span> × <span className="text-slate-900 font-black">DISTANCE</span>)
 </div>
 </div>
 <div className="flex justify-center gap-4">
 <div className="w-1/3 p-6 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 ">Per KM Rate</p>
 <input type="text" defaultValue="$0.45" className="w-full text-center text-xl font-black text-slate-900 bg-slate-50 py-3 rounded-2xl border border-slate-100 outline-none focus:border-primary/30" />
 </div>
 <div className="w-1/3 p-6 bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 ">Max Delivery Radius</p>
 <input type="text" defaultValue="12 KM" className="w-full text-center text-xl font-black text-slate-900 bg-slate-50 py-3 rounded-2xl border border-slate-100 outline-none focus:border-primary/30" />
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

const PricingField: React.FC<{ label: string, value: string, icon: React.ReactNode, suffix?: string }> = ({ label, value, icon, suffix }) => (
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 font-small-caps flex items-center gap-2">
 {React.cloneElement(icon as React.ReactElement, { className: "w-3 h-3" })}
 {label}
 </label>
 <div className="relative group/field">
 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-tighter">{suffix}</span>
 <input
 type="text"
 defaultValue={value}
 className="w-full pl-6 pr-16 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-900 focus:bg-white focus:border-primary/30 outline-none transition-all group-hover/field:border-slate-200"
 />
 </div>
 </div>
);
