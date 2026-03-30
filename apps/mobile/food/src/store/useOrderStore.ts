import { create } from "zustand";

export interface Order {
    id: string;
    external_order_id?: string;
    tenant_id: string;
    store_id: string;
    customer_name: string;
    status: 'new' | 'in_progress' | 'ready' | 'completed' | 'unfulfilled';
    total_amount: number;
    created_at: string;
    accepted_at?: string;
    [key: string]: any;
}

interface OrderStore {
    orders: Order[];
    incomingOrder: Order | null;
    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (order: Order) => void;
    removeOrder: (orderId: string) => void;
    setIncomingOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    orders: [],
    incomingOrder: null,
    setOrders: (orders) => set({ orders }),
    addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    })),
    updateOrder: (updatedOrder) => set((state) => ({
        orders: state.orders.map((o) => o.id === updatedOrder.id ? updatedOrder : o)
    })),
    removeOrder: (orderId) => set((state) => ({
        orders: state.orders.filter((o) => o.id !== orderId)
    })),
    setIncomingOrder: (order) => set({ incomingOrder: order }),
}));
