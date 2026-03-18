import React from 'react';
import {
 DollarSign,
 Car,
 Bike,
 Truck,
 MapPin,
 Settings,
 Save,
 Plus,
 ChevronRight,
 Info
} from 'lucide-react';
import { cn } from '../utils';

export const FareSetup: React.FC = () => {
 return (
 <div className="space-y-10">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Fare Intelligence</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Configure pricing engines, base fares, and zone-based rules</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-2xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-3.5 h-3.5" />
 Add Category
 </button>
 </div>

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 {/* Base Fare Section */}
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
 <Settings className="w-5 h-5 text-primary" />
 </div>
 <div>
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Global Pricing Rules</h3>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1">Standardized Metrics</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
 <ConfigInput label="Base Starting Fare" value="2.50" unit="$" />
 <ConfigInput label="Minimum Threshold" value="5.00" unit="$" />
 <ConfigInput label="Standard KM Rate" value="0.80" unit="$" />
 <ConfigInput label="Time Efficiency Rate" value="0.15" unit="$" />
 <ConfigInput label="Default Cancellation" value="3.50" unit="$" />
 <ConfigInput label="Nocturnal Multiplier" value="1.2" unit="x" />
 </div>

 <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
 <button className="flex items-center gap-2.5 px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Save className="w-3.5 h-3.5" />
 Synchronize Rules
 </button>
 </div>
 </div>

 {/* Vehicle Wise Fare */}
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
 <h3 className="text-lg font-display font-extrabold text-slate-800 tracking-tight">Category Optimization</h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Service Tier</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Entry Fare</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Distance Yield</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Time Yield</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Manage</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 <VehicleRow type="Dash Bike" icon={<Bike />} base="1.50" km="0.40" min="0.05" active />
 <VehicleRow type="Dash Sedan" icon={<Car />} base="2.50" km="0.80" min="0.15" active />
 <VehicleRow type="Dash XL" icon={<Truck />} base="4.00" km="1.20" min="0.25" active />
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100/50">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Zone Dynamics</h3>
 <MapPin className="w-5 h-5 text-slate-200" />
 </div>
 <div className="space-y-5">
 <ZoneItem name="Downtown Core" multiplier="1.2x" status="HIGH_DEMAND" />
 <ZoneItem name="Airport Link" multiplier="1.5x" status="PREMIUM_FLOW" />
 <ZoneItem name="Suburban East" multiplier="1.0x" status="STABLE" />
 <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-bold font-small-caps tracking-[0.15em] transition-all flex items-center justify-center gap-2 mt-4">
 Configure All Zones
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden group">
 <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
 <div className="relative z-10">
 <div className="flex gap-4">
 <Info className="w-6 h-6 text-primary shrink-0" />
 <div>
 <h4 className="text-sm font-display font-bold text-white tracking-tight">Surge Sync Active</h4>
 <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-medium">
 Fares defined here represent theoretical base levels. Live surges animate these values based on instantaneous market demand.
 </p>
 <button className="text-[10px] font-bold font-small-caps text-primary mt-5 flex items-center gap-2 hover:gap-3 transition-all">
 Visualize Surge Logic
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

const ConfigInput: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
 <div className="space-y-2">
 <label className="text-[10px] font-bold text-slate-400 font-small-caps ">{label}</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm font-display">{unit}</div>
 <input
 type="text"
 defaultValue={value}
 className="w-full pl-9 pr-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-display font-extrabold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all shadow-inner"
 />
 </div>
 </div>
);

const VehicleRow: React.FC<{ type: string; icon: React.ReactNode; base: string; km: string; min: string; active?: boolean }> = ({ type, icon, base, km, min, active }) => (
 <tr className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-5">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors border border-slate-100">
 <span className="w-5 h-5">{icon}</span>
 </div>
 <span className="text-sm font-display font-bold text-slate-800 tracking-tight">{type}</span>
 </div>
 </td>
 <td className="px-8 py-5 text-sm font-display font-extrabold text-slate-700">${base}</td>
 <td className="px-8 py-5 text-sm font-display font-extrabold text-slate-700">${km}</td>
 <td className="px-8 py-5 text-sm font-display font-extrabold text-slate-700">${min}</td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-2.5">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
 <span className="text-[10px] font-bold font-small-caps text-emerald-600 ">ENABLED</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <ChevronRight className="w-4.5 h-4.5" />
 </button>
 </td>
 </tr>
);

const ZoneItem: React.FC<{ name: string; multiplier: string; status: string }> = ({ name, multiplier, status }) => (
 <div className="flex items-center justify-between p-4.5 rounded-[20px] border border-slate-100 hover:border-primary/30 transition-all cursor-pointer group bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transform hover:-translate-y-1">
 <div>
 <p className="text-sm font-display font-bold text-slate-800 group-hover:text-primary transition-colors tracking-tight">{name}</p>
 <p className="text-[9px] text-slate-400 font-bold font-small-caps tracking-[0.15em] mt-1">{status}</p>
 </div>
 <div className="text-right">
 <p className="text-base font-display font-black text-primary">{multiplier}</p>
 </div>
 </div>
);
