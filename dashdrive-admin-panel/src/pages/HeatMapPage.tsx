import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Typography, Row, Col, Card, Select, Button, Space, 
    Tag, Statistic, Divider, message, Alert, Switch, Skeleton,
    Badge, List, Drawer, Progress, Tabs, Avatar, Input, Table, DatePicker, InputNumber,
    Calendar, Form, TimePicker, Slider, Timeline
} from 'antd';
import { 
    CircleF, InfoWindowF, 
    PolygonF, PolylineF, MarkerF, OverlayViewF, OverlayView
} from '@react-google-maps/api';
import { BaseMap, useBaseMap } from '../components/BaseMap';
import { 
    SyncOutlined, 
    GlobalOutlined, 
    ThunderboltOutlined, 
    CarOutlined, 
    NotificationOutlined,
    PlusOutlined,
    EnvironmentOutlined,
    FireOutlined,
    TeamOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CloudOutlined,
    FieldTimeOutlined,
    InfoCircleOutlined,
    SafetyOutlined,
    WarningOutlined,
    StopOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    HistoryOutlined,
    UnorderedListOutlined,
    RiseOutlined,
    FallOutlined,
    UserOutlined,
    StarFilled,
    WalletOutlined,
    SwapOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
// import L from 'leaflet';

const { Title, Text } = Typography;
const { Option } = Select;

// Location Data with Coordinates
const LOCATION_COORDS: any = {
  'Harare': { lat: -17.8248, lng: 31.0530 },
  'Bulawayo': { lat: -20.1465, lng: 28.5833 },
  'Johannesburg': { lat: -26.2041, lng: 28.0473 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 }
};

const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare'], 'Matabeleland': ['Bulawayo'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } },
  'South Africa': { regions: { 'Gauteng': ['Johannesburg'], 'Western Cape': ['Cape Town'] } }
};

const MOCK_ZONES = [
    { id: 'z1', name: 'CBD Terminal', lat: -17.8248, lng: 31.0530, demand: 'high', drivers: 8, orders: 120, waitTime: '12 min', surge: 1.8, prevOrders: 105, prevDemand: 'medium' },
    { id: 'z2', name: 'Westgate Mall', lat: -17.7800, lng: 31.0000, demand: 'medium', drivers: 25, orders: 40, waitTime: '4 min', surge: 1.1, prevOrders: 45, prevDemand: 'medium' },
    { id: 'z3', name: 'Airport Plaza', lat: -17.9333, lng: 31.0833, demand: 'critical', drivers: 2, orders: 65, waitTime: '22 min', surge: 2.5, prevOrders: 40, prevDemand: 'high' },
    { id: 'z4', name: 'Avondale Village', lat: -17.8000, lng: 31.0333, demand: 'low', drivers: 35, orders: 15, waitTime: '2 min', surge: 1.0, prevOrders: 18, prevDemand: 'low' },
];

const SERVICE_TYPES = [
    { id: 'ride', name: 'Ride Hailing', icon: <CarOutlined />, kpiName: 'Active Bids', color: '#3b82f6' },
    { id: 'food', name: 'Food Delivery', icon: <ThunderboltOutlined />, kpiName: 'Active Orders', color: '#f97316' },
    { id: 'mart', name: 'Mart Delivery', icon: <GlobalOutlined />, kpiName: 'Active Carts', color: '#10b981' },
    { id: 'parcel', name: 'Parcel Delivery', icon: <EnvironmentOutlined />, kpiName: 'Active Deliveries', color: '#8b5cf6' },
    { id: 'shopping', name: 'Shopping', icon: <TeamOutlined />, kpiName: 'Active Trips', color: '#ec4899' },
];

const getMockZonesForService = (serviceId: string) => {
    // Generate service-specific demand patterns
    return MOCK_ZONES.map(zone => {
        let demand = zone.demand;
        let drivers = zone.drivers;
        let orders = zone.orders;
        
        if (serviceId === 'food') {
            // Food demand is higher in residential (Avondale/Westgate) during evening
            if (zone.id === 'z2' || zone.id === 'z4') demand = 'critical';
            orders = orders * 1.5;
        } else if (serviceId === 'parcel') {
            // Parcel demand higher in Logistics/Industrial (CBD/Airport)
            if (zone.id === 'z1' || zone.id === 'z3') demand = 'high';
            drivers = drivers * 0.5;
        } else if (serviceId === 'ride') {
            // Default MOCK_ZONES
        }
        
        return { ...zone, demand, drivers, orders: Math.round(orders) };
    });
};

const MOCK_RAIN_CLUSTERS = [
    { 
        id: 'r1', 
        points: [{lat: -17.8100, lng: 31.0400}, {lat: -17.8200, lng: 31.0600}, {lat: -17.8400, lng: 31.0500}], 
        intensity: 'Heavy Storm', 
        impact: '+35% Demand' 
    }
];

const MOCK_TRAFFIC_CLUSTERS = [
    { 
        id: 't1', 
        path: [{lat: -17.8200, lng: 31.0200}, {lat: -17.8200, lng: 31.0800}], 
        level: 'Gridlock', 
        delay: '+15 min' 
    },
    { 
        id: 't2', 
        path: [{lat: -17.7800, lng: 31.0500}, {lat: -17.8500, lng: 31.0500}], 
        level: 'Flowing Heavy', 
        delay: '+8 min' 
    }
];

const MOCK_EVENT_CLUSTERS = [
    {
        id: 'ev1',
        name: 'Zim Afro Jazz Festival',
        lat: -17.868,
        lng: 31.020,
        type: 'Concert',
        impact: '+45%',
        attendees: '15.5k'
    },
    {
        id: 'ev2',
        name: 'National Independence Gala',
        lat: -17.825,
        lng: 31.053,
        type: 'Holiday/Gala',
        impact: '+30%',
        attendees: '25k'
    }
];

const MOCK_SERVICE_ASSETS = [
    { id: 'DS-101', service: 'ride', lat: -17.828, lng: 31.050, name: 'Tinashe M.', tier: 'DashX' },
    { id: 'DS-102', service: 'ride', lat: -17.820, lng: 31.058, name: 'Blessing K.', tier: 'Economy' },
    { id: 'FD-201', service: 'food', lat: -17.795, lng: 31.005, name: 'Farai G.', status: 'On Delivery' },
    { id: 'FD-202', service: 'food', lat: -17.805, lng: 31.030, name: 'Simbai R.', status: 'Idle' },
    { id: 'PL-301', service: 'parcel', lat: -17.935, lng: 31.090, name: 'Zim Hub 1', type: 'Truck' },
];

