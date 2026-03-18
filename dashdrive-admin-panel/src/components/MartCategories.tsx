import React, { useState } from 'react';
import {
 Plus,
 Search,
 LayoutGrid,
 ChevronRight,
 MoreVertical,
 ShoppingBag,
 Apple,
 Milk,
 IceCream,
 Wind,
 Eye,
 Edit3,
 Trash2,
 ArrowUpDown,
 CheckCircle2,
 XCircle
} from 'lucide-react';
import { cn } from '../utils';

interface MartCategory {
 id: string;
 name: string;
 parent: string | null;
 productCount: number;
 status: 'Active' | 'Inactive';
 displayOrder: number;
 icon: React.ReactNode;
 color: string;
}

const mockCategories: MartCategory[] = [
 {
 id: 'CAT-001',
 name: 'Fruits & Vegetables',
 parent: null,
 productCount: 420,
 status: 'Active',
 displayOrder: 1,
 icon: <Apple />,
 color: 'emerald'
 },
 {
 id: 'CAT-002',
 name: 'Dairy & Eggs',
 parent: null,
 productCount: 185,
 status: 'Active',
 displayOrder: 2,
 icon: <Milk />,
 color: 'blue'
 },
 {
 id: 'CAT-003',
 name: 'Frozen Foods',
 parent: null,
 productCount: 94,
 status: 'Active',
 displayOrder: 3,
 icon: <IceCream />,
 color: 'purple'
 },
 {
 id: 'CAT-004',
 name: 'Household Items',
 parent: null,
 productCount: 312,
 status: 'Active',
 displayOrder: 4,
 icon: <Wind />,
 color: 'rose'
 }
];

export const MartCategories: React.FC = () => {
 const [searchQuery, setSearchQuery] = useState('');

 return (
 <div className="space-y-8">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Product Categories</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Organize and structure the global mart catalog for optimized discovery</p>
 </div>
 <button className="flex items-center gap-2.5 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-bold font-small-caps shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-5 h-5" />
 Create New Category
 </button>
 </div>

 {/* List and Grid View Controls */}
 <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative w-full md:w-96 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search categories..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-primary/30 outline-none transition-all"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 text-primary rounded-xl text-[10px] font-bold font-small-caps border border-primary/20 transition-all">
 <LayoutGrid className="w-4.5 h-4.5" />
 Grid View
 </button>
 <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold font-small-caps border border-slate-100 transition-all">
 <ArrowUpDown className="w-4.5 h-4.5" />
 Reorder Sort
 </button>
 </div>
 </div>

 {/* Category Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {mockCategories.map((cat) => (
 <div key={cat.id} className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-100/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden">
 {/* Status Pulse */}
 <div className={cn(
 "absolute top-6 right-6 w-2 h-2 rounded-full",
 cat.status === 'Active' ? "bg-emerald-500" : "bg-slate-300"
 )} />

 <div className="space-y-6">
 <div className={cn(
 "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
 cat.color === 'emerald' ? "bg-emerald-100 text-emerald-600 shadow-emerald-100/30" :
 cat.color === 'blue' ? "bg-blue-100 text-blue-600 shadow-blue-100/30" :
 cat.color === 'purple' ? "bg-purple-100 text-purple-600 shadow-purple-100/30" :
 "bg-rose-100 text-rose-600 shadow-rose-100/30"
 )}>
 <span className="w-8 h-8 flex items-center justify-center">{cat.icon}</span>
 </div>

 <div>
 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight leading-tight">{cat.name}</h3>
 <p className="text-[11px] font-bold text-slate-400 font-small-caps tracking-[0.15em] mt-1.5 ">{cat.productCount} SKUs Active</p>
 </div>

 <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
 <div className="flex items-center gap-1">
 <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Order: {cat.displayOrder}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-primary rounded-lg transition-all" title="View Products">
 <Eye className="w-4 h-4" />
 </button>
 <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-slate-600 rounded-lg transition-all" title="Edit Category">
 <Edit3 className="w-4 h-4" />
 </button>
 <button className="p-2 hover:bg-slate-50 text-slate-300 hover:text-red-500 rounded-lg transition-all" title="Delete Category">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 {/* Hover Overlay Detail */}
 <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 p-8 text-center pointer-events-none group-hover:pointer-events-auto">
 <p className="text-white/60 text-[10px] font-bold font-small-caps mb-4">SUB-CATEGORIES</p>
 <div className="flex flex-wrap justify-center gap-2">
 <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-bold hover:bg-white/20 transition-colors pointer-events-auto">Leafy Greens</span>
 <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-bold hover:bg-white/20 transition-colors pointer-events-auto">Tropical</span>
 <span className="px-3 py-1 bg-white/10 rounded-lg text-white text-[10px] font-bold hover:bg-white/20 transition-colors pointer-events-auto">Grains</span>
 </div>
 <button className="mt-8 flex items-center gap-2 text-primary font-bold text-xs hover:underline pointer-events-auto">
 Manage Hierarchy
 <ChevronRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 ))}
 </div>

 {/* Empty State / Help Section */}
 <div className="p-12 border-2 border-dashed border-slate-100 rounded-[48px] flex flex-col items-center justify-center text-center space-y-6">
 <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
 <ShoppingBag className="w-10 h-10 text-slate-200" />
 </div>
 <div className="max-w-md">
 <h4 className="text-lg font-bold text-slate-800">Dynamic Hierarchy Legend</h4>
 <p className="text-sm text-slate-400 mt-2 font-medium">Categories are global across all stores but can be selectively disabled per individual vendor Profile.</p>
 </div>
 <button className="text-primary font-bold text-xs flex items-center gap-2 hover:underline">
 View Catalog Documentation
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 );
};
