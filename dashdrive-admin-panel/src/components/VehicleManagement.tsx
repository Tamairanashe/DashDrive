import React, { useState } from 'react';
import {
 Car,
 Layers,
 List,
 Dna,
 PlusSquare,
 Search,
 Filter,
 ChevronRight,
 ShieldCheck,
 AlertCircle,
 Activity,
 ChevronDown,
 MoreVertical,
 CheckCircle2,
 Settings2,
 FileText,
 Clock,
 LayoutGrid,
 Zap,
 Tag
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

export const VehicleManagement: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Vehicles');

 const vehicles = [
 { id: 'VH-1025', model: 'Toyota Camry 2022', owner: 'Devid Jack', plate: 'BG 1234 XY', type: 'Hybrid', status: 'Active', verification: 'Verified' },
 { id: 'VH-1026', model: 'Honda Civic 2023', owner: 'Sarah Smith', plate: 'BG 5678 AB', type: 'Sedan', status: 'Active', verification: 'Verified' },
 { id: 'VH-1027', model: 'Tesla Model 3', owner: 'James Brown', plate: 'EV 9012 XP', type: 'Electric', status: 'Under Review', verification: 'Pending' },
 { id: 'VH-1028', model: 'Toyota Prius', owner: 'Alex Wong', plate: 'BG 3456 CD', type: 'Hybrid', status: 'Inactive', verification: 'Rejected' },
 ];

 const renderVehicles = () => (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'Total Fleet', value: '1,450', trend: '+24', icon: Car, color: 'text-[#0089D1]', bg: 'bg-[#0089D1]/5' },
 { label: 'Electric Vehicles', value: '185', trend: '12%', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
 { label: 'Pending Audit', value: '12', trend: '-2', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
 { label: 'Avg Fleet Age', value: '3.2 yrs', trend: 'Stable', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' }
 ].map((stat, i) => (
 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
 <div className="flex items-center justify-between mb-6">
 <div className={cn("p-4 rounded-2xl transition-colors duration-500", stat.bg)}>
 <stat.icon className={cn("w-6 h-6", stat.color)} />
 </div>
 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl ">{stat.trend}</span>
 </div>
 <p className="text-[10px] font-bold text-slate-400 mb-1">{stat.label}</p>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
 </div>
 ))}
 </div>

 <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
 <div>
 <h3 className="text-xl font-black text-slate-900 tracking-tight">Fleet Registry</h3>
 <p className="text-xs font-medium text-slate-400 mt-2">Manage and verify vehicles operating on the network.</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -track-y-1/2 w-4 h-4 text-slate-400" />
 <input type="text" className="w-64 pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-[11px] font-bold outline-none" placeholder="Search by plate or ID..." />
 </div>
 <button className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 border border-slate-100 transition-all"><Filter className="w-4 h-4" /></button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-slate-50">
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Vehicle Info</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Owner / Partner</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Type</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Verification</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4">Status</th>
 <th className="pb-6 text-[10px] font-black text-slate-300 tracking-[0.2em] px-4"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {vehicles.map((vh, i) => (
 <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="py-6 px-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
 <Car className="w-6 h-6 text-slate-400" />
 </div>
 <div>
 <p className="text-xs font-black text-slate-900">{vh.model}</p>
 <p className="text-[10px] font-bold text-[#0089D1] mt-1">{vh.plate}</p>
 </div>
 </div>
 </td>
 <td className="py-6 px-4">
 <span className="text-xs font-bold text-slate-700">{vh.owner}</span>
 </td>
 <td className="py-6 px-4">
 <div className="px-3 py-1 bg-slate-100 rounded-full inline-block">
 <span className="text-[9px] font-black text-slate-500 ">{vh.type}</span>
 </div>
 </td>
 <td className="py-6 px-4">
 <div className={cn(
 "flex items-center gap-1.5",
 vh.verification === 'Verified' ? "text-emerald-500" :
 vh.verification === 'Pending' ? "text-amber-500" : "text-rose-500"
 )}>
 {vh.verification === 'Verified' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
 <span className="text-[10px] font-black ">{vh.verification}</span>
 </div>
 </td>
 <td className="py-6 px-4">
 <div className={cn(
 "w-2 h-2 rounded-full",
 vh.status === 'Active' ? "bg-emerald-500" :
 vh.status === 'Under Review' ? "bg-amber-500" : "bg-slate-300"
 )} />
 </td>
 <td className="py-6 px-4 text-right">
 <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );

 const renderAttributes = () => (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {[
 { title: 'Vehicle Types', count: '8 Defined', icon: Tag, items: ['Economy', 'Premium', 'Electric', 'VIP Limo', 'Delivery Bike', 'Van'] },
 { title: 'Fuel Types', count: '4 Options', icon: Dna, items: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
 { title: 'Verification Rules', count: '12 Active', icon: ShieldCheck, items: ['Insurance Valid', 'License Plate Match', 'Fitness Certificate', 'Photo of 4 Sides'] }
 ].map((cat, i) => (
 <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8 group hover:border-[#0089D1]/30 transition-all duration-500">
 <div className="flex items-center justify-between">
 <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-[#0089D1] transition-colors">
 <cat.icon className="w-6 h-6" />
 </div>
 <span className="text-[10px] font-black text-slate-300 ">{cat.count}</span>
 </div>
 <div>
 <h3 className="text-xl font-black text-slate-900 mb-6">{cat.title}</h3>
 <div className="flex flex-wrap gap-2">
 {cat.items.map((item, j) => (
 <div key={j} className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 group/item hover:bg-white hover:shadow-sm transition-all duration-300">
 <span className="text-[11px] font-bold text-slate-600">{item}</span>
 <ChevronRight className="w-3 h-3 text-slate-200 group-hover/item:text-[#0089D1] transition-colors" />
 </div>
 ))}
 </div>
 </div>
 <button className="w-full py-4 text-[#0089D1] text-[10px] font-black hover:bg-[#0089D1]/5 rounded-2xl transition-all border border-[#0089D1]/10">Configure {cat.title}</button>
 </div>
 ))}
 </div>
 );

 return (
 <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Management</span>
 <ChevronRight className="w-3 h-3 text-slate-300" />
 <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em]">Fleet</span>
 </div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Vehicle Mgmt</h1>
 <p className="text-sm font-medium text-slate-400 mt-4 max-w-md">Vehicle inventory, attributes, and compliance tracking.</p>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={['Vehicles', 'Attributes', 'Requests', 'Settings'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20">
 <PlusSquare className="w-5 h-5" /> Add New Vehicle
 </button>
 </div>

 {activeTab === 'Vehicles' && renderVehicles()}
 {activeTab === 'Attributes' && renderAttributes()}
 {(activeTab === 'Requests' || activeTab === 'Settings') && (
 <div className="h-[60vh] bg-white rounded-[60px] border border-slate-100 flex flex-col items-center justify-center text-slate-300">
 <LayoutGrid className="w-20 h-20 mb-6 opacity-20" />
 <h2 className="text-xl font-bold">{activeTab} Section</h2>
 <p className="text-sm font-medium">Standardizing {activeTab.toLowerCase()} flows for compliance.</p>
 </div>
 )}
 </div>
 );
};
