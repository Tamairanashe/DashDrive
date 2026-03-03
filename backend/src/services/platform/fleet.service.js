const supabase = require('../../config/supabase');

/**
 * Platform-wide Fleet & Logistics Service
 */

exports.getFleetOverview = async () => {
    try {
        const { data: drivers } = await supabase.from('drivers').select('status');

        return {
            total_drivers: drivers?.length || 0,
            online: drivers?.filter(d => d.status === 'online').length || 0,
            offline: drivers?.filter(d => d.status === 'offline').length || 0,
            busy: drivers?.filter(d => d.status === 'busy').length || 0,
            suspended: 0 // Placeholder
        };
    } catch (error) {
        console.error("[FleetService] Overview Error:", error.message);
        throw error;
    }
};

exports.getLiveFleetStatus = async () => {
    try {
        const { data: drivers } = await supabase.from('drivers').select('*');
        return data || [];
    } catch (error) {
        console.error("[FleetService] Live Fleet Error:", error.message);
        return [];
    }
};

exports.getVehicleAttributes = async () => {
    // Placeholder for vehicle classification/types
    return [
        { type: 'Eco', base_fare: '$2.00', per_km: '$0.50', status: 'Active' },
        { type: 'Luxury', base_fare: '$5.00', per_km: '$1.20', status: 'Active' },
        { type: 'Parcel', base_fare: '$3.50', per_km: '$0.80', status: 'Active' }
    ];
};
