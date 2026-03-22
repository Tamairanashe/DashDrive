import React, { useEffect, useState } from 'react';
import { 
    Button, Input, Space, Divider, DatePicker 
} from 'antd';
import { 
    CircleF, 
    PolygonF, 
    PolylineF, 
    OverlayViewF, 
    OverlayView,
    TrafficLayerF,
    TransitLayerF,
    BicyclingLayerF
} from '@react-google-maps/api';
import { 
    EnvironmentOutlined, 
    CalendarOutlined, 
    FullscreenOutlined, 
    FullscreenExitOutlined, 
    SyncOutlined,
    CarOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    StarFilled
} from '@ant-design/icons';
import { BaseMap, useBaseMap } from '../../../components/BaseMap';
import { RoutePreview } from '../../../components/RoutePreview';
import { 
    Zone, 
    WeatherCluster, 
    TrafficCluster, 
    EventCluster, 
    ServiceAsset, 
    DemandPoint 
} from '../types';
import { 
    LOCATION_COORDS, 
    SERVICE_TYPES, 
    MOCK_RAIN_CLUSTERS, 
    MOCK_TRAFFIC_CLUSTERS, 
    MOCK_SERVICE_ASSETS, 
    MOCK_DEMAND_POINTS 
} from '../mocks/heatmapMocks';

// --- Sub-components ---

const DemandPointMarker = ({ position, serviceColor }: { position: google.maps.LatLngLiteral, serviceColor: string }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)' }}>
            <div className="pulse-marker" style={{ background: serviceColor, width: '12px', height: '12px', border: '2px solid white', borderRadius: '50%', boxShadow: `0 0 10px ${serviceColor}` }}></div>
        </div>
    </OverlayViewF>
);

