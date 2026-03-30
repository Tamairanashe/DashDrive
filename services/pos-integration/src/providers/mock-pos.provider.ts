import { Injectable } from '@nestjs/common';
import { PosProviderAdapter } from './pos-provider.interface';

@Injectable()
export class MockPosProvider implements PosProviderAdapter {
    async connect(merchantId: string, credentials: any): Promise<{ success: boolean; accessToken?: string; webhookSecret?: string; error?: string }> {
        console.log(`[MockPOS] Connecting merchant ${merchantId}...`);
        return {
            success: true,
            accessToken: `mock_access_token_${merchantId}`,
            webhookSecret: `mock_wh_secret_${merchantId}`
        };
    }

    async fetchMenu(merchantId: string, accessToken: string): Promise<{ success: boolean; data?: any; error?: string }> {
        console.log(`[MockPOS] Fetching menu for merchant ${merchantId} with token ${accessToken}`);
        
        // Simulating a menu payload from an external POS
        const mockMenu = {
            categories: [
                {
                    id: 'cat_1',
                    name: 'Burgers',
                    items: [
                        { id: 'item_1', name: 'Classic Cheeseburger', price: 10.99 },
                        { id: 'item_2', name: 'Bacon Burger', price: 12.99 }
                    ]
                }
            ]
        };

        return { success: true, data: mockMenu };
    }

    async createOrder(merchantId: string, accessToken: string, orderPayload: any): Promise<{ success: boolean; posOrderId?: string; error?: string }> {
        console.log(`[MockPOS] Creating order in POS for merchant ${merchantId}`);
        console.log(`Payload:`, orderPayload);

        return {
            success: true,
            posOrderId: `MOCK-ORD-${Math.floor(Math.random() * 10000)}`
        };
    }

    parseWebhook(payload: any, signature: string, secret: string): { isValid: boolean; eventType?: string; normalizedData?: any } {
        // In a real provider, we would crypto.timingSafeEqual the signatures
        console.log(`[MockPOS] Parsing webhook payload`);
        
        let isValid = false;
        if (signature === `expected_sig_for_${secret}`) {
            isValid = true;
        } else if (signature === 'mock_signature') { // For easy testing
            isValid = true;
        }

        return {
            isValid,
            eventType: payload.type || 'unknown_event',
            normalizedData: payload.data || payload
        };
    }
}
