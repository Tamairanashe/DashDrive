import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Tabs, 
  Row, 
  Col, 
  Statistic,
  Avatar,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  LineChartOutlined, 
  MoreOutlined,
  ShopOutlined,
  AlertOutlined,
  WalletOutlined,
  StarOutlined
} from '@ant-design/icons';
import { adminApi } from '../api/adminApi';

const { Title, Text } = Typography;

export const MerchantListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMerchants();
  }, [activeTab]);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const statusMap: any = {
        'Pending Approval': 'PENDING',
        'Active': 'Active',
        'Suspended': 'Suspended'
      };
      const status = statusMap[activeTab];
      const response = await adminApi.stores.list({ status });
      setData(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
      // Mock fallback if API fails
      setData([
        { id: '1', name: 'Pick n Pay Hyper', owner_name: 'John Doe', regions: { name: 'Harare CBD' }, status: 'Active', is_active: true, logo_url: '' },
        { id: '2', name: 'OK Supermarket', owner_name: 'Jane Smith', regions: { name: 'Bulawayo Central' }, status: 'PENDING', is_active: false, logo_url: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Merchant Information',
      key: 'info',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            size={48} 
            src={record.logo_url} 
            icon={<ShopOutlined />} 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
          />
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Zone',
      dataIndex: ['regions', 'name'],
      key: 'zone',
      render: (text: string) => <Text strong>{text || 'Unassigned'}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: any = { 'FOOD': 'orange', 'MART': 'blue', 'SHOPPING': 'purple', 'DIRECT': 'cyan' };
        return <Tag color={colorMap[type] || 'default'}>{type || 'UNKNOWN'}</Tag>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        const status = record.status === 'PENDING' ? 'Pending' : (record.is_active ? 'Active' : 'Suspended');
        const color = status === 'Active' ? 'green' : (status === 'Pending' ? 'orange' : 'red');
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Performance',
      key: 'performance',
      render: () => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>$12,450</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>15% Commission</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Analytics">
            <Button type="text" icon={<LineChartOutlined />} />
          </Tooltip>
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  const stats = [
    { title: 'Total Partners', value: '1,240', icon: <ShopOutlined />, color: '#10b981' },
    { title: 'Pending Approval', value: '18', icon: <AlertOutlined />, color: '#f59e0b' },
    { title: 'Active Earnings', value: '$1.2M', icon: <WalletOutlined />, color: '#3b82f6' },
    { title: 'Avg Rating', value: '4.75', icon: <StarOutlined />, color: '#6366f1' },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Merchant Management</Title>
          <Text type="secondary">Administer grocery partners, approvals, and performance metrics</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
            Onboard New Merchant
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ 
                  width: 40, height: 40, background: `${stat.color}15`, 
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 20
                }}>
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} valueStyle={{ fontWeight: 800, fontSize: 24 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: 'All', label: 'All Merchants' },
              { key: 'Pending Approval', label: 'Pending Approval' },
              { key: 'Active', label: 'Active' },
              { key: 'Food', label: 'Food' },
              { key: 'Mart', label: 'Mart' },
              { key: 'Direct', label: 'Direct' },
              { key: 'Suspended', label: 'Suspended' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Search merchants..."
            style={{ width: 300, borderRadius: 8 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomRight'] }}
        />
      </Card>
    </div>
  );
};
