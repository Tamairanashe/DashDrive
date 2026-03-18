import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Space, Statistic, Tabs, 
  Table, Tag, Button, Badge, Divider, List, Avatar,
  Progress, Segmented, Select, Input, DatePicker,
  message, Empty, Alert, Tooltip, Dropdown, MenuProps,
  Form, Drawer, Switch, InputNumber, Descriptions
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
  InfoCircleOutlined, CompassOutlined, BorderOutlined, ApartmentOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, LineChart, Line,
  Legend
} from 'recharts';
import { BaseMap } from '../components/BaseMap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text, Paragraph } = Typography;

// --- Interfaces ---

interface Zone {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  type: 'Polygon' | 'Circle' | 'Triangle';
  points: [number, number][];
  radius?: number;
  volume: string;
  extraFare: boolean;
  farePercent?: number;
}

interface ZoneLog {
  id: string;
  zoneId: string;
  zoneName: string;
  action: 'Created' | 'Updated' | 'Status Toggled' | 'Deleted';
  details: string;
  timestamp: string;
  user: string;
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
        route: [[-17.8200, 31.0500], [-17.8210, 31.0510], [-17.8220, 31.0520], [-17.8300, 31.0600]],
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
        route: [[-17.8000, 31.0333], [-17.8050, 31.0400], [-17.7500, 31.1000]],
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
  { id: '1', name: 'Harare CBD', type: 'Polygon', volume: 'High', extraFare: true, status: 'Active', points: [[-17.8216, 31.0404], [-17.8256, 31.0504], [-17.8156, 31.0554], [-17.8106, 31.0454]], farePercent: 20 },
  { id: '2', name: 'Avondale', type: 'Polygon', volume: 'Medium', extraFare: false, status: 'Active', points: [[-17.8025, 31.0378], [-17.8085, 31.0478], [-17.7985, 31.0528], [-17.7925, 31.0428]] },
];

const INITIAL_LOGS: ZoneLog[] = [
  { id: 'L-1', zoneId: '1', zoneName: 'Harare CBD', action: 'Created', details: 'Initial system setup', timestamp: '2024-03-10 09:00', user: 'Admin' },
  { id: 'L-2', zoneId: '2', zoneName: 'Avondale', action: 'Status Toggled', details: 'Zone activated for weekend surge', timestamp: '2024-03-12 14:30', user: 'Ops_Lead' },
];

const KpiData = [
  { title: 'Active Trips', value: 1245, suffix: '', priority: 'success', icon: <RocketOutlined /> },
  { title: 'Active Deliveries', value: 890, suffix: '', priority: 'processing', icon: <ShopOutlined /> },
  { title: 'Waiting for Driver', value: 45, suffix: 'orders', priority: 'warning', icon: <ClockCircleOutlined /> },
  { title: 'Available Drivers', value: 620, suffix: '', priority: 'success', icon: <CarOutlined /> },
];

const secondaryKpiData = [
  { title: 'Avg Pickup Time', value: 4.2, suffix: 'min', trend: 'down', trendValue: '0.5' },
  { title: 'Cancellation Rate', value: 2.1, suffix: '%', trend: 'up', trendValue: '0.2' },
  { title: 'Delayed Orders', value: 12, suffix: '', trend: 'down', trendValue: '4' },
];

const MOCK_ALERTS = [
  { id: 'AL-001', type: 'Dispatch Failure', service: 'Ride', severity: 'High', status: 'Open', time: '2 mins ago', info: 'No drivers accepted order ORD-991' },
  { id: 'AL-002', type: 'Trip Delayed', service: 'Food', severity: 'Medium', status: 'Open', time: '5 mins ago', info: 'Courier Stationary for 10 mins near CBD' },
];

const MapEvents = ({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => onMapClick([e.latlng.lat, e.latlng.lng]),
  });
  return null;
};

const MapFitter = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [bounds, map]);
    return null;
};


