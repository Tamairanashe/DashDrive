const supabase = require('../../config/supabase');

/**
 * Platform-wide User & Support Service
 */

exports.getGlobalUserStats = async () => {
    try {
        const { count: customerCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
        const { count: driverCount } = await supabase.from('drivers').select('*', { count: 'exact', head: true });

        return {
            total_users: (customerCount || 0) + (driverCount || 0) + 12402, // Adding mock vendors
            customers: customerCount || 0,
            drivers: driverCount || 0,
            vendors: 12402,
            new_today: 2456
        };
    } catch (error) {
        console.error("[PlatformUser] User Stats Error:", error.message);
        throw error;
    }
};

exports.getSupportOverview = async () => {
    // Placeholder for platform-wide support tickets
    return {
        active_tickets: 142,
        solved_today: 85,
        avg_response_time: '12m',
        agents_online: 12
    };
};

exports.getPlatformTickets = async () => {
    return [
        { id: 'TKT-101', user: 'Justin Chithu', subject: 'Refund Issue', status: 'Active', priority: 'High', date: new Date().toISOString() },
        { id: 'TKT-102', user: 'Sarah Johnson', subject: 'Account Verification', status: 'Pending', priority: 'Medium', date: new Date().toISOString() }
    ];
};
