import React from 'react';
import {
 Search,
 Filter,
 User,
 Car,
 Star,
 Smartphone,
 MapPin,
 ChevronRight,
 MoreVertical,
 ShieldCheck,
 AlertCircle
} from 'lucide-react';
import { cn } from '../utils';

interface Driver {
 id: string;
 name: string;
 vehicle: string;
 status: 'Online' | 'Busy' | 'Offline';
 rating: number;
 trips: number;
 earnings: string;
 zone: string;
 level: string;
}

const mockDrivers: Driver[] = [
 {
 id: 'DRV-1001',
 name: 'Robert Fox',
 vehicle: 'Toyota Camry (Silver)',
 status: 'Online',
 rating: 4.9,
 trips: 1240,
 earnings: '$2,450',
 zone: 'Downtown',
 level: 'Pro'
 },
 {
 id: 'DRV-1002',
 name: 'Jenny Wilson',
 vehicle: 'Honda Civic (Black)',
 status: 'Busy',
 rating: 4.8,
 trips: 890,
 earnings: '$1,820',
 zone: 'Airport',
 level: 'Elite'
 },
 {
 id: 'DRV-1003',
 name: 'Cody Fisher',
 vehicle: 'Ford Explorer (White)',
 status: 'Offline',
 rating: 4.7,
 trips: 450,
 earnings: '$980',
 zone: 'North Springfield',
 level: 'Rookie'
 },
 {
 id: 'DRV-1004',
 name: 'Kathryn Murphy',
 vehicle: 'Tesla Model 3 (Blue)',
 status: 'Online',
 rating: 5.0,
 trips: 2100,
 earnings: '$4,100',
 zone: 'Downtown',
 level: 'Elite'
 }
];

export const RideDrivers: React.FC = () => {
 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Ride Fleet Management</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage and track your ride-hailing driver network</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-2xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 Onboard New Driver
 </button>
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search fleet..."
 className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-72 shadow-sm"
 />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <KPIBox label="Total Fleet" value="1,240" />
 <KPIBox label="Currently Online" value="842" color="bg-emerald-500" />
 <KPIBox label="Active Assignments" value="612" color="bg-primary" />
 <KPIBox label="System Suspended" value="14" color="bg-red-500" />
 </div>

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Pilot Identity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Vehicle & Jurisdiction</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Connectivity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Performance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Yield</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockDrivers.map((driver) => (
 <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="relative">
 <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
 <User className="w-6 h-6 text-slate-300" />
 </div>
 <div className={cn(
 "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm",
 driver.status === 'Online' ? 'bg-emerald-500' :
 driver.status === 'Busy' ? 'bg-primary' : 'bg-slate-300'
 )} />
 </div>
 <div>
 <span className="text-sm font-display font-bold text-slate-800 tracking-tight">{driver.name}</span>
 <div className="flex items-center gap-1.5 mt-1">
 <ShieldCheck className="w-3 h-3 text-primary" />
 <span className="text-[9px] text-slate-400 font-bold font-small-caps ">{driver.level} Pilot</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2.5">
 <Car className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-xs font-semibold text-slate-700">{driver.vehicle}</span>
 </div>
 <div className="flex items-center gap-2 mt-2">
 <MapPin className="w-3 h-3 text-slate-400" />
 <span className="text-[10px] text-slate-400 font-bold font-small-caps ">{driver.zone} Zone</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className={cn(
 "inline-flex items-center px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
 driver.status === 'Online' && "bg-emerald-50 text-emerald-700 border border-emerald-100/50",
 driver.status === 'Busy' && "bg-primary/5 text-primary border border-primary/10",
 driver.status === 'Offline' && "bg-slate-50 text-slate-400 border border-slate-100/50"
 )}>
 {driver.status}
 </span>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-1.5">
 <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shadow-sm" />
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{driver.rating}</span>
 </div>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1.5 ">{driver.trips} Trips Lifecycle</p>
 </td>
 <td className="px-8 py-6">
 <span className="text-sm font-display font-black text-slate-900 tracking-tight">{driver.earnings}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1.5 ">Monthly Yield</p>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all hover:text-primary border border-transparent hover:border-slate-100">
 <Smartphone className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100">
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
 );
};

const KPIBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
 <div className="bg-white p-7 rounded-[28px] border border-slate-100/50 shadow-sm group hover:scale-[1.02] transition-all cursor-pointer">
 <p className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] mb-2">{label}</p>
 <div className="flex items-end justify-between">
 <p className={cn("text-2xl font-display font-black tracking-tight", color && color.startsWith('bg-') ? color.replace('bg-', 'text-') : "text-slate-900")}>{value}</p>
 {color && (
 <div className={cn("w-2 h-2 rounded-full", color)} />
 )}
 </div>
 </div>
);