const driverIcon = new L.DivIcon({
  className: 'driver-marker',
  html: `<div style="width: 24px; height: 24px; background: #fff; border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const customerIcon = new L.DivIcon({
    className: 'customer-marker',
    html: `<div style="width: 20px; height: 20px; background: #fff; border: 2px solid #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
           </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const pickupIcon = new L.DivIcon({
    className: 'pickup-marker',
    html: `<div style="width: 18px; height: 18px; background: #0f172a; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

const dropoffIcon = new L.DivIcon({
    className: 'dropoff-marker',
    html: `<div style="width: 18px; height: 18px; background: #ef4444; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

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
    onToggleDispatch: () => void
}> = ({ onViewAll, filter, onFilterChange, alerts, onFix, isManualDispatch, onToggleDispatch }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleLiveSync = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
        message.loading({ content: 'Synchronizing with platform mobility stream...', key: 'map-sync' });
        setTimeout(() => message.success({ content: 'Network data synchronized.', key: 'map-sync' }), 1200);
    };

    return (
      <div style={{ marginTop: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={16}>
              {KpiData.map((kpi, idx) => (
                <Col key={idx} xs={24} sm={12} lg={6}>
                  <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                    <Statistic 
                      title={<Space><span style={{ color: '#64748b' }}>{kpi.icon}</span> {kpi.title}</Space>}
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
                  <Segmented 
                    options={['All', 'Rides', 'Deliveries', 'Customers']} 
                    size="small" 
                    value={filter}
                    onChange={(val) => onFilterChange(val as string)}
                  />
                  <Button icon={<SyncOutlined spin={isRefreshing} />} size="small" onClick={handleLiveSync}>Live</Button>
                </Space>
              }
              styles={{ body: { padding: 0, height: 450, position: 'relative' } }}
              style={{ borderRadius: 16, overflow: 'hidden' }}
            >
               <BaseMap center={[-17.824858, 31.053028]} zoom={13} height="100%">
                  {(filter === 'All' || filter === 'Rides') && (
                    <>
                        <Marker position={[-17.824858, 31.053028]} icon={driverIcon} />
                        <Marker position={[-17.8100, 31.0400]} icon={driverIcon} />
                    </>
                  )}
                  
                  {(filter === 'All' || filter === 'Deliveries') && (
                    <Marker position={[-17.8300, 31.0600]} icon={driverIcon} />
                  )}

                  {(filter === 'All' || filter === 'Customers') && (
                    <>
                        <Marker position={[-17.8200, 31.0600]} icon={customerIcon} />
                        <Marker position={[-17.8150, 31.0450]} icon={customerIcon} />
                    </>
                  )}

                  <Circle center={[-17.824858, 31.053028]} radius={500} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }} />
               </BaseMap>
               
               {/* Map Overlays */}
               <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
                  <Card size="small" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                     <Space direction="vertical" size="small">
                        <Badge status="success" text={`Available (${filter === 'Customers' ? '0' : '620'})`} />
                        <Badge status="processing" text={`On Trip (${filter === 'Customers' ? '0' : '1,245'})`} />
                        {filter === 'Customers' && <Badge color="blue" text="Active Customers (2,450)" />}
                        <Badge status="error" text="Incidents (5)" />
                     </Space>
                  </Card>
               </div>
            </Card>
          </Col>

          {/* Sidebar: Performance & Alerts */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card 
                title={<Space><LineChartOutlined /> Operational Health</Space>} 
                variant="borderless" 
                className="shadow-sm"
                size="small"
              >
                <List
                  dataSource={secondaryKpiData}
                  renderItem={item => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%' }}>
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
                    </List.Item>
                  )}
                />
              </Card>

              <Card 
                title={<Space><BellOutlined /> Critical Alerts</Space>} 
                extra={<Button type="link" size="small" onClick={onViewAll}>View All</Button>}
                variant="borderless" 
                className="shadow-sm"
                size="small"
              >
                  <List
                    dataSource={alerts}
                    renderItem={item => (
                      <List.Item style={{ padding: '8px 0', border: 'none' }}>
                        <Alert
                          title={<Space><Text strong style={{ fontSize: 12 }}>{item.type}</Text> <Tag color={item.severity === 'High' ? 'error' : 'warning'} style={{ fontSize: 10 }}>{item.severity}</Tag></Space>}
                          description={<div style={{ fontSize: 11 }}>{item.info || item.detail} <br/> <Text type="secondary">{item.time}</Text></div>}
                          type={item.severity === 'High' ? 'error' : 'warning'}
                          showIcon
                          style={{ width: '100%' }}
                          action={<Button size="small" type="link" onClick={() => onFix(item.id)}>Fix</Button>}
                        />
                      </List.Item>
                    )}
                  />
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

const RenderZoneSetup: React.FC<{ onLocate: (points: [number, number][]) => void, mapBounds: any }> = ({ onLocate, mapBounds }) => {
    const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
    const [trashedZones, setTrashedZones] = useState<Zone[]>([]);
    const [logs, setLogs] = useState<ZoneLog[]>(INITIAL_LOGS);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Zone | null>(null);
    const [form] = Form.useForm();
    const [isRefreshing, setIsRefreshing] = useState(false);
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

    const handleDeleteZone = (zone: Zone) => {
        setZones(prev => prev.filter(z => z.id !== zone.id));
        setTrashedZones(prev => [zone, ...prev]);
        addLog(zone, 'Deleted', 'Zone moved to Recycle Bin');
        message.success(`Zone ${zone.name} moved to Trash`);
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
        title: 'Zone Name', 
        dataIndex: 'name', 
        key: 'name', 
        ellipsis: true,
        render: (text: string) => <Text strong>{text}</Text> 
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
                items: [{ key: 'delete', label: 'Delete', danger: true, onClick: () => handleDeleteZone(record) }]
              }}
              trigger={['click']}
            >
              <Button type="text" size="small" icon={<DeleteOutlined style={{ fontSize: 14 }} />} danger />
            </Dropdown>
          </Space>
        ),
      },
    ];

    const handleMapClick = (latlng: [number, number]) => {
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
            radius: (drawingPoints.length > 0 && drawingMode === 'Circle') ? 
                L.latLng(drawingPoints[0]).distanceTo(L.latLng(drawingPoints[1])) : 
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
          radius: drawingMode === 'Circle' ? L.latLng(drawingPoints[0]).distanceTo(L.latLng(drawingPoints[1])) : undefined,
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
              >
                <MapEvents onMapClick={handleMapClick} />
                <MapFitter bounds={mapBounds} />
                
                {zones.map(zone => (
                  zone.type === 'Circle' ? (
                    <Circle
                      key={zone.id}
                      center={zone.points[0]}
                      radius={zone.radius || 500}
                      pathOptions={{ color: zone.status === 'Active' ? '#10b981' : '#94a3b8', fillOpacity: 0.2 }}
                    >
                      <Popup>
                        <Text strong>{zone.name}</Text><br/>
                        <Text type="secondary">Type: Circle</Text>
                      </Popup>
                    </Circle>
                  ) : (
                    <Polygon 
                      key={zone.id} 
                      positions={zone.points} 
                      pathOptions={{ color: zone.status === 'Active' ? '#10b981' : '#94a3b8', fillOpacity: 0.2 }} 
                    >
                      <Popup>
                        <Text strong>{zone.name}</Text><br/>
                        <Text type="secondary">Type: {zone.type || 'Polygon'}</Text>
                      </Popup>
                    </Polygon>
                  )
                ))}

                {drawingPoints.length > 0 && (
                  drawingMode === 'Circle' ? (
                    drawingPoints.length > 1 ? (
                      <Circle 
                        center={drawingPoints[0]} 
                        radius={L.latLng(drawingPoints[0]).distanceTo(L.latLng(drawingPoints[1]))} 
                        pathOptions={{ color: '#3b82f6', dashArray: '5, 10' }} 
                      />
                    ) : (
                      <Marker position={drawingPoints[0]} />
                    )
                  ) : (
                    <Polygon 
                      positions={drawingPoints} 
                      pathOptions={{ color: '#3b82f6', dashArray: '5, 10' }} 
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
                <Space direction="vertical">
                  <Button icon={<RocketOutlined />} shape="circle" className="shadow-sm" />
                  <Button icon={<EnvironmentOutlined />} shape="circle" className="shadow-sm" />
                </Space>
              </div>
            </Card>
            
            <Card title={<Space><InfoCircleOutlined style={{ color: '#10b981' }} /> Drawing Modes</Space>} variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginTop: 16 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
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
                <Space direction="vertical" style={{ width: '100%' }} size="small">
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
          <List
            dataSource={logs}
            renderItem={log => (
              <List.Item>
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
              </List.Item>
            )}
          />
        </Drawer>

        <Drawer
          title={<Space><RestOutlined style={{ color: '#ef4444' }} /> Manage Trashed Zones</Space>}
          open={isTrashModalOpen}
          onClose={() => setIsTrashModalOpen(false)}
          width={500}
          className="premium-drawer"
        >
          {trashedZones.length === 0 ? (
            <Empty description="No trashed zones found" style={{ marginTop: 100 }} />
          ) : (
            <List
              dataSource={trashedZones}
              renderItem={z => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<RollbackOutlined />} onClick={() => handleRestoreZone(z)}>Restore</Button>,
                    <Button type="link" danger icon={<DeleteFilled />} onClick={() => handlePermanentDelete(z)}>Erase</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={<Text strong>{z.name}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 11 }}>ID: {z.id} â€¢ Points: {z.points.length}</Text>}
                  />
                </List.Item>
              )}
            />
          )}
        </Drawer>
      </div>
    );
};

const RenderDispatchManagement: React.FC = () => {
    const [queue, setQueue] = useState([
      { id: 'ORD-1021', type: 'Ride', customer: 'Alice J.', zone: 'Harare CBD', waitTime: '02:15', status: 'Waiting', priority: 'Normal' },
      { id: 'ORD-1022', type: 'Food', customer: 'Bob S.', zone: 'Avondale', waitTime: '01:45', status: 'Assigning', priority: 'High' },
      { id: 'ORD-1023', type: 'Mart', customer: 'Charlie R.', zone: 'Harare CBD', waitTime: '00:30', status: 'Waiting', priority: 'VIP' },
    ]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isEnabled, setIsEnabled] = useState(true);

    const queueColumns = [
      { 
        title: 'Order ID', 
        dataIndex: 'id', 
        key: 'id', 
        render: (text: string, record: any) => (
          <Space>
              <Text strong>{text}</Text>
              {record.priority === 'VIP' && <Tag color="gold" style={{ margin: 0 }}>VIP</Tag>}
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
                        <Text type="secondary" style={{ fontSize: 13 }}>Initial Search Radius</Text>
                        <Progress percent={60} strokeColor="#00b894" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text style={{ fontSize: 12 }}>Current: 5km</Text>
                          <Button type="link" size="small">Modify</Button>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>Response Timeout</Text>
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
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
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
                    
                    <Button block type="primary" style={{ background: '#00b894', border: 'none' }}>
                      Force Manual Assign
                    </Button>
                    <Button block danger type="dashed">Cancel Assignment</Button>
                  </Space>
                )
              }
             </Card>
          </Col>
        </Row>
      </div>
    );
};

const RenderLiveTracking: React.FC = () => {
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

    const bounds: L.LatLngBoundsExpression | null = activeTrip ? [
        [activeTrip.merchant?.lat || activeTrip.pickup?.lat, activeTrip.merchant?.lng || activeTrip.pickup?.lng],
        [activeTrip.dropoff.lat, activeTrip.dropoff.lng],
        [activeTrip.driver.lat, activeTrip.driver.lng]
    ] : MOCK_TRIPS.map(t => [t.driver.lat, t.driver.lng]);

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
               <Divider type="vertical" />
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
                  <MapContainer 
                    center={[-17.8248, 31.0530]} 
                    zoom={13} 
                    zoomControl={false} 
                    style={{ height: '100%', width: '100%', minHeight: 600 }}
                  >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                      <MapFitter bounds={bounds} />
                      
                      {activeTrip ? (
                          <>
                              <Marker position={[activeTrip.driver.lat, activeTrip.driver.lng]} icon={driverIcon} />
                              {(activeTrip.merchant || activeTrip.pickup) && (
                                  <Marker position={[activeTrip.merchant?.lat || activeTrip.pickup?.lat, activeTrip.merchant?.lng || activeTrip.pickup?.lng]} icon={pickupIcon} />
                              )}
                              <Marker position={[activeTrip.dropoff.lat, activeTrip.dropoff.lng]} icon={dropoffIcon} />
                              <Polyline positions={activeTrip.route} color="#0f172a" weight={4} opacity={0.6} dashArray="10, 10" />
                          </>
                      ) : (
                          MOCK_TRIPS.map(trip => (
                              <Marker key={trip.id} position={[trip.driver.lat, trip.driver.lng]} icon={driverIcon} eventHandlers={{ click: () => setActiveTrip(trip) }}>
                                  <Popup>
                                      <Text strong>{trip.id}</Text><br/>
                                      <Text type="secondary">{trip.driver.name}</Text>
                                  </Popup>
                              </Marker>
                          ))
                      )}
                  </MapContainer>

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
                 <Space direction="vertical" style={{ width: '100%' }}>
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
                       <Title level={5}>Intervention</Title>
                       <Space direction="vertical" style={{ width: '100%' }}>
                          <Button block icon={<PhoneOutlined />}>Call Operator</Button>
                          <Button block type="primary" danger style={{ background: '#ef4444', border: 'none' }}>Reassign Driver</Button>
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
             <Title level={5} style={{ margin: 0 }}>Active Operational Alerts</Title>
             <Space>
                <Select defaultValue="all" size="small" options={[{value: 'all', label: 'All Severities'}]} />
                <Button size="small" icon={<FilterOutlined />}>Filter</Button>
             </Space>
          </div>
          <Table 
            columns={columns} 
            dataSource={alerts} 
            rowKey="id"
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
    onOverride: (id: string) => void,
    onApplyRec: () => void 
}> = ({ zones, onOverride, onApplyRec }) => {
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
                  <MapContainer center={[-17.8248, 31.0530]} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                      {zones.map(dz => (
                          <Circle 
                            key={dz.id}
                            center={[dz.coords[0], dz.coords[1]]} 
                            radius={dz.radius}
                            pathOptions={{ 
                                color: dz.demand === 'Extreme' ? '#ef4444' : '#f59e0b', 
                                fillColor: dz.demand === 'Extreme' ? '#ef4444' : '#f59e0b', 
                                fillOpacity: 0.3 
                            }} 
                          >
                             <Popup>
                                <Text strong>{dz.name}</Text><br/>
                                <Text>Demand: {dz.demand}</Text><br/>
                                <Text type="danger">Multiplier: {dz.currentMulti}x</Text>
                             </Popup>
                          </Circle>
                      ))}
                  </MapContainer>
                  
                  <div style={{ position: 'absolute', top: 70, right: 20, zIndex: 1000 }}>
                    <Card size="small" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                       <Space direction="vertical" size="small">
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

                    <List
                      dataSource={zones}
                      renderItem={item => (
                        <List.Item>
                           <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <Text strong>{item.name}</Text>
                                 <Tag color={item.demand === 'Extreme' ? 'error' : 'warning'}>{item.currentMulti}x</Tag>
                              </div>
                              <Text type="secondary" style={{ fontSize: 11 }}>Calculated based on live platform demand pings</Text>
                              <div style={{ marginTop: 8 }}>
                                 <Button block size="small" onClick={() => onOverride(item.id)}>Override Multiplier</Button>
                              </div>
                           </div>
                        </List.Item>
                      )}
                    />
                 </Card>

                 <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16, background: '#f8fafc' }}>
                    <Title level={5} style={{ fontSize: 14 }}>System Recommendation</Title>
                    <Paragraph style={{ fontSize: 12 }}>
                       Enable +0.2x surge in <b>Mt Pleasant</b> to attract drivers from neighboring zones.
                    </Paragraph>
                    <Button type="primary" size="small" onClick={onApplyRec} style={{ background: '#00b894', border: 'none' }}>Apply Now</Button>
                 </Card>
              </Space>
           </Col>
        </Row>
      </div>
    );
};

