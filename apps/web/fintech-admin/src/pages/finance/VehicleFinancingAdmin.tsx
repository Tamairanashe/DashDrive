import React from 'react';
import { Typography, Row, Col, Table, Tag, Space, Button, Progress } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const VehicleFinancingAdmin: React.FC = () => {
  const columns = [
    { title: 'Vehicle VIN', dataIndex: 'vin', key: 'vin', render: (text: string) => <Text style={{ fontFamily: 'monospace', color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Driver/Owner', dataIndex: 'driver', key: 'driver', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Asset Value', dataIndex: 'value', key: 'value' },
    { 
      title: 'Repayment Progress', 
      key: 'repayment',
      width: 250,
      render: (_: any, record: any) => (
        <Space direction="vertical" style={{ width: '100%' }} size={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#fff' }}>${record.paid} Paid</span>
            <span style={{ color: '#8c8c8c' }}>Total: ${record.total}</span>
          </div>
          <Progress percent={Math.round((record.paid / record.total) * 100)} size="small" showInfo={false} strokeColor="#722ed1" />
        </Space>
      )
    },
    { 
      title: 'Asset Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Performing' ? 'success' : status === 'Repossession Pending' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Audit',
      key: 'actions',
      render: () => <Button type="text" icon={<EyeOutlined />} style={{ color: '#fff' }} />
    }
  ];

  const data = [
    { key: '1', vin: '1HGCM82633A004', driver: 'Marcus Johnson', value: '$22,500', paid: 15000, total: 22500, status: 'Performing' },
    { key: '2', vin: 'JTDKB20U11065', driver: 'David Kim', value: '$18,000', paid: 2000, total: 18000, status: 'Repossession Pending' },
    { key: '3', vin: '5YJ3E1EA5KF54', driver: 'Sarah Jenkins', value: '$45,000', paid: 40000, total: 45000, status: 'Performing' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Vehicle Finance Fleet Ledger</Title>
          <Text type="secondary">High-value asset tracking for auto loan facilities originating on the platform.</Text>
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
