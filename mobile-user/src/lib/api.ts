const BASE_URL = 'http://localhost:3000'; // Logistics Engine

export const api = {
    validateCoupon: async (code: string, storeId: string, orderAmount: number) => {
        const response = await fetch(`${BASE_URL}/marketing/coupons/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                storeId,
                orderAmount,
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Validation failed');
        }
        
        return response.json();
    }
};
