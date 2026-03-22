import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Space, Statistic, Tabs, 
  Table, Tag, Button, Badge, Divider, Avatar,
  Progress, Segmented, Select, Input, DatePicker,
  Empty, Alert, Tooltip, Dropdown, MenuProps, List,
  Form, Drawer, Switch, InputNumber, Descriptions, Modal, notification,
  App, Flex, Skeleton
} from 'antd';
import { 
  RocketOutlined, EnvironmentOutlined, ThunderboltOutlined, 
  RadarChartOutlined, BellOutlined, HistoryOutlined, 
  LineChartOutlined, DashboardOutlined, GlobalOutlined,
  DownOutlined, MoreOutlined, SyncOutlined, FilterOutlined,
  CarOutlined, UserOutlined, ShopOutlined, ClockCircleOutlined,
  WarningOutlined, CheckCircleOutlined, CloseCircleOutlined,
  PlayCircleOutlined, PauseCircleOutlined, PlusOutlined,
  DeleteOutlined, EditOutlined, PhoneOutlined, SearchOutlined,
  CloudDownloadOutlined, RestOutlined, DeleteFilled, RollbackOutlined,
  InfoCircleOutlined, CompassOutlined, BorderOutlined, ApartmentOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { GoogleMap, MarkerF, InfoWindowF, CircleF, PolygonF, PolylineF, OverlayViewF, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, LineChart, Line,
  Legend
} from 'recharts';
import { adminApi } from '../api/adminApi';
import { analyticsApi } from '../api/analyticsApi';
import { RoutePreview } from '../components/RoutePreview';
import carMarker from '../assets/car-marker-topview.png';
import carMarkerHandicap from '../assets/car-marker-WAV.png';
import { useMarkerClusterer, ClusterableMarker } from '../hooks/useMarkerClusterer';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// --- Interfaces ---

interface Zone {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  type: 'Polygon' | 'Circle' | 'Triangle';
  points: {lat: number, lng: number}[];
  radius?: number;
  volume: string;
  extraFare: boolean;
  farePercent?: number;
}

interface ZoneLog {
  id: string;
  zoneId: string;
  zoneName: string;
  action: 'Created' | 'Updated' | 'Status Toggled' | 'Deleted' | 'Broadcast';
  details: string;
  timestamp: string;
  user: string;
}

interface Broadcast {
  id: string;
  title: string;
  content: string;
  target: 'All' | 'Drivers' | 'Customers' | 'Zone';
  targetDetail?: string;
  priority: 'Emergency' | 'High' | 'Normal';
  status: 'Sent' | 'Scheduled' | 'Failed';
  timestamp: string;
  sender: string;
  reason: string;
}

// --- Mock Data & Constants ---

const MOCK_TRIPS = [
    {
        id: 'ORD-2201',
        service: 'Food Delivery',
        status: 'Delivering',
        merchant: { name: 'Pizza Hub CBD', lat: -17.8200, lng: 31.0500 },
        customer: { name: 'John Makoni', phone: '+263 77 123 4567', avatar: 'https://i.pravatar.cc/150?u=1' },
        driver: { id: 'D-201', name: 'Alex T.', phone: '+263 71 987 6543', vehicle: 'Motorcycle', plate: 'AB-123', lat: -17.8220, lng: 31.0520 },
        dropoff: { address: '14 Samora Machel Ave', lat: -17.8300, lng: 31.0600 },
        route: [{lat: -17.8200, lng: 31.0500}, {lat: -17.8210, lng: 31.0510}, {lat: -17.8220, lng: 31.0520}, {lat: -17.8300, lng: 31.0600}],
        timeline: [
            { time: '12:00', event: 'Order created', status: 'success' },
            { time: '12:12', event: 'Picked up at Pizza Hub', status: 'success' },
            { time: '12:15', event: 'In transit (Traffic delay)', status: 'processing', alert: true }
        ],
        alerts: ['Driver stationary for 3 minutes'],
        distance: '4.2 km',
        eta: '12 min',
        elapsed: '16 min'
    },
    {
        id: 'RID-1055',
        service: 'Ride Hailing',
        status: 'In Transit',
        merchant: null,
        customer: { name: 'Sarah Chipo', phone: '+263 73 555 4444', avatar: 'https://i.pravatar.cc/150?u=2' },
        driver: { id: 'D-405', name: 'Mike N.', phone: '+263 77 111 2222', vehicle: 'Toyota Belta', plate: 'AEE-9901', lat: -17.8050, lng: 31.0400 },
        pickup: { address: 'Avondale Shopping Center', lat: -17.8000, lng: 31.0333 },
        dropoff: { address: 'Borrowdale Village', lat: -17.7500, lng: 31.1000 },
        route: [{lat: -17.8000, lng: 31.0333}, {lat: -17.8050, lng: 31.0400}, {lat: -17.7500, lng: 31.1000}],
        timeline: [
            { time: '14:20', event: 'Ride requested', status: 'success' },
            { time: '14:30', event: 'Ride started', status: 'success' },
            { time: '14:35', event: 'In transit to Borrowdale', status: 'processing' }
        ],
        alerts: [],
        distance: '8.5 km',
        eta: '18 min',
        elapsed: '5 min'
    }
];

const INITIAL_ZONES: Zone[] = [
  { id: '1', name: 'Harare CBD', type: 'Polygon', volume: 'High', extraFare: true, status: 'Active', points: [{lat: -17.8216, lng: 31.0404}, {lat: -17.8256, lng: 31.0504}, {lat: -17.8156, lng: 31.0554}, {lat: -17.8106, lng: 31.0454}], farePercent: 20 },
  { id: '2', name: 'Avondale', type: 'Polygon', volume: 'Medium', extraFare: false, status: 'Active', points: [{lat: -17.8025, lng: 31.0378}, {lat: -17.8085, lng: 31.0478}, {lat: -17.7985, lng: 31.0528}, {lat: -17.7925, lng: 31.0428}] },
];

const INITIAL_LOGS: ZoneLog[] = [
  { id: 'L-1', zoneId: '1', zoneName: 'Harare CBD', action: 'Created', details: 'Initial system setup', timestamp: '2024-03-10 09:00', user: 'Admin' },
  { id: 'L-2', zoneId: '2', zoneName: 'Avondale', action: 'Status Toggled', details: 'Zone activated for weekend surge', timestamp: '2024-03-12 14:30', user: 'Ops_Lead' },
];

const KpiData = [
  { title: 'Active Trips', value: 1245, suffix: '', priority: 'success', icon: <RocketOutlined />, description: 'Active transport orders currently in progress.' },
  { title: 'Active Deliveries', value: 890, suffix: '', priority: 'processing', icon: <ShopOutlined />, description: 'Combined food and grocery orders currently being delivered.' },
  { title: 'Waiting for Driver', value: 45, suffix: 'orders', priority: 'warning', icon: <ClockCircleOutlined />, description: 'Orders in the queue awaiting driver matching.' },
  { title: 'Available Drivers', value: 620, suffix: '', priority: 'success', icon: <CarOutlined />, description: 'Verified drivers online and available for matching.' },
];

const secondaryKpiData = [
  { title: 'Avg Pickup Time', value: 4.2, suffix: 'min', trend: 'down', trendValue: '0.5' },
  { title: 'Cancellation Rate', value: 2.1, suffix: '%', trend: 'up', trendValue: '0.2' },
  { title: 'Delayed Orders', value: 12, suffix: '', trend: 'down', trendValue: '4' },
];

const MOCK_BROADCASTS: Broadcast[] = [
  { id: 'BC-001', title: 'Severe Weather Warning', content: 'Heavy rain expected in CBD South. Reduced speed limits in effect.', target: 'All', priority: 'High', status: 'Sent', timestamp: '2024-03-18 14:00', sender: 'Operations Lead', reason: 'Safety precaution for forecast storm' },
  { id: 'BC-002', title: 'System Maintenance', content: 'In-app wallet services will be briefly unavailable between 02:00 and 02:30 AM.', target: 'Customers', priority: 'Normal', status: 'Sent', timestamp: '2024-03-17 22:00', sender: 'DevOps Team', reason: 'Scheduled database optimization' }
];

const BaseMapContext = React.createContext<{ map: google.maps.Map | null }>({ map: null });
const useBaseMap = () => React.useContext(BaseMapContext);

const BaseMap: React.FC<{ 
    children?: React.ReactNode, 
    center: {lat: number, lng: number} | [number, number], 
    zoom: number, 
    height?: string | number,
    isLoaded?: boolean
}> = ({ children, center, zoom, height = 400, isLoaded = false }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapCenter = Array.isArray(center) ? { lat: center[0], lng: center[1] } : center;

    if (!isLoaded) return <Skeleton active style={{ height: typeof height === 'number' ? height : 400 }} />;

    return (
        <BaseMapContext.Provider value={{ map }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, minHeight: '100px' }}
                center={mapCenter}
                zoom={zoom}
                onLoad={setMap}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapId: 'DEMO_MAP_ID',
                }}
            >
                {children}
            </GoogleMap>
        </BaseMapContext.Provider>
    );
};

const MapEvents = ({ onMapClick }: { onMapClick: (latlng: {lat: number, lng: number}) => void }) => {
  const { map } = useBaseMap();
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onMapClick]);
  return null;
};

