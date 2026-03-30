const supabase = require('../config/supabase');

/**
 * Events Service
 * Handles seat locking, availability and order processing
 */
class EventsService {
    /**
     * Get a list of upcoming events
     */
    async getEvents() {
        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                venues (name, city, country)
            `)
            .eq('status', 'UPCOMING')
            .order('start_time', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Get event details including sections and seat summary
     */
    async getEventDetails(eventId) {
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select(`
                *,
                venues (*)
            `)
            .eq('id', eventId)
            .single();

        if (eventError) throw eventError;

        const { data: eventSeats, error: seatsError } = await supabase
            .from('event_seats')
            .select('status, price')
            .eq('event_id', eventId);

        if (seatsError) throw seatsError;

        // Summarize availability
        const summary = {
            total: eventSeats.length,
            available: eventSeats.filter(s => s.status === 'AVAILABLE').length,
            sold: eventSeats.filter(s => s.status === 'SOLD').length,
            minPrice: Math.min(...eventSeats.map(s => s.price))
        };

        return { ...event, summary };
    }

    /**
     * Lock a seat for a specific user (NX EX pattern simulation)
     * In a production environment, this would use Redis SET NX EX
     */
    async lockSeat(eventId, seatId, userId) {
        const { data: currentSeat, error: fetchError } = await supabase
            .from('event_seats')
            .select('status')
            .eq('event_id', eventId)
            .eq('seat_id', seatId)
            .single();

        if (fetchError || !currentSeat) throw new Error('Seat not found');
        if (currentSeat.status !== 'AVAILABLE') throw new Error('Seat not available');

        // Atomic update attempt
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        const { data, error } = await supabase
            .from('event_seats')
            .update({
                status: 'LOCKED',
                locked_at: new Date().toISOString(),
                locked_by: userId
            })
            .eq('event_id', eventId)
            .eq('seat_id', seatId)
            .eq('status', 'AVAILABLE') // Optimistic locking
            .select();

        if (error || !data || data.length === 0) {
            throw new Error('Seat was taken by another user');
        }

        // Create transaction-like reservation record
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .insert({
                user_id: userId,
                event_id: eventId,
                expires_at: expiresAt.toISOString(),
                status: 'ACTIVE'
            })
            .select()
            .single();

        if (resError) {
            // Rollback seat lock if reservation fails
            await supabase
                .from('event_seats')
                .update({ status: 'AVAILABLE', locked_at: null, locked_by: null })
                .eq('event_id', eventId)
                .eq('seat_id', seatId);
            throw resError;
        }

        return reservation;
    }

    /**
     * Create an order from an active reservation
     */
    async createOrder(reservationId, userId, amount) {
        // 1. Verify reservation
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', reservationId)
            .eq('user_id', userId)
            .eq('status', 'ACTIVE')
            .single();

        if (resError || !reservation) throw new Error('Invalid or expired reservation');
        if (new Date(reservation.expires_at) < new Date()) {
            throw new Error('Reservation has expired');
        }

        // 2. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                reservation_id: reservationId,
                total_amount: amount,
                status: 'PENDING'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        return order;
    }

    /**
     * Get all seats for a specific event
     */
    async getSeats(eventId) {
        const { data, error } = await supabase
            .from('event_seats')
            .select('*')
            .eq('event_id', eventId)
            .order('seat_id', { ascending: true });

        if (error) throw error;
        return data;
    }
}

module.exports = new EventsService();
