import React, { useState } from 'react';
import {
 Search,
 Filter,
 Plus,
 MoreVertical,
 Eye,
 Edit3,
 Trash2,
 CheckCircle2,
 XCircle,
 Star,
 Package,
 Store,
 Tag,
 ArrowUpRight,
 Download,
 Layers,
 AlertCircle,
 TrendingUp,
 RefreshCcw
} from 'lucide-react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface ShoppingProduct {
 id: string;
 name: string;
 vendor: string;
 category: string;
 price: string;
 stock: number;
 status: 'Active' | 'Pending' | 'Out of Stock' | 'Draft';
 sku: string;
 rating: number;
 sales: string;
 image: string;
 lastUpdated: string;
}

const mockProducts: ShoppingProduct[] = [
 {
 id: 'SHP-401',
 name: 'Ultra-Slim Smart Watch 4',
 vendor: 'ElectroHub Store',
 category: 'Electronics',
 price: '$299.00',
 stock: 45,
 status: 'Active',
 sku: 'WCH-UL-4B',
 rating: 4.8,
 sales: '1.2k',
 image: 'https://images.unsplash.com/photo-1546868889-4e0c68a702ec?w=100&h=100&fit=crop',
 lastUpdated: '2h ago'
 },
 {
 id: 'SHP-402',
 name: 'Premium Leather Tote Bag',
 vendor: 'Urban Fashion',
 category: 'Fashion',
 price: '$120.00',
 stock: 12,
 status: 'Pending',
 sku: 'BAG-LTR-UB',
 rating: 0.0,
 sales: '0',
 image: 'https://images.unsplash.com/photo-1584917033904-494b7c6204d4?w=100&h=100&fit=crop',
 lastUpdated: '1d ago'
 },
 {
 id: 'SHP-403',
 name: '4K OLED Gaming Monitor 32"',
 vendor: 'Gadget World',
 category: 'Electronics',
 price: '$850.00',
 stock: 0,
 status: 'Out of Stock',
 sku: 'MON-OLED-32',
 rating: 4.9,
 sales: '482',
 image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop',
 lastUpdated: '5h ago'
 },
 {
 id: 'SHP-404',
 name: 'Moisturizing Face Serum 30ml',
 vendor: 'Beauty Palace',
 category: 'Beauty',
 price: '$45.00',
 stock: 120,
 status: 'Active',
 sku: 'SRM-MST-30',
 rating: 4.6,
 sales: '3.4k',
 image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop',
 lastUpdated: '8h ago'
 }
];