const MapFitter = ({ bounds }: { bounds: {lat: number, lng: number}[] | null }) => {
    const { map } = useBaseMap();
    useEffect(() => {
        if (map && bounds && bounds.length > 0) {
            const gBounds = new google.maps.LatLngBounds();
            bounds.forEach(p => gBounds.extend(p));
            map.fitBounds(gBounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
    }, [bounds, map]);
    return null;
};


const DriverMarker = ({ position, isHandicap, heading = 0 }: { position: google.maps.LatLngLiteral, isHandicap?: boolean, heading?: number }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '100px', height: '100px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Halo Effect */}
            <div style={{ 
                position: 'absolute', 
                width: '60px', 
                height: '60px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                borderRadius: '50%', 
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }} className="animate-pulse" />
            
            <img 
                src={isHandicap ? carMarkerHandicap : carMarker} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.4))',
                    transform: `rotate(${heading}deg)`,
                    transition: 'transform 0.5s ease-out'
                }} 
                alt="car" 
            />
        </div>
    </OverlayViewF>
);

const CustomerMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '20px', height: '20px', background: '#fff', border: '2px solid #3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
    </OverlayViewF>
);

const PickupMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: '#0f172a', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
    </OverlayViewF>
);

const DropoffMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: '#ef4444', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
    </OverlayViewF>
);

// --- Clustered Driver Markers ---

const ClusteredDriverMarkers: React.FC<{ drivers: any[], enabled: boolean }> = ({ drivers, enabled }) => {
    const { map } = useBaseMap();
    
    const clusterableDrivers: ClusterableMarker[] = React.useMemo(() => {
        if (drivers.length > 0) {
            return drivers.map((driver: any) => ({
                id: driver.id || `d-${Math.random()}`,
                lat: Number(driver.lat) || -17.8248,
                lng: Number(driver.lng) || 31.0530,
                heading: driver.heading || 0,
                isHandicap: driver.isHandicap || false,
            }));
        }
        // Fallback demo markers
        return [
            { id: 'demo-1', lat: -17.824858, lng: 31.053028, heading: 45 },
            { id: 'demo-2', lat: -17.8100, lng: 31.0400, heading: 120 },
            { id: 'demo-3', lat: -17.8180, lng: 31.0480, heading: 200 },
            { id: 'demo-4', lat: -17.8050, lng: 31.0550, heading: 90 },
            { id: 'demo-5', lat: -17.8300, lng: 31.0420, heading: 310 },
            { id: 'demo-6', lat: -17.8150, lng: 31.0350, heading: 60 },
            { id: 'demo-7', lat: -17.8220, lng: 31.0580, heading: 150 },
            { id: 'demo-8', lat: -17.8280, lng: 31.0380, heading: 270 },
        ];
    }, [drivers]);

    useMarkerClusterer(map, clusterableDrivers, carMarker, carMarkerHandicap, enabled);

    return null; // Markers are managed imperatively by the hook
};

// --- Shared Components ---

const CustomTimeline = ({items}: {items: any[]}) => (
  <div style={{ padding: '8px 0' }}>
      {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: it.color === 'green' ? '#10b981' : it.color === 'blue' ? '#3b82f6' : '#94a3b8', marginTop: 4, flexShrink: 0 }} />
              <div>
                <Text style={{ display: 'block', fontWeight: 500 }}>{it.children}</Text>
              </div>
          </div>
      ))}
  </div>
);

// --- Sub-components (Tabs) ---

