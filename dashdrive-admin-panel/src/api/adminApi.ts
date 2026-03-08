import api from './client';

export const adminApi = {
    stores: {
        list: (params?: any) => api.get('/admin/stores/list', { params }),
        details: (id: string) => api.get(`/admin/stores/details/${id}`),
        toggleStatus: (id: string, is_active: boolean) => api.patch(`/admin/stores/toggle-status/${id}`, { is_active }),
    },
    merchants: {
        list: (params?: any) => api.get('/admin/merchants/list', { params }), // This might need to be created in backend
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
    }
};