export const ShoppingProducts: React.FC = () => {
 const [activeTab, setActiveTab] = useState('All Products');
 const [searchQuery, setSearchQuery] = useState('');

 const tabs = ['All Products', 'Active', 'Pending Approval', 'Out of Stock', 'Draft Products'];

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Marketplace Catalog</h2>
 <p className="text-sm text-slate-400 font-medium mt-1">Manage multi-vendor listing approvals, inventory health, and pricing</p>
 </div>
 <div className="flex items-center gap-4">
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
 <Download className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
 Export Catalog
 </button>
 <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
 <Plus className="w-4 h-4" />
 New Listing Request
 </button>
 </div>
 </div>

 {/* Sub-Tabs / Filters */}
 <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab.id || tab.name || tab, label: tab.name || tab.label || tab.title || tab.id || tab }))} className="mb-6 font-bold" />

 {/* Table Controls */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
 <div className="relative w-full md:w-[450px] group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search product name, SKU, or vendor..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:border-primary/30 outline-none transition-all shadow-sm"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
 <Filter className="w-5 h-5" />
 </button>
 <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
 <RefreshCcw className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* Products Table */}
 <div className="bg-white rounded-[40px] shadow-soft border border-slate-100/50 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-50 bg-slate-50/20">
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Product Lifecycle</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Vendor & Dept.</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Economics</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Inventory</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Market Status</th>
 <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Operations</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {mockProducts.map((product) => (
 <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-8 py-6">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex-shrink-0">
 <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
 </div>
 <div>
 <span className="text-base font-display font-black text-slate-900 block tracking-tight">{product.name}</span>
 <div className="flex items-center gap-2 mt-1.5 font-bold font-small-caps text-[9px] text-slate-400 ">
 <span>SKU: {product.sku}</span>
 <span className="text-slate-200">|</span>
 <span>Updated {product.lastUpdated}</span>
 </div>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <Store className="w-3.5 h-3.5 text-primary" />
 <span className="text-sm font-bold text-slate-700 tracking-tight">{product.vendor}</span>
 </div>
 <div className="flex items-center gap-2">
 <Layers className="w-3.5 h-3.5 text-slate-400" />
 <span className="text-[11px] font-medium text-slate-500">{product.category}</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-1">
 <div className="flex items-center gap-1.5">
 <span className="text-lg font-display font-black text-slate-950 tracking-tight">{product.price}</span>
 </div>
 <div className="flex items-center gap-1 text-amber-500">
 <Star className="w-3 h-3 fill-amber-500" />
 <span className="text-[11px] font-black">{product.rating || 'N/A'}</span>
 <span className="text-[10px] text-slate-400 font-bold ml-1">• {product.sales} sold</span>
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <div className="space-y-2 max-w-[120px]">
 <div className="flex items-center justify-between">
 <span className={cn(
 "text-base font-display font-black tracking-tight",
 product.stock === 0 ? "text-red-500" :
 product.stock < 15 ? "text-orange-500" : "text-emerald-600"
 )}>
 {product.stock}
 </span>
 <span className="text-[10px] font-bold text-slate-400 font-small-caps ">In Stock</span>
 </div>
 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
 <div
 className={cn(
 "h-full rounded-full transition-all duration-1000",
 product.stock === 0 ? "bg-red-500" :
 product.stock < 15 ? "bg-orange-500" : "bg-emerald-500"
 )}
 style={{ width: `${Math.min((product.stock / 150) * 100, 100)}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-8 py-6">
 <ProductStatusBadge status={product.status} />
 </td>
 <td className="px-8 py-6">
 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="View Analytics">
 <TrendingUp className="w-4.5 h-4.5" />
 </button>
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Full Precision Edit">
 <Edit3 className="w-4.5 h-4.5" />
 </button>
 <div className="w-px h-6 bg-slate-100 mx-1" />
 {product.status === 'Pending' ? (
 <button className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Approve Listing">
 <CheckCircle2 className="w-4.5 h-4.5" />
 </button>
 ) : (
 <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Move to Draft">
 <XCircle className="w-4.5 h-4.5" />
 </button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Table Footer / Pagination */}
 <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
 <p className="text-[10px] font-bold text-slate-400 font-small-caps ">Showing 1-10 of 480 Active Products</p>
 <div className="flex items-center gap-2">
 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm">Prev</button>
 <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold shadow-lg hover:bg-slate-800 transition-all">Next</button>
 </div>
 </div>
 </div>
 </div>
 );
};

const ProductStatusBadge: React.FC<{ status: ShoppingProduct['status'] }> = ({ status }) => (
 <span className={cn(
 "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold font-small-caps border",
 status === 'Active' && "bg-emerald-50 text-emerald-600 border-emerald-100/50",
 status === 'Pending' && "bg-amber-50 text-amber-600 border-amber-100/50",
 status === 'Out of Stock' && "bg-red-50 text-red-600 border-red-100/50",
 status === 'Draft' && "bg-slate-100 text-slate-400 border-slate-200/50"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 status === 'Active' && "bg-emerald-500",
 status === 'Pending' && "bg-amber-500 animate-pulse",
 status === 'Out of Stock' && "bg-red-500 animate-ping",
 status === 'Draft' && "bg-slate-400"
 )} />
 {status}
 </span>
);