const OperationsDashboard: React.FC<{ 
    onViewAll: () => void, 
    filter: string, 
    onFilterChange: (val: string) => void,
    alerts: any[],
    onFix: (id: string) => void,
    isManualDispatch: boolean,
    onToggleDispatch: () => void,
    onNewBroadcast: () => void,
    drivers: any[],
    stats: any,
    onRefresh: () => void,
    refreshing: boolean,
    isLoaded: boolean
}> = ({ onViewAll, filter, onFilterChange, alerts, onFix, isManualDispatch, onToggleDispatch, onNewBroadcast, drivers, stats, onRefresh, refreshing, isLoaded }) => {
    const { message } = App.useApp();
    const [isPulseActive, setIsPulseActive] = useState(false);

    const handleLiveSync = () => {
        setIsPulseActive(true);
        onRefresh();
        message.loading({ content: 'Synchronizing with platform mobility stream...', key: 'map-sync' });
        setTimeout(() => {
            setIsPulseActive(false);
            message.success({ content: 'Network data synchronized.', key: 'map-sync' });
        }, 1200);
    };

    const dynamicKpis = [
      { ...KpiData[0], value: stats?.activeTrips || KpiData[0].value },
      { ...KpiData[1], value: stats?.activeDeliveries || KpiData[1].value },
      { ...KpiData[2], value: stats?.pendingOrders || KpiData[2].value },
      { ...KpiData[3], value: drivers?.length || KpiData[3].value },
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={16}>
              {dynamicKpis.map((kpi, idx) => (
                <Col key={idx} xs={24} sm={12} lg={6}>
                  <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                    <Statistic 
                      title={
                        <Space>
                            <span style={{ color: '#64748b' }}>{kpi.icon}</span> 
                            {kpi.title}
                            <Tooltip title={kpi.description}><InfoCircleOutlined style={{ fontSize: 11, cursor: 'help' }} /></Tooltip>
                        </Space>
                      }
                      value={kpi.value}
                      styles={{ content: { color: kpi.priority === 'warning' ? '#f59e0b' : '#0f172a', fontWeight: 700 } }}
                      suffix={<span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8', marginLeft: 4 }}>{kpi.suffix}</span>}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Map Overview Section */}
          <Col xs={24} lg={16}>
            <Card 
              variant="borderless" 
              className="shadow-sm"
              title={<Space><GlobalOutlined /> Real-time Platform Mobility Map</Space>}
              extra={
                <Space>
                   <Button icon={<PlusOutlined />} size="small" type="primary" ghost onClick={onNewBroadcast}>Quick Broadcast</Button>
                   <Button icon={<SyncOutlined spin={isPulseActive || refreshing} />} size="small" onClick={handleLiveSync}>Pulse</Button>
                   <Button icon={<HistoryOutlined />} size="small" onClick={() => message.info('Opening mobility audit logs...')}>Logs</Button>
                   <Segmented 
                     options={['All', 'Rides', 'Deliveries', 'Customers']} 
                     size="small" 
                     value={filter}
                     onChange={(val) => onFilterChange(val as string)}
                   />
                </Space>
              }
              styles={{ body: { padding: 0, height: 450, position: 'relative' } }}
              style={{ borderRadius: 16, overflow: 'hidden' }}
            >
               <BaseMap center={[-17.824858, 31.053028]} zoom={13} height="100%" isLoaded={isLoaded}>
                  {(filter === 'All' || filter === 'Rides' || filter === 'Deliveries') && (
                    <ClusteredDriverMarkers drivers={drivers} enabled={true} />
                  )}
                  
                  {(filter === 'All' || filter === 'Customers') && (
                    <>
                        <CustomerMarker position={{lat: -17.8200, lng: 31.0600}} />
                        <CustomerMarker position={{lat: -17.8150, lng: 31.0450}} />
                    </>
                  )}

                  <CircleF center={{lat: -17.824858, lng: 31.053028}} radius={500} options={{ strokeColor: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, strokeWeight: 1 }} />
               </BaseMap>
               
               {/* Map Overlays */}
               <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
                  <Card size="small" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                     <Space orientation="vertical" size="small">
                        <Badge status="success" text={`Available (${drivers.length || 620})`} />
                        <Badge status="processing" text={`On Trip (${stats?.activeTrips || 1245})`} />
                        {filter === 'Customers' && <Badge color="blue" text="Active Customers (2,450)" />}
                        <Badge status="error" text="Incidents (5)" />
                     </Space>
                  </Card>
               </div>
            </Card>
          </Col>

          {/* Sidebar: Performance & Alerts */}
          <Col xs={24} lg={8}>
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              <Card 
                title={<Space><LineChartOutlined /> Operational Health</Space>} 
                variant="borderless" 
                className="shadow-sm"
                size="small"
              >
                <Flex vertical gap={12}>
                  {secondaryKpiData.map((item, idx) => (
                    <div key={idx} style={{ padding: '4px 0' }}>
                      <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                        <Text strong style={{ fontSize: 14 }}>{item.value}{item.suffix}</Text>
                      </div>
                      <Progress 
                        percent={item.trend === 'down' ? 85 : 15} 
                        showInfo={false} 
                        size="small" 
                        strokeColor={item.trend === 'down' ? '#10b981' : '#ef4444'} 
                      />
                    </div>
                  ))}
                </Flex>
              </Card>

              <Card 
                title={<Space><BellOutlined /> Critical Alerts</Space>} 
                extra={<Button type="link" size="small" onClick={onViewAll}>View All</Button>}
                variant="borderless" 
                className="shadow-sm"
                size="small"
              >
                  <Flex vertical gap={12}>
                    {alerts.map((item, idx) => (
                      <Alert
                        key={idx}
                        title={<Space><Text strong style={{ fontSize: 12 }}>{item.type}</Text> <Tag color={item.severity === 'High' ? 'error' : 'warning'} style={{ fontSize: 10 }}>{item.severity}</Tag></Space>}
                        description={<div style={{ fontSize: 11 }}>{item.info || item.detail} <br/> <Text type="secondary">{item.time}</Text></div>}
                        type={item.severity === 'High' ? 'error' : 'warning'}
                        showIcon
                        style={{ width: '100%' }}
                        action={<Button size="small" type="link" onClick={() => onFix(item.id)}>Fix</Button>}
                      />
                    ))}
                  </Flex>
              </Card>

              <Card variant="borderless" className="shadow-sm" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                 <div style={{ padding: '4px 0' }}>
                    <Title level={5} style={{ color: '#fff', margin: 0 }}>Command Center</Title>
                    <Paragraph style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                        Real-time synchronization active. Dispatch engine performing at 98% efficiency.
                    </Paragraph>
                     <Button 
                        block 
                        icon={isManualDispatch ? <ThunderboltOutlined /> : <PauseCircleOutlined />} 
                        onClick={onToggleDispatch}
                        style={{ background: isManualDispatch ? '#ef4444' : '#00b894', border: 'none', color: '#fff' }}
                      >
                        {isManualDispatch ? 'Deactivate Manual Override' : 'Manual Dispatch Override'}
                    </Button>
                 </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    );
};

const RenderZoneSetup: React.FC<{ onLocate: (points: {lat: number, lng: number}[]) => void, mapBounds: any, isLoaded: boolean }> = ({ onLocate, mapBounds, isLoaded }) => {
    const { message, notification } = App.useApp();
    const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
    const [trashedZones, setTrashedZones] = useState<Zone[]>([]);
    const [logs, setLogs] = useState<ZoneLog[]>(INITIAL_LOGS);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState<{lat: number, lng: number}[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Zone | null>(null);
    const [form] = Form.useForm();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [drawingMode, setDrawingMode] = useState<'Polygon' | 'Circle' | 'Triangle'>('Polygon');

    const addLog = (zone: Zone | { name: string, id: string }, action: ZoneLog['action'], details: string) => {
        const newLog: ZoneLog = {
            id: `L-${Date.now()}`,
            zoneId: zone.id,
            zoneName: zone.name,
            action,
            details,
            timestamp: new Date().toLocaleString(),
            user: 'Admin User'
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const toggleZoneStatus = (id: string) => {
        setZones(prev => prev.map(z => {
            if (z.id === id) {
                const newStatus = z.status === 'Active' ? 'Inactive' : 'Active';
                addLog(z, 'Status Toggled', `Status changed to ${newStatus}`);
                return { ...z, status: newStatus as any };
            }
            return z;
        }));
    };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteZone, setSelectedDeleteZone] = useState<Zone | null>(null);
    const [deleteForm] = Form.useForm();

    const handleDeleteZone = (values: any) => {
        if (!selectedDeleteZone) return;
        setZones(prev => prev.filter(z => z.id !== selectedDeleteZone.id));
        setTrashedZones(prev => [{ ...selectedDeleteZone, deleteReason: values.reason } as any, ...prev]);
        addLog(selectedDeleteZone, 'Deleted', `Zone moved to Trash. Reason: ${values.reason}`);
        notification.warning({
            message: 'Zone Trashed',
            description: `${selectedDeleteZone.name} has been moved to the recycle bin.`,
            placement: 'topRight'
        });
        setDeleteModalVisible(false);
        deleteForm.resetFields();
    };

    const handleRestoreZone = (zone: Zone) => {
        setTrashedZones(prev => prev.filter(z => z.id !== zone.id));
        setZones(prev => [zone, ...prev]);
        addLog(zone, 'Updated', 'Zone restored from Recycle Bin');
        message.success(`Zone ${zone.name} restored`);
    };

    const handlePermanentDelete = (zone: Zone) => {
        setTrashedZones(prev => prev.filter(z => z.id !== zone.id));
        addLog(zone, 'Deleted', 'Permanent removal from storage');
        message.warning(`Zone ${zone.name} permanently deleted`);
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Status", "Extra Fare", "Fare %"];
        const rows = zones.map(z => [z.id, z.name, z.status, z.extraFare, z.farePercent || 0]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dashdrive_zones_export.csv");
        document.body.appendChild(link);
        link.click();
        addLog({ name: 'System', id: '0' }, 'Updated', 'Zone data exported as CSV');
        message.success('Zones exported successfully');
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            message.success('Zone data synchronized with live server');
        }, 1200);
    };

    const columns = [
      { 
        title: 'Zone Identity', 
        dataIndex: 'name', 
        key: 'name', 
        ellipsis: true,
        render: (text: string, record: Zone) => (
            <div>
                <Text strong style={{ display: 'block' }}>{text}</Text>
                <Space size={4}>
                    <Text type="secondary" style={{ fontSize: 10 }}>ID: {record.id}</Text>
                    <Tooltip title="Copy ID">
                        <Button type="text" size="small" icon={<CopyOutlined style={{ fontSize: 10 }} />} onClick={() => { navigator.clipboard.writeText(record.id); message.success('ID Copied'); }} />
                    </Tooltip>
                </Space>
            </div>
        )
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 70,
        render: (type: string) => <Tag style={{ fontSize: 10, margin: 0 }}>{type?.charAt(0) || 'P'}</Tag>
      },
      { 
        title: 'Status', 
        dataIndex: 'status', 
        key: 'status', 
        width: 80,
        render: (status: string, record: Zone) => (
          <Space size={4}>
            <Switch 
                size="small" 
                checked={status === 'Active'} 
                onChange={() => toggleZoneStatus(record.id)} 
            />
            <Badge status={status === 'Active' ? 'success' : 'default'} />
          </Space>
        ) 
      },
      { 
        title: 'Extra Fare', 
        dataIndex: 'extraFare', 
        key: 'extraFare', 
        width: 90,
        render: (v: boolean, record: Zone) => v ? 
          <Tag color="gold" style={{ margin: 0, fontSize: 10 }}>{record.farePercent}%</Tag> : 
          <Tag style={{ margin: 0, fontSize: 10 }}>ST</Tag> 
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 70,
        align: 'right' as const,
        render: (_: any, record: Zone) => (
          <Space size={0}>
            <Tooltip title="Locate on Map">
              <Button type="text" size="small" icon={<CompassOutlined style={{ fontSize: 14, color: '#3b82f6' }} />} onClick={() => onLocate(record.points)} />
            </Tooltip>
            <Button type="text" size="small" icon={<EditOutlined style={{ fontSize: 14 }} />} onClick={() => {
              setEditingZone(record);
              form.setFieldsValue(record);
              setIsDrawerOpen(true);
            }} />
            <Dropdown
              menu={{
                items: [{ 
                    key: 'delete', 
                    label: 'Move to Trash', 
                    danger: true, 
                    onClick: () => { setSelectedDeleteZone(record); setDeleteModalVisible(true); } 
                }]
              }}
              trigger={['click']}
            >
              <Button type="text" size="small" icon={<DeleteOutlined style={{ fontSize: 14 }} />} danger />
            </Dropdown>
          </Space>
        ),
      },
    ];

    const handleMapClick = (latlng: {lat: number, lng: number}) => {
      if (drawingMode === 'Circle' && drawingPoints.length >= 2) return;
      if (drawingMode === 'Triangle' && drawingPoints.length >= 3) return;
      setDrawingPoints(prev => [...prev, latlng]);
    };

    const handleSaveZone = (values: any) => {
      if (editingZone) {
        setZones(prev => prev.map(z => z.id === editingZone.id ? { 
            ...z, 
            ...values,
            type: drawingPoints.length > 0 ? drawingMode : z.type,
            points: drawingPoints.length > 0 ? [...drawingPoints] : z.points,
            radius: (drawingPoints.length > 1 && drawingMode === 'Circle') ? 
                google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(drawingPoints[0]),
                    new google.maps.LatLng(drawingPoints[1])
                ) : 
                (drawingPoints.length > 0 ? undefined : z.radius)
        } : z));
        addLog(editingZone, 'Updated', `Configuration and geometry synchronized: ${values.name}`);
        message.success('Zone updated successfully');
      } else {
        const newZone: Zone = {
          id: Math.random().toString(36).substr(2, 9),
          name: values.name,
          status: 'Active',
          type: drawingMode,
          points: [...drawingPoints],
          radius: drawingMode === 'Circle' ? google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(drawingPoints[0]),
              new google.maps.LatLng(drawingPoints[1])
          ) : undefined,
          volume: 'Low',
          extraFare: values.extraFare,
          farePercent: values.farePercent
        };
        setZones(prev => [newZone, ...prev]);
        addLog(newZone, 'Created', `New ${drawingMode} geofence defined`);
        message.success('Zone created successfully');
      }
      setDrawingPoints([]);
      setIsDrawerOpen(false);
      setEditingZone(null);
      form.resetFields();
    };

    const displayedZones = zones.filter(z => {
        const matchesFilter = filterStatus === 'All' || z.status === filterStatus;
        const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={24}>
          <Col span={16}>
            <Card 
              styles={{ body: { padding: 0, height: 600, position: 'relative' } }} 
              variant="borderless"
              className="shadow-sm"
              style={{ borderRadius: 16, overflow: 'hidden' }}
              title={<Space><GlobalOutlined /> Zone Map Editor</Space>}
              extra={
                <Space>
                  <Segmented 
                    options={[
                      { label: 'Polygon', value: 'Polygon', icon: <BorderOutlined /> },
                      { label: 'Circle', value: 'Circle', icon: <ApartmentOutlined /> }, 
                      { label: 'Triangle', value: 'Triangle', icon: <GlobalOutlined /> }
                    ]}
                    value={drawingMode}
                    onChange={(val) => {
                      setDrawingMode(val as any);
                      setDrawingPoints([]);
                    }}
                    size="small"
                  />
                  <Button icon={<HistoryOutlined />} onClick={() => setIsLogDrawerOpen(true)}>History</Button>
                  <Button icon={<SyncOutlined spin={isRefreshing} />} onClick={handleRefresh}>Refresh</Button>
                  <Button icon={<CloudDownloadOutlined />} onClick={handleExportCSV}>Export</Button>
                  <Button danger icon={<RestOutlined />} onClick={() => setIsTrashModalOpen(true)}>Trash ({trashedZones.length})</Button>
                  <Button type="primary" size="small" icon={<ThunderboltOutlined />} onClick={() => setDrawingPoints([])}>Clear</Button>
                </Space>
              }
            >
              <BaseMap
                center={[-17.8248, 31.0530]}
                zoom={13}
                height="100%"
                isLoaded={isLoaded}
              >
                <MapEvents onMapClick={handleMapClick} />
                <MapFitter bounds={mapBounds} />
                
                 {zones.map(zone => (
                  zone.type === 'Circle' ? (
                    <CircleF
                      key={zone.id}
                      center={zone.points[0]}
                      radius={zone.radius || 500}
                      options={{ strokeColor: zone.status === 'Active' ? '#10b981' : '#94a3b8', fillOpacity: 0.2 }}
                    />
                  ) : (
                    <PolygonF 
                      key={zone.id} 
                      paths={zone.points} 
                      options={{ strokeColor: zone.status === 'Active' ? '#10b981' : '#94a3b8', fillOpacity: 0.2 }} 
                    />
                  )
                ))}

                {drawingPoints.length > 0 && (
                  drawingMode === 'Circle' ? (
                    drawingPoints.length > 1 ? (
                      <CircleF 
                        center={drawingPoints[0]} 
                        radius={google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(drawingPoints[0]),
                            new google.maps.LatLng(drawingPoints[1])
                        )} 
                        options={{ strokeColor: '#3b82f6', strokeOpacity: 0.8, fillOpacity: 0.1 }} 
                      />
                    ) : (
                      <MarkerF position={drawingPoints[0]} />
                    )
                  ) : (
                    <PolygonF 
                      paths={drawingPoints} 
                      options={{ strokeColor: '#3b82f6', strokeOpacity: 0.8, fillOpacity: 0.1 }} 
                    />
                  )
                )}
              </BaseMap>

              {(drawingMode === 'Polygon' ? drawingPoints.length >= 3 : 
                drawingMode === 'Circle' ? drawingPoints.length >= 2 : 
                drawingPoints.length === 3) && (
                <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                  <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={() => {
                    setEditingZone(null);
                    setIsDrawerOpen(true);
                  }} style={{ background: '#00b894', border: 'none', boxShadow: '0 4px 12px rgba(0,184,148,0.3)' }}>
                    Finalize {drawingMode}
                  </Button>
                </div>
              )}

              <div style={{ position: 'absolute', top: 70, left: 20, zIndex: 1000 }}>
                <Space orientation="vertical">
                  <Button icon={<RocketOutlined />} shape="circle" className="shadow-sm" />
                  <Button icon={<EnvironmentOutlined />} shape="circle" className="shadow-sm" />
                </Space>
              </div>
            </Card>
            
            <Card title={<Space><InfoCircleOutlined style={{ color: '#10b981' }} /> Drawing Modes</Space>} variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginTop: 16 }}>
              <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Badge status="processing" />
                  <Text style={{ fontSize: 13 }}><Text strong>Polygon:</Text> Click map to add points. Min 3 pts.</Text>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Badge status="success" />
                  <Text style={{ fontSize: 13 }}><Text strong>Circle:</Text> Click 1: Center, Click 2: Radius.</Text>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Badge color="gold" />
                  <Text style={{ fontSize: 13 }}><Text strong>Triangle:</Text> Place precisely 3 points.</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <InfoCircleOutlined /> Select a mode above and click "Clear" to start a new shape.
                </Text>
              </Space>
            </Card>
          </Col>

          <Col span={8}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }} styles={{ body: { padding: 0 } }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Title level={5} style={{ margin: 0 }}>Boundaries</Title>
                  <Badge count={displayedZones.length} style={{ backgroundColor: '#00b894' }} />
                </div>
                 <Space orientation="vertical" style={{ width: '100%' }} size="small">
                    <Input 
                        placeholder="Search zones..." 
                        prefix={<SearchOutlined />} 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        allowClear
                    />
                    <Segmented 
                        block 
                        options={['All', 'Active', 'Inactive']} 
                        value={filterStatus} 
                        onChange={(val) => setFilterStatus(val as string)} 
                        size="small"
                    />
                </Space>
              </div>
              <Table 
                columns={columns} 
                dataSource={displayedZones} 
                pagination={{ pageSize: 8 }} 
                rowKey="id"
                size="small"
                className="premium-table"
              />
            </Card>
          </Col>
        </Row>

        <Drawer
          title={<Space><GlobalOutlined style={{ color: '#00b894' }} /> {editingZone ? "Modify Boundary" : "Initialize New Boundary"}</Space>}
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingZone(null);
          }}
          width={400}
          extra={<Button type="primary" onClick={() => form.submit()} style={{ background: '#00b894', border: 'none' }}>Save Zone</Button>}
          destroyOnClose
          className="premium-drawer"
        >
          <Form form={form} layout="vertical" onFinish={handleSaveZone} initialValues={{ extraFare: false }}>
            <Form.Item label="Zone Display Name" name="name" rules={[{ required: true, message: 'Please enter zone name' }]}>
              <Input placeholder="Ex: Harare CBD Hub" prefix={<EnvironmentOutlined />} />
            </Form.Item>
            
            {editingZone && (
              <Form.Item label="Service Status" name="status">
                <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
              </Form.Item>
            )}

            <Card size="small" style={{ background: '#f8fafc', marginBottom: 20 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>Apply Dynamic Surge</Text><br/>
                    <Text type="secondary" style={{ fontSize: 12 }}>Enable automatic multipliers for this zone</Text>
                  </div>
                  <Form.Item name="extraFare" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
               </div>
               
               <Form.Item 
                 noStyle 
                 shouldUpdate={(prev, curr) => prev.extraFare !== curr.extraFare}
               >
                 {({ getFieldValue }) => getFieldValue('extraFare') && (
                   <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                     <Form.Item label="Surge Multiplier Percentage" name="farePercent">
                       <InputNumber 
                        min={0} 
                        max={200} 
                        addonAfter="%"
                        style={{ width: '100%' }} 
                       />
                     </Form.Item>
                   </div>
                 )}
               </Form.Item>
            </Card>

            <Alert
              title="Operational Impact"
              description="Changes to boundaries take effect immediately across all client apps in the DashDrive network."
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              style={{ borderRadius: 12 }}
            />
          </Form>
        </Drawer>

        <Drawer
          title={<Space><HistoryOutlined style={{ color: '#00b894' }} /> Action-Zone Activity Log</Space>}
          open={isLogDrawerOpen}
          onClose={() => setIsLogDrawerOpen(false)}
          width={450}
          className="premium-drawer"
        >
          <Flex vertical gap={0}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ padding: '12px 0', borderBottom: idx === logs.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{log.action}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{log.timestamp}</Text>
                  </div>
                  <Text style={{ fontSize: 13, display: 'block', margin: '4px 0' }}>
                    <Tag color="cyan" style={{ fontSize: 10 }}>{log.zoneName}</Tag> {log.details}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>By: {log.user}</Text>
                </div>
              </div>
            ))}
          </Flex>
        </Drawer>

        <Drawer
          title={<Space><RestOutlined style={{ color: '#ef4444' }} /> Manage Trashed Zones</Space>}
          open={isTrashModalOpen}
          onClose={() => setIsTrashModalOpen(false)}
          width={550}
          className="premium-drawer"
        >
          {trashedZones.length === 0 ? (
            <Empty description="No trashed zones found" style={{ marginTop: 100 }} />
          ) : (
            <Flex vertical>
              {trashedZones.map((z: any) => (
                <div key={z.id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space direction="vertical" size={2}>
                    <Text strong>{z.name}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>ID: {z.id} • Reason: <Text type="danger" style={{ fontSize: 11 }}>{z.deleteReason || 'No reason provided'}</Text></Text>
                  </Space>
                  <Space>
                    <Button type="link" icon={<RollbackOutlined />} onClick={() => handleRestoreZone(z)}>Restore</Button>
                    <Button type="link" danger icon={<DeleteFilled />} onClick={() => handlePermanentDelete(z)}>Erase</Button>
                  </Space>
                </div>
              ))}
            </Flex>
          )}
        </Drawer>

        <Modal
            title={<span><WarningOutlined style={{ color: '#ef4444' }} /> Mandatory Zone Deletion Protocol</span>}
            open={deleteModalVisible}
            onCancel={() => { setDeleteModalVisible(false); deleteForm.resetFields(); }}
            onOk={() => deleteForm.submit()}
            confirmLoading={loading}
            okText="Move to Trash"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
        >
            <Form form={deleteForm} layout="vertical" onFinish={handleDeleteZone}>
                <Alert
                    message="Service Disruption Warning"
                    description={`Deleting "${selectedDeleteZone?.name}" will disable all services and geofences tied to this area. Drivers will no longer receive orders from this zone.`}
                    type="error"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
                <Form.Item 
                    name="reason" 
                    label="Required: Deletion/Archival Insight" 
                    rules={[{ required: true, message: 'Please provide a justification for this operational change.' }]}
                >
                    <TextArea placeholder="Ex: Zone merged with CBD North Hub or temporary operational suspension..." rows={4} />
                </Form.Item>
            </Form>
        </Modal>
      </div>
    );
};

