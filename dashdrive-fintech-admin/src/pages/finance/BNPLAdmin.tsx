import React from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Progress } from 'antd';
import { SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const BNPLAdmin: React.FC = () => {
  const columns = [
    { title: 'Account ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'User', dataIndex: 'user', key: 'user', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { 
      title: 'Credit Utilization', 
      key: 'utilization',
      render: (_: any, record: any) => {
        const percent = Math.round((record.used / record.limit) * 100);
        return (
          <Space direction="vertical" style={{ width: '100%' }} size={0}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#fff' }}>${record.used}</span>
              <span style={{ color: '#8c8c8c' }}>Limit: ${record.limit}</span>
            </div>
            <Progress percent={percent} size="small" showInfo={false} status={percent > 90 ? 'exception' : 'active'} />
          </Space>
        );
      }
    },
    { title: 'Active Plans', dataIndex: 'plans', key: 'plans' },
    { 
      title: 'Account Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Good Standing' ? 'success' : 'error'}>{status}</Tag>
    },
    {
      title: 'Controls',
      key: 'controls',
      render: (_: any, record: any) => (
        record.status === 'Good Standing' ? 
          <Button danger size="small" icon={<LockOutlined />}>Freeze Account</Button> :
          <Button type="primary" size="small" icon={<UnlockOutlined />}>Unfreeze</Button>
      )
    }
  ];

  const data = [
    { key: '1', id: 'BNPL-4021', user: 'Marcus Johnson', used: 350, limit: 500, plans: 2, status: 'Good Standing' },
    { key: '2', id: 'BNPL-4022', user: 'Elena Rodriguez', used: 950, limit: 1000, plans: 4, status: 'Good Standing' },
    { key: '3', id: 'BNPL-4023', user: 'David Kim', used: 500, limit: 500, plans: 3, status: 'Frozen (Delinquent)' },
    { key: '4', id: 'BNPL-4024', user: 'Sarah Jenkins', used: 50, limit: 1500, plans: 1, status: 'Good Standing' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>BNPL Credit Operations</Title>
          <Text type="secondary">Monitor utilization, active installment plans, and execute account freezes for DashDrive "Buy Now, Pay Later".</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Account or User..." style={{ width: 250 }} />
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
