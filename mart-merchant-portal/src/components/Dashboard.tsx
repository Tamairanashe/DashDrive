import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Filter, RefreshCw, Download, Calendar } from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { StatusBadge } from './common/StatusBadge';
import { DashboardSkeleton, CardSkeleton } from './common/SkeletonLoader';
import { PageHeader } from './common/PageHeader';

const statCards = [
    {
        title: 'Total Revenue',
        value: '$24,582',
        trend: '+18.2%',
        isPositive: true,
        icon: DollarSign,
        color: 'bg-zinc-900',
        lightColor: 'bg-zinc-50'
    },
    {
        title: 'Total Orders',
        value: '3,842',
        trend: '+12.5%',
        isPositive: true,
        icon: ShoppingCart,
        color: 'bg-zinc-900',
        lightColor: 'bg-zinc-50'
    },
    {
        title: 'Total Product',
        value: '1,247',
        trend: '-2.3%',
        isPositive: false,
        icon: Package,
        color: 'bg-zinc-900',
        lightColor: 'bg-zinc-50'
    },
    {
        title: 'Active Customers',
        value: '8,234',
        trend: '+24.6%',
        isPositive: true,
        icon: Users,
        color: 'bg-zinc-900',
        lightColor: 'bg-zinc-50'
    },
];

const lineData = [
    { name: 'Mon', value: 4400 },
    { name: 'Tue', value: 4500 },
    { name: 'Wed', value: 4450 },
    { name: 'Thu', value: 4650 },
    { name: 'Fri', value: 4500 },
    { name: 'Sat', value: 4420 },
    { name: 'Sun', value: 4480 },
];

const pieData = [
    { name: 'Fruits', value: 34000, color: '#00b050' },
    { name: 'Vegetables', value: 25600, color: '#a7f3d0' },
    { name: 'Dairy', value: 25500, color: '#fcd34d' },
    { name: 'Meat', value: 17000, color: '#fca5a5' },
];

const productsData = [
    { name: 'Fresh Milk', sold: '342 sold', price: '$684.00', image: 'https://images.unsplash.com/photo-1550583724-125581cc255b?w=100&h=100&fit=crop' },
    { name: 'Wheat Bread', sold: '256 sold', price: '$512.00', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop' },
    { name: 'Emerald Velvet', sold: '154 sold', price: '$355.90', image: 'https://images.unsplash.com/photo-1621236304198-651a21733b09?w=100&h=100&fit=crop' },
];

const recentOrdersData = [
    { id: '1', product: 'Fresh Dairy', date: 'May 5', status: 'Delivered', price: '$145.80', customer: 'M-Starlight', image: 'https://images.unsplash.com/photo-1550583724-125581cc255b?w=50&h=50&fit=crop' },
    { id: '2', product: 'Vegetables', date: 'May 4', status: 'Processing', price: '$210.30', customer: 'Serene W', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=50&h=50&fit=crop' },
    { id: '3', product: 'Rang Eggs', date: 'May 3', status: 'Incoming', price: '$298.40', customer: 'James D', image: 'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=50&h=50&fit=crop' },
];

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Business Overview"
                description="Real-time performance metrics and store analytics."
                icon={TrendingUp}
                actions={
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                            <Calendar size={14} />
                            Last 30 Days
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>
                }
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110", card.color)}>
                                <card.icon size={20} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                card.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {card.trend}
                            </div>
                        </div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{card.title}</p>
                        <h3 className="text-2xl font-black text-gray-800 mt-1 tracking-tighter">{card.value}</h3>
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Live metrics</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Sales By Category</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">$18,200.82 <span className="text-xs font-semibold text-emerald-500 ml-2">↑ 8.24%</span></p>
                        </div>
                        <select className="bg-gray-50 border-none text-xs font-semibold text-gray-500 rounded-lg px-3 py-1.5 outline-none">
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={lineData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    domain={['dataMin - 100', 'dataMax + 100']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#18181b"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-800">Sales By Category</h3>
                        <select className="bg-gray-50 border-none text-xs font-semibold text-gray-500 rounded-lg px-3 py-1.5 outline-none">
                            <option>Monthly</option>
                            <option>Yearly</option>
                        </select>
                    </div>
                    <div className="h-[240px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-2xl font-bold text-gray-800">16,100</p>
                            <p className="text-[10px] font-bold text-white bg-emerald-500 rounded-full px-2 py-0.5">+ 45%</p>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">Total Number of Sales</p>
                        <p className="text-xl font-bold text-gray-800">3,40,0031</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Products */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-800">Top Products</h3>
                        <select className="bg-gray-50 border-none text-xs font-semibold text-gray-500 rounded-lg px-3 py-1.5 outline-none">
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="space-y-6">
                        {productsData.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <img src={product.image} alt={product.name} className="size-12 rounded-xl object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800">{product.name}</p>
                                    <p className="text-xs text-gray-400">{product.sold}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-800">{product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-800">Recent Order</h3>
                        <button className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800">
                            <Filter size={14} />
                            Filter
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-50">
                                    <th className="pb-4 text-xs font-semibold text-gray-400">#</th>
                                    <th className="pb-4 text-xs font-semibold text-gray-400">Product</th>
                                    <th className="pb-4 text-xs font-semibold text-gray-400">Date</th>
                                    <th className="pb-4 text-xs font-semibold text-gray-400">Status</th>
                                    <th className="pb-4 text-xs font-semibold text-gray-400">Price</th>
                                    <th className="pb-4 text-xs font-semibold text-gray-400">Customer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrdersData.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-sm text-gray-500">{order.id}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={order.image} alt={order.product} className="size-8 rounded-lg object-cover" />
                                                <span className="text-sm font-medium text-gray-800">{order.product}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-800">{order.date}</td>
                                        <td className="py-4">
                                            <StatusBadge status={order.status as any} />
                                        </td>
                                        <td className="py-4 text-sm font-bold text-gray-800">{order.price}</td>
                                        <td className="py-4 text-sm text-gray-800">{order.customer}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
