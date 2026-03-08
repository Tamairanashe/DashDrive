import {
    BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Bar
} from 'recharts';
import {
    DollarSign, ShoppingCart, Users, Activity,
    ChevronDown, Calendar, Filter, ArrowUpRight, ArrowDownRight,
    Truck, Clock, Gauge, MapPin
} from 'lucide-react';
import { cn } from '../utils/cn';
import { api } from '../api';
import { useState, useEffect } from 'react';

const martMetrics = [
    { label: 'Total Sales', value: '$124,592.00', trend: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Conversion Rate', value: '3.42%', trend: '-1.2%', isPositive: false, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Order Value', value: '$42.10', trend: '+5.4%', isPositive: true, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Customer Growth', value: '1,240', trend: '+18.2%', isPositive: true, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const directMetrics = [
    { label: 'Avg Delivery Cost', value: '$8.45', trend: '-2.1%', isPositive: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On-Time Accuracy', value: '98.2%', trend: '+0.5%', isPositive: true, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fleet Efficiency', value: '84%', trend: '+4.2%', isPositive: true, icon: Gauge, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Distance', value: '14.2k km', trend: '+12.8%', isPositive: true, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const salesData = [
    { name: 'Jan', revenue: 45000, orders: 1200 },
    { name: 'Feb', revenue: 52000, orders: 1400 },
    { name: 'Mar', revenue: 48000, orders: 1100 },
    { name: 'Apr', revenue: 61000, orders: 1800 },
    { name: 'May', revenue: 55000, orders: 1600 },
    { name: 'Jun', revenue: 67200, orders: 2100 },
];

const categoryData = [
    { name: 'Fruits', value: 40, color: '#00b050' },
    { name: 'Vegetables', value: 30, color: '#10b981' },
    { name: 'Dairy', value: 15, color: '#3b82f6' },
    { name: 'Meat', value: 10, color: '#f43f5e' },
    { name: 'Others', value: 5, color: '#94a3b8' },
];

interface PerformanceProps {
    token: string | null;
    merchant: any;
    portalType?: 'mart' | 'direct';
}

export function Performance({ token, merchant, portalType = 'mart' }: PerformanceProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [salesTrend, setSalesTrend] = useState<any[]>(salesData);

    const storeId = merchant?.stores?.[0]?.id;

    useEffect(() => {
        if (token && storeId) {
            fetchPerformanceData();
        } else {
            setIsLoading(false);
        }
    }, [token, storeId]);

    const fetchPerformanceData = async () => {
        try {
            const trendData = await api.analytics.getSales(token!, storeId);
            setSalesTrend(trendData.map((item: any) => ({
                name: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
                revenue: parseFloat(item.revenue) || 0,
                orders: parseInt(item.count) || 0
            })));
        } catch (err) {
            console.error('Failed to fetch performance data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-bold">Loading analysis...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
                    <button className="px-4 py-1.5 bg-gray-50 text-gray-800 text-sm font-bold rounded-xl transition-all">Last 30 Days</button>
                    <button className="px-4 py-1.5 text-gray-500 text-sm font-bold hover:text-gray-800 transition-all">Last 90 Days</button>
                    <button className="px-4 py-1.5 text-gray-500 text-sm font-bold hover:text-gray-800 transition-all">Year to Date</button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <Calendar size={18} /> Custom Range <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-emerald-100">
                        <Filter size={18} /> Add Filter
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(portalType === 'direct' ? directMetrics : martMetrics).map((metric, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl", metric.bg)}>
                                <metric.icon className={metric.color} size={24} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
                                metric.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {metric.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {metric.trend}
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm font-semibold tracking-tight uppercase">{metric.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                {portalType === 'direct' ? 'Dispatch vs. Efficiency Trend' : 'Sales vs. Orders Trend'}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {portalType === 'direct' ? 'Comparing total dispatches and fleet performance' : 'Comparing revenue and volume over time'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">
                                    {portalType === 'direct' ? 'Dispatches' : 'Revenue'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">
                                    {portalType === 'direct' ? 'Efficiency %' : 'Orders'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesTrend.length > 0 ? salesTrend : salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 700 }}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Category Sales</h3>
                    <p className="text-xs text-gray-400 mb-8">Revenue share by product type</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {categoryData.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="text-xs font-bold text-gray-600">{cat.name}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-800">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Efficiency Bar Chart */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Operational Efficiency</h3>
                        <p className="text-xs text-gray-400">Order fulfillment speed and accuracy</p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">View Detailed Report</button>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesTrend.length > 0 ? salesTrend : salesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
