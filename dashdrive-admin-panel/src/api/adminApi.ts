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
    }
};
