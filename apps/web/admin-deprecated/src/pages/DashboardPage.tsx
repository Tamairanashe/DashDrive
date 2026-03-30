import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Card, Statistic, Table, Tag, Typography, 
  Button, Space, Select, Badge, Divider, Skeleton,
  Tooltip, Avatar, notification, App
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  CarOutlined, 
  DollarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  RocketOutlined,
  CoffeeOutlined,
  ShopOutlined,
  PushpinOutlined,
  KeyOutlined,
  SafetyOutlined,
  CompassOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  InfoCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { BaseMap } from '../components/BaseMap';
import { MarkerF, InfoWindowF, OverlayViewF, OverlayView } from '@react-google-maps/api';
import carMarker from '../assets/car-marker-topview.png';
import { useSocket } from '../context/SocketContext';

const { Title, Text } = Typography;

const SERVICES_STATS = [
  { id: 'ride', label: 'Ride Hailing', icon: <CarOutlined />, color: '#3b82f6', value: 842, trend: '+12%', status: 'Optimal', info: 'Current active rides including those in matching phase.' },
  { id: 'food', label: 'Food Delivery', icon: <CoffeeOutlined />, color: '#f59e0b', value: 312, trend: '+5%', status: 'High Demand', info: 'Food orders currently being prepared or out for delivery.' },
  { id: 'mart', label: 'Mart Delivery', icon: <ShopOutlined />, color: '#10b981', value: 156, trend: '-2%', status: 'Optimal', info: 'Grocery and essential items orders across all participating stores.' },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingCartOutlined />, color: '#8b5cf6', value: 89, trend: '+18%', status: 'Optimal', info: 'Active personal shopping requests and concierge services.' },
  { id: 'parcel', label: 'Parcel Delivery', icon: <PushpinOutlined />, color: '#ef4444', value: 245, trend: '+7%', status: 'Delayed', info: 'Package deliveries, currently experiencing slight delays due to weather/traffic.' },
  { id: 'hotels', label: 'Marketplace & Stays', icon: <ShopOutlined />, color: '#06b6d4', value: 42, trend: '+15%', status: 'Optimal', info: 'Active room bookings and marketplace transactions.' },
  { id: 'events', label: 'Events Booking', icon: <CalendarOutlined />, color: '#f43f5e', value: 18, trend: 'stable', status: 'Optimal', info: 'Confirmed tickets for upcoming events and experiences.' },
  { id: 'rental', label: 'Car Rental', icon: <KeyOutlined />, color: '#6366f1', value: 12, trend: '+3%', status: 'Optimal', info: 'Vehicles currently out on rental or reserved for immediate pickup.' },
  { id: 'transport', label: 'City to City', icon: <CompassOutlined />, color: '#14b8a6', value: 27, trend: '+9%', status: 'Optimal', info: 'Confirmed inter-city transport bookings for today.' },
  { id: 'school', label: 'School Run', icon: <SafetyOutlined />, color: '#f97316', value: 65, trend: '+4%', status: 'Optimal', info: 'Active school shuttle monitoring for the current session.' },
];

const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare', 'Chitungwiza'], 'Matabeleland': ['Bulawayo'] } },
  'United Kingdom': { regions: { 'Greater London': ['London'], 'West Midlands': ['Birmingham'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } }
};

