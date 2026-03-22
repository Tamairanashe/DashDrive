
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";

const BASE_URL = 'https://weather.googleapis.com/v1';

export interface WeatherLocation {
    latitude: number;
    longitude: number;
}

/**
 * Fetches current weather conditions for a specific location.
 */
export async function getCurrentConditions(lat: number, lng: number) {
    const url = `${BASE_URL}/currentConditions:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
    return await response.json();
}

/**
 * Fetches daily forecast for a specific location.
 */
export async function getDailyForecast(lat: number, lng: number, days: number = 7) {
    const url = `${BASE_URL}/forecast/days:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}&days=${days}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
    return await response.json();
}

/**
 * Fetches hourly forecast for a specific location.
 */
export async function getHourlyForecast(lat: number, lng: number, hours: number = 24) {
    const url = `${BASE_URL}/forecast/hours:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}&hours=${hours}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
    return await response.json();
}

/**
 * Fetches weather alerts for a specific location.
 */
export async function getWeatherAlerts(lat: number, lng: number) {
    const url = `${BASE_URL}/publicAlerts:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
    return await response.json();
}
