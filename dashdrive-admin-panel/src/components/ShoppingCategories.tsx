import React, { useState } from 'react';
import {
 Plus,
 Search,
 LayoutGrid,
 ChevronRight,
 MoreVertical,
 ShoppingBag,
 Smartphone,
 Shirt,
 Home,
 Sparkles,
 Eye,
 Edit3,
 Trash2,
 ArrowUpDown,
 CheckCircle2,
 XCircle,
 Layers,
 Coffee
} from 'lucide-react';
import { cn } from '../utils';

interface ShoppingCategory {
 id: string;
 name: string;
 parent: string | null;
 productCount: number;
 status: 'Active' | 'Inactive';
 displayOrder: number;
 icon: React.ReactNode;
 color: string;
 subCategories: string[];
}

const mockCategories: ShoppingCategory[] = [
 {
 id: 'CAT-SHP-001',
 name: 'Electronics',
 parent: null,
 productCount: 1240,
 status: 'Active',
 displayOrder: 1,
 icon: <Smartphone />,
 color: 'blue',
 subCategories: ['Smartphones', 'Laptops', 'Audio', 'Gaming']
 },
 {
 id: 'CAT-SHP-002',
 name: 'Fashion',
 parent: null,
 productCount: 3850,
 status: 'Active',
 displayOrder: 2,
 icon: <Shirt />,
 color: 'rose',
 subCategories: ['Men', 'Women', 'Kids', 'Accessories']
 },
 {
 id: 'CAT-SHP-003',
 name: 'Home & Kitchen',
 parent: null,
 productCount: 940,
 status: 'Active',
 displayOrder: 3,
 icon: <Home />,
 color: 'emerald',
 subCategories: ['Furniture', 'Cookware', 'Decor', 'Kitchen Tools']
 },
 {
 id: 'CAT-SHP-004',
 name: 'Beauty & Personal Care',
 parent: null,
 productCount: 2120,
 status: 'Active',
 displayOrder: 4,
 icon: <Sparkles />,
 color: 'purple',
 subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance']
 },
 {
 id: 'CAT-SHP-005',
 name: 'Groceries',
 parent: null,
 productCount: 1540,
 status: 'Active',
 displayOrder: 5,
 icon: <Coffee />,
 color: 'amber',
 subCategories: ['Snacks', 'Beverages', 'Pantry', 'Fresh']
 }
];

export const ShoppingCategories: React.FC = () => {
 const [searchQuery, setSearchQuery] = useState('');

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Marketplace Taxonomy</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Organize multi-vendor products into searchable, hierarchical departments</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-5 h-5" />
 Create Department
 </button>
 </div>

 {/* List and Grid View Controls */}
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search departments..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-primary/30 outline-none transition-all"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 text-primary rounded-xl text-[10px] font-bold font-small-caps border border-primary/20 transition-all">
 <LayoutGrid className="w-4.5 h-4.5" />
 Grid Layout
 </button>
 <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold font-small-caps border border-slate-100 transition-all">
 <ArrowUpDown className="w-4.5 h-4.5" />
 Sort Order
 </button>
 </div>
 </div>

 {/* Category Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
 {mockCategories.map((cat) => (
 <div key={cat.id} className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden">
 {/* Status Pulse */}
 <div className={cn(
 "absolute top-6 right-6 w-2 h-2 rounded-full",
 cat.status === 'Active' ? "bg-emerald-500" : "bg-slate-300"
 )} />

 <div className="space-y-6">
 <div className={cn(
 "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 shadow-lg",
 cat.color === 'blue' ? "bg-blue-100 text-blue-600 shadow-blue-100/30" :
 cat.color === 'rose' ? "bg-rose-100 text-rose-600 shadow-rose-100/30" :
 cat.color === 'emerald' ? "bg-emerald-100 text-emerald-600 shadow-emerald-100/30" :
 cat.color === 'purple' ? "bg-purple-100 text-purple-600 shadow-purple-100/30" :
 "bg-amber-100 text-amber-600 shadow-amber-100/30"
 )}>
 <span className="w-8 h-8 flex items-center justify-center">{cat.icon}</span>
 </div>

 <div>
 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight leading-tight">{cat.name}</h3>
 <p className="text-[11px] font-bold text-slate-400 font-small-caps tracking-[0.15em] mt-1.5 ">{cat.productCount} Total Listings</p>
 </div>

 <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
 <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md ">Order: {cat.displayOrder}</span>
 <div className="flex items-center gap-1">
 <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-primary rounded-lg transition-all" title="View Detail">
 <Eye className="w-4 h-4" />
 </button>
 <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-red-500 rounded-lg transition-all" title="Delete">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 {/* Hover Overlay Detail */}
 <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-full group-hover:translate-y-0 p-8 text-center pointer-events-none group-hover:pointer-events-auto">
 <div className="w-full h-full flex flex-col justify-between">
 <div>
 <p className="text-white/40 text-[10px] font-bold font-small-caps mb-6">SUB-CATEGORIES</p>
 <div className="flex flex-wrap justify-center gap-2">
 {cat.subCategories.map((sub, i) => (
 <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-bold border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
 {sub}
 </span>
 ))}
 </div>
 </div>

 <div className="space-y-3">
 <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-bold font-small-caps shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 Manage Listings
 </button>
 <button className="w-full py-3 bg-white/10 text-white rounded-xl text-[10px] font-bold font-small-caps hover:bg-white/20 transition-all">
 Edit structure
 </button>
 </div>
 </div>
 </div>
 </div>
 ))}

 {/* Create New Card */}
 <button className="group border-4 border-dashed border-slate-100 rounded-[40px] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/20 hover:bg-primary/5 transition-all duration-500">
 <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-primary group-hover:scale-110 shadow-sm transition-all duration-500">
 <Plus className="w-8 h-8" />
 </div>
 <div>
 <span className="text-lg font-display font-black text-slate-400 group-hover:text-slate-900 transition-colors">Add New</span>
 <p className="text-[11px] font-bold text-slate-400 mt-1">Global Marketplace</p>
 </div>
 </button>
 </div>

 {/* Help / Informational Card */}
 <div className="bg-emerald-900 rounded-[48px] p-12 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white text-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
 <div className="w-24 h-24 rounded-[32px] bg-white/10 backdrop-blur-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
 <Layers className="w-12 h-12" />
 </div>
 <div className="space-y-4 text-center md:text-left">
 <h4 className="text-2xl font-display font-black text-white tracking-tight">Enterprise Taxonomy Optimization</h4>
 <p className="text-emerald-100/60 max-w-2xl font-medium leading-relaxed">
 Marketplace categories are optimized for AI-driven product discovery. Ensure each department has at least <span className="text-white font-bold">4 unique sub-categories</span> to trigger the enhanced "Quick Filter" UI in the consumer super app.
 </p>
 </div>
 <div className="md:ml-auto">
 <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl text-xs font-bold font-small-caps tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
 Learning Center
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};