const RenderDispatchManagement: React.FC = () => {
    const { message } = App.useApp();
    const [queue, setQueue] = useState([
      { id: 'ORD-1021', type: 'Ride', customer: 'Alice J.', zone: 'Harare CBD', waitTime: '02:15', status: 'Waiting', priority: 'Normal' },
      { id: 'ORD-1022', type: 'Food', customer: 'Bob S.', zone: 'Avondale', waitTime: '01:45', status: 'Assigning', priority: 'High' },
      { id: 'ORD-1023', type: 'Mart', customer: 'Charlie R.', zone: 'Harare CBD', waitTime: '00:30', status: 'Waiting', priority: 'VIP' },
    ]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);


    const queueColumns = [
      { 
        title: 'Order Tracking', 
        dataIndex: 'id', 
        key: 'id', 
        render: (text: string, record: any) => (
          <Space size={4}>
              <Text strong code style={{ fontSize: 12 }}>{text}</Text>
              <Tooltip title="Copy Order ID">
                <Button type="text" size="small" icon={<CopyOutlined style={{ fontSize: 10 }} />} onClick={() => { navigator.clipboard.writeText(text); message.success('Order ID copied'); }} />
              </Tooltip>
              {record.priority === 'VIP' && <Tag color="gold" style={{ margin: 0, fontSize: 10 }}>VIP</Tag>}
          </Space>
        )
      },
      { 
        title: 'Service', 
        dataIndex: 'type', 
        key: 'type',
        render: (type: string) => <Tag color={type === 'Ride' ? 'blue' : type === 'Food' ? 'orange' : 'green'}>{type}</Tag>
      },
      { title: 'Zone', dataIndex: 'zone', key: 'zone' },
      { title: 'Wait', dataIndex: 'waitTime', key: 'waitTime' },
      { 
        title: 'Status', 
        dataIndex: 'status', 
        key: 'status',
        render: (status: string) => (
          <Tag color={status === 'Waiting' ? 'default' : status === 'Assigning' ? 'processing' : 'error'}>{status}</Tag>
        )
      },
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
          <Button size="small" type="primary" onClick={() => setSelectedOrder(record)} style={{ background: '#00b894', border: 'none' }}>Oversight</Button>
        )
      }
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
             <Card 
               className="shadow-sm" 
               variant="borderless"
               style={{ borderRadius: 16 }}
               title={<Space><RadarChartOutlined /> Live Dispatch Queue</Space>}
               extra={
                <Space>
                  <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? 'Engine Active' : 'Engine Paused'} />
                  <Button size="small" type={isEnabled ? 'default' : 'primary'} onClick={() => setIsEnabled(!isEnabled)}>
                    {isEnabled ? 'Pause' : 'Resume'}
                  </Button>
                </Space>
               }
             >
                <Table columns={queueColumns} dataSource={queue} pagination={false} size="middle" rowKey="id" />
             </Card>

             <Card 
               title={<Space><ThunderboltOutlined /> Engine Rules Configuration</Space>} 
               variant="borderless" 
               className="shadow-sm" 
               size="small"
               style={{ marginTop: 24, borderRadius: 16 }}
             >
                <Row gutter={40}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Space>
                            <Text type="secondary" style={{ fontSize: 13 }}>Initial Search Radius</Text>
                            <Tooltip title="The maximum distance (in kilometers) the engine searches for available drivers starting from the pickup/merchant location."><InfoCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} /></Tooltip>
                        </Space>
                        <Progress percent={60} strokeColor="#00b894" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ fontSize: 12 }}>Current: 5km</Text>
                          <Button type="link" size="small">Modify</Button>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Space>
                             <Text type="secondary" style={{ fontSize: 13 }}>Response Timeout</Text>
                             <Tooltip title="The time (in seconds) a driver has to accept an order before it is automatically re-offered to the next candidate."><InfoCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} /></Tooltip>
                        </Space>
                        <Progress percent={45} strokeColor="#3b82f6" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ fontSize: 12 }}>Current: 15s</Text>
                          <Button type="link" size="small">Modify</Button>
                        </div>
                      </div>
                    </Col>
                </Row>
             </Card>
          </Col>

          <Col xs={24} lg={8}>
             <Card 
               title="Order Intelligence" 
               variant="borderless" 
               className="shadow-sm" 
               style={{ borderRadius: 16, minHeight: 400 }}
             >
                {!selectedOrder ? (
                  <Empty description="Select an order for Oversight" style={{ marginTop: 80 }} />
                ) : (
                  <Space orientation="vertical" style={{ width: '100%' }} size="large">
                    <Descriptions column={1} size="small" bordered>
                      <Descriptions.Item label="Order ID">{selectedOrder.id}</Descriptions.Item>
                      <Descriptions.Item label="Status">{selectedOrder.status}</Descriptions.Item>
                      <Descriptions.Item label="Wait Time">{selectedOrder.waitTime}</Descriptions.Item>
                    </Descriptions>

                    <Card size="small" title="Matching History" headStyle={{ fontSize: 12, background: '#f8fafc' }}>
                       <CustomTimeline
                          items={[
                            { children: 'Search initiated (r=5km)', color: 'green' },
                            { children: '3 candidates identified', color: 'green' },
                            { children: 'Request sent to Alex T. (92%)', color: 'blue' },
                            { children: 'Driver Timeout (Pending)', color: 'gray' },
                          ]}
                       />
                    </Card>
                    
                    <Button block type="primary" style={{ background: '#00b894', border: 'none' }} onClick={() => {
                        Modal.confirm({
                            title: 'Initiate Manual Assignment',
                            content: (
                                <div>
                                    <Text>You are overriding the autonomous dispatch engine for <strong>{selectedOrder.id}</strong>.</Text>
                                    <div style={{ marginTop: 16 }}>
                                        <Text strong>Required justification:</Text>
                                        <TextArea rows={3} placeholder="Ex: Direct request from VIP customer or specific driver request..." style={{ marginTop: 8 }} />
                                    </div>
                                </div>
                            ),
                            okText: 'Confirm Assignment',
                            onOk: () => {
                                message.success('Order manually dispatched and logged.');
                            }
                        });
                    }}>
                      Force Manual Assign
                    </Button>
                    <Button block danger type="dashed" onClick={() => {
                        Modal.confirm({
                            title: 'Cancel Order Assignment',
                            content: 'Are you sure you want to stop the assignment process for this order? This will move it back to the pending queue.',
                            okText: 'Yes, Stop Assignment',
                            okButtonProps: { danger: true },
                            onOk: () => {
                                message.warning('Assignment terminated.');
                            }
                        });
                    }}>Cancel Assignment</Button>
                  </Space>
                )
              }
             </Card>
          </Col>
        </Row>
      </div>
    );
};

