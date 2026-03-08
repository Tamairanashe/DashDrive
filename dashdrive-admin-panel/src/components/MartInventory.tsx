import {
  AlertCircle,
  Box,
  DollarSign,
  Download,
  Edit3,
  Eye,
  Filter,
  Layers,
  MoreVertical,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Store,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '../utils';
import { Tabs } from 'antd';

interface MartProduct {
  id: string;
  name: string;
  store: string;
  category: string;
  price: string;
  stock: number;
  sku: string;
  status: 'Active' | 'Inactive';
  discountPrice?: string;
  lastUpdated: string;
  image: string;
  barcode?: string;
  weightUnit?: string;
}

const mockProducts: MartProduct[] = [
  {
    id: 'PRD-771',
    name: 'Organic Hass Avocado (Large)',
    store: 'Fresh Mart Supermarket',
    category: 'Fruits & Vegetables',
    price: '$2.50',
    stock: 142,
    sku: 'AVO-HS-001',
    status: 'Active',
    lastUpdated: '2h ago',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100&h=100&fit=crop',
    barcode: '6001234567890',
    weightUnit: '1kg'
  },
  {
    id: 'PRD-772',
    name: 'Whole Milk 2L (Full Cream)',
    store: 'Daily Needs Express',
    category: 'Dairy & Eggs',
    price: '$4.20',
    stock: 8,
    sku: 'MLK-FC-2L',
    status: 'Active',
    lastUpdated: '1h ago',
    image: 'https://images.unsplash.com/photo-1563636619-e9107da5a76a?w=100&h=100&fit=crop',
    barcode: '6009876543210',
    weightUnit: '2L'
  }
];

export const MartInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);

  const tabs = ['All Products', 'Inventory Stock', 'Low Stock', 'Out of Stock', 'Bulk Import'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Products & Inventory</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage cross-store stock levels, pricing, and catalog optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold font-small-caps text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <Upload className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            Bulk CSV Import
          </button>
          <button className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white rounded-2xl text-[10px] font-bold font-small-caps shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs.map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />

      {/* Search & Global Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-[500px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by SKU, Name, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-medium focus:border-primary/30 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-colors shadow-sm">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[32px] shadow-soft border border-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/20">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Product Detail</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Store & Category</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">SKU Codes</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Stock Level</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Base Price</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[13px]">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div>
                        <span className="font-display font-extrabold text-slate-900 block leading-tight tracking-tight">{product.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 font-small-caps ">ID: {product.id}</span>
                          {product.weightUnit && (
                            <>
                              <span className="text-slate-200">|</span>
                              <span className="text-[10px] font-bold text-emerald-500 font-small-caps ">{product.weightUnit}</span>
                            </>
                          )}
                          <span className="text-slate-200">|</span>
                          <span className="text-[10px] font-bold text-primary font-small-caps whitespace-nowrap">{product.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{product.store}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 font-medium">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <code className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-mono text-[11px] font-bold border border-slate-200/50">{product.sku}</code>
                        <button className="text-slate-300 hover:text-primary transition-colors cursor-pointer" title="Copy SKU">
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {product.barcode && (
                        <div className="flex items-center gap-2">
                          <Search className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-mono text-slate-400">{product.barcode}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-10">
                        <span className={cn(
                          "font-display font-black text-lg tracking-tight",
                          product.stock === 0 ? "text-red-500" :
                            product.stock < 10 ? "text-amber-500" : "text-emerald-600"
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
                              product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-display font-black text-slate-950 tracking-tight">{product.price}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter">Gross</span>
                      </div>
                      {product.discountPrice && (
                        <span className="text-[11px] text-red-500 font-black line-through opacity-50">{product.discountPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="View Detail">
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Edit Inventory">
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 hover:bg-white border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Remove Product">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Overlay Mockup */}
      {showBulkImport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowBulkImport(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 space-y-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[28px] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Bulk Catalog Import</h3>
                    <p className="text-sm text-slate-400 font-medium">Sync multiple products across all mart stores via CSV</p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 group transition-colors cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-800 text-center">Drag and drop your inventory CSV here</p>
                <p className="text-sm text-slate-400 font-medium mt-2">or <span className="text-primary font-bold">browse your computer</span></p>
                <div className="mt-8 flex items-center gap-4">
                  <button className="text-[10px] font-bold text-slate-400 flex items-center gap-2 hover:text-primary transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download Template
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
                <div>
                  <p className="text-sm font-bold text-amber-900">Important Note</p>
                  <p className="text-[12px] text-amber-800 leading-relaxed font-medium mt-1">Make sure SKU codes match exactly with the store's POS system to avoid duplication in inventory logs.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-[20px] text-xs font-bold font-small-caps tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Start Process Lifecycle
                </button>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="px-6 py-4 bg-slate-50 text-slate-500 rounded-[20px] text-xs font-bold font-small-caps border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
