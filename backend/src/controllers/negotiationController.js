const supabase = require('../config/supabase');
const { activeTrips } = require('../services/simulationService');
const { producer } = require('../config/kafka');
const prepaidService = require('../services/mobile/prepaid.service');

/**
 * InDrive-Style Negotiation Controller
 */
const handleNegotiation = (socket, io) => {
    // 1. Rider Proposes a Fare (Ride or Parcel)
    socket.on('proposeFare', async (data) => {
        const { riderId, origin, destination, amount, type, metadata } = data;
        // Generate prefix based on type
        const prefix = (type || 'ride').toUpperCase();
        const tripExternalId = `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const newTrip = {
            external_id: tripExternalId,
            rider_id: riderId,
            origin: origin,
            destination: destination,
            initial_offer: amount,
            current_price: amount,
            type: type || 'ride',
            metadata: metadata || {},
            negotiation_history: [{
                type: 'rider_proposal',
                price: amount,
                time: new Date().toISOString()
            }],
            status: 'negotiating'
        };

        const { data: savedTrip, error } = await supabase.from('trips').insert(newTrip).select().single();

        if (!error && savedTrip) {
            activeTrips.push(savedTrip);

            // Kafka Log
            try {
                await producer.send({
                    topic: 'trip-events',
                    messages: [{ key: savedTrip.id, value: JSON.stringify({ event: 'PROPOSAL', ...savedTrip }) }]
                });
            } catch (kErr) { console.warn('Kafka Log Error:', kErr.message); }

            // Broadcast to all nearby drivers (for now global broadcast)
            io.emit('newTripRequest', savedTrip);
            console.log(`[Negotiation] ${prefix} proposed: ${tripExternalId} ($${amount}) by Rider ${riderId}`);
        } else {
            console.error("[Negotiation] Error creating trip:", error);
            socket.emit('error', { message: 'Failed to propose fare' });
        }
    });

    // 2. Driver Submits a Bid (Counter Offer)
    socket.on('submitBid', async (data) => {
        const { tripId, driverId, amount } = data;
        const tripIndex = activeTrips.findIndex(t => t.id === tripId || t.external_id === tripId);

        if (tripIndex > -1) {
            const trip = activeTrips[tripIndex];

            // Check if driver has slots (Prepaid Model)
            const { data: driver } = await supabase.from('drivers').select('ride_slots').eq('id', driverId).single();
            if (!driver || driver.ride_slots <= 0) {
                return socket.emit('error', { message: 'You must have prepaid ride slots to submit a bid.' });
            }
            const bid = {
                id: `BID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                type: 'driver_bid',
                driverId: driverId,
                price: amount,
                time: new Date().toISOString()
            };

            const updatedHistory = [...(trip.negotiation_history || []), bid];

            const { data: updatedTrip, error } = await supabase.from('trips')
                .update({
                    negotiation_history: updatedHistory,
                    updated_at: new Date().toISOString()
                })
                .eq('id', trip.id)
                .select()
                .single();

            if (!error && updatedTrip) {
                activeTrips[tripIndex] = updatedTrip;

                // Kafka Log
                try {
                    await producer.send({
                        topic: 'trip-events',
                        messages: [{ key: updatedTrip.id, value: JSON.stringify({ event: 'BID', ...updatedTrip, lastBid: bid }) }]
                    });
                } catch (kErr) { console.warn('Kafka Log Error:', kErr.message); }

                // Notify the rider specifically if possible, or broadcast update
                io.emit('tripUpdate', updatedTrip);
                console.log(`[Negotiation] Driver ${driverId} bid $${amount} on trip ${trip.external_id}`);
            }
        }
    });

    // 3. Rider Accepts a Specific Bid
    socket.on('acceptBid', async (data) => {
        const { tripId, bidId, driverId } = data;
        const tripIndex = activeTrips.findIndex(t => t.id === tripId || t.external_id === tripId);

        if (tripIndex > -1) {
            const trip = activeTrips[tripIndex];
            const selectedBid = trip.negotiation_history.find(h => h.id === bidId);

            if (!selectedBid && !driverId) {
                return socket.emit('error', { message: 'Specfic bid or driver not found' });
            }

            const finalPrice = selectedBid ? selectedBid.price : trip.current_price;
            const finalDriverId = selectedBid ? selectedBid.driverId : driverId;

            const { data: updatedTrip, error } = await supabase.from('trips')
                .update({
                    status: 'matched',
                    driver_id: finalDriverId,
                    final_price: finalPrice,
                    updated_at: new Date().toISOString()
                })
                .eq('id', trip.id)
                .select()
                .single();

            if (!error && updatedTrip) {
                activeTrips.splice(tripIndex, 1);

                // Kafka Log
                try {
                    await producer.send({
                        topic: 'trip-events',
                        messages: [{ key: updatedTrip.id, value: JSON.stringify({ event: 'MATCHED', ...updatedTrip }) }]
                    });
                } catch (kErr) { console.warn('Kafka Log Error:', kErr.message); }

                io.emit('tripMatched', updatedTrip);
                console.log(`[Negotiation] Trip ${trip.external_id} matched with Driver ${finalDriverId} at $${finalPrice}`);

                // Decrement Ride Slot (Prepaid Model)
                await prepaidService.decrementDriverSlot(finalDriverId);
            }
        }
    });

    /**
     * Real-time Chat Coordination
     */
    socket.on('sendMessage', async (data) => {
        console.log("[Socket] Received sendMessage event:", data);
        const { tripId, senderId, content } = data;
        const chatService = require('../services/mobile/chat.service'); // Corrected path

        try {
            const message = await chatService.saveMessage({ tripId, senderId, content });

            // Broadcast to the trip "room" or globally for now (matching existing pattern)
            io.emit('newMessage', message);
            console.log(`[Chat] Trip ${tripId}: Message sent by ${senderId}`);
        } catch (error) {
            console.error("[Chat] Error sending message:", error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
};

module.exports = { handleNegotiation };
