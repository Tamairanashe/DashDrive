import React, { useState } from 'react';
import { 
  Clock, 
  User, 
  ChevronRight, 
  MoreVertical, 
  AlertTriangle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

interface Order {
  id: string;
  customer: string;
  items: { name: string; qty: number; modifiers?: string[] }[];
  status: 'new' | 'preparing' | 'ready';
  time: string;
  type: 'delivery' | 'pickup';
  isUrgent?: boolean;
}

const initialOrders: Order[] = [
  { 
    id: '4829', 
    customer: 'John Doe', 
    items: [{ name: 'Classic Burger', qty: 2, modifiers: ['No Onions', 'Extra Cheese'] }, { name: 'Fries', qty: 1 }],
    status: 'new',
    time: '2m',
    type: 'delivery',
    isUrgent: true
  },
  { 
    id: '4830', 
    customer: 'Sarah Smith', 
    items: [{ name: 'Chicken Salad', qty: 1 }],
    status: 'preparing',
    time: '12m',
    type: 'pickup'
  },
  { 
    id: '4831', 
    customer: 'Mike Ross', 
    items: [{ name: 'Veggie Pizza', qty: 1, modifiers: ['Gluten Free'] }],
    status: 'ready',
    time: '25m',
    type: 'delivery'
  }
];

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columns = [
    { id: 'new', label: 'New Orders', color: 'bg-blue-500' },
    { id: 'preparing', label: 'In Progress', color: 'bg-orange-500' },
    { id: 'ready', label: 'Ready for Pickup', color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kitchen Display System (KDS)</h1>
        <div className="flex gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
            <AlertTriangle size={18} />
            DELAY PREP TIME
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-4 bg-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", col.color)}></div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">{col.label}</h3>
              </div>
              <span className="bg-white px-2 py-0.5 rounded-lg text-xs font-bold border border-gray-200">
                {orders.filter(o => o.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {orders.filter(o => o.status === col.id).map((order) => (
                <motion.div
                  layoutId={order.id}
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-orange-300 transition-colors group relative overflow-hidden",
                    order.isUrgent && "border-l-4 border-l-red-500"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono font-bold text-gray-400">#{order.id}</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Timer size={10} />
                      {order.time}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-sm mb-1">{order.customer}</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                      order.type === 'delivery' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {order.type}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Sidebar */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-500">{selectedOrder.customer} • {selectedOrder.type}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm">
                          {item.qty}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{item.name}</p>
                          {item.modifiers && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.modifiers.map((mod, j) => (
                                <span key={j} className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100 italic">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium">Order Received</span>
                      <span className="ml-auto text-xs text-gray-400">11:32 AM</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Started Preparing</span>
                      <span className="ml-auto text-xs text-gray-400">11:35 AM</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button className="py-4 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors">
                  PRINT TICKET
                </button>
                <button className="py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  MARK AS READY
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kitchen;
