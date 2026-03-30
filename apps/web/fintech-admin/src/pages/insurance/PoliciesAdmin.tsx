import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, AlertOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PoliciesAdmin: React.FC = () => {
  const columns = [
    { title: 'System Policy ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Provider', dataIndex: 'provider', key: 'provider' },
    { title: 'Policyholder', dataIndex: 'user', key: 'user', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Product Type', dataIndex: 'type', key: 'type' },
    { title: 'Max Coverage Limit', dataIndex: 'coverage', key: 'coverage' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Active' ? 'success' : status === 'Lapsed' ? 'error' : 'default';
        let icon = status === 'Active' ? <SafetyCertificateOutlined /> : <AlertOutlined />;
        return <Tag color={color} icon={icon}>{status}</Tag>;
      }
    },
    { title: 'Start Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="default" size="small" style={{ background: 'transparent', color: '#fff', borderColor: '#303030' }}>View Details</Button>
    }
  ];

  const data = [
    { key: '1', id: 'POL-99482', provider: 'Allied Shield Ins.', user: 'Elena Rodriguez', type: 'Driver Incident', coverage: '$100,000', status: 'Active', date: '2026-05-12' },
    { key: '2', id: 'POL-99483', provider: 'DashDrive Internal', user: 'Marcus Johnson', type: 'Trip Liability', coverage: '$50,000', status: 'Active', date: '2026-08-01' },
    { key: '3', id: 'POL-99484', provider: 'AutoGuard Partners', user: 'David Kim', type: 'Vehicle Damage', coverage: '$25,000', status: 'Lapsed', date: '2025-11-20' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Global Policy Ledger</Title>
          <Text type="secondary">Centralized view of all active and historical insurance contracts across external providers and internal products.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Policy ID, User, or Provider..." style={{ width: 350 }} />
            <Button icon={<DownloadOutlined />}>Export Ledger</Button>
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
