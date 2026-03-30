const eventsService = require('../../services/events.service');

/**
 * Events Controller
 * Mobile-facing endpoints for ticket browsing and purchase
 */
class EventsController {
    /**
     * List all upcoming events
     */
    async listEvents(req, res) {
        try {
            const events = await eventsService.getEvents();
            return res.json({
                success: true,
                count: events.length,
                data: events
            });
        } catch (error) {
            console.error('[EventsController] listEvents Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch events' });
        }
    }

    /**
     * Get specific event details
     */
    async getEvent(req, res) {
        try {
            const { id } = req.params;
            const event = await eventsService.getEventDetails(id);
            return res.json({
                success: true,
                data: event
            });
        } catch (error) {
            console.error('[EventsController] getEvent Error:', error);
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
    }

    /**
     * Get all seats for a specific event
     */
    async getEventSeats(req, res) {
        try {
            const { id } = req.params;
            const seats = await eventsService.getSeats(id);
            return res.json({
                success: true,
                data: seats
            });
        } catch (error) {
            console.error('[EventsController] getEventSeats Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch seats' });
        }
    }

    /**
     * Lock a seat (create reservation)
     */
    async lockSeat(req, res) {
        try {
            const { event_id, seat_id } = req.body;
            const user_id = req.user?.id || 'anonymous'; // Fallback if auth isn't strict yet

            if (!event_id || !seat_id) {
                return res.status(400).json({ success: false, message: 'event_id and seat_id are required' });
            }

            const reservation = await eventsService.lockSeat(event_id, seat_id, user_id);
            return res.status(201).json({
                success: true,
                message: 'Seat locked for 5 minutes',
                data: reservation
            });
        } catch (error) {
            console.error('[EventsController] lockSeat Error:', error);
            return res.status(409).json({ success: false, message: error.message });
        }
    }

    /**
     * Create final order
     */
    async createOrder(req, res) {
        try {
            const { reservation_id, amount } = req.body;
            const user_id = req.user?.id || 'anonymous';

            if (!reservation_id || !amount) {
                return res.status(400).json({ success: false, message: 'reservation_id and amount are required' });
            }

            const order = await eventsService.createOrder(reservation_id, user_id, amount);
            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            console.error('[EventsController] createOrder Error:', error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EventsController();
