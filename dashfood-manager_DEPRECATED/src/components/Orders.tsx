import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Store,
  Zap,
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  Check,
  Info,
  Clock,
  MapPin,
  ExternalLink,
  ChevronUp,
  Filter,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';
import { supabase } from '../lib/supabase';
import { orderService } from '../services/orderService';

type OrderTab = 'all' | 'active' | 'unfulfilled' | 'history';

interface Order {
  id: string;
  customer_name: string;
  fulfillment_type: 'Pickup' | 'Delivery';
  status: string;
  created_at: string;
  total_amount: number;
  external_order_id?: string;
  store_id: string;
}

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return date.toLocaleDateString();
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    case 'preparing':
    case 'in_progress': return "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
    case 'ready': return "text-[#00ff90] bg-[#00ff90]/10 border-[#00ff90]/20 shadow-[0_0_15px_rgba(0,255,144,0.1)]";
    case 'completed': return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    case 'unfulfilled':
    case 'cancelled': return "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    default: return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  }
};

const PlatformBadge = ({ type }: { type: 'Uber' | '1st' | 'Med' }) => {
  const styles = {
    Uber: "bg-black text-[#00ff90] border-zinc-800",
    '1st': "bg-black text-white border-zinc-800",
    Med: "bg-zinc-100 text-zinc-600 border-transparent"
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", styles[type])}>
      {type}
    </span>
  );
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [activeFilter, setActiveFilter] = useState('All orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const STORE_ID = '476e91d7-3b2a-4e83-680a-7f61ff95bf3c';

  useEffect(() => {
    fetchInitialOrders();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${STORE_ID}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(current => [payload.new as Order, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(current => current.map(o => o.id === payload.new.id ? payload.new as Order : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders(current => current.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialOrders = async () => {
    try {
      const data = await orderService.fetchOrders(STORE_ID);
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'in_progress', 'ready'].includes(o.status));
  const historyOrders = orders.filter(o => ['completed', 'cancelled', 'unfulfilled'].includes(o.status));
  const unfulfilledOrders = orders.filter(o => o.status === 'unfulfilled');

  const getDisplayOrders = () => {
    let filtered = orders;
    switch (activeTab) {
      case 'active': filtered = activeOrders; break;
      case 'history': filtered = historyOrders; break;
      case 'unfulfilled': filtered = unfulfilledOrders; break;
    }

    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== 'All orders') {
      filtered = filtered.filter(o => {
        if (activeFilter === 'New') return o.status === 'pending';
        if (activeFilter === 'Preparing') return o.status === 'preparing' || o.status === 'in_progress';
        if (activeFilter === 'Ready for Pickup') return o.status === 'ready' && o.fulfillment_type === 'Pickup';
        if (activeFilter === 'Delivering') return o.status === 'ready' && o.fulfillment_type === 'Delivery';
        return true;
      });
    }

    return filtered;
  };

  const filters = [
    { label: 'All orders', count: orders.length },
    { label: 'New', count: orders.filter(o => o.status === 'pending').length },
    { label: 'Preparing', count: orders.filter(o => o.status === 'preparing' || o.status === 'in_progress').length },
    { label: 'Ready for Pickup', count: orders.filter(o => o.status === 'ready' && o.fulfillment_type === 'Pickup').length },
    { label: 'Delivering', count: orders.filter(o => o.status === 'ready' && o.fulfillment_type === 'Delivery').length },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search and Action Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="relative flex-1 max-w-xl group">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00ff90] transition-colors" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-white border border-transparent rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-[#00ff90]/10 focus:border-[#00ff90]/30 outline-none transition-all shadow-sm group-hover:shadow-md"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-zinc-100 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm">
            <Filter size={18} className="text-zinc-400" />
            Advanced Filters
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-xl shadow-black/10">
            <Zap size={18} className="text-[#00ff90]" />
            Export Data
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white p-2 rounded-[28px] shadow-sm border border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: 'active', label: 'Active Pipeline', count: activeOrders.length },
            { id: 'unfulfilled', label: 'Urgent/Unfulfilled', count: unfulfilledOrders.length, urgent: unfulfilledOrders.length > 0 },
            { id: 'history', label: 'Operation History', count: historyOrders.length },
            { id: 'all', label: 'Global View', count: orders.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderTab)}
              className={cn(
                "px-8 py-3 rounded-[20px] text-[13px] font-black uppercase tracking-wider transition-all relative flex items-center gap-3",
                activeTab === tab.id ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black hover:bg-zinc-50"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-lg text-[10px] transform transition-all",
                activeTab === tab.id ? "bg-[#00ff90] text-black" : "bg-zinc-100 text-zinc-400"
              )}>
                {tab.count}
              </span>
              {tab.urgent && <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white -translate-y-1 translate-x-1 animate-pulse" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 px-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Fleet Load</span>
            <span className="text-[14px] font-black text-black">82% Capacity</span>
          </div>
          <div className="w-[80px] h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="w-[82%] h-full bg-[#00ff90] rounded-full" />
          </div>
        </div>
      </div>

      {/* Modern Filter Pills */}
      <div className="flex items-center gap-4 py-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveFilter(filter.label)}
            className={cn(
              "px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all glass border",
              activeFilter === filter.label
                ? "bg-black text-white border-black shadow-lg shadow-black/10"
                : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
            )}
          >
            {filter.label} <span className="ml-2 opacity-50">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Order Display Area */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#00ff90]/20 border-t-[#00ff90] rounded-full animate-spin" />
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Initalizing Hub...</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {getDisplayOrders().length > 0 ? (
              getDisplayOrders().map((order, i) => (
                <motion.div
                  layout
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="card-premium p-6 border-none group hover:bg-black transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-8 flex-1">
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <PlatformBadge type="Uber" />
                          <span className="text-[11px] font-black text-zinc-400 group-hover:text-zinc-500 uppercase tracking-[0.15em]">ID: #{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-lg font-black text-black group-hover:text-white transition-colors">{order.customer_name || 'Anonymous Fleet'}</h3>
                      </div>

                      <div className="h-10 w-[1px] bg-zinc-100 group-hover:bg-zinc-800 transition-colors" />

                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-500">
                          <MapPin size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.fulfillment_type}</span>
                        </div>
                        <span className="text-[11px] font-bold text-black group-hover:text-white transition-colors">Lynwood Cluster</span>
                      </div>

                      <div className="h-10 w-[1px] bg-zinc-100 group-hover:bg-zinc-800 transition-colors" />

                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            order.status === 'pending' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" :
                              order.status === 'ready' ? "bg-[#00ff90] shadow-[0_0_8px_rgba(0,255,144,0.5)]" : "bg-zinc-300"
                          )} />
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                            getStatusStyles(order.status)
                          )}>
                            {order.status.replace('_', ' ')}
                          </span>
                          {order.status === 'pending' && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">SLA Alert</span>}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-500">Received {formatRelativeTime(order.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Payload</span>
                        <span className="text-xl font-black text-black group-hover:text-[#00ff90] transition-colors leading-none tracking-tight">£{order.total_amount.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.status === 'pending' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'preparing'); }}
                            className="px-6 py-3 bg-[#00ff90] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#00ff90]/20"
                          >
                            Accept
                          </button>
                        )}
                        {['preparing', 'in_progress'].includes(order.status) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'ready'); }}
                            className="px-6 py-3 bg-[#00ff90] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#00ff90]/20"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'completed'); }}
                            className="px-6 py-3 bg-[#00ff90] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#00ff90]/20"
                          >
                            Complete
                          </button>
                        )}
                        <button className="p-3 bg-zinc-50 group-hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300">
                  <ShoppingBag size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-zinc-400">No active operational traffic</h4>
                  <p className="text-sm font-medium text-zinc-400">All orders are historically archived or currently silent.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Orders;
