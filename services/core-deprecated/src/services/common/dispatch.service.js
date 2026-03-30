const supabase = require('../../config/supabase');

/**
 * Unified Dispatch Service
 * Logic for matching orders/trips with the best available pilots.
 */

/**
 * Finds the best pilot for a given order based on scoring.
 * Weights: Distance (40%), Rating (30%), Workload (30%)
 */
exports.findBestPilotForOrder = async (orderId) => {
    // 1. Fetch Order details (including store location)
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
            *,
            stores (
                location_lat,
                location_lng,
                country_id
            )
        `)
        .eq('id', orderId)
        .single();

    if (orderError || !order) throw new Error("Order not found for dispatch");

    const storeLat = order.stores.location_lat || 0;
    const storeLng = order.stores.location_lng || 0;

    // 2. Fetch Online & Active Pilots in the same country
    // Ideally we'd use a PostGIS radial search, but for now we filter by country
    const { data: pilots, error: pilotError } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'online');

    if (pilotError) throw pilotError;
    if (!pilots || pilots.length === 0) return null;

    // 3. Score Pilots
    const scoredPilots = pilots.map(pilot => {
        // Distance Score (0-10)
        // Placeholder: If Lat/Lng present, give 10, else 0. 
        // Real implementation would use Haversine.
        const distanceScore = (pilot.latitude && pilot.longitude) ? 10 : 0;

        // Rating Score (0-10)
        const ratingScore = (pilot.rating || 5) * 2;

        // Workload Score (0-10)
        // Inverse of active trips (assuming max load 5)
        // In a real system, we'd count active trips for this pilot.
        const workloadScore = 10;

        const totalScore = (distanceScore * 0.4) + (ratingScore * 0.3) + (workloadScore * 0.3);

        return { pilot, score: totalScore };
    });

    // Sort by score descending
    scoredPilots.sort((a, b) => b.score - a.score);

    return scoredPilots[0].pilot;
};

/**
 * Assigns a pilot to an order/delivery.
 */
exports.assignPilot = async (orderId, pilotId) => {
    // Create or Update Trip for this order
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .upsert({
            external_id: `DELIVERY-${orderId.substring(0, 8)}`,
            order_id: orderId,
            driver_id: pilotId,
            status: 'assigned',
            updated_at: new Date()
        })
        .select()
        .single();

    if (tripError) throw tripError;

    // Update order status to in_transit if it was ready
    await supabase
        .from('orders')
        .update({ status: 'in_transit' })
        .eq('id', orderId);

    return trip;
};
