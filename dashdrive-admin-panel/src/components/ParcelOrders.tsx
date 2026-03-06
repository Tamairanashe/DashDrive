import React, { useState } from 'react';
import {
 Search,
 Filter,
 MoreVertical,
 Eye,
 Truck,
 User,
 MapPin,
 Package,
 Box,
 Clock,
 CheckCircle2,
 XCircle,
 AlertCircle,
 Navigation,
 ArrowRight,
 Download,
 RefreshCcw,
 Shield,
 FileText,
 ChevronRight,
 ChevronDown,
 Smartphone
} from 'lucide-react';
import { cn } from '../utils';
import { MapPreview } from './MapPreview';
import { Tabs } from 'antd';

interface ParcelOrder {
 id: string;
 sender: { name: string; phone: string; location: string; coords: [number, number] };
 receiver: { name: string; phone: string; location: string; coords: [number, number] };
 category: string;
 weight: string;
 type: 'Standard' | 'Express';
 courier: { name: string; id: string; avatar: string; coords?: [number, number] } | null;
 status: 'Pending' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed' | 'Cancelled';
 fee: string;
 time: string;
 paymentMethod: 'Wallet' | 'Cash' | 'PayLater';
}

const mockOrders: ParcelOrder[] = [
 {
 id: 'PRC-9001',
 sender: { name: 'Alex Johnson', phone: '+880 1712 345678', location: 'Gulshan 2, Road 45', coords: [23.7949, 90.4143] },
 receiver: { name: 'Sarah Miller', phone: '+880 1822 998877', location: 'Banani, Block E', coords: [23.7937, 90.4066] },
 category: 'Electronics',
 weight: '1.2 kg',
 type: 'Express',
 courier: { name: 'Rahat Khan', id: 'DRV-401', avatar: 'https://i.pravatar.cc/150?u=rahat' },
 status: 'In Transit',
 fee: '$12.40',
 time: '12 mins ago',
 paymentMethod: 'Wallet'
 },
 {
 id: 'PRC-9002',
 sender: { name: 'Michael Chen', phone: '+880 1610 554433', location: 'Dhanmondi 32', coords: [23.7509, 90.3789] },
 receiver: { name: 'Emma Wilson', phone: '+880 1515 112233', location: 'Uttara Sector 7', coords: [23.8759, 90.3795] },
 category: 'Documents',
 weight: '0.4 kg',
 type: 'Standard',
 courier: null,
 status: 'Pending',
 fee: '$4.50',
 time: '45 mins ago',
 paymentMethod: 'Cash'
 },
 {
 id: 'PRC-9003',
 sender: { name: 'IKEA Global', phone: '+880 1999 887766', location: 'Tejgaon Industrial Area', coords: [23.7685, 90.3995] },
 receiver: { name: 'Home Essentials', phone: '+880 1333 445566', location: 'Mirpur 10', coords: [23.8069, 90.3687] },
 category: 'Heavy Goods',
 weight: '18.5 kg',
 type: 'Express',
 courier: { name: 'Sabbir Hossain', id: 'DRV-102', avatar: 'https://i.pravatar.cc/150?u=sabbir' },
 status: 'Picked Up',
 fee: '$42.00',
 time: '1h ago',
 paymentMethod: 'PayLater'
 }
];

