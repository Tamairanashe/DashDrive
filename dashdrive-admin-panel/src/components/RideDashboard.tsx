import React from 'react';
import {
 Car,
 Users,
 TrendingUp,
 Clock,
 Map as MapIcon,
 Activity,
 ArrowUpRight,
 ArrowDownRight,
 ChevronRight,
 MoreVertical
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StatCard } from './StatCard';
import { EarningChart } from './EarningChart';
import { cn } from '../utils';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
 iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
 shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordinate mapping helper
const mapXToLng = (x: number) => 90.4125 + (x - 600) * 0.0001;
const mapYToLat = (y: number) => 23.8103 - (y - 400) * 0.0001;

const demandPoints = [
 { id: 1, lat: mapYToLat(300), lng: mapXToLng(200), radius: 800, intensity: 0.8, label: 'Downtown' },
 { id: 2, lat: mapYToLat(200), lng: mapXToLng(500), radius: 1000, intensity: 0.9, label: 'Airport' },
 { id: 3, lat: mapYToLat(450), lng: mapXToLng(800), radius: 700, intensity: 0.6, label: 'Suburbs' },
 { id: 4, lat: mapYToLat(600), lng: mapXToLng(350), radius: 900, intensity: 0.7, label: 'Business Dist' },
];

export const RideDashboard: React.FC = () => {
 return (
 <div className="space-y-10 pb-8">
 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StatCard
 title="Total Trips Today"
 value="4,284"
 icon={<Car />}
 color="bg-primary"
 trend="+12.5% from yesterday"
 />
 <StatCard
 title="Active Drivers"
 value="842"
 icon={<Users />}
 color="bg-emerald-500"
 trend="+2.4% from last hour"
 />
 <StatCard
 title="Avg ETA"
 value="4.2 min"
 icon={<Clock />}
 color="bg-blue-500"
 trend="-0.5 min improved"
 />
 <StatCard
 title="Ride Revenue"
 value="$24,500"
 icon={<TrendingUp />}
 color="bg-amber-500"
 trend="+8.2% from yesterday"
 />
 </div>

 {/* Main Content Area */}
 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 {/* Left: Map and Demand */}
 <div className="xl:col-span-2 space-y-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-xl font-display font-extrabold text-slate-800 tracking-tight">Live Ride Heat Map</h3>
 <p className="text-sm text-slate-400 font-medium">Real-time demand density across active zones</p>
 </div>
 <div className="flex items-center gap-2">
 <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold font-small-caps whitespace-nowrap">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 Live Updates
 </span>
 <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
 <MoreVertical className="w-4 h-4 text-slate-400" />
 </button>
 </div>
 </div>

 <div className="relative h-[450px] bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100">
 <MapContainer
 center={[23.8103, 90.4125]}
 zoom={13}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 attributionControl={false}
 >
 <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

 {demandPoints.map((p) => (
 <Circle
 key={p.id}
 center={[p.lat, p.lng]}
 radius={p.radius}
 pathOptions={{
 fillColor: p.intensity > 0.8 ? '#ef4444' : p.intensity > 0.6 ? '#f59e0b' : '#3b82f6',
 fillOpacity: 0.3,
 stroke: false
 }}
 />
 ))}

 {/* Interactive Overlay UI when zooming/interacting could go here, but keeping it clean for dashboard view */}
 </MapContainer>

 {/* Floating Legend */}
 <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl border border-white shadow-2xl space-y-3.5 z-[1000]">
 <LegendItem color="bg-red-500" label="Critical Demand" />
 <LegendItem color="bg-orange-500" label="Elevated" />
 <LegendItem color="bg-blue-500" label="Balanced" />
 </div>

 {/* Center Action Overlay - Absolute to Map Container */}
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1001]">
 <div className="text-center px-6 pointer-events-auto bg-white/10 backdrop-blur-[2px] p-8 rounded-[40px]">
 <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-2xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all ">
 Launch Full Analytics Map
 </button>
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h4 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em]">Top Demand Zones</h4>
 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
 <Activity className="w-3.5 h-3.5 text-slate-300" />
 </div>
 </div>
 <div className="space-y-7">
 {[
 { name: 'Downtown Central', growth: '+14%', rides: '1,240' },
 { name: 'Airport International', growth: '+22%', rides: '890' },
 { name: 'University District', growth: '-5%', rides: '640' }
 ].map((zone) => (
 <div key={zone.name} className="flex items-center justify-between group cursor-pointer">
 <div>
 <p className="text-[15px] font-display font-bold text-slate-800 group-hover:text-primary transition-colors tracking-tight">{zone.name}</p>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">Target: 1,500</p>
 </div>
 <div className="text-right">
 <p className="text-[15px] font-display font-extrabold text-slate-900">{zone.rides}</p>
 <p className={cn("text-[10px] font-bold font-small-caps mt-1", zone.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
 {zone.growth}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <h4 className="text-[10px] font-small-caps font-bold text-slate-400 mb-8 tracking-[0.25em]">Service Utilization</h4>
 <div className="space-y-7">
 {[
 { type: 'Dash Sedan', percentage: 65, color: 'bg-primary' },
 { type: 'Dash XL', percentage: 20, color: 'bg-blue-500' },
 { type: 'Dash Bike', percentage: 15, color: 'bg-emerald-500' }
 ].map((item) => (
 <div key={item.type} className="space-y-3">
 <div className="flex justify-between items-end">
 <span className="text-[10px] font-bold text-slate-600 font-small-caps ">{item.type}</span>
 <span className="text-sm font-display font-extrabold text-slate-900">{item.percentage}%</span>
 </div>
 <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden">
 <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)} style={{ width: `${item.percentage}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Right: Activity and Alerts */}
 <div className="space-y-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Supply Health</h3>
 <Activity className="w-5 h-5 text-slate-200" />
 </div>
 <div className="space-y-9">
 <div className="flex items-center gap-5">
 <div className="w-16 h-16 rounded-[24px] bg-emerald-50/50 flex items-center justify-center text-emerald-600 font-display font-black text-2xl shadow-inner border border-emerald-100/30">
 84%
 </div>
 <div>
 <p className="text-base font-display font-bold text-slate-800 tracking-tight">Drivers Online</p>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1">1,240 Total Fleet</p>
 </div>
 </div>

 <div className="space-y-5">
 <StatusRow label="Available" value="842" dotColor="bg-emerald-500" />
 <StatusRow label="Busy" value="612" dotColor="bg-primary" />
 <StatusRow label="Searching" value="230" dotColor="bg-slate-300" />
 </div>

 <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-bold font-small-caps tracking-[0.15em] transition-all flex items-center justify-center gap-2 mt-4">
 Manage Full Fleet
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Core Alerts</h3>
 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
 <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
 </div>
 </div>
 <div className="space-y-4">
 <AlertBox
 type="critical"
 title="High Wait Time"
 desc="Downtown Zone ETA {'>'} 12 mins. Surge adjustment."
 icon={<Clock className="w-4.5 h-4.5 text-white" />}
 />
 <AlertBox
 type="warning"
 title="Driver Shortage"
 desc="Airport supply low. Dispatching more vehicles."
 icon={<Activity className="w-4.5 h-4.5 text-white" />}
 />
 </div>
 </div>

 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-[10px] font-small-caps font-bold text-slate-400 tracking-[0.25em]">Growth Analytics</h3>
 </div>
 <div className="h-[220px]">
 <EarningChart />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
 <div className="flex items-center gap-3">
 <div className={cn("w-2 h-2 rounded-full", color)} />
 <span className="text-[10px] font-bold text-slate-500 font-small-caps ">{label}</span>
 </div>
);

const StatusRow: React.FC<{ label: string; value: string; dotColor: string }> = ({ label, value, dotColor }) => (
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-3">
 <div className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
 <span className="text-[10px] font-bold text-slate-500 font-small-caps tracking-[0.15em]">{label}</span>
 </div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{value}</span>
 </div>
);

interface AlertBoxProps {
 type: 'critical' | 'warning';
 title: string;
 desc: string;
 icon: React.ReactNode;
}

const AlertBox: React.FC<AlertBoxProps> = ({ type, title, desc, icon }) => (
 <div className={cn(
 "p-6 rounded-[24px] border transition-all hover:scale-[1.02] cursor-pointer",
 type === 'critical' ? "bg-red-50/40 border-red-100/50" : "bg-amber-50/40 border-amber-100/50"
 )}>
 <div className="flex gap-4.5">
 <div className={cn(
 "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
 type === 'critical' ? "bg-red-500 shadow-red-500/10" : "bg-amber-500 shadow-amber-500/10"
 )}>
 {icon}
 </div>
 <div>
 <h5 className={cn("text-sm font-display font-bold tracking-tight", type === 'critical' ? "text-red-950" : "text-amber-950")}>{title}</h5>
 <p className={cn("text-[11px] font-medium leading-relaxed mt-1.5 opacity-70", type === 'critical' ? "text-red-900" : "text-amber-900")}>{desc}</p>
 </div>
 </div>
 </div>
);