const RenderLiveTracking: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
    const { message } = App.useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTrip, setActiveTrip] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [playbackMode, setPlaybackMode] = useState(false);

    const handleSearch = (value: string) => {
        setLoading(true);
        setTimeout(() => {
            const found = MOCK_TRIPS.find(t => t.id === value.toUpperCase() || t.driver.id === value.toUpperCase() || t.customer.name.toLowerCase().includes(value.toLowerCase()));
            if (found) {
                setActiveTrip(found);
                message.success(`Tracking initiated for ${found.id}`);
            } else {
                setActiveTrip(null);
                message.error('Order/Trip not found');
            }
            setLoading(false);
        }, 600);
    };

    const bounds: {lat: number, lng: number}[] | null = activeTrip ? [
        { lat: activeTrip.merchant?.lat || activeTrip.pickup?.lat, lng: activeTrip.merchant?.lng || activeTrip.pickup?.lng },
        { lat: activeTrip.dropoff.lat, lng: activeTrip.dropoff.lng },
        { lat: activeTrip.driver.lat, lng: activeTrip.driver.lng }
    ] : MOCK_TRIPS.map(t => ({ lat: t.driver.lat, lng: t.driver.lng }));

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col span={16}>
             <Input.Search 
                placeholder="Track Order ID, Driver, or Customer..." 
                size="large"
                onSearch={handleSearch}
                loading={loading}
                enterButton={< ThunderboltOutlined />}
                allowClear
                style={{ borderRadius: 12, overflow: 'hidden' }}
             />
          </Col>
          <Col span={8}>
            <Space>
               <Badge status="processing" text="421 Active Trips" />
               <Divider orientation="vertical" />
               <Badge status="error" text="12 Incidents" />
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ height: 600 }}>
           <Col span={activeTrip ? 16 : 24} style={{ height: '100%', transition: 'all 0.3s' }}>
              <Card 
                variant="borderless" 
                className="shadow-sm" 
                styles={{ body: { padding: 0, height: '100%', position: 'relative', overflow: 'hidden' } }} 
                style={{ borderRadius: 16, height: '100%', minHeight: 600 }}
              >
                   <BaseMap isLoaded={isLoaded} 
                      center={[-17.8248, 31.0530]} 
                      zoom={13} 
                      height={600}
                   >
                      <MapFitter bounds={bounds} />
                      
                      {activeTrip ? (
                          <>
                              <DriverMarker position={{ lat: activeTrip.driver.lat, lng: activeTrip.driver.lng }} />
                              {(activeTrip.merchant || activeTrip.pickup) && (
                                  <PickupMarker position={{ lat: activeTrip.merchant?.lat || activeTrip.pickup?.lat, lng: activeTrip.merchant?.lng || activeTrip.pickup?.lng }} />
                              )}
                              <DropoffMarker position={{ lat: activeTrip.dropoff.lat, lng: activeTrip.dropoff.lng }} />
                              {activeTrip.encodedPolyline ? (
                                <RoutePreview encodedPolyline={activeTrip.encodedPolyline} color="#0f172a" weight={4} opacity={0.6} />
                              ) : (
                                <PolylineF 
                                  path={activeTrip.route} 
                                  options={{ strokeColor: "#0f172a", strokeWeight: 4, strokeOpacity: 0.6, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '20px' }] }} 
                                />
                              )}
                          </>
                      ) : (
                          MOCK_TRIPS.map(trip => (
                              <MarkerF key={trip.id} position={{ lat: trip.driver.lat, lng: trip.driver.lng }} onClick={() => setActiveTrip(trip)}>
                                  <InfoWindowF position={{ lat: trip.driver.lat, lng: trip.driver.lng }}>
                                      <div>
                                          <Text strong>{trip.id}</Text><br/>
                                          <Text type="secondary">{trip.driver.name}</Text>
                                      </div>
                                  </InfoWindowF>
                              </MarkerF>
                          ))
                      )}
                   </BaseMap>

                  {activeTrip && (
                    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000 }}>
                        <Card size="small" style={{ borderRadius: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                           <Space size="large">
                              <Statistic title="Elapsed" value={activeTrip.elapsed} valueStyle={{ fontSize: 14, color: '#ef4444' }} />
                              <Statistic title="ETA" value={activeTrip.eta} valueStyle={{ fontSize: 14, color: '#10b981' }} />
                           </Space>
                        </Card>
                    </div>
                  )}
              </Card>
           </Col>

           {activeTrip && (
              <Col span={8}>
                 <Space orientation="vertical" style={{ width: '100%' }}>
                    <Card title={<Space><SyncOutlined spin={playbackMode} /> Trip Intelligence</Space>} variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                       <div style={{ marginBottom: 20 }}>
                          <Space align="start">
                             <Avatar src={activeTrip.customer.avatar} size="large" />
                             <div>
                                <Text strong>{activeTrip.customer.name}</Text>
                                <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{activeTrip.customer.phone}</Text>
                             </div>
                          </Space>
                       </div>
                       
                       <CustomTimeline
                          items={activeTrip.timeline.map((it: any) => ({
                             children: `${it.time} - ${it.event}`,
                             color: it.alert ? 'red' : it.status === 'success' ? 'green' : 'blue'
                          }))}
                       />
                    </Card>
                     <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                        <Space>
                            <Title level={5} style={{ margin: 0 }}>Intervention Terminal</Title>
                            <Tooltip title="Emergency overrides for active trips. Every action here is logged and requires administrative clearance."><InfoCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} /></Tooltip>
                        </Space>
                        <Space orientation="vertical" style={{ width: '100%', marginTop: 12 }}>
                           <Button block icon={<PhoneOutlined />} onClick={() => message.info('Connecting to regional operator...')}>Call Operator</Button>
                           <Button block type="primary" danger style={{ background: '#ef4444', border: 'none' }} onClick={() => {
                               Modal.confirm({
                                   title: 'Force Trip Reassignment',
                                   content: 'This will decouple the current driver and return the trip to the dispatch queue. Use only in case of driver emergency or vehicle failure.',
                                   okText: 'Reassign Now',
                                   okButtonProps: { danger: true },
                                   onOk: () => message.success('Reassignment initiated.')
                               });
                           }}>Reassign Driver</Button>
                        </Space>
                     </Card>

                 </Space>
              </Col>
            )}
        </Row>
      </div>
    );
};

