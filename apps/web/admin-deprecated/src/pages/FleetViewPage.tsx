import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Select, Input, Button, Avatar, Space, Tag, List, Statistic, Divider, Alert, Badge, Switch, Drawer, Tabs, Table, Progress, Modal, App, Flex
} from 'antd';
import { 
    SearchOutlined, PhoneOutlined, MessageOutlined, StarOutlined, 
    LeftOutlined, WarningOutlined, StopOutlined, SyncOutlined, 
    EnvironmentOutlined, CarOutlined, AppstoreOutlined, TeamOutlined,
    GlobalOutlined, SafetyOutlined, InfoCircleOutlined, ThunderboltOutlined,
    AimOutlined, ArrowUpOutlined, AudioOutlined, SettingOutlined, HistoryOutlined, WalletOutlined, StarFilled,
    RetweetOutlined
} from '@ant-design/icons';
import { MarkerF, InfoWindowF, PolylineF, CircleF, OverlayViewF, OverlayView } from '@react-google-maps/api';
import { BaseMap, useBaseMap } from '../components/BaseMap';
import carMarker from '../assets/car-marker-topview.png';
import carMarkerHandicap from '../assets/car-marker-WAV.png';
import { useSocket } from '../context/SocketContext';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Location Data with Coordinates
const LOCATION_COORDS: any = {
  'Harare': { lat: -17.8248, lng: 31.0530 },
  'Bulawayo': { lat: -20.1465, lng: 28.5833 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 }
};

const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare'], 'Matabeleland': ['Bulawayo'] } },
  'United Kingdom': { regions: { 'Greater London': ['London'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } }
};

interface Driver {
    id: string;
    name: string;
    status: string;
    service: string;
    lat: number;
    lng: number;
    type: string;
    plate: string;
    rating: number;
    tripsToday: number;
    currentTrip: { id: string; pickup: {lat: number, lng: number}; dropoff: {lat: number, lng: number}; eta: string; } | null;
    alerts: string[];
    phone: string;
    email: string;
    lastSeen: string;
    joinDate: string;
    level: string;
    earningsPerDay: number;
    posReviewRate: number;
    successRate: number;
    cancellationRate: number;
    idleHourRate: number;
    heading: number;
    wallet: {
        pending: number;
        withdrawn: number;
        withdrawable: number;
        total: number;
    };
    vehicle: {
        brand: string;
        model: string;
        category: string;
        ownerType: string;
        vin: string;
        fuelType: string;
        engine: string;
        seats: number;
        transmission: string;
        capacity: number;
        expiry: string;
        docs: string[];
    };
}

interface Customer {
    id: string;
    lat: number;
    lng: number;
    name: string;
    rating: number;
    trips: number;
    loyalty: string;
    behavior: string;
    activeRequests: string[];
    topVertical: string;
    phone: string;
    email: string;
    joinDate: string;
    status: string;
    totalSpend: number;
    walletBalance: number;
    preferredVertical: string;
    lastOrderDate: string;
}

// Legacy Mock Data removed in favor of live Supabase telemetry
// States are now populated via useSocket('fleetUpdate')

const MOCK_TRIPS = [
    { id: '100011', date: '20 Nov 2023, 05:40 pm', customer: 'Test User', driver: 'Devid Jack', baseCost: 50.9, delay: 0, idle: 0, cancel: 20, tax: 7.09, total: 77.99, comm: 21.27, status: 'Cancelled', payment: 'Paid' },
    { id: '100010', date: '20 Nov 2023, 05:38 pm', customer: 'Test User', driver: 'Devid Jack', baseCost: 253.4, delay: 0, idle: 0, cancel: 0, tax: 25.34, total: 278.74, comm: 76.02, status: 'Completed', payment: 'Paid' },
    { id: '100009', date: '20 Nov 2023, 05:31 pm', customer: 'Test User', driver: 'Devid Jack', baseCost: 59.6, delay: 0, idle: 0, cancel: 0, tax: 5.96, total: 65.56, comm: 17.88, status: 'Completed', payment: 'Paid' },
];

const MOCK_TRANSACTIONS = [
    { id: '35ced7da-5056-434b-b2f6-ee7a0119d426', type: 'Received balance', amount: 56.72, balance: 466.48, date: '21 Nov 2023' },
    { id: '567fd428-e298-4354-a14b-eaa3f389fb28', type: 'Payable balance', amount: 21.27, balance: 174.93, date: '21 Nov 2023' },
];

const MapController = ({ selectedPos, selectedCity }: { selectedPos: {lat: number, lng: number} | null, selectedCity: string }) => {
  const { map } = useBaseMap();
  useEffect(() => {
    if (map) {
      if (selectedPos) {
        map.panTo(selectedPos);
        map.setZoom(16);
      } else if (selectedCity && LOCATION_COORDS[selectedCity]) {
        const coords = LOCATION_COORDS[selectedCity];
        map.panTo({ lat: coords.lat, lng: coords.lng });
        map.setZoom(13);
      }
    }
  }, [selectedPos, selectedCity, map]);
  return null;
};



