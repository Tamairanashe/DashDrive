import { useState, useCallback } from 'react';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:autocomplete';

export interface AutocompletePrediction {
    placePrediction: {
        place: string; // resource name: places/PLACE_ID
        placeId: string;
        text: {
            text: string;
            matches?: { startOffset: number; endOffset: number }[];
        };
        structuredFormat: {
            mainText: {
                text: string;
                matches?: { startOffset: number; endOffset: number }[];
            };
            secondaryText?: {
                text: string;
            };
        };
        types: string[];
    };
}

interface AutocompleteResponse {
    suggestions: AutocompletePrediction[];
}

interface UsePlacesAutocompleteProps {
    debounce?: number;
}

export const usePlacesAutocomplete = (props?: UsePlacesAutocompleteProps) => {
    const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuggestions = useCallback(async (input: string, sessionToken?: string) => {
        if (!input || input.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<AutocompleteResponse>(
                PLACES_API_URL,
                {
                    input,
                    sessionToken,
                    // Optional: add locationBias or locationRestriction here if needed
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            setSuggestions(response.data.suggestions || []);
        } catch (err: any) {
            console.error('Places Autocomplete Error:', err);
            setError(err.message || 'Failed to fetch suggestions');
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        suggestions,
        loading,
        error,
        fetchSuggestions,
    };
};
