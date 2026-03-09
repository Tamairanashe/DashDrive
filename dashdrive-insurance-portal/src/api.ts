const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Mock API for Portals
export const api = {
    marketing: {
        getStats: async (_token: string) => {
            return {
                totalRedemptions: 1250,
                promoSales: 45000.50,
                newCustomers: 320,
                clickRate: 4.8
            };
        },
        getCampaignImpact: async (_token: string) => {
            return [
                { name: 'Jan', redemptions: 400, sales: 2400 },
                { name: 'Feb', redemptions: 300, sales: 1398 },
                { name: 'Mar', redemptions: 200, sales: 9800 },
                { name: 'Apr', redemptions: 278, sales: 3908 },
                { name: 'May', redemptions: 189, sales: 4800 },
                { name: 'Jun', redemptions: 239, sales: 3800 },
            ];
        },
        getCampaigns: async (_token: string) => {
            return [
                { id: '1', name: 'Easter Special', status: 'Active', reach: 15000, conversions: 450, budget: 2000, spent: 1200 },
                { id: '2', name: 'New User Bonus', status: 'Active', reach: 45000, conversions: 3200, budget: 5000, spent: 4800 },
                { id: '3', name: 'Weekend Surge', status: 'Paused', reach: 8000, conversions: 120, budget: 1000, spent: 450 },
            ];
        },
        createCampaign: async (_token: string, data: any) => {
            return { id: Math.random().toString(36).substr(2, 9), ...data };
        },
        getCoupons: async (_token: string) => {
            return [
                { id: '1', code: 'DASH20', discount: '20%', type: 'Percentage', usage: '450/1000', expiry: '2026-12-31' },
                { id: '2', code: 'FREEFUEL', discount: '$5.00', type: 'Fixed', usage: '120/500', expiry: '2026-06-30' },
            ];
        },
        createCoupon: async (_token: string, data: any) => {
            return { id: Math.random().toString(36).substr(2, 9), ...data };
        }
    }
};
