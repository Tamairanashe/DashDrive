import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Select, Input, Button, Avatar, Space, Tag, List, Statistic, Divider, Alert, message, Badge
} from 'antd';
import { 
  SearchOutlined, PhoneOutlined, MessageOutlined, StarOutlined, 
  LeftOutlined, WarningOutlined, StopOutlined, SyncOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const { Title, Text } = Typography;
const { Option } = Select;

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Mock Fleet Data
const MOCK_DRIVERS = [
    { 
        id: 'D-201', name: 'John Makoni', status: 'Busy', service: 'Food Delivery', 
        lat: -17.824858, lng: 31.053028, type: 'Motorcycle', plate: 'AB-123', 
        rating: 4.8, tripsToday: 14, 
        currentTrip: { id: 'ORD-991', pickup: [-17.8200, 31.0500], dropoff: [-17.8300, 31.0600], eta: '12 min' },
        alerts: []
    },
    { 
        id: 'D-202', name: 'Sarah Chipo', status: 'Online', service: 'Ride Hailing', 
        lat: -17.8000, lng: 31.0333, type: 'Car', plate: 'XYZ-987', 
        rating: 4.9, tripsToday: 8, 
        currentTrip: null,
        alerts: []
    },
    { 
        id: 'D-203', name: 'Mike Ndlovu', status: 'Idle', service: 'Mart Delivery', 
        lat: -17.7500, lng: 31.1000, type: 'Van', plate: 'VAN-001', 
        rating: 4.5, tripsToday: 3, 
        currentTrip: null,
        alerts: ['Stopped for 15 mins']
    },
    { 
        id: 'D-204', name: 'Tendai M.', status: 'Offline', service: 'Parcel Delivery', 
        lat: -17.9333, lng: 31.0833, type: 'Truck', plate: 'TRK-99', 
        rating: 4.7, tripsToday: 0, 
        currentTrip: null,
        alerts: []
    },
    { 
        id: 'D-205', name: 'Alex Rivera', status: 'Busy', service: 'Ride Hailing', 
        lat: -17.8105, lng: 31.0450, type: 'Car', plate: 'ABC-444', 
        rating: 4.3, tripsToday: 5, 
        currentTrip: { id: 'RID-112', pickup: [-17.8130, 31.0420], dropoff: [-17.7950, 31.0600], eta: '8 min' },
        alerts: ['Route deviation detected']
    },
];

const MapController = ({ selectedPos }: { selectedPos: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedPos) {
      map.setView(selectedPos, 14, { animate: true });
    }
  }, [selectedPos, map]);
  return null;
};

import { useLocation } from 'react-router-dom';

