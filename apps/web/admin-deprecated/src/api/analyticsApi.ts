import api from './client';

export const analyticsApi = {
    getGlobalStats: () => api.get('/analytics/global/stats'),
    getGlobalFinancials: () => api.get('/analytics/global/financials'),
    getDemandIntensity: (vertical?: string) => api.get('/admin/performance/demand', { params: { vertical } }),
    getDemandForecast: (city: string) => api.get('/analytics/prediction/demand', { params: { city } }),
    getRiskEvents: (limit: number = 50) => api.get('/fraud/events', { params: { limit } }),
    getRecentActivity: (limit: number = 5) => api.get('/admin/orders/list', { params: { limit } }),
};
