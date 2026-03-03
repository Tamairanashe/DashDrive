import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Search, 
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '../types';

const inventoryData = [
  { id: '1', name: 'Brioche Buns', category: 'Bakery', stock: 45, unit: 'pcs', minLevel: 100, status: 'low' },
  { id: '2', name: 'Beef Patties', category: 'Meat', stock: 120, unit: 'pcs', minLevel: 50, status: 'good' },
  { id: '3', name: 'Cheddar Cheese', category: 'Dairy', stock: 15, unit: 'kg', minLevel: 10, status: 'good' },
  { id: '4', name: 'Romaine Lettuce', category: 'Produce', stock: 8, unit: 'heads', minLevel: 20, status: 'critical' },
  { id: '5', name: 'Tomato Sauce', category: 'Pantry', stock: 40, unit: 'liters', minLevel: 30, status: 'good' },
  { id: '6', name: 'French Fries', category: 'Frozen', stock: 200, unit: 'kg', minLevel: 150, status: 'good' },
];

const Inventory = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-6xl mx-auto py-8 px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Inventory</h1>
          <p className="text-gray-500 mt-1">Monitor ingredient stock levels and replenishment needs.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
          <Plus size={20} />
          ADD INVENTORY
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Critical Stock</span>
          </div>
          <div className="text-3xl font-bold">2 Items</div>
          <p className="text-xs text-red-500 mt-2 font-medium">Needs immediate replenishment</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <RefreshCw size={20} />
            </div>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Orders</span>
          </div>
          <div className="text-3xl font-bold">4 Orders</div>
          <p className="text-xs text-orange-500 mt-2 font-medium">Expected delivery: Tomorrow</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Package size={20} />
            </div>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Value</span>
          </div>
          <div className="text-3xl font-bold">$4,280.50</div>
          <p className="text-xs text-emerald-500 mt-2 font-medium">Current asset value</p>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'low', 'critical', 'good'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                filter === f ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-black/5"
            />
          </div>
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Current Stock</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Min. Level</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inventoryData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-4 font-bold text-sm">{item.name}</td>
                <td className="px-8 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-8 py-4 font-mono text-sm">
                  <span className={cn(
                    "font-bold",
                    item.status === 'critical' ? "text-red-600" : item.status === 'low' ? "text-orange-600" : "text-black"
                  )}>
                    {item.stock}
                  </span>
                  <span className="text-gray-400 ml-1">{item.unit}</span>
                </td>
                <td className="px-8 py-4 text-sm text-gray-400">{item.minLevel} {item.unit}</td>
                <td className="px-8 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    item.status === 'critical' ? "bg-red-100 text-red-600" : 
                    item.status === 'low' ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <button className="text-black hover:text-orange-500 transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