export const ParcelOrders: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Orders');
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedOrder, setSelectedOrder] = useState<ParcelOrder | null>(null);

 const tabs = ['All Orders', 'Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Failed', 'Cancelled'];

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Parcel Dispatch Console</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Operational command for parcel requests, courier assignments, and lifecycle tracking</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Download className="w-4 h-4 text-slate-400" />
 Export Manifest
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <RefreshCcw className="w-4 h-4" />
 Re-route Algorithm
 </button>
 </div>
 </div>

 {/* Sub-Tabs / Stat Filters */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />

 {/* Search & Filter Bar */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative w-full md:w-[500px] group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by Order ID, Sender, Receiver, or Courier..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-medium focus:border-primary/30 outline-none transition-all shadow-sm"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-500 hover:text-primary transition-all shadow-sm">
 <Filter className="w-4.5 h-4.5" />
 Advanced Logistics Filters
 </button>
 </div>
 </div>

 {/* Orders Table & Detail Split View */}
 <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
 <div className={cn(
 "bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden transition-all duration-500",
 selectedOrder ? "xl:col-span-7" : "xl:col-span-12"
 )}>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Logistics ID</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Nodes (S → R)</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Package Attributes</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Courier Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockOrders.map((order) => (
 <tr
 key={order.id}
 onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
 className={cn(
 "hover:bg-slate-50/50 transition-colors group cursor-pointer",
 selectedOrder?.id === order.id && "bg-slate-50/80"
 )}
 >
 <td className="px-8 py-6">
 <div className="flex flex-col">
 <span className="text-sm font-black text-slate-900 tracking-tight">{order.id}</span>
 <span className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">{order.time}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-1.5 min-w-[180px]">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
 <span className="text-xs font-bold text-slate-700 truncate">{order.sender.name}</span>
 </div>
 <div className="h-2 w-px bg-slate-200 ml-[2.5px]" />
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
 <span className="text-xs font-bold text-slate-700 truncate">{order.receiver.name}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center gap-2">
 <Package className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[11px] font-black text-slate-800">{order.category}</span>
 </div>
 <div className="flex items-center gap-2">
 <Clock className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[10px] font-bold text-slate-400 ">{order.weight} • {order.type}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2">
 <OrderStatusBadge status={order.status} />
 {order.courier ? (
 <div className="flex items-center gap-2">
 <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100">
 <img src={order.courier.avatar} alt="" />
 </div>
 <span className="text-[10px] font-bold text-slate-400 tracking-tighter truncate max-w-[80px]">{order.courier.name}</span>
 </div>
 ) : (
 <span className="text-[10px] font-bold text-rose-500 animate-pulse">Unassigned</span>
 )}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-2.5 bg-white text-slate-400 rounded-xl hover:text-primary shadow-sm border border-slate-100 transition-all">
 <Navigation className="w-4 h-4" />
 </button>
 <button className="p-2.5 bg-white text-slate-400 rounded-xl hover:text-primary shadow-sm border border-slate-100 transition-all">
 <MoreVertical className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Detail View Pane */}
 {selectedOrder && (
 <div className="xl:col-span-5 space-y-6 animate-in slide-in-from-right-8 duration-500">
 <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100/50 overflow-hidden">
 {/* Map Preview */}
 <div className="h-64 relative bg-slate-100 overflow-hidden">
 <MapPreview
 type="order-route"
 data={{
 restaurant: { lat: selectedOrder.sender.coords[0], lng: selectedOrder.sender.coords[1], address: selectedOrder.sender.location },
 customer: { lat: selectedOrder.receiver.coords[0], lng: selectedOrder.receiver.coords[1], address: selectedOrder.receiver.location },
 restaurantName: selectedOrder.sender.name,
 customerName: selectedOrder.receiver.name
 }}
 label={`Parcel ID ${selectedOrder.id}`}
 />
 <div className="absolute top-6 left-6 z-10 flex gap-2">
 <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-lg flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-primary" />
 <span className="text-[10px] font-black text-slate-900 ">{selectedOrder.status}</span>
 </div>
 <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-lg flex items-center gap-2">
 <span className="text-[10px] font-black text-white ">{selectedOrder.type}</span>
 </div>
 </div>
 </div>

 <div className="p-8 space-y-8">
 {/* Order Quick Actions */}
 <div className="flex items-center justify-between">
 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">{selectedOrder.id} Details</h3>
 <div className="flex gap-2">
 <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm">
 <Shield className="w-5 h-5" />
 </button>
 <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm">
 <FileText className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Logistics Timeline */}
 <div className="space-y-6">
 <p className="text-[10px] font-bold text-slate-400 border-b border-slate-50 pb-2">Logistics Pipeline</p>
 <div className="space-y-4">
 <TimelineItem
 icon={<Box className="w-4 h-4" />}
 label="Sender Node"
 title={selectedOrder.sender.name}
 subTitle={selectedOrder.sender.location}
 status="active"
 />
 <TimelineItem
 icon={<Truck className="w-4 h-4" />}
 label="Courier Transit"
 title={selectedOrder.courier?.name || 'Waiting for Assign'}
 subTitle={selectedOrder.courier ? `ID: ${selectedOrder.courier.id}` : 'Dispatching...'}
 status={selectedOrder.courier ? "active" : "pending"}
 />
 <TimelineItem
 icon={<MapPin className="w-4 h-4" />}
 label="Receiver Node"
 title={selectedOrder.receiver.name}
 subTitle={selectedOrder.receiver.location}
 status="pending"
 isLast
 />
 </div>
 </div>

 {/* Operational Controls */}
 <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
 <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[32px] hover:bg-primary/5 hover:border-primary/20 border-2 border-transparent transition-all group">
 <RefreshCcw className="w-6 h-6 text-slate-300 group-hover:text-primary mb-2 transition-colors" />
 <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 tracking-tighter">Reassign Courier</span>
 </button>
 <button className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[32px] hover:bg-rose-50 hover:border-rose-100 border-2 border-transparent transition-all group">
 <XCircle className="w-6 h-6 text-slate-300 group-hover:text-rose-500 mb-2 transition-colors" />
 <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 tracking-tighter">Cancel Parcel</span>
 </button>
 </div>
 </div>
 </div>

 <button
 onClick={() => setSelectedOrder(null)}
 className="w-full py-5 bg-slate-900 text-white rounded-[32px] text-[10px] font-bold font-small-caps shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
 >
 <ChevronDown className="w-5 h-5 text-white/40 rotate-90" />
 Back to Master List
 </button>
 </div>
 )}
 </div>
 </div>
 );
};

