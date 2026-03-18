import React, { useState } from 'react';
import {
 MapPin,
 Plus,
 Search,
 Filter,
 Layers,
 Maximize2,
 Activity,
 Bike,
 Clock,
 DollarSign,
 MoreVertical,
 ChevronDown,
 Trash2,
 CheckCircle2,
 XCircle,
 Info,
 RefreshCw,
 Download
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../utils';

interface DeliveryZone {
 id: string;
 name: string;
 coverage: string;
 riders: number;
 avgDeliveryTime: string;
 status: 'Active' | 'Inactive';
 extraFee: string;
 points: [number, number][];
}

const mockZones: DeliveryZone[] = [
 {
 id: 'ZONE-1',
 name: 'Downtown Core',
 coverage: '4.2 sq km',
 riders: 24,
 avgDeliveryTime: '22 min',
 status: 'Active',
 extraFee: '$0.00',
 points: [[23.7516, 90.3704], [23.7556, 90.3804], [23.7456, 90.3854], [23.7406, 90.3754]]
 },
 {
 id: 'ZONE-2',
 name: 'Airport Perimeter',
 coverage: '8.5 sq km',
 riders: 12,
 avgDeliveryTime: '35 min',
 status: 'Active',
 extraFee: '$4.50',
 points: [[23.7925, 90.4078], [23.7985, 90.4178], [23.7885, 90.4228], [23.7825, 90.4128]]
 }
];

export const FoodDeliveryZones: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Overview');

 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Geospatial Control</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage food delivery boundaries and zone-based pricing</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Maximize2 className="w-4 h-4" />
 Full Map
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Create Delivery Zone
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Map Section */}
 <div className="lg:col-span-8 space-y-8">
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
 <MapPin className="w-5 h-5 text-primary" />
 </div>
 <div>
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Zone Visualization</h3>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">Active Polygonal Boundaries</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/50 text-slate-400">
 <Layers className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/50 text-slate-400">
 <RefreshCw className="w-4.5 h-4.5" />
 </button>
 </div>
 </div>

 <div className="h-[500px] bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 relative group">
 <MapContainer
 center={[23.8103, 90.4125]}
 zoom={12}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 attributionControl={false}
 >
 <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
 {mockZones.map((zone) => (
 <Polygon
 key={zone.id}
 positions={zone.points}
 pathOptions={{
 fillColor: '#00A89D',
 fillOpacity: 0.2,
 color: '#00A89D',
 weight: 2,
 dashArray: '5, 10'
 }}
 />
 ))}
 </MapContainer>

 {/* Floating Stats */}
 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center gap-8">
 <div className="flex items-center gap-3">
 <Bike className="w-4 h-4 text-primary" />
 <div>
 <p className="text-[14px] font-display font-black text-white leading-none">842</p>
 <p className="text-[8px] font-bold text-slate-500 mt-1">Live Riders</p>
 </div>
 </div>
 <div className="w-px h-8 bg-white/10" />
 <div className="flex items-center gap-3">
 <Activity className="w-4 h-4 text-emerald-500" />
 <div>
 <p className="text-[14px] font-display font-black text-white leading-none">92%</p>
 <p className="text-[8px] font-bold text-slate-500 mt-1">Health</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Zone Identity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Fleet Static</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Performance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Pricing</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockZones.map((zone) => (
 <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-primary" />
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{zone.name}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">{zone.coverage}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <Bike className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-sm font-bold text-slate-700">{zone.riders}</span>
 <span className="text-[10px] text-slate-400 font-bold font-small-caps ml-1 ">Riders</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <Clock className="w-3.5 h-3.5 text-emerald-500" />
 <span className="text-sm font-bold text-slate-800">{zone.avgDeliveryTime}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "w-fit px-2.5 py-1 rounded-xl text-[10px] font-black tracking-tighter ",
 zone.extraFee === '$0.00' ? "text-slate-400 bg-slate-50" : "text-amber-600 bg-amber-50"
 )}>
 Extra: {zone.extraFee}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <Search className="w-4.5 h-4.5" />
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
 </div>

 {/* Info Section */}
 <div className="lg:col-span-4 space-y-8">
 <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50">
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight mb-8">Zone Performance</h3>
 <div className="space-y-8">
 {[
 { label: 'Downtown Delivery Velocity', value: 88, color: 'bg-primary' },
 { label: 'Airport Resource Density', value: 42, color: 'bg-blue-500' },
 { label: 'Suburban Growth Factor', value: 65, color: 'bg-emerald-500' }
 ].map((stat) => (
 <div key={stat.label} className="space-y-3">
 <div className="flex justify-between items-end">
 <span className="text-[10px] font-bold text-slate-400 font-small-caps ">{stat.label}</span>
 <span className="text-sm font-display font-black text-slate-800">{stat.value}%</span>
 </div>
 <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
 <div className={cn("h-full rounded-full", stat.color)} style={{ width: `${stat.value}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10">
 <div className="flex gap-4">
 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
 <Info className="w-5 h-5 text-white" />
 </div>
 <div>
 <h4 className="text-sm font-display font-bold text-primary tracking-tight">Geospatial Intelligence</h4>
 <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">
 Zones are automatically optimized twice daily based on delivery frequency and rider availability clusters.
 </p>
 <button className="mt-6 flex items-center gap-2 text-[10px] font-bold font-small-caps text-primary hover:gap-3 transition-all">
 Run Optimization <ChevronDown className="w-3 h-3 -rotate-90" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
