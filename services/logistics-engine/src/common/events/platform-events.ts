export enum PlatformEvent {
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_PREPARING = 'order.preparing',
  ORDER_READY = 'order.ready',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_CANCELLED = 'order.cancelled',
  WALLET_CREDITED = 'wallet.credited',
  WALLET_DEBITED = 'wallet.debited',
  WITHDRAWAL_REQUESTED = 'withdrawal.requested',
  LOW_STOCK_ALERT = 'inventory.low_stock',
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
