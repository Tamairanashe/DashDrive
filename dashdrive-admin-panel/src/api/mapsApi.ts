import axios from 'axios';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const placesApi = axios.create({
    baseURL: 'https://places.googleapis.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    },
});

const routesApi = axios.create({
    baseURL: 'https://routes.googleapis.com/directions/v2',
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    },
});

export const mapsApi = {
    /**
     * Search for places using the new Places API (Text Search)
     * @param textQuery Query string (e.g. "Spicy Vegetarian Food in Sydney, Australia")
     * @param fields Field mask for the response
     */
    searchText: async (textQuery: string, fields: string = 'places.displayName,places.formattedAddress,places.priceLevel,places.location') => {
        const response = await placesApi.post('/places:searchText', { textQuery }, {
            headers: { 'X-Goog-FieldMask': fields }
        });
        return response.data;
    },

    /**
     * Compute routes between origin and destination
     */
    computeRoutes: async (origin: any, destination: any, travelMode: string = 'DRIVE', fields: string = 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline') => {
        const response = await routesApi.post('/computeRoutes', {
            origin,
            destination,
            travelMode,
            routingPreference: 'TRAFFIC_AWARE',
            computeAlternativeRoutes: false,
            languageCode: 'en-US',
            units: 'METRIC'
        }, {
            headers: { 'X-Goog-FieldMask': fields }
        });
        return response.data;
    }
};

export default mapsApi;
