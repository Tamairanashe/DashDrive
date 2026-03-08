import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Statistic, 
  message,
  Avatar,
  Tooltip,
  Badge
} from 'antd';
import { 
  AlertOutlined, 
  CheckCircleOutlined, 
  StopOutlined, 
  HistoryOutlined,
  UnlockOutlined,
  SafetyOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { analyticsApi } from '../api/analyticsApi';

const { Title, Text } = Typography;

export const FraudManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getRiskEvents();
      // If backend returns empty, use mock for demo
      if (res.data?.length > 0) {
        setEvents(res.data);
      } else {
        setEvents([
          { 
            id: 'RSK-102', 
            eventType: 'DELIVERY', 
            actorType: 'RIDER', 
            actorId: 'DRV-992', 
            riskScore: 85, 
            decision: 'BLOCKED', 
            reasons: ['Impossible speed detected (182km/h)'],
            createdAt: new Date().toISOString()
          },
          { 
            id: 'RSK-101', 
            eventType: 'WITHDRAWAL', 
            actorType: 'MERCHANT', 
            actorId: 'MRT-441', 
            riskScore: 45, 
            decision: 'REVIEW', 
            reasons: ['High value withdrawal request ($5,500)'],
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      title: 'Event Date', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => <Text type="secondary">{new Date(date).toLocaleString()}</Text>
    },
    { 
      title: 'Type', 
      dataIndex: 'eventType', 
      key: 'eventType',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: 'Actor', 
      key: 'actor',
      render: (_: any, record: any) => (
        <Space>
          <Avatar size="small" src={`https://picsum.photos/seed/${record.actorId}/100/100`} />
          <Text strong>{record.actorId}</Text>
          <Tag color="cyan">{record.actorType}</Tag>
        </Space>
      )
    },
    { 
      title: 'Risk Score', 
      dataIndex: 'riskScore', 
      key: 'riskScore',
      render: (score: number) => (
        <Badge count={score} style={{ backgroundColor: score >= 70 ? '#ef4444' : score >= 30 ? '#f59e0b' : '#10b981' }} />
      )
    },
    { 
      title: 'Decision', 
      dataIndex: 'decision', 
      key: 'decision',
      render: (decision: string) => (
        <Tag icon={decision === 'BLOCKED' ? <StopOutlined /> : <CheckCircleOutlined />} color={decision === 'BLOCKED' ? 'error' : decision === 'REVIEW' ? 'warning' : 'success'}>
          {decision}
        </Tag>
      )
    },
    { 
      title: 'Reasons', 
      dataIndex: 'reasons', 
      key: 'reasons',
      render: (reasons: string[]) => (
        <Space wrap>
          {reasons.map((r, i) => <Tag key={i} color="orange" style={{ fontSize: 10 }}>{r}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.decision === 'REVIEW' && <Button type="primary" size="small">Approve</Button>}
          {record.decision !== 'BLOCKED' && <Button danger size="small">Block</Button>}
          {record.decision === 'BLOCKED' && <Button ghost size="small" icon={<UnlockOutlined />}>Unfreeze</Button>}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Fraud & Protection Center</Title>
          <Text type="secondary">Monitor and manage platform-wide risk events and automated protection actions.</Text>
        </Col>
        <Col>
          <Button icon={<HistoryOutlined />} onClick={fetchEvents}>Refresh Logs</Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text strong type="secondary">Active Risk Alerts</Text>}
              value={events.filter(e => e.decision === 'REVIEW').length}
              prefix={<WarningOutlined style={{ color: '#f59e0b' }} />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text strong type="secondary">Automated Blocks (24h)</Text>}
              value={events.filter(e => e.decision === 'BLOCKED').length}
              prefix={<StopOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<Text strong type="secondary">System Safety Score</Text>}
              value={98.2}
              suffix="%"
              prefix={<SafetyOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false} 
        title={<Space><AlertOutlined /> Risk Event Ledger</Space>}
        className="shadow-sm"
      >
        <Table 
          columns={columns} 
          dataSource={events} 
          loading={loading}
          rowKey="id"
          size="middle"
        />
      </Card>
    </div>
  );
};
