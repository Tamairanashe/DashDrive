import React from 'react';
import {
 Zap,
 TrendingUp,
 Map as MapIcon,
 Plus,
 Clock,
 AlertTriangle,
 Activity,
 ChevronRight,
 MoreVertical,
 ToggleLeft
} from 'lucide-react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../utils';

// Coordinate mapping helper
const mapXToLng = (x: number) => 90.4125 + (x - 600) * 0.0001;
const mapYToLat = (y: number) => 23.8103 - (y - 400) * 0.0001;

const imbalancePoints = [
 { id: 1, lat: mapYToLat(300), lng: mapXToLng(200), radius: 900, type: 'deficit', intensity: 0.85, label: 'Downtown' },
 { id: 2, lat: mapYToLat(200), lng: mapXToLng(500), radius: 1100, type: 'deficit', intensity: 0.95, label: 'Airport' },
 { id: 3, lat: mapYToLat(450), lng: mapXToLng(800), radius: 800, type: 'surplus', intensity: 0.6, label: 'Suburbs' },
 { id: 4, lat: mapYToLat(600), lng: mapXToLng(350), radius: 1000, type: 'balanced', intensity: 0.5, label: 'Business Dist' },
];

export const SurgePricing: React.FC = () => {
 return (
 <div className="space-y-10">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Surge Controller</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage dynamic pricing rules and monitor supply-demand imbalance</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Create Surge Logic
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
 <KPIBox label="Active Vectors" value="05" color="text-amber-500" />
 <KPIBox label="Current Velocity" value="1.4x" />
 <KPIBox label="Inert Demand" value="12%" color="text-red-500" />
 <KPIBox label="Aligned Fleet" value="452" />
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50">
 <h3 className="text-lg font-display font-extrabold text-slate-800 tracking-tight">Active Matrix Rules</h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Geolocation</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Strategy Detail</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Impact Factor</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Presence</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Mod</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 <SurgeRow
 zone="Downtown Central"
 trigger="High Demand"
 time="12:00 PM - 03:00 PM"
 multiplier="1.5x"
 active
 />
 <SurgeRow
 zone="Airport International"
 trigger="Driver Shortage"
 time="Always Active"
 multiplier="1.8x"
 active
 />
 <SurgeRow
 zone="University District"
 trigger="Rainy Weather"
 time="Manual Trigger"
 multiplier="1.2x"
 active={false}
 />
 </tbody>
 </table>
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Market Imbalance Heat</h3>
 </div>
 <div className="h-[350px] bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center relative overflow-hidden group">
 <MapContainer
 center={[23.8103, 90.4125]}
 zoom={13}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 attributionControl={false}
 >
 <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

 {imbalancePoints.map((p) => (
 <Circle
 key={p.id}
 center={[p.lat, p.lng]}
 radius={p.radius}
 pathOptions={{
 fillColor: p.type === 'deficit' ? '#ef4444' : p.type === 'surplus' ? '#3b82f6' : '#10b981',
 fillOpacity: 0.25,
 stroke: false
 }}
 />
 ))}

 {/* Interactive Overlay UI */}
 </MapContainer>

 {/* Center Action Overlay */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1001]">
 <div className="text-center p-10 pointer-events-auto bg-white/5 backdrop-blur-[1px] rounded-[40px]">
 <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl shadow-amber-500/20">
 <Zap className="w-8 h-8 text-white" />
 </div>
 <h4 className="text-lg font-display font-bold text-slate-800 tracking-tight mb-2">Dynamic Density Map</h4>
 <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
 Monitor supply-demand imbalance in real-time. High imbalance triggers automatic architectural surge alerts.
 </p>
 <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
 Analyze Geospatial Load
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <h3 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em] mb-8">Automation Thresholds</h3>
 <div className="space-y-5">
 <TriggerItem
 title="Autonomous Demand Sync"
 desc="Triggers when demand exceeds fleet supply by 20% threshold"
 enabled
 />
 <TriggerItem
 title="Environmental Variance"
 desc="Automatic adjustment during adverse weather conditions"
 enabled={false}
 />
 <TriggerItem
 title="Event Scheduling"
 desc="Pre-emptive multipliers for high-density local events"
 enabled={false}
 />
 </div>
 </div>

 <div className="bg-amber-50 p-8 rounded-[32px] border border-amber-100/50 relative overflow-hidden group">
 <div className="flex gap-5 relative z-10">
 <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
 <AlertTriangle className="w-6 h-6 text-white" />
 </div>
 <div>
 <h4 className="text-sm font-display font-bold text-amber-950 tracking-tight">Critical Variance Alert</h4>
 <p className="text-[11px] text-amber-900/70 mt-2 leading-relaxed font-medium">
 Downtown Central vector is experiencing a 45% driver deficit. System recommends immediate 1.8x normalization.
 </p>
 <button className="mt-5 px-6 py-2.5 bg-amber-600 text-white rounded-xl text-[10px] font-bold font-small-caps shadow-lg shadow-amber-600/10 hover:scale-105 transition-all">
 Apply System Recommendation
 </button>
 </div>
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h4 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em]">Velocity Analysis</h4>
 <Activity className="w-4 h-4 text-slate-200" />
 </div>
 <div className="space-y-6">
 <div className="flex justify-between items-end">
 <div>
 <p className="text-3xl font-display font-extrabold text-slate-900 tracking-tighter">1,240</p>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1">Reqs / Matrix Hour</p>
 </div>
 <div className="text-right">
 <p className="text-sm font-display font-black text-emerald-500">+12%</p>
 </div>
 </div>
 <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
 <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: '70%' }} />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

const KPIBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
 <div className="bg-white p-7 rounded-[28px] border border-slate-100/50 shadow-soft group hover:border-primary/20 transition-all">
 <p className="text-[10px] font-bold text-slate-400 font-small-caps mb-2.5">{label}</p>
 <p className={cn("text-3xl font-display font-black tracking-tight", color || "text-slate-900")}>{value}</p>
 </div>
);

const SurgeRow: React.FC<{ zone: string; trigger: string; time: string; multiplier: string; active: boolean }> = ({ zone, trigger, time, multiplier, active }) => (
 <tr className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-5">
 <span className="text-sm font-display font-bold text-slate-800 tracking-tight">{zone}</span>
 </td>
 <td className="px-8 py-5">
 <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/10 font-small-caps ">{trigger}</span>
 <p className="text-[10px] text-slate-400 mt-2 font-medium italic opacity-60">{time}</p>
 </td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-2 text-amber-600 font-display font-black text-xl tracking-tighter">
 <Zap className="w-5 h-5 fill-current" />
 {multiplier}
 </div>
 </td>
 <td className="px-8 py-5">
 <div className={cn(
 "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
 active ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" : "bg-slate-50 text-slate-400 border border-slate-100/50"
 )}>
 <div className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
 {active ? 'SYNCHRONIZED' : 'DORMANT'}
 </div>
 </td>
 <td className="px-8 py-5">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <MoreVertical className="w-4.5 h-4.5" />
 </button>
 </td>
 </tr>
);

const TriggerItem: React.FC<{ title: string; desc: string; enabled: boolean }> = ({ title, desc, enabled }) => (
 <div className="p-6 rounded-[24px] border border-slate-100 bg-slate-50/30 flex items-start gap-5 hover:bg-white hover:border-primary/10 hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer">
 <div className="flex-1">
 <h5 className="text-sm font-display font-bold text-slate-800 tracking-tight">{title}</h5>
 <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-medium">{desc}</p>
 </div>
 <div className={cn(
 "w-11 h-6 rounded-full relative p-1.5 cursor-pointer transition-all duration-300 shrink-0",
 enabled ? "bg-primary shadow-lg shadow-primary/20" : "bg-slate-200"
 )}>
 <div className={cn(
 "w-3 h-3 bg-white rounded-full absolute transition-all duration-300 ease-out",
 enabled ? "right-1.5" : "left-1.5"
 )} />
 </div>
 </div>
);
