import React, { useState } from 'react';
import {
  Typography, Card, Tabs, Table, Tag,
  Button, Space, Form, Input, InputNumber, Divider,
  Empty, Badge, Row, Col, Switch, Select, message, DatePicker, TimePicker, Statistic, Drawer, Modal
} from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  PlusOutlined,
  SaveOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  CarOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const LOCATION_DATA: any = {
  'Zimbabwe': { regions: { 'Mashonaland': ['Harare'], 'Matabeleland': ['Bulawayo'] } },
  'Nigeria': { regions: { 'Lagos State': ['Lagos'], 'FCT': ['Abuja'] } },
  'South Africa': { regions: { 'Gauteng': ['Johannesburg'], 'Western Cape': ['Cape Town'] } }
};

export const RideHailingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
  const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
  const [selectedCity, setSelectedCity] = useState('Harare');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // InDrive-style mock data in State
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'RIDE-8821',
      customer: 'John Makoni',
      driver: 'Alex T.',
      pickup: '14 Samora Machel Ave',
      dropoff: 'Pizza Hub CBD',
      sysRecFare: 25.00,
      proposedFare: 22.50,
      bids: 4,
      status: 'Completed',
      time: '12:45 PM',
    },
    {
      id: 'RIDE-8822',
      customer: 'Grace C.',
      driver: '-',
      pickup: 'Avondale Shopping Center',
      dropoff: 'Borrowdale Village',
      sysRecFare: 12.50,
      proposedFare: 11.00,
      bids: 2,
      status: 'Bidding',
      time: '04:10 PM',
    },
    {
      id: 'RIDE-8826',
      customer: 'Simba O.',
      driver: '-',
      pickup: 'Harare CBD',
      dropoff: 'Bulawayo Center',
      sysRecFare: 120.00,
      proposedFare: 100.00,
      bids: 1,
      status: 'Bidding',
      time: '05:00 PM',
    }
  ]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.dropoff.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && o.status === statusFilter;
  });

  const tripStats = [
    { label: 'All trip', count: 48, key: 'All', color: '#64748b' },
    { label: 'Pending', count: 0, key: 'Pending', color: '#f59e0b' },
    { label: 'Scheduled', count: 1, key: 'Scheduled', color: '#10b981' },
    { label: 'Accepted', count: 0, key: 'Accepted', color: '#3b82f6' },
    { label: 'Ongoing', count: 0, key: 'Ongoing', color: '#8b5cf6' },
    { label: 'Completed', count: 41, key: 'Completed', color: '#22c55e' },
    { label: 'Cancelled', count: 4, key: 'Cancelled', color: '#ef4444' },
    { label: 'Returning', count: 0, key: 'Returning', color: '#f97316' },
    { label: 'Returned', count: 0, key: 'Returned', color: '#6366f1' },
  ];

  // State for interactive tables
  const [peakHours, setPeakHours] = useState<any[]>([
    { id: 1, day: 'Monday - Friday', time: '07:00 AM - 09:00 AM', multiplier: '1.5x', status: 'Active' },
    { id: 2, day: 'Monday - Friday', time: '04:30 PM - 06:30 PM', multiplier: '1.6x', status: 'Active' },
    { id: 3, day: 'Friday - Saturday', time: '10:00 PM - 02:00 AM', multiplier: '1.8x', status: 'Active' },
  ]);

  const [events, setEvents] = useState<any[]>([
    { id: 'ev1', name: 'National Independence Gala', date: 'April 18, 2024', zone: 'CBD Terminal', multiplier: '2.5x', status: 'Upcoming' },
    { id: 'ev2', name: 'Afro Jazz Festival', date: 'April 25, 2024', zone: 'Borrowdale/Avondale', multiplier: '2.0x', status: 'Upcoming' },
  ]);

  const [categories, setCategories] = useState<any[]>([
    { id: '1', name: 'Dash Eco', desc: 'Standard budget rides', multiplier: '1.0x', status: 'Active' },
    { id: '2', name: 'Dash Comfort', desc: 'Newer cars, more legroom', multiplier: '1.4x', status: 'Active' },
    { id: '3', name: 'DashX', desc: 'Luxury vehicles', multiplier: '2.5x', status: 'Active' },
    { id: '4', name: 'City-to-City', desc: 'Intercity travel', multiplier: '1.0x', status: 'Active' },
  ]);

  // Modal States
  const [isPeakDrawerOpen, setIsPeakDrawerOpen] = useState(false);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isBidsDrawerOpen, setIsBidsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Forms
  const [peakForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const handleSavePricing = (values: any) => {
    message.success('Global pricing and negotiation rules updated successfully.');
  };

  const handleSaveGlobalSurge = (values: any) => {
    message.success('Dynamic surge configuration updated.');
  };

  const handleAddPeakHour = (values: any) => {
    const newPeak = {
        id: Date.now(),
        day: values.day,
        time: `${values.timeRange[0].format('hh:mm A')} - ${values.timeRange[1].format('hh:mm A')}`,
        multiplier: `${values.multiplier}x`,
        status: 'Active'
    };
    setPeakHours([...peakHours, newPeak]);
    setIsPeakDrawerOpen(false);
    peakForm.resetFields();
    message.success('Peak hour block added.');
  };

  const handleAddEvent = (values: any) => {
    const newEvent = {
        id: `ev${Date.now()}`,
        name: values.name,
        date: values.date.format('MMMM DD, YYYY'),
        zone: values.zone,
        multiplier: `${values.multiplier}x`,
        status: 'Upcoming'
    };
    setEvents([...events, newEvent]);
    setIsEventDrawerOpen(false);
    eventForm.resetFields();
    message.success('Local event surge scheduled.');
  };

  const handleAddCategory = (values: any) => {
    const newCat = {
        id: `${Date.now()}`,
        name: values.name,
        desc: values.desc,
        multiplier: `${values.multiplier}x`,
        status: 'Active'
    };
    setCategories([...categories, newCat]);
    setIsCategoryDrawerOpen(false);
    categoryForm.resetFields();
    message.success('New vehicle category created.');
  };

  const handleViewBids = (record: any) => {
    setSelectedOrder(record);
    setIsBidsDrawerOpen(true);
  };

  const handleCancelRide = (record: any) => {
    Modal.confirm({
      title: 'Cancel Ride Order',
      content: `Are you sure you want to cancel ${record.id} for ${record.customer}?`,
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setOrders(orders.map(o => o.id === record.id ? { ...o, status: 'Cancelled' } : o));
        message.success(`Ride ${record.id} cancelled successfully.`);
      },
    });
  };

  const handleForceAssign = (record: any) => {
    Modal.confirm({
      title: 'Force Reassign Driver',
      content: `Are you sure you want to drop the current driver for ${record.id} and force it back to bidding?`,
      okText: 'Yes, Reassign',
      cancelText: 'No',
      onOk() {
        setOrders(orders.map(o => o.id === record.id ? { ...o, status: 'Bidding', driver: '-', bids: 0 } : o));
        message.success(`Ride ${record.id} thrown back into the bidding pool.`);
      },
    });
  };

  const columns = [
    { title: 'Ride ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Pickup', dataIndex: 'pickup', key: 'pickup' },
    { title: 'Dropoff', dataIndex: 'dropoff', key: 'dropoff' },
    { title: 'Sys Rec. Fare', dataIndex: 'sysRecFare', key: 'sysRecFare', render: (val: number) => <Text type="secondary">${val.toFixed(2)}</Text> },
    { title: 'Proposed Fare', dataIndex: 'proposedFare', key: 'proposedFare', render: (val: number) => <Text strong>${val.toFixed(2)}</Text> },
    { title: 'Bids', dataIndex: 'bids', key: 'bids', render: (val: number) => <Badge count={val} color="#1890ff" /> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'Completed') return <Badge status="success" text="Completed" />;
        if (status === 'Bidding') return <Badge color="blue" text="Bidding" />;
        if (status === 'Ongoing') return <Badge status="warning" text="Ongoing" />;
        if (status === 'Cancelled') return <Badge status="error" text="Cancelled" />;
        if (status === 'Scheduled') return <Badge status="processing" text="Scheduled" />;
        if (status === 'Accepted') return <Badge color="cyan" text="Accepted" />;
        if (status === 'Returning') return <Badge color="orange" text="Returning" />;
        if (status === 'Returned') return <Badge color="purple" text="Returned" />;
        return <Badge status="default" text={status} />;
      }
    },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} title="View Bids/Details" onClick={() => handleViewBids(record)} />
          <Button type="text" danger icon={<CloseCircleOutlined />} title="Cancel Ride" onClick={() => handleCancelRide(record)} disabled={record.status === 'Cancelled' || record.status === 'Completed'} />
          <Button type="text" icon={<RetweetOutlined />} title="Force Assign Driver" onClick={() => handleForceAssign(record)} disabled={record.status === 'Cancelled' || record.status === 'Completed'} />
        </Space>
      )
    }
  ];

  const items = [
    {
      key: 'orders',
      label: 'Trip Orders',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16 }}>
          {/* Status Bar */}
          <div style={{ 
            display: 'flex', 
            gap: 12, 
            overflowX: 'auto', 
            paddingBottom: 8,
            scrollbarWidth: 'none'
          }}>
            {tripStats.map(stat => (
              <div 
                key={stat.key}
                onClick={() => setStatusFilter(stat.key)}
                style={{
                  minWidth: 100,
                  padding: '12px 16px',
                  background: statusFilter === stat.key ? '#fff' : '#f8fafc',
                  borderRadius: 12,
                  border: `1px solid ${statusFilter === stat.key ? stat.color : '#e2e8f0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: statusFilter === stat.key ? `0 4px 12px ${stat.color}15` : 'none'
                }}
              >
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: statusFilter === stat.key ? stat.color : '#1e293b' }}>
                  {stat.count}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size="middle">
              <Input
                placeholder="Search by ID, Customer, or Location..."
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 400, borderRadius: 8 }}
              />
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Space>
            <Space>
              <Button icon={<RetweetOutlined />}>Refresh</Button>
              <Button type="primary" icon={<DownloadOutlined />}>Export CSV</Button>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            locale={{ emptyText: <Empty description="No rides recorded yet." /> }}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'pricing',
      label: 'Ride Pricing',
      children: (
        <Card bordered={false} className="shadow-sm">
          <Title level={5}>Global Pricing Configuration</Title>
          <Text type="secondary">Set base metrics used to calculate the System Recommended Fare.</Text>
          <Divider />
          <Form layout="vertical" onFinish={handleSavePricing} initialValues={{ baseFare: 3.5, perKm: 1.2, perMin: 0.15, minFare: 5.0, minBidFloor: 60, maxCounterOffer: 150, driverCommittingRate: 10 }}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item name="baseFare" label="Base Fare ($)">
                  <InputNumber style={{ width: '100%' }} prefix="$" step={0.5} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="perKm" label="Per Kilometer ($)">
                  <InputNumber style={{ width: '100%' }} prefix="$" step={0.1} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="perMin" label="Per Minute ($)">
                  <InputNumber style={{ width: '100%' }} prefix="$" step={0.05} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="minFare" label="Minimum Fare ($)">
                  <InputNumber style={{ width: '100%' }} prefix="$" step={0.5} />
                </Form.Item>
              </Col>
            </Row>

            <Divider dashed />
            
            <Title level={5}>InDrive Negotiation Limits</Title>
            <Text type="secondary">Define the constraints for passenger bids and driver counter-offers.</Text>
            <br/><br/>
            
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="minBidFloor" label="Minimum Bid Floor" help="Lowest % of recommended fare a rider can offer.">
                  <InputNumber style={{ width: '100%' }} addonAfter="%" step={5} max={100} min={10} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxCounterOffer" label="Max Driver Counter-Offer" help="Highest % of recommended fare a driver can counter.">
                  <InputNumber style={{ width: '100%' }} addonAfter="%" step={10} min={100} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="driverCommittingRate" label="Driver Committing Rate" help="DashDrive platform commission rate.">
                  <InputNumber style={{ width: '100%' }} addonAfter="%" step={1} max={50} min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ marginTop: 16 }}>Save Pricing & Negotiation Rules</Button>
          </Form>
        </Card>
      ),
    },
    {
      key: 'surge',
      label: 'Surge Settings',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Dynamic Surge Toggles */}
          <Card bordered={false} className="shadow-sm">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
               <Col>
                  <Title level={5} style={{ margin: 0 }}>Dynamic Surge Pricing</Title>
                  <Text type="secondary">Automatically apply multipliers during high demand.</Text>
               </Col>
               <Col>
                  <Switch checkedChildren="Surge Enabled" unCheckedChildren="Surge Disabled" defaultChecked />
               </Col>
            </Row>
            <Divider />
            <Form layout="vertical" onFinish={handleSaveGlobalSurge}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="threshold" label="High Demand Threshold" initialValue={20}>
                    <InputNumber addonAfter="requests/min" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="weather" label="Bad Weather Multiplier" initialValue={1.2}>
                    <InputNumber step={0.1} addonAfter="x" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                   <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ marginTop: 29 }} block>Update Global Surge Rules</Button>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* Peak Hour Scheduler */}
          <Card bordered={false} className="shadow-sm">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
               <Col>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                    <Title level={5} style={{ margin: 0 }}>Scheduled Peak Hours</Title>
                  </Space>
                  <br/>
                  <Text type="secondary">Define recurring time blocks with guaranteed multipliers.</Text>
               </Col>
               <Col>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsPeakDrawerOpen(true)}>Add Time Block</Button>
               </Col>
            </Row>
            <Table 
                dataSource={peakHours}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                    { title: 'Days', dataIndex: 'day', key: 'day', render: (t) => <Text strong>{t}</Text> },
                    { title: 'Time Window', dataIndex: 'time', key: 'time' },
                    { title: 'Multiplier', dataIndex: 'multiplier', key: 'multiplier', render: (t) => <Tag color="blue">{t}</Tag> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Badge status="success" text="Active" /> },
                    { title: 'Actions', key: 'actions', render: (_, record) => <Space><Button type="link" size="small">Edit</Button><Button type="link" danger size="small" onClick={() => { setPeakHours(peakHours.filter(p => p.id !== record.id)); message.success('Peak hour removed'); }}>Remove</Button></Space> }
                ]}
            />
          </Card>

          {/* Event Manager */}
          <Card bordered={false} className="shadow-sm">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
               <Col>
                  <Space>
                    <CalendarOutlined style={{ color: '#faad14', fontSize: 18 }} />
                    <Title level={5} style={{ margin: 0 }}>Local Event Surge</Title>
                  </Space>
                  <br/>
                  <Text type="secondary">Override standard pricing for specific dates and local events.</Text>
               </Col>
               <Col>
                   <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => setIsEventDrawerOpen(true)}>Add Event Surge</Button>
               </Col>
            </Row>
            <Table 
                dataSource={events}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                    { title: 'Event Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                    { title: 'Date', dataIndex: 'date', key: 'date' },
                    { title: 'Impact Zone', dataIndex: 'zone', key: 'zone' },
                    { title: 'Multiplier Override', dataIndex: 'multiplier', key: 'multiplier', render: (t) => <Tag color="gold">{t}</Tag> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Badge status="processing" text="Scheduled" /> },
                    { title: 'Actions', key: 'actions', render: (_, record) => <Space><Button type="link" size="small">Edit</Button><Button type="link" danger size="small" onClick={() => { setEvents(events.filter(e => e.id !== record.id)); message.success('Event removed'); }}>Remove</Button></Space> }
                ]}
            />
          </Card>
        </Space>
      ),
    },
    {
      key: 'categories',
      label: 'Ride Categories',
      children: (
        <Card bordered={false} className="shadow-sm">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={5} style={{ margin: 0 }}>Vehicle & Service Classes</Title>
                    <Text type="secondary">Manage passenger ride options.</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCategoryDrawerOpen(true)}>Add Category</Button>
                </Col>
            </Row>
            <Table 
                dataSource={categories}
                rowKey="id"
                pagination={false}
                columns={[
                    { title: 'Category Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                    { title: 'Description', dataIndex: 'desc', key: 'desc' },
                    { title: 'Base Multiplier', dataIndex: 'multiplier', key: 'multiplier' },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: () => <Tag color="green">Active</Tag> },
                    { title: 'Actions', key: 'actions', render: (_, record) => 
                        <Space>
                            <Button type="link">Edit</Button>
                            <Button type="link" danger onClick={() => { setCategories(categories.filter(c => c.id !== record.id)); message.success('Category removed'); }}>Remove</Button>
                        </Space> 
                    }
                ]}
            />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* View Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
            <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Ride Hailing Management</Title>
            <Text type="secondary" style={{ fontSize: 15 }}>Oversee ride operations, monitor active trips, and configure service pricing.</Text>
        </Col>
        <Col>
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
             </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Active Rides" 
              value={42} 
              prefix={<CarOutlined style={{ color: '#1890ff' }} />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Online Drivers" 
              value={156} 
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Avg. Bidding Fare" 
              value={18.40} 
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic 
              title="Completion Rate" 
              value={94.2} 
              suffix="%" 
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm" styles={{ body: { padding: '0 24px 24px 24px' } }}>
        <Tabs defaultActiveKey="orders" items={items} />
      </Card>

      {/* Modals */}
      <Drawer 
        title="Add Peak Hour Block" 
        open={isPeakDrawerOpen} 
        onClose={() => setIsPeakDrawerOpen(false)} 
        width={400}
        extra={<Button type="primary" onClick={() => peakForm.submit()}>Add Time Block</Button>}
      >
          <Form form={peakForm} layout="vertical" onFinish={handleAddPeakHour}>
              <Form.Item name="day" label="Active Days" rules={[{ required: true }]}>
                  <Select options={[{value: 'Monday - Friday', label: 'Monday - Friday'}, {value: 'Saturday - Sunday', label: 'Saturday - Sunday'}]} />
              </Form.Item>
              <Form.Item name="timeRange" label="Time Window" rules={[{ required: true }]}>
                  <TimePicker.RangePicker use12Hours format="h:mm a" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="multiplier" label="Multiplier Override" initialValue={1.5} rules={[{ required: true }]}>
                  <InputNumber step={0.1} min={1} addonAfter="x" style={{ width: '100%' }} />
              </Form.Item>
          </Form>
      </Drawer>

      <Drawer 
        title="Add Local Event Surge" 
        open={isEventDrawerOpen} 
        onClose={() => setIsEventDrawerOpen(false)} 
        width={400}
        extra={<Button type="primary" onClick={() => eventForm.submit()}>Add Event Surge</Button>}
      >
          <Form form={eventForm} layout="vertical" onFinish={handleAddEvent}>
              <Form.Item name="name" label="Event Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g. Afro Jazz Festival" />
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="zone" label="Impact Zone" rules={[{ required: true }]}>
                  <Input placeholder="e.g. Borrowdale" />
              </Form.Item>
              <Form.Item name="multiplier" label="Multiplier Override" initialValue={2.0} rules={[{ required: true }]}>
                  <InputNumber step={0.1} min={1} addonAfter="x" style={{ width: '100%' }} />
              </Form.Item>
          </Form>
      </Drawer>

      <Drawer 
        title="Add Vehicle Category" 
        open={isCategoryDrawerOpen} 
        onClose={() => setIsCategoryDrawerOpen(false)} 
        width={400}
        extra={<Button type="primary" onClick={() => categoryForm.submit()}>Add Category</Button>}
      >
          <Form form={categoryForm} layout="vertical" onFinish={handleAddCategory}>
              <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
                  <Input placeholder="e.g. DashX" />
              </Form.Item>
              <Form.Item name="desc" label="Description" rules={[{ required: true }]}>
                  <Input.TextArea placeholder="Describe the vehicle standard" rows={2} />
              </Form.Item>
              <Form.Item name="multiplier" label="Base Multiplier" initialValue={1.0} rules={[{ required: true }]}>
                  <InputNumber step={0.1} min={0.5} addonAfter="x" style={{ width: '100%' }} />
              </Form.Item>
          </Form>
      </Drawer>

      <Drawer 
          title={selectedOrder ? `Active Bids for ${selectedOrder.id}` : 'Active Bids'} 
          open={isBidsDrawerOpen} 
          onClose={() => setIsBidsDrawerOpen(false)} 
          width={700}
      >
          {selectedOrder && (
              <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">Passenger Proposed Fare: </Text>
                  <Text strong>${selectedOrder.proposedFare.toFixed(2)}</Text>
              </div>
          )}
          <Table 
              dataSource={[
                  { id: 'b1', name: 'Tendai M.', vehicle: 'Toyota Belta (Dash Eco)', bid: selectedOrder ? selectedOrder.proposedFare + 2 : 0, eta: '4 min' },
                  { id: 'b2', name: 'Samuel T.', vehicle: 'Honda Fit (Dash Eco)', bid: selectedOrder ? selectedOrder.proposedFare + 3.5 : 0, eta: '2 min' },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                  { title: 'Driver Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                  { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
                  { title: 'ETA', dataIndex: 'eta', key: 'eta' },
                  { title: 'Counter-Offer', dataIndex: 'bid', key: 'bid', render: (val: number) => <Text strong style={{ color: '#1890ff' }}>${val.toFixed(2)}</Text> },
                  { title: 'Action', key: 'action', render: () => <Button type="primary" size="small" disabled={selectedOrder?.status === 'Completed' || selectedOrder?.status === 'Cancelled'}>Force Accept</Button> }
              ]}
          />
      </Drawer>

    </div>
  );
};