export const FleetViewPage: React.FC = () => {
    const { message, notification, modal } = App.useApp();
    const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
    const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
    const [selectedCity, setSelectedCity] = useState('Harare');
    const { socket, isConnected } = useSocket();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [activeTrips, setActiveTrips] = useState<any[]>([]);
    const [demandPoints, setDemandPoints] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [fleetStats, setFleetStats] = useState<any>({ available: 0, busy: 0, offline: 0 });

    useEffect(() => {
        if (!socket) return;

        socket.on('fleetUpdate', (data: { drivers: any[], activeTrips: any[], demandPoints: any[], customers: any[], stats: any }) => {
            if (!data || !data.drivers) return;
            
            // Map Supabase status to UI display status with full interface compliance
            const mappedDrivers = data.drivers.map(d => ({
                id: d.id,
                name: d.name,
                lat: d.latitude,
                lng: d.longitude,
                status: d.status === 'online' ? 'Available' : 
                        d.status === 'busy' ? 'On Trip' : 'Offline',
                service: d.service || 'Ride Hailing',
                type: d.type || (['Car', 'Motorcycle', 'Van'][Math.floor(Math.random() * 3)]),
                plate: d.plate || `ZE-${Math.floor(Math.random() * 900) + 100}-ZW`,
                heading: d.heading || 0,
                rating: Number(d.rating || (4.5 + Math.random() * 0.5).toFixed(1)),
                tripsToday: d.tripsToday || 0,
                alerts: d.alerts || [],
                phone: d.phone || '+263 771 000 000',
                email: d.email || `${d.name?.toLowerCase().replace(' ', '.')}@dashdrive.com`,
                lastSeen: 'Live',
                joinDate: d.joinDate ? new Date(d.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Jan 2024',
                level: d.level || 'Partner',
                earningsPerDay: d.earningsPerDay || 0,
                posReviewRate: d.posReviewRate || 100,
                successRate: d.successRate || 100,
                cancellationRate: d.cancellationRate || 0,
                idleHourRate: d.idleHourRate || 0,
                currentTrip: d.currentTrip || null,
                wallet: d.wallet || { pending: 0, withdrawn: 0, withdrawable: 0, total: 0 },
                vehicle: d.vehicle || {
                    brand: 'Generic', model: 'Standard', category: 'Economy', ownerType: 'Owner',
                    vin: 'N/A', fuelType: 'Petrol', engine: '1500cc', seats: 4,
                    transmission: 'Auto', capacity: 4, expiry: '2025-12-31', docs: []
                }
            }));
            setDrivers(mappedDrivers);
            if (data.stats) setFleetStats(data.stats);
            if (data.activeTrips) setActiveTrips(data.activeTrips);
            if (data.demandPoints) setDemandPoints(data.demandPoints);
            if (data.customers) {
                // Map live users to the Customer interface
                const mappedCustomers = data.customers.map((u: any) => ({
                    id: u.id,
                    lat: -17.82 + (Math.random() - 0.5) * 0.1, // Jitter for demo if no live pos
                    lng: 31.05 + (Math.random() - 0.5) * 0.1,
                    name: u.full_name || 'Anonymous User',
                    rating: 5.0,
                    trips: Math.floor(Math.random() * 50),
                    loyalty: 'Gold',
                    behavior: 'Frequent Rider',
                    activeRequests: [],
                    phone: u.email,
                    status: 'Active'
                }));
                setCustomers(mappedCustomers);
            }
        });

        // Local Motion Simulation Jitter (to make it feel 'Live' between syncs)
        const motionInterval = setInterval(() => {
            setDrivers(prev => prev.map(d => {
                if (d.status === 'Available') {
                    // Very subtle jitter (within a few meters)
                    return {
                        ...d,
                        lat: d.lat + (Math.random() - 0.5) * 0.00005,
                        lng: d.lng + (Math.random() - 0.5) * 0.00005,
                        heading: (d.heading + (Math.random() - 0.5) * 10 + 360) % 360
                    };
                }
                return d;
            }));
        }, 3000);

        return () => {
            socket.off('fleetUpdate');
            clearInterval(motionInterval);
        };
    }, [socket]);

    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
    const [editingProfileType, setEditingProfileType] = useState<'driver' | 'customer' | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [serviceFilter, setServiceFilter] = useState('ALL');
    const [vehicleFilter, setVehicleFilter] = useState('ALL');
    const [showDemand, setShowDemand] = useState(true);
    const [viewMode, setViewMode] = useState<'all' | 'online' | 'offline' | 'idle' | 'on-trip' | 'customers'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isCallVisible, setIsCallVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const [selectedHistoryTrip, setSelectedHistoryTrip] = useState<any>(null);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [isGovernanceDrawerVisible, setIsGovernanceDrawerVisible] = useState(false);
    const [governanceAction, setGovernanceAction] = useState<'suspend' | 'ban' | 'delete' | null>(null);
    const [governanceTargetType, setGovernanceTargetType] = useState<'driver' | 'customer' | null>(null);
    const [governanceReason, setGovernanceReason] = useState<string>('');
    const [governanceCustomReason, setGovernanceCustomReason] = useState('');

    const SUGGESTED_REASONS = {
        suspend: ['Safety Violation', 'DUI Report', 'Fraudulent Trip Data', 'Vehicle Non-Compliance', 'Other'],
        ban: ['Payment Fraud', 'Terms of Service Violation', 'Harassment', 'Multiple Fake Accounts', 'Other'],
        delete: ['Duplicate Account', 'Requested by User', 'Data Privacy Request', 'System Cleanup', 'Other']
    };
  
  const location = useLocation();

  useEffect(() => {
    // If arriving from HeatMap via URL param, eg: /dashboard/fleet?zone=z1
    const params = new URLSearchParams(location.search);
    const zoneId = params.get('zone');
    if (zoneId) {
      if (zoneId === 'z1') {
         setSearchQuery('CBD'); 
         message.info('Filtered active drivers in CBD Zone');
      } else if (zoneId === 'z2') {
         setSearchQuery('Avondale');
         message.info('Filtered active drivers in Avondale Zone');
      }
    }
  }, [location]);
  useEffect(() => {
    let timer: any;
    if (isCallVisible) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallVisible]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), text: newMessage, sender: 'admin', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
    
    // Auto-reply mock
    setTimeout(() => {
        setChatMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            text: "Copy that dispatcher, I'm on it. Status updated.", 
            sender: 'driver', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    }, 1500);
  };



    // Filter application
    const filteredDrivers = drivers.filter(d => {
        const matchService = serviceFilter === 'ALL' || d.service === serviceFilter;
        const matchVehicle = vehicleFilter === 'ALL' || d.type === vehicleFilter;
        
        let matchStatus = true;
        if (viewMode === 'online') matchStatus = d.status === 'Available' || d.status === 'On Trip';
        if (viewMode === 'idle') matchStatus = d.status === 'Available';
        if (viewMode === 'on-trip') matchStatus = d.status === 'On Trip';
        if (viewMode === 'offline') matchStatus = d.status === 'Offline';
        if (viewMode === 'customers') return false; // Hide drivers in customers mode
        
        const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.plate?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchService && matchVehicle && matchStatus && matchSearch;
    });

    const filteredCustomers = customers.filter(c => {
        if (viewMode !== 'customers') return false;
        return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const displayItems = viewMode === 'customers' ? filteredCustomers : filteredDrivers;

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Available': return '#10b981'; // Green
        case 'On Trip': return '#f59e0b'; // Yellow (Orange)
        case 'Offline': return '#ef4444'; // Red
        case 'Suspended': return '#7f1d1d'; // Dark Red
        case 'Banned': return '#7f1d1d'; // Dark Red
        case 'Active': return '#10b981'; // Green
        default: return '#94a3b8';
    }
  };

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);
  const selectedCustomer = customers.find(c => c.id === selectedDriverId);

    const openGovernanceModal = (action: 'suspend' | 'ban' | 'delete', target: 'driver' | 'customer') => {
        setGovernanceAction(action);
        setGovernanceTargetType(target);
        setGovernanceReason('');
        setGovernanceCustomReason('');
        setIsGovernanceDrawerVisible(true);
    };

    const confirmGovernanceAction = () => {
        const finalReason = governanceReason === 'Other' ? governanceCustomReason : governanceReason;
        
        if (governanceAction === 'delete') {
            if (governanceTargetType === 'driver') setDrivers(prev => prev.filter(d => d.id !== selectedDriverId));
            else setCustomers(prev => prev.filter(c => c.id !== selectedDriverId));
            message.success(`${governanceTargetType === 'driver' ? 'Driver' : 'Customer'} deleted successfully. Primary Reason: ${finalReason}`);
            setSelectedDriverId(null);
        } else if (governanceAction === 'suspend') {
            setDrivers(prev => prev.map(d => d.id === selectedDriverId ? { ...d, status: 'Suspended' } : d));
            message.error(`Driver suspended. Reason: ${finalReason}`);
        } else if (governanceAction === 'ban') {
            setCustomers(prev => prev.map(c => c.id === selectedDriverId ? { ...c, status: 'Banned' } : c));
            message.error(`Customer banned. Reason: ${finalReason}`);
        }

        setIsGovernanceDrawerVisible(false);
    };

    const handleUnsuspend = (type: 'driver' | 'customer') => {
        modal.confirm({
            title: `Are you sure you want to reinstate this ${type}?`,
            onOk() {
                if (type === 'driver') {
                    setDrivers(prev => prev.map(d => d.id === selectedDriverId ? { ...d, status: 'Available' } : d));
                    message.success(`Driver reinstated successfully.`);
                } else {
                    setCustomers(prev => prev.map(c => c.id === selectedDriverId ? { ...c, status: 'Active' } : c));
                    message.success(`Customer unbanned successfully.`);
                }
            },
        });
    };

  return (
    <div style={{ paddingBottom: 24, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        
      {/* Header & Fleet Summary */}
        <Card variant="borderless" className="shadow-sm" style={{ marginBottom: 16, borderRadius: 12 }}>
            <Row justify="space-between" align="middle" gutter={[0, 16]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space size="middle">
                                <Title level={4} style={{ margin: 0 }}>Fleet Control Center</Title>
                                <Divider orientation="vertical" />
                                <Space size="small" wrap>
                                    <Select 
                                        value={selectedCountry} 
                                        style={{ width: 140 }} 
                                        variant="borderless"
                                        onChange={(val) => {
                                            setSelectedCountry(val);
                                            const firstRegion = Object.keys(LOCATION_DATA[val].regions)[0];
                                            setSelectedRegion(firstRegion);
                                            setSelectedCity(LOCATION_DATA[val].regions[firstRegion][0]);
                                        }}
                                    >
                                        {Object.keys(LOCATION_DATA).map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                    </Select>
                                    <Select 
                                        value={selectedRegion} 
                                        style={{ width: 140 }} 
                                        variant="borderless"
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
                                        variant="borderless"
                                        onChange={setSelectedCity}
                                        suffixIcon={<EnvironmentOutlined />}
                                    >
                                        {LOCATION_DATA[selectedCountry].regions[selectedRegion].map((c: string) => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                    </Select>
                                </Space>
                            </Space>
                        </Col>
                        <Col>
                            <Button icon={<SyncOutlined />} onClick={() => {
                                socket?.emit('syncFleet');
                                message.loading('Syncing Fleet Data...', 0.5).then(() => message.success('Fleet status updated'));
                            }}>Sync Fleet</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Divider style={{ margin: '8px 0' }} />
                </Col>
                <Col span={24}>
                    <Row justify="space-around" align="middle" style={{ textAlign: 'center' }}>
                        <Col><Statistic title="Available" value={fleetStats.available} styles={{ content: { color: '#10b981', fontSize: 18 } }}/></Col>
                        <Col><Statistic title="On Trip" value={fleetStats.busy} styles={{ content: { color: '#f59e0b', fontSize: 18 } }}/></Col>
                        <Col><Statistic title="Offline" value={fleetStats.offline} styles={{ content: { color: '#ef4444', fontSize: 18 } }}/></Col>
                        <Col><Divider orientation="vertical" style={{ height: 32 }} /></Col>
                        <Col><Statistic title="Active Sessions" value={activeTrips.length} styles={{ content: { fontSize: 18 } }}/></Col>
                        <Col><Statistic title="Hub Sync" value={isConnected ? "Live" : "Retry"} styles={{ content: { fontSize: 18, color: isConnected ? '#10b981' : '#ef4444' } }}/></Col>
                    </Row>
                </Col>
            </Row>
        </Card>

      {/* Filters Overlay */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={6}>
            <Input 
                prefix={<SearchOutlined />} 
                placeholder="Driver, Plate, ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                allowClear
            />
        </Col>
        <Col span={4}>
            <Select value={serviceFilter} onChange={setServiceFilter} style={{ width: '100%' }} placeholder="Service">
                <Option value="ALL">All Services</Option>
                <Option value="Ride Hailing">Ride Hailing</Option>
                <Option value="Food Delivery">Food Delivery</Option>
            </Select>
        </Col>
        <Col span={4}>
            <Select value={vehicleFilter} onChange={setVehicleFilter} style={{ width: '100%' }} placeholder="Vehicle">
                <Option value="ALL">All Vehicles</Option>
                <Option value="Car">Car</Option>
                <Option value="Motorcycle">Motorcycle</Option>
                <Option value="Van">Van</Option>
            </Select>
        </Col>
        <Col span={4}>
            <Select value={viewMode} onChange={setViewMode} style={{ width: '100%' }}>
                <Option value="all">All Drivers</Option>
                <Option value="online">Online Drivers</Option>
                <Option value="idle">Idle Drivers</Option>
                <Option value="on-trip">On Trip Drivers</Option>
                <Option value="offline">Offline Drivers</Option>
                <Divider style={{ margin: '4px 0' }} />
                <Option value="customers">Live Customers</Option>
            </Select>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
                <Switch 
                    checked={showDemand} 
                    onChange={(val) => {
                        setShowDemand(val);
                        socket?.emit('toggleDemandSimulation', val);
                        message.info(`Demand simulation ${val ? 'enabled' : 'disabled'}`);
                    }} 
                    checkedChildren="Demand ON" 
                    unCheckedChildren="Demand OFF" 
                />
                <Button 
                    icon={<AimOutlined />} 
                    onClick={() => {
                        socket?.emit('recalibrateAnalytics');
                        message.info('Recalibrating GPS cluster analytics...');
                    }}
                >Recalibrate</Button>
            </Space>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
        {/* Map Column */}
        <Col span={17} style={{ height: '100%' }}>
            <Card variant="borderless" className="shadow-sm" styles={{ body: { padding: 0, height: '100%', minHeight: 600, position: 'relative', overflow: 'hidden' } }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                    <BaseMap center={[-17.824858, 31.053028]} zoom={12} height="100%">
                    
                    {showDemand && demandPoints.map(cluster => (
                        <CircleF 
                            key={cluster.id}
                            center={{ lat: cluster.lat, lng: cluster.lng }}
                            radius={cluster.radius}
                            options={{ 
                                fillColor: '#3b82f6', 
                                strokeColor: '#3b82f6', 
                                fillOpacity: cluster.intensity * 0.3,
                                strokeWeight: 0
                            }}
                        />
                    ))}
                    
                    <MapController 
                        selectedPos={selectedDriver ? { lat: selectedDriver.lat, lng: selectedDriver.lng } : null} 
                        selectedCity={selectedCity}
                    />

                    {/* Driver Markers */}
                    {viewMode !== 'customers' && filteredDrivers.map(d => (
                        <OverlayViewF
                            key={d.id}
                            position={{ lat: d.lat, lng: d.lng }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div 
                                onClick={() => setSelectedDriverId(d.id)}
                                style={{ 
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ 
                                    background: getStatusColor(d.status), 
                                    width: '32px', height: '32px', 
                                    borderRadius: '10px', border: '2px solid white', 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    transform: selectedDriverId === d.id ? 'scale(1.2)' : 'scale(1)', 
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    {d.alerts.length > 0 && <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }} className="animate-pulse"></div>}
                                    
                                    {/* Halo Effect */}
                                    <div style={{ 
                                        position: 'absolute', 
                                        width: '60px', 
                                        height: '60px', 
                                        background: 'rgba(59, 130, 246, 0.2)', 
                                        borderRadius: '50%', 
                                        border: '1px solid rgba(59, 130, 246, 0.4)',
                                        zIndex: -1
                                    }} className="animate-pulse" />

                                    <img 
                                        src={d.id.includes('HANDICAP') ? carMarkerHandicap : carMarker} 
                                        style={{ 
                                            width: '80px', height: '80px', 
                                            objectFit: 'contain', 
                                            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))',
                                            transform: `rotate(${d.heading || 0}deg)`,
                                            transition: 'transform 0.5s ease'
                                        }} 
                                        alt="car" 
                                    />
                                </div>
                            </div>
                        </OverlayViewF>
                    ))}

                    {/* Customer Markers */}
                    {viewMode === 'customers' && filteredCustomers.map(c => (
                        <OverlayViewF
                            key={c.id}
                            position={{ lat: c.lat, lng: c.lng }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div 
                                onClick={() => setSelectedDriverId(c.id)}
                                style={{ transform: 'translate(-50%, -50%)', cursor: 'pointer' }}
                                className="pulse-marker"
                            >
                                <div style={{ background: '#3b82f6', width: '24px', height: '24px', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: selectedDriverId === c.id ? 'scale(1.2)' : 'scale(1)' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </div>
                            </div>
                        </OverlayViewF>
                    ))}

                    {/* Trip Lines & Points for Selected Driver */}
                    {selectedDriver?.currentTrip && (
                        <>
                            <PolylineF 
                                path={[{lat: selectedDriver.lat, lng: selectedDriver.lng}, selectedDriver.currentTrip.pickup, selectedDriver.currentTrip.dropoff]} 
                                options={{ strokeColor: "#3b82f6", strokeWeight: 3, strokeOpacity: 0.6, icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '20px' }] }} 
                            />
                            <OverlayViewF position={selectedDriver.currentTrip.pickup} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                                <div style={{ transform: 'translate(-50%, -50%)', width:'14px',height:'14px',background:'white',border:'3px solid black',borderRadius:'50%',boxShadow:'0 0 4px rgba(0,0,0,0.3)' }}></div>
                            </OverlayViewF>
                            <OverlayViewF position={selectedDriver.currentTrip.dropoff} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                                <div style={{ transform: 'translate(-50%, -50%)', width:'14px',height:'14px',background:'white',border:'3px solid #ef4444',borderRadius:'50%',boxShadow:'0 0 4px rgba(0,0,0,0.3)' }}></div>
                            </OverlayViewF>
                        </>
                    )}
                </BaseMap>
                </div>
                
                {/* Overlay Legend */}
                <div style={{ 
                    position: 'absolute', bottom: 24, left: 24, zIndex: 1000, 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    padding: '12px 16px', borderRadius: 12, 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
                }}>
                    <Text strong style={{ display: 'block', fontSize: 10, marginBottom: 8, color: '#64748b', letterSpacing: '0.05em' }}>FLEET COMMAND KEY</Text>
                    <Space size={16} wrap>
                        <Space size={6}><div style={{ width:10, height:10, borderRadius:'50%', background:'#10b981' }} /><Text style={{ fontSize:12, fontWeight: 500 }}>Available</Text></Space>
                        <Space size={6}><div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }} /><Text style={{ fontSize:12, fontWeight: 500 }}>On Trip</Text></Space>
                        <Space size={6}><div style={{ width:10, height:10, borderRadius:'50%', background:'#ef4444' }} /><Text style={{ fontSize:12, fontWeight: 500 }}>Offline</Text></Space>
                        <Divider orientation="vertical" />
                        <Space size={6}><div style={{ width:14, height:14, borderRadius:'50%', background:'rgba(59, 130, 246, 0.3)', border:'1px solid #3b82f6' }} /><Text style={{ fontSize:12, fontWeight: 500 }}>Customer Clusters</Text></Space>
                    </Space>
                </div>

                {/* Inline Fullscreen/Zoom (Side Controls) */}
                <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Button icon={<ArrowUpOutlined rotate={45} />} onClick={() => message.info('Recalibrating view...')} style={{ borderRadius: 8 }} />
                </div>
            </Card>
        </Col>

        {/* Info Column */}
        <Col span={7} style={{ height: '100%' }}>
            {!selectedDriver ? (
                <Card 
                    title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{viewMode === 'customers' ? 'Market Demand Points' : 'Active Fleet'}</span>
                        <Badge count={displayItems.length} color="#3b82f6" />
                    </div>} 
                    variant="borderless" 
                    className="shadow-sm" 
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    styles={{ body: { flex: 1, overflowY: 'auto', padding: '12px' } }}
                >
                    <List
                        dataSource={displayItems}
                        renderItem={(item: any) => (
                            <List.Item 
                                style={{ 
                                    padding: '12px', 
                                    borderRadius: 12, 
                                    marginBottom: 8, 
                                    cursor: 'pointer',
                                    border: selectedDriverId === item.id ? '1px solid #3b82f6' : '1px solid #f1f5f9',
                                    background: selectedDriverId === item.id ? '#eff6ff' : 'white'
                                }}
                                onClick={() => setSelectedDriverId(item.id)}
                            >
                                <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    {viewMode === 'customers' ? (
                                        <>
                                            <Avatar shape="square" size={40} src={`https://picsum.photos/seed/${item.id}/100/100`} style={{ borderRadius: 8 }} />
                                            <div style={{ marginLeft: 12, flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text strong>{item.name}</Text>
                                                    <Tag color="blue" style={{ fontSize: 9, margin: 0 }}>{item.loyalty}</Tag>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.behavior}</Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>{item.trips} trips</Text>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Badge dot offset={[-2, 32]} color={getStatusColor(item.status)}>
                                                <Avatar shape="square" size={40} src={`https://picsum.photos/seed/${item.id}/100/100`} style={{ borderRadius: 8 }} />
                                            </Badge>
                                            <div style={{ marginLeft: 12, flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text strong>{item.name}</Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>{item.lastSeen}</Text>
                                                </div>
                                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.type} • {item.plate}</Text>
                                                    <Tag color={getStatusColor(item.status)} style={{ margin: 0, fontSize: 10 }}>{item.status}</Tag>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <Button type="text" icon={<AimOutlined />} onClick={(e) => { e.stopPropagation(); setSelectedDriverId(item.id); }} />
                                </div>
                            </List.Item>
                        )}
                        locale={{ emptyText: <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Text type="secondary">{viewMode === 'customers' ? 'No customers active in this region.' : 'No drivers online in this region.'}</Text><br/>
                            <Button size="small" style={{ marginTop: 8 }} onClick={() => { setServiceFilter('ALL'); setViewMode('all'); setSearchQuery(''); }}>Reset Filters</Button>
                        </div> }}
                    />
                </Card>
            ) : null}
        </Col>
      </Row>

      {/* Detailed Driver Management Drawer */}
      <Drawer
        title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
            <Space size="large">
                <Avatar size={64} shape="square" src={`https://picsum.photos/seed/${selectedDriver?.id}/200/200`} style={{ borderRadius: 12, border: '2px solid #fff' }} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>{selectedDriver?.name}</Title>
                    <Text type="secondary">{selectedDriver?.id} • {selectedDriver?.service}</Text>
                    <br />
                    <Space>
                        <Tag color="gold" icon={<StarOutlined />}>{selectedDriver?.rating}</Tag>
                        <Tag color="blue">{selectedDriver?.level}</Tag>
                        <Badge status={selectedDriver?.status === 'Available' ? 'success' : 'processing'} text={selectedDriver?.status} />
                    </Space>
                </div>
            </Space>
            <Space>
                <Button icon={<SettingOutlined />} onClick={() => { setEditingProfileType('driver'); setEditingDriver(selectedDriver as Driver); setIsEditProfileVisible(true); }}>Edit Profile</Button>
                {selectedDriver?.status === 'Suspended' ? (
                    <Button onClick={() => handleUnsuspend('driver')}>Unsuspend</Button>
                ) : (
                    <Button danger onClick={() => openGovernanceModal('suspend', 'driver')}>Suspend</Button>
                )}
                <Button danger type="primary" onClick={() => openGovernanceModal('delete', 'driver')}>Delete</Button>
            </Space>
        </div>}
        placement="right"
        width={900}
        onClose={() => setSelectedDriverId(null)}
        open={!!selectedDriver}
        styles={{ body: { padding: 0, background: '#f8fafc' } }}
      >
          <Tabs
            defaultActiveKey="overview"
            className="premium-tabs"
            style={{ height: '100%' }}
            tabBarStyle={{ padding: '0 24px', marginBottom: 0, borderBottom: '1px solid #f1f5f9', background: '#fff' }}
            items={[
                {
                    key: 'overview',
                    label: <Space><AppstoreOutlined /> Overview</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Row gutter={[24, 24]}>
                                <Col span={16}>
                                    <Card title="Performance Intelligence" variant="borderless" className="shadow-sm">
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}><Statistic title="Success Rate" value={selectedDriver?.successRate} suffix="%" styles={{ content: { color: '#10b981' } }} /></Col>
                                            <Col span={8}><Statistic title="Daily Earnings" value={selectedDriver?.earningsPerDay} prefix="$" /></Col>
                                            <Col span={8}><Statistic title="Cancellation" value={selectedDriver?.cancellationRate} suffix="%" styles={{ content: { color: '#ef4444' } }} /></Col>
                                            <Col span={8}><Statistic title="Positive Reviews" value={selectedDriver?.posReviewRate} suffix="%" /></Col>
                                            <Col span={8}><Statistic title="Idle Hour Rate" value={selectedDriver?.idleHourRate} suffix="%" /></Col>
                                            <Col span={8}><Statistic title="Join Date" value={selectedDriver?.joinDate} styles={{ content: { fontSize: 16 } }} /></Col>
                                        </Row>
                                        <Divider />
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Text type="secondary">Trip Extremes</Text>
                                                <div style={{ marginTop: 12 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                        <Text>Highest Price Trip</Text>
                                                        <Text strong>$337.70</Text>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Text>Lowest Price Trip</Text>
                                                        <Text strong>$65.56</Text>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">Activity Logs</Text>
                                                <List size="small" split={false} style={{ marginTop: 8 }}>
                                                    <List.Item style={{ padding: '2px 0' }}><Badge status="success" /> <Text style={{ fontSize: 12 }}>Logged in â€¢ 08:30 am</Text></List.Item>
                                                    <List.Item style={{ padding: '2px 0' }}><Badge status="processing" /> <Text style={{ fontSize: 12 }}>Trip ORD-991 Started â€¢ 11:20 am</Text></List.Item>
                                                </List>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Contact Details" variant="borderless" className="shadow-sm">
                                        <Space orientation="vertical" style={{ width: '100%' }}>
                                            <div><Text type="secondary" style={{ fontSize: 12 }}>Phone Number</Text><br /><Text strong>{selectedDriver?.phone}</Text></div>
                                            <div><Text type="secondary" style={{ fontSize: 12 }}>Email Address</Text><br /><Text strong>{selectedDriver?.email || 'N/A'}</Text></div>
                                            <Divider style={{ margin: '12px 0' }} />
                                            <Button block icon={<MessageOutlined />} onClick={() => setIsChatVisible(true)}>Open Driver Chat</Button>
                                            <Button block icon={<PhoneOutlined />} onClick={() => setIsCallVisible(true)}>Initiate VoIP Call</Button>
                                        </Space>
                                    </Card>
                                    <div style={{ marginTop: 24 }}>
                                        <Button danger block size="large" icon={<StopOutlined />} onClick={() => openGovernanceModal('suspend', 'driver')}>
                                            Suspend Driver Access
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )
                },
                {
                    key: 'vehicle',
                    label: <Space><CarOutlined /> Vehicle</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Card title="Vehicle Specifications" bordered={false} className="shadow-sm">
                                <Row gutter={[32, 24]}>
                                    <Col span={12}>
                                        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24 }}>
                                            <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 16 }}>
                                                <CarOutlined style={{ fontSize: 40, color: '#64748b' }} />
                                            </div>
                                            <div>
                                                <Title level={4} style={{ margin: 0 }}>{selectedDriver?.vehicle.brand} - {selectedDriver?.vehicle.model}</Title>
                                                <Text type="secondary">{selectedDriver?.vehicle.ownerType}</Text>
                                            </div>
                                        </div>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}><Text type="secondary">Category</Text><br /><Text strong>{selectedDriver?.vehicle.category}</Text></Col>
                                            <Col span={12}><Text type="secondary">Brand</Text><br /><Text strong>{selectedDriver?.vehicle.brand}</Text></Col>
                                            <Col span={12}><Text type="secondary">Model</Text><br /><Text strong>{selectedDriver?.vehicle.model}</Text></Col>
                                            <Col span={12}><Text type="secondary">Plate Number</Text><br /><Text strong style={{ background: '#000', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>{selectedDriver?.plate}</Text></Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Divider orientation={"left" as any} plain><Text type="secondary" style={{ fontSize: 12 }}>Technical Data</Text></Divider>
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}><Text type="secondary">VIN</Text><br /><Text strong>{selectedDriver?.vehicle.vin}</Text></Col>
                                            <Col span={8}><Text type="secondary">Fuel Type</Text><br /><Text strong>{selectedDriver?.vehicle.fuelType}</Text></Col>
                                            <Col span={8}><Text type="secondary">Engine</Text><br /><Text strong>{selectedDriver?.vehicle.engine}</Text></Col>
                                            <Col span={8}><Text type="secondary">Seats</Text><br /><Text strong>{selectedDriver?.vehicle.seats}</Text></Col>
                                            <Col span={8}><Text type="secondary">Expiry</Text><br /><Text strong>{selectedDriver?.vehicle.expiry}</Text></Col>
                                        </Row>
                                        <div style={{ marginTop: 24 }}>
                                            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>ATTACHED DOCUMENTS</Text>
                                            <Space>
                                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                                                    <InfoCircleOutlined style={{ display: 'block', fontSize: 24, color: '#3b82f6', marginBottom: 4 }} />
                                                    <Text style={{ fontSize: 10 }}>License.pdf</Text>
                                                </div>
                                                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                                                    <InfoCircleOutlined style={{ display: 'block', fontSize: 24, color: '#3b82f6', marginBottom: 4 }} />
                                                    <Text style={{ fontSize: 10 }}>Insurance.pdf</Text>
                                                </div>
                                            </Space>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    )
                },
                {
                    key: 'trips',
                    label: <Space><HistoryOutlined /> Trips</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Card 
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>All Trips (History)</span>
                                    <Input.Search placeholder="Trip ID, Customer..." style={{ width: 250 }} size="small" />
                                </div>}
                                bordered={false} 
                                className="shadow-sm"
                            >
                                <Table 
                                    dataSource={activeTrips.filter(t => t.driver_id === selectedDriver?.id)}
                                    pagination={{ pageSize: 5 }}
                                    size="small"
                                    columns={[
                                        { title: 'Trip ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>#{t}</Text> },
                                        { title: 'Date', dataIndex: 'date', key: 'date' },
                                        { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                                        { title: 'Cost ($)', dataIndex: 'total', key: 'total', render: (val) => <Text strong>${val}</Text> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Completed' ? 'success' : 'error'}>{s}</Tag> },
                                        { title: 'Payment', dataIndex: 'payment', key: 'payment' },
                                        { title: 'Action', key: 'action', render: (_, record) => (
                                            <Button 
                                                type="link" 
                                                size="small" 
                                                onClick={() => {
                                                    setSelectedHistoryTrip(record);
                                                    setIsHistoryModalVisible(true);
                                                }}
                                            >Details</Button>
                                        ) },
                                    ]}
                                />
                            </Card>
                        </div>
                    )
                },
                {
                    key: 'wallet',
                    label: <Space><WalletOutlined /> Wallet</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                             <Row gutter={24} style={{ marginBottom: 24 }}>
                                <Col span={6}><Card size="small" className="shadow-sm"><Statistic title="Withdrawable" value={selectedDriver?.wallet?.withdrawable} prefix="$" valueStyle={{ color: '#10b981' }} /></Card></Col>
                                <Col span={6}><Card size="small" className="shadow-sm"><Statistic title="Pending" value={selectedDriver?.wallet?.pending} prefix="$" valueStyle={{ color: '#f59e0b' }} /></Card></Col>
                                <Col span={6}><Card size="small" className="shadow-sm"><Statistic title="Withdrawn" value={selectedDriver?.wallet?.withdrawn} prefix="$" /></Card></Col>
                                <Col span={6}><Card size="small" className="shadow-sm"><Statistic title="Total Earning" value={selectedDriver?.wallet?.total} prefix="$" /></Card></Col>
                            </Row>
                            <Card title="Financial Ledger" bordered={false} className="shadow-sm">
                                <Table 
                                    dataSource={MOCK_TRANSACTIONS}
                                    size="small"
                                    columns={[
                                        { title: 'Transaction ID', dataIndex: 'id', key: 'id', render: (id) => <Text style={{ fontSize: 11 }}>{id}</Text> },
                                        { title: 'Type', dataIndex: 'type', key: 'type' },
                                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong style={{ color: '#10b981' }}>+ ${a}</Text> },
                                        { title: 'Last Balance', dataIndex: 'balance', key: 'balance', render: (b) => <Text>$ {b}</Text> },
                                        { title: 'Date', dataIndex: 'date', key: 'date' }
                                    ]}
                                />
                            </Card>
                        </div>
                    )
                },
                {
                    key: 'reviews',
                    label: <Space><StarOutlined /> Reviews</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Card bordered={false} className="shadow-sm" style={{ textAlign: 'center' }}>
                                        <Title level={2} style={{ margin: 0 }}>5.0</Title>
                                        <Space size={2} style={{ color: '#f59e0b', fontSize: 18, marginBottom: 8 }}>
                                            <StarFilled/><StarFilled/><StarFilled/><StarFilled/><StarFilled/>
                                        </Space>
                                        <br/><Text type="secondary">20 Ratings â€¢ 4 Reviews</Text>
                                        <Divider />
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Text style={{ width: 60 }}>Excellent</Text>
                                                <Progress percent={100} size="small" strokeColor="#10b981" />
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 11 }}>All reviews are currently 5-star.</Text>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={16}>
                                    <Card title="Review Log" bordered={false} className="shadow-sm">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={[
                                                { id: '#100009', user: 'Test User', rating: 5, date: '21 Nov 2023' },
                                                { id: '#100008', user: 'Test User', rating: 5, date: '21 Nov 2023' },
                                            ]}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        title={<span>Trip <Text strong>{item.id}</Text> from <Text strong>{item.user}</Text></span>}
                                                        description={<Space><Tag color="gold" icon={<StarOutlined />}>{item.rating}</Tag> <Text type="secondary">{item.date}</Text></Space>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            ]}
          />
      </Drawer>

      {/* Detailed Customer Management Drawer */}
      <Drawer
        title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '95%' }}>
            <Space size="large">
                <Avatar size={64} src={`https://picsum.photos/seed/${selectedCustomer?.id}/200/200`} style={{ borderRadius: 12, border: '2px solid #fff' }} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>{selectedCustomer?.name}</Title>
                    <Text type="secondary">{selectedCustomer?.id} â€¢ {selectedCustomer?.loyalty} Member</Text>
                    <br />
                    <Space>
                        <Tag color="gold" icon={<StarOutlined />}>{selectedCustomer?.rating}</Tag>
                        <Tag color="cyan">{selectedCustomer?.behavior}</Tag>
                        <Badge status="success" text={selectedCustomer?.status} />
                    </Space>
                </div>
            </Space>
            <Space>
                <Button icon={<SettingOutlined />} onClick={() => { setEditingProfileType('customer'); setEditingCustomer(selectedCustomer as Customer); setIsEditProfileVisible(true); }}>Edit Profile</Button>
                {selectedCustomer?.status === 'Banned' ? (
                    <Button onClick={() => handleUnsuspend('customer')}>Unban</Button>
                ) : (
                    <Button danger onClick={() => openGovernanceModal('ban', 'customer')}>Ban User</Button>
                )}
                <Button danger type="primary" onClick={() => openGovernanceModal('delete', 'customer')}>Delete</Button>
            </Space>
        </div>}
        placement="right"
        width={900}
        onClose={() => setSelectedDriverId(null)}
        open={!!selectedCustomer}
        bodyStyle={{ padding: 0, background: '#f8fafc' }}
      >
          <Tabs
            defaultActiveKey="overview"
            className="premium-tabs"
            style={{ height: '100%' }}
            tabBarStyle={{ padding: '0 24px', marginBottom: 0, borderBottom: '1px solid #f1f5f9', background: '#fff' }}
            items={[
                {
                    key: 'overview',
                    label: <Space><AppstoreOutlined /> Overview</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Row gutter={[24, 24]}>
                                <Col span={16}>
                                    <Card title="Engagement Metrics" variant="borderless" className="shadow-sm">
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}><Statistic title="Total Trips" value={selectedCustomer?.trips} styles={{ content: { color: '#3b82f6' } }} /></Col>
                                            <Col span={8}><Statistic title="Total Spend" value={selectedCustomer?.totalSpend} prefix="$" /></Col>
                                            <Col span={8}><Statistic title="Wallet Balance" value={selectedCustomer?.walletBalance} prefix="$" styles={{ content: { color: '#10b981' } }} /></Col>
                                            <Col span={8}><Statistic title="Member Since" value={selectedCustomer?.joinDate} styles={{ content: { fontSize: 16 } }} /></Col>
                                            <Col span={8}><Statistic title="Preferred vertical" value={selectedCustomer?.preferredVertical} styles={{ content: { fontSize: 14 } }} /></Col>
                                            <Col span={8}><Statistic title="Last Order" value={selectedCustomer?.lastOrderDate} styles={{ content: { fontSize: 14 } }} /></Col>
                                        </Row>
                                        <Divider />
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Text type="secondary">Product Penetration</Text>
                                                <div style={{ marginTop: 12 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                        <Text>Ride Hailing</Text>
                                                        <Progress percent={75} size="small" />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                        <Text>Food Delivery</Text>
                                                        <Progress percent={40} size="small" strokeColor="#f59e0b" />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Text>Mart/Retail</Text>
                                                        <Progress percent={10} size="small" strokeColor="#10b981" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">Active Service Requests</Text>
                                                <div style={{ marginTop: 12 }}>
                                                    {selectedCustomer?.activeRequests.map(req => (
                                                        <Tag key={req} color="blue" style={{ marginBottom: 4 }}>{req}</Tag>
                                                    ))}
                                                    {selectedCustomer?.activeRequests.length === 0 && <Text type="secondary">No active sessions</Text>}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="User Contact" variant="borderless" className="shadow-sm">
                                        <Space orientation="vertical" style={{ width: '100%' }}>
                                            <div><Text type="secondary" style={{ fontSize: 12 }}>Phone Number</Text><br /><Text strong>{selectedCustomer?.phone}</Text></div>
                                            <div><Text type="secondary" style={{ fontSize: 12 }}>Email Address</Text><br /><Text strong>{selectedCustomer?.email}</Text></div>
                                            <Divider style={{ margin: '12px 0' }} />
                                            <Button block ghost type="primary" icon={<MessageOutlined />}>Support Ticket</Button>
                                            <Button block icon={< ThunderboltOutlined />}>Send Push Notification</Button>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )
                },
                {
                    key: 'trips',
                    label: <Space><HistoryOutlined /> Trip History</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Card 
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>User Order History</span>
                                    <Input.Search placeholder="Search Order ID..." style={{ width: 250 }} size="small" />
                                </div>}
                                bordered={false} 
                                className="shadow-sm"
                            >
                                <Table 
                                    dataSource={MOCK_TRIPS}
                                    pagination={{ pageSize: 5 }}
                                    size="small"
                                    columns={[
                                        { title: 'ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>#{t}</Text> },
                                        { title: 'Date', dataIndex: 'date', key: 'date' },
                                        { title: 'Driver', dataIndex: 'driver', key: 'driver' },
                                        { title: 'Fare', dataIndex: 'total', key: 'total', render: (val) => <Text strong>${val}</Text> },
                                        { title: 'Type', key: 'type', render: () => <Tag>Ride</Tag> },
                                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Completed' ? 'success' : 'error'}>{s}</Tag> },
                                    ]}
                                />
                            </Card>
                        </div>
                    )
                },
                {
                    key: 'wallet',
                    label: <Space><WalletOutlined /> Wallet & Pay</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                             <Row gutter={24} style={{ marginBottom: 24 }}>
                                <Col span={8}><Card size="small" className="shadow-sm"><Statistic title="Available Balance" value={selectedCustomer?.walletBalance} prefix="$" styles={{ content: { color: '#10b981' } }} /></Card></Col>
                                <Col span={8}><Card size="small" className="shadow-sm"><Statistic title="Total Lifetime Spend" value={selectedCustomer?.totalSpend} prefix="$" /></Card></Col>
                                <Col span={8}><Card size="small" className="shadow-sm"><Statistic title="Pending Refunds" value={0.00} prefix="$" /></Card></Col>
                            </Row>
                            <Card title="Billing History" bordered={false} className="shadow-sm" extra={<Button size="small" type="primary">Issue Credit</Button>}>
                                <Table 
                                    dataSource={MOCK_TRANSACTIONS}
                                    size="small"
                                    columns={[
                                        { title: 'Reference', dataIndex: 'id', key: 'id', render: (id) => <Text style={{ fontSize: 11 }}>{id}</Text> },
                                        { title: 'Method', key: 'method', render: () => 'Visa ...4421' },
                                        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <Text strong>- ${a}</Text> },
                                        { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (b) => <Text>$ {b}</Text> },
                                        { title: 'Date', dataIndex: 'date', key: 'date' }
                                    ]}
                                />
                            </Card>
                        </div>
                    )
                },
                {
                    key: 'reviews',
                    label: <Space><StarOutlined /> Reviews</Space>,
                    children: (
                        <div style={{ padding: 24 }}>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Card bordered={false} className="shadow-sm" style={{ textAlign: 'center' }}>
                                        <Title level={2} style={{ margin: 0 }}>{selectedCustomer?.rating}</Title>
                                        <Space size={2} style={{ color: '#f59e0b', fontSize: 18, marginBottom: 8 }}>
                                            <StarFilled/><StarFilled/><StarFilled/><StarFilled/><StarFilled/>
                                        </Space>
                                        <br/><Text type="secondary">User Trust Score</Text>
                                        <Divider />
                                        <Text type="secondary">This user consistently provides positive feedback to drivers.</Text>
                                    </Card>
                                </Col>
                                <Col span={16}>
                                    <Card title="Reviews Given by User" variant="borderless" className="shadow-sm">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={[
                                                { id: '#100009', driver: 'Devid Jack', rating: 5, text: 'Great driver, very professional.' },
                                                { id: '#100008', driver: 'Devid Jack', rating: 5, text: 'Clean car and fast route.' },
                                            ]}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        title={<span>Rating for <Text strong>{item.driver}</Text></span>}
                                                        description={<div><Space><Tag color="gold" icon={<StarOutlined />}>{item.rating}</Tag></Space><br/><Text type="secondary">{item.text}</Text></div>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            ]}
          />
      </Drawer>

      {/* Real-time Messaging Drawer */}
      <Drawer
        title={<Space><Avatar src={`https://picsum.photos/seed/${selectedDriver?.id}/100/100`} /> <Text strong>{selectedDriver?.name}</Text></Space>}
        placement="right"
        onClose={() => setIsChatVisible(false)}
        open={isChatVisible}
        width={400}
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '12px', background: '#f8fafc' }}
        footer={
            <div style={{ padding: '8px 0' }}>
                <Input.Search
                    placeholder="Type a message to driver..."
                    enterButton={< ThunderboltOutlined />}
                    size="large"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onSearch={handleSendMessage}
                />
            </div>
        }
      >
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 40, color: '#94a3b8' }}>
                    <MessageOutlined style={{ fontSize: 32, opacity: 0.3 }} />
                    <p>No messages yet. Secure line active.</p>
                </div>
            )}
            {chatMessages.map(msg => (
                <div key={msg.id} style={{ 
                    alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: msg.sender === 'admin' ? '#3b82f6' : 'white',
                    color: msg.sender === 'admin' ? 'white' : '#1e293b',
                    padding: '10px 14px',
                    borderRadius: 16,
                    borderBottomRightRadius: msg.sender === 'admin' ? 2 : 16,
                    borderBottomLeftRadius: msg.sender === 'driver' ? 2 : 16,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <Text style={{ color: 'inherit', fontSize: 13 }}>{msg.text}</Text>
                    <div style={{ fontSize: 10, opacity: 0.6, textAlign: 'right', marginTop: 2 }}>{msg.time}</div>
                </div>
            ))}
        </div>
      </Drawer>

      <Drawer
        open={isCallVisible}
        onClose={() => setIsCallVisible(false)}
        closable={false}
        footer={null}
        width={320}
        styles={{ body: { padding: '40px 24px', textAlign: 'center', background: '#1e293b', color: 'white' } }}
      >
        <Avatar size={100} src={`https://picsum.photos/seed/${selectedDriver?.id}/200/200`} style={{ border: '4px solid #3b82f6', marginBottom: 20 }} />
        <Title level={3} style={{ color: 'white', margin: 0 }}>{selectedDriver?.name}</Title>
        <Text style={{ color: '#94a3b8', display: 'block', marginBottom: 20 }}>{selectedDriver?.id}</Text>
        
        <div style={{ marginBottom: 40 }}>
            <Badge status="processing" color="#10b981" text={<span style={{ color: '#10b981', fontWeight: 600 }}>{formatDuration(callDuration)}</span>} />
            <Text style={{ color: '#94a3b8', display: 'block', fontSize: 12 }}>Secure Voice Line Active</Text>
        </div>

        <Space size="large">
            <Button shape="circle" size="large" icon={<AudioOutlined />} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            <Button 
                shape="circle" 
                size="large" 
                danger 
                type="primary" 
                icon={<PhoneOutlined rotate={225} />} 
                onClick={() => {
                    setIsCallVisible(false);
                    message.error('Call Ended');
                }} 
            />
            <Button shape="circle" size="large" icon={<SettingOutlined />} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
        </Space>
      </Drawer>

      {/* Governance Action Drawer */}
      <Drawer
          title={<Space><WarningOutlined style={{ color: '#ef4444' }} /> <Text strong>Administrative Action: {governanceAction?.toUpperCase()}</Text></Space>}
          open={isGovernanceDrawerVisible}
          onClose={() => setIsGovernanceDrawerVisible(false)}
          width={400}
          extra={
              <Space>
                  <Button onClick={() => setIsGovernanceDrawerVisible(false)}>Cancel</Button>
                  <Button
                      type="primary"
                      danger
                      disabled={!governanceReason.trim() && (governanceReason !== 'Other' || !governanceCustomReason.trim())}
                      onClick={confirmGovernanceAction}
                  >
                      Confirm {governanceAction}
                  </Button>
              </Space>
          }
      >
          <div style={{ marginBottom: 24 }}>
              <Alert
                  title="Security Override"
                  description={`You are about to ${governanceAction} this ${governanceTargetType}. This action will be logged in the system audit trail.`}
                  type="warning"
                  showIcon
              />
          </div>

          <Title level={5}>Primary Rationale</Title>
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #f1f5f9' }}>
              <Select
                  placeholder="Select primary reason"
                  style={{ width: '100%', marginBottom: 16 }}
                  value={governanceReason}
                  onChange={setGovernanceReason}
              >
                  {governanceAction && SUGGESTED_REASONS[governanceAction].map(r => (
                      <Option key={r} value={r}>{r}</Option>
                  ))}
              </Select>

              {governanceReason === 'Other' && (
                  <Input.TextArea
                      placeholder="Please specify detailed reason..."
                      rows={4}
                      value={governanceCustomReason}
                      onChange={(e) => setGovernanceCustomReason(e.target.value)}
                  />
              )}
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#fef2f2', borderRadius: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                  Note: This action is immediate across all region clusters. The user/driver will be notified via in-app push notification.
              </Text>
          </div>
      </Drawer>

      {/* Profile Editing Drawer */}
      <Drawer
        title={`Edit ${editingProfileType === 'driver' ? 'Driver' : 'Customer'} Profile`}
        open={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        width={450}
        extra={
            <Button type="primary" onClick={() => {
                if (editingProfileType === 'driver' && editingDriver) {
                    setDrivers(prev => prev.map(d => d.id === editingDriver.id ? editingDriver : d));
                } else if (editingProfileType === 'customer' && editingCustomer) {
                    setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? editingCustomer : c));
                }
                setIsEditProfileVisible(false);
                message.success('Profile updated successfully.');
            }}>Save Changes</Button>
        }
      >
        {editingProfileType === 'driver' && editingDriver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <div><Text strong>Full Name</Text><Input value={editingDriver.name} onChange={e => setEditingDriver({...editingDriver, name: e.target.value})} /></div>
                <div><Text strong>Phone Number</Text><Input value={editingDriver.phone} onChange={e => setEditingDriver({...editingDriver, phone: e.target.value})} /></div>
                <div><Text strong>Email Address</Text><Input value={editingDriver.email} onChange={e => setEditingDriver({...editingDriver, email: e.target.value})} /></div>
            </div>
        )}
        {editingProfileType === 'customer' && editingCustomer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <div><Text strong>Full Name</Text><Input value={editingCustomer.name} onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})} /></div>
                <div><Text strong>Phone Number</Text><Input value={editingCustomer.phone} onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})} /></div>
                <div><Text strong>Email Address</Text><Input value={editingCustomer.email} onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})} /></div>
            </div>
        )}
      </Drawer>
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Trip Details #{selectedHistoryTrip?.id}</Title>}
            open={isHistoryModalVisible}
            onCancel={() => setIsHistoryModalVisible(false)}
            footer={[<Button key="close" onClick={() => setIsHistoryModalVisible(false)}>Close</Button>]}
            width={700}
            centered
        >
            {selectedHistoryTrip && (
                <div style={{ padding: '16px 0' }}>
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #f1f5f9', marginBottom: 24 }}>
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Text type="secondary" style={{ fontSize: 12 }}>ROUTE OVERVIEW</Text>
                                        <div style={{ marginTop: 12 }}>
                                            <Space direction="vertical" size={2}>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <Badge status="processing" color="#10b981" />
                                                    <Text strong>Avondale Shopping Centre</Text>
                                                </div>
                                                <div style={{ width: 1, height: 20, background: '#e2e8f0', marginLeft: 4 }} />
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <Badge status="error" color="#ef4444" />
                                                    <Text strong>Harare Central Business District</Text>
                                                </div>
                                            </Space>
                                        </div>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }}>
                                        <Tag color={selectedHistoryTrip.status === 'Completed' ? 'success' : 'error'} style={{ fontSize: 14, padding: '4px 12px' }}>
                                            {selectedHistoryTrip.status}
                                        </Tag>
                                        {selectedHistoryTrip.status === 'Cancelled' && (
                                            <div style={{ marginTop: 8 }}>
                                                {selectedHistoryTrip.payment === 'Paid' ? (
                                                    <Tag color="orange" icon={<RetweetOutlined />}>REFUNDED TO CUSTOMER</Tag>
                                                ) : (
                                                    <Tag color="default">NO CHARGE APPLIED</Tag>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            <Text type="secondary">{selectedHistoryTrip.date}</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col span={12}>
                            <Card size="small" title="Partner & Customer" variant="borderless" className="shadow-sm">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Partner</Text>
                                        <Text strong>{selectedHistoryTrip.driver}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Customer</Text>
                                        <Text strong>{selectedHistoryTrip.customer}</Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Payment</Text>
                                        <Tag color="blue">{selectedHistoryTrip.payment}</Tag>
                                    </div>
                                </Space>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card size="small" title="Financial Breakdown" variant="borderless" className="shadow-sm">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Base Fare</Text>
                                        <Text strong style={{ textDecoration: selectedHistoryTrip.status === 'Cancelled' ? 'line-through' : 'none' }}>
                                            ${selectedHistoryTrip.baseCost}
                                        </Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Tax (VAT)</Text>
                                        <Text strong style={{ textDecoration: selectedHistoryTrip.status === 'Cancelled' ? 'line-through' : 'none' }}>
                                            ${selectedHistoryTrip.tax}
                                        </Text>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>{selectedHistoryTrip.status === 'Cancelled' ? 'Original Total' : 'Total Gross'}</Text>
                                        <Text strong style={{ fontSize: 16, textDecoration: selectedHistoryTrip.status === 'Cancelled' ? 'line-through' : 'none' }}>
                                            ${selectedHistoryTrip.total}
                                        </Text>
                                    </div>
                                    {selectedHistoryTrip.status === 'Cancelled' && (
                                        <div style={{ textAlign: 'right', marginTop: 4 }}>
                                            <Text strong style={{ color: '#ef4444' }}>FINAL ADJUSTED: $0.00</Text>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Hub Commission</Text>
                                        <Text strong style={{ color: selectedHistoryTrip.status === 'Cancelled' ? '#94a3b8' : '#ef4444' }}>
                                            {selectedHistoryTrip.status === 'Cancelled' ? '$0.00 (Reversed)' : `-$${selectedHistoryTrip.comm}`}
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    </div>
  );
};



