import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Progress } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, StopOutlined, RetweetOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const RiskAdmin: React.FC = () => {
  const columns = [
    { title: 'Alert ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Target Entity', dataIndex: 'entity', key: 'entity', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Violation / Alert Type', dataIndex: 'type', key: 'type' },
    { 
      title: 'Heuristic Risk Score', 
      key: 'score',
      render: (_: any, record: any) => (
        <Space size="middle" style={{ width: '100%' }}>
          <Progress type="circle" percent={record.score} size={30} status={record.score > 80 ? 'exception' : 'active'} strokeWidth={10} />
          <Text style={{ color: record.score > 80 ? '#ff4d4f' : '#fff' }}>{record.score} / 100</Text>
        </Space>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Open' ? 'error' : status === 'Investigating' ? 'processing' : 'success'}>{status}</Tag>
    },
    { title: 'Generated', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<SafetyCertificateOutlined />}>Investigate</Button>
          <Button danger ghost size="small" icon={<StopOutlined />}>Freeze Entity</Button>
          <Button type="text" size="small" icon={<RetweetOutlined />} style={{ color: '#8c8c8c' }} />
        </Space>
      )
    }
  ];

  const data = [
    { key: '1', id: 'FRD-0091', entity: 'User U-1829', type: 'Velocity: 5 BNPL Apps in 1hr', score: 95, status: 'Open', date: '10 mins ago' },
    { key: '2', id: 'FRD-0092', entity: 'Driver D-402', type: 'Suspicious Document Upload (Identity)', score: 82, status: 'Investigating', date: '2 hrs ago' },
    { key: '3', id: 'FRD-0093', entity: 'Claim C-992', type: 'Geo-mismatch on Accident Report', score: 65, status: 'Open', date: '5 hrs ago' },
    { key: '4', id: 'FRD-0094', entity: 'Partner P-02', type: 'API Rate Limit Breach (Scraping?)', score: 88, status: 'Resolved', date: '1 day ago' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Risk & Fraud Control Center</Title>
          <Text type="secondary">System-wide heuristic alerts for anomalous behavior across loans, insurance, and platform access.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Alert ID or Entity..." style={{ width: 300 }} />
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
