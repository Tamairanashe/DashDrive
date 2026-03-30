import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Badge } from 'antd';
import { SearchOutlined, ApiOutlined, SafetyCertificateOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PartnersAdmin: React.FC = () => {
  const columns = [
    { title: 'Partner ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Organization Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { 
      title: 'Partner Domain', 
      dataIndex: 'domain', 
      key: 'domain',
      render: (domain: string) => <Tag color={domain === 'Lending' ? 'blue' : domain === 'Insurance' ? 'green' : 'purple'}>{domain}</Tag>
    },
    { 
      title: 'API Status / Health', 
      key: 'health',
      render: (_: any, record: any) => (
        <Space>
          <Badge status={record.health === 'Online' ? 'success' : 'error'} />
          <Text style={{ color: '#fff' }}>{record.health}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>({record.latency}ms)</Text>
        </Space>
      )
    },
    { 
      title: 'Integration Level', 
      dataIndex: 'level', 
      key: 'level',
      render: (level: string) => <Text style={{ color: '#fff' }}>{level}</Text>
    },
    {
      title: 'Controls',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" ghost size="small" icon={<ApiOutlined />}>API Logs</Button>
          <Button danger ghost size="small" icon={<StopOutlined />}>Revoke Keys</Button>
        </Space>
      )
    }
  ];

  const data = [
    { key: '1', id: 'PRT-101', name: 'Capital Drive Bank', domain: 'Lending', health: 'Online', latency: 45, level: 'Full Read/Write' },
    { key: '2', id: 'PRT-102', name: 'Allied Shield Ins.', domain: 'Insurance', health: 'Online', latency: 62, level: 'Full Read/Write' },
    { key: '3', id: 'PRT-103', name: 'TransUnion Africa', domain: 'Credit Bureau', health: 'Degraded', latency: 1250, level: 'Read Only (Queries)' },
    { key: '4', id: 'PRT-104', name: 'Stripe Connect', domain: 'Payments', health: 'Online', latency: 20, level: 'System Critical' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Partner Portal Governance</Title>
          <Text type="secondary">Manage API access credentials and monitor webhook health for all external institutional partners.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Partners..." style={{ width: 250 }} />
            <Button type="primary" style={{ background: '#722ed1', borderColor: '#722ed1' }}>Provision New Partner</Button>
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        style={{ background: '#1f1f1f', borderRadius: 8 }}
      />
    </div>
  );
};
