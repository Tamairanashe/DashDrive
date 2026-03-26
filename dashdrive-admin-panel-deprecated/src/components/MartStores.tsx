import React, { useState, useEffect } from 'react';
import {
 Search,
 Filter,
 Plus,
 Building,
 Store,
 MapPin,
 Star,
 CheckCircle2,
 XCircle,
 MoreVertical,
 TrendingUp,
 Users,
 Wallet,
 Calendar,
 ArrowUpRight,
 ShoppingBag,
 Clock,
 AlertCircle,
 Eye
} from 'lucide-react';
import { cn } from '../utils';

import { adminApi } from '../api/adminApi';
import { Tabs } from 'antd';

interface MartStore {
 id: string;
 name: string;
 owner: string;
 zone: string;
 status: 'Active' | 'Pending' | 'Suspended';
 totalOrders: string;
 rating: number;
 earnings: string;
 inventoryStatus: 'Up to Date' | 'Low Stock' | 'OOS Alerts';
 commission: string;
 logo: string;
}
const mockMartStores: MartStore[] = [
 {
 id: 'STORE-001',
 name: 'Pick n Pay Hyper',
 owner: 'John Doe',
 zone: 'Harare CBD',
 status: 'Active',
 totalOrders: '1,240',
 rating: 4.8,
 earnings: '$12,450',
 inventoryStatus: 'Up to Date',
 commission: '15%',
 logo: 'https://via.placeholder.com/150'
 },
 {
 id: 'STORE-002',
 name: 'OK Supermarket',
 owner: 'Jane Smith',
 zone: 'Bulawayo Central',
 status: 'Pending',
 totalOrders: '0',
 rating: 0.0,
 earnings: '$0',
 inventoryStatus: 'Low Stock',
 commission: '12%',
 logo: 'https://via.placeholder.com/150'
 }
];

