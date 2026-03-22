import React, { useState, useEffect, useMemo } from 'react';
import { AutoComplete, Input, Spin, Typography } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { usePlacesAutocomplete, AutocompletePrediction } from '../hooks/usePlacesAutocomplete';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0";

interface PlacesSearchProps {
    onPlaceSelected?: (lat: number, lng: number, name: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

export const PlacesSearch: React.FC<PlacesSearchProps> = ({ 
    onPlaceSelected, 
    placeholder = "Search for a location...",
    style 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [sessionToken] = useState(() => uuidv4());
    const { suggestions, loading, fetchSuggestions } = usePlacesAutocomplete();

    const handleSearch = (value: string) => {
        setInputValue(value);
        if (value.length > 2) {
            fetchSuggestions(value, sessionToken);
        }
    };

    const handleSelect = async (value: string, option: any) => {
        const prediction = option.prediction as AutocompletePrediction;
        const resourceName = prediction.placePrediction.place; // places/PLACE_ID
        const displayName = prediction.placePrediction.text.text;

        setInputValue(displayName);

        try {
            // Fetch Place Details (New) to get lat/lng
            const response = await axios.get(
                `https://places.googleapis.com/v1/${resourceName}`,
                {
                    params: {
                        fields: 'location,displayName',
                        key: GOOGLE_MAPS_API_KEY
                    },
                    headers: {
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'location,displayName'
                    }
                }
            );

            const { location } = response.data;
            if (location && onPlaceSelected) {
                onPlaceSelected(location.latitude, location.longitude, displayName);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const options = useMemo(() => {
        return suggestions.map((suggestion) => ({
            value: suggestion.placePrediction.text.text,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                    <EnvironmentOutlined style={{ color: '#1a73e8' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                            {suggestion.placePrediction.structuredFormat.mainText.text}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {suggestion.placePrediction.structuredFormat.secondaryText?.text}
                        </Text>
                    </div>
                </div>
            ),
            prediction: suggestion,
        }));
    }, [suggestions]);

    return (
        <div style={{ width: '100%', ...style }}>
            <AutoComplete
                popupMatchSelectWidth={true}
                style={{ width: '100%' }}
                options={options}
                onSelect={handleSelect}
                onSearch={handleSearch}
                value={inputValue}
            >
                <Input
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    placeholder={placeholder}
                    size="large"
                    allowClear
                    suffix={loading ? <Spin size="small" /> : null}
                    style={{ 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e2e8f0'
                    }}
                />
            </AutoComplete>
        </div>
    );
};
