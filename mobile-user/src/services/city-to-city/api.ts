const BASE_URL = 'http://localhost:3000/city-to-city';

export const CityApiService = {
    getAvailableTrips: async (from?: string, to?: string, date?: string) => {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (date) params.append('date', date);
        
        const res = await fetch(`${BASE_URL}/driver-trips?${params.toString()}`);
        return res.json();
    },

    bookTrip: async (tripId: string, seatCount: number) => {
        const res = await fetch(`${BASE_URL}/driver-trips/${tripId}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatCount }),
        });
        return res.json();
    },

    postRideRequest: async (data: any) => {
        const res = await fetch(`${BASE_URL}/rides`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    }
};
