import React from 'react';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Award,
    Filter,
    Download
} from 'lucide-react';
import { cn } from '../types';

const topEats = [
    { name: 'Classic Burger', sales: 450, profit: '$5,400', trend: '+12%', rating: 4.8 },
    { name: 'Truffle Fries', sales: 320, profit: '$1,920', trend: '+8%', rating: 4.9 },
    { name: 'Spicy Wings', sales: 280, profit: '$3,360', trend: '-2%', rating: 4.7 },
    { name: 'Vanilla Shake', sales: 150, profit: '$900', trend: '+15%', rating: 4.6 },
    { name: 'Margherita Pizza', sales: 120, profit: '$2,400', trend: '+5%', rating: 4.5 },
];

const TopEats = () => {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-black tracking-tighter">Product Intelligence</h1>
                    <p className="text-lg text-gray-400 font-medium">Global item performance and popularity leaderboard across all zones.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                        <Filter size={14} />
                        All Categories
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                        <Download size={14} />
                        Export Data
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Award size={160} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Best Seller</p>
                    <h2 className="text-3xl font-bold mb-4">{topEats[0].name}</h2>
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-sm opacity-80">Units Sold</p>
                            <p className="text-xl font-bold">{topEats[0].sales}</p>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div>
                            <p className="text-sm opacity-80">Gross Profit</p>
                            <p className="text-xl font-bold">{topEats[0].profit}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-emerald-500" size={20} />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Star</p>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{topEats[3].name}</h3>
                        <p className="text-sm text-emerald-500 font-bold">{topEats[3].trend} increase in sales</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="text-blue-500" size={20} />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Highest Rated</p>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{topEats[1].name}</h3>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">{topEats[1].rating}</span>
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100">
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Item</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Units Sold</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Profit</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Trend</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topEats.map((item, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-bold text-sm">{item.name}</td>
                                    <td className="p-6 text-sm font-medium">{item.sales} units</td>
                                    <td className="p-6 text-sm font-bold text-emerald-600">{item.profit}</td>
                                    <td className="p-6">
                                        <div className={cn(
                                            "flex items-center gap-1 text-xs font-bold",
                                            item.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
                                        )}>
                                            {item.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {item.trend}
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm font-bold text-gray-600">{item.rating} / 5.0</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1 bg-gray-50 text-black border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                                Promote
                                            </button>
                                            <button className="px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">
                                                Disable
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

export default TopEats;
