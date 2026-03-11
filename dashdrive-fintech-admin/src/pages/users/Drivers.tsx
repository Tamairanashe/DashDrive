import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Progress } from 'antd';
import { SearchOutlined, CarOutlined, SafetyCertificateOutlined, AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Drivers: React.FC = () => {
  const columns = [
    { title: 'Driver ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { 
      title: 'Driver Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#fff' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>★ {record.rating}</Text>
        </Space>
      )
    },
    { 
      title: 'Active Loans', 
      dataIndex: 'loans', 
      key: 'loans',
      render: (loans: number) => loans > 0 ? <Tag color="blue">{loans} Active</Tag> : <Text type="secondary">None</Text>
    },
    { 
      title: 'Insurance', 
      dataIndex: 'insurance', 
      key: 'insurance',
      render: (status: string) => status === 'Covered' ? <Tag color="green"><SafetyCertificateOutlined /> Valid</Tag> : <Tag color="red"><AlertOutlined /> Expired</Tag>
    },
    { 
      title: 'Fintech Risk Tier', 
      key: 'risk',
      render: (_: any, record: any) => (
        <Space direction="vertical" style={{ width: 120 }} size={0}>
          <Progress percent={record.riskScore} size="small" status={record.riskScore > 80 ? 'exception' : record.riskScore > 50 ? 'active' : 'success'} showInfo={false} />
          <Text style={{ fontSize: 12, color: record.riskScore > 80 ? '#ff4d4f' : '#8c8c8c' }}>Score: {record.riskScore}/100</Text>
        </Space>
      )
    },
    { 
      title: 'Platform Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'error'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="default" size="small">Deep Dive Profile</Button>
    }
  ];

  const data = [
    { key: '1', id: 'DRV-10029', name: 'Marcus Johnson', rating: 4.8, loans: 1, insurance: 'Covered', riskScore: 25, status: 'Active' },
    { key: '2', id: 'DRV-10034', name: 'Elena Rodriguez', rating: 4.9, loans: 0, insurance: 'Covered', riskScore: 10, status: 'Active' },
    { key: '3', id: 'DRV-10088', name: 'David Kim', rating: 4.2, loans: 2, insurance: 'Expired', riskScore: 85, status: 'Suspended' },
    { key: '4', id: 'DRV-10102', name: 'Sarah Jenkins', rating: 4.7, loans: 1, insurance: 'Covered', riskScore: 45, status: 'Active' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Driver Financial Profiles</Title>
          <Text type="secondary">Monitor driver risk scores, active loans, and insurance compliance across the fleet.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search by Driver ID or Name..." style={{ width: 300 }} />
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
