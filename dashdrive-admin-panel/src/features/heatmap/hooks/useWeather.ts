
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as weatherService from '../services/weatherService';
import { CurrentWeather, WeatherForecastDay, WeatherAlert } from '../types';

export function useWeather(lat: number, lng: number) {
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<WeatherForecastDay[]>([]);
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch current conditions
            try {
                const currentData = await weatherService.getCurrentConditions(lat, lng);
                const mappedCurrent: CurrentWeather = {
                    currentTime: currentData.currentTime,
                    isDaytime: currentData.isDaytime,
                    condition: {
                        text: currentData.weatherCondition.description.text,
                        icon: currentData.weatherCondition.iconBaseUri,
                        type: currentData.weatherCondition.type
                    },
                    temperature: currentData.temperature,
                    feelsLike: currentData.feelsLikeTemperature,
                    humidity: currentData.relativeHumidity,
                    uvIndex: currentData.uvIndex,
                    precipitation: currentData.precipitation,
                    wind: currentData.wind,
                    visibility: currentData.visibility,
                    cloudCover: currentData.cloudCover,
                    pressure: currentData.airPressure.meanSeaLevelMillibars
                };
                setCurrent(mappedCurrent);
            } catch (err) {
                console.warn('Failed to fetch current weather:', err);
            }

            // Fetch forecast
            try {
                const forecastData = await weatherService.getDailyForecast(lat, lng, 3);
                const mappedForecast: WeatherForecastDay[] = (forecastData.forecastDays || []).map((day: any) => ({
                    date: day.displayDate,
                    maxTemp: day.maxTemperature,
                    minTemp: day.minTemperature,
                    dayCondition: {
                        text: day.daytimeForecast.weatherCondition.description.text,
                        icon: day.daytimeForecast.weatherCondition.iconBaseUri,
                        type: day.daytimeForecast.weatherCondition.type
                    },
                    nightCondition: {
                        text: day.nighttimeForecast.weatherCondition.description.text,
                        icon: day.nighttimeForecast.weatherCondition.iconBaseUri,
                        type: day.nighttimeForecast.weatherCondition.type
                    },
                    rainProb: day.daytimeForecast.precipitation.probability.percent
                }));
                setForecast(mappedForecast);
            } catch (err) {
                console.warn('Failed to fetch weather forecast:', err);
            }

            // Fetch alerts (often unsupported for certain locations like Harare)
            try {
                const alertsData = await weatherService.getWeatherAlerts(lat, lng);
                const mappedAlerts: WeatherAlert[] = (alertsData.publicAlerts || []).map((alert: any) => ({
                    id: alert.alertId,
                    event: alert.weatherEvent,
                    severity: alert.severity,
                    summary: alert.summary,
                    instruction: alert.instruction,
                    startTime: alert.startTime,
                    endTime: alert.endTime
                }));
                setAlerts(mappedAlerts);
            } catch (err) {
                console.warn('Weather alerts not available for this location:', err);
            }

            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch weather:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [lat, lng]);

    useEffect(() => {
        fetchWeatherData();
        
        // Auto-refresh every 15 minutes
        const interval = setInterval(fetchWeatherData, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchWeatherData]);

    // Computed legacy weather for backward compatibility
    const legacyWeather = useMemo(() => {
        if (!current) return { condition: 'Loading...', temp: '--°C', impact: '0%' };
        
        let impact = '0%';
        const condition = current.condition.text;
        const temp = `${Math.round(current.temperature.degrees || 0)}°C`;
        
        // Simple impact logic based on conditions
        if (condition.toLowerCase().includes('rain')) impact = '+15%';
        if (condition.toLowerCase().includes('storm')) impact = '+35%';
        if (condition.toLowerCase().includes('snow')) impact = '+25%';
        if (current.temperature.degrees && current.temperature.degrees > 35) impact = '+10%';

        return { condition, temp, impact };
    }, [current]);

    return { current, forecast, alerts, loading, error, legacyWeather, refresh: fetchWeatherData };
}
