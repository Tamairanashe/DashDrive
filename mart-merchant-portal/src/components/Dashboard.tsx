import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Filter, Download, Calendar, Check, X, AlertCircle } from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { StatusBadge } from './common/StatusBadge';
import { DashboardSkeleton } from './common/SkeletonLoader';
import { PageHeader } from './common/PageHeader';
import { useRealTime } from '../hooks/useRealTime';

const statCards = [
    {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$24,582',
        trend: '+18.2%',
        isPositive: true,
        icon: DollarSign,
        color: 'bg-zinc-900',
        chartData: [
            { v: 400 }, { v: 700 }, { v: 500 }, { v: 900 }, { v: 600 }, { v: 800 }, { v: 950 }
        ]
    },
    {
        id: 'orders',
        title: 'Total Orders',
        value: '3,842',
        trend: '+12.5%',
        isPositive: true,
        icon: ShoppingCart,
        color: 'bg-zinc-900',
        chartData: [
            { v: 300 }, { v: 400 }, { v: 350 }, { v: 500 }, { v: 450 }, { v: 600 }, { v: 550 }
        ]
    },
    {
        id: 'products',
        title: 'Total Product',
        value: '1,247',
        trend: '-2.3%',
        isPositive: false,
        icon: Package,
        color: 'bg-zinc-900',
        chartData: [
            { v: 800 }, { v: 750 }, { v: 780 }, { v: 700 }, { v: 720 }, { v: 680 }, { v: 650 }
        ]
    },
    {
        id: 'customers',
        title: 'Active Customers',
        value: '8,234',
        trend: '+24.6%',
        isPositive: true,
        icon: Users,
        color: 'bg-zinc-900',
        chartData: [
            { v: 200 }, { v: 300 }, { v: 450 }, { v: 400 }, { v: 600 }, { v: 750 }, { v: 900 }
        ]
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

import { Card, Table, List, Button, Space, Typography, Select } from 'antd';

const { Title, Text } = Typography;

const columns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        render: (id: string) => <Text type="secondary" style={{ fontSize: '12px' }}>#{id.padStart(4, '0')}</Text>,
    },
    {
        title: 'Product',
        key: 'product',
        render: (_: any, record: any) => (
            <div className="flex items-center gap-3">
                <img src={record.image} alt={record.product} className="size-8 rounded-lg object-cover shadow-sm" />
                <div className="flex flex-col">
                    <Text strong style={{ fontSize: '14px', lineHeight: 1 }}>{record.product}</Text>
                    <Text type="secondary" style={{ fontSize: '10px' }}>{record.price} • {record.date}</Text>
                </div>
            </div>
        )
    },
    {
        title: 'Status',
        key: 'status',
        align: 'center' as const,
        render: (_: any, record: any) => <StatusBadge status={record.status as any} />
    },
    {
        title: 'Customer',
        key: 'customer',
        render: (_: any, record: any) => (
            <div>
                <Text style={{ display: 'block', fontSize: '12px', fontWeight: 500 }}>{record.customer}</Text>
                <Text type="secondary" style={{ fontSize: '10px' }}>Verified User</Text>
            </div>
        )
    },
    {
        title: 'Actions',
        key: 'actions',
        align: 'right' as const,
        render: () => (
            <Space>
                <Button type="text" shape="circle" icon={<Check size={14} className="text-emerald-600" />} className="bg-emerald-50 hover:bg-emerald-600 transition-colors" />
                <Button type="text" shape="circle" icon={<X size={14} className="text-red-600" />} className="bg-red-50 hover:bg-red-600 transition-colors" />
            </Space>
        )
    }
];

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const { lastUpdated } = useRealTime('dashboard', { statCards, recentOrdersData });

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
                    <Space size="middle">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {lastUpdated ? `Last Sync: ${lastUpdated.toLocaleTimeString()}` : 'Connecting...'}
                        </div>
                        <Button icon={<Calendar size={14} />} size="large" style={{ borderRadius: 12 }}>
                            Last 30 Days
                        </Button>
                        <Button type="primary" icon={<Download size={16} />} size="large" style={{ borderRadius: 12 }}>
                            Download Report
                        </Button>
                    </Space>
                }
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <Card key={idx} hoverable bordered={false} bodyStyle={{ padding: 24, paddingBottom: 0 }} className="relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        {/* Mini Background Chart */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={card.chartData}>
                                    <Area
                                        type="monotone"
                                        dataKey="v"
                                        stroke={card.isPositive ? "#10b981" : "#ef4444"}
                                        fill={card.isPositive ? "#10b981" : "#ef4444"}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <div className={cn("p-2 rounded-xl text-white shadow-md", card.color)}>
                                <card.icon size={16} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                card.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {card.trend}
                            </div>
                        </div>
                        <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} strong>{card.title}</Text>
                        <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>{card.value}</Title>
                        <div className="flex items-center gap-1.5 mt-2 pb-6 relative z-10">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Live metrics</Text>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart */}
                <Card className="lg:col-span-2 shadow-sm" bordered={false} bodyStyle={{ padding: 24 }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Title level={4} style={{ margin: 0 }}>Sales Trend</Title>
                                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-widest">
                                    Real-time
                                </div>
                            </div>
                            <Text strong style={{ fontSize: '24px' }}>$18,200.82 <Text type="success" style={{ fontSize: '12px', marginLeft: 8 }}>↑ 8.24%</Text></Text>
                        </div>
                        <Space>
                            <Select defaultValue="weekly" style={{ width: 100 }} bordered={false}>
                                <Select.Option value="weekly">Weekly</Select.Option>
                                <Select.Option value="monthly">Monthly</Select.Option>
                            </Select>
                            <Button type="text" icon={<Filter size={16} />} />
                        </Space>
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
                </Card>

                {/* KPI: Low Stock Alerts */}
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative" bordered={false} bodyStyle={{ padding: 32, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <AlertCircle size={120} className="text-white" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                Critical Alert
                            </div>
                            <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest text-right leading-tight">
                                Inventory<br />Status
                            </span>
                        </div>
                        <Text style={{ color: '#a1a1aa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }} strong>Low Stock Items</Text>
                        <Title style={{ margin: 0, color: 'white', fontSize: '48px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24 }}>12 <span className="text-sm font-medium text-zinc-600 uppercase tracking-widest ml-2">SKUs</span></Title>

                        <div className="flex-1 space-y-4 mb-8">
                            {['Fresh Milk', 'Wheat Bread', 'Emerald Velvet'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between pb-3 border-b border-zinc-800 last:border-0">
                                    <Text style={{ color: '#d4d4d8', fontSize: '12px' }} strong>{item}</Text>
                                    <Text style={{ color: '#f87171', fontSize: '12px' }} strong>2 left</Text>
                                </div>
                            ))}
                        </div>

                        <Button size="large" style={{ width: '100%', borderRadius: 16, backgroundColor: 'white', color: '#18181b', fontWeight: 600, border: 'none' }} className="shadow-lg hover:bg-zinc-100 mt-auto">
                            RESTOCK INVENTORY
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Products */}
                <Card title={<Space><Title level={5} style={{ margin: 0 }}>Top Products</Title></Space>} extra={<div className="p-2 bg-gray-50 rounded-lg"><Package size={16} className="text-gray-400" /></div>} bordered={false} className="shadow-sm">
                    <List
                        itemLayout="horizontal"
                        dataSource={productsData}
                        renderItem={item => (
                            <List.Item className="group hover:bg-gray-50/50 transition-colors cursor-pointer px-4 rounded-xl border-b-0">
                                <List.Item.Meta
                                    avatar={<img src={item.image} className="size-12 rounded-lg object-cover" />}
                                    title={<Text strong style={{ fontSize: '14px' }}>{item.name}</Text>}
                                    description={<Text type="secondary" style={{ fontSize: '12px' }}>{item.sold}</Text>}
                                />
                                <div className="text-right">
                                    <Text strong style={{ display: 'block' }}>{item.price}</Text>
                                    <Text type="success" style={{ fontSize: '10px' }} strong>+12%</Text>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>

                {/* Recent Orders */}
                <Card className="lg:col-span-2 shadow-sm" bordered={false} bodyStyle={{ padding: 0 }}
                    title={
                        <div className="flex items-center gap-3 py-2">
                            <Title level={5} style={{ margin: 0 }}>Live Orders</Title>
                            <span className="px-2 py-0.5 bg-zinc-900 text-white rounded text-[10px] font-bold uppercase tracking-widest">
                                Processing
                            </span>
                        </div>
                    }
                    extra={
                        <Button type="text" icon={<Filter size={14} />} size="small" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="text-gray-400 font-bold">Filter</Button>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={recentOrdersData}
                        pagination={false}
                        rowKey="id"
                        className="custom-table"
                    />
                </Card>
            </div>
        </div>
    );
}
