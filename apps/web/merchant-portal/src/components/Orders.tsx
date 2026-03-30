import {
    TrendingUp, TrendingDown, ClipboardList, Box,
    XCircle, Search, Filter, MoreHorizontal,
    Truck, AlertCircle, FileText, Printer, Check,
    Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { OrderDetail } from './OrderDetail';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';

const stats = [
    { label: 'Total New Orders', value: '3,842', trend: '+12%', isPositive: true, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Orders Processing', value: '124', trend: '-2%', isPositive: false, icon: Box, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Shipped', value: '3,487', trend: '+54%', isPositive: true, icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Canceled/Returned', value: '231', trend: '+1%', isPositive: false, icon: Undo2, color: 'text-red-500', bg: 'bg-red-50' },
];

const tabs = [
    { id: 'All', label: 'All Orders', count: 5412 },
    { id: 'Incoming', label: 'Incoming', count: 12, indicator: 'urgent' },
    { id: 'Processing', label: 'Processing', count: 5 },
    { id: 'Delivered', label: 'Delivered', count: 45 },
];



import { Card, Table, Tabs, Input, Button, Dropdown, Space, Typography, Tag } from 'antd';
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;

import { api } from '../api';

interface OrdersProps {
    token: string | null;
    merchant: any;
}

export function Orders({ token, merchant }: OrdersProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [view, setView] = useState<'list' | 'details'>('list');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<React.Key[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    const storeId = merchant?.stores?.[0]?.id;

    useEffect(() => {
        if (token && storeId) {
            fetchOrders();
        } else if (!token) {
            setIsLoading(false);
        }
    }, [token, storeId]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await api.orders.getStoreOrders(token!, storeId);
            const mappedOrders = data.map((o: any) => ({
                id: o.id,
                urgency: o.priority || 'Normal',
                shipBy: o.expectedDelivery ? new Date(o.expectedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'EOD',
                product: o.items?.[0]?.product?.name || 'Multiple Items',
                productImg: o.items?.[0]?.product?.image || 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=100&h=100&fit=crop',
                items: o.items?.length || 0,
                customer: o.user?.name || 'Guest Customer',
                customerType: o.user?.isPro ? 'Pro Customer' : 'New Customer',
                date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: `$${o.totalAmount}`,
                method: o.paymentMethod || 'Paid online',
                status: o.status,
                avatar: o.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${o.user?.id || o.id}`
            }));
            setOrders(mappedOrders);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await api.orders.updateStatus(token!, orderId, status);
            fetchOrders(); // Refresh
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleOrderClick = (id: string) => {
        setSelectedOrderId(id);
        setView('details');
    };

    if (view === 'details' && selectedOrderId) {
        return <OrderDetail orderId={selectedOrderId} onBack={() => setView('list')} />;
    }

    const columns = [
        {
            title: 'Order Details',
            key: 'orderDetails',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <img src={record.productImg} alt="" className="size-12 rounded-2xl object-cover border border-gray-50 shadow-sm" />
                        {record.urgency === 'Expedited' && (
                            <div className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full border-2 border-white animate-pulse">
                                <AlertCircle size={10} />
                            </div>
                        )}
                    </div>
                    <div className="max-w-[160px]">
                        <Button type="link" style={{ padding: 0, fontWeight: 700, color: '#18181b', textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: '14px', lineHeight: 1 }} onClick={() => handleOrderClick(record.id)}>
                            {record.id}
                        </Button>
                        <div className="flex items-center gap-2 mt-1">
                            <Tag color={record.urgency === 'Overdue' ? 'error' : 'default'} style={{ margin: 0, fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '0 6px', border: 'none', borderRadius: '6px' }}>
                                {record.shipBy}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 700 }}>{record.date}</Text>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-3">
                    <img src={record.avatar} alt="" className="size-9 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100" />
                    <div>
                        <Text strong style={{ display: 'block', fontSize: '14px', lineHeight: 1.2 }}>{record.customer}</Text>
                        <Text type="secondary" style={{ fontSize: '10px', fontWeight: 500 }}>{record.customerType}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Qty',
            key: 'qty',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Text style={{ fontSize: '12px', fontWeight: 900, backgroundColor: '#f9fafb', padding: '4px 8px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>{record.items}</Text>
            )
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (_: any, record: any) => (
                <div>
                    <Text strong style={{ display: 'block', fontSize: '14px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{record.amount}</Text>
                    <Text type="secondary" italic style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase' }}>{record.method}</Text>
                </div>
            )
        },
        {
            title: 'Fulfillment',
            key: 'fulfillment',
            align: 'center' as const,
            render: (_: any, record: any) => <StatusBadge status={record.status} />
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: (_: any, record: any) => {
                const items: MenuProps['items'] = [
                    { key: '1', icon: <Printer size={16} />, label: 'Print Slip' },
                    { key: '2', icon: <FileText size={16} />, label: 'View Details', onClick: () => handleOrderClick(record.id) },
                    { type: 'divider' },
                    { key: '3', icon: <XCircle size={16} />, label: 'Cancel Order', danger: true, onClick: () => handleUpdateStatus(record.id, 'CANCELLED') },
                ];

                return (
                    <Space>
                        {record.status === 'PENDING' && (
                            <Button
                                type="text"
                                shape="circle"
                                icon={<Check size={18} className="text-emerald-600" />}
                                className="bg-emerald-50 hover:bg-emerald-600 transition-colors"
                                onClick={() => handleUpdateStatus(record.id, 'CONFIRMED')}
                            />
                        )}
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                            <Button type="text" shape="circle" icon={<MoreHorizontal size={20} />} />
                        </Dropdown>
                    </Space>
                );
            }
        }
    ];

    const tabItems = tabs.map(tab => ({
        key: tab.id,
        label: (
            <div className="flex items-center gap-2">
                <span>{tab.label}</span>
                <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    activeTab === tab.id ? "bg-zinc-100 text-zinc-900" : "bg-zinc-50 text-zinc-400"
                )}>
                    {tab.count}
                </span>
            </div>
        )
    }));

    const rowSelection = {
        selectedRowKeys: selectedOrders,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedOrders(newSelectedRowKeys);
        },
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Orders Management"
                description="Monitor and fulfill incoming customer orders in real-time."
                icon={ClipboardList}
                actions={
                    <Button type="primary" size="large" icon={<Download size={16} />} style={{ borderRadius: 12, fontWeight: 600 }}>
                        Export Orders
                    </Button>
                }
            />

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} hoverable bordered={false} bodyStyle={{ padding: 24 }} className="shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} strong>{stat.label}</Text>
                                <div className="flex items-center gap-2 mt-2">
                                    <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</Title>
                                    <span className={cn(
                                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                                        stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {stat.isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <div className={cn("p-3 rounded-2xl shadow-inner", stat.bg)}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bulk Selection Bar */}
            {selectedOrders.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-8 animate-in slide-in-from-bottom-8 duration-300">
                    <div className="flex items-center gap-2 border-r border-gray-700 pr-8">
                        <span className="bg-blue-600 text-white size-6 rounded-lg flex items-center justify-center text-xs font-bold">
                            {selectedOrders.length}
                        </span>
                        <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">Orders Selected</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Bulk Accept</button>
                        <button className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Print Slips</button>
                        <button className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Export CSV</button>
                        <button
                            onClick={() => setSelectedOrders([])}
                            className="ml-4 text-[10px] font-black uppercase tracking-widest bg-gray-800 px-3 py-1.5 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Orders List Section */}
            <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 24, paddingTop: 16 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <Tabs
                        defaultActiveKey="All"
                        onChange={setActiveTab}
                        items={tabItems}
                        style={{ marginBottom: 0 }}
                        tabBarStyle={{ marginBottom: 0 }}
                    />

                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Order ID, Customer, Items..."
                            prefix={<Search className="text-gray-400 size-4" />}
                            size="large"
                            style={{ width: 320, borderRadius: 12 }}
                        />
                        <Button size="large" icon={<Filter size={18} />} style={{ borderRadius: 12 }} />
                    </div>
                </div>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={orders.filter(o => activeTab === 'All' || o.status === activeTab.toUpperCase())}
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
                    }}
                    rowKey="id"
                    className="custom-table"
                />
            </Card>
        </div>
    );
}

// Minimal missing component
function Undo2({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
    );
}
