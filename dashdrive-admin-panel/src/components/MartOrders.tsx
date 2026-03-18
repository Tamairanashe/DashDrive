import React, { useState } from 'react';
import {
 Search,
 Filter,
 Download,
 Eye,
 CheckCircle2,
 XCircle,
 ShoppingBag,
 Store,
 Bike,
 Clock,
 DollarSign,
 ChevronDown,
 MapPin,
 Calendar,
 ArrowUpRight,
 Package,
 ClipboardList,
 AlertCircle,
 User,
 ArrowRight,
 RefreshCcw
} from 'lucide-react';
import { cn } from '../utils';
import { MapPreview } from './MapPreview';
import { Tabs } from 'antd';

interface MartOrder {
 id: string;
 customer: { name: string; avatar: string };
 store: { name: string; logo: string };
 rider: { name: string; avatar: string } | null;
 itemsCount: number;
 value: string;
 status: 'New' | 'Picking' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';
 time: string;
 zone: string;
 eta: string;
 locations: {
 store: [number, number];
 customer: [number, number];
 };
 paymentMethod: 'Wallet' | 'Cash' | 'Card';
}

const mockMartOrders: MartOrder[] = [
 {
 id: 'MRT-1024',
 customer: { name: 'David Miller', avatar: 'https://i.pravatar.cc/150?u=david' },
 store: { name: 'Fresh Mart Supermarket', logo: 'https://logo.clearbit.com/kroger.com' },
 rider: { name: 'Kevin Hart', avatar: 'https://i.pravatar.cc/150?u=kevin' },
 itemsCount: 14,
 value: '$84.20',
 status: 'Picking',
 time: '02:15 PM',
 zone: 'Gulshan 2',
 eta: '18 min',
 locations: {
 store: [23.7925, 90.4078],
 customer: [23.7955, 90.4128]
 },
 paymentMethod: 'Wallet'
 },
 {
 id: 'MRT-1025',
 customer: { name: 'Lisa Ray', avatar: 'https://i.pravatar.cc/150?u=lisa' },
 store: { name: 'Daily Needs Store', logo: 'https://logo.clearbit.com/tesco.com' },
 rider: null,
 itemsCount: 5,
 value: '$32.10',
 status: 'New',
 time: '02:30 PM',
 zone: 'Banani',
 eta: '--',
 locations: {
 store: [23.7937, 90.4066],
 customer: [23.7855, 90.3928]
 },
 paymentMethod: 'Cash'
 },
 {
 id: 'MRT-1026',
 customer: { name: 'Robert Fox', avatar: 'https://i.pravatar.cc/150?u=robert' },
 store: { name: 'Organic Greens', logo: 'https://logo.clearbit.com/wholefoodsmarket.com' },
 rider: { name: 'Sam Curran', avatar: 'https://i.pravatar.cc/150?u=sam' },
 itemsCount: 22,
 value: '$156.45',
 status: 'Packed',
 time: '02:05 PM',
 zone: 'Dhanmondi',
 eta: '10 min',
 locations: {
 store: [23.7461, 90.3742],
 customer: [23.7561, 90.3842]
 },
 paymentMethod: 'Card'
 }
];