const RenderOperationsAnalytics: React.FC = () => {
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
                       <div style={{ height: 250 }}>
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
    const [activeTab, setActiveTab] = useState(propInitialTab);
    const [hubMapFilter, setHubMapFilter] = useState('All');
    const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
    const [alerts, setAlerts] = useState([
        { id: 'AL-101', type: 'Driver Unresponsive', severity: 'High', service: 'Ride', location: 'Harare CBD', time: '10:45 AM', driver: 'Alex T.', detail: 'Driver assigned to RID-1055 but has not moved for 5 minutes.' },
        { id: 'AL-102', type: 'Delay in Pickup', severity: 'Medium', service: 'Food', location: 'Avondale', time: '10:50 AM', driver: 'Mike N.', detail: 'Pickup time exceeded by 8 minutes at Pizza Hub.' },
        { id: 'AL-103', type: 'Dispatch Failure', severity: 'High', service: 'Ride', location: 'CBD', time: '10:55 AM', info: 'No drivers accepted order ORD-991' },
    ]);
    const [isManualDispatch, setIsManualDispatch] = useState(false);
    const [demandZones, setDemandZones] = useState([
      { id: 'D-1', name: 'CBD North', demand: 'Extreme', currentMulti: 1.8, coords: [-17.8200, 31.0510], radius: 600 },
      { id: 'D-2', name: 'Avondale Shops', demand: 'High', currentMulti: 1.4, coords: [-17.8050, 31.0400], radius: 400 },
    ]);

    const handleLocateZone = (points: [number, number][]) => {
        if (!points || points.length === 0) return;
        const bounds = L.latLngBounds(points);
        setMapBounds(bounds);
        message.info('Map centered on selected zone.');
    };

    const handleFixAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        message.success('Operational incident resolved and logged.');
    };

    const handleOverrideSurge = (id: string) => {
        setDemandZones(prev => prev.map(z => 
            z.id === id ? { ...z, currentMulti: parseFloat((z.currentMulti + 0.1).toFixed(1)) } : z
        ));
        message.info('Surge multiplier adjusted for tactical zone.');
    };

    const handleApplyRecommendation = () => {
        setDemandZones(prev => [
            ...prev,
            { id: `D-${Date.now()}`, name: 'Mt Pleasant', demand: 'Medium', currentMulti: 1.2, coords: [-17.7800, 31.0500], radius: 500 }
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
                  />
      },
       {
        key: '2',
        label: <Space><EnvironmentOutlined /> Zone Setup</Space>,
        children: <RenderZoneSetup onLocate={handleLocateZone} mapBounds={mapBounds} />
      },
      {
        key: '3',
        label: <Space><RadarChartOutlined /> Dispatch Management</Space>,
        children: <RenderDispatchManagement />
      },
      {
        key: '4',
        label: <Space><RocketOutlined /> Live Tracking</Space>,
        children: <RenderLiveTracking />
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
                  />
      },
      {
        key: '8',
        label: <Space><LineChartOutlined /> Analytics</Space>,
        children: <RenderOperationsAnalytics />
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
                  <Divider type="vertical" style={{ height: 40 }} />
                  <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 8, background: '#00b894', border: 'none' }}>
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
      </div>
    );
};
