import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  AlertOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

const data = [
  { name: 'Mon', financing: 4000, insurance: 2400 },
  { name: 'Tue', financing: 3000, insurance: 1398 },
  { name: 'Wed', financing: 5000, insurance: 3800 },
  { name: 'Thu', financing: 4780, insurance: 3908 },
  { name: 'Fri', financing: 5890, insurance: 4800 },
  { name: 'Sat', financing: 6390, insurance: 3800 },
  { name: 'Sun', financing: 8490, insurance: 4300 },
];

export const Dashboard: React.FC = () => {
  const [syncData, setSyncData] = useState<{ products: any[], apps: any[] }>({ products: [], apps: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, appRes] = await Promise.all([
          fetch('http://localhost:3001/api/products'),
          fetch('http://localhost:3001/api/applications')
        ]);
        
        if (prodRes.ok && appRes.ok) {
          const products = await prodRes.json();
          const apps = await appRes.json();
          setSyncData({ products, apps });
        }
      } catch (err) {
        console.error('Ops Dashboard: Sync failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling every 10s for "live" feel
    return () => clearInterval(interval);
  }, []);

  const alertCols = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { 
      title: 'Severity', 
      dataIndex: 'severity', 
      key: 'severity',
      render: (sev: string) => <Tag color={sev === 'High' ? 'red' : sev === 'Medium' ? 'warning' : 'default'}>{sev}</Tag>
    }
  ];

  const alertData = [
    { key: '1', time: '10:42 AM', event: 'Suspicious multiple BNPL applications detected for User U-994', severity: 'High' },
    { key: '2', time: '09:15 AM', event: 'TransUnion API response latency > 2s', severity: 'Medium' },
    { key: '3', time: '08:30 AM', event: '$100k Loan Threshold breached for day (Vehicle Financing)', severity: 'Low' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Fintech Operations Dashboard</Title>
          <Text type="secondary">Global overview of DashDrive's financial ecosystem performance.</Text>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#1f1f1f', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Loans Issued</span>}
              value={4.2}
              precision={1}
              prefix={<BankOutlined style={{ color: '#1677ff', marginRight: 8 }} />}
              suffix="M"
              valueStyle={{ color: '#fff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> 12.5%</Text> <Text type="secondary">vs last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#1f1f1f', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Active Policies</span>}
              value={13000}
              prefix={<SafetyCertificateOutlined style={{ color: '#059669', marginRight: 8 }} />}
              valueStyle={{ color: '#fff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> 8.1%</Text> <Text type="secondary">vs last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#1f1f1f', borderRadius: 8 }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Fintech Revenue</span>}
              value={850.5}
              precision={1}
              prefix={<DollarOutlined style={{ color: '#722ed1', marginRight: 8 }} />}
              suffix="k"
              valueStyle={{ color: '#fff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="danger"><ArrowDownOutlined /> 1.2%</Text> <Text type="secondary">from missing SLA</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#1f1f1f', borderRadius: 8, borderColor: '#a8071a', borderWidth: 1, borderStyle: 'solid' }}>
            <Statistic
              title={<span style={{ color: '#ff4d4f' }}>Active Fraud Alerts</span>}
              value={5}
              prefix={<AlertOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Requires immediate action</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span style={{ color: '#fff' }}>Ecosystem Volume Trend (Loans vs Premiums)</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8, height: '100%' }}
            headStyle={{ borderBottom: '1px solid #303030' }}
          >
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#303030" />
                  <XAxis dataKey="name" stroke="#8c8c8c" />
                  <YAxis stroke="#8c8c8c" tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #303030', borderRadius: 6 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="financing" stroke="#1677ff" fillOpacity={1} fill="url(#colorFin)" name="Financing Volume" />
                  <Area type="monotone" dataKey="insurance" stroke="#059669" fillOpacity={1} fill="url(#colorIns)" name="Insurance Premium" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span style={{ color: '#fff' }}>Recent System Alerts</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8, height: '100%' }}
            headStyle={{ borderBottom: '1px solid #303030' }}
            bodyStyle={{ padding: 0 }}
          >
            <Table 
              columns={alertCols} 
              dataSource={alertData} 
              pagination={false} 
              size="small"
              style={{ background: 'transparent' }}
              rowClassName={() => 'dark-row'}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={<span style={{ color: '#fff' }}>Live Ecosystem Product Propagation</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8 }}
            extra={<Tag color="processing">Synced from Portals</Tag>}
          >
            <Table 
              size="small"
              loading={loading}
              dataSource={syncData.products}
              rowKey="id"
              pagination={false}
              columns={[
                { title: 'Product ID', dataIndex: 'id' },
                { title: 'Name', dataIndex: 'name', render: (t) => <Text strong style={{ color: '#fff' }}>{t}</Text> },
                { title: 'Source Partner', dataIndex: 'provider', render: (p) => <Tag color="blue">{p}</Tag> },
                { title: 'Type', dataIndex: 'type' },
                { 
                  title: 'Global Status', 
                  dataIndex: 'status',
                  render: (s) => <Badge status={s === 'Active' ? 'success' : 'default'} text={<span style={{ color: '#8c8c8c' }}>{s}</span>} />
                },
                { title: 'In-app Conversions', dataIndex: 'applications', align: 'right' }
              ]}
              style={{ background: 'transparent' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
