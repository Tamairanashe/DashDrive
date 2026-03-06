export interface PosProviderAdapter {
    /**
     * Authenticate and retrieve connection details
     */
    connect(merchantId: string, credentials: any): Promise<{ success: boolean; accessToken?: string; webhookSecret?: string; error?: string }>;

    /**
     * Pull the latest menu/catalog from the POS
     */
    fetchMenu(merchantId: string, accessToken: string): Promise<{ success: boolean; data?: any; error?: string }>;

    /**
     * Push a new order from DashDrive to the POS
     */
    createOrder(merchantId: string, accessToken: string, orderPayload: any): Promise<{ success: boolean; posOrderId?: string; error?: string }>;

    /**
     * Parse an incoming webhook payload into a standardized DashDrive format
     */
    parseWebhook(payload: any, signature: string, secret: string): { isValid: boolean; eventType?: string; normalizedData?: any };
}
