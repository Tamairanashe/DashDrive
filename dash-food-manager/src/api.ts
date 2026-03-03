const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000') + '/api';

/**
 * Enterprise API Utility for DashDrive Merchant Portal.
 * Handles Bearer token injection and error handling.
 */
export const fetchFromAdmin = async (endpoint: string, options: RequestInit = {}) => {
    let token = localStorage.getItem('merchant_token');

    // Auto-login for development if no token exists
    if (!token && endpoint !== '/auth/login') {
        try {
            const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@dashdrive.com', password: 'password' })
            });
            const loginData = await loginRes.json();
            if (loginData.token) {
                token = loginData.token;
                localStorage.setItem('merchant_token', token);
                console.log("[API] Auto-logged in for development");
            }
        } catch (err) {
            console.error("[API] Auto-login failed:", err);
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token || '',
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API Request Failed');
    }

    return response.json();
};

export const api = {
    dashboard: {
        getOverview: () => fetchFromAdmin('/dashboard/overview'),
        getKPIs: () => fetchFromAdmin('/dashboard/kpis'),
    },
    orders: {
        list: (params: any = {}) => {
            const qs = new URLSearchParams(params).toString();
            return fetchFromAdmin(`/orders/list${qs ? `?${qs}` : ''}`);
        },
        getDetails: (id: string) => fetchFromAdmin(`/orders/details/${id}`),
        resolveIssue: (id: string, notes: string) => fetchFromAdmin(`/orders/resolve-issue/${id}`, {
            method: 'POST',
            body: JSON.stringify({ notes })
        }),
        updateStatus: (id: string, status: string, reason?: string) => fetchFromAdmin(`/orders/update-status/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status, reason })
        }),
    },
    stores: {
        list: () => fetchFromAdmin('/stores/list'),
        getDetails: (id: string) => fetchFromAdmin(`/stores/details/${id}`),
        toggleStatus: (id: string, is_active: boolean) => fetchFromAdmin(`/stores/toggle-status/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active })
        }),
    },
    menu: {
        getCategories: (storeId?: string) => fetchFromAdmin(`/menu/categories${storeId ? `?store_id=${storeId}` : ''}`),
        toggleAvailability: (id: string, is_available: boolean) => fetchFromAdmin(`/menu/items/${id}/availability`, {
            method: 'PATCH',
            body: JSON.stringify({ is_available })
        }),
    },
    reports: {
        getTrends: (days = 7) => fetchFromAdmin(`/reports/trends?days=${days}`),
        getComparisons: () => fetchFromAdmin('/reports/comparisons'),
    },
    marketing: {
        listOffers: (storeId?: string, isActive?: boolean) => {
            let url = '/marketing/list';
            const params = new URLSearchParams();
            if (storeId) params.append('store_id', storeId);
            if (isActive !== undefined) params.append('is_active', String(isActive));
            if (params.toString()) url += `?${params.toString()}`;
            return fetchFromAdmin(url);
        },
        createOffer: (data: any) => fetchFromAdmin('/marketing/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateOffer: (id: string, data: any) => fetchFromAdmin(`/marketing/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        deleteOffer: (id: string) => fetchFromAdmin(`/marketing/delete/${id}`, {
            method: 'DELETE'
        })
    },
    customers: {
        list: (params: any = {}) => {
            const qs = new URLSearchParams(params).toString();
            return fetchFromAdmin(`/customers/list${qs ? `?${qs}` : ''}`);
        },
        getFeedback: (params: any = {}) => {
            const qs = new URLSearchParams(params).toString();
            return fetchFromAdmin(`/customers/feedback${qs ? `?${qs}` : ''}`);
        },
        getInsights: () => fetchFromAdmin('/customers/insights'),
    },
    payments: {
        getPayouts: (params: any = {}) => {
            const qs = new URLSearchParams(params).toString();
            return fetchFromAdmin(`/payments/payouts${qs ? `?${qs}` : ''}`);
        },
        getSummary: (storeId?: string) => fetchFromAdmin(`/payments/summary${storeId ? `?store_id=${storeId}` : ''}`),
        getInvoices: (params: any = {}) => {
            const qs = new URLSearchParams(params).toString();
            return fetchFromAdmin(`/payments/invoices${qs ? `?${qs}` : ''}`);
        }
    }
};
