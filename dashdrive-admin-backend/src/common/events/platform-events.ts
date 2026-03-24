export enum PlatformEvent {
    // Order Events
    ORDER_CREATED = 'order.created',
    ORDER_CONFIRMED = 'order.confirmed',
    ORDER_PREPARING = 'order.preparing',
    ORDER_READY = 'order.ready',
    ORDER_DELIVERED = 'order.delivered',
    ORDER_CANCELLED = 'order.cancelled',

    // Ride Events
    RIDE_REQUESTED = 'ride.requested',
    RIDE_ASSIGNED = 'ride.assigned',
    RIDE_STARTED = 'ride.started',
    RIDE_COMPLETED = 'ride.completed',

    // Wallet & Payment Events
    WALLET_CREDITED = 'wallet.credited',
    WALLET_DEBITED = 'wallet.debited',
    WITHDRAWAL_REQUESTED = 'withdrawal.requested',
    PAYMENT_SUCCESS = 'payment.success',
    PAYMENT_FAILED = 'payment.failed',

    // System & Ops
    LOW_STOCK_ALERT = 'inventory.low_stock',
    FRAUD_ALERT = 'fraud.alert',
    DRIVER_LOCATION_UPDATED = 'driver.location_updated',
    
    // Admin & Lifecycle
    KYC_SUBMITTED = 'admin.kyc.submitted',
    KYC_VERIFIED = 'admin.kyc.verified',
    SUPPORT_TICKET_CREATED = 'admin.support.ticket_created',
    SUPPORT_TICKET_UPDATED = 'admin.support.ticket_updated',
    AUDIT_LOG_CREATED = 'admin.audit_log.created',
    ENTITY_DIFF_UPDATED = 'admin.entity.diff_updated',
    ALERT_THRESHOLD_EXCEEDED = 'admin.alert.threshold_exceeded',
}

export interface OrderEventPayload {
    orderId: string;
    orderNumber: string;
    merchantId: string;
    storeId: string;
    totalAmount: number;
    customerName?: string;
    customerPhone?: string;
    status: string;
}

export interface WalletEventPayload {
    merchantId: string;
    amount: number;
    currency: string;
    transactionId: string;
    type: 'CREDIT' | 'DEBIT';
}

export interface InventoryEventPayload {
    merchantId: string;
    storeId: string;
    productId: string;
    productName: string;
    stockLevel: number;
}

export interface AdminEntityUpdatePayload {
    entityType: 'DRIVER' | 'VEHICLE' | 'ORDER' | 'RIDE' | 'REGION';
    entityId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PATCH';
    diff?: Record<string, any>;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface SupportTicketPayload {
    ticketId: string;
    userId: string;
    category: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    subject: string;
}
