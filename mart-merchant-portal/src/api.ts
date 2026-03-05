const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = {
    auth: {
        login: async (credentials: any) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            return response.json();
        },
        register: async (data: any) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            return response.json();
        },
        forgotPassword: async (email: string) => {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || error.message || 'Failed to send reset email');
            }
            return response.json();
        },
    },
    onboarding: {
        submit: async (token: string, data: any) => {
            const response = await fetch(`${API_URL}/merchants/store/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Onboarding submission failed');
            }
            return response.json();
        },
    },
    merchants: {
        getProfile: async (token: string) => {
            const response = await fetch(`${API_URL}/merchants/profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch profile');
            }
            return response.json();
        },
    },
    orders: {
        getStoreOrders: async (token: string, storeId: string) => {
            const response = await fetch(`${API_URL}/orders/store/${storeId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            return response.json();
        },
        updateStatus: async (token: string, orderId: string, status: string, note?: string) => {
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, note }),
            });
            if (!response.ok) throw new Error('Failed to update status');
            return response.json();
        }
    },
    products: {
        getProducts: async (token: string, storeId?: string) => {
            const query = storeId ? `?storeId=${storeId}` : '';
            const response = await fetch(`${API_URL}/products${query}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            return response.json();
        },
        create: async (token: string, data: any) => {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create product');
            return response.json();
        },
        update: async (token: string, id: string, data: any) => {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update product');
            return response.json();
        },
        remove: async (token: string, id: string) => {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to remove product');
            return response.json();
        }
    },
    analytics: {
        getDashboard: async (token: string, storeId: string, startDate?: string, endDate?: string) => {
            const params = new URLSearchParams({ storeId });
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            const response = await fetch(`${API_URL}/analytics/dashboard?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch dashboard analytics');
            return response.json();
        },
        getSales: async (token: string, storeId: string, startDate?: string, endDate?: string) => {
            const params = new URLSearchParams({ storeId });
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            const response = await fetch(`${API_URL}/analytics/sales?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch sales analytics');
            return response.json();
        }
    }
};
