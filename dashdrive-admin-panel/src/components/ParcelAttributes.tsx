import React, { useState } from 'react';
import {
 Shield,
 Zap,
 Box,
 Scale,
 DollarSign,
 Info,
 CheckCircle2,
 AlertTriangle,
 Plus,
 PlusCircle,
 Server,
 Gem,
 Feather,
 Activity,
 Compass
} from 'lucide-react';
import { cn } from '../utils';

interface ParcelAttribute {
 id: string;
 name: string;
 description: string;
 feeType: 'Fixed' | 'Percentage';
 feeValue: string;
 icon: any;
 assignedCategories: string[];
 priority: 'Standard' | 'High' | 'Critical';
}

const mockAttributes: ParcelAttribute[] = [
 {
 id: 'ATTR-01',
 name: 'Fragile Handling',
 description: 'Enhanced padding and top-load placement. Mandatory for glass/ceramics.',
 feeType: 'Percentage',
 feeValue: '15%',
 icon: Feather,
 assignedCategories: ['Home & Kitchen', 'Electronics'],
 priority: 'High'
 },
 {
 id: 'ATTR-02',
 name: 'Logistics Insurance',
 description: 'Comprehensive coverage up to $2,000 for loss or structural damage.',
 feeType: 'Percentage',
 feeValue: '2.5%',
 icon: Shield,
 assignedCategories: ['Electronics', 'Heavy Goods'],
 priority: 'Critical'
 },
 {
 id: 'ATTR-03',
 name: 'Temperature Control',
 description: 'Cold-chain maintenance for perishable or medical logistics.',
 feeType: 'Fixed',
 feeValue: '$25.00',
 icon: Server,
 assignedCategories: ['Food & Pharma'],
 priority: 'High'
 },
 {
 id: 'ATTR-04',
 name: 'Signature Required',
 description: 'Proof of delivery via digital signature at exact coordinates.',
 feeType: 'Fixed',
 feeValue: '$1.50',
 icon: Compass,
 assignedCategories: ['Documents', 'High Value'],
 priority: 'Standard'
 }
];

export const ParcelAttributes: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Attributes</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Configure advanced handling rules, extra service fees, and category automation</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-bold font-small-caps shadow-sm hover:bg-slate-50 transition-all">
 <PlusCircle className="w-5 h-5 text-primary" />
 New Attribute
 </button>
 </div>

 {/* Attributes Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {mockAttributes.map((attr) => (
 <div key={attr.id} className="bg-white rounded-[48px] p-10 shadow-soft border border-slate-100/50 hover:shadow-2xl transition-all duration-500 group">
 <div className="flex items-start gap-8">
 <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center text-primary shadow-xl shrink-0 group-hover:scale-105 transition-transform">
 <attr.icon className="w-10 h-10" />
 </div>

 <div className="flex-1 space-y-4">
 <div className="flex items-center justify-between">
 <div className="space-y-1">
 <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{attr.name}</h3>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-bold text-slate-300 ">{attr.id}</span>
 <span className={cn(
 "px-2 py-0.5 rounded-lg text-[8px] font-black ",
 attr.priority === 'Critical' ? "bg-rose-50 text-rose-500" :
 attr.priority === 'High' ? "bg-amber-50 text-amber-500" :
 "bg-blue-50 text-blue-500"
 )}>{attr.priority}</span>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-bold text-slate-400 mb-1">Fee</p>
 <p className="text-2xl font-display font-black text-primary tracking-tight">{attr.feeValue}</p>
 </div>
 </div>

 <p className="text-sm text-slate-500 font-medium line-clamp-2">{attr.description}</p>

 <div className="pt-6 border-t border-slate-50">
 <p className="text-[10px] font-bold text-slate-400 mb-3">Auto-Assigned Categories</p>
 <div className="flex flex-wrap gap-2">
 {attr.assignedCategories.map((cat, i) => (
 <div key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl border border-slate-100 flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
 {cat}
 </div>
 ))}
 <button className="px-3 py-1.5 text-primary text-[10px] font-black hover:bg-primary/5 rounded-xl transition-colors">
 + {attr.assignedCategories.length > 2 ? 'Assign More' : 'Assign Category'}
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 ))}

 {/* Automation Rule Card */}
 <div className="bg-slate-900 rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group border border-white/5 lg:col-span-2">
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
 <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center animate-pulse-slow">
 <Zap className="w-16 h-16 text-primary" />
 </div>
 <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
 <h4 className="text-2xl font-display font-black text-white tracking-tight">Smart Surcharge Engine</h4>
 <p className="text-slate-400 text-sm font-medium max-w-xl">
 Our AI automatically applies <span className="text-white font-bold italic">Insurance Premium</span> and <span className="text-white font-bold italic">High Value Handling</span> based on real-time price scanning of declared contents.
 </p>
 </div>
 <div className="relative z-10">
 <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-bold font-small-caps shadow-2xl hover:scale-105 active:scale-95 transition-all">
 Configure AI Logic
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
