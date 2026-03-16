const BASE_URL = 'http://localhost:3000'; // DashDrive Backend

export const api = {
    validateCoupon: async (code: string, storeId: string, orderAmount: number) => {
        const response = await fetch(`${BASE_URL}/marketing/coupons/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                storeId,
                orderAmount,
            }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Validation failed');
        }
        
        return response.json();
    },

    fetchEvents: async () => {
        const response = await fetch(`${BASE_URL}/api/mobile/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    getEvent: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/mobile/events/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        return response.json();
    },

    getEventSeats: async (id: string) => {
        const response = await fetch(`${BASE_URL}/api/mobile/events/${id}/seats`);
        if (!response.ok) throw new Error('Failed to fetch seat details');
        return response.json();
    },

    lockSeat: async (eventId: string, seatId: string) => {
        const response = await fetch(`${BASE_URL}/api/mobile/events/lock-seat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: eventId, seat_id: seatId })
        });
        if (!response.ok) throw new Error('Failed to lock seat');
        return response.json();
    },

    createOrder: async (reservationId: string, amount: number) => {
        const response = await fetch(`${BASE_URL}/api/mobile/events/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservation_id: reservationId, amount })
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    }
};
