import React, { useState } from 'react';
import {
 Plus,
 Search,
 Maximize2,
 Zap,
 MapPin,
 DollarSign,
 Layers,
 TrendingUp,
 Settings2,
 ChevronRight,
 Edit3,
 Trash2,
 CheckCircle2,
 Box,
 Truck,
 Info,
 ArrowUpRight
} from 'lucide-react';
import { cn } from '../utils';

interface WeightSlab {
 id: string;
 range: string;
 baseFee: string;
 perKmRate: string;
 handlingFee: string;
 status: 'Active' | 'Draft';
}

const mockSlabs: WeightSlab[] = [
 { id: 'SLB-01', range: '0 - 1 kg', baseFee: '$4.50', perKmRate: '$0.50', handlingFee: '$0.00', status: 'Active' },
 { id: 'SLB-02', range: '1 - 5 kg', baseFee: '$8.50', perKmRate: '$0.80', handlingFee: '$1.50', status: 'Active' },
 { id: 'SLB-03', range: '5 - 10 kg', baseFee: '$12.00', perKmRate: '$1.20', handlingFee: '$3.50', status: 'Active' },
 { id: 'SLB-04', range: '10 - 20 kg', baseFee: '$22.00', perKmRate: '$2.00', handlingFee: '$7.50', status: 'Active' },
 { id: 'SLB-05', range: '20kg+', baseFee: '$45.00', perKmRate: '$3.50', handlingFee: '$15.00', status: 'Draft' }
];

export const ParcelWeights: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Pricing Engine</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Configure weight slabs, distance coefficients, and handling surcharges for global delivery</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Settings2 className="w-5 h-5 text-primary" />
 Simulation Mode
 </button>
 </div>

 {/* Fare Logic Overview Card */}
 <div className="bg-white rounded-[40px] p-10 shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-20 -translate-y-20 blur-3xl group-hover:bg-primary/10 transition-colors" />

 <div className="w-48 h-48 rounded-[32px] bg-slate-900 flex flex-col items-center justify-center text-center p-6 shadow-2xl relative z-10 shrink-0">
 <p className="text-[10px] font-bold text-primary tracking-[0.2em] mb-2 leading-none font-small-caps">Global Formula</p>
 <div className="text-white space-y-1">
 <p className="text-2xl font-display font-black tracking-tight">Base + (KM × Rate)</p>
 <p className="text-[9px] font-bold text-white/40 ">+ Surcharges</p>
 </div>
 </div>

 <div className="flex-1 space-y-6 relative z-10">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 <PricingMetric label="Minimum Fare" value="$4.50" sub="Standard Route" />
 <PricingMetric label="Fuel Surcharge" value="2.5%" sub="Applied Dynamicly" />
 <PricingMetric label="Night Premium" value="+$2.00" sub="22:00 - 06:00" />
 <PricingMetric label="Revenue Growth" value="+18%" sub="vs Last Month" color="text-emerald-500" />
 </div>
 <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
 <div className="p-2 bg-amber-50 rounded-lg">
 <Zap className="w-4 h-4 text-amber-500" />
 </div>
 <p className="text-xs text-slate-500 font-medium italic">
 System is currently applying <span className="text-slate-900 font-bold underline decoration-amber-200">Surge Pricing x1.2</span> in High-Volume Zone A.
 </p>
 </div>
 </div>
 </div>

 {/* Weight Slabs Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <Layers className="w-5 h-5 text-slate-400" />
 <h4 className="text-sm font-black text-slate-900 ">Pricing Slabs</h4>
 </div>
 <button className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline">
 <Plus className="w-4 h-4" /> Add Slab
 </button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Slab Identifier</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Weight Range</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Base Fee</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Per KM Rate</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Extra Handling</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockSlabs.map((slab) => (
 <tr key={slab.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex flex-col">
 <span className="text-sm font-black text-slate-900 tracking-tight">{slab.id}</span>
 <span className={cn(
 "text-[9px] font-black mt-1 ",
 slab.status === 'Active' ? "text-emerald-500" : "text-amber-500"
 )}>{slab.status}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <Box className="w-4 h-4" />
 </div>
 <span className="text-sm font-bold text-slate-700">{slab.range}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className="text-sm font-black text-slate-900">{slab.baseFee}</span>
 </td>
 <td className="px-8 py-6">
 <span className="text-sm font-bold text-slate-600">{slab.perKmRate}</span>
 </td>
 <td className="px-8 py-6">
 <span className="text-sm font-bold text-slate-600">{slab.handlingFee}</span>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary transition-all">
 <Edit3 className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-all">
 <Trash2 className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Smart Optimization Alert */}
 <div className="bg-emerald-900 rounded-[48px] p-12 relative overflow-hidden group border border-white/5">
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white text-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
 <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-2xl animate-pulse-slow">
 <TrendingUp className="w-10 h-10" />
 </div>
 <div className="space-y-2">
 <h4 className="text-2xl font-display font-black text-white tracking-tight leading-tight">Insight: Slab Efficiency Optimization</h4>
 <p className="text-emerald-100/60 max-w-xl font-medium leading-relaxed">
 Data shows <span className="text-white font-bold underline decoration-white/20">2.5kg - 4kg parcels</span> are significantly under-priced vs fuel costs. We recommend splitting <span className="text-white font-bold italic">SLB-02</span> into two distinct slabs.
 </p>
 </div>
 <div className="md:ml-auto">
 <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl text-[10px] font-bold font-small-caps tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
 Apply Suggestion
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

const PricingMetric: React.FC<{ label: string, value: string, sub: string, color?: string }> = ({ label, value, sub, color = "text-slate-900" }) => (
 <div className="space-y-1">
 <p className="text-[10px] font-bold text-slate-400 ">{label}</p>
 <p className={cn("text-xl font-display font-black tracking-tight", color)}>{value}</p>
 <p className="text-[9px] font-bold text-slate-300 ">{sub}</p>
 </div>
);
