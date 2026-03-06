import React, { useState, useEffect } from 'react';
import {
 Store,
 User,
 MapPin,
 Star,
 DollarSign,
 Activity,
 Plus,
 Filter,
 Download,
 Eye,
 CheckCircle2,
 XCircle,
 MoreVertical,
 ChevronRight,
 Search,
 Clock,
 Percent,
 AlertCircle
} from 'lucide-react';
import { MapPreview } from './MapPreview';
import { cn } from '../utils';

import { adminApi } from '../api/adminApi';
import { Tabs } from 'antd';

interface Restaurant {
 id: string;
 name: string;
 owner: string;
 location: string;
 zone: string;
 status: 'Active' | 'Inactive' | 'Suspended';
 approvalStatus: 'Approved' | 'Pending' | 'Rejected';
 rating: number;
 totalOrders: number;
 earnings: string;
 commission: number;
 logo: string;
 coordinates: [number, number];
}

const mockRestaurants: Restaurant[] = [
 {
 id: 'RES-101',
 name: 'Burger King',
 owner: 'Robert Fox',
 location: '123 Main St, Downtown',
 zone: 'Downtown',
 status: 'Active',
 approvalStatus: 'Approved',
 rating: 4.8,
 totalOrders: 1240,
 earnings: '$12,450',
 commission: 15,
 logo: 'https://logo.clearbit.com/burgerking.com',
 coordinates: [23.7516, 90.3804]
 }
];

const KPICard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 group hover:border-primary/20 transition-all duration-300">
 <div className="flex items-start justify-between">
 <div>
 <p className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] mb-2 ">{title}</p>
 <p className="text-2xl font-display font-black text-slate-800 tracking-tight">{value}</p>
 </div>
 <div className={cn(
 "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
 color === 'primary' ? "bg-primary/10 text-primary shadow-primary/5" :
 color === 'amber' ? "bg-amber-50 text-amber-500 shadow-amber-500/5" :
 color === 'emerald' ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/5" :
 "bg-rose-50 text-rose-500 shadow-rose-500/5"
 )}>
 {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
 </div>
 </div>
 </div>
);

export const RestaurantManagement: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All');
 const [searchQuery, setSearchQuery] = useState('');
 const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 const tabs = ['All', 'Pending Approval', 'Active', 'Suspended', 'Requests'];

 useEffect(() => {
 fetchRestaurants();
 }, [activeTab]);

 const fetchRestaurants = async () => {
 setIsLoading(true);
 try {
 const statusMap: any = {
 'Pending Approval': 'PENDING',
 'Active': 'Active',
 'Suspended': 'Suspended'
 };
 const status = statusMap[activeTab];
 const response = await adminApi.stores.list({ status, type: 'FOOD' });

 const apiRes = response.data.data || [];
 const mappedRes = apiRes.map((r: any) => ({
 id: r.id,
 name: r.name,
 owner: r.owner_name || 'New Merchant',
 location: r.address || 'Location Pending',
 zone: r.regions?.name || 'Unassigned',
 status: r.is_active ? 'Active' : 'Inactive',
 approvalStatus: r.status === 'PENDING' ? 'Pending' : (r.is_active ? 'Approved' : 'Rejected'),
 rating: 0,
 totalOrders: 0,
 earnings: '$0',
 commission: 15,
 logo: r.logo_url || 'https://via.placeholder.com/150',
 coordinates: [23.7516, 90.3804]
 }));

 setRestaurants(mappedRes.length > 0 ? mappedRes : mockRestaurants);
 } catch (error) {
 console.error('Failed to fetch restaurants:', error);
 setRestaurants(mockRestaurants);
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Vendor Management</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Onboard, approve, and manage restaurant partners</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Download className="w-4 h-4" />
 Export Registry
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Restaurant
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <KPICard title="Total Partners" value="1,240" icon={<Store />} color="primary" />
 <KPICard title="Pending Approval" value="18" icon={<Clock />} color="amber" />
 <KPICard title="Avg Commission" value="14.2%" icon={<Percent />} color="emerald" />
 <KPICard title="Churn Rate" value="1.2%" icon={<Activity />} color="rose" />
 </div>

 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search restaurants, owners, or IDs..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 </div>

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Restaurant Name</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Geo & Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Performance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Economics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Approval</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {isLoading ? (
 <tr>
 <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Loading restaurants...</td>
 </tr>
 ) : restaurants.map((res) => (
 <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <MapPreview
 type="point"
 data={res.coordinates}
 label={res.name}
 status={res.status}
 />
 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
 <img src={res.logo} alt="" className="w-8 h-8 object-contain" />
 </div>
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{res.name}</span>
 <div className="flex items-center gap-1.5 mt-1">
 <User className="w-3 h-3 text-slate-300" />
 <p className="text-[10px] text-slate-400 font-bold font-small-caps ">{res.owner}</p>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <MapPin className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-xs font-bold text-slate-700">{res.zone}</span>
 </div>
 <div className={cn(
 "w-fit px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tighter",
 res.status === 'Active' ? "bg-emerald-50 text-emerald-600" :
 res.status === 'Inactive' ? "bg-slate-50 text-slate-400" : "bg-red-50 text-red-600"
 )}>
 {res.status}
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-1.5">
 <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
 <span className="text-sm font-bold text-slate-800">{res.rating}</span>
 </div>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps">{res.totalOrders} total orders</p>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <p className="text-sm font-display font-extrabold text-slate-900">{res.earnings}</p>
 <p className="text-[10px] text-emerald-500 font-bold font-small-caps ">{res.commission}% commission</p>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black ",
 res.approvalStatus === 'Approved' ? "bg-emerald-100/50 text-emerald-700" :
 res.approvalStatus === 'Pending' ? "bg-amber-100/50 text-amber-700" : "bg-red-100/50 text-red-700"
 )}>
 {res.approvalStatus === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> :
 res.approvalStatus === 'Pending' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
 {res.approvalStatus}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary" title="Edit Profile">
 <Eye className="w-4.5 h-4.5" />
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
 );
};
