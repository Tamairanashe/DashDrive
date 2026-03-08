import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button, Space, message } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  CarOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import { EarningChart } from '../components/EarningChart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { analyticsApi } from '../api/analyticsApi';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('Lusaka');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, forecastRes] = await Promise.all([
          analyticsApi.getGlobalStats(),
          analyticsApi.getRecentActivity(5),
          analyticsApi.getDemandForecast(selectedCity)
        ]);

        const s = statsRes.data;
        const formattedStats = [
          { title: 'Total Revenue', value: '$4,968,533', trend: '+12.5%', icon: <DollarOutlined />, color: '#10b981' }, // Value still mocked for now if backend doesn't have it
          { title: 'Total Orders', value: s.totalOrders.toLocaleString(), trend: '+8.2%', icon: <ShoppingCartOutlined />, color: '#3b82f6' },
          { title: 'Active Users', value: s.activeUsers.toLocaleString(), trend: '+5.4%', icon: <UserOutlined />, color: '#6366f1' },
          { title: 'Active Drivers', value: s.activeRiders.toLocaleString(), trend: '+2.1%', icon: <CarOutlined />, color: '#f59e0b' },
        ];
        
        setStats(formattedStats);
        setForecastData(forecastRes.data.forecast.map((d: any) => ({
          time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          orders: d.predictedOrders
        })));

        // Map recent orders if backend returns them, otherwise use mockup for demo
        if (ordersRes.data?.length > 0) {
          setRecentOrders(ordersRes.data);
        } else {
          setRecentOrders([
            { id: 'ORD-001', service: 'Food', amount: '$45.00', status: 'Completed', time: '2 mins ago' },
            { id: 'ORD-002', service: 'Ride', amount: '$12.50', status: 'In Transit', time: '5 mins ago' },
            { id: 'ORD-003', service: 'Mart', amount: '$89.20', status: 'Completed', time: '12 mins ago' },
            { id: 'ORD-004', service: 'Parcel', amount: '$15.00', status: 'Pending', time: '15 mins ago' },
          ]);
        }
      } catch (err) {
        message.error('Failed to fetch dashboard metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { 
      title: 'Service', 
      dataIndex: 'service', 
      key: 'service', 
      render: (text: string) => {
        const colorMap: any = { 'Food': 'orange', 'Mart': 'blue', 'Direct': 'cyan', 'Ride': 'green', 'Parcel': 'purple' };
        return <Tag color={colorMap[text] || 'default'}>{text || 'Mart'}</Tag>;
      } 
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val: any) => val || '$0.00' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'Completed' || status === 'DELIVERED' ? 'green' : 'gold'}>{status || 'Completed'}</Tag>
    )},
    { title: 'Time', dataIndex: 'time', key: 'time' },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Title level={4} style={{ marginBottom: 24 }}>Operations Overview</Title>
      
      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} className="stat-card" loading={loading}>
              <Statistic
                title={<Text type="secondary" strong>{stat.title}</Text>}
                value={stat.value}
                prefix={React.cloneElement(stat.icon as any, { style: { color: stat.color, marginRight: 8 } })}
                valueStyle={{ fontWeight: 700 }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type={stat.trend.startsWith('+') ? 'success' : 'danger'} strong>
                  {stat.trend.startsWith('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stat.trend}
                </Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>from last month</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col lg={16} xs={24}>
          <Card 
            title="Revenue Analytics" 
            bordered={false}
            extra={<Button type="link">View Full Report</Button>}
          >
            <div style={{ height: 350 }}>
              <EarningChart />
            </div>
          </Card>
        </Col>
        <Col lg={8} xs={24}>
           <Card 
            title="Demand Forecast" 
            bordered={false}
            loading={loading}
            extra={
              <Space>
                <Tag color="purple">Alpha AI</Tag>
                <Button type="link">Details</Button>
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
               <Text type="secondary" style={{ fontSize: 12 }}>Predicted orders for the next 4 hours in {selectedCity}</Text>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text type="secondary">System confidence: 92%</Text>
               <Button size="small" type="dashed">Update Fleet Plan</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title="Recent Activity" 
            bordered={false}
            loading={loading}
            extra={<Button type="link">See All</Button>}
          >
            <Table 
              columns={columns} 
              dataSource={recentOrders} 
              pagination={false} 
              size="small" 
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
