import React, { useState } from 'react';
import {
 Search,
 Filter,
 MoreVertical,
 Eye,
 Truck,
 CheckCircle2,
 XCircle,
 Clock,
 CreditCard,
 Wallet,
 MapPin,
 ChevronRight,
 ShoppingBag,
 Package,
 RefreshCcw,
 Download,
 Shield,
 FileText
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface ShoppingOrder {
 id: string;
 customer: {
 name: string;
 avatar: string;
 };
 vendor: string;
 itemsCount: number;
 total: string;
 paymentMethod: 'Wallet' | 'Card' | 'Cash';
 deliveryType: 'Standard' | 'Express';
 status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
 date: string;
 zone: string;
}

const mockOrders: ShoppingOrder[] = [
 {
 id: 'ORD-SHP-8821',
 customer: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
 vendor: 'ElectroHub Store',
 itemsCount: 2,
 total: '$312.40',
 paymentMethod: 'Card',
 deliveryType: 'Express',
 status: 'Shipped',
 date: '12th Oct, 2023 14:20',
 zone: 'Gulshan 2'
 },
 {
 id: 'ORD-SHP-8822',
 customer: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah' },
 vendor: 'Urban Fashion',
 itemsCount: 4,
 total: '$145.00',
 paymentMethod: 'Wallet',
 deliveryType: 'Standard',
 status: 'Delivered',
 date: '12th Oct, 2023 11:35',
 zone: 'Banani'
 },
 {
 id: 'ORD-SHP-8823',
 customer: { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael' },
 vendor: 'Gadget World',
 itemsCount: 1,
 total: '$850.00',
 paymentMethod: 'Card',
 deliveryType: 'Express',
 status: 'Confirmed',
 date: '13th Oct, 2023 09:15',
 zone: 'Dhanmondi'
 },
 {
 id: 'ORD-SHP-8824',
 customer: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma' },
 vendor: 'Beauty Palace',
 itemsCount: 3,
 total: '$68.20',
 paymentMethod: 'Cash',
 deliveryType: 'Standard',
 status: 'Pending',
 date: '13th Oct, 2023 15:45',
 zone: 'Uttara'
 }
];

export const ShoppingOrders: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Orders');
 const [searchQuery, setSearchQuery] = useState('');

 const tabs = ['All Orders', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returns', 'Refunds'];

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Marketplace Fulfillment</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Monitor multi-vendor order logistics, shipping cycles, and marketplace returns</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Generate Invoices
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Download className="w-4 h-4 text-white/50" />
 Exports Orders
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
 placeholder="Search by Order ID, Customer, or Vendor..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-medium focus:border-primary/30 outline-none transition-all shadow-sm"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
 <Filter className="w-5 h-5" />
 </button>
 <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm text-[10px] font-bold font-small-caps">
 Refine Search
 </button>
 </div>
 </div>

 {/* Orders Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Transaction ID</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Customer Entity</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Vendor Source</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Value & Method</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Shipping State</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockOrders.map((order) => (
 <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex flex-col">
 <span className="text-sm font-black text-slate-900 tracking-tight underline decoration-primary/20 cursor-pointer hover:text-primary transition-colors">{order.id}</span>
 <span className="text-[10px] font-bold text-slate-400 mt-1 tracking-tighter">{order.date}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden shadow-sm">
 <img src={order.customer.avatar} className="w-full h-full object-cover" alt="" />
 </div>
 <div>
 <p className="text-sm font-bold text-slate-800 leading-tight">{order.customer.name}</p>
 <div className="flex items-center gap-1.5 mt-1">
 <MapPin className="w-3 h-3 text-slate-400" />
 <span className="text-[10px] font-bold text-slate-400 tracking-tighter">{order.zone}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <ShoppingBag className="w-4 h-4 text-primary/60" />
 <span className="text-sm font-bold text-slate-700">{order.vendor}</span>
 </div>
 <p className="text-[10px] font-bold text-slate-400 mt-1 ">{order.itemsCount} Global Items</p>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1">
 <div className="flex items-baseline gap-1.5">
 <span className="text-lg font-display font-black text-slate-950 tracking-tight">{order.total}</span>
 </div>
 <div className="flex items-center gap-2">
 {order.paymentMethod === 'Wallet' ? <Wallet className="w-3 h-3 text-emerald-500" /> : <CreditCard className="w-3 h-3 text-blue-500" />}
 <span className="text-[10px] font-bold text-slate-400 ">{order.paymentMethod}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2">
 <OrderStatusBadge status={order.status} />
 <div className="flex items-center gap-1.5">
 <Truck className="w-3 h-3 text-slate-400" />
 <span className="text-[9px] font-black text-slate-400 ">{order.deliveryType} SHIP</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="View Detail">
 <Eye className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Track Shipment">
 <Truck className="w-4.5 h-4.5" />
 </button>
 <div className="w-px h-6 bg-slate-100 mx-1" />
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Administrative Actions">
 <MoreVertical className="w-4.5 h-4.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Table Footer */}
 <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
 <Shield className="w-4 h-4 text-emerald-600" />
 <span className="text-[10px] font-black text-emerald-700 ">Fraud Guard Active</span>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold text-slate-400 mr-4">Page 1 of 42</span>
 <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 shadow-sm hover:bg-slate-50 transition-all">Previous</button>
 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all">Next Cluster</button>
 </div>
 </div>
 </div>

 {/* Refund Notification Example */}
 <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100/50 flex items-center justify-between">
 <div className="flex items-center gap-5">
 <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
 <RefreshCcw className="w-7 h-7" />
 </div>
 <div>
 <h4 className="text-lg font-display font-black text-amber-900 tracking-tight leading-tight">8 Pending Return Requests</h4>
 <p className="text-xs text-amber-800/60 font-medium mt-1">Awaiting marketplace admin approval for vendor investigation.</p>
 </div>
 </div>
 <button className="flex items-center gap-2.5 px-6 py-3 bg-amber-600 text-white rounded-xl text-[10px] font-bold font-small-caps shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all">
 Process Returns
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 );
};

const OrderStatusBadge: React.FC<{ status: ShoppingOrder['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black border",
 status === 'Delivered' && "bg-emerald-50 text-emerald-600 border-emerald-100/50",
 status === 'Pending' && "bg-amber-50 text-amber-600 border-amber-100/50",
 status === 'Confirmed' && "bg-blue-50 text-blue-600 border-blue-100/50",
 status === 'Shipped' && "bg-purple-50 text-purple-600 border-purple-100/50",
 status === 'Returned' && "bg-rose-50 text-rose-600 border-rose-100/50",
 status === 'Cancelled' && "bg-slate-50 text-slate-400 border-slate-200/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'Delivered' && "bg-emerald-500",
 status === 'Pending' && "bg-amber-500 animate-pulse",
 status === 'Confirmed' && "bg-blue-500",
 status === 'Shipped' && "bg-purple-500 animate-pulse",
 status === 'Returned' && "bg-rose-500",
 status === 'Cancelled' && "bg-slate-400"
 )} />
 {status}
 </span>
);
