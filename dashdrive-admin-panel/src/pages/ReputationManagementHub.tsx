import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Typography, Card, Badge, Row, Col, 
  Tabs, Statistic, Drawer, Descriptions, Alert, Input, Form,
  Timeline, Divider, message, List, Progress, Avatar,
  Select, Rate, Empty, Tooltip, Segmented, Checkbox
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  StarOutlined, CommentOutlined, SafetyCertificateOutlined, LineChartOutlined,
  UserOutlined, ShopOutlined, CarOutlined, WarningOutlined,
  CheckCircleOutlined, InfoCircleOutlined, FilterOutlined,
  EyeOutlined, FlagOutlined, StopOutlined, RocketOutlined,
  DashboardOutlined, TeamOutlined, BarChartOutlined,
  ClockCircleOutlined, GlobalOutlined, MobileOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;

interface ReviewRecord {
  key: string;
  reviewId: string;
  service: string;
  customer: string;
  partner: string;
  partnerType: 'Driver' | 'Merchant';
  rating: number;
  comment: string;
  date: string;
  status: 'Active' | 'Reported' | 'Hidden';
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface PartnerReputation {
  key: string;
  id: string;
  name: string;
  type: 'Driver' | 'Merchant';
  avgRating: number;
  totalTasks: number;
  complaints: number;
  trustScore: number;
  status: 'Excellent' | 'Warning' | 'Suspension Risk';
}

export const ReputationManagementHub: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = '1' }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (key: string) => {
    const routeMap: Record<string, string> = {
      '1': '/quality/reviews',
      '2': '/quality/feedback',
      '3': '/quality/moderation',
      '4': '/quality/analytics',
    };
    if (routeMap[key]) {
      navigate(routeMap[key]);
    }
  };

  const reviews: ReviewRecord[] = [
    {
      key: 'rv1',
      reviewId: 'RV-3445',
      service: 'Ride Hailing',
      customer: 'John M.',
      partner: 'Driver 456 (Sam K.)',
      partnerType: 'Driver',
      rating: 4,
      comment: 'Very professional, but vehicle was slightly dusty. Arrived on time.',
      date: '12 Mar, 10:20',
      status: 'Active',
      riskLevel: 'Low'
    },
    {
      key: 'rv2',
      reviewId: 'RV-3448',
      service: 'Food Delivery',
      customer: 'Alice W.',
      partner: 'Mama Mia Pizzeria',
      partnerType: 'Merchant',
      rating: 1,
      comment: 'Food was cold and arrived 40 minutes late. Highly disappointed.',
      date: '12 Mar, 12:45',
      status: 'Reported',
      riskLevel: 'High'
    },
    {
      key: 'rv3',
      reviewId: 'RV-3450',
      service: 'Mart Delivery',
      customer: 'Elena S.',
      partner: 'Quick Mart Downtown',
      partnerType: 'Merchant',
      rating: 5,
      comment: 'Excellent service! The shopper called me to suggest alternatives for out-of-stock items.',
      date: '13 Mar, 09:15',
      status: 'Active',
      riskLevel: 'Low'
    }
  ];

  const partnerReputations: PartnerReputation[] = [
    {
      key: 'p1',
      id: 'DRV-123',
      name: 'Michael Chen',
      type: 'Driver',
      avgRating: 4.88,
      totalTasks: 1240,
      complaints: 2,
      trustScore: 96,
      status: 'Excellent'
    },
    {
      key: 'p2',
      id: 'MER-88',
      name: 'Burger Galaxy',
      type: 'Merchant',
      avgRating: 3.9,
      totalTasks: 2500,
      complaints: 45,
      trustScore: 68,
      status: 'Warning'
    },
    {
      key: 'p3',
      id: 'DRV-789',
      name: 'Jackson Lee',
      type: 'Driver',
      avgRating: 3.2,
      totalTasks: 150,
      complaints: 12,
      trustScore: 42,
      status: 'Suspension Risk'
    }
  ];

  const reviewColumns = [
    {
      title: 'Review ID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      render: (text: string) => <Text strong code>{text}</Text>
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service: string) => (
        <Space>
          {service.includes('Ride') ? <CarOutlined /> : <ShopOutlined />}
          <Text>{service}</Text>
        </Space>
      )
    },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Partner', dataIndex: 'partner', key: 'partner' },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 12 }} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Reported' ? 'red' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ReviewRecord) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => setSelectedReview(record)} />
          </Tooltip>
          <Button size="small" icon={<FlagOutlined />} danger={record.status === 'Reported'} />
        </Space>
      )
    }
  ];

  const partnerColumns = [
    {
      title: 'Partner',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: PartnerReputation) => (
        <Space>
          <Avatar icon={record.type === 'Driver' ? <UserOutlined /> : <ShopOutlined />} />
          <div>
            <Text strong>{name}</Text><br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      )
    },
    { title: 'Avg Rating', dataIndex: 'avgRating', key: 'avgRating', render: (r: number) => <Text strong>{r} ⭐</Text> },
    {
      title: 'Trust Score',
      dataIndex: 'trustScore',
      key: 'trustScore',
      render: (score: number) => (
        <div style={{ width: 100 }}>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={score > 85 ? '#52c41a' : score > 60 ? '#faad14' : '#ff4d4f'} 
          />
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'Excellent' ? 'success' : status === 'Warning' ? 'warning' : 'error'} 
          text={<Text style={{ fontSize: 12 }}>{status}</Text>} 
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PartnerReputation) => (
        <Button size="small" type="link">Manage Quality</Button>
      )
    }
  ];

  const renderAnalytics = () => (
    <div style={{ padding: 16 }}>
       <Row gutter={[16, 16]}>
          <Col span={12}>
             <Card variant="borderless" style={{ background: isDark ? '#141414' : '#fafafa', borderRadius: 16 }} title="Rating Distribution (Global)">
                <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 20 }}>
                   {[65, 20, 10, 3, 2].map((h, i) => (
                     <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ background: '#1890ff', height: `${h * 2}px`, width: 40, borderRadius: '4px 4px 0 0' }}></div>
                        <Text style={{ fontSize: 10 }}>{5-i} ★</Text>
                     </div>
                   ))}
                </div>
             </Card>
          </Col>
          <Col span={12}>
             <Card variant="borderless" style={{ background: isDark ? '#141414' : '#fafafa', borderRadius: 16 }} title="Service Quality Trends">
                <div style={{ height: 200, background: isDark ? '#1a1a1a' : '#f0f2f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Text type="secondary">[ QUALITY KPI CHART ]</Text>
                </div>
             </Card>
          </Col>
          <Col span={24}>
             <Card variant="borderless" style={{ background: isDark ? '#141414' : '#fafafa', borderRadius: 16 }} title="Top Quality Risks (By City)">
                <Table 
                   size="small"
                   pagination={false}
                   dataSource={[
                     { city: 'Harare', risk: 'High', cause: 'Delivery Delay', partners: 12 },
                     { city: 'Bulawayo', risk: 'Medium', cause: 'Driver Cancellation', partners: 45 },
                     { city: 'Mutare', risk: 'Low', cause: 'Order Accuracy', partners: 8 }
                   ]}
                   columns={[
                     { title: 'City', dataIndex: 'city', key: 'city' },
                     { title: 'Risk Level', dataIndex: 'risk', key: 'risk', render: (r) => <Tag color={r === 'High' ? 'red' : 'orange'}>{r}</Tag> },
                     { title: 'Principal Cause', dataIndex: 'cause', key: 'cause' },
                     { title: 'Partners Affected', dataIndex: 'partners', key: 'partners' }
                   ]}
                />
             </Card>
          </Col>
       </Row>
    </div>
  );

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={3}><StarOutlined /> Quality & Reputation Hub</Title>
          <Paragraph type="secondary">Centralized monitoring of customer trust, partner performance, and automated quality actions</Paragraph>
        </div>
        <Space>
           <Button icon={<SafetyCertificateOutlined />}>Moderation Settings</Button>
           <Button type="primary" icon={<ThunderboltOutlined />}>Trigger Quality Audit</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
           <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)' }}>
              <Statistic 
                title={<Text style={{ color: '#ffffffcc' }}>Global Trust Score</Text>} 
                value={91.4} 
                precision={1} 
                suffix="%" 
                valueStyle={{ color: '#fff', fontSize: 28 }}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
              <Text style={{ color: '#ffffff88', fontSize: 12 }}>+0.4% from last month</Text>
           </Card>
        </Col>
        <Col span={6}>
           <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <Statistic 
                title="Service Integrity" 
                value={98.2} 
                suffix="%" 
                prefix={<SafetyCertificateOutlined style={{ color: '#1890ff' }} />}
              />
              <Progress percent={98.2} size="small" showInfo={false} />
           </Card>
        </Col>
        <Col span={6}>
           <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <Statistic 
                title="Pending Moderation" 
                value={14} 
                prefix={<Badge dot offset={[5, 0]}><FlagOutlined style={{ color: '#faad14' }} /></Badge>}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>Avg response time: 4.2h</Text>
           </Card>
        </Col>
        <Col span={6}>
           <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <Statistic 
                title="Negative Reports" 
                value={3} 
                suffix="/ 1k orders" 
                prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />} 
              />
              <Tag color="error">Critical Threshold: 5</Tag>
           </Card>
        </Col>

        <Col span={24}>
           <Card 
             variant="borderless" 
             className="shadow-sm premium-tabs" 
             style={{ borderRadius: 16, minHeight: 600 }}
           >
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                  {
                    key: '1',
                    label: <Space><CommentOutlined /> Reviews & Ratings</Space>,
                    children: (
                      <div>
                        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                          <Input.Search placeholder="Search reviews by content, partner, or customer..." style={{ maxWidth: 400 }} />
                          <Select defaultValue="all" style={{ width: 150 }} options={[
                            { label: 'All Services', value: 'all' },
                            { label: 'Ride Hailing', value: 'ride' },
                            { label: 'Food Delivery', value: 'food' }
                          ]} />
                          <Segmented options={['All', '5★', '4★', '3★', '2★', '1★']} />
                        </div>
                        <Table 
                          dataSource={reviews} 
                          columns={reviewColumns} 
                          pagination={{ pageSize: 8 }}
                          size="middle"
                        />
                      </div>
                    )
                  },
                  {
                    key: '2',
                    label: <Space><TeamOutlined /> Partner Feedback</Space>,
                    children: (
                      <div>
                        <Alert 
                          message="Quality Monitoring Active"
                          description="Drivers and Merchants with trust scores below 70 are automatically flagged for operations review."
                          type="info"
                          showIcon
                          style={{ marginBottom: 20 }}
                        />
                        <Table 
                          dataSource={partnerReputations} 
                          columns={partnerColumns} 
                          pagination={{ pageSize: 10 }}
                        />
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: <Space><Badge count={14} size="small" offset={[10, 0]}><SafetyCertificateOutlined /></Badge> Moderation Queue</Space>,
                    children: (
                      <List
                        dataSource={reviews.filter(r => r.status === 'Reported')}
                        renderItem={item => (
                          <Card size="small" style={{ marginBottom: 12 }}>
                             <Row align="middle">
                               <Col span={18}>
                                  <Space direction="vertical">
                                     <Space>
                                        <Tag color="red">REPORTED</Tag>
                                        <Text strong>{item.customer} vs {item.partner}</Text>
                                        <Text type="secondary" style={{ fontSize: 11 }}>Reason: Abusive Language Flagged by AI</Text>
                                     </Space>
                                     <Paragraph italic style={{ margin: '8px 0', background: isDark ? '#2d2d2d' : '#f9f9f9', padding: 8, borderRadius: 4 }}>
                                        "{item.comment}"
                                     </Paragraph>
                                  </Space>
                               </Col>
                               <Col span={6} style={{ textAlign: 'right' }}>
                                  <Space>
                                     <Button size="small">Keep</Button>
                                     <Button size="small" danger type="primary">Hide Review</Button>
                                     <Button size="small" danger>Warn User</Button>
                                  </Space>
                               </Col>
                             </Row>
                          </Card>
                        )}
                      />
                    )
                  },
                  {
                    key: '4',
                    label: <Space><LineChartOutlined /> Reputation Analytics</Space>,
                    children: renderAnalytics()
                  }
                ]}
              />
           </Card>
        </Col>
      </Row>

      {/* Review Detail Drawer */}
      <Drawer
        title={<Space><StarOutlined /> Review Investigation: {selectedReview?.reviewId}</Space>}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        width={800}
        extra={
          <Space>
            <Button key="order" onClick={() => setSelectedReview(null)}>View Related Order</Button>
            <Button key="support" type="primary" onClick={() => {
              message.success('Support case created successfully');
              setSelectedReview(null);
            }}>Create Support Case</Button>
          </Space>
        }
      >
        {selectedReview && (
          <Row gutter={24}>
            <Col span={16}>
               <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Service">{selectedReview.service}</Descriptions.Item>
                  <Descriptions.Item label="Rating"><Rate disabled defaultValue={selectedReview.rating} /></Descriptions.Item>
                  <Descriptions.Item label="Comment">
                     <Paragraph style={{ minHeight: 100 }}>{selectedReview.comment}</Paragraph>
                  </Descriptions.Item>
               </Descriptions>
               <Divider style={{ margin: '16px 0' }} />
               <Title level={5}>AI Sentiment Analysis</Title>
               <div style={{ display: 'flex', gap: 16 }}>
                  <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
                     <Statistic title="Tone" value="Passive-Aggressive" valueStyle={{ fontSize: 14 }} />
                  </Card>
                  <Card size="small" style={{ flex: 1, textAlign: 'center' }}>
                     <Statistic title="Authenticity" value={98} suffix="%" valueStyle={{ fontSize: 14, color: '#52c41a' }} />
                  </Card>
               </div>
            </Col>
            <Col span={8}>
               <Title level={5}>Related Entities</Title>
               <Card size="small" hoverable style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                       <Avatar icon={<UserOutlined />} />
                       <div>
                          <Text strong>{selectedReview.customer}</Text><br />
                          <Text type="secondary" style={{ fontSize: 11 }}>Trusted User (Score: 92)</Text>
                       </div>
                    </Space>
                  </Space>
               </Card>
               <Card size="small" hoverable>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                       <Avatar icon={<CarOutlined />} />
                       <div>
                          <Text strong>{selectedReview.partner}</Text><br />
                          <Text type="secondary" style={{ fontSize: 11 }}>Reputation: Warning</Text>
                       </div>
                    </Space>
                  </Space>
               </Card>
               <Alert 
                  style={{ marginTop: 24 }}
                  message="Proactive Suggestion"
                  description="This partner has received 3 similar complaints this week. Recommend temporary suspension."
                  type="warning"
                  showIcon
               />
            </Col>
          </Row>
        )}
      </Drawer>
    </div>
  );
};