export const FleetViewPage: React.FC = () => {
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    // If arriving from HeatMap via URL param, eg: /dashboard/fleet?zone=z1
    const params = new URLSearchParams(location.search);
    const zoneId = params.get('zone');
    if (zoneId) {
      // Mock logic: Assuming zone z1 maps to CBD containing D-201 and D-205
      if (zoneId === 'z1') {
         setSearchQuery('CBD'); 
         message.info('Filtered active drivers in CBD Zone');
      } else if (zoneId === 'z2') {
         setSearchQuery('Avondale');
         message.info('Filtered active drivers in Avondale Zone');
      }
    }
  }, [location]);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  // Filter application
  const filteredDrivers = drivers.filter(d => {
      const matchService = serviceFilter === 'ALL' || d.service === serviceFilter;
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      // Advanced mock search: drivername, id, plate, or simulated "zone" via location proximity
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          // Mocking Zone bounding box for the sake of presentation
                          (searchQuery.toLowerCase() === 'cbd' && d.lat === -17.824858) ||
                          (searchQuery.toLowerCase() === 'avondale' && d.lat === -17.8000);
      return matchService && matchStatus && matchSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Online': return '#10b981'; // Green
        case 'Busy': return '#f59e0b'; // Orange
        case 'Idle': return '#3b82f6'; // Blue
        case 'Offline': return '#94a3b8'; // Gray
        case 'Suspended': return '#ef4444'; // Red
        default: return '#94a3b8';
    }
  };

  return (
    <div style={{ paddingBottom: 24, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        
      {/* Header & Fleet Summary */}
      <div style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
                <Title level={4} style={{ margin: 0 }}>Live Fleet Control Center</Title>
                <Text type="secondary">Monitor real-time driver locations, active trips, and fleet health.</Text>
            </Col>
            <Col>
                <Button icon={<SyncOutlined />} onClick={() => message.success('Fleet synced')}>Sync Fleet</Button>
            </Col>
        </Row>

        <Card size="small" bordered={false} className="shadow-sm">
            <Row justify="space-around" align="middle" style={{ textAlign: 'center' }}>
                <Col><Statistic title="Online Drivers" value={312} valueStyle={{ color: '#10b981', fontSize: 20 }}/></Col>
                <Col><Statistic title="Busy Drivers (On Trip)" value={210} valueStyle={{ color: '#f59e0b', fontSize: 20 }}/></Col>
                <Col><Statistic title="Idle Drivers" value={102} valueStyle={{ color: '#3b82f6', fontSize: 20 }}/></Col>
                <Col><Statistic title="Offline Drivers" value={87} valueStyle={{ color: '#94a3b8', fontSize: 20 }}/></Col>
                <Col><Divider type="vertical" style={{ height: 40 }} /></Col>
                <Col><Statistic title="Active Deliveries" value={184} valueStyle={{ fontSize: 20 }}/></Col>
                <Col><Statistic title="Avg Driver ETA" value="6.5 min" valueStyle={{ fontSize: 20 }}/></Col>
                <Col><Statistic title="Acceptance Rate" value="94%" valueStyle={{ fontSize: 20 }}/></Col>
            </Row>
        </Card>
      </div>

      {/* Filters Overlay */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
            <Select value={serviceFilter} onChange={setServiceFilter} style={{ width: 140 }}>
                <Option value="ALL">All Services</Option>
                <Option value="Ride Hailing">Ride Hailing</Option>
                <Option value="Food Delivery">Food Delivery</Option>
                <Option value="Mart Delivery">Mart Delivery</Option>
                <Option value="Parcel Delivery">Parcel Delivery</Option>
            </Select>
        </Col>
        <Col>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 130 }}>
                <Option value="ALL">All Status</Option>
                <Option value="Online">Online</Option>
                <Option value="Busy">Busy (On Trip)</Option>
                <Option value="Idle">Idle</Option>
                <Option value="Offline">Offline</Option>
            </Select>
        </Col>
        <Col flex="auto">
            <Input 
                prefix={<SearchOutlined />} 
                placeholder="Search by Driver Name, ID, or Plate Number..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
        {/* Map Column */}
        <Col span={17} style={{ height: '100%' }}>
            <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0, height: '100%', minHeight: 600, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                    <MapContainer center={[-17.824858, 31.053028]} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                    
                    <MapController selectedPos={selectedDriver ? [selectedDriver.lat, selectedDriver.lng] : null} />

                    {/* Driver Markers */}
                    {filteredDrivers.map(d => (
                        <Marker 
                            key={d.id} 
                            position={[d.lat, d.lng]}
                            icon={L.divIcon({
                                className: 'fleet-marker',
                                html: `
                                    <div style="background: ${getStatusColor(d.status)}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; transform: ${selectedDriverId === d.id ? 'scale(1.3)' : 'scale(1)'}; transition: transform 0.2s;">
                                        ${d.alerts.length > 0 ? '<div style="position: absolute; top: -4px; right: -4px; background: #ef4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>' : ''}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                                    </div>
                                `,
                                iconSize: [28, 28],
                                iconAnchor: [14, 14]
                            })}
                            eventHandlers={{ click: () => setSelectedDriverId(d.id) }}
                        >
                            <Popup>
                                <strong>{d.name}</strong><br/>
                                Plate: {d.plate}<br/>
                                <Tag color={getStatusColor(d.status)} style={{ marginTop: 4 }}>{d.status}</Tag>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Trip Lines & Points for Selected Driver */}
                    {selectedDriver?.currentTrip && (
                        <>
                            <Polyline 
                                positions={[[selectedDriver.lat, selectedDriver.lng], selectedDriver.currentTrip.pickup as [number, number], selectedDriver.currentTrip.dropoff as [number, number]]} 
                                color="#3b82f6" weight={3} dashArray="8, 8" 
                            />
                            <Marker position={selectedDriver.currentTrip.pickup as [number, number]} icon={L.divIcon({ className: '', html: '<div style="width:14px;height:14px;background:white;border:3px solid black;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.3)"></div>', iconSize:[14,14], iconAnchor:[7,7] })} />
                            <Marker position={selectedDriver.currentTrip.dropoff as [number, number]} icon={L.divIcon({ className: '', html: '<div style="width:14px;height:14px;background:white;border:3px solid #ef4444;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.3)"></div>', iconSize:[14,14], iconAnchor:[7,7] })} />
                        </>
                    )}
                </MapContainer>
                </div>
                
                {/* Overlay Legend */}
                <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'white', padding: '8px 12px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Text strong style={{ display: 'block', fontSize: 12, marginBottom: 8 }}>Legend</Text>
                    <Space size={16}>
                        <Space size={4}><div style={{ width:10, height:10, borderRadius:'50%', background:'#10b981' }} /><Text style={{ fontSize:11 }}>Online</Text></Space>
                        <Space size={4}><div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }} /><Text style={{ fontSize:11 }}>Busy</Text></Space>
                        <Space size={4}><div style={{ width:10, height:10, borderRadius:'50%', background:'#3b82f6' }} /><Text style={{ fontSize:11 }}>Idle</Text></Space>
                        <Space size={4}><div style={{ width:10, height:10, borderRadius:'50%', background:'#94a3b8' }} /><Text style={{ fontSize:11 }}>Offline</Text></Space>
                    </Space>
                </div>
            </Card>
        </Col>

        {/* Info Column */}
        <Col span={7} style={{ height: '100%' }}>
            {!selectedDriver ? (
                <Card title="Active Fleet Alerts" bordered={false} className="shadow-sm" style={{ height: '100%', overflowY: 'auto' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {drivers.filter(d => d.alerts.length > 0).map(d => (
                            <Alert 
                                key={d.id}
                                message={`${d.name} (${d.id})`}
                                description={d.alerts[0]}
                                type="error"
                                showIcon
                                action={<Button size="small" onClick={() => setSelectedDriverId(d.id)}>View</Button>}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                        {drivers.filter(d => d.alerts.length === 0).length === drivers.length && (
                            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 32 }}>No active fleet alerts.</Text>
                        )}
                        <Divider />
                        <Title level={5}>Fleet Optimization</Title>
                        <Button block onClick={() => message.info('Rebalancing drivers...')}>Rebalance Supply</Button>
                        <Button block type="dashed" onClick={() => message.success('Bonuses launched')}>Launch Hotzone Bonuses</Button>
                    </Space>
                </Card>
            ) : (
                <Card bordered={false} className="shadow-sm" style={{ height: '100%', overflowY: 'auto' }}
                    title={<Space><Button type="text" icon={<LeftOutlined />} onClick={() => setSelectedDriverId(null)} /> Driver Details</Space>}
                >
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <Avatar size={64} src={`https://picsum.photos/seed/${selectedDriver.id}/100/100`} style={{ marginBottom: 8 }} />
                        <Title level={5} style={{ margin: 0 }}>{selectedDriver.name}</Title>
                        <Text type="secondary">{selectedDriver.id} • {selectedDriver.service}</Text>
                        <div style={{ marginTop: 8 }}>
                            <Tag color={getStatusColor(selectedDriver.status)}>{selectedDriver.status.toUpperCase()}</Tag>
                            <Tag icon={<StarOutlined />} color="gold">{selectedDriver.rating}</Tag>
                        </div>
                    </div>

                    <Divider />

                    <Row gutter={[0, 16]}>
                        <Col span={12}><Text type="secondary">Vehicle</Text><br/><strong>{selectedDriver.type}</strong></Col>
                        <Col span={12}><Text type="secondary">Plate</Text><br/><strong>{selectedDriver.plate}</strong></Col>
                        <Col span={12}><Text type="secondary">Trips Today</Text><br/><strong>{selectedDriver.tripsToday}</strong></Col>
                    </Row>

                    {selectedDriver.alerts.length > 0 && (
                        <Alert 
                            message="Driver Flagged" 
                            description={selectedDriver.alerts[0]} 
                            type="error" 
                            showIcon 
                            style={{ marginTop: 16 }} 
                        />
                    )}

                    {selectedDriver.currentTrip && (
                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginTop: 16 }}>
                            <Title level={5} style={{ fontSize: 13, marginBottom: 12 }}>Active Trip Monitor</Title>
                            <Space align="start" style={{ width: '100%' }}>
                                <div style={{ paddingTop: 4 }}>
                                    <div style={{ width:8, height:8, background:'black', borderRadius:'50%', margin:'0 auto' }} />
                                    <div style={{ width:2, height:16, background:'#cbd5e1', margin:'4px auto' }} />
                                    <div style={{ width:8, height:8, background:'#ef4444', borderRadius:'50%', margin:'0 auto' }} />
                                </div>
                                <Space direction="vertical" size={2} style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12 }}>Pickup (Arrived)</Text>
                                    <Text style={{ fontSize: 10 }} type="secondary">{selectedDriver.currentTrip.pickup.join(', ')}</Text>
                                    <div style={{ height: 4 }} />
                                    <Text style={{ fontSize: 12 }}>Dropoff (In Transit)</Text>
                                    <Text style={{ fontSize: 10 }} type="secondary">{selectedDriver.currentTrip.dropoff.join(', ')}</Text>
                                </Space>
                            </Space>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row justify="space-between">
                                <Text type="secondary" style={{ fontSize: 12 }}>Driver ETA</Text>
                                <Text strong style={{ color: '#10b981' }}>{selectedDriver.currentTrip.eta}</Text>
                            </Row>
                        </div>
                    )}

                    <Divider />

                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Row gutter={8}>
                            <Col span={12}><Button block icon={<PhoneOutlined />}>Call</Button></Col>
                            <Col span={12}><Button block icon={<MessageOutlined />}>Message</Button></Col>
                        </Row>
                        {selectedDriver.currentTrip && <Button block type="dashed">Reassign Delivery</Button>}
                        <Button block type="text" danger icon={<StopOutlined />}>Suspend Driver</Button>
                    </Space>
                </Card>
            )}
        </Col>
      </Row>
    </div>
  );
};
