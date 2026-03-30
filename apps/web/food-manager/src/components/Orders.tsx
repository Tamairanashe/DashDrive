import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Search,
    Filter,
    Clock,
    Calendar,
    AlertCircle,
    ChevronRight,
    Phone,
    MessageSquare,
    CheckCircle2,
    MoreVertical,
    X,
    Truck,
    CreditCard,
    User,
    MapPin,
    ClipboardList,
    ArrowLeft,
    RefreshCw,
    TrendingUp,
    ShoppingBag,
    Star,
    Zap,
    Timer,
    Terminal,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Card, Button, Badge } from './ui';

// --- Mock Data ---

const LIVE_ORDERS = [
    {
        id: '12493',
        customer: 'Elena P.',
        status: 'received',
        time: 'Just now',
        items: [
            { name: 'Margherita Pizza', price: 14.99 },
            { name: 'Coke Zero', price: 2.50 }
        ],
        total: 17.49,
        itemCount: 2,
        estReady: "1:15 PM"
    },
    {
        id: '12492',
        customer: 'Michael R.',
        status: 'accepted',
        time: '2 min ago',
        items: [
            { name: 'Pepperoni Pizza', mods: ['extra cheese'], price: 16.99 },
            { name: 'Caesar Salad', mods: ['no croutons'], price: 7.99 }
        ],
        total: 31.50,
        itemCount: 2,
        priority: true,
        specialRequest: "Please add napkins - allergic to nuts",
        estReady: "12:55 PM",
        customerInfo: {
            phone: "(555) 123-4567",
            email: "michael.r@email.com",
            history: "Jan 2023 • 23 orders • ★4.8 avg"
        },
        delivery: {
            address: "123 Main St, Apt 4B, San Francisco, CA 94105",
            instructions: "Ring bell, leave at door if no answer"
        }
    },
    {
        id: '12491',
        customer: 'Sarah J.',
        status: 'preparing',
        time: '8 min ago',
        items: [
            { name: 'Supreme Pizza', count: 2, price: 35.98 },
            { name: 'Garlic Bread', price: 4.99 },
            { name: '2-Liter Soda', price: 1.78 }
        ],
        total: 42.75,
        itemCount: 4,
        estReady: "1:05 PM"
    },
    {
        id: '12494',
        customer: 'James L.',
        status: 'ready',
        time: '12 min ago',
        items: [
            { name: 'BBQ Wings', count: 1, price: 12.99 }
        ],
        total: 12.99,
        itemCount: 1,
        estReady: "Ready"
    },
    {
        id: '12489',
        customer: 'David K.',
        status: 'late',
        time: '15 min ago',
        items: [
            { name: 'Pepperoni Pizza', price: 16.99 }
        ],
        total: 16.99,
        itemCount: 1,
        estReady: "12:45 PM (now)"
    }
];

const SCHEDULED_ORDERS = [
    {
        id: '12495',
        customer: 'Emma W.',
        status: 'scheduled',
        time: '2:30 PM',
        itemsCount: 4,
        total: 58.50,
        type: 'Catering'
    }
];

const COMPLETED_ORDERS = [
    { id: '12490', customer: 'Alex T.', items: 1, total: 13.99, status: 'Delivered', time: '12:30 PM' },
    { id: '12489_old', customer: 'David K.', items: 1, total: 16.99, status: 'Delivered', time: '12:15 PM', late: true },
    { id: '12488', customer: 'Emily R.', items: 2, total: 24.50, status: 'Delivered', time: '11:45 AM' }
];

const ORDER_ISSUES = [
    {
        id: '12478',
        type: 'Missing item',
        time: '45 min ago',
        description: "Customer reported missing garlic bread. Awaiting resolution.",
        customer: 'John D.',
        total: 32.50,
        status: 'pending'
    },
    {
        id: '12465',
        type: 'Quality issue',
        time: '2 hours ago',
        description: "Pizza was cold and undercooked",
        customer: 'Sarah K.',
        total: 24.75,
        status: 'investigating'
    }
];

const UNFULFILLED_ORDERS = [
    {
        id: '12480',
        customer: 'Robert M.',
        status: 'unfulfilled',
        time: '30 min ago',
        reason: 'Item unavailable',
        items: [{ name: 'Truffle Burger', price: 14.99 }],
        total: 14.99,
        itemCount: 1
    }
];

// --- Components ---