const ServiceAssetMarker = ({ position, service, color }: { position: google.maps.LatLngLiteral, service: string, color: string }) => {
    let iconHtml: React.ReactNode = null;
    if (service === 'ride') iconHtml = <CarOutlined style={{ fontSize: 18 }} />;
    else if (service === 'food') iconHtml = <ThunderboltOutlined style={{ fontSize: 18 }} />;
    else if (service === 'parcel') iconHtml = <EnvironmentOutlined style={{ fontSize: 18 }} />;
    else iconHtml = <TeamOutlined style={{ fontSize: 18 }} />;

    return (
        <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div style={{ transform: 'translate(-50%, -50%)' }}>
                <div style={{ background: 'white', border: `2px solid ${color}`, color: color, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    {iconHtml}
                </div>
            </div>
        </OverlayViewF>
    );
};

const EventMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)' }}>
            <div className="pulse-marker" style={{ background: '#eab308', width: '14px', height: '14px', border: '2px solid white', borderRadius: '50%', boxShadow: '0 0 15px #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarFilled style={{ fontSize: 8, color: 'white' }} />
            </div>
        </div>
    </OverlayViewF>
);

const MapEffect = ({ center, zoom = 12 }: { center: { lat: number, lng: number }, zoom?: number }) => {
    const { map } = useBaseMap();
    useEffect(() => {
        if (map) {
            map.panTo(center);
            map.setZoom(zoom);
        }
    }, [center, zoom, map]);
    return null;
};

// --- Main Canvas Component ---

interface HeatMapCanvasProps {
    selectedCity: string;
    mapCenter: [number, number];
    isDrilldownActive: boolean;
    enabledLayers: string[];
    zones: Zone[];
    service: string;
    events: EventCluster[];
    setSelectedZone: (zone: Zone) => void;
    setMapCenter: (center: [number, number]) => void;
    setIsDrilldownActive: (active: boolean) => void;
    handleMapSearch: (val: string) => void;
    handleDateChange: (dates: any) => void;
    setIsCalendarVisible: (visible: boolean) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    trafficMode: 'live' | 'typical';
    mapId?: string;
    mapTypeId: string;
}

export const HeatMapCanvas: React.FC<HeatMapCanvasProps> = ({
    selectedCity,
    mapCenter,
    isDrilldownActive,
    enabledLayers,
    zones,
    service,
    events,
    setSelectedZone,
    setMapCenter,
    setIsDrilldownActive,
    handleMapSearch,
    handleDateChange,
    setIsCalendarVisible,
    isFullscreen,
    toggleFullscreen,
    trafficMode,
    mapId,
    mapTypeId
}) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const getZoneColor = (demand: string) => {
        switch(demand) {
            case 'low': return '#22c55e';
            case 'medium': return '#eab308';
            case 'high': return '#ef4444';
            case 'critical': return '#a855f7';
            default: return '#3b82f6';
        }
    };

    const serviceColor = SERVICE_TYPES.find(s => s.id === service)?.color || '#3b82f6';

    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden', borderRadius: isFullscreen ? 0 : 12 }}>
            <BaseMap 
                center={mapCenter} 
                zoom={13} 
                height="100%"
                mapTypeId={mapTypeId}
                mapId={mapId}
                onLoad={setMap}
            >
                <MapEffect center={{ lat: mapCenter[0], lng: mapCenter[1] }} zoom={isDrilldownActive ? 15 : 12} />
                
                {(enabledLayers.includes('demand') || enabledLayers.includes('supply')) && zones.map(zone => (
                    <CircleF 
                        key={zone.id}
                        center={{ lat: zone.lat, lng: zone.lng }}
                        options={{ 
                            fillColor: enabledLayers.includes('demand') ? getZoneColor(zone.demand) : '#3b82f6', 
                            strokeColor: enabledLayers.includes('demand') ? getZoneColor(zone.demand) : '#3b82f6', 
                            fillOpacity: enabledLayers.includes('demand') ? 0.5 : 0.3 
                        }}
                        radius={enabledLayers.includes('demand') ? (zone.demand === 'critical' ? 2000 : 3000) : (zone.drivers * 150)}
                        onClick={() => {
                            setSelectedZone(zone);
                            setMapCenter([zone.lat, zone.lng]);
                            setIsDrilldownActive(true);
                        }}
                    />
                ))}

                {enabledLayers.includes('rain') && MOCK_RAIN_CLUSTERS.map(rain => (
                    <PolygonF 
                        key={rain.id}
                        path={rain.points}
                        options={{ fillColor: '#0ea5e9', strokeColor: '#0ea5e9', fillOpacity: 0.25, strokeWeight: 1 }}
                    />
                ))}

                {enabledLayers.includes('traffic') && trafficMode === 'live' && <TrafficLayerF />}
                {enabledLayers.includes('transit') && <TransitLayerF />}
                {enabledLayers.includes('biking') && <BicyclingLayerF />}

                {enabledLayers.includes('events') && events.map(event => (
                    <EventMarker 
                        key={event.id} 
                        position={{ lat: event.lat, lng: event.lng }} 
                    />
                ))}

                {service !== 'ALL' && MOCK_SERVICE_ASSETS.filter(a => a.service === service).map(asset => (
                    <ServiceAssetMarker 
                        key={asset.id} 
                        position={{ lat: asset.lat, lng: asset.lng }} 
                        service={asset.service}
                        color={serviceColor}
                    />
                ))}

                {isDrilldownActive && MOCK_DEMAND_POINTS.map(point => (
                    <DemandPointMarker 
                        key={point.id} 
                        position={{ lat: point.lat, lng: point.lng }} 
                        serviceColor={serviceColor}
                    />
                ))}

                {isDrilldownActive && zones.find(z => z.lat === mapCenter[0] && z.lng === mapCenter[1])?.demand === 'critical' && (
                    <RoutePreview 
                        encodedPolyline="~qve@e~w_Fe@o@{@e@u@e@s@e@q@e@p@e@o@e@n@e@m@e@l@e@k@e@j@e@i@e@h@e@g@e@f@e@e@e@d@e@c@e@b@e@a@e@`@e@_@e@^@e@]@e@\@e@[@e@Z@e@Y@e@X@e@W@e@V@e@U@e@T@e@S@e@R@e@Q@e@P@e@O@e@N@e@M@e@L@e@K@e@J@e@I@e@H@e@G@e@F@e@E@e@D@e@C@e@B@e@A@e@@"
                        color="#f43f5e"
                        weight={8}
                    />
                )}
            </BaseMap>

            {/* Global Map Controls */}
            <div style={{
                position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 60,
                display: 'flex', gap: '12px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)', borderRadius: '50px', border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <Input.Search
                    placeholder="Search zone or location..."
                    allowClear
                    onSearch={handleMapSearch}
                    style={{ width: 250 }}
                    className="glass-search"
                    prefix={<EnvironmentOutlined style={{ color: '#3b82f6' }} />}
                />
                <Divider orientation="vertical" style={{ height: 24, margin: '4px 0' }} />
                <DatePicker.RangePicker
                    onChange={handleDateChange}
                    className="glass-picker"
                    suffixIcon={<CalendarOutlined style={{ color: '#3b82f6' }} />}
                    placeholder={['Start Date', 'End Date']}
                />
                <Button
                    icon={<CalendarOutlined />}
                    onClick={() => setIsCalendarVisible(true)}
                    type="primary"
                    shape="circle"
                    style={{ background: '#1e293b', border: 'none' }}
                />
            </div>

            {/* Fullscreen Button */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 60 }}>
                <Button
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    shape="circle"
                    size="large"
                    className="shadow-sm"
                    style={{ background: 'white', border: 'none' }}
                />
            </div>


            {/* Reset Perspective Button */}
            {isDrilldownActive && (
                <div style={{ position: 'absolute', top: 16, left: 96, zIndex: 70 }}>
                    <Button
                        icon={<SyncOutlined />}

                        onClick={() => {
                            setIsDrilldownActive(false);
                            setMapCenter([LOCATION_COORDS[selectedCity].lat, LOCATION_COORDS[selectedCity].lng]);
                        }}
                        type="primary"
                        shape="round"
                        className="shadow-sm"
                    >
                        Reset View
                    </Button>
                </div>
            )}
        </div>
    );
};
