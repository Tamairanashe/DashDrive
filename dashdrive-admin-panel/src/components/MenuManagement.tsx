import React, { useState } from 'react';
import {
 Utensils,
 Package,
 Plus,
 Search,
 Filter,
 Layers,
 Clock,
 DollarSign,
 MoreVertical,
 ChevronDown,
 Image,
 CheckCircle2,
 XCircle,
 Boxes,
 Tag,
 AlertCircle,
 Eye,
 Edit3
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface MenuItem {
 id: string;
 name: string;
 restaurant: string;
 category: string;
 price: string;
 availability: 'In Stock' | 'Out of Stock';
 status: 'Active' | 'Inactive';
 prepTime: string;
 image: string;
}

const mockItems: MenuItem[] = [
 {
 id: 'ITM-901',
 name: 'Whopper Meal',
 restaurant: 'Burger King',
 category: 'Burgers',
 price: '$12.99',
 availability: 'In Stock',
 status: 'Active',
 prepTime: '10-15 min',
 image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop'
 },
 {
 id: 'ITM-902',
 name: 'Kacchi Biryani',
 restaurant: "Sultan's Dine",
 category: 'Main Course',
 price: '$18.50',
 availability: 'In Stock',
 status: 'Active',
 prepTime: '20-30 min',
 image: 'https://images.unsplash.com/photo-1589302168068-1c459288350e?w=400&h=400&fit=crop'
 },
 {
 id: 'ITM-903',
 name: 'Pepperoni Feast',
 restaurant: 'Pizza Hut',
 category: 'Pizza',
 price: '$14.99',
 availability: 'Out of Stock',
 status: 'Inactive',
 prepTime: '15-20 min',
 image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
 }
];

export const MenuManagement: React.FC = () => {
 const [activeTab, setActiveTab] = useState('Items');
 const tabs = ['Categories', 'Items', 'Modifiers', 'Availability Schedule'];

 return (
 <div className="space-y-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Catalog Control</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage global menu items, categories, and modifier groups</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
 <Package className="w-4 h-4" />
 Bulk Import (CSV)
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 Add Menu Item
 </button>
 </div>
 </div>

 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />
 <div className="flex items-center gap-4 w-full md:w-fit">
 <div className="relative group flex-1 md:w-64">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Find items/categories..."
 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100/50 text-slate-400">
 <Filter className="w-4.5 h-4.5" />
 </button>
 </div>
 </div>

 {activeTab === 'Items' ? (
 <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/30">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Item Details</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Assignment</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Meta Data</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Availability</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockItems.map((item) => (
 <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden shrink-0">
 <img src={item.image} alt="" className="w-full h-full object-cover" />
 </div>
 <div>
 <span className="text-sm font-display font-extrabold text-slate-900 tracking-tight">{item.name}</span>
 <p className="text-[10px] text-slate-400 font-bold font-small-caps mt-1 ">{item.id}</p>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <Utensils className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-xs font-bold text-slate-700">{item.restaurant}</span>
 </div>
 <div className="flex items-center gap-2">
 <Tag className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-[10px] font-bold font-small-caps text-slate-400 ">{item.category}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <p className="text-sm font-display font-extrabold text-slate-900">{item.price}</p>
 <div className="flex items-center gap-2">
 <Clock className="w-3.5 h-3.5 text-slate-300" />
 <span className="text-[9px] font-bold text-slate-400 tracking-tighter">{item.prepTime}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "w-fit px-3 py-1 rounded-xl text-[9px] font-black border",
 item.availability === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-red-50 text-red-600 border-red-100/50"
 )}>
 {item.availability}
 </div>
 </td>
 <td className="px-8 py-6">
 <div className={cn(
 "flex items-center gap-2",
 item.status === 'Active' ? "text-emerald-500" : "text-slate-300"
 )}>
 <div className={cn("w-1.5 h-1.5 rounded-full", item.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
 <span className="text-[10px] font-bold font-small-caps ">{item.status}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <button className="p-2.5 hover:bg-slate-50 text-slate-300 rounded-xl transition-all border border-transparent hover:border-slate-100 hover:text-primary">
 <Edit3 className="w-4.5 h-4.5" />
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
 ) : (
 <div className="bg-white p-24 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center justify-center text-center">
 <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100/50 shadow-inner">
 <Boxes className="w-10 h-10 text-slate-200" />
 </div>
 <h3 className="text-xl font-display font-black text-slate-800 tracking-tight">Unified {activeTab} View</h3>
 <p className="text-sm text-slate-400 max-w-xs mt-3 leading-relaxed">
 The global management interface for **{activeTab}** is being optimized for enterprise catalog scaling.
 </p>
 <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold font-small-caps hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
 Create New {activeTab.slice(0, -1)}
 </button>
 </div>
 )}
 </div>
 );
};
