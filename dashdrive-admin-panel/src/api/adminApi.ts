import api from './client';

export const adminApi = {
    stores: {
        list: (params?: any) => api.get('/admin/stores/list', { params }),
        details: (id: string) => api.get(`/admin/stores/details/${id}`),
        toggleStatus: (id: string, is_active: boolean) => api.patch(`/admin/stores/toggle-status/${id}`, { is_active }),
    },
    merchants: {
        list: (params?: any) => api.get('/admin/merchants/list', { params }),
    },
    onboarding: {
        listPending: () => api.get('/admin/stores/list', { params: { status: 'PENDING' } }),
    },
    users: {
        roles: () => api.get('/users/roles'),
        getDrivers: () => api.get('/riders'),
        getPendingRiders: () => api.get('/riders/pending'),
        verifyRider: (id: string, status: string, note?: string) => api.patch(`/riders/${id}/verify`, { status, note }),
    },
    // Support
    support: {
        getSupportTickets: (status?: string) => api.get('/support/tickets', { params: { status } }),
        updateTicketStatus: (id: string, status: string) => api.patch(`/support/tickets/${id}/status`, { status }),
    },
    // Fintech & Finance
    fintech: {
        wallets: {
            list: (params?: any) => api.get('/fintech/wallets', { params }),
            getDetails: (id: string) => api.get(`/fintech/wallets/${id}`),
        },
        kyc: {
            listSubmissions: (status?: string) => api.get('/fintech/kyc/submissions', { params: { status } }),
            verify: (id: string, status: string) => api.post(`/fintech/kyc/submissions/${id}/verify`, { status }),
        },
        loans: {
            listProducts: () => api.get('/fintech/loans/products'),
            createProduct: (data: any) => api.post('/fintech/loans/products', data),
            updateProduct: (id: string, data: any) => api.put(`/fintech/loans/products/${id}`, data),
            listApplications: (status?: string) => api.get('/fintech/loans/applications', { params: { status } }),
            processApplication: (id: string, action: 'approve' | 'reject') => api.post(`/fintech/loans/applications/${id}/${action}`),
        },
        insurance: {
            listProviders: () => api.get('/fintech/insurance/providers'),
            listProducts: () => api.get('/fintech/insurance/products'),
            createProduct: (data: any) => api.post('/fintech/insurance/products', data),
            listClaims: (status?: string) => api.get('/fintech/insurance/claims', { params: { status } }),
        }
    },
    // Super-App Services
    rides: {
        getServiceTypes: () => api.get('/rides/service-types'),
        estimateFare: (data: any) => api.post('/rides/estimate', data),
    },
    hotels: {
        search: (params: any) => api.get('/hotels/search', { params }),
        getRoomTypes: (hotelId: string) => api.get(`/hotels/${hotelId}/rooms`),
        book: (data: any) => api.post('/hotels/book', data),
    },
    events: {
        list: (category?: string) => api.get('/events', { params: { category } }),
        getTicketTypes: (eventId: string) => api.get(`/events/${eventId}/tickets`),
        purchaseTicket: (data: any) => api.post('/events/purchase', data),
    },
    rentals: {
        searchVehicles: (params: any) => api.get('/rentals/search', { params }),
        book: (data: any) => api.post('/rentals/book', data),
    },
    transit: {
        getRoutes: () => api.get('/transit/routes'),
        getStops: (routeId: string) => api.get(`/transit/routes/${routeId}/stops`),
        purchasePass: (data: any) => api.post('/transit/pass/purchase', data),
    },
    fuel: {
        getNearbyStations: (lat: number, lng: number) => api.get('/fuel/stations', { params: { lat, lng } }),
        getFuelTypes: (stationId: string) => api.get(`/fuel/stations/${stationId}/fuel-types`),
        order: (data: any) => api.post('/fuel/order', data),
    }
};