const RenderActiveAlerts: React.FC<{ alerts: any[], onFix: (id: string) => void }> = ({ alerts, onFix }) => {
    const { message } = App.useApp();
    const columns = [
      { 
        title: 'ID', 
        dataIndex: 'id', 
        key: 'id',
        render: (text: string) => <Text strong>{text}</Text>
      },
      { 
        title: 'Type', 
        dataIndex: 'type', 
        key: 'type',
        render: (type: string, record: any) => (
          <Space>
            <Text>{type}</Text>
            <Tag color={record.severity === 'High' ? 'error' : 'warning'}>{record.severity}</Tag>
          </Space>
        )
      },
      { title: 'Service', dataIndex: 'service', key: 'service' },
      { title: 'Time', dataIndex: 'time', key: 'time' },
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
          <Button size="small" type="primary" onClick={() => onFix(record.id)} style={{ background: '#00b894', border: 'none' }}>Resolve</Button>
        )
      }
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
             <Space>
                <Title level={5} style={{ margin: 0 }}>Active Operational Alerts</Title>
                <Tooltip title="Real-time incidents requiring immediate administrative attention."><InfoCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} /></Tooltip>
             </Space>
             <Space>
                <Button size="small" icon={<HistoryOutlined />} onClick={() => message.info('Navigating to resolution history...')}>Resolution History</Button>
                <Select defaultValue="all" size="small" options={[{value: 'all', label: 'All Severities'}]} />
                <Button size="small" icon={<FilterOutlined />}>Filter</Button>
             </Space>
          </div>
          <Table 
            columns={columns} 
            dataSource={alerts} 
            rowKey="id"
            pagination={{ pageSize: 15 }}
          />
        </Card>
      </div>
    );
};

const RenderSolvedAlerts: React.FC = () => {
    const historicalAlerts = [
      { id: 'AL-095', type: 'Merchant Delay', service: 'Food', driver: 'Kuda M.', solvedBy: 'Ops_Admin_1', time: '2 hours ago', status: 'Resolved' },
      { id: 'AL-094', type: 'GPS Signal Lost', service: 'Ride', driver: 'Tendai P.', solvedBy: 'SystemAuto', time: '3 hours ago', status: 'Auto-Resolved' },
    ];

    const columns = [
      { title: 'Alert ID', dataIndex: 'id', key: 'id' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
      { title: 'Service', dataIndex: 'service', key: 'service' },
      { title: 'Resolved By', dataIndex: 'solvedBy', key: 'solvedBy' },
      { title: 'Time', dataIndex: 'time', key: 'time' },
      { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color="green">{s}</Tag> }
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
             <Title level={5} style={{ margin: 0 }}>Incident Resolution History</Title>
          </div>
          <Table columns={columns} dataSource={historicalAlerts} rowKey="id" pagination={{ pageSize: 10 }} />
        </Card>
      </div>
    );
};

const RenderSurgeAndDemand: React.FC<{ 
    zones: any[], 
    onOverride: (id: string, val: number, reason: string) => void,
    onApplyRec: () => void,
    isLoaded: boolean
}> = ({ zones, onOverride, onApplyRec, isLoaded }) => {
    const { message } = App.useApp();
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const [overrideValue, setOverrideValue] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={24}>
           <Col span={16}>
              <Card 
                styles={{ body: { padding: 0, height: 600, position: 'relative' } }} 
                variant="borderless"
                className="shadow-sm"
                style={{ borderRadius: 16, overflow: 'hidden' }}
                title={<Space><ThunderboltOutlined /> Dynamic Demand Heatmap</Space>}
              >
                  <BaseMap isLoaded={isLoaded} center={[-17.8248, 31.0530]} zoom={13} height={600}>
                      {zones.map(dz => (
                          <CircleF 
                            key={dz.id}
                            center={dz.coords as any} 
                            radius={dz.radius}
                            options={{ 
                                strokeColor: dz.demand === 'Extreme' ? '#ef4444' : '#f59e0b', 
                                fillColor: dz.demand === 'Extreme' ? '#ef4444' : '#f59e0b', 
                                fillOpacity: 0.3 
                            }} 
                          />
                      ))}
                  </BaseMap>
                  
                  <div style={{ position: 'absolute', top: 70, right: 20, zIndex: 1000 }}>
                    <Card size="small" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                       <Space orientation="vertical" size="small">
                          <Badge status="error" text="Critical Demand" />
                          <Badge status="warning" text="High Demand" />
                          <Badge status="processing" text="Normal" />
                       </Space>
                    </Card>
                  </div>
              </Card>
           </Col>

           <Col span={8}>
              <Space orientation="vertical" style={{ width: '100%' }}>
                 <Card title="Surge Control Console" variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                    <div style={{ marginBottom: 24 }}>
                       <Text type="secondary" style={{ fontSize: 12 }}>Global Surge Status</Text>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Title level={4} style={{ margin: 0 }}>Auto-Surge Active</Title>
                          <Switch defaultChecked />
                       </div>
                    </div>

                    <Flex vertical gap={12}>
                      {zones.map((item, idx) => (
                         <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <Text strong>{item.name}</Text>
                               <Tag color={item.demand === 'Extreme' ? 'error' : 'warning'}>{item.currentMulti}x</Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>Calculated based on live platform demand pings</Text>
                            <div style={{ marginTop: 8 }}>
                               <Button 
                                  size="small" 
                                  type="primary" 
                                  ghost 
                                  icon={<ThunderboltOutlined />}
                                  onClick={() => {
                                      setSelectedZone(item);
                                      setOverrideValue(item.currentMulti);
                                      setIsModalVisible(true);
                                      form.setFieldsValue({ multiplier: item.currentMulti, reason: '' });
                                  }}
                                >
                                  Override Multiplier
                                </Button>
                             </div>
                          </div>
                      ))}
                    </Flex>
                 </Card>

                 <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16, background: '#f8fafc' }}>
                    <Title level={5} style={{ fontSize: 14 }}>System Recommendation</Title>
                    <Paragraph style={{ fontSize: 12 }}>
                       Enable +0.2x surge in <b>Mt Pleasant</b> to attract drivers from neighboring zones.
                    </Paragraph>
                    <Button type="primary" size="small" onClick={onApplyRec} style={{ background: '#00b894', border: 'none' }}>Apply Now</Button>
                 </Card>
              </Space>
              <Modal
            title={<Space><ThunderboltOutlined style={{ color: '#f59e0b' }} /> Tactical Surge Override</Space>}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Apply Override"
        >
            <Form form={form} layout="vertical" onFinish={(values) => {
                setLoading(true);
                setTimeout(() => {
                    onOverride(selectedZone.id, values.multiplier, values.reason);
                    setLoading(false);
                    setIsModalVisible(false);
                }, 800);
            }}>
                <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                    You are manually adjusting the multiplier for <b>{selectedZone?.name}</b>. This will override the autonomous demand engine for 2 hours.
                </Text>
                <Form.Item name="multiplier" label="Override Multiplier" rules={[{ required: true }]}>
                    <InputNumber min={1.0} max={5.0} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item 
                    name="reason" 
                    label="Override Justification" 
                    rules={[{ required: true, message: 'Please provide a reason for this tactical override' }]}
                >
                    <TextArea rows={3} placeholder="Supply shortage, local event, weather disruption..." />
                </Form.Item>
            </Form>
        </Modal>
           </Col>
        </Row>
      </div>
    );
};

