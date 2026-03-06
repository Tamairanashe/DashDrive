import React, { useState } from 'react';
import {
 Users,
 UserCheck,
 UserPlus,
 UserMinus,
 Search,
 RefreshCw,
 Trash2,
 Download,
 Plus,
 Phone,
 Mail,
 Edit,
 Eye,
 MoreVertical,
 CheckCircle2,
 ChevronRight,
 ShieldCheck,
 Zap,
 Star,
 Smartphone,
 Info,
 ArrowUpRight,
 TrendingUp,
 Activity,
 Car,
 Award,
 ShieldAlert,
 Wallet,
 Clock,
 AlertCircle
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

type DriverTab = 'All' | 'Active' | 'On Trip' | 'Offline' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

interface DriverListProps {
 onDriverClick?: (id: string) => void;
}

interface Driver {
 id: string;
 name: string;
 avatar: string;
 phone: string;
 email: string;
 level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
 status: 'Active' | 'On Trip' | 'Offline';
 rating: number;
 acceptanceRate: number;
 cancellationRate: number;
 totalEarnings: number;
 kycStatus: 'Verified' | 'Pending' | 'Rejected';
 vehicleType: string;
}

export const DriverList: React.FC<DriverListProps> = ({ onDriverClick }) => {
 const [activeTab, setActiveTab] = useState<DriverTab>('All');
 const [searchTerm, setSearchTerm] = useState('');

 const stats = [
 { label: 'Total Drivers', value: '12,405', icon: Users, color: 'text-primary' },
 { label: 'Live On-Trip', value: '3,120', icon: Car, color: 'text-emerald-500' },
 { label: 'Active/Available', value: '1,840', icon: UserCheck, color: 'text-blue-500' },
 { label: 'Offline', value: '7,445', icon: UserMinus, color: 'text-slate-400' },
 ];

 const drivers: Driver[] = [
 {
 id: 'D-4001',
 name: 'Alex Rivera',
 avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
 phone: '+1 555-****-101',
 email: 'a****@dashdrive.com',
 level: 'Platinum',
 status: 'On Trip',
 rating: 4.9,
 acceptanceRate: 98,
 cancellationRate: 0.5,
 totalEarnings: 42500,
 kycStatus: 'Verified',
 vehicleType: 'Luxury'
 },
 {
 id: 'D-4002',
 name: 'Sarah Chen',
 avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
 phone: '+1 555-****-102',
 email: 's****@dashdrive.com',
 level: 'Gold',
 status: 'Active',
 rating: 4.8,
 acceptanceRate: 95,
 cancellationRate: 1.2,
 totalEarnings: 28400,
 kycStatus: 'Verified',
 vehicleType: 'Standard'
 },
 {
 id: 'D-4003',
 name: 'Marco Rossi',
 avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
 phone: '+1 555-****-103',
 email: 'm****@dashdrive.com',
 level: 'Silver',
 status: 'Offline',
 rating: 4.7,
 acceptanceRate: 88,
 cancellationRate: 4.5,
 totalEarnings: 12500,
 kycStatus: 'Pending',
 vehicleType: 'Bike'
 },
 {
 id: 'D-4004',
 name: 'Elena Petrova',
 avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
 phone: '+1 555-****-104',
 email: 'e****@dashdrive.com',
 level: 'Gold',
 status: 'Active',
 rating: 4.9,
 acceptanceRate: 99,
 cancellationRate: 0.2,
 totalEarnings: 31200,
 kycStatus: 'Verified',
 vehicleType: 'Standard'
 }
 ];

 const tabs: DriverTab[] = ['All', 'Active', 'On Trip', 'Offline', 'Bronze', 'Silver', 'Gold', 'Platinum'];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Page Header Area */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Fleet Command Center</h2>
 <p className="text-slate-500 text-sm font-medium italic">Advanced driver tracking, performance analytics, and compliance.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4 text-primary" />
 Add Driver
 </button>
 </div>
 </div>

 {/* Fleet Metrics Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {stats.map((stat) => (
 <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-primary/20 transition-all duration-500">
 <div className="flex items-center gap-4 mb-4">
 <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500", stat.color)}>
 <stat.icon className="w-6 h-6" />
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 leading-none">{stat.label}</p>
 <h4 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h4>
 </div>
 </div>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
 <TrendingUp className="w-3 h-3" />
 Live Updates
 </div>
 </div>
 ))}
 </div>

 {/* Filters & Table Container */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 {/* Navigation Tabs */}
 <div className="px-8 pt-8 pb-4 border-b border-slate-50 overflow-x-auto scrollbar-hide">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />
 </div>

 {/* Toolbar */}
 <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="relative group w-full md:w-96">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search Drivers (Name, Phone, ID, Vehicle)..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all font-display shadow-inner"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-[20px] transition-all" title="Refresh">
 <RefreshCw className="w-5 h-5" />
 </button>
 <button className="p-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-[20px] transition-all" title="Verification Alerts">
 <ShieldAlert className="w-5 h-5" />
 </button>
 <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-[20px] text-sm font-black transition-all">
 <Download className="w-4 h-4 text-primary" />
 Export CSV
 </button>
 </div>
 </div>

 {/* Driver Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em] w-16">SL</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Driver Info</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Tier & Rating</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">KPI Metrics</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Earnings</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Compliance</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em] text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {drivers.map((driver, idx) => (
 <tr key={driver.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6 text-sm font-bold text-slate-400">
 {String(idx + 1).padStart(2, '0')}
 </td>
 <td className="px-8 py-6">
 <div
 className="flex items-center gap-4 cursor-pointer"
 onClick={() => onDriverClick?.(driver.id)}
 >
 <div className="relative flex-shrink-0">
 <img src={driver.avatar} alt={driver.name} className="w-14 h-14 rounded-2xl object-cover shadow-md transition-transform group-hover:scale-110" />
 <div className={cn(
 "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
 driver.status === 'On Trip' ? 'bg-emerald-500' :
 driver.status === 'Active' ? 'bg-blue-500' : 'bg-slate-300'
 )} />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{driver.name}</p>
 <div className="flex items-center gap-2 mt-0.5">
 <p className="text-[10px] font-bold text-slate-400 ">ID: {driver.id}</p>
 <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 rounded-md text-slate-500">{driver.vehicleType}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border",
 driver.level === 'Platinum' ? "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm" :
 driver.level === 'Gold' ? "bg-amber-50 text-amber-600 border-amber-100 shadow-sm" :
 "bg-slate-50 text-slate-500 border-slate-100"
 )}>
 <Award className="w-3 h-3" />
 {driver.level}
 </div>
 <div className="flex items-center gap-1">
 <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
 <span className="text-xs font-black text-slate-900">{driver.rating}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2">
 <div className="flex items-center justify-between gap-4">
 <span className="text-[9px] font-bold text-slate-400 ">Acceptance</span>
 <span className="text-[9px] font-black text-emerald-500">{driver.acceptanceRate}%</span>
 </div>
 <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${driver.acceptanceRate}%` }} />
 </div>
 <div className="flex items-center justify-between gap-4">
 <span className="text-[9px] font-bold text-slate-400 ">Cancel Rate</span>
 <span className="text-[9px] font-black text-rose-500">{driver.cancellationRate}%</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-0.5">
 <p className="text-sm font-black text-slate-900">${(driver.totalEarnings / 1000).toFixed(1)}k</p>
 <p className="text-[10px] font-bold text-slate-400 italic">Lifetime</p>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit",
 driver.kycStatus === 'Verified' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
 driver.kycStatus === 'Pending' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-rose-50 border-rose-100 text-rose-600"
 )}>
 {driver.kycStatus === 'Verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
 <span className="text-[10px] font-black ">{driver.kycStatus}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-1">
 <div className={cn(
 "w-3 h-3 rounded-full border-2 border-white shadow-sm mx-auto",
 driver.status === 'On Trip' ? 'bg-emerald-500' :
 driver.status === 'Active' ? 'bg-blue-500' : 'bg-slate-300'
 )} />
 <span className={cn(
 "text-[9px] font-black text-center",
 driver.status === 'On Trip' ? 'text-emerald-500' :
 driver.status === 'Active' ? 'text-blue-500' : 'text-slate-400'
 )}>{driver.status}</span>
 </div>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
 <button className="p-2.5 bg-white text-slate-400 hover:text-blue-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110" title="Call">
 <Phone className="w-4 h-4 fill-current" />
 </button>
 <button className="p-2.5 bg-white text-slate-400 hover:text-primary rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110" title="Edit">
 <Edit className="w-4 h-4" />
 </button>
 <button
 className="p-2.5 bg-white text-slate-900 hover:text-primary rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"
 title="View Full Profile"
 onClick={() => onDriverClick?.(driver.id)}
 >
 <Eye className="w-4 h-4" />
 </button>
 <button className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110" title="Suspend">
 <AlertCircle className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination & Status Footer */}
 <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold text-slate-400 ">Page Size</span>
 <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black">
 <option>15</option>
 <option>50</option>
 <option>100</option>
 </select>
 </div>
 <div className="flex items-center gap-1">
 {[1, 2, 3, '...', 8].map((p, i) => (
 <button key={i} className={cn("w-9 h-9 rounded-xl text-xs font-black transition-all", p === 1 ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900")}>
 {p}
 </button>
 ))}
 </div>
 <p className="text-xs font-bold text-slate-400 italic">
 Snapshot: 12,405 Registered Fleet Units
 </p>
 </div>
 </div>

 {/* Verification & Compliance Awareness Banner */}
 <div className="bg-emerald-500 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
 <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <div className="lg:w-2/3 space-y-4 relative z-10">
 <div className="flex items-center gap-3 mb-2">
 <ShieldCheck className="w-10 h-10 text-emerald-950" />
 <h3 className="text-2xl font-black tracking-tight italic">Compliance &amp; Document Audit</h3>
 </div>
 <p className="text-lg opacity-90 font-medium leading-relaxed max-w-2xl">
 DashDrive Fleet Monitor is currently auditing <strong>240 pending licenses</strong>. Real-time document
 expiration alerts are sent to drivers 30 days prior to expiry to ensure zero service interruption.
 </p>
 </div>
 <div className="lg:w-1/3 flex justify-end gap-3 relative z-10">
 <button className="px-8 py-4 bg-emerald-600 text-white border border-emerald-400/50 rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all">
 Audit Pending
 </button>
 <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-xs shadow-2xl shadow-emerald-900/20 hover:scale-105 transition-all">
 Verification Engine
 </button>
 </div>
 </div>
 </div>
 );
};
