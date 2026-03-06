import React, { useState } from 'react';
import {
 Search,
 Filter,
 Download,
 Eye,
 CheckCircle2,
 XCircle,
 User,
 Store,
 Bike,
 Clock,
 DollarSign,
 ChevronDown,
 MapPin,
 Calendar,
 ArrowUpRight,
 Utensils
} from 'lucide-react';
import { MapPreview } from './MapPreview';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface FoodOrder {
 id: string;
 customer: { name: string; avatar: string };
 restaurant: { name: string; logo: string };
 rider: { name: string; avatar: string } | null;
 value: string;
 status: 'New' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
 time: string;
 zone: string;
 eta: string;
 locations: {
 restaurant: [number, number];
 customer: [number, number];
 };
}

const mockOrders: FoodOrder[] = [
 {
 id: 'ORD-8241',
 customer: { name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah' },
 restaurant: { name: 'Burger King', logo: 'https://logo.clearbit.com/burgerking.com' },
 rider: { name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?u=alex' },
 value: '$34.50',
 status: 'Preparing',
 time: '12:45 PM',
 zone: 'Downtown',
 eta: '12 min',
 locations: {
 restaurant: [23.7516, 90.3704],
 customer: [23.7616, 90.3804]
 },
 nearbyRiders: [
 { name: 'James Wilson', coords: [23.7556, 90.3754], active: true },
 { name: 'Elena Petrova', coords: [23.7506, 90.3854], active: false },
 { name: 'Sarah Chen', coords: [23.7486, 90.3724], active: true }
 ]
 },
 {
 id: 'ORD-8242',
 customer: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
 restaurant: { name: "Sultan's Dine", logo: 'https://logo.clearbit.com/sultansdine.com' },
 rider: { name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=james' },
 value: '$124.00',
 status: 'Out for Delivery',
 time: '12:40 PM',
 zone: 'Airport',
 eta: '5 min',
 locations: {
 restaurant: [23.7925, 90.4078],
 customer: [23.8125, 90.4278]
 },
 nearbyRiders: [
 { name: 'Alex Rivera', coords: [23.7955, 90.4128], active: false },
 { name: 'Marco Rossi', coords: [23.8055, 90.4328], active: false },
 { name: 'Yuki Tanaka', coords: [23.8155, 90.4178], active: false }
 ]
 },
 {
 id: 'ORD-8243',
 customer: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=emma' },
 restaurant: { name: 'Pizza Hut', logo: 'https://logo.clearbit.com/pizzahut.com' },
 rider: null,
 value: '$45.20',
 status: 'New',
 time: '12:58 PM',
 zone: 'Suburbs',
 eta: '--',
 locations: {
 restaurant: [23.8759, 90.3795],
 customer: [23.8959, 90.3995]
 },
 nearbyRiders: []
 }
];

export const FoodOrders: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Orders');

 const tabs = [
 'All Orders', 'New', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
 ];

 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Order Management</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Real-time control over food logistics and vendor fulfillment</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Download className="w-4 h-4" />
 Export Log
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Filter className="w-4 h-4" />
 Advanced Filter
 </button>
 </div>
 </div>

 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Order Detail</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Restaurants</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Assignment</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Logistics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockOrders.map((order) => (
 <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <MapPreview
 type="order-route"
 data={{
 ...order.locations,
 nearbyRiders: order.nearbyRiders,
 restaurantName: order.restaurant.name,
 customerName: order.customer.name
 }}
 label={`Order ${order.id}`}
 />
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{order.id}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">{order.customer.name}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <img src={order.restaurant.logo} className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm" alt="" />
 <span className="text-sm font-display font-bold text-slate-800">{order.restaurant.name}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 {order.rider ? (
 <div className="flex items-center gap-3">
 <img src={order.rider.avatar} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
 <span className="text-sm font-medium text-slate-600">{order.rider.name}</span>
 </div>
 ) : (
 <button className="text-[9px] font-bold text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all ">
 Assign Rider
 </button>
 )}
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <MapPin className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-xs font-bold text-slate-700">{order.zone}</span>
 </div>
 <div className="flex items-center gap-2">
 <Clock className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[10px] text-slate-400 font-bold font-small-caps ">{order.eta} ETA</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <StatusBadge status={order.status} />
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary" title="View Details">
 <Eye className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-emerald-500" title="Confirm Fulfillment">
 <CheckCircle2 className="w-4.5 h-4.5" />
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

const StatusBadge: React.FC<{ status: FoodOrder['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
 status === 'New' && "bg-red-50 text-red-600 border border-red-100/50",
 status === 'Preparing' && "bg-amber-50 text-amber-600 border border-amber-100/50",
 status === 'Out for Delivery' && "bg-blue-50 text-blue-600 border border-blue-100/50",
 status === 'Delivered' && "bg-emerald-50 text-emerald-600 border border-emerald-100/50",
 status === 'Cancelled' && "bg-slate-50 text-slate-400 border border-slate-100/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'New' && "bg-red-500 animate-pulse",
 status === 'Preparing' && "bg-amber-500 animate-pulse",
 status === 'Out for Delivery' && "bg-blue-500 animate-bounce",
 status === 'Delivered' && "bg-emerald-500",
 status === 'Cancelled' && "bg-slate-300"
 )} />
 {status}
 </span>
);