const RenderBroadcastCommand: React.FC<{ 
    broadcasts: Broadcast[], 
    onNew: () => void 
}> = ({ broadcasts, onNew }) => {
    const columns = [
        { 
          title: 'Broadcast Identity', 
          dataIndex: 'title', 
          key: 'title',
          render: (text: string, record: Broadcast) => (
            <div>
                <Text strong>{text}</Text>
                <div style={{ fontSize: 11, color: '#64748b' }}>{record.id} • {record.timestamp}</div>
            </div>
          )
        },
        { 
          title: 'Audience', 
          dataIndex: 'target', 
          key: 'target',
          render: (target: string, record: Broadcast) => (
            <Space size={4}>
                <Tag color="blue">{target}</Tag>
                {record.targetDetail && <Text type="secondary" style={{ fontSize: 11 }}>[{record.targetDetail}]</Text>}
            </Space>
          )
        },
        { 
          title: 'Priority', 
          dataIndex: 'priority', 
          key: 'priority',
          render: (p: string) => (
            <Tag color={p === 'Emergency' ? 'red' : p === 'High' ? 'orange' : 'blue'}>{p}</Tag>
          )
        },
        { 
          title: 'Reason/Insight', 
          dataIndex: 'reason', 
          key: 'reason',
          ellipsis: true,
          render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (s: string) => <Badge status={s === 'Sent' ? 'success' : 'processing'} text={s} />
        }
    ];

    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <Title level={4} style={{ margin: 0 }}>Operations Broadcast Terminal</Title>
                   <Text type="secondary">High-priority platform-wide announcements and mobility alerts</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={onNew}>Create New Broadcast</Button>
            </div>

            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }} styles={{ body: { padding: 0 } }}>
                <Table 
                    columns={columns} 
                    dataSource={broadcasts} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    expandable={{
                        expandedRowRender: record => (
                            <div style={{ padding: '8px 24px' }}>
                                <Text strong>Message Content:</Text>
                                <Paragraph style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginTop: 8 }}>
                                    {record.content}
                                </Paragraph>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

const RenderOperationsAnalytics: React.FC = () => {
    const { message } = App.useApp();
    const hourlyData = [
      { time: '08:00', trips: 120, waitTime: 4.5 },
      { time: '10:00', trips: 340, waitTime: 5.2 },
      { time: '12:00', trips: 560, waitTime: 6.8 },
      { time: '14:00', trips: 420, waitTime: 5.5 },
      { time: '16:00', trips: 890, waitTime: 8.2 },
      { time: '18:00', trips: 1100, waitTime: 9.5 },
    ];

    const serviceData = [
      { name: 'Rides', value: 65, color: '#3b82f6' },
      { name: 'Food', value: 25, color: '#f59e0b' },
      { name: 'Parcel', value: 10, color: '#10b981' },
    ];

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={[24, 24]}>
           <Col span={16}>
              <Card title="Engagement & Volume (Last 24h)" variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                 <div style={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={hourlyData}>
                          <defs>
                             <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00b894" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#00b894" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                          <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="trips" stroke="#00b894" fillOpacity={1} fill="url(#colorTrips)" strokeWidth={3} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <Row gutter={16} style={{ marginTop: 24 }}>
                 <Col span={12}>
                    <Card title="Operational Efficiency" bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
                       <div style={{ height: 350, width: '100%', minWidth: 0 }}>
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={hourlyData}>
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <RechartsTooltip />
                                <Line type="monotone" dataKey="waitTime" stroke="#ef4444" strokeWidth={2} dot={false} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </Card>
                 </Col>
                 <Col span={12}>
                    <Card title="Dispatch Efficiency" bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
                       <div style={{ textAlign: 'center', padding: '20px 0' }}>
                          <Progress type="dashboard" percent={94} strokeColor="#00b894" gapDegree={30} />
                          <div style={{ marginTop: 16 }}>
                             <Text strong style={{ fontSize: 18, display: 'block' }}>Optimized</Text>
                             <Text type="secondary">Dispatch success rate is 4% above target.</Text>
                          </div>
                       </div>
                    </Card>
                 </Col>
              </Row>
           </Col>

           <Col span={8}>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <Title level={4} style={{ margin: 0 }}>Operational Performance Analytics</Title>
               <Text type="secondary">Real-time throughput, efficiency metrics, and service-level distribution</Text>
            </div>
            <Space>
               <Button icon={<SyncOutlined />} onClick={() => message.success('Analytics data refreshed')}>Refresh Stats</Button>
               <Dropdown 
                  menu={{ 
                    items: [
                        { key: 'pdf', label: 'Export as PDF (Ops Summary)', icon: <CloudDownloadOutlined /> },
                        { key: 'excel', label: 'Export as Excel (Raw Data)', icon: <CloudDownloadOutlined /> }
                    ],
                    onClick: () => message.success('Generating operational report...')
                  }}
               >
                  <Button type="primary" icon={<CloudDownloadOutlined />}>Generate Report</Button>
               </Dropdown>
            </Space>
          </div>
              <Card title="Service Mix Distribution" variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
                 <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={serviceData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                          >
                             {serviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <Divider />
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 13 }}>Network Compliance</Text>
                          <Text strong>98.2%</Text>
                       </div>
                       <Progress percent={98.2} size="small" strokeColor="#10b981" showInfo={false} />
                    </div>
                    <div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 13 }}>Driver Satisfaction</Text>
                          <Text strong>4.8/5</Text>
                       </div>
                       <Progress percent={96} size="small" strokeColor="#3b82f6" showInfo={false} />
                    </div>
                 </div>
              </Card>
           </Col>
        </Row>
      </div>
    );
};

