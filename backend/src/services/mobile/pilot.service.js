const supabase = require("../../config/supabase");

/**
 * Uber-Style Pilot (Driver) Service
 */

exports.updatePilotTelemetry = async (pilotId, telemetry) => {
    const { latitude, longitude, heading, speed } = telemetry;

    const { data, error } = await supabase
        .from("drivers")
        .update({
            latitude,
            longitude,
            last_location_update: new Date().toISOString(),
            status: 'online' // Auto-online on telemetry ping
        })
        .eq("id", pilotId)
        .select()
        .single();

    if (error) throw error;

    // Optional: Log to PostGIS for proximity searches (if enabled in DB)
    return data;
};

exports.updateStatus = async (pilotId, status) => {
    const { data, error } = await supabase
        .from("drivers")
        .update({ status })
        .eq("id", pilotId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.findNearbyTrips = async ({ pilotId, location }) => {
    // 1. Get online drivers (to calculate density/demand - future)

    // 2. Fetch available trips (rides or deliveries)
    const { data: trips, error } = await supabase
        .from("trips")
        .select(`
            *,
            orders (
                *,
                stores (name, address)
            )
        `)
        .eq("status", "pending")
        .is("driver_id", null);

    if (error) throw error;

    // 3. Simple distance filter (Future: PostGIS ST_DWithin)
    return trips;
};

exports.assignPilotToTrip = async (tripId, pilotId) => {
    // 1. Atomically check if trip is still available
    const { data: trip, error: fetchErr } = await supabase
        .from("trips")
        .select("status, driver_id")
        .eq("id", tripId)
        .single();

    if (fetchErr) throw fetchErr;
    if (trip.driver_id) throw new Error("Mission already claimed by another Pilot.");

    // 2. Assign Pilot
    const { data: updatedTrip, error: updateErr } = await supabase
        .from("trips")
        .update({
            driver_id: pilotId,
            status: 'assigned',
            accepted_at: new Date().toISOString()
        })
        .eq("id", tripId)
        .select()
        .single();

    if (updateErr) throw updateErr;

    // 3. Update Driver Status to Busy
    await supabase.from("drivers").update({ status: 'busy' }).eq("id", pilotId);

    return updatedTrip;
};
