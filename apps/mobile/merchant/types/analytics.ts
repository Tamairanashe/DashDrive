export interface DashboardStats {
    revenue: number;
    todayOrders: number;
    pendingOrders: number;
    lowStockAlerts: number;
    recentOrders: OrderPreview[];
}

export interface OrderPreview {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
        name: string;
        quantity: number;
    }>;
}
