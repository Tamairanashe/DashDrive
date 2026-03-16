import React, { useState } from 'react';
import { 
  Typography, Row, Col, Card, Table, Tag, 
  Button, Space, Statistic, Tabs, Badge, Avatar,
  Tooltip, Modal, Descriptions, Empty
} from 'antd';
import { 
  ShopOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Listing {
  id: string;
  host: string;
  title: string;
  type: string;
  price: number;
  status: 'pending' | 'active' | 'rejected';
  location: string;
  createdAt: string;
}

export const MarketplaceManagementPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('1');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [listings, setListings] = useState<Listing[]>([
    { id: 'L-001', host: 'Sarah Jenkins', title: 'Luxury Penthouse', type: 'Apartment', price: 250, status: 'pending', location: 'Harare, Central', createdAt: '2024-03-15' },
    { id: 'L-002', host: 'Michael Chen', title: 'Cozy Studio', type: 'Studio', price: 85, status: 'active', location: 'Bulawayo, Suburbs', createdAt: '2024-03-14' },
    { id: 'L-003', host: 'Anna Müller', title: 'Lakeside Villa', type: 'Villa', price: 450, status: 'active', location: 'Kariba', createdAt: '2024-03-12' },
    { id: 'L-004', host: 'David Zulu', title: 'Mountain Cabin', type: 'Cabin', price: 120, status: 'pending', location: 'Nyanga', createdAt: '2024-03-10' },
  ]);

  const handleApprove = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' } : l));
    setIsModalVisible(false);
  };

  const handleReject = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
    setIsModalVisible(false);
  };

  const showDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'LISTING',
      dataIndex: 'title',
      key: 'title',
      render: (t: string, r: Listing) => (
        <Space>
          <Avatar shape="square" size={48} icon={<ShopOutlined />} src={`https://api.dicebear.com/7.x/initials/svg?seed=${t}`} />
          <Space direction="vertical" size={0}>
            <Text strong>{t}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.type} • {r.id}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'HOST',
      dataIndex: 'host',
      key: 'host',
      render: (t: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{t}</Text>
        </Space>
      )
    },
    {
      title: 'LOCATION',
      dataIndex: 'location',
      key: 'location',
      render: (t: string) => <Space><EnvironmentOutlined /> {t}</Space>
    },
    {
      title: 'PRICE',
      dataIndex: 'price',
      key: 'price',
      render: (v: number) => <Text strong>${v}/night</Text>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'active' ? 'green' : s === 'pending' ? 'gold' : 'red'} style={{ borderRadius: 12, padding: '0 12px' }}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: any, r: Listing) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDetails(r)} />
          </Tooltip>
          {r.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button type="text" icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} onClick={() => handleApprove(r.id)} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button type="text" icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} onClick={() => handleReject(r.id)} />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Marketplace Management</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Moderate listings, verify hosts, and oversee marketplace health.</Text>
        </Col>
        <Col>
          <Space size="large">
            <Badge count={listings.filter(l => l.status === 'pending').length} offset={[10, 0]}>
              <Button icon={<SafetyCertificateOutlined />} size="large">Moderation Queue</Button>
            </Badge>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="TOTAL LISTINGS" value={1284} prefix={<ShopOutlined style={{ color: '#10b981' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="ACTIVE BOOKINGS" value={452} prefix={<CalendarOutlined style={{ color: '#3b82f6' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="AVG RATING" value={4.8} suffix="/ 5" prefix={<StarOutlined style={{ color: '#f59e0b' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <Statistic title="PENDING APPROVALS" value={listings.filter(l => l.status === 'pending').length} prefix={<SafetyCertificateOutlined style={{ color: '#ef4444' }} />} />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarExtraContent={
          <Space>
            <Button size="small">Filter</Button>
            <Button size="small" type="primary">Export</Button>
          </Space>
        }>
          <TabPane tab={<span><ShopOutlined />All Listings</span>} key="1">
            <Table columns={columns} dataSource={listings} rowKey="id" pagination={{ pageSize: 5 }} />
          </TabPane>
          <TabPane tab={<span><UserOutlined />Host Verification</span>} key="2">
            <Empty description="All host verification requests completed." style={{ padding: '40px 0' }} />
          </TabPane>
          <TabPane tab={<span><CalendarOutlined />Booking Oversite</span>} key="3">
            <Empty description="Live booking monitor data loading..." style={{ padding: '40px 0' }} />
          </TabPane>
          <TabPane tab={<span><StarOutlined />Reviews & Disputes</span>} key="4">
            <Empty description="No active disputes reported." style={{ padding: '40px 0' }} />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Listing Details</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
          selectedListing?.status === 'pending' && (
            <React.Fragment key="actions">
              <Button danger onClick={() => handleReject(selectedListing.id)}>Reject Listing</Button>
              <Button type="primary" onClick={() => handleApprove(selectedListing!.id)}>Approve Listing</Button>
            </React.Fragment>
          )
        ]}
        width={800}
      >
        {selectedListing && (
          <Row gutter={24}>
            <Col span={10}>
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedListing.title}`} 
                alt="Listing" 
                style={{ width: '100%', borderRadius: 12, marginBottom: 16 }}
              />
              <Card size="small" title="Host Information" variant="borderless" style={{ background: isDark ? '#2d2d2d' : '#f8fafc' }}>
                <Space direction="vertical">
                  <Space><UserOutlined /> <Text strong>{selectedListing.host}</Text></Space>
                  <Space><CheckCircleOutlined style={{ color: '#10b981' }} /> <Text type="secondary">ID Verified</Text></Space>
                  <Space><StarOutlined style={{ color: '#f59e0b' }} /> <Text type="secondary">4.9 (120 reviews)</Text></Space>
                  <Button size="small" icon={<MessageOutlined />} block>Contact Host</Button>
                </Space>
              </Card>
            </Col>
            <Col span={14}>
              <Descriptions title="Property Specifications" bordered column={1} size="small">
                <Descriptions.Item label="Property Type">{selectedListing.type}</Descriptions.Item>
                <Descriptions.Item label="Listing Title">{selectedListing.title}</Descriptions.Item>
                <Descriptions.Item label="Location">{selectedListing.location}</Descriptions.Item>
                <Descriptions.Item label="Price Tier">${selectedListing.price} / night</Descriptions.Item>
                <Descriptions.Item label="Max Occupancy">4 Guests</Descriptions.Item>
                <Descriptions.Item label="Safety Features">Smoke Alarm, Fire Extinguisher</Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 24 }}>
                <Text strong>Internal Notes</Text>
                <Text block type="secondary" style={{ marginTop: 8 }}>
                  Listing pending manual review of photo quality and location accuracy. 
                  Host has high reputation from previous listings.
                </Text>
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};
