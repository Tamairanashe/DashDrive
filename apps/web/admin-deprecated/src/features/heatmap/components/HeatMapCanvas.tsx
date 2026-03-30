import React, { useRef, useCallback, useEffect } from 'react';
import { 
    GoogleMap, 
    useJsApiLoader,
    Autocomplete,
    Polygon
} from '@react-google-maps/api';
import { Button, Card, Typography, Space, Badge } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { GridCell } from './../hooks/useMarketGrid';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const LIBRARIES: ("places" | "drawing" | "visualization" | "geometry" | "marker")[] = ["places", "drawing", "visualization", "geometry", "marker"];

interface HeatMapCanvasProps {
    mapCenter: [number, number];
    enabledLayers: string[];
    cells: GridCell[];
    selectedCell: GridCell | null;
    setSelectedCell: (cell: GridCell | null) => void;
    setMapCenter: (center: [number, number]) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    mapId?: string;
    mapTypeId?: string;
}

export const HeatMapCanvas: React.FC<HeatMapCanvasProps> = ({
    mapCenter,
    enabledLayers,
    cells,
    selectedCell,
    setSelectedCell,
    setMapCenter,
    isFullscreen,
    toggleFullscreen,
    mapId = "2fdfcc6c57fba3cd",
    mapTypeId = "roadmap"
}) => {
    const activeLayer = enabledLayers[0] || 'imbalance';
    
    // Google Maps API Hook (Unified Configuration)
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES,
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const clustererRef = useRef<MarkerClusterer | null>(null);
    const markersRef = useRef<any[]>([]);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoadMap = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map;
        map.setOptions({
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'cooperative',
        });
    }, []);

    const onUnmountMap = useCallback(function callback() {
        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
            clustererRef.current = null;
        }
        mapRef.current = null;
    }, []);

    const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMapCenter([lat, lng]);
            }
        }
    };

    useEffect(() => {
        if (mapRef.current && mapCenter) {
            mapRef.current.panTo({ lat: mapCenter[0], lng: mapCenter[1] });
        }
    }, [mapCenter]);

    // Apply User's MarkerClusterer Demo Architecture
    useEffect(() => {
        if (!mapRef.current) return;

        // Clean up old markers
        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
        }
        markersRef.current.forEach(m => {
            if (m.setMap) m.setMap(null);
        });
        markersRef.current = [];

        async function initClusters() {
            try {
                const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
                const { InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

                const infoWindow = new InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });

                // Extrapolate point locations from grid cell metrics based on ALL active layers
                let locations: {lat: number, lng: number, cell: GridCell, layer: string}[] = [];
                cells.forEach(cell => {
                    enabledLayers.forEach(layer => {
                        let count = 0;
                        if (layer === 'demand') count = cell.metrics.demandCount;
                        else if (layer === 'supply') count = cell.metrics.idleSupply;
                        else if (layer === 'imbalance') count = Math.min(20, Math.floor(cell.derived.imbalanceRatio * 4));
                        else if (layer === 'surge') count = Math.floor(cell.metrics.surgeSuggestion * 3);
                        else if (layer === 'eta') count = 1; // Representative marker for ETA
                        
                        for(let i=0; i<count; i++) {
                            locations.push({
                                // Keep cluster markers within the physical zone
                                lat: cell.center.lat + (Math.random() - 0.5) * 0.012,
                                lng: cell.center.lng + (Math.random() - 0.5) * 0.012,
                                cell,
                                layer
                            });
                        }
                    });
                });

                const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                const markers = locations.map((pos, i) => {
                    const label = labels[i % labels.length];
                    let pinColor = '#10b981';
                    let glyphText = label;

                    if (pos.layer === 'demand') pinColor = '#f59e0b';
                    else if (pos.layer === 'supply') pinColor = '#3b82f6';
                    else if (pos.layer === 'imbalance') pinColor = pos.cell.derived.imbalanceRatio > 2 ? '#ef4444' : '#10b981';
                    else if (pos.layer === 'surge') pinColor = '#8b5cf6'; // Violet for surge
                    else if (pos.layer === 'eta') {
                        pinColor = '#ec4899'; // Pink for ETA
                        glyphText = `${Math.round(pos.cell.metrics.etaCurrent)}m`;
                    }

                    const pinGlyph = new PinElement({
                        glyphText: glyphText,
                        glyphColor: "white",
                        background: pinColor,
                        borderColor: '#ffffff',
                        scale: pos.layer === 'eta' ? 1.2 : 1.0
                    } as any);
                    
                    const marker = new AdvancedMarkerElement({
                        position: { lat: pos.lat, lng: pos.lng },
                        content: pinGlyph.element,
                    });

                    marker.addListener("click", () => {
                        setSelectedCell(pos.cell);
                        infoWindow.setContent(`<strong>${pos.cell.name}</strong><br/>Layer: ${pos.layer.toUpperCase()}`);
                        if (mapRef.current) infoWindow.open(mapRef.current, marker);
                    });
                    
                    return marker;
                });

                markersRef.current = markers;

                if (mapRef.current) {
                    const renderer = {
                        render: function (cluster: any) {
                            const { count, position } = cluster;
                            // Adaptive coloring for clusters
                            let color = '#334155'; // Neutral charcoal for mixed clusters
                            if (enabledLayers.length === 1) {
                                const active = enabledLayers[0];
                                if (active === 'demand') color = '#f59e0b';
                                else if (active === 'supply') color = '#3b82f6';
                                else if (active === 'imbalance') color = count > 15 ? '#ef4444' : '#10b981';
                                else if (active === 'surge') color = '#8b5cf6';
                                else if (active === 'eta') color = '#ec4899';
                            }
                            
                            const size = count > 30 ? 56 : count > 10 ? 46 : 36;
                            
                            const bgColor = `rgba(51, 65, 85, 0.15)`;

                            const div = document.createElement('div');
                            div.style.cssText = `
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              width: ${size}px;
                              height: ${size}px;
                              border-radius: 50%;
                              background: ${bgColor};
                              border: 2px solid ${color};
                              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                              cursor: pointer;
                              transition: transform 0.2s ease;
                            `;
                            div.innerHTML = `
                              <span style="
                                font-size: ${size > 46 ? 15 : 13}px;
                                font-weight: 700;
                                color: ${color};
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                              ">${count}</span>
                            `;
                            
                            return new AdvancedMarkerElement({
                                position,
                                content: div,
                                zIndex: 999999 + count,
                            });
                        }
                    };

                    clustererRef.current = new MarkerClusterer({ markers, map: mapRef.current, renderer });
                }
            } catch (e) {
                console.error("Clustering init failed:", e);
            }
        }

        initClusters();

        return () => {
            if (clustererRef.current) {
                clustererRef.current.clearMarkers();
            }
        }
    }, [cells, activeLayer, isLoaded]);

    if (loadError) return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Map load error: {loadError.message}</div>;
    if (!isLoaded) return <div style={{height: '100%', background: '#f8fafc', borderRadius: 12}}></div>;

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', borderRadius: isFullscreen ? 0 : 12, overflow: 'hidden' }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: mapCenter[0], lng: mapCenter[1] }}
                zoom={12}
                onLoad={onLoadMap}
                onUnmount={onUnmountMap}
                mapTypeId={mapTypeId}
                options={{
                    mapId: mapId,
                }}
                onClick={() => setSelectedCell(null)}
            >
                {/* H3 Grid Polygon Overlay (True Heatmap) */}
                {cells.map(cell => {
                    const isVisible = enabledLayers.length > 0;
                    if (!isVisible) return null;

                    // Composite heat score logic
                    let color = '#3b82f6'; // Default Supply blue
                    if (enabledLayers.includes('demand')) {
                        const ratio = cell.metrics.demandCount / 20;
                        color = ratio > 0.8 ? '#ef4444' : ratio > 0.4 ? '#f59e0b' : '#3b82f6';
                    } else if (enabledLayers.includes('imbalance')) {
                        color = cell.derived.imbalanceRatio > 2 ? '#ef4444' : '#10b981';
                    } else if (enabledLayers.includes('surge')) {
                        color = cell.metrics.surgeSuggestion > 1.2 ? '#8b5cf6' : '#10b981';
                    }

                    return (
                        <Polygon
                            key={`poly-${cell.id}`}
                            paths={cell.baseBounds}
                            options={{
                                fillColor: color,
                                fillOpacity: 0.25 + (cell.derived.heatScore * 0.45),
                                strokeColor: color,
                                strokeOpacity: 0.6,
                                strokeWeight: 1,
                                clickable: false
                            }}
                        />
                    );
                })}

                {/* Floating Search Bar */}
                <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Search for a location..."
                        style={{
                            boxSizing: 'border-box',
                            border: '1px solid #e2e8f0',
                            width: '400px',
                            height: '40px',
                            padding: '0 16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px',
                            outline: 'none',
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-200px',
                            top: '16px',
                            zIndex: 100,
                            background: 'white'
                        }}
                    />
                </Autocomplete>

                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                    <Button 
                        icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
                        onClick={toggleFullscreen}
                        className="shadow-sm"
                        style={{ borderRadius: 8, border: 'none' }}
                    />
                </div>
                <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}>
                    <Card size="small" variant="borderless" className="shadow-sm" style={{ borderRadius: 8, minWidth: 200, padding: 4 }}>
                        <Typography.Text strong style={{ fontSize: 11, display: 'block', marginBottom: 8, letterSpacing: 0.5 }}>
                            {activeLayer.toUpperCase()} REPRESENTATION
                        </Typography.Text>
                        <Space orientation="vertical" size={2} style={{ width: '100%' }}>
                            {enabledLayers.includes('imbalance') && (
                                <Badge color="#ef4444" text={<span style={{fontSize: 12}}>Critical Imbalance</span>} />
                            )}
                            {enabledLayers.includes('demand') && (
                                <Badge color="#f59e0b" text={<span style={{fontSize: 12}}>Demand Load</span>} />
                            )}
                            {enabledLayers.includes('supply') && (
                                <Badge color="#3b82f6" text={<span style={{fontSize: 12}}>Active Supply</span>} />
                            )}
                            {enabledLayers.includes('surge') && (
                                <Badge color="#8b5cf6" text={<span style={{fontSize: 12}}>Surge Active</span>} />
                            )}
                            {enabledLayers.includes('eta') && (
                                <Badge color="#ec4899" text={<span style={{fontSize: 12}}>Fulfillment ETA</span>} />
                            )}
                        </Space>
                    </Card>
                </div>
            </GoogleMap>
        </div>
    );
};