const LoadingState = ({ progress }: { progress: number }) => (
    <div className="flex-1 flex items-center justify-center bg-transparent min-h-[500px]">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl p-8 bg-white border-2 border-zinc-100 shadow-2xl rounded-[32px]"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                    <Terminal size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Syncing Live Order Stream</h2>
                    <p className="text-sm text-zinc-500 font-medium">Main Street Kitchen</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                        <span>Loading progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-zinc-900"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'Connection established', complete: progress > 25 },
                        { label: 'Syncing live orders from Uber Eats', complete: progress > 50 },
                        { label: 'Validating scheduled assignments', complete: progress > 75 },
                        { label: 'Telemetry aggregate (100%)', complete: progress >= 100 },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium">
                            {item.complete ? (
                                <div className="text-emerald-500"><Check size={16} /></div>
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                            )}
                            <span className={cn(item.complete ? "text-zinc-900" : "text-zinc-400 text-[10px] lowercase")}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    </div>
);

const OrderCard = ({ order, onClick, onStatusUpdate }: any) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-zinc-400 transition-all cursor-pointer group",
            order.status === 'late' && "border-red-200 ring-1 ring-red-50"
        )}
        onClick={() => onClick(order)}
    >
        <div className="p-4 flex justify-between items-start border-b border-zinc-50 bg-zinc-50/30">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400">🕒 #{order.id}</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">• {order.time}</span>
                    {order.priority && (
                        <Badge variant="error" className="scale-75 origin-left px-1 py-0"><Zap size={10} className="mr-0.5" /> PRIORITY</Badge>
                    )}
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">{order.customer}</h4>
            </div>
            <Badge
                variant={
                    order.status === 'CONFIRMED' || order.status === 'received' ? 'warning' :
                        order.status === 'PREPARING' || order.status === 'preparing' ? 'info' :
                            order.status === 'READY' || order.status === 'ready' ? 'success' :
                                order.status === 'DELIVERED' || order.status === 'completed' ? 'neutral' :
                                    order.status === 'CANCELLED' ? 'error' : 'neutral'
                }
            >
                {order.status.toUpperCase()}
            </Badge>
        </div>

        <div className="p-4 space-y-3">
            {order.status === 'received' && (
                <div className="bg-amber-500 text-white rounded p-2 text-[10px] font-semibold animate-pulse flex items-center justify-between uppercase tracking-widest">
                    <span>NEW ORDER RECEIVED</span>
                    <Clock size={10} />
                </div>
            )}
            {order.status === 'unfulfilled' && order.reason && (
                <div className="bg-amber-50 rounded p-2 text-[10px] text-amber-700 border border-amber-100 border-dashed mb-2">
                    <span className="font-semibold uppercase tracking-tight">Reason:</span> {order.reason}
                </div>
            )}
            <div className="space-y-1">
                {order.items?.slice(0, 2).map((item: any, i: number) => (
                    <p key={i} className="text-xs text-zinc-600 flex justify-between">
                        <span>• {item.count || 1}x {item.name}</span>
                        {item.mods && <span className="text-zinc-400 font-normal italic">({item.mods[0]})</span>}
                    </p>
                ))}
                {order.itemCount > 2 && <p className="text-[10px] text-zinc-400 font-medium pl-3">+ {order.itemCount - 2} more items</p>}
            </div>

            {order.specialRequest && (
                <div className="bg-amber-50 rounded p-2 text-[10px] text-amber-700">
                    <span className="font-semibold">Special:</span> "{order.specialRequest}"
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Phone size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><MessageSquare size={14} /></Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-semibold">VIEW</Button>
                    {order.status === 'CONFIRMED' || order.status === 'received' ? (
                        <Button
                            variant="primary"
                            size="sm"
                            className="h-7 px-2 text-[10px] font-semibold bg-amber-600 hover:bg-amber-700"
                            onClick={(e: any) => { e.stopPropagation(); onStatusUpdate(order.id, 'preparing'); }}
                        >
                            ACCEPT
                        </Button>
                    ) : order.status === 'READY' || order.status === 'ready' ? (
                        <Button
                            variant="primary"
                            size="sm"
                            className="h-7 px-2 text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700"
                            onClick={(e: any) => { e.stopPropagation(); onStatusUpdate(order.id, 'completed'); }}
                        >
                            HANDOVER
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            className="h-7 px-2 text-[10px] font-semibold"
                            onClick={(e: any) => { e.stopPropagation(); onStatusUpdate(order.id, 'ready'); }}
                        >
                            MARK READY
                        </Button>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

const OrderDetailModal = ({ order, isOpen, onClose, onAction }: any) => {
    if (!order) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="bg-zinc-50 w-full max-w-xl h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-white border-b border-zinc-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-3">
                                    <Button variant="ghost" size="icon" onClick={onClose} className="-ml-2"><ArrowLeft size={20} /></Button>
                                    ORDER #{order.id} DETAILS
                                </h2>
                                <p className="text-xs text-zinc-500 font-medium ml-11">Main Street Kitchen • Uber Eats</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Status Timeline */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Status Timeline</h3>
                                <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100">
                                    <div className="flex items-center gap-4 pl-8 relative">
                                        <div className="absolute left-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center -translate-x-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-900">12:34 PM • Order received</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 pl-8 relative">
                                        <div className="absolute left-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center -translate-x-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-900">12:35 PM • Accepted</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 pl-8 relative">
                                        <div className="absolute left-0 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-sm flex items-center justify-center -translate-x-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-900">12:40 PM • Preparing</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 pl-8 relative">
                                        <div className="absolute left-0 w-5 h-5 rounded-full bg-zinc-200 border-4 border-white shadow-sm flex items-center justify-center -translate-x-1" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-400 italic">Ready for pickup • Pending</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 text-white rounded-xl p-4 flex justify-between items-center shadow-lg shadow-zinc-900/10">
                                    <div>
                                        <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">Current Status</p>
                                        <p className="text-sm font-semibold flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                            PREPARING
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider">Est. Ready</p>
                                        <p className="text-sm font-semibold text-amber-400 mt-1">{order.estReady}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Info Sections */}
                            <div className="grid grid-cols-2 gap-6">
                                <section className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Customer</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-zinc-900">{order.customer}</p>
                                        <p className="text-xs text-zinc-500">{order.customerInfo?.phone}</p>
                                        <p className="text-xs text-zinc-400 mt-1">{order.customerInfo?.history}</p>
                                    </div>
                                </section>
                                <section className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Delivery</h3>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                                            {order.delivery?.address}
                                        </p>
                                        <div className="bg-zinc-200/50 p-2 rounded text-[10px] text-zinc-500 mt-1 italic">
                                            "{order.delivery?.instructions}"
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Order Items */}
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Order Items</h3>
                                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
                                    {order.items?.map((item: any, i: number) => (
                                        <div key={i} className={cn("p-4 flex justify-between items-start", i !== order.items.length - 1 && "border-b border-zinc-100")}>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center font-semibold text-zinc-400 text-xs">{item.count || 1}x</div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                                                    {item.mods?.map((mod: string, j: number) => (
                                                        <p key={j} className="text-[10px] text-zinc-400 font-medium italic">Mod: {mod}</p>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-900">${item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                {order.specialRequest && (
                                    <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Special Requests</p>
                                        <p className="text-xs text-red-800 font-medium italic">"{order.specialRequest}"</p>
                                    </div>
                                )}
                            </section>

                            {/* Summary */}
                            <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-zinc-900">$24.98</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Delivery Fee</span>
                                    <span>$2.99</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Service Fee</span>
                                    <span>$1.53</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Tax</span>
                                    <span>$2.00</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-zinc-100 text-sm font-bold text-zinc-900">
                                    <span>TOTAL</span>
                                    <span className="text-lg">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 pt-2 text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                    <CreditCard size={12} /> Payment: Visa ••4242 • Paid
                                </div>
                            </section>
                        </div>

                        {/* Actions Footer */}
                        <div className="p-6 bg-white border-t border-zinc-200">
                            <div className="grid grid-cols-3 gap-3">
                                <Button className="col-span-2 h-12" onClick={() => onAction('ready')}>
                                    <CheckCircle2 size={18} className="mr-2" /> MARK READY
                                </Button>
                                <Button variant="outline" className="h-12" onClick={() => onAction('extend')}>
                                    <Timer size={18} className="mr-2" /> EXTEND
                                </Button>
                                <Button variant="outline" className="h-12" onClick={() => onAction('call')}>
                                    <Phone size={18} className="mr-2" /> CALL
                                </Button>
                                <Button variant="outline" className="h-12" onClick={() => onAction('message')}>
                                    <MessageSquare size={18} className="mr-2" /> MESSAGE
                                </Button>
                                <Button variant="danger" className="h-12" onClick={() => onAction('refund')}>
                                    REPORT / REFUND
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export const Orders = ({ token, merchant }: { token: string | null, merchant: any }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [syncProgress, setSyncProgress] = useState(0);
    const [activeFilter, setActiveFilter] = useState('live');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showToast, setShowToast] = useState<string | null>(null);

    // Live state for orders
    const [liveOrders, setLiveOrders] = useState<any[]>([]);
    const [completedHistory, setCompletedHistory] = useState<any[]>([]);

    const storeId = merchant?.stores?.[0]?.id;

    useEffect(() => {
        if (token && storeId) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [token, storeId, activeFilter]);

    const fetchOrders = async () => {
        try {
            const params: any = {};
            if (activeFilter === 'completed') params.status = 'DELIVERED';
            else if (activeFilter === 'live') params.status = 'CONFIRMED,PREPARING,READY';

            const data = await api.orders.list(params);
            setLiveOrders(data.filter((o: any) => o.status !== 'DELIVERED'));
            setCompletedHistory(data.filter((o: any) => o.status === 'DELIVERED'));
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            let apiStatus = newStatus;
            if (newStatus === 'preparing') apiStatus = 'PREPARING';
            if (newStatus === 'ready') apiStatus = 'READY';
            if (newStatus === 'completed') apiStatus = 'DELIVERED';

            await api.orders.updateStatus(orderId, apiStatus);
            setShowToast(`Order #${orderId} updated to ${newStatus}.`);
            fetchOrders();
        } catch (err) {
            console.error('Failed to update status:', err);
            setShowToast(`Error: Failed to update order #${orderId}`);
        }
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleAction = (type: string) => {
        if (selectedOrder) {
            if (type === 'ready') handleStatusUpdate(selectedOrder.id, 'ready');
            else setShowToast(`Action "${type}" processed successfully!`);
        }
        setTimeout(() => setShowToast(null), 3000);
        setSelectedOrder(null);
    };

    if (isLoading) return <LoadingState progress={syncProgress} />;

    const ordersToDisplay = liveOrders.filter(o =>
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.includes(searchQuery)
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase mb-1">Orders Command</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs font-black text-zinc-400 tracking-widest uppercase">System Online // Monitoring Live Tickets</p>
                    </div>
                </div>
            </div>

            {/* Search and Global Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['live', 'scheduled', 'unfulfilled', 'completed', 'issues'].map((filter) => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? 'primary' : 'outline'}
                            size="sm"
                            className="capitalize whitespace-nowrap"
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                            <span className={cn(
                                "ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                                activeFilter === filter ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                            )}>
                                {filter === 'live' ? liveOrders.length :
                                    filter === 'scheduled' ? SCHEDULED_ORDERS.length :
                                        filter === 'unfulfilled' ? UNFULFILLED_ORDERS.length :
                                            filter === 'completed' ? completedHistory.length : ORDER_ISSUES.length}
                            </span>
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search order #, customer..."
                            className="pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9"><Filter size={18} /></Button>
                    <Button variant="outline" size="icon" className="h-9 w-9"><RefreshCw size={18} /></Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeFilter === 'live' && (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Live Orders
                            </h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={12} /> Auto-refreshing in 30s
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ordersToDisplay.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onClick={setSelectedOrder}
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            ))}
                        </div>

                        {/* Sub-sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                            <Card title="Scheduled Orders" headerAction={<Button variant="ghost" size="sm" className="text-xs">VIEW ALL</Button>}>
                                <div className="space-y-3">
                                    {SCHEDULED_ORDERS.map(order => (
                                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-amber-50 flex items-center justify-center text-amber-600">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900">{order.customer} <span className="text-zinc-400 font-medium">#{order.id}</span></p>
                                                    <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">{order.time} • {order.itemsCount} items • {order.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-semibold">CONTACT</Button>
                                                <Button variant="primary" size="sm" className="h-8 px-3 text-[10px] font-semibold">PREPARE</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Recent Issues" headerAction={<Button variant="ghost" size="sm" className="text-xs">VIEW ALL</Button>} className="border-red-100 bg-red-50/10">
                                <div className="space-y-3">
                                    {ORDER_ISSUES.map(issue => (
                                        <div key={issue.id} className="p-3 rounded-lg border border-red-100 bg-white shadow-sm flex items-start gap-4">
                                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                                <AlertCircle size={16} />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <div className="flex justify-between">
                                                    <p className="text-[10px] font-semibold text-red-600 uppercase tracking-widest">#{issue.id} • {issue.type}</p>
                                                    <span className="text-[10px] text-zinc-400 font-medium">{issue.time}</span>
                                                </div>
                                                <p className="text-xs font-semibold text-zinc-900">{issue.description}</p>
                                                <div className="flex gap-2 pt-2">
                                                    <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-semibold">RESOLVE</Button>
                                                    <Button variant="danger" size="sm" className="h-7 px-2 text-[10px] font-semibold">REFUND</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Today's Summary Stat Bar */}
                        <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl flex flex-wrap gap-8 justify-between items-center">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-widest mb-1">Total Orders</p>
                                    <p className="text-2xl font-semibold">47</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-widest mb-1">Revenue</p>
                                    <p className="text-2xl font-semibold">$1,245.00</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-widest mb-1">Avg Prep Time</p>
                                    <p className="text-2xl font-semibold">18 min</p>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-[10px] text-zinc-400 uppercase font-semibold tracking-widest mb-1">On-time Rate</p>
                                    <p className="text-2xl font-semibold text-emerald-400">92%</p>
                                </div>
                            </div>
                            <Button className="bg-white text-zinc-900 hover:bg-zinc-200">
                                <TrendingUp size={16} className="mr-2" /> VIEW ANALYTICS
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeFilter === 'completed' && (
                    <motion.div
                        key="completed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <Card title="Today's History" headerAction={<Button variant="outline" size="sm">EXPORT REPORT</Button>}>
                            <div className="overflow-x-auto -mx-6">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest bg-zinc-50 border-y border-zinc-100">
                                        <tr>
                                            <th className="px-6 py-4">Time</th>
                                            <th className="px-6 py-4">Order #</th>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Items</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {completedHistory.map(order => (
                                            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-6 py-4 text-xs font-semibold text-zinc-500">{order.time}</td>
                                                <td className="px-6 py-4 text-xs font-semibold text-zinc-900">#{order.id}</td>
                                                <td className="px-6 py-4 text-xs font-semibold text-zinc-900">{order.customer}</td>
                                                <td className="px-6 py-4 text-xs text-zinc-500">{order.items}</td>
                                                <td className="px-6 py-4 text-xs font-semibold text-zinc-900 text-right">${order.total}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge variant="success">{order.status}</Badge>
                                                    {order.late && <span className="block text-[8px] text-red-500 font-semibold uppercase mt-1">(Late)</span>}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button variant="ghost" size="sm" className="text-xs font-bold">VIEW</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeFilter === 'scheduled' && (
                    <motion.div
                        key="scheduled"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} /> Scheduled Orders
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {SCHEDULED_ORDERS.map(order => (
                                <OrderCard key={order.id} order={{ ...order, status: 'scheduled' }} onClick={setSelectedOrder} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeFilter === 'unfulfilled' && (
                    <motion.div
                        key="unfulfilled"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={16} /> Unfulfilled Orders
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {UNFULFILLED_ORDERS.length > 0 ? (
                                UNFULFILLED_ORDERS.map(order => (
                                    <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-zinc-100">
                                    <ShoppingBag className="mx-auto text-zinc-200 mb-4" size={48} />
                                    <p className="text-zinc-500 font-medium">No unfulfilled orders found.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeFilter === 'issues' && (
                    <motion.div
                        key="issues"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={16} className="text-red-500" /> Open Issues
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {ORDER_ISSUES.map(issue => (
                                <Card key={issue.id} className="border-red-100 bg-red-50/5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-zinc-900">Order #{issue.id}</p>
                                                    <Badge variant="error" className="scale-75 origin-left">{issue.type}</Badge>
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-1 font-medium">{issue.customer} • {issue.time}</p>
                                                <p className="text-sm text-zinc-700 mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-100 border-dashed">
                                                    "{issue.description}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold">VIEW ORDER</Button>
                                            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-semibold">CONTACT CUSTOMER</Button>
                                            <Button variant="danger" size="sm" className="h-9 px-4 text-xs font-semibold">RESOLVE / REFUND</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onAction={handleAction}
            />

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-zinc-800"
                    >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-semibold">{showToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
