import { adminApiInstance, logisticsApiInstance, mobilityApiInstance, platformApiInstance } from './client';

export const adminApi = {
    stores: {
        list: (params?: any) => adminApiInstance.get('/admin/stores/list', { params }),
        details: (id: string) => adminApiInstance.get(`/admin/stores/details/${id}`),
        toggleStatus: (id: string, is_active: boolean) => adminApiInstance.patch(`/admin/stores/toggle-status/${id}`, { is_active }),
    },
    merchants: {
        list: (params?: any) => adminApiInstance.get('/admin/merchants/list', { params }),
    },
    onboarding: {
        listPending: () => adminApiInstance.get('/admin/stores/list', { params: { status: 'PENDING' } }),
    },
    users: {
        roles: () => adminApiInstance.get('/users/roles'),
        getDrivers: () => logisticsApiInstance.get('/riders'),
        getPendingRiders: () => logisticsApiInstance.get('/riders/pending'),
        verifyRider: (id: string, status: string, note?: string) => logisticsApiInstance.patch(`/riders/${id}/verify`, { status, note }),
    },
    // Support
    support: {
        getSupportTickets: (status?: string) => adminApiInstance.get('/support/tickets', { params: { status } }),
        updateTicketStatus: (id: string, status: string) => adminApiInstance.patch(`/support/tickets/${id}/status`, { status }),
    },
    // Fintech & Finance
    fintech: {
    fintech: {
        wallets: {
            list: (params?: any) => adminApiInstance.get('/fintech/wallets', { params }),
            getDetails: (id: string) => adminApiInstance.get(`/fintech/wallets/${id}`),
        },
        kyc: {
            listSubmissions: (status?: string) => adminApiInstance.get('/fintech/kyc/submissions', { params: { status } }),
            verify: (id: string, status: string) => adminApiInstance.post(`/fintech/kyc/submissions/${id}/verify`, { status }),
        },
        loans: {
            listProducts: () => adminApiInstance.get('/fintech/loans/products'),
            createProduct: (data: any) => adminApiInstance.post('/fintech/loans/products', data),
            updateProduct: (id: string, data: any) => adminApiInstance.put(`/fintech/loans/products/${id}`, data),
            listApplications: (status?: string) => adminApiInstance.get('/fintech/loans/applications', { params: { status } }),
            processApplication: (id: string, action: 'approve' | 'reject') => adminApiInstance.post(`/fintech/loans/applications/${id}/${action}`),
        },
        insurance: {
            listProviders: () => adminApiInstance.get('/fintech/insurance/providers'),
            listProducts: () => adminApiInstance.get('/fintech/insurance/products'),
            createProduct: (data: any) => adminApiInstance.post('/fintech/insurance/products', data),
            listClaims: (status?: string) => adminApiInstance.get('/fintech/insurance/claims', { params: { status } }),
        }
    },
    },
    // Super-App Services
    rides: {
        getServiceTypes: () => platformApiInstance.get('/rides/service-types'),
        estimateFare: (data: any) => platformApiInstance.post('/rides/estimate', data),
    },
    hotels: {
        search: (params: any) => platformApiInstance.get('/hotels/search', { params }),
        getRoomTypes: (hotelId: string) => platformApiInstance.get(`/hotels/${hotelId}/rooms`),
        book: (data: any) => platformApiInstance.post('/hotels/book', data),
    },
    events: {
        list: (category?: string) => platformApiInstance.get('/events', { params: { category } }),
        getTicketTypes: (eventId: string) => platformApiInstance.get(`/events/${eventId}/tickets`),
        purchaseTicket: (data: any) => platformApiInstance.post('/events/purchase', data),
    },
    rentals: {
        searchVehicles: (params: any) => platformApiInstance.get('/rentals/search', { params }),
        book: (data: any) => platformApiInstance.post('/rentals/book', data),
    },
    transit: {
        getRoutes: () => platformApiInstance.get('/transit/routes'),
        getStops: (routeId: string) => platformApiInstance.get(`/transit/routes/${routeId}/stops`),
        purchasePass: (data: any) => platformApiInstance.post('/transit/pass/purchase', data),
    },
    fuel: {
        getNearbyStations: (lat: number, lng: number) => platformApiInstance.get('/fuel/stations', { params: { lat, lng } }),
        getFuelTypes: (stationId: string) => platformApiInstance.get(`/fuel/stations/${stationId}/fuel-types`),
        order: (data: any) => platformApiInstance.post('/fuel/order', data),
    },
    settings: {
        get: () => adminApiInstance.get('/platform-config'),
        update: (key: string, value: any, description?: string) => adminApiInstance.post(`/platform-config/${key}`, { value, description }),
    }
};
