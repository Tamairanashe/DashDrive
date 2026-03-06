import React, { useState } from 'react';
import {
 Plus,
 Search,
 Edit3,
 Trash2,
 ShieldCheck,
 Zap,
 Package,
 AlertTriangle,
 ChevronRight,
 ArrowUpRight,
 MoreVertical,
 CheckCircle2
} from 'lucide-react';
import { cn } from '../utils';

interface ParcelCategory {
 id: string;
 name: string;
 description: string;
 baseRate: string;
 handlingType: 'Standard' | 'Fragile' | 'High Value' | 'Hazardous';
 restrictedItems: string[];
 safetyGuide: string;
 status: 'Active' | 'Under Review';
}

const mockCategories: ParcelCategory[] = [
 {
 id: 'CAT-001',
 name: 'Electronics',
 description: 'Smartphones, laptops, and peripheral hardware.',
 baseRate: '$12.00',
 handlingType: 'High Value',
 restrictedItems: ['Loose Batteries', 'Damaged Screens'],
 safetyGuide: 'Anti-static wrap required. Mandatory insurance above $500.',
 status: 'Active'
 },
 {
 id: 'CAT-002',
 name: 'Documents',
 description: 'Legal papers, contracts, and sensitive printed material.',
 baseRate: '$4.50',
 handlingType: 'Standard',
 restrictedItems: ['Cash', 'Passports'],
 safetyGuide: 'Weather-proof sealing mandatory. Sign-on-delivery enforced.',
 status: 'Active'
 },
 {
 id: 'CAT-003',
 name: 'Home & Kitchen',
 description: 'Glassware, ceramics, and small appliances.',
 baseRate: '$8.50',
 handlingType: 'Fragile',
 restrictedItems: ['Propane Tanks', 'Corrosive Cleaners'],
 safetyGuide: 'Double-box method for glassware. Fragile markers on all sides.',
 status: 'Active'
 },
 {
 id: 'CAT-004',
 name: 'Heavy Goods',
 description: 'Furniture, gym equipment, and bulk items > 20kg.',
 baseRate: '$35.00',
 handlingType: 'Standard',
 restrictedItems: ['Explosives', 'Livestock'],
 safetyGuide: 'Two-person lift or trolley required. Cargo bike/van only.',
 status: 'Active'
 }
];

export const ParcelCategories: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Taxonomy</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage parcel classifications, handling protocols, and safety compliance standards</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-primary text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-5 h-5" />
 New Category
 </button>
 </div>

 {/* Classification Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {mockCategories.map((cat) => (
 <div key={cat.id} className="bg-white rounded-[48px] p-10 shadow-soft border border-slate-100/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-primary/5 transition-colors duration-500" />

 <div className="relative z-10 space-y-8">
 <div className="flex items-start justify-between">
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{cat.name}</h3>
 <span className={cn(
 "px-3 py-1 rounded-xl text-[9px] font-black border",
 cat.handlingType === 'Fragile' ? "bg-rose-50 text-rose-600 border-rose-100/50" :
 cat.handlingType === 'High Value' ? "bg-amber-50 text-amber-600 border-amber-100/50" :
 "bg-blue-50 text-blue-600 border-blue-100/50"
 )}>
 {cat.handlingType}
 </span>
 </div>
 <p className="text-sm text-slate-500 font-medium max-w-sm">{cat.description}</p>
 </div>
 <div className="text-right">
 <p className="text-xs font-bold text-slate-400 mb-1">Base Rate</p>
 <p className="text-2xl font-display font-black text-primary tracking-tight">{cat.baseRate}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <p className="text-[10px] font-bold text-slate-400 border-b border-slate-50 pb-2 flex items-center gap-2">
 <AlertTriangle className="w-3 h-3" /> Restricted Entities
 </p>
 <div className="flex flex-wrap gap-2">
 {cat.restrictedItems.map((item, i) => (
 <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-xl border border-slate-100">
 {item}
 </span>
 ))}
 </div>
 </div>
 <div className="space-y-4">
 <p className="text-[10px] font-bold text-slate-400 border-b border-slate-50 pb-2 flex items-center gap-2">
 <ShieldCheck className="w-3 h-3" /> Compliance Protocol
 </p>
 <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
 "{cat.safetyGuide}"
 </p>
 </div>
 </div>

 <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
 <CheckCircle2 className="w-3.5 h-3.5" /> Operational
 </span>
 <span className="text-[10px] font-bold text-slate-300 ">{cat.id}</span>
 </div>
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary transition-all">
 <Edit3 className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-all">
 <Trash2 className="w-4.5 h-4.5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}

 {/* Create New Card */}
 <div className="border-4 border-dashed border-slate-100 rounded-[48px] p-10 flex flex-col items-center justify-center text-center space-y-6 group hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 cursor-pointer">
 <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-primary group-hover:scale-110 shadow-sm transition-all duration-500">
 <Plus className="w-10 h-10" />
 </div>
 <div>
 <h4 className="text-xl font-display font-black text-slate-400 group-hover:text-slate-900 transition-colors tracking-tight">Define New Category</h4>
 <p className="text-xs text-slate-400 font-medium mt-2 max-w-[200px]">Create specialized handling rules for custom logistics requirements</p>
 </div>
 </div>
 </div>
 </div>
 );
};