const MOCK_DEMAND_POINTS = [
    { id: 'UP-001', lat: -17.825, lng: 31.052, name: 'Tapfuma J.', rating: 4.8, trips: 142, loyalty: 'Platinum', behavior: 'Frequent Rider', since: '2023-01-12', activeRequests: ['ride', 'food'], topVertical: 'Ride Hailing' },
    { id: 'UP-002', lat: -17.824, lng: 31.054, name: 'Nyasha C.', rating: 4.9, trips: 89, loyalty: 'Gold', behavior: 'Business User', since: '2023-05-20', activeRequests: ['ride'], topVertical: 'Ride Hailing' },
    { id: 'UP-003', lat: -17.826, lng: 31.051, name: 'Kudzai L.', rating: 4.7, trips: 215, loyalty: 'Platinum', behavior: 'Premium User', since: '2022-11-05', activeRequests: ['food', 'mart'], topVertical: 'Food Delivery' },
    { id: 'UP-004', lat: -17.781, lng: 31.001, name: 'Rutendo M.', rating: 4.6, trips: 34, loyalty: 'Silver', behavior: 'Weekend User', since: '2024-02-15', activeRequests: ['parcel'], topVertical: 'Parcel Delivery' },
];

const MOCK_TRANSACTIONS = [
    { id: 'TX-8821', userId: 'UP-001', date: '2024-03-08 14:22', service: 'ride', type: 'debit', amount: 12.50, description: 'Ride: CBD to Avondale', status: 'Completed' },
    { id: 'TX-8822', userId: 'UP-001', date: '2024-03-08 12:45', service: 'food', type: 'debit', amount: 24.99, description: 'Order: Nandos Peri-Peri', status: 'Completed' },
    { id: 'TX-8823', userId: 'UP-001', date: '2024-03-07 09:00', service: 'wallet', type: 'credit', amount: 100.00, description: 'Wallet Top-up: EcoCash', status: 'Completed' },
    { id: 'TX-8824', userId: 'UP-001', date: '2024-03-06 18:30', service: 'ride', type: 'debit', amount: 8.75, description: 'Ride: Home to Airport', status: 'Completed' },
    { id: 'TX-8825', userId: 'UP-001', date: '2024-03-06 11:15', service: 'mart', type: 'debit', amount: 45.20, description: 'Groceries: OK Supermarket', status: 'Completed' },
    { id: 'TX-8826', userId: 'UP-002', date: '2024-03-08 15:10', service: 'ride', type: 'debit', amount: 15.00, description: 'Ride: Westgate to City', status: 'Completed' },
    { id: 'TX-8827', userId: 'UP-002', date: '2024-03-07 16:40', service: 'ride', type: 'debit', amount: 22.50, description: 'Ride: Corporate Office', status: 'Refunded' },
];

const DemandPointMarker = ({ position, service }: { position: google.maps.LatLngLiteral, service: string }) => {
    const color = SERVICE_TYPES.find(s => s.id === service)?.color || '#3b82f6';
    return (
        <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div style={{ transform: 'translate(-50%, -50%)' }}>
                <div className="pulse-marker" style={{ background: color, width: '12px', height: '12px', border: '2px solid white', borderRadius: '50%', boxShadow: `0 0 10px ${color}` }}></div>
            </div>
        </OverlayViewF>
    );
};