export const DashboardPage: React.FC = () => {
  const { message, notification, modal } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
  const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
  const [selectedCity, setSelectedCity] = useState('Harare');
  const [timeRange, setTimeRange] = useState('Today');
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchData();
  }, [selectedCity, timeRange]);

  useEffect(() => {
    if (!socket) return;

    socket.on('platform_event', (data: any) => {
        const { event, payload, timestamp } = data;
        
        if (event === 'admin.entity.diff_updated') {
            handleLiveUpdate(payload);
        }
    });

    return () => {
        socket.off('platform_event');
    };
  }, [socket]);

  const handleLiveUpdate = (payload: any) => {
    const { entityType, entityId, action, diff } = payload;

    notification.info({
        message: 'Live Update',
        description: `New ${action.toLowerCase()} on ${entityType}: ${entityId}`,
        placement: 'bottomRight',
        duration: 3,
    });

    if (entityType === 'ORDER') {
        // Update stats
        setStats(prev => prev.map(s => {
            if (s.title === 'Active Orders') {
                return { ...s, value: (parseInt(s.value) + 1).toString(), trend: '+1' };
            }
            return s;
        }));

        // Add to log
        const newLogEntry = {
            id: entityId,
            service: 'Ride', // Simplified for demo
            amount: '$0.00',
            status: diff.status || 'Updated',
            city: selectedCity,
            time: 'Just now'
        };
        setRecentActivity(prev => [newLogEntry, ...prev.slice(0, 9)]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay for skeleton demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats = [
        { 
            title: 'Total Revenue (GMV)', 
            value: '$48,291', 
            trend: '+12.5%', 
            icon: <DollarOutlined />, 
            color: '#10b981',
            info: 'Total transaction value before any deductions.',
            link: '/finance/analytics'
        },
        { 
            title: 'Active Orders', 
            value: '142', 
            trend: '+8.2%', 
            icon: <ShoppingCartOutlined />, 
            color: '#3b82f6',
            info: 'Number of orders currently in progress across all services.',
            link: '/services/ride'
        },
        { 
            title: 'Pending Verify', 
            value: '12', 
            trend: 'Action Req', 
            icon: <UserOutlined />, 
            color: '#f59e0b',
            badge: '🟠',
            info: 'Partners awaiting document verification or KYC checks.',
            link: '/drivers/list'
        },
        { 
            title: 'Failed Payments', 
            value: '3', 
            trend: '-2.1%', 
            icon: <CloseCircleOutlined />, 
            color: '#ef4444',
            badge: '🔴',
            info: 'Transactions that failed due to gateway or user errors.',
            link: '/finance/settlements'
        }
      ];
      
      setStats(mockStats);
      setRecentActivity([
        { id: 'ORD-8821', service: 'Ride', amount: '$12.50', status: 'In Transit', city: 'Harare', time: '2m ago' },
        { id: 'ORD-8822', service: 'Food', amount: '$24.00', status: 'Completed', city: 'London', time: '5m ago' },
        { id: 'ORD-8823', service: 'Mart', amount: '$89.20', status: 'Delayed', city: 'Lagos', time: '12m ago' },
        { id: 'ORD-8824', service: 'Ride', amount: '$15.00', status: 'Completed', city: 'Harare', time: '15m ago' },
      ]);
    } catch (err) {
      message.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: '08:00', revenue: 4000, orders: 120 },
    { name: '10:00', revenue: 3000, orders: 90 },
    { name: '12:00', revenue: 5000, orders: 150 },
    { name: '14:00', revenue: 4500, orders: 130 },
    { name: '16:00', revenue: 6000, orders: 180 },
    { name: '18:00', revenue: 7500, orders: 220 },
    { name: '20:00', revenue: 8500, orders: 250 },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header with Hierarchical Filters */}
      <Card variant="borderless" className="shadow-sm" style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center" size="middle">
              <Title level={4} style={{ margin: 0 }}>Global Command Center</Title>
              <Divider orientation="vertical" />
              <Space>
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
            <Space>
              <Select 
                value={timeRange} 
                onChange={setTimeRange}
                suffixIcon={<CalendarOutlined />}
                style={{ width: 120 }}
              >
                <Select.Option value="Today">Today</Select.Option>
                <Select.Option value="7D">Last 7 Days</Select.Option>
                <Select.Option value="30D">Last 30 Days</Select.Option>
              </Select>
              <Button icon={<SyncOutlined spin={loading} />} onClick={fetchData} />
              <Badge status={isConnected ? 'success' : 'error'} text={isConnected ? 'Live' : 'Offline'} />
              <Button icon={<HistoryOutlined />} onClick={() => navigate('/enterprise/audit-logs')}>View Global Logs</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Widgets */}
      <Row gutter={[24, 24]}>
        {loading ? Array(4).fill(0).map((_, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card variant="borderless" className="shadow-sm"><Skeleton active paragraph={{ rows: 1 }} /></Card>
          </Col>
        )) : stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Badge.Ribbon text={stat.badge || ''} color={stat.color} style={{ display: stat.badge ? 'block' : 'none' }}>
              <Card 
                hoverable 
                variant="borderless" 
                className="shadow-sm" 
                onClick={() => navigate(stat.link)}
                style={{ borderRadius: 12 }}
              >
                <Statistic
                  title={
                    <Space size="small">
                      <Text type="secondary" strong>{stat.title}</Text>
                      <Tooltip title={stat.info}><InfoCircleOutlined style={{ fontSize: 12, color: '#ccd5e1' }} /></Tooltip>
                    </Space>
                  }
                  value={stat.value}
                  prefix={React.cloneElement(stat.icon as any, { style: { color: stat.color, marginRight: 8 } })}
                  styles={{ content: { fontWeight: 800, fontSize: 24 } }}
                />
                <div style={{ marginTop: 8 }}>
                  <Tag color={stat.trend.startsWith('+') ? 'success' : 'warning'} icon={stat.trend.startsWith('+') ? <ArrowUpOutlined /> : <WarningOutlined />} style={{ borderRadius: 4, border: 'none' }}>
                    {stat.trend}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>vs {timeRange === 'Today' ? 'Yesterday' : 'Prev Period'}</Text>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {/* Service Performance Grid */}
      <div style={{ marginTop: 32, marginBottom: 12 }}>
        <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RocketOutlined style={{ color: '#10b981' }} />
          Service Performance Analytics
          <Tooltip title="This grid shows the real-time activity and health status of all platform services. Optimal means systems are running normally.">
            <InfoCircleOutlined style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }} />
          </Tooltip>
        </Title>
        <Text type="secondary">Real-time monitoring across all active service verticals.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {SERVICES_STATS.map((service) => (
          <Col xs={24} sm={12} md={8} lg={4.8} key={service.id} style={{ flex: '0 0 20%', maxWidth: '20%' }}>
            <Card 
              className="service-stat-card shadow-sm"
              styles={{ body: { padding: '16px 12px' } }}
              hoverable
              style={{ borderRadius: 12, border: '1px solid #f1f5f9' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, background: `${service.color}15`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: service.color 
                }}>
                  {service.icon}
                </div>
                <Tooltip title={service.info}>
                   <Tag 
                    color={service.status === 'Optimal' ? 'success' : service.status === 'Delayed' ? 'error' : 'warning'}
                    style={{ fontSize: 10, margin: 0, borderRadius: 4, padding: '0 4px', border: 'none', cursor: 'help' }}
                  >
                    {service.status}
                  </Tag>
                </Tooltip>
              </div>
              
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', fontWeight: 600 }}>{service.label}</Text>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <Text style={{ fontSize: 18, fontWeight: 800 }}>{service.value.toLocaleString()}</Text>
                  <Text style={{ 
                    fontSize: 11, 
                    color: service.trend.startsWith('+') ? '#10b981' : service.trend === 'stable' ? '#94a3b8' : '#ef4444', 
                    fontWeight: 600 
                  }}>
                    {service.trend === 'stable' ? 'Stable' : service.trend}
                  </Text>
                </div>
              </div>
              
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                Active Volume
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Area */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Live Activity Map */}
        <Col lg={14} xs={24}>
          <Card 
            title={
                <Space>
                    <EnvironmentOutlined />
                    <Text strong>Live Activity Hub</Text>
                    <Badge status="processing" text="Real-time Feed" />
                </Space>
            }
            variant="borderless"
            className="shadow-sm"
            style={{ borderRadius: 12, overflow: 'hidden' }}
            styles={{ body: { padding: 0 } }}
            extra={<Button type="link" onClick={() => navigate('/dashboard/fleet')}>Expand View</Button>}
          >
            <BaseMap center={[-17.8248, 31.0530]} zoom={13} height={450}>
                <OverlayViewF position={{ lat: -17.8248, lng: 31.0530 }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <div style={{ transform: 'translate(-50%, -50%)', width: '100px', height: '100px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.3)' }} className="animate-pulse" />
                        <img 
                            src={carMarker} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.4))', transform: 'rotate(45deg)' }} 
                            alt="car" 
                        />
                    </div>
                </OverlayViewF>
                <InfoWindowF position={{ lat: -17.8248, lng: 31.0530 }}>
                    <div style={{ padding: '4px' }}>
                      <Text strong>RIDE-8821</Text><br/>
                      <Tag color="processing" style={{ marginTop: 4 }}>In Transit</Tag>
                    </div>
                </InfoWindowF>
                
                <OverlayViewF position={{ lat: -17.8100, lng: 31.0400 }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <div style={{ transform: 'translate(-50%, -50%)', width: '100px', height: '100px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', width: '60px', height: '60px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.3)' }} className="animate-pulse" />
                        <img 
                            src={carMarker} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 15px rgba(0,0,0,0.4))', transform: 'rotate(180deg)' }} 
                            alt="car" 
                        />
                    </div>
                </OverlayViewF>
                <InfoWindowF position={{ lat: -17.8100, lng: 31.0400 }}>
                    <div style={{ padding: '4px' }}>
                      <Text strong>D-202 (Sarah)</Text><br/>
                      <Tag color="success" style={{ marginTop: 4 }}>Online</Tag>
                    </div>
                </InfoWindowF>
            </BaseMap>
          </Card>
        </Col>

        {/* Dynamic Charts */}
        <Col lg={10} xs={24}>
          <Card 
            title="Revenue & Growth" 
            variant="borderless" 
            className="shadow-sm"
            style={{ borderRadius: 12, marginBottom: 24 }}
            extra={
              <Tooltip title="Platform revenue growth over the last 24 hours. Peak hourly volume highlighted below.">
                <InfoCircleOutlined style={{ color: '#cbd5e1' }} />
              </Tooltip>
            }
          >
            <div style={{ height: 180, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Peak Hourly Volume: <Text strong>$8,500</Text></Text>
            </div>
          </Card>

          <Card 
            title="Order Velocity" 
            variant="borderless" 
            className="shadow-sm"
            style={{ borderRadius: 12 }}
            extra={
              <Tooltip title="The rate at which new orders are being placed across all cities.">
                <InfoCircleOutlined style={{ color: '#cbd5e1' }} />
              </Tooltip>
            }
          >
            <div style={{ height: 156, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Table: Real-time Incidents/Activity */}
      <Card 
        title="Operations Log" 
        variant="borderless" 
        className="shadow-sm" 
        style={{ marginTop: 24, borderRadius: 12 }}
        extra={<Button type="link" onClick={() => navigate('/ops/logs')}>View Detailed Logs</Button>}
      >
        <Table 
          dataSource={recentActivity}
          loading={loading}
          pagination={false}
          size="middle"
          rowKey="id"
          columns={[
            {
              title: 'Order ID',
              dataIndex: 'id',
              key: 'id',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Service',
              dataIndex: 'service',
              key: 'service',
              render: (s) => <Tag color={s === 'Ride' ? 'blue' : 'orange'} style={{ border: 'none', borderRadius: 4 }}>{s}</Tag>
            },
            {
                title: 'Market',
                dataIndex: 'city',
                key: 'city',
                render: (c) => <Space><EnvironmentOutlined style={{ fontSize: 12, color: '#94a3b8' }} />{c}</Space>
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag 
                    style={{ border: 'none', borderRadius: 4 }}
                    color={status === 'Completed' ? 'success' : status === 'Delayed' ? 'error' : 'processing'}
                    icon={status === 'Completed' ? <CheckCircleOutlined /> : <SyncOutlined spin={status === 'In Transit'} />}
                >
                  {status}
                </Tag>
              )
            },
            {
              title: 'Value',
              dataIndex: 'amount',
              key: 'amount',
              render: (v) => <Text strong style={{ color: '#0e172a' }}>{v}</Text>
            }
          ]}
        />
      </Card>
    </div>
  );
};
