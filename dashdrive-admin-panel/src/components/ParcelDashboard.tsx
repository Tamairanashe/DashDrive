import React, { useState } from 'react';
import {
 TrendingUp,
 TrendingDown,
 Box,
 Package,
 Truck,
 Clock,
 AlertTriangle,
 CheckCircle2,
 MoreVertical,
 Activity,
 Users,
 MapPin,
 ArrowUpRight,
 Search,
 Filter
} from 'lucide-react';
import { cn } from '../utils';
import { MapPreview } from './MapPreview';
import { EarningChart } from './EarningChart';

export const ParcelDashboard: React.FC = () => {
 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Logistics Command Center</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Real-time monitoring of parcel flow, delivery efficiency, and network health</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex -space-x-3">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
 <img src={`https://i.pravatar.cc/150?u=logistics${i}`} alt="" />
 </div>
 ))}
 </div>
 <div className="h-10 w-px bg-slate-100" />
 <div>
 <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">Active Dispatchers</p>
 <p className="text-sm font-black text-slate-900 tracking-tight">12 Online</p>
 </div>
 </div>
 </div>

 {/* Logistics KPI Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <KPICard
 title="Total Shipments"
 value="11,200"
 trend="+8.2%"
 trendUp={true}
 icon={<Package className="text-primary" />}
 subtext="Last 24 hours"
 />
 <KPICard
 title="Avg Delivery Time"
 value="42.5m"
 trend="-2.1%"
 trendUp={true} // Down is good for time
 icon={<Clock className="text-blue-500" />}
 subtext="Network average"
 />
 <KPICard
 title="In Transit"
 value="892"
 trend="+14%"
 trendUp={true}
 icon={<Truck className="text-amber-500" />}
 subtext="Real-time flow"
 />
 <KPICard
 title="Failed Deliveries"
 value="24"
 trend="+0.5%"
 trendUp={false}
 icon={<AlertTriangle className="text-rose-500" />}
 subtext="Requires audit"
 />
 </div>

 {/* Interactive Logistics Widgets */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Delivery Flow Heat Map */}
 <div className="lg:col-span-8 bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden group">
 <div className="p-8 pb-0 flex items-center justify-between">
 <div>
 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Network Demand Heat</h3>
 <p className="text-[10px] font-bold text-slate-400 mt-1">Live Parcel Concentration</p>
 </div>
 <div className="flex bg-slate-50 p-1 rounded-xl">
 <button className="px-4 py-1.5 bg-white text-primary text-[10px] font-bold rounded-lg shadow-sm">Pickup</button>
 <button className="px-4 py-1.5 text-slate-400 text-[10px] font-bold">Dropoff</button>
 </div>
 </div>
 <div className="p-8 h-[400px]">
 <MapPreview
 type="heat-map"
 data={{ mode: 'Demand' }}
 label="High Density Zones"
 />
 </div>
 <div className="p-8 pt-0 grid grid-cols-3 gap-6 border-t border-slate-50 mt-4">
 <CompactStat label="Gulshan-2" value="High" color="text-rose-500" />
 <CompactStat label="Banani-11" value="Medium" color="text-amber-500" />
 <CompactStat label="Dhanmondi" value="Low" color="text-emerald-500" />
 </div>
 </div>

 {/* Logistics Trends */}
 <div className="lg:col-span-4 space-y-8">
 {/* Distribution Chart */}
 <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
 <TrendingUp className="w-24 h-24 text-white" />
 </div>
 <div className="relative z-10">
 <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] mb-1 font-small-caps">Revenue Yield</p>
 <h3 className="text-3xl font-display font-black text-white tracking-tight">$42,850.00</h3>
 <div className="mt-8 h-40">
 <EarningChart />
 </div>
 </div>
 </div>

 {/* Pending Actions List */}
 <div className="bg-white rounded-[40px] p-8 shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-6">
 <h4 className="text-sm font-black text-slate-900 ">Urgent Audits</h4>
 <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[10px] font-black rounded-lg">4 New</span>
 </div>
 <div className="space-y-4">
 <AuditItem
 id="PRC-9042"
 reason="Delayed > 2h"
 location="Uttara"
 time="5m ago"
 />
 <AuditItem
 id="PRC-9012"
 reason="Damaged Claim"
 location="Banani"
 time="12m ago"
 />
 </div>
 <button className="w-full mt-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-bold font-small-caps hover:text-primary hover:bg-primary/5 transition-all">
 View All Incidents
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

const KPICard: React.FC<{ title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode, subtext: string }> = ({ title, value, trend, trendUp, icon, subtext }) => (
 <div className="bg-white p-7 rounded-[40px] shadow-soft border border-slate-100/50 group hover:shadow-xl transition-all duration-500">
 <div className="flex items-start justify-between mb-4">
 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
 {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
 </div>
 <div className={cn(
 "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tighter shadow-sm",
 trendUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" : "bg-rose-50 text-rose-600 border border-rose-100/50"
 )}>
 {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
 {trend}
 </div>
 </div>
 <div>
 <p className="text-[10px] font-extrabold text-slate-400 leading-none mb-1 font-small-caps">{title}</p>
 <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">{value}</h3>
 <p className="text-[11px] font-bold text-slate-300 mt-2">{subtext}</p>
 </div>
 </div>
);

const CompactStat: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
 <div>
 <p className="text-[9px] font-bold text-slate-400 mb-1">{label}</p>
 <p className={cn("text-xs font-black tracking-tighter", color)}>{value} Demand</p>
 </div>
);

const AuditItem: React.FC<{ id: string, reason: string, location: string, time: string }> = ({ id, reason, location, time }) => (
 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-100/50 transition-colors cursor-pointer group/item">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20" />
 <div>
 <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1 group-hover/item:text-rose-500 transition-colors">{id}</p>
 <p className="text-[10px] font-bold text-slate-400 tracking-tighter leading-none">{reason} • {location}</p>
 </div>
 </div>
 <span className="text-[9px] font-bold text-slate-300 ">{time}</span>
 </div>
);