const ServiceAssetMarker = ({ position, service, id, name }: { position: google.maps.LatLngLiteral, service: string, id: string, name: string }) => {
    const color = SERVICE_TYPES.find(s => s.id === service)?.color || '#3b82f6';
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

const EventMarker = ({ position, name }: { position: google.maps.LatLngLiteral, name: string }) => {
    return (
        <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div style={{ transform: 'translate(-50%, -50%)' }}>
                <div className="pulse-marker" style={{ background: '#eab308', width: '14px', height: '14px', border: '2px solid white', borderRadius: '50%', boxShadow: '0 0 15px #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StarFilled style={{ fontSize: 8, color: 'white' }} />
                </div>
            </div>
        </OverlayViewF>
    );
};

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

export const HeatMapPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
    const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
    const [selectedCity, setSelectedCity] = useState('Harare');
    const [viewMode, setViewMode] = useState<'demand' | 'density'>('demand');
    const [weather, setWeather] = useState({ condition: 'Light Rain', temp: '22Â°C', impact: '+15%' });
    const [marketTemperament, setMarketTemperament] = useState({ label: 'Evening Rush', status: 'Peak' });
    const [traffic, setTraffic] = useState({ level: 'Heavy Congestion', delay: '+12 min', impact: '+25%' });
    const [enabledLayers, setEnabledLayers] = useState<string[]>(['demand', 'rain', 'traffic', 'events']);
    const [service, setService] = useState('ALL');
    const [timeRange, setTimeRange] = useState('LIVE');
    const [loading, setLoading] = useState(false);
    const [zones, setZones] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<any | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoneListVisible, setIsZoneListVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileDrawerVisible, setIsProfileDrawerVisible] = useState(false);
    const [isLedgerDrawerVisible, setIsLedgerDrawerVisible] = useState(false);
    const [isFlagDrawerVisible, setIsFlagDrawerVisible] = useState(false);
    const [actionReason, setActionReason] = useState('');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<any>(null);
    const [surgeValue, setSurgeValue] = useState<number>(1.5);
    const [isDrilldownActive, setIsDrilldownActive] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [peakHours, setPeakHours] = useState<any[]>([
        { id: 1, day: 'Monday', zone: 'GLOBAL', startTime: '08:00', endTime: '12:00', multiplier: '1.5x' },
        { id: 2, day: 'Monday', zone: 'z-3', startTime: '13:00', endTime: '17:00', multiplier: '1.2x' },
        { id: 3, day: 'Tuesday', zone: 'GLOBAL', startTime: '10:00', endTime: '11:00', multiplier: '1.8x' },
        { id: 4, day: 'Tuesday', zone: 'z-1', startTime: '13:00', endTime: '18:00', multiplier: '1.3x' },
        { id: 5, day: 'Sunday', zone: 'GLOBAL', startTime: '09:00', endTime: '14:00', multiplier: '1.5x' },
        { id: 6, day: 'Sunday', zone: 'z-2', startTime: '16:00', endTime: '20:00', multiplier: '2.0x' },
    ]);
    const [isAutoBroadcastEnabled, setIsAutoBroadcastEnabled] = useState(false);
    const [events, setEvents] = useState<any[]>(MOCK_EVENT_CLUSTERS);
    const [incentiveAmount, setIncentiveAmount] = useState<number>(5.00);
    const [broadcastMode, setBroadcastMode] = useState<'INCENTIVE' | 'MANUAL'>('INCENTIVE');
    const [manualBroadcastMessage, setManualBroadcastMessage] = useState<string>('');
    const [commandLog, setCommandLog] = useState<any[]>([
        { time: '17:45', msg: 'Peak Hour Alert sent to CBD Terminal', type: 'INCENTIVE' },
        { time: '17:10', msg: 'Weather warning: Heavy rain in Avondale', type: 'MANUAL' }
    ]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-17.8248, 31.0530]);

    const handleMapSearch = (value: string) => {
        const found = MOCK_ZONES.find(z => z.name.toLowerCase().includes(value.toLowerCase()));
        if (found) {
            setMapCenter([found.lat, found.lng]);
            setIsDrilldownActive(true);
            setSelectedZone(found);
            message.success(`Navigating to ${found.name}`);
        } else {
            message.warning('Location or zone not found in current sector.');
        }
    };

    const handleDateChange = (dates: any) => {
        setDateRange(dates);
        if (dates) {
            message.loading('Refreshing demand intelligence for selected period...', 1.5).then(() => {
                message.success('Temporal demand data updated.');
            });
        }
    };

    const toggleFullscreen = () => {
        const mapElement = document.getElementById('heatmap-container');
        if (!mapElement) return;

        if (!document.fullscreenElement) {
            mapElement.requestFullscreen().catch(err => {
                message.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const getBroadcastMessage = () => {
        if (!selectedZone) return '';
        
        const globalEvent = events.find(e => e.isGlobal);
        const localEvent = events.find(e =>
            !e.isGlobal &&
            Math.abs(e.lat - (selectedZone?.lat || 0)) < 0.05 &&
            Math.abs(e.lng - (selectedZone?.lng || 0)) < 0.05
        );
        const activeEvent = globalEvent || localEvent;

        let context = 'Market Alert';
        let reason = 'High Demand';

        if (activeEvent) {
            context = 'Event Alert';
            reason = `${activeEvent.name} is driving demand spikes`;
        } else if (selectedZone.demand === 'critical') {
            context = 'Peak Hour Alert';
            reason = 'Critical supply shortage';
        } else if (traffic.level.includes('Heavy') || traffic.level.includes('Gridlock')) {
            context = 'Traffic Alert';
            reason = 'Heavy congestion in this sector';
        }

        return `${context}: ${reason} in ${selectedZone.name}! $${incentiveAmount.toFixed(2)} Incentive active. Head there now!`;
    };

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 600));
            const newZones = getMockZonesForService(service.toLowerCase().replace(' ', '_'));
            setZones(newZones);
            setSelectedZone(newZones[0]);
            setLoading(false);
        };
        fetchData();
    }, [selectedCity, service, timeRange]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const getZoneColor = (demand: string) => {
        switch(demand) {
            case 'low': return '#22c55e'; // Green
            case 'medium': return '#eab308'; // Yellow
            case 'high': return '#ef4444'; // Red
            case 'critical': return '#a855f7'; // Purple
            default: return '#3b82f6';
        }
    };

    return (
        <div style={{ paddingBottom: 24 }}>
            <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24, borderRadius: 12 }}>
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space align="center" size="middle">
                                    <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Market Intensity Hub</Title>
                                    <Divider orientation="vertical" />
                                    <Space size="small" wrap>
                                        <Select 
                                            value={selectedCountry} 
                                            style={{ width: 140 }} 
                                            bordered={false}
                                            onChange={(val) => {
                                                setSelectedCountry(val);
                                                const firstRegion = Object.keys(LOCATION_DATA[val].regions)[0];
                                                setSelectedRegion(firstRegion);
                                                setSelectedCity(LOCATION_DATA[val].regions[firstRegion][0]);
                                            }}
                                            prefix={<GlobalOutlined style={{ color: '#3b82f6', marginRight: 8 }} />}
                                        >
                                            {Object.keys(LOCATION_DATA).map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                        </Select>
                                        <Select 
                                            value={selectedRegion} 
                                            style={{ width: 140 }} 
                                            bordered={false}
                                            onChange={(val) => {
                                                setSelectedRegion(val);
                                                setSelectedCity(LOCATION_DATA[selectedCountry].regions[val][0]);
                                            }}
                                        >
                                            {Object.keys(LOCATION_DATA[selectedCountry].regions).map(r => <Select.Option key={r} value={r}>{r}</Select.Option>)}
                                        </Select>
                                        <Select 
                                            value={selectedCity} 
                                            style={{ width: 120 }} 
                                            bordered={false}
                                            onChange={setSelectedCity}
                                            suffixIcon={<EnvironmentOutlined />}
                                        >
                                            {LOCATION_DATA[selectedCountry].regions[selectedRegion].map((c: string) => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                        </Select>
                                        <Divider orientation="vertical" />
                                        <Select 
                                            value={service} 
                                            style={{ width: 180, fontWeight: 700 }} 
                                            bordered={true}
                                            className="premium-select-glow"
                                            onChange={setService}
                                        >
                                            <Select.Option value="ALL">All Services Overview</Select.Option>
                                            {SERVICE_TYPES.map(s => (
                                                <Select.Option key={s.id} value={s.id}>
                                                    <Space>{s.icon} {s.name}</Space>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Space>
                                </Space>
                            </Col>
                            <Col>
                                <Space>
                                    <Button 
                                        icon={<UnorderedListOutlined />} 
                                        onClick={() => setIsZoneListVisible(true)}
                                    >
                                        Zone List
                                    </Button>
                                    <Button icon={<SyncOutlined spin={loading} />} onClick={handleRefresh} type="text">Scan AI Alpha</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                    
                    <Col span={24}>
                        <Divider style={{ margin: 0 }} />
                    </Col>

                    <Col span={24}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space size="large" wrap>
                                    <Space>
                                        <CloudOutlined style={{ color: '#0ea5e9' }} />
                                        <Text strong>{weather.condition}</Text>
                                        <Tag color="cyan" style={{ borderRadius: 4 }}>{weather.impact}</Tag>
                                    </Space>
                                    <Divider orientation="vertical" />
                                    <Space>
                                        <StopOutlined style={{ color: '#ef4444' }} />
                                        <Text strong>Traffic</Text>
                                        <Tag color="error" style={{ borderRadius: 4 }}>{traffic.impact}</Tag>
                                    </Space>
                                    <Divider orientation="vertical" />
                                    <Space>
                                        <FieldTimeOutlined style={{ color: '#f59e0b' }} />
                                        <Text strong>{marketTemperament.label}</Text>
                                        <Badge status="processing" text={marketTemperament.status} />
                                    </Space>
                                </Space>
                            </Col>
                            <Col>
                                <Space>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Visual Layers:</Text>
                                    <Select 
                                        mode="multiple"
                                        placeholder="Active Layers"
                                        value={enabledLayers}
                                        onChange={setEnabledLayers}
                                        style={{ minWidth: 260 }}
                                        maxTagCount="responsive"
                                        size="middle"
                                        className="premium-select"
                                    >
                                        <Option value="demand">Market Demand</Option>
                                        <Option value="supply">Driver Supply</Option>
                                        <Option value="rain">Weather (Rain)</Option>
                                        <Option value="traffic">Traffic (Jams)</Option>
                                    </Select>
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        bordered={false} 
                        className="shadow-sm" 
                        bodyStyle={{ padding: 0, height: 600, position: 'relative', borderRadius: 12 }}
                        id="heatmap-container"
                    >
                        <div style={{ height: '100%', width: '100%', overflow: 'hidden', borderRadius: isFullscreen ? 0 : 12 }}>
                            <BaseMap 
                                center={[LOCATION_COORDS[selectedCity].lat, LOCATION_COORDS[selectedCity].lng]} 
                                zoom={12} 
                                height="100%"
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

                                {enabledLayers.includes('traffic') && MOCK_TRAFFIC_CLUSTERS.map(jam => (
                                    <PolylineF 
                                        key={jam.id}
                                        path={jam.path}
                                        options={{ strokeColor: '#ef4444', strokeWeight: 8, strokeOpacity: 0.6 }}
                                    />
                                ))}

                                {enabledLayers.includes('events') && events.map(event => (
                                    <EventMarker 
                                        key={event.id} 
                                        position={{ lat: event.lat, lng: event.lng }} 
                                        name={event.name}
                                    />
                                ))}

                                {service !== 'ALL' && MOCK_SERVICE_ASSETS.filter(a => a.service === service).map(asset => (
                                    <ServiceAssetMarker 
                                        key={asset.id} 
                                        position={{ lat: asset.lat, lng: asset.lng }} 
                                        service={asset.service}
                                        id={asset.id}
                                        name={asset.name}
                                    />
                                ))}

                                {isDrilldownActive && selectedZone && MOCK_DEMAND_POINTS.map(point => (
                                    <DemandPointMarker 
                                        key={point.id} 
                                        position={{ lat: point.lat, lng: point.lng }} 
                                        service={service === 'ALL' ? 'ride' : service}
                                    />
                                ))}
                            </BaseMap>
                        </div>

                       {/* Global Map Controls */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    display: 'flex',
                    gap: '12px',
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
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
                        <div style={{
                            position: 'absolute', top: 16, right: 16, zIndex: 1000
                        }}>
                            <Space>
                                <Button
                                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                    onClick={toggleFullscreen}
                                    shape="circle"
                                    size="large"
                                    className="shadow-sm"
                                    style={{ background: 'white', border: 'none' }}
                                />
                            </Space>
                        </div>

                        {/* Reset Perspective Button */}
                        {isDrilldownActive && (
                            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
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

                        {/* Map Overlay Legend */}
                        <div style={{
                            position: 'absolute', bottom: 24, left: 24, zIndex: 1000,
                            background: 'rgba(255,255,255,0.9)', padding: '16px', borderRadius: 12, border: '1px solid #f0f0f0',
                            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)'
                        }}>
                            <Text strong style={{ display: 'block', marginBottom: 12 }}>Visual Intelligence</Text>
                            <Space orientation="vertical" size={12}>
                                {enabledLayers.includes('demand') && (
                                    <>
                                        <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', border: '2px solid rgba(239, 68, 68, 0.4)' }} /> <Text style={{ fontSize: 13 }}>High Demand (Red)</Text></Space>
                                        <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e' }} /> <Text style={{ fontSize: 13 }}>Stable Market</Text></Space>
                                    </>
                                )}
                                {enabledLayers.includes('supply') && (
                                    <Space><div style={{ width: 14, height: 14, borderRadius: '2px', background: '#3b82f6' }} /> <Text style={{ fontSize: 13 }}>Driver Density</Text></Space>
                                )}
                                {enabledLayers.includes('rain') && (
                                    <Space><div style={{ width: 14, height: 14, borderRadius: '2px', background: '#0ea5e9', opacity: 0.4 }} /> <Text style={{ fontSize: 13 }}>Rain Clusters (Sky Blue)</Text></Space>
                                )}
                                {enabledLayers.includes('traffic') && (
                                    <Space><div style={{ width: 24, height: 4, borderRadius: '2px', background: '#ef4444' }} /> <Text style={{ fontSize: 13 }}>Traffic Gridlock (Red Line)</Text></Space>
                                )}
                                {enabledLayers.includes('events') && (
                                    <Space><div className="pulse-marker" style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', border: '2px solid white' }} /> <Text style={{ fontSize: 13 }}>Local Events (Gold)</Text></Space>
                                )}
                                {service !== 'ALL' && (
                                    <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', border: `2px solid ${SERVICE_TYPES.find(s => s.id === service)?.color}` }} /> <Text style={{ fontSize: 13 }}>{SERVICE_TYPES.find(s => s.id === service)?.name} Assets</Text></Space>
                                )}
                                <Space><div className="pulse-marker" style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', border: '2px solid white' }} /> <Text style={{ fontSize: 13 }}>Individual Demand Points</Text></Space>
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {loading ? (
                        <Card bordered={false} className="shadow-sm" style={{ borderRadius: 12 }}><Skeleton active paragraph={{ rows: 12 }} /></Card>
                    ) : selectedZone ? (
                        <Card
                            bordered={false}
                            className="shadow-sm"
                            style={{ borderRadius: 12 }}
                            title={
                                <Space>
                                    {service === 'ALL' ? <GlobalOutlined style={{ color: getZoneColor(selectedZone.demand) }} /> : SERVICE_TYPES.find(s => s.id === service)?.icon}
                                    <Text strong>{selectedZone.name} {service !== 'ALL' ? SERVICE_TYPES.find(s => s.id === service)?.name : 'Market'} Insights</Text>
                                </Space>
                            }
                        >

                            {selectedZone.demand === 'critical' && (
                                <Alert
                                    message="Under-Supplied Market"
                                    description="Demand outweighs active drivers by 400%. Action recommended."
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 20, borderRadius: 8 }}
                                />
                            )}

                            <Row gutter={[16, 20]}>
                                <Col span={12}>
                                    <Statistic
                                        title="Rider Supply"
                                        value={selectedZone.drivers}
                                        prefix={<CarOutlined />}
                                        valueStyle={{ color: '#3b82f6', fontWeight: 800 }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title={SERVICE_TYPES.find(s => s.id === service)?.kpiName || 'Active Bids'}
                                        value={selectedZone.orders}
                                        prefix={<ArrowUpOutlined />}
                                        valueStyle={{ color: getZoneColor(selectedZone.demand), fontWeight: 800 }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Avg ETA" value={selectedZone.waitTime} />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Surge Strategy"
                                        value={`${selectedZone.surge}x`}
                                        prefix={<ThunderboltOutlined />}
                                        valueStyle={{ color: '#eab308', fontWeight: 800 }}
                                    />
                                </Col>
                            </Row>

                            <Divider style={{ margin: '16px 0' }} />

                            <Title level={5}>Environmental Impact</Title>
                            <Space orientation="vertical" style={{ width: '100%', marginBottom: 16 }}>
                                <Row justify="space-between">
                                    <Text type="secondary"><CloudOutlined /> Weather (Rain)</Text>
                                    <Text type="success">+15.2%</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary"><FieldTimeOutlined /> Peak (Rush Hour)</Text>
                                    <Text type="success">+28.4%</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary"><StopOutlined /> Traffic (Gridlock)</Text>
                                    <Text type="danger">+25.8%</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary"><InfoCircleOutlined /> Local Events</Text>
                                    <Text type="warning">
                                        {(() => {
                                            const globalEvent = events.find(e => e.isGlobal);
                                            const localEvent = events.find(e =>
                                                !e.isGlobal &&
                                                Math.abs(e.lat - (selectedZone?.lat || 0)) < 0.05 &&
                                                Math.abs(e.lng - (selectedZone?.lng || 0)) < 0.05
                                            );
                                            return globalEvent ? globalEvent.impact : (localEvent ? localEvent.impact : 'Normal');
                                        })()}
                                    </Text>
                                </Row>
                            </Space>

                            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                                <Alert
                                    message="AI Tactics Engine"
                                    description={(() => {
                                        const globalEvent = events.find(e => e.isGlobal);
                                        const localEvent = events.find(e =>
                                            !e.isGlobal &&
                                            Math.abs(e.lat - (selectedZone?.lat || 0)) < 0.05 &&
                                            Math.abs(e.lng - (selectedZone?.lng || 0)) < 0.05
                                        );
                                        const activeEvent = globalEvent || localEvent;
                                        return `Surge high due to ${traffic.level}. Market friction is up 40%. ${activeEvent ? `Event Context: ${activeEvent.name} is driving ${activeEvent.impact} demand spikes.` : `Weather impact: ${weather.impact}.`} Recommend $2.00 driver bonus for bypass routes.`;
                                    })()}
                                    type="warning"
                                    showIcon
                                    style={{ fontSize: '12px', padding: '8px 12px' }}
                                />
                                <Divider style={{ margin: '8px 0' }} />

                                <div style={{ background: '#fffbeb', padding: '16px', borderRadius: 12, border: '1px solid #fef3c7' }}>
                                    <Text strong style={{ fontSize: 12, color: '#92400e', display: 'block', marginBottom: 12 }}>SURGE TACTICAL CONTROL</Text>
                                    <Space orientation="vertical" style={{ width: '100%' }} size="small">
                                        <Row gutter={8}>
                                            <Col span={14}>
                                                <Select
                                                    style={{ width: '100%' }}
                                                    value={surgeValue}
                                                    onChange={setSurgeValue}
                                                    placeholder="Multiplier"
                                                >
                                                    <Option value={1.2}>1.2x Multiplier</Option>
                                                    <Option value={1.5}>1.5x Multiplier</Option>
                                                    <Option value={1.8}>1.8x Multiplier</Option>
                                                    <Option value={2.0}>2.0x Multiplier</Option>
                                                    <Option value={2.5}>2.5x Multiplier</Option>
                                                </Select>
                                            </Col>
                                            <Col span={10}>
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    min={1.0}
                                                    max={5.0}
                                                    step={0.1}
                                                    value={surgeValue}
                                                    onChange={(val) => setSurgeValue(val || 1.0)}
                                                    precision={2}
                                                />
                                            </Col>
                                        </Row>
                                        <Button
                                            block
                                            type="primary"
                                            danger
                                            icon={<ThunderboltOutlined />}
                                            onClick={() => message.loading('Deploying Surge Multiplier...', 1.5).then(() => message.success(`Global Surge: ${surgeValue}x Applied to ${selectedZone.name}`))}
                                        >
                                            Deploy {surgeValue}x Surge
                                        </Button>
                                        <Button
                                            block
                                            type="text"
                                            size="small"
                                            style={{ color: '#92400e', fontSize: 11 }}
                                            onClick={() => {
                                                setSurgeValue(selectedZone.surge);
                                                message.info('Reverted to zone base surge');
                                            }}
                                        >
                                            Reset to Standard Market Rate
                                        </Button>
                                    </Space>
                                </div>

                                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, border: '1px solid #e0f2fe', marginTop: 12 }}>
                                    <Text strong style={{ fontSize: 12, color: '#0369a1', display: 'block', marginBottom: 12 }}>BROADCAST CENTER</Text>
                                    
                                    <Tabs 
                                        size="small" 
                                        activeKey={broadcastMode} 
                                        onChange={(key: any) => setBroadcastMode(key)}
                                        items={[
                                            {
                                                key: 'INCENTIVE',
                                                label: (<span><ThunderboltOutlined /> Incentive</span>),
                                                children: (
                                                    <div style={{ paddingTop: 8 }}>
                                                        <Row gutter={8} style={{ marginBottom: 12 }}>
                                                            <Col span={24}>
                                                                <InputNumber
                                                                    prefix="$"
                                                                    style={{ width: '100%' }}
                                                                    min={1}
                                                                    max={50}
                                                                    step={0.5}
                                                                    value={incentiveAmount}
                                                                    onChange={(val) => setIncentiveAmount(val || 1)}
                                                                    precision={2}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                            },
                                            {
                                                key: 'MANUAL',
                                                label: (<span><NotificationOutlined /> Informational</span>),
                                                children: (
                                                    <div style={{ paddingTop: 8 }}>
                                                        <Select 
                                                            placeholder="Quick Templates" 
                                                            style={{ width: '100%', marginBottom: 8 }}
                                                            onChange={(val) => setManualBroadcastMessage(val)}
                                                        >
                                                            <Option value={`WEATHER ALERT: Heavy rain reported near ${selectedZone.name}. Please drive safely and maintain visibility.`}>â›ˆï¸ Heavy Rain Warning</Option>
                                                            <Option value={`TRAFFIC ALERT: Road closure/Gridlock reported near ${selectedZone.name}. Please seek alternative routes.`}>ðŸš§ Road Closure / Gridlock</Option>
                                                            <Option value={`COMMUNITY: ${selectedZone.name} is seeing high demand right now. Head there for back-to-back orders!`}>ðŸš€ High Demand Spike</Option>
                                                            <Option value={`EVENT RADAR: Local event finishing near ${selectedZone.name}. Expect a surge in ride requests shortly.`}>ðŸŽ« Event Outflow Warning</Option>
                                                            <Option value={`SAFETY: Maintain high situational awareness in ${selectedZone.name}. Standard safety protocols active.`}>ðŸ›¡ï¸ Routine Safety Alert</Option>
                                                            <Option value={`PEAK HOUR: Evening rush is starting in ${selectedZone.name}. Log on now to maximize earnings!`}>ðŸŒ‡ Evening Rush Kick-off</Option>
                                                            <Option value={`FUEL TIP: High traffic in ${selectedZone.name}. Consider a break or refueling nearby to stay ready.`}>â›½ Fuel & Efficiency Tip</Option>
                                                            <Option value={`TECH UPDATE: New app version available. Please update at your next break for improved map accuracy.`}>ðŸ“± App Update Available</Option>
                                                            <Option value={`INCENTIVE REMINDER: Complete 3 more trips near ${selectedZone.name} to unlock your Daily Streak bonus!`}>ðŸ’° Streak Bonus Push</Option>
                                                            <Option value={`URGENT: Temporary parking restrictions active in ${selectedZone.name} due to civic works.`}>ðŸš« Parking Restriction Alert</Option>
                                                        </Select>
                                                        <Input.TextArea 
                                                            rows={3} 
                                                            placeholder="Type your message to drivers..." 
                                                            value={manualBroadcastMessage}
                                                            onChange={(e) => setManualBroadcastMessage(e.target.value)}
                                                            style={{ marginBottom: 12, fontSize: 12 }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        ]}
                                    />

                                    <Button
                                        block
                                        type="primary"
                                        icon={<NotificationOutlined />}
                                        onClick={() => {
                                            const msg = broadcastMode === 'INCENTIVE' ? getBroadcastMessage() : manualBroadcastMessage;
                                            if (!msg.trim()) return message.warning('Please enter a message or set an incentive.');
                                            
                                            message.loading('Targeting nearby drivers...', 1.5).then(() => {
                                                const newEntry = {
                                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                                    msg,
                                                    type: broadcastMode
                                                };
                                                setCommandLog([newEntry, ...commandLog]);
                                                message.success(`Broadcast Sent: "${msg}"`);
                                            });
                                        }}
                                        style={{ background: '#0ea5e9', border: 'none' }}
                                    >
                                        {broadcastMode === 'INCENTIVE' ? `Broadcast $${incentiveAmount.toFixed(2)} Incentive` : 'Broadcast Informational Alert'}
                                    </Button>
                                </div>

                                <Divider style={{ margin: '8px 0' }} />
                                <Button
                                    block
                                    type="dashed"
                                    icon={<EnvironmentOutlined />}
                                    onClick={() => navigate(`/dashboard/fleet?zone=${selectedZone.id}`)}
                                >
                                    Inspect Fleet in {selectedZone.name}
                                </Button>

                                <Divider style={{ margin: '16px 0' }}>Marketplace Command Log</Divider>
                                <List
                                    dataSource={commandLog}
                                    size="small"
                                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                                    renderItem={item => (
                                        <List.Item style={{ padding: '8px 0' }}>
                                            <List.Item.Meta
                                                avatar={<Avatar size="small" icon={item.type === 'INCENTIVE' ? <ThunderboltOutlined /> : <InfoCircleOutlined />} style={{ backgroundColor: item.type === 'INCENTIVE' ? '#fffbeb' : '#f0f9ff', color: item.type === 'INCENTIVE' ? '#d97706' : '#0284c7' }} />}
                                                title={<Space><Text strong style={{ fontSize: 11 }}>{item.time}</Text> <Tag color={item.type === 'INCENTIVE' ? 'gold' : 'blue'} style={{ fontSize: 9 }}>{item.type}</Tag></Space>}
                                                description={<Text italic style={{ fontSize: 11 }}>"{item.msg}"</Text>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Space>
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 12 }}>
                                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                                    <GlobalOutlined style={{ fontSize: 28, color: '#3b82f6', marginBottom: 12 }} />
                                    <br /><Text strong>Marketplace Command Hub</Text>
                                    <br /><Text type="secondary" style={{ fontSize: 12 }}>Target a zone on the map for AI Intelligence</Text>
                                </div>
                            </Card>

                            <Card 
                                title={<Space><CalendarOutlined style={{ color: '#3b82f6' }} /> <Text strong style={{ fontSize: 14 }}>Scheduled Operations</Text></Space>}
                                bordered={false}
                                className="shadow-sm"
                                style={{ borderRadius: 12, flexGrow: 1 }}
                                bodyStyle={{ padding: '12px' }}
                            >
                                <Timeline 
                                    mode="left"
                                    items={events.map(event => ({
                                        color: event.type === 'Holiday' ? '#ef4444' : '#eab308',
                                        children: (
                                            <div style={{ paddingBottom: 8 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text strong style={{ fontSize: 13 }}>{event.name}</Text>
                                                    <Tag color={event.type === 'Holiday' ? 'error' : 'warning'} style={{ fontSize: 10 }}>{event.impact}</Tag>
                                                </div>
                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    {event.isGlobal ? 'Global' : 'Regional'} â€¢ {event.type}
                                                </Text>
                                            </div>
                                        )
                                    }))}
                                />
                                {events.length === 0 && <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '20px 0' }}>No scheduled events.</Text>}
                            </Card>

                            <Card 
                                title={<Space><NotificationOutlined style={{ color: '#10b981' }} /> <Text strong style={{ fontSize: 14 }}>Command Log</Text></Space>}
                                bordered={false}
                                className="shadow-sm"
                                style={{ borderRadius: 12 }}
                                bodyStyle={{ padding: '12px' }}
                                extra={<Button size="small" type="text" onClick={() => setCommandLog([])}>Clear</Button>}
                            >
                                <List
                                    dataSource={commandLog.slice(0, 3)}
                                    size="small"
                                    renderItem={item => (
                                        <List.Item style={{ padding: '8px 0' }}>
                                            <List.Item.Meta
                                                title={<Text strong style={{ fontSize: 11 }}>{item.time} - {item.type}</Text>}
                                                description={<Text italic style={{ fontSize: 11 }}>"{item.msg}"</Text>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    )}
                </Col>
            </Row>
            {/* Zone Market Explorer */}
            <Drawer
                title={<Space><HistoryOutlined /> Trip Heat Map Analytics</Space>}
                placement="left"
                onClose={() => setIsZoneListVisible(false)}
                open={isZoneListVisible}
                width={420}
                bodyStyle={{ padding: '0px' }}
            >
                <Tabs
                    defaultActiveKey="1"
                    centered
                    style={{ height: '100%' }}
                    items={[
                        {
                            key: '1',
                            label: 'Overview',
                            children: (
                                <div style={{ padding: '20px' }}>
                                    <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                                        <Text type="secondary">Real-time marketplace insights for {selectedCity}.</Text>
                                        <div style={{ padding: '4px 0 16px 0' }}>
                                            <Input.Search
                                                placeholder="Search zones by name..."
                                                allowClear
                                                enterButton="Search"
                                                size="large"
                                                onSearch={setSearchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                value={searchQuery}
                                                className="premium-search"
                                            />
                                        </div>
                                    </Space>
                                    <Divider style={{ margin: '8px 0 16px 0' }} />
                                    <List
                                        dataSource={zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                                        renderItem={item => (
                                            <List.Item
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedZone(item);
                                                    setIsZoneListVisible(false);
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '16px',
                                                    borderRadius: 12,
                                                    marginBottom: 12,
                                                    border: selectedZone?.id === item.id ? '2px solid #3b82f6' : '1px solid #f0f0f0',
                                                    background: selectedZone?.id === item.id ? '#eff6ff' : 'white'
                                                }}
                                            >
                                                <div style={{ width: '100%' }}>
                                                    <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                                                        <Col>
                                                            <Space>
                                                                {service !== 'ALL' && SERVICE_TYPES.find(s => s.id === service)?.icon}
                                                                <Text strong style={{ fontSize: 16 }}>{item.name}</Text>
                                                            </Space>
                                                        </Col>
                                                        <Col><Tag color={getZoneColor(item.demand)}>{item.demand.toUpperCase()}</Tag></Col>
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <Col span={8}><Statistic title="Drivers" value={item.drivers} valueStyle={{ fontSize: 14 }} /></Col>
                                                        <Col span={8}><Statistic title={SERVICE_TYPES.find(s => s.id === service)?.kpiName || 'Orders'} value={item.orders} valueStyle={{ fontSize: 14 }} /></Col>
                                                        <Col span={8}><Statistic title="Surge" value={item.surge} suffix="x" valueStyle={{ fontSize: 14, color: '#eab308' }} /></Col>
                                                    </Row>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        },
                        {
                            key: '3',
                            label: 'Filter',
                            children: (
                                <div style={{ padding: '20px' }}>
                                    <Title level={5}>Global Analytics Scope</Title>
                                    <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Select Service</Text>
                                            <Select value={service} style={{ width: '100%' }} onChange={setService}>
                                                <Option value="ALL">All Services Overview</Option>
                                                {SERVICE_TYPES.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                                            </Select>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Select Zone</Text>
                                            <Select defaultValue="all" style={{ width: '100%' }}>
                                                <Option value="all">Global (All Markets)</Option>
                                                {zones.map(z => <Option key={z.id} value={z.id}>{z.name}</Option>)}
                                            </Select>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Select Time Frame</Text>
                                            <Select defaultValue="all" style={{ width: '100%' }}>
                                                <Option value="all">All Time</Option>
                                                <Option value="2024">Current Year (2024)</Option>
                                                <Option value="2023">Last Year (2023)</Option>
                                            </Select>
                                        </div>
                                        <Button block type="primary" style={{ marginTop: 24 }}>Apply Deep Scan</Button>
                                    </Space>
                                </div>
                            )
                        },
                        {
                            key: '4',
                            label: 'List',
                            children: (
                                <div style={{ padding: '20px' }}>
                                    <Text type="secondary">Consolidated Trip Records</Text>
                                    <List
                                        style={{ marginTop: 16 }}
                                        dataSource={[
                                            { id: 'T-9921', service: SERVICE_TYPES.find(s => s.id === service)?.name || 'Ride', date: '2024-03-08', status: 'Completed' },
                                            { id: 'T-9922', service: SERVICE_TYPES.find(s => s.id === service)?.name || 'Parcel', date: '2024-03-08', status: 'Completed' },
                                            { id: 'T-9923', service: SERVICE_TYPES.find(s => s.id === service)?.name || 'Ride', date: '2024-03-07', status: 'Completed' },
                                        ]}
                                        renderItem={item => (
                                            <List.Item>
                                                <Space size="middle">
                                                    <Avatar icon={SERVICE_TYPES.find(s => s.id === service)?.icon || <CarOutlined />} />
                                                    <div>
                                                        <Text strong>{item.id}</Text><br />
                                                        <Text type="secondary" style={{ fontSize: 11 }}>{item.date} â€¢ {item.service}</Text>
                                                    </div>
                                                </Space>
                                                <Tag color="success">Paid</Tag>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        }
                    ]}
                />
            </Drawer>

                                                setSelectedUser(point);
                                                setIsProfileDrawerVisible(true);

            {/* Demand Calendar & Event Management Drawer */}
            <Drawer
                title={
                    <Space>
                        <CalendarOutlined style={{ color: '#1e293b' }} />
                        <span>Market Operations: Demand Calendar</span>
                    </Space>
                }
                placement="right"
                width={500}
                onClose={() => setIsCalendarVisible(false)}
                open={isCalendarVisible}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Click a date on the calendar to schedule at that time')}>
                        Quick Schedule
                    </Button>
                }
            >
            <Tabs defaultActiveKey="events" className="premium-tabs">
                <Tabs.TabPane tab="One-off Events" key="events">
                    <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                        <Calendar
                        fullscreen={false}
                        onSelect={(date) => message.info(`Managing demand for ${date.format('YYYY-MM-DD')}`)}
                    />
                </div>

                <Divider orientation={"left" as any} style={{ margin: '12px 0' }}>Schedule Marketplace Event</Divider>

                <Form layout="vertical" onFinish={(values) => {
                    const isGlobal = values.zoneId === 'GLOBAL';
                    const zone = !isGlobal ? MOCK_ZONES.find(z => z.id === values.zoneId) : null;
                    const newEvent = {
                        id: `ev-${Date.now()}`,
                        name: values.name,
                        type: values.type,
                        impact: `+${values.impact}%`,
                        isGlobal: isGlobal,
                        lat: isGlobal ? 0 : (zone?.lat || -17.8248),
                        lng: isGlobal ? 0 : (zone?.lng || 31.0530),
                        attendees: values.attendees || 'TBD'
                    };
                    setEvents([...events, newEvent]);
                    message.success(`'${values.name}' scheduled ${isGlobal ? 'Country-wide' : `at ${zone?.name || 'Primary Hub'}`}`);
                    setIsCalendarVisible(false);
                }}>
                    <Form.Item name="name" label="Event Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Zim Afro Jazz Festival" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Category" initialValue="Concert">
                                <Select>
                                    <Option value="Concert">Concert/Gig</Option>
                                    <Option value="Sports">Sports Match</Option>
                                    <Option value="Holiday">National Holiday</Option>
                                    <Option value="Rally">Civic Gathering</Option>
                                    <Option value="Fest">Food/Cultural Fest</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="zoneId" label="Primary Zone" rules={[{ required: true }]} initialValue="GLOBAL">
                                <Select placeholder="Select Impact Zone">
                                    <Option value="GLOBAL">All Zones (Country-wide)</Option>
                                    {MOCK_ZONES.map(z => (
                                        <Option key={z.id} value={z.id}>{z.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="impact" label="Marketplace Impact (Demand Lift %)" initialValue={25}>
                        <Slider
                            marks={{ 0: '0%', 50: '50%', 100: '100%+' }}
                            tooltip={{ formatter: (val) => `+${val}% Demand` }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="time" label="Event Window">
                                <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="attendees" label="Expected Growth">
                                <Input placeholder="e.g. 15.5k" prefix={<TeamOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 12 }}>
                        <Button type="primary" block size="large" htmlType="submit" icon={<ThunderboltOutlined />}>
                            Schedule & Inject Intelligence
                        </Button>
                    </Form.Item>
                </Form>

                <Divider orientation={"left" as any}>Scheduled Events</Divider>
                <List
                    dataSource={events}
                    renderItem={event => (
                        <List.Item
                            actions={[<Button type="link" danger size="small" onClick={() => setEvents(events.filter(e => e.id !== event.id))}>Cancel</Button>]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<StarFilled />} style={{ background: '#fef3c7', color: '#eab308' }} />}
                                title={event.name}
                                description={
                                    <Space orientation="vertical" size={0}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>{event.type} â€¢ {event.impact} Demand Lift</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Sector: {event.isGlobal ? <Tag color="blue">Global Impact</Tag> : (MOCK_ZONES.find(z => Math.abs(z.lat - event.lat) < 0.01)?.name || 'Central Hub')}</Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
                </Tabs.TabPane>
                
                <Tabs.TabPane tab="Recurring Peak Hours" key="peaks">
                    <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12, marginBottom: 24, border: '1px solid #bbf7d0' }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space>
                                    <Avatar icon={<ThunderboltOutlined />} style={{ background: '#22c55e' }} />
                                    <div>
                                        <Text strong style={{ display: 'block', color: '#166534' }}>AI Auto-Broadcast Intelligence</Text>
                                        <Text type="secondary" style={{ fontSize: 12, color: '#15803d' }}>Automatically notify drivers 15m before peak starts</Text>
                                    </div>
                                </Space>
                            </Col>
                            <Col>
                                <Switch 
                                    checked={isAutoBroadcastEnabled} 
                                    onChange={(checked) => {
                                        setIsAutoBroadcastEnabled(checked);
                                        if (checked) message.success('AI Auto-Broadcast Intelligence Enabled');
                                        else message.warning('AI Auto-Broadcast Disabled');
                                    }} 
                                    style={{ background: isAutoBroadcastEnabled ? '#22c55e' : undefined }}
                                />
                            </Col>
                        </Row>
                    </div>

                    <Divider orientation={"left" as any}>Weekly Configuration</Divider>
                    
                    <Form layout="vertical" style={{ marginBottom: 24 }} onFinish={(values) => {
                        const newId = Date.now();
                        setPeakHours([...peakHours, { 
                            id: newId, 
                            day: values.day, 
                            zone: values.zoneId,
                            startTime: values.time[0].format('HH:mm'), 
                            endTime: values.time[1].format('HH:mm'), 
                            multiplier: `${values.multiplier}x` 
                        }]);
                        message.success(`Peak hour configured for ${values.day}`);
                    }}>
                        <Row gutter={12} align="bottom">
                            <Col span={7}>
                                <Form.Item name="day" label="Day" initialValue="Monday" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                    <Select>
                                        <Option value="Monday">Monday</Option>
                                        <Option value="Tuesday">Tuesday</Option>
                                        <Option value="Wednesday">Wednesday</Option>
                                        <Option value="Thursday">Thursday</Option>
                                        <Option value="Friday">Friday</Option>
                                        <Option value="Saturday">Saturday</Option>
                                        <Option value="Sunday">Sunday</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item name="zoneId" label="Target Zone" rules={[{ required: true }]} initialValue="GLOBAL" style={{ marginBottom: 0 }}>
                                    <Select placeholder="Select Target Zone">
                                        <Option value="GLOBAL">All Zones (Country-wide)</Option>
                                        {MOCK_ZONES.map(z => (
                                            <Option key={z.id} value={z.id}>{z.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item name="multiplier" label="Surge Value" initialValue={1.5} style={{ marginBottom: 0 }}>
                                    <InputNumber min={1} max={3} step={0.1} prefix="x" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={12} style={{ marginTop: 12 }}>
                            <Col span={17}>
                                <Form.Item name="time" label="Time Window" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                    <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={7} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Form.Item style={{ marginBottom: 0, width: '100%' }}>
                                    <Button type="dashed" block htmlType="submit" icon={<PlusOutlined />}>Add Slot</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                    <Table 
                        dataSource={peakHours} 
                        rowKey="id"
                        size="small"
                        pagination={false}
                        scroll={{ y: 'calc(100vh - 550px)', x: 'max-content' }}
                        columns={[
                            { title: 'Day', dataIndex: 'day', key: 'day', render: (t) => <Text strong>{t}</Text> },
                            { title: 'Zone', dataIndex: 'zone', key: 'zone', render: (t) => t === 'GLOBAL' ? <Tag color="blue">Global</Tag> : <Text type="secondary" style={{ fontSize: 11 }}>{MOCK_ZONES.find(z => z.id === t)?.name || t}</Text> },
                            { title: 'Window', key: 'window', render: (_, record) => <Tag icon={<FieldTimeOutlined />}>{record.startTime} - {record.endTime}</Tag> },
                            { title: 'Surge', dataIndex: 'multiplier', key: 'multiplier', render: (t) => <Tag color="green">{t}</Tag> },
                            { title: 'Action', key: 'action', render: (_, record) => (
                                <Button type="text" danger size="small" onClick={() => setPeakHours(peakHours.filter(p => p.id !== record.id))}>Remove</Button>
                            ) }
                        ]}
                    />
                </Tabs.TabPane>
            </Tabs>
            </Drawer>
            <style>{`
                .pulse-marker {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
        </div>
    );
};

