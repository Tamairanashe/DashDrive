import {
    TrendingUp, TrendingDown, ClipboardList, Box,
    XCircle, Search, Filter, MoreHorizontal,
    ChevronLeft, ChevronRight, Truck, AlertCircle, FileText, Printer, Check,
    Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { OrderDetail } from './OrderDetail';
import { StatusBadge } from './common/StatusBadge';
import { EmptyState } from './common/EmptyState';
import { TableRowSkeleton } from './common/SkeletonLoader';
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

const ordersData = [
    { id: '#GR-284730', urgency: 'Expedited', shipBy: 'EOD', product: 'Coconut Clarity', items: 4, customer: 'Darrell Steward', customerType: 'New Customer', date: 'Feb 21, 2026', amount: '$153.50', method: 'Paid by Mastercard', status: 'Incoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Darrell', productImg: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=100&h=100&fit=crop' },
    { id: '#GR-284640', urgency: 'Normal', shipBy: 'Tomorrow', product: 'Fresh Butter', items: 3, customer: 'Esther Howard', customerType: 'Pro Customer', date: 'Feb 21, 2026', amount: '$42.00', method: 'Cash on Delivery', status: 'Processing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Esther', productImg: 'https://images.unsplash.com/photo-1549392848-d42edee1af20?w=100&h=100&fit=crop' },
    { id: '#GR-284530', urgency: 'Overdue', shipBy: 'Yesterday', product: 'Fresh Rice', items: 3, customer: 'Dianne Russell', customerType: 'Pro Customer', date: 'Feb 20, 2026', amount: '$135.00', method: 'Paid by Mastercard', status: 'Incoming', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dianne', productImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop' },
];

export function Orders() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'details'>('list');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleOrderClick = (id: string) => {
        setSelectedOrderId(id);
        setView('details');
    };

    const toggleSelect = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    if (view === 'details' && selectedOrderId) {
        return <OrderDetail orderId={selectedOrderId} onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Orders Management"
                description="Monitor and fulfill incoming customer orders in real-time."
                icon={ClipboardList}
                actions={
                    <>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200">
                            <Download size={16} />
                            Export Orders
                        </button>
                    </>
                }
            />

            {/* Stats Section */}
            {/* ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-gray-800 tracking-tighter">{stat.value}</span>
                                <span className={cn(
                                    "text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
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
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-1.5 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all overflow-hidden",
                                        activeTab === tab.id
                                            ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tab.label}
                                        <span className={cn(
                                            "text-[9px] px-1.5 py-0.5 rounded-lg",
                                            activeTab === tab.id ? "bg-gray-100 text-gray-800" : "bg-gray-200/50 text-gray-400"
                                        )}>
                                            {tab.count}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group min-w-[320px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-4 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Order ID, Customer, Items..."
                                    className="bg-gray-50/50 border border-gray-100 focus:border-blue-100 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm w-full outline-none transition-all placeholder:text-gray-300 font-medium"
                                />
                            </div>
                            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-800 hover:bg-gray-100 transition-all">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-6 pl-2">
                                        <input type="checkbox" className="size-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Fulfillment</th>
                                    <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)
                                ) : ordersData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 px-8">
                                            <EmptyState
                                                title="No orders found"
                                                description="When customers place orders, they will appear here in real-time."
                                                action={{
                                                    label: 'Refresh Feed',
                                                    onClick: () => {
                                                        setIsLoading(true);
                                                        setTimeout(() => setIsLoading(false), 1000);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    ordersData.map((order, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50/50 transition-all cursor-default">
                                            <td className="py-6 pl-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => toggleSelect(order.id)}
                                                    className="size-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-6 min-w-[240px]">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0">
                                                        <img src={order.productImg} alt="" className="size-12 rounded-2xl object-cover border border-gray-50 shadow-sm" />
                                                        {order.urgency === 'Expedited' && (
                                                            <div className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full border-2 border-white animate-pulse">
                                                                <AlertCircle size={10} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-[160px]">
                                                        <button
                                                            onClick={() => handleOrderClick(order.id)}
                                                            className="text-sm font-black text-gray-800 leading-tight uppercase tracking-tighter hover:text-blue-600 transition-colors"
                                                        >
                                                            {order.id}
                                                        </button>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={cn(
                                                                "text-[9px] font-black px-1.5 py-0.5 rounded-lg uppercase tracking-tight",
                                                                order.urgency === 'Overdue' ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                                                            )}>
                                                                {order.shipBy}
                                                            </span>
                                                            <span className="text-[10px] text-gray-300 font-bold">{order.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={order.avatar} alt="" className="size-9 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 leading-tight">{order.customer}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">{order.customerType}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="text-xs font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{order.items}</span>
                                            </td>
                                            <td className="py-6">
                                                <p className="text-sm font-black text-gray-800 leading-tight tracking-tighter">{order.amount}</p>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5 uppercase italic">{order.method}</p>
                                            </td>
                                            <td className="py-6 text-center">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-6 text-right relative pr-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status === 'Incoming' && (
                                                        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setShowMenu(showMenu === order.id ? null : order.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-300 hover:text-gray-800 transition-all border border-transparent hover:border-gray-100"
                                                    >
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </div>

                                                {showMenu === order.id && (
                                                    <div className="absolute right-6 top-16 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 w-44 py-2 text-left animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                                        <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                            <Printer size={16} className="text-gray-400" /> Print Slip
                                                        </button>
                                                        <button className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                            <FileText size={16} className="text-gray-400" /> View Details
                                                        </button>
                                                        <div className="h-px bg-gray-50 my-1 mx-2" />
                                                        <button className="w-full px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                                            <XCircle size={16} /> Cancel Order
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-12 pt-10 border-t border-gray-50">
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-all group">
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    className={cn(
                                        "size-10 rounded-2xl text-xs font-black transition-all border",
                                        page === 1 ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-800"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-all group">
                            Next
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
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