export const MartStores: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All');
 const [searchQuery, setSearchQuery] = useState('');
 const [stores, setStores] = useState<MartStore[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 const tabs = ['All', 'Pending Approval', 'Active', 'Suspended'];

 useEffect(() => {
 fetchStores();
 }, [activeTab]);

 const fetchStores = async () => {
 setIsLoading(true);
 try {
 // Map the tab name to API status if needed
 const statusMap: any = {
 'Pending Approval': 'PENDING',
 'Active': 'Active',
 'Suspended': 'Suspended'
 };
 const status = statusMap[activeTab];
 const response = await adminApi.stores.list({ status });

 // Transform API data to UI model if necessary
 const apiStores = response.data.data || [];
 const mappedStores = apiStores.map((s: any) => ({
 id: s.id,
 name: s.name,
 owner: s.owner_name || 'New Merchant',
 zone: s.regions?.name || 'Unassigned',
 status: s.status === 'PENDING' ? 'Pending' : (s.is_active ? 'Active' : 'Suspended'),
 totalOrders: '0',
 rating: 0.0,
 earnings: '$0',
 inventoryStatus: 'Up to Date',
 commission: '15%',
 logo: s.logo_url || 'https://via.placeholder.com/150'
 }));

 setStores(mappedStores.length > 0 ? mappedStores : mockMartStores); // Fallback to mock if empty
 } catch (error) {
 console.error('Failed to fetch stores:', error);
 setStores(mockMartStores);
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="space-y-8">
 {/* Header & Stats Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Store Management</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Administer grocery partners, approvals, and performance metrics</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-primary text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-5 h-5" />
 Onboard New Store
 </button>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <StoreKPICard title="Total Partners" value="1,240" icon={<Store />} trend="+12 this week" color="primary" />
 <StoreKPICard title="Pending Requests" value="18" icon={<AlertCircle />} trend="Requires action" color="orange" />
 <StoreKPICard title="Active Earnings" value="$1.2M" icon={<Wallet />} trend="+8.4% vs last mo" color="emerald" />
 <StoreKPICard title="Avg Partner Rating" value="4.75" icon={<Star />} trend="Top tier service" color="blue" />
 </div>

 {/* Search & Tabs Bar */}
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by store name, owner, or zone..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-primary/30 outline-none transition-all"
 />
 </div>
 </div>

 {/* Stores List Table */}
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Store Information</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Zone & Performance</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Inventory Health</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Economics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {isLoading ? (
 <tr>
 <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Loading stores...</td>
 </tr>
 ) : stores.map((store) => (
 <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <img src={store.logo} className="w-12 h-12 rounded-2xl border border-slate-100 shadow-sm object-cover" alt="" />
 <div>
 <span className="text-base font-display font-bold text-slate-900 block leading-tight tracking-tight">{store.name}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">Owner: {store.owner}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <MapPin className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-xs font-bold text-slate-700">{store.zone}</span>
 </div>
 <div className="flex items-center gap-2">
 <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
 <span className="text-[11px] font-black text-slate-900">{store.rating}</span>
 <span className="text-[10px] text-slate-400 font-bold">â€¢ {store.totalOrders} Orders</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold font-small-caps border",
 store.inventoryStatus === 'Up to Date' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
 store.inventoryStatus === 'Low Stock' ? "bg-amber-50 text-amber-600 border-amber-100/50" :
 "bg-red-50 text-red-600 border-red-100/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 store.inventoryStatus === 'Up to Date' ? "bg-emerald-500" :
 store.inventoryStatus === 'Low Stock' ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-ping"
 )} />
 {store.inventoryStatus}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1">
 <p className="text-base font-display font-black text-slate-900 tracking-tight">{store.earnings}</p>
 <p className="text-[9px] text-primary font-black ">{store.commission} Comm.</p>
 </div>
 </td>
 <td className="px-8 py-6">
 <span className={cn(
 "px-4 py-1.5 rounded-xl text-[10px] font-bold font-small-caps border",
 store.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
 store.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
 "bg-red-50 text-red-600 border-red-100"
 )}>
 {store.status}
 </span>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <Eye className="w-5 h-5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-emerald-500">
 <TrendingUp className="w-5 h-5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-slate-600">
 <MoreVertical className="w-5 h-5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination Footer */}
 <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
 <p className="text-[11px] text-slate-400 font-bold font-small-caps ">Showing 1-10 of 1,240 stores</p>
 <div className="flex items-center gap-2">
 <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Previous</button>
 <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-all shadow-sm">Next</button>
 </div>
 </div>
 </div>
 </div>
 );
};

interface KPICardProps {
 title: string;
 value: string;
 icon: React.ReactNode;
 trend: string;
 color: 'primary' | 'orange' | 'emerald' | 'blue';
}

const StoreKPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, color }) => (
 <div className="bg-white p-8 rounded-[38px] shadow-soft border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group">
 <div className="flex justify-between items-start mb-6">
 <div className={cn(
 "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
 color === 'primary' ? "bg-primary/10 text-primary shadow-primary/10" :
 color === 'orange' ? "bg-amber-100 text-amber-600 shadow-amber-100/30" :
 color === 'emerald' ? "bg-emerald-100 text-emerald-600 shadow-emerald-100/30" :
 "bg-blue-100 text-blue-600 shadow-blue-100/30"
 )}>
 <span className="w-7 h-7">{icon}</span>
 </div>
 <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-primary transition-colors" />
 </div>
 <div>
 <p className="text-[11px] font-bold text-slate-400 font-small-caps tracking-[0.2em] mb-1.5 ">{title}</p>
 <h3 className="text-3xl font-display font-black text-slate-950 tracking-tight mb-2.5">{value}</h3>
 <p className={cn(
 "inline-flex items-center gap-1.5 text-[10px] font-bold font-small-caps tracking-tighter px-2.5 py-1 rounded-lg",
 color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
 )}>
 {trend}
 </p>
 </div>
 </div>
);