export const MartOrders: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Orders');
 const [selectedOrder, setSelectedOrder] = useState<MartOrder | null>(null);

 const tabs = ['All Orders', 'New', 'Picking', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunds'];

 return (
 <div className="space-y-8">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Mart Orders</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Real-time control over grocery fulfillment and store logistics</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <Download className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Export Data
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Filter className="w-4 h-4 text-white/50" />
 Logistics Filter
 </button>
 </div>
 </div>

 {/* Tab Navigation */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

 {/* Orders Table */}
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Order Detail</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Store & Items</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Dispatch</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Economics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Logistics Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Ops</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockMartOrders.map((order) => (
 <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <MapPreview
 type="order-route"
 data={{
 restaurant: order.locations.store,
 customer: order.locations.customer,
 restaurantName: order.store.name,
 customerName: order.customer.name
 }}
 label={`Mart Order ${order.id}`}
 />
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{order.id}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">{order.customer.name}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <img src={order.store.logo} className="w-9 h-9 rounded-xl border border-slate-100 shadow-sm object-cover" alt="" />
 <div>
 <span className="text-sm font-display font-bold text-slate-800 block leading-tight">{order.store.name}</span>
 <span className="text-[10px] text-emerald-600 font-bold font-small-caps">{order.itemsCount} Items</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 {order.rider ? (
 <div className="flex items-center gap-3">
 <div className="relative">
 <img src={order.rider.avatar} className="w-9 h-9 rounded-full border border-slate-100" alt="" />
 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
 <CheckCircle2 className="w-2 h-2 text-white" />
 </div>
 </div>
 <div>
 <span className="text-sm font-medium text-slate-600 block">{order.rider.name}</span>
 <span className="text-[9px] text-slate-400 font-bold ">{order.eta} ETA</span>
 </div>
 </div>
 ) : (
 <button className="flex items-center gap-2 text-[9px] font-bold text-primary bg-primary/5 px-3 py-2 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all ">
 <User className="w-3 h-3" />
 Assign Picker
 </button>
 )}
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1">
 <div className="flex items-center gap-1.5">
 <DollarSign className="w-3.5 h-3.5 text-slate-400 font-bold" />
 <span className="text-sm font-display font-black text-slate-900">{order.value}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={cn(
 "px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-tighter",
 order.paymentMethod === 'Wallet' ? "bg-emerald-50 text-emerald-600" :
 order.paymentMethod === 'Cash' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
 )}>
 {order.paymentMethod}
 </span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <MartStatusBadge status={order.status} />
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => setSelectedOrder(order)}
 className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary"
 title="Full Inventory Peek"
 >
 <Eye className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-emerald-500" title="Mark Packed">
 <Package className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Order Detail Side Modal Simulation */}
 {selectedOrder && (
 <div className="fixed inset-0 z-[100] flex items-center justify-end">
 <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
 <div className="relative w-full max-w-2xl h-screen bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
 <div className="p-10 space-y-10">
 {/* Modal Header */}
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-5">
 <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
 <ShoppingBag className="w-8 h-8 text-primary" />
 </div>
 <div>
 <div className="flex items-center gap-3">
 <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{selectedOrder.id}</h3>
 <MartStatusBadge status={selectedOrder.status} />
 </div>
 <p className="text-sm text-slate-400 font-medium mt-1">Placed on {selectedOrder.time} â€¢ {selectedOrder.zone}</p>
 </div>
 </div>
 <button
 onClick={() => setSelectedOrder(null)}
 className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-red-500"
 >
 <XCircle className="w-6 h-6" />
 </button>
 </div>

 {/* Picking Timeline */}
 <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
 <h4 className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] mb-8 ">Picking Timeline</h4>
 <div className="relative flex justify-between items-center px-6">
 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
 <TimelineStep icon={<ClipboardList className="w-4 h-4" />} label="Placed" active />
 <TimelineStep icon={<ShoppingBag className="w-4 h-4" />} label="Picking" active={['Picking', 'Packed', 'Out for Delivery', 'Delivered'].includes(selectedOrder.status)} />
 <TimelineStep icon={<Package className="w-4 h-4" />} label="Packed" active={['Packed', 'Out for Delivery', 'Delivered'].includes(selectedOrder.status)} />
 <TimelineStep icon={<Bike className="w-4 h-4" />} label="Shipping" active={['Out for Delivery', 'Delivered'].includes(selectedOrder.status)} />
 <TimelineStep icon={<CheckCircle2 className="w-4 h-4" />} label="Delivered" active={selectedOrder.status === 'Delivered'} />
 </div>
 </div>

 {/* Item List Mockup */}
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h4 className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] ">Inventory Verification (12 Items)</h4>
 <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 hover:underline">
 <RefreshCcw className="w-3.5 h-3.5" />
 Manual Stock Sync
 </button>
 </div>
 <div className="space-y-3">
 {[
 { name: 'Organic Bananas (Small)', qty: 6, price: '$4.50', status: 'Picked' },
 { name: 'Full Cream Milk 2L', qty: 2, price: '$7.80', status: 'Picked' },
 { name: 'Fresh Avocado (Large)', qty: 4, price: '$12.00', status: 'Substituted', sub: 'Medium Hass Avocado' }
 ].map((item, i) => (
 <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
 <div className="flex items-center gap-4">
 <div className={cn(
 "w-10 h-10 rounded-xl flex items-center justify-center",
 item.status === 'Picked' ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
 )}>
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-800">{item.name}</p>
 {item.sub && <p className="text-[10px] text-amber-600 font-medium">Substituted with: {item.sub}</p>}
 </div>
 </div>
 <div className="text-right">
 <p className="text-sm font-black text-slate-900">{item.price}</p>
 <p className="text-[10px] text-slate-400 font-bold ">{item.qty} QTY</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center gap-4 pt-4">
 <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold font-small-caps tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all">
 Confirm Packing Completion
 </button>
 <button className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold font-small-caps border border-red-100 hover:bg-red-100 transition-colors">
 Issue Refund
 </button>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

const MartStatusBadge: React.FC<{ status: MartOrder['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps ",
 status === 'New' && "bg-red-50 text-red-600 border border-red-100/50",
 status === 'Picking' && "bg-emerald-50 text-emerald-600 border border-emerald-100/50",
 status === 'Packed' && "bg-blue-50 text-blue-600 border border-blue-100/50",
 status === 'Out for Delivery' && "bg-purple-50 text-purple-600 border border-purple-100/50",
 status === 'Delivered' && "bg-slate-50 text-slate-500 border border-slate-100/50",
 status === 'Cancelled' && "bg-slate-100 text-slate-400"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'New' && "bg-red-500 animate-pulse",
 status === 'Picking' && "bg-emerald-500 animate-ping",
 status === 'Packed' && "bg-blue-500",
 status === 'Out for Delivery' && "bg-purple-500 animate-bounce"
 )} />
 {status}
 </span>
);

const TimelineStep: React.FC<{ icon: React.ReactNode, label: string, active: boolean }> = ({ icon, label, active }) => (
 <div className="relative z-10 flex flex-col items-center gap-2">
 <div className={cn(
 "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
 active ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : "bg-white text-slate-300 border border-slate-200"
 )}>
 {icon}
 </div>
 <span className={cn(
 "text-[9px] font-bold ",
 active ? "text-primary" : "text-slate-300"
 )}>{label}</span>
 </div>
);
