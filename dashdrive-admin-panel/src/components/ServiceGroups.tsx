import React, { useState } from 'react';
import {
 Layers,
 RotateCcw,
 Save,
 Plus,
 Search,
 Edit3,
 Trash2,
 Eye,
 EyeOff,
 CheckCircle2,
 XCircle,
 ChevronDown,
 MoreVertical,
 Car,
 Truck,
 Package,
 ShoppingBag,
 Utensils,
 Clock,
 Smartphone,
 Info,
 ArrowRight,
 Hotel,
 Calendar,
 Key
} from 'lucide-react';
import { cn } from '../utils';

interface ServiceGroup {
 id: string;
 name: string;
 description: string;
 icon: any;
 status: 'Active' | 'Inactive';
 servicesCount: number;
 color: string;
}

export const ServiceGroups: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [groups, setGroups] = useState<ServiceGroup[]>([
 {
 id: '1',
 name: 'Ride Hailing',
 description: 'Standard and premium transport services including bikes and cars.',
 icon: Car,
 status: 'Active',
 servicesCount: 6,
 color: 'blue'
 },
 {
 id: '2',
 name: 'Food Delivery',
 description: 'Restaurant and meal delivery services from local vendors.',
 icon: Utensils,
 status: 'Active',
 servicesCount: 4,
 color: 'rose'
 },
 {
 id: '3',
 name: 'Mart Delivery',
 description: 'Grocery, medicine, and supermarket doorstep delivery.',
 icon: ShoppingBag,
 status: 'Active',
 servicesCount: 3,
 color: 'emerald'
 },
 {
 id: '4',
 name: 'Parcel Courier',
 description: 'Item and document delivery with real-time tracking.',
 icon: Package,
 status: 'Active',
 servicesCount: 5,
 color: 'amber'
 },
 {
 id: '5',
 name: 'On-Demand Rental',
 description: 'Hourly and daily vehicle rental services.',
 icon: Clock,
 status: 'Inactive',
 servicesCount: 2,
 color: 'slate'
 },
 {
 id: '6',
 name: 'Hotels',
 description: 'Luxury and budget hotel bookings with instant confirmation.',
 icon: Hotel,
 status: 'Active',
 servicesCount: 12,
 color: 'violet'
 },
 {
 id: '7',
 name: 'Events Booking',
 description: 'Tickets for concerts, movies, and local entertainment events.',
 icon: Calendar,
 status: 'Active',
 servicesCount: 8,
 color: 'fuchsia'
 },
 {
 id: '8',
 name: 'Car Rental',
 description: 'Self-drive and chauffeur-driven car rental services.',
 icon: Key,
 status: 'Active',
 servicesCount: 4,
 color: 'cyan'
 }
 ]);

 const renderHeader = () => (
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 mt-4">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg">
 <Layers className="w-6 h-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Configuration</span>
 <div className="w-1 h-1 rounded-full bg-slate-200" />
 <span className="text-[10px] font-black text-[#0089D1] tracking-[0.2em]">Service Architecture</span>
 </div>
 <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mt-1">Service Groups</h1>
 </div>
 </div>
 <p className="text-base font-medium text-slate-500 max-w-lg leading-relaxed">
 Categorize and manage platform services into logical groups to control pricing, logic, and availability.
 </p>
 </div>

 <div className="flex items-center gap-4">
 <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-xs font-black hover:bg-slate-50 hover:text-slate-600 transition-all">
 <RotateCcw className="w-5 h-5" /> Reset
 </button>
 <button className="flex items-center gap-3 px-10 py-4 bg-[#0089D1] text-white rounded-[24px] text-xs font-black hover:bg-[#007AB8] transition-all shadow-xl shadow-[#0089D1]/20 font-display">
 <Save className="w-5 h-5" /> Persist Changes
 </button>
 </div>
 </div>
 );

 const renderActionsBar = () => (
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0089D1] transition-colors" />
 <input
 type="text"
 placeholder="Search service groups..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-600 outline-none shadow-sm hover:border-slate-200 focus:border-[#0089D1] focus:ring-4 focus:ring-[#0089D1]/5 transition-all"
 />
 </div>

 <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
 <Plus className="w-5 h-5" /> Add New Group
 </button>
 </div>
 );

 const toggleStatus = (id: string) => {
 setGroups(groups.map(g =>
 g.id === id ? { ...g, status: g.status === 'Active' ? 'Inactive' : 'Active' } : g
 ));
 };

 return (
 <div className="max-w-[1700px] mx-auto space-y-12 pb-20 px-4">
 {renderHeader()}
 {renderActionsBar()}

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
 {groups.map((group) => (
 <div key={group.id} className="bg-white p-10 rounded-[60px] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
 {/* Decorative Background Icon */}
 <div className="absolute -right-8 -top-8 w-48 h-48 text-slate-50/50 group-hover:text-blue-50/50 transition-colors pointer-events-none transform rotate-12">
 <group.icon className="w-full h-full" />
 </div>

 <div className="flex items-start justify-between relative z-10">
 <div className="flex items-center gap-6">
 <div className={cn(
 "p-6 rounded-[32px] shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500",
 group.color === 'blue' ? "bg-blue-50 text-blue-500" :
 group.color === 'rose' ? "bg-rose-50 text-rose-500" :
 group.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
 group.color === 'amber' ? "bg-amber-50 text-amber-500" :
 group.color === 'violet' ? "bg-violet-50 text-violet-500" :
 group.color === 'fuchsia' ? "bg-fuchsia-50 text-fuchsia-500" :
 group.color === 'cyan' ? "bg-cyan-50 text-cyan-500" :
 "bg-slate-100 text-slate-500"
 )}>
 <group.icon className="w-8 h-8" />
 </div>
 <div>
 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{group.name}</h3>
 <div className="flex items-center gap-2 mt-1">
 <CheckCircle2 className={cn("w-3 h-3", group.status === 'Active' ? "text-emerald-500" : "text-slate-300")} />
 <span className={cn(
 "text-[10px] font-black ",
 group.status === 'Active' ? "text-emerald-500" : "text-slate-400"
 )}>
 {group.status}
 </span>
 </div>
 </div>
 </div>
 <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
 <MoreVertical className="w-5 h-5 text-slate-400" />
 </button>
 </div>

 <p className="text-sm font-medium text-slate-500 leading-relaxed min-h-[48px] relative z-10">
 {group.description}
 </p>

 <div className="p-6 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between relative z-10">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-[#0089D1] transition-colors">
 <Layers className="w-4 h-4" />
 </div>
 <span className="text-xs font-black text-slate-900 ">{group.servicesCount} Services</span>
 </div>
 <button className="flex items-center gap-2 text-[10px] font-black text-[#0089D1] tracking-[0.2em] hover:translate-x-1 transition-transform">
 Manage <ArrowRight className="w-3 h-3" />
 </button>
 </div>

 <div className="flex items-center gap-4 relative z-10">
 <button className="flex-1 py-4 bg-slate-900 text-white rounded-[28px] text-[10px] font-black shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] active:translate-y-0 transition-all">
 Edit Group
 </button>
 <button
 onClick={() => toggleStatus(group.id)}
 className={cn(
 "flex items-center gap-3 px-6 py-4 rounded-[28px] text-[10px] font-black border transition-all",
 group.status === 'Active'
 ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white"
 : "bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-500 hover:text-white"
 )}
 >
 {group.status === 'Active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 {group.status === 'Active' ? 'Disable' : 'Enable'}
 </button>
 </div>
 </div>
 ))}

 {/* Add New Group Placeholder */}
 <button className="flex flex-col items-center justify-center p-12 rounded-[60px] border-4 border-dashed border-slate-100 text-slate-300 hover:border-blue-100 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-500 group">
 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all">
 <Plus className="w-10 h-10" />
 </div>
 <span className="text-lg font-black tracking-[0.2em]">Create New Group</span>
 <p className="text-xs font-medium text-slate-400 mt-2 max-w-[200px] text-center">Add a custom category for your platform services.</p>
 </button>
 </div>

 <div className="max-w-4xl mx-auto p-10 bg-slate-900 rounded-[60px] text-white shadow-2xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -mr-40 -mt-40" />
 <div className="relative z-10 space-y-6 flex flex-col md:flex-row items-center gap-10">
 <div className="p-8 bg-white/10 rounded-[40px] border border-white/10 shrink-0">
 <Info className="w-12 h-12 text-blue-400" />
 </div>
 <div>
 <h4 className="text-2xl font-black italic tracking-tight ">Service Group Logic</h4>
 <p className="text-sm font-medium text-white/60 leading-relaxed mt-4">
 Service groups act as the master categorization layer. Disabling a group will hide all linked services (e.g., Car, Bike) from the user application instantly.
 Always ensure at least one service group is active to maintain platform operations.
 </p>
 <div className="flex gap-4 mt-8">
 <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black hover:scale-[1.05] transition-transform">Documentation</button>
 <button className="px-8 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black border border-white/20 hover:bg-white/20 transition-all">Setup Guide</button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
