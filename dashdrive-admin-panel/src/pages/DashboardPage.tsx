import React, { useEffect, useState } from 'react';
import { 
  Row, Col, Card, Statistic, Table, Tag, Typography, 
  Button, Space, message, Select, Badge, Divider, Skeleton,
  Tooltip, Avatar
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
  SyncOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { analyticsApi } from '../api/analyticsApi';

const { Title, Text } = Typography;

// Leaflet Icon Fix
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare', 'Chitungwiza'], 'Matabeleland': ['Bulawayo'] } },
  'United Kingdom': { regions: { 'Greater London': ['London'], 'West Midlands': ['Birmingham'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } }
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
  const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
  const [selectedCity, setSelectedCity] = useState('Harare');
  const [timeRange, setTimeRange] = useState('Today');
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay for skeleton demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStats = [
          { 
              title: 'Total Revenue', 
              value: '$48,291', 
              trend: '+12.5%', 
              icon: <DollarOutlined />, 
              color: '#10b981',
              link: '/finance/analytics'
          },
          { 
              title: 'Active Orders', 
              value: '142', 
              trend: '+8.2%', 
              icon: <ShoppingCartOutlined />, 
              color: '#3b82f6',
              link: '/verticals/ride-hailing'
          },
          { 
              title: 'Pending Verify', 
              value: '12', 
              trend: 'Action Req', 
              icon: <UserOutlined />, 
              color: '#f59e0b',
              badge: '🟠',
              link: '/management/drivers'
          },
          { 
              title: 'Failed Payments', 
              value: '3', 
              trend: '-2.1%', 
              icon: <CloseCircleOutlined />, 
              color: '#ef4444',
              badge: '🔴',
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

    fetchData();
  }, [selectedCity, timeRange]);

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
      <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center" size="middle">
              <Title level={4} style={{ margin: 0 }}>Global Command Center</Title>
              <Divider type="vertical" />
              <Space>
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
              <Button icon={<SyncOutlined spin={loading} />} onClick={() => window.location.reload()} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Widgets */}
      <Row gutter={[24, 24]}>
        {loading ? Array(4).fill(0).map((_, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-sm"><Skeleton active paragraph={{ rows: 1 }} /></Card>
          </Col>
        )) : stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Badge.Ribbon text={stat.badge || ''} color={stat.color} style={{ display: stat.badge ? 'block' : 'none' }}>
              <Card 
                hoverable 
                bordered={false} 
                className="shadow-sm" 
                onClick={() => navigate(stat.link)}
                style={{ borderRadius: 12 }}
              >
                <Statistic
                  title={<Text type="secondary" strong>{stat.title}</Text>}
                  value={stat.value}
                  prefix={React.cloneElement(stat.icon as any, { style: { color: stat.color, marginRight: 8 } })}
                  valueStyle={{ fontWeight: 800, fontSize: 24 }}
                />
                <div style={{ marginTop: 8 }}>
                  <Tag color={stat.trend.startsWith('+') ? 'success' : 'warning'} icon={stat.trend.startsWith('+') ? <ArrowUpOutlined /> : <WarningOutlined />}>
                    {stat.trend}
                  </Tag>
                </div>
              </Card>
            </Badge.Ribbon>
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
            bordered={false}
            className="shadow-sm"
            style={{ borderRadius: 12, overflow: 'hidden' }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ height: 450, width: '100%' }}>
              <MapContainer center={[-17.8248, 31.0530]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[-17.8248, 31.0530]}>
                  <Popup>
                    <Text strong>RIDE-8821</Text><br/>
                    <Tag color="processing">In Transit</Tag>
                  </Popup>
                </Marker>
                <Marker position={[-17.8100, 31.0400]}>
                  <Popup>
                    <Text strong>D-202 (Sarah)</Text><br/>
                    <Tag color="success">Online</Tag>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </Col>

        {/* Dynamic Charts */}
        <Col lg={10} xs={24}>
          <Card 
            title="Revenue & Growth" 
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 12, marginBottom: 24 }}
          >
            <div style={{ height: 180 }}>
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
                  <Tooltip />
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
            bordered={false} 
            className="shadow-sm"
            style={{ borderRadius: 12 }}
          >
            <div style={{ height: 156 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
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
        bordered={false} 
        className="shadow-sm" 
        style={{ marginTop: 24, borderRadius: 12 }}
        extra={<Button type="link" onClick={() => navigate('/system/logs')}>Full Audit Log</Button>}
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
              render: (s) => <Tag color={s === 'Ride' ? 'blue' : 'orange'}>{s}</Tag>
            },
            {
                title: 'Market',
                dataIndex: 'city',
                key: 'city',
                render: (c) => <Space><EnvironmentOutlined style={{ fontSize: 12 }} />{c}</Space>
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag 
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
              render: (v) => <Text strong>{v}</Text>
            }
          ]}
        />
      </Card>
    </div>
  );
};
