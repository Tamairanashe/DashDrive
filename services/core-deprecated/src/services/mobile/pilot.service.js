const supabase = require("../../config/supabase");
const { producer } = require('../../config/kafka');
const paymentService = require('./payment.service');
const prepaidService = require('./prepaid.service');

/**
 * Uber-Style Pilot (Driver) Service
 */

exports.updateDriverTelemetry = async (pilotId, telemetry) => {
    // 1. Update DB (Hot path but still needed for persistence)
    const { data, error } = await supabase
        .from("drivers")
        .update({
            latitude: telemetry.lat,
            longitude: telemetry.lng,
            speed: telemetry.speed,
            battery: telemetry.battery,
            heading: telemetry.heading,
            altitude: telemetry.altitude,
            updated_at: new Date()
        })
        .eq("id", pilotId)
        .select()
        .single();

    if (error) throw error;

    // 2. Emit to Kafka for stream processing (New!)
    try {
        await producer.send({
            topic: 'driver-telemetry',
            messages: [
                { key: pilotId, value: JSON.stringify({ pilotId, ...telemetry, timestamp: new Date().toISOString() }) }
            ],
        });
    } catch (kafkaErr) {
        console.warn('⚠️ Kafka Telemetry Error:', kafkaErr.message);
    }

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
    const { data: driver } = await supabase.from('drivers').select('ride_slots').eq('id', pilotId).single();
    if (!driver || driver.ride_slots <= 0) {
        return []; // No slots, no missions visible
    }

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

    // 3. Decrement Ride Slot (Prepaid Model)
    await prepaidService.decrementDriverSlot(pilotId);

    // 4. Update Driver Status to Busy
    await supabase.from("drivers").update({ status: 'busy' }).eq("id", pilotId);

    return updatedTrip;
};

exports.findNegotiatingTrips = async (pilotId, type) => {
    // Check if driver has slots
    const { data: driver } = await supabase.from('drivers').select('ride_slots').eq('id', pilotId).single();
    if (!driver || driver.ride_slots <= 0) {
        return []; // No slots, no rides visible
    }

    let query = supabase
        .from("trips")
        .select("*")
        .eq("status", "negotiating");

    if (type) {
        query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
};
exports.submitBid = async (tripId, pilotId, amount) => {
    const { data: trip, error: fetchErr } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .single();

    if (fetchErr) throw fetchErr;

    // Check slots
    const { data: driver } = await supabase.from('drivers').select('ride_slots').eq('id', pilotId).single();
    if (!driver || driver.ride_slots <= 0) {
        throw new Error("You must have prepaid ride slots to submit a bid.");
    }

    const bid = {
        id: `BID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: 'driver_bid',
        driverId: pilotId,
        price: amount,
        time: new Date().toISOString()
    };

    const updatedHistory = [...(trip.negotiation_history || []), bid];

    const { data: updatedTrip, error: updateErr } = await supabase
        .from("trips")
        .update({
            negotiation_history: updatedHistory,
            updated_at: new Date().toISOString()
        })
        .eq("id", tripId)
        .select()
        .single();

    if (updateErr) throw updateErr;
    return updatedTrip;
};

exports.updateTripStatus = async (tripId, pilotId, status) => {
    // 1. Validate Trip ownership
    const { data: trip, error: fetchErr } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .eq("driver_id", pilotId)
        .single();

    if (fetchErr) throw new Error("Trip not found or not assigned to you.");

    const updateData = {
        status,
        updated_at: new Date().toISOString()
    };

    if (status === 'picked_up') updateData.picked_up_at = new Date().toISOString();
    if (status === 'completed') updateData.delivered_at = new Date().toISOString();

    // 2. Update Status
    const { data: updatedTrip, error: updateErr } = await supabase
        .from("trips")
        .update(updateData)
        .eq("id", tripId)
        .select()
        .single();

    if (updateErr) throw updateErr;

    // 3. If Completed -> Trigger Payment
    if (status === 'completed') {
        try {
            await paymentService.processTripPayment({
                tripId: updatedTrip.id,
                riderId: updatedTrip.rider_id,
                pilotId: pilotId,
                amount: updatedTrip.final_price || updatedTrip.current_price
            });
            console.log(`[Payment] Processed for trip ${updatedTrip.external_id}`);
        } catch (payErr) {
            console.error(`[Payment] FAILED for trip ${updatedTrip.external_id}:`, payErr.message);
        }

        // Set Driver back to online
        await supabase.from("drivers").update({ status: 'online' }).eq("id", pilotId);
    }

    return updatedTrip;
};
