import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Progress } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const MarketingAdmin: React.FC = () => {
  const columns = [
    { title: 'Campaign Code', dataIndex: 'code', key: 'code', render: (text: string) => <Text style={{ fontFamily: 'monospace', color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Originator / Partner', dataIndex: 'partner', key: 'partner', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Product Type', dataIndex: 'product', key: 'product' },
    { 
      title: 'Budget Allocation', 
      key: 'budget',
      render: (_: any, record: any) => (
        <Space direction="vertical" style={{ width: '100%' }} size={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#fff' }}>${record.spent} spent</span>
            <span style={{ color: '#8c8c8c' }}>Total: ${record.budget}</span>
          </div>
          <Progress percent={Math.round((record.spent / record.budget) * 100)} size="small" showInfo={false} />
        </Space>
      )
    },
    { 
      title: 'Platform Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Active' ? 'success' : status === 'Pending Auth' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Compliance & Auth',
      key: 'action',
      render: (_: any, record: any) => (
        record.status === 'Pending Auth' ? (
          <Space>
            <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }}>Approve</Button>
            <Button danger size="small" icon={<CloseCircleOutlined />}>Reject</Button>
          </Space>
        ) : (
          <Button type="text" size="small" icon={<InfoCircleOutlined />} style={{ color: '#8c8c8c' }}>View Details</Button>
        )
      )
    }
  ];

  const data = [
    { key: '1', code: 'PROMO-QX99', partner: 'Capital Drive Bank', product: '0% APR Vehicle Loan', spent: 12000, budget: 50000, status: 'Active' },
    { key: '2', code: 'BONUS-Z11', partner: 'Allied Shield Ins.', product: 'Free Month Premium', spent: 0, budget: 15000, status: 'Pending Auth' },
    { key: '3', code: 'INTRNTL-BNPL', partner: 'DashDrive Internal', product: '$50 Credit Sign-up', spent: 45000, budget: 45000, status: 'Completed' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Marketing & Campaign Authorization</Title>
          <Text type="secondary">Review and authorize financial product promotion campaigns submitted by external partners.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Campaigns..." style={{ width: 250 }} />
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