export const OperationsHubPage: React.FC<{ initialTab?: string }> = ({ initialTab: propInitialTab = '1' }) => {
    const { message, notification, modal } = App.useApp();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places', 'drawing', 'visualization', 'geometry', 'marker']
    });

    const [activeTab, setActiveTab] = useState(propInitialTab);
    const [hubMapFilter, setHubMapFilter] = useState('All');
    const [mapBounds, setMapBounds] = useState<{lat: number, lng: number}[] | null>(null);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState([
        { id: 'AL-101', type: 'Driver Unresponsive', severity: 'High', service: 'Ride', location: 'Harare CBD', time: '10:45 AM', driver: 'Alex T.', detail: 'Driver assigned to RID-1055 but has not moved for 5 minutes.' },
        { id: 'AL-102', type: 'Delay in Pickup', severity: 'Medium', service: 'Food', location: 'Avondale', time: '10:50 AM', driver: 'Mike N.', detail: 'Pickup time exceeded by 8 minutes at Pizza Hub.' },
        { id: 'AL-103', type: 'Dispatch Failure', severity: 'High', service: 'Ride', location: 'CBD', time: '10:55 AM', info: 'No drivers accepted order ORD-991' },
    ]);
    const [isManualDispatch, setIsManualDispatch] = useState(false);
    const [demandZones, setDemandZones] = useState([
      { id: 'D-1', name: 'CBD North', demand: 'Extreme', currentMulti: 1.8, coords: {lat: -17.8200, lng: 31.0510}, radius: 600 },
      { id: 'D-2', name: 'Avondale Shops', demand: 'High', currentMulti: 1.4, coords: {lat: -17.8050, lng: 31.0400}, radius: 400 },
    ]);
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(MOCK_BROADCASTS);
    const [isBCModalOpen, setIsBCModalOpen] = useState(false);
    const [bcLoading, setBcLoading] = useState(false);
    const [bcForm] = Form.useForm();
    const [bcPreview, setBcPreview] = useState('');


    const handleLocateZone = (points: {lat: number, lng: number}[]) => {
        if (!points || points.length === 0) return;
        setMapBounds(points);
        message.info('Map centered on selected zone.');
    };

    const handleFixAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        message.success('Operational incident resolved and logged.');
    };

    const handleOverrideSurge = (id: string, val: number, reason: string) => {
        setDemandZones(prev => prev.map(z => 
            z.id === id ? { ...z, currentMulti: val } : z
        ));
        console.log(`[Surge Override] ID: ${id}, New Multiplier: ${val}, Reason: ${reason}`);
        message.info(`Surge adjusted to ${val}x. Change logged.`);
    };

    const handleApplyRecommendation = () => {
        setDemandZones(prev => [
            ...prev,
            { id: `D-${Date.now()}`, name: 'Mt Pleasant', demand: 'Medium', currentMulti: 1.2, coords: {lat: -17.7800, lng: 31.0500}, radius: 500 }
        ]);
        message.success('System recommendation applied. Mt Pleasant zone activated.');
    };

    const handleToggleDispatch = () => {
        setIsManualDispatch(!isManualDispatch);
        if (!isManualDispatch) {
            message.warning('Tactical Manual Dispatch Override ACTIVE.');
        } else {
            message.success('Autonomous Dispatch Engine Restored.');
        }
    };

    const handleSendBC = (values: any) => {
        setBcLoading(true);
        setTimeout(() => {
            const newBC: Broadcast = {
                id: `BC-${Date.now()}`,
                ...values,
                status: 'Sent',
                timestamp: new Date().toLocaleString(),
                sender: 'Current Admin'
            };
            setBroadcasts(prev => [newBC, ...prev]);
            setBcLoading(false);
            setIsBCModalOpen(false);
            bcForm.resetFields();
            setBcPreview('');
            notification.success({
                message: 'Broadcast Dispatched',
                description: `Successfully sent "${values.title}" to target audience.`
            });
        }, 1500);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [driversRes, statsRes] = await Promise.all([
                adminApi.users.getDrivers(),
                analyticsApi.getGlobalStats()
            ]);
            setDrivers(driversRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch operational data:', error);
            message.error('Data synchronization failed. Using fallback data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up real-time polling interval (simulated for now)
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (propInitialTab) {
            setActiveTab(propInitialTab);
        }
    }, [propInitialTab]);

    const tabItems = [
      {
        key: '1',
        label: <Space><DashboardOutlined /> Dashboard</Space>,
        children: <OperationsDashboard 
                    onViewAll={() => setActiveTab('5')} 
                    filter={hubMapFilter} 
                    onFilterChange={setHubMapFilter}
                    alerts={alerts}
                    onFix={handleFixAlert}
                    isManualDispatch={isManualDispatch}
                    onToggleDispatch={handleToggleDispatch}
                    onNewBroadcast={() => setIsBCModalOpen(true)}
                    drivers={drivers}
                    stats={stats}
                    onRefresh={fetchData}
                    refreshing={loading}
                    isLoaded={isLoaded}
                  />
      },
       {
        key: '2',
        label: <Space><EnvironmentOutlined /> Zone Setup</Space>,
        children: <RenderZoneSetup onLocate={handleLocateZone} mapBounds={mapBounds} isLoaded={isLoaded} />
      },
      {
        key: '3',
        label: <Space><RadarChartOutlined /> Dispatch Management</Space>,
        children: <RenderDispatchManagement />
      },
      {
        key: '4',
        label: <Space><RocketOutlined /> Live Tracking</Space>,
        children: <RenderLiveTracking isLoaded={isLoaded} />
      },
      {
        key: '5',
        label: <Space><BellOutlined /> Active Alerts</Space>,
        children: <RenderActiveAlerts alerts={alerts} onFix={handleFixAlert} />
      },
      {
        key: '6',
        label: <Space><HistoryOutlined /> History Logs</Space>,
        children: <RenderSolvedAlerts />
      },
      {
        key: '7',
        label: <Space><ThunderboltOutlined /> Surge & Demand</Space>,
        children: <RenderSurgeAndDemand 
                    zones={demandZones} 
                    onOverride={handleOverrideSurge}
                    onApplyRec={handleApplyRecommendation}
                    isLoaded={isLoaded}
                  />
      },
      {
        key: '8',
        label: <Space><LineChartOutlined /> Analytics</Space>,
        children: <RenderOperationsAnalytics />
      },
      {
        key: '9',
        label: <Space><BellOutlined /> Broadcast Command</Space>,
        children: <RenderBroadcastCommand 
                    broadcasts={broadcasts} 
                    onNew={() => setIsBCModalOpen(true)} 
                  />
      }
    ];

    return (
      <div style={{ padding: '0 24px 24px 24px', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ marginBottom: 24, paddingTop: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
               <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Operations Hub</Title>
               <Text type="secondary">Central Real-time Command & Dispatch Engine for DashDrive Network.</Text>
            </Col>
            <Col>
               <Space size="middle">
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ display: 'block' }}>Network Status: Optimal</Text>
                    <Text style={{ fontSize: 12, color: '#10b981' }}><SyncOutlined spin /> Live Sync: 0.4ms latency</Text>
                  </div>
                  <Divider orientation="vertical" style={{ height: 40 }} />
                  <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 8, background: '#00b894', border: 'none' }} onClick={() => setIsBCModalOpen(true)}>
                    New Broadcast
                  </Button>
               </Space>
            </Col>
          </Row>
        </div>

        <div className="operations-tabs-container">
          <Card variant="borderless" styles={{ body: { padding: '0 16px' } }} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={tabItems} 
              size="large"
              tabBarStyle={{ marginBottom: 0, borderBottom: 'none' }}
              className="premium-tabs"
            />
          </Card>
        </div>

        <style>{`
          .operations-tabs-container .ant-tabs-nav::before {
            border-bottom: none !important;
          }
          .operations-tabs-container .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #00b894 !important;
            font-weight: 700 !important;
          }
          .operations-tabs-container .ant-tabs-ink-bar {
            background: #00b894 !important;
            height: 3px !important;
          }
          .shadow-sm {
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          }
        `}</style>

        <Modal
            title={<Space><BellOutlined style={{ color: '#3b82f6' }} /> Compose Operational Broadcast</Space>}
            open={isBCModalOpen}
            onCancel={() => setIsBCModalOpen(false)}
            onOk={() => bcForm.submit()}
            confirmLoading={bcLoading}
            width={600}
            okText="Dispatch Broadcast"
        >
            <Form form={bcForm} layout="vertical" onFinish={handleSendBC} initialValues={{ priority: 'Normal', target: 'All' }}>
                <Row gutter={16}>
                    <Col span={16}>
                        <div style={{ marginBottom: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {['📢', '🚨', '🚧', '🔥', '🚀', '💎', 'ℹ️'].map(emoji => (
                                <Button 
                                    key={emoji} 
                                    size="small" 
                                    type="text"
                                    onClick={() => {
                                        const curr = bcForm.getFieldValue('title') || '';
                                        bcForm.setFieldsValue({ title: curr + emoji });
                                    }}
                                    style={{ padding: '0 4px', fontSize: 14 }}
                                >
                                    {emoji}
                                </Button>
                            ))}
                        </div>
                        <Form.Item name="title" label="Broadcast Heading" rules={[{ required: true }]}>
                            <Input placeholder="Brief, urgent headline..." />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="priority" label="Priority Level">
                            <Select options={[{ value: 'Normal', label: 'Normal' }, { value: 'High', label: 'Tactical High' }, { value: 'Emergency', label: 'Operational Emergency' }]} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="target" label="Target Audience Group">
                    <Segmented 
                        block 
                        options={[
                            { label: 'Global (All)', value: 'All', icon: <GlobalOutlined /> },
                            { label: 'Drivers', value: 'Drivers', icon: <CarOutlined /> },
                            { label: 'Customers', value: 'Customers', icon: <UserOutlined /> },
                            { label: 'Zone Only', value: 'Zone', icon: <EnvironmentOutlined /> }
                        ]} 
                    />
                </Form.Item>

                <Form.Item 
                    noStyle 
                    shouldUpdate={(prev, curr) => prev.target !== curr.target}
                >
                    {({ getFieldValue }) => getFieldValue('target') === 'Zone' && (
                        <Form.Item name="targetDetail" label="Target Zone" rules={[{ required: true }]}>
                            <Select placeholder="Select geographical zone..." options={INITIAL_ZONES.map(z => ({ value: z.name, label: z.name }))} />
                        </Form.Item>
                    )}
                </Form.Item>

                <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['📢', '🚨', '🚧', '🔥', '🚀', '💎', '🌧️', '✅', '⚠️', '⚡', '✨', '🌟', 'ℹ️'].map(emoji => (
                        <Button 
                            key={emoji} 
                            size="small" 
                            onClick={() => {
                                const curr = bcForm.getFieldValue('content') || '';
                                bcForm.setFieldsValue({ content: curr + emoji });
                                setBcPreview(curr + emoji);
                            }}
                            style={{ borderRadius: 6, padding: '0 8px' }}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>

                <Form.Item name="content" label="Notification Content" rules={[{ required: true }]}>
                    <TextArea 
                        rows={4} 
                        placeholder="Detailed operational update..." 
                        onChange={(e) => setBcPreview(e.target.value)}
                    />
                </Form.Item>

                <Card size="small" style={{ background: '#f8fafc', marginBottom: 20 }}>
                    <Text strong style={{ fontSize: 12 }}>Device Preview:</Text>
                    <div style={{ marginTop: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                        <Badge dot status="processing" style={{ marginRight: 8 }} />
                        <Text strong style={{ fontSize: 13 }}>{Form.useWatch('title', bcForm) || 'Heading'}</Text>
                        <Paragraph style={{ fontSize: 12, margin: '4px 0 0 0', color: '#64748b' }}>
                            {bcPreview || 'Message preview will appear here...'}
                        </Paragraph>
                    </div>
                </Card>

                <Form.Item 
                    name="reason" 
                    label="Operational Justification (Audit Log)" 
                    rules={[{ required: true }]}
                >
                    <TextArea placeholder="Why is this broadcast necessary? (e.g. Traffic disruption reported in Zone A)" rows={2} />
                </Form.Item>
            </Form>
        </Modal>
      </div>
    );
};