const TimelineItem: React.FC<{ icon: React.ReactNode, label: string, title: string, subTitle: string, status: 'active' | 'pending', isLast?: boolean }> = ({ icon, label, title, subTitle, status, isLast }) => (
 <div className="flex gap-4 relative">
 {!isLast && <div className={cn("absolute left-[19px] top-10 bottom-0 w-0.5", status === 'active' ? 'bg-primary/20' : 'bg-slate-100')} />}
 <div className={cn(
 "w-10 h-10 rounded-xl flex items-center justify-center relative z-10 shadow-sm border",
 status === 'active' ? "bg-primary/10 text-primary border-primary/20" : "bg-slate-50 text-slate-300 border-slate-100"
 )}>
 {icon}
 </div>
 <div className="flex-1 space-y-1">
 <p className="text-[9px] font-bold text-slate-400 leading-none">{label}</p>
 <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">{title}</p>
 <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">{subTitle}</p>
 </div>
 </div>
);

const OrderStatusBadge: React.FC<{ status: ParcelOrder['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border",
 status === 'Delivered' && "bg-emerald-50 text-emerald-600 border-emerald-100/50",
 status === 'Pending' && "bg-amber-50 text-amber-600 border-amber-100/50",
 status === 'Assigned' && "bg-blue-50 text-blue-600 border-blue-100/50",
 status === 'In Transit' && "bg-purple-50 text-purple-600 border-purple-100/50 animate-pulse",
 status === 'Cancelled' && "bg-slate-50 text-slate-400 border-slate-200/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'Delivered' && "bg-emerald-500",
 status === 'Pending' && "bg-amber-500",
 status === 'In Transit' && "bg-purple-500",
 status === 'Cancelled' && "bg-slate-400"
 )} />
 {status}
 </span>
);
