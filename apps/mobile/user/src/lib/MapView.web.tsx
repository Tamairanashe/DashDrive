// Web implementation for mobile using Google Maps
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap
} from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

// Constants
export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface MapViewProps {
    style?: any;
    initialRegion?: any;
    region?: any;
    customMapStyle?: any;
    mapPadding?: any;
    provider?: any;
    children?: React.ReactNode;
}

const MapView = ({ style, initialRegion, children }: MapViewProps) => {
    const center = initialRegion ? { lat: initialRegion.latitude, lng: initialRegion.longitude } : { lat: 0, lng: 0 };
    const zoom = initialRegion ? 13 : 2;

    return (
        <View style={[styles.container, style]}>
            <APIProvider apiKey={API_KEY}>
                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling={'greedy'}
                    disableDefaultUI={false}
                >
                    {children}
                </Map>
            </APIProvider>
        </View>
    );
};

export const Marker = ({ coordinate, children }: { coordinate: { latitude: number; longitude: number }; children?: React.ReactNode }) => {
    return (
        <AdvancedMarker position={{ lat: coordinate.latitude, lng: coordinate.longitude }}>
            <View style={styles.markerContainer}>
                {children || <View style={styles.defaultMarker} />}
            </View>
        </AdvancedMarker>
    );
};

export const Polyline = (_props: any) => {
    const map = useMap();
    useEffect(() => {
        if (!map || !_props.coordinates) return;
        const polyline = new google.maps.Polyline({
            path: _props.coordinates.map((c: any) => ({ lat: c.latitude, lng: c.longitude })),
            geodesic: true,
            strokeColor: _props.strokeColor || "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: _props.strokeWidth || 2,
        });
        polyline.setMap(map);
        return () => polyline.setMap(null);
    }, [map, _props.coordinates]);
    return null;
};

export const Circle = (_props: any) => {
    const map = useMap();
    useEffect(() => {
        if (!map || !_props.center) return;
        const circle = new google.maps.Circle({
            strokeColor: _props.strokeColor || "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: _props.fillColor || "#FF0000",
            fillOpacity: 0.35,
            map,
            center: { lat: _props.center.latitude, lng: _props.center.longitude },
            radius: _props.radius,
        });
        return () => circle.setMap(null);
    }, [map, _props.center, _props.radius]);
    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a2e",
    },
    markerContainer: {
        position: 'relative',
    },
    defaultMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4285F4',
        borderWidth: 2,
        borderColor: 'white',
    }
});

export default MapView;
