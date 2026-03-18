import React, { useState } from 'react';
import {
 Users,
 UserPlus,
 UserCheck,
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
 Filter,
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
 User as UserIcon,
 Car,
 Utensils,
 ShoppingBag,
 Box
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

type CustomerTab = 'All' | 'New User' | 'Level 1' | 'Level 2' | 'Loyal User' | 'DashPlus Customer';

interface CustomerListProps {
 onCustomerClick?: (id: string) => void;
}

interface Customer {
 id: string;
 name: string;
 avatar: string;
 profileStatus: number;
 phone: string;
 email: string;
 level: string;
 totalTrips: number;
 status: 'Active' | 'Inactive';
 serviceUsage: ('Ride' | 'Food' | 'Mart' | 'Parcel')[];
}

export const CustomerList: React.FC<CustomerListProps> = ({ onCustomerClick }) => {
 const [activeTab, setActiveTab] = useState<CustomerTab>('All');
 const [searchTerm, setSearchTerm] = useState('');

 const stats = [
 { label: 'Total Customer', value: '124,502', icon: Users, color: 'text-primary' },
 { label: 'Active Customer', value: '42,120', icon: UserCheck, color: 'text-emerald-500' },
 { label: 'New Customer', value: '1,240', icon: UserPlus, color: 'text-blue-500' },
 { label: 'In-Active Customer', value: '8,405', icon: UserMinus, color: 'text-rose-500' },
 ];

 const customers: Customer[] = [
 {
 id: 'C-8001',
 name: 'Sarah Jenkins',
 avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
 profileStatus: 95,
 phone: '+1 555-****-901',
 email: 's****@gmail.com',
 level: 'DashPlus Customer',
 totalTrips: 154,
 status: 'Active',
 serviceUsage: ['Ride', 'Food', 'Mart', 'Parcel']
 },
 {
 id: 'C-8002',
 name: 'Michael Chen',
 avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
 profileStatus: 70,
 phone: '+1 555-****-223',
 email: 'm****@outlook.com',
 level: 'Level 2',
 totalTrips: 42,
 status: 'Active',
 serviceUsage: ['Ride', 'Food']
 },
 {
 id: 'C-8003',
 name: 'Elena Rodriguez',
 avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
 profileStatus: 100,
 phone: '+1 555-****-554',
 email: 'e****@gmail.com',
 level: 'Loyal User',
 totalTrips: 89,
 status: 'Inactive',
 serviceUsage: ['Food', 'Mart', 'Parcel']
 },
 {
 id: 'C-8004',
 name: 'James Wilson',
 avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
 profileStatus: 45,
 phone: '+1 555-****-112',
 email: 'j****@yahoo.com',
 level: 'New User',
 totalTrips: 2,
 status: 'Active',
 serviceUsage: ['Ride']
 }
 ];

 const tabs: CustomerTab[] = ['All', 'New User', 'Level 1', 'Level 2', 'Loyal User', 'DashPlus Customer'];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
 {/* Page Header Area */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Customer Analytics</h2>
 <p className="text-slate-500 text-sm font-medium italic">Unified intelligence across all DashDrive ecosystem services.</p>
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
 <Plus className="w-4 h-4 text-primary" />
 Add Customer
 </button>
 </div>
 </div>

 {/* Analytics Cards */}
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
 +12.5% vs last month
 </div>
 </div>
 ))}
 </div>

 {/* Segmented Filters & Table Container */}
 <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
 {/* Navigation Tabs */}
 <div className="px-8 pt-8 pb-4 border-b border-slate-50">
  <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k as CustomerTab)} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />
 </div>

 {/* Toolbar */}
 <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="relative group w-full md:w-96">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search Here by Customer (Name, Phone, ID)..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[20px] text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all font-display shadow-inner"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-[20px] transition-all border border-transparent hover:border-slate-200" title="Refresh">
 <RefreshCw className="w-5 h-5" />
 </button>
 <button className="p-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-[20px] transition-all border border-transparent hover:border-rose-100" title="Trashed Data">
 <Trash2 className="w-5 h-5" />
 </button>
 <div className="relative">
 <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-[20px] text-sm font-black transition-all border border-transparent hover:border-slate-200">
 <Download className="w-4 h-4 text-primary" />
 Export
 </button>
 </div>
 </div>
 </div>

 {/* Customer Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em] w-16">SL</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Customer Name</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Profile Status</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Contact Info</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Level</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Total Trip / Order</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-black text-slate-400 tracking-[0.2em] text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {customers.map((customer, idx) => (
 <tr key={customer.id} className="group hover:bg-slate-50/50 transition-all duration-300">
 <td className="px-8 py-6 text-sm font-bold text-slate-400">
 {String(idx + 1).padStart(2, '0')}
 </td>
 <td className="px-8 py-6">
 <div
 className="flex items-center gap-4 cursor-pointer"
 onClick={() => onCustomerClick?.(customer.id)}
 >
 <div className="relative flex-shrink-0">
 <img src={customer.avatar} alt={customer.name} className="w-14 h-14 rounded-2xl object-cover shadow-md transition-transform group-hover:scale-110" />
 <div className={cn(
 "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
 customer.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
 )} />
 </div>
 <div>
 <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{customer.name}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-0.5">ID: {customer.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5 w-32">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-black text-slate-900 italic">{customer.profileStatus}%</span>
 </div>
 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div
 className={cn(
 "h-full transition-all duration-1000",
 customer.profileStatus >= 90 ? "bg-emerald-500" :
 customer.profileStatus >= 50 ? "bg-primary" : "bg-amber-500"
 )}
 style={{ width: `${customer.profileStatus}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1 text-slate-500">
 <div className="flex items-center gap-2 group/info">
 <Phone className="w-3 h-3 text-slate-300" />
 <span className="text-xs font-bold font-mono tracking-tighter hover:text-slate-900 transition-colors">{customer.phone}</span>
 </div>
 <div className="flex items-center gap-2 group/info">
 <Mail className="w-3 h-3 text-slate-300" />
 <span className="text-xs font-bold font-mono tracking-tighter hover:text-slate-900 transition-colors ">{customer.email}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border",
 customer.level === 'DashPlus Customer' ? "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100/50" :
 customer.level === 'Loyal User' ? "bg-primary/5 text-primary border-primary/10 shadow-sm shadow-primary/5" :
 "bg-slate-50 text-slate-500 border-slate-100"
 )}>
 {customer.level === 'DashPlus Customer' ? <Zap className="w-3 h-3 fill-rose-500" /> : <Star className="w-3 h-3" />}
 {customer.level}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-1">
 <h4 className="text-lg font-black text-slate-900">{customer.totalTrips}</h4>
 <span className="text-[10px] font-bold text-slate-400 italic ml-1">Total Impact</span>
 </div>
 <div className="flex gap-1.5">
 {customer.serviceUsage.map((service) => {
 const Icon = service === 'Ride' ? Car : service === 'Food' ? Utensils : service === 'Mart' ? ShoppingBag : Box;
 return (
 <div key={service} className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all" title={service}>
 <Icon className="w-3.5 h-3.5" />
 </div>
 );
 })}
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <button
 className={cn(
 "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-transparent focus:ring-primary/20",
 customer.status === 'Active' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200'
 )}
 >
 <span className={cn(
 "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
 customer.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
 )} />
 </button>
 <p className={cn(
 "text-[9px] font-black mt-1.5 ml-1",
 customer.status === 'Active' ? 'text-primary' : 'text-slate-400'
 )}>
 {customer.status}
 </p>
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
 onClick={() => onCustomerClick?.(customer.id)}
 >
 <Eye className="w-4 h-4" />
 </button>
 <button className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110" title="Delete">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination & Empty State (Simulated) */}
 <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <span className="text-xs font-bold text-slate-400 ">Show Rows</span>
 <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black outline-none focus:ring-2 ring-primary/20 transition-all">
 <option>10</option>
 <option>25</option>
 <option>50</option>
 <option>100</option>
 </select>
 </div>
 <div className="flex items-center gap-1">
 <button className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30" disabled>
 <ChevronRight className="w-5 h-5 rotate-180" />
 </button>
 {[1, 2, 3, '...', 12].map((p, i) => (
 <button
 key={i}
 className={cn(
 "w-9 h-9 rounded-xl text-xs font-black transition-all",
 p === 1 ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
 )}
 >
 {p}
 </button>
 ))}
 <button className="p-2 text-slate-400 hover:text-slate-900">
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 <p className="text-xs font-bold text-slate-400 italic">
 Showing 1-10 of 124.5k Customers
 </p>
 </div>
 </div>

 {/* Hidden System Functions Banner (Context Aware) */}
 <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
 <div className="lg:w-2/3 space-y-4 relative z-10">
 <div className="flex items-center gap-3 mb-2">
 <ShieldCheck className="w-10 h-10 text-primary" />
 <h3 className="text-2xl font-black tracking-tight italic">Enterprise Risk &amp; Fraud Matrix</h3>
 </div>
 <p className="text-lg opacity-80 font-medium leading-relaxed max-w-2xl">
 DashDrive Stitch AI is actively monitoring customer behavioral patterns. High-risk profiles (Refund abuse, Chargebacks) are automatically flagged for manual review by the Super Admin.
 </p>
 </div>
 <div className="lg:w-1/3 flex justify-end gap-3 relative z-10">
 <button className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-black text-xs hover:bg-slate-700 transition-all">
 Global Ban Policy
 </button>
 <button className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
 Audit Intelligence
 </button>
 </div>
 </div>
 </div>
 );
};
