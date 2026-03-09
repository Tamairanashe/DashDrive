import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic, Space, Button, message } from 'antd';
import { AlertOutlined, WarningOutlined, SafetyCertificateOutlined, StopOutlined, FileSearchOutlined, FlagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const FraudPage: React.FC = () => {
  const alerts = [
    { id: 'FR-001', user: 'Driver Tino', type: 'Suspicious Claim', severity: 'High', detail: 'Claimed vehicle theft but GPS shows vehicle at home address during claimed period.', date: '2026-03-01', claimId: 'CLM-2004' },
    { id: 'FR-002', user: 'Driver Unknown', type: 'Duplicate Claim', severity: 'High', detail: 'Same accident reported under two different policies. Claim amounts differ by $200.', date: '2026-02-20', claimId: 'CLM-2010' },
    { id: 'FR-003', user: 'Rider Mike', type: 'Repeated Claims', severity: 'Medium', detail: '3 injury claims filed in 2 months — possible pattern of abuse.', date: '2026-03-05', claimId: 'CLM-2003' },
    { id: 'FR-004', user: 'Driver John', type: 'Document Mismatch', severity: 'Low', detail: 'License plate on claim form doesn\'t match registered vehicle. Likely data entry error.', date: '2026-03-08', claimId: 'CLM-2001' },
  ];

  const sevColor = (s: string) => s === 'High' ? 'red' : s === 'Medium' ? 'orange' : 'blue';

  const columns = [
    { title: 'Alert ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'User', dataIndex: 'user' },
    { title: 'Type', dataIndex: 'type', render: (t: string) => <Tag color="volcano">{t}</Tag> },
    { title: 'Severity', dataIndex: 'severity', render: (s: string) => <Tag color={sevColor(s)} icon={s === 'High' ? <AlertOutlined /> : undefined}>{s}</Tag> },
    { title: 'Related Claim', dataIndex: 'claimId', render: (t: string) => <Text code>{t}</Text> },
    { title: 'Detail', dataIndex: 'detail', width: 280 },
    { title: 'Date', dataIndex: 'date' },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<StopOutlined />} danger onClick={() => message.warning(`Claim ${record.claimId} frozen`)}>Freeze Claim</Button>
          <Button size="small" icon={<FileSearchOutlined />} onClick={() => message.info(`Investigating ${record.user}`)}>Investigate User</Button>
          <Button size="small" icon={<FlagOutlined />} onClick={() => message.success('Reported to DashDrive Admin')}>Report to Admin</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}><Card bordered={false}><Statistic title="🚨 Active Alerts" value={alerts.length} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="High Severity" value={alerts.filter(a => a.severity === 'High').length} prefix={<AlertOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Under Investigation" value={2} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>
      <Title level={4}>Fraud Detection Alerts</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>Suspicious claims and activity patterns detected across the insurance portfolio.</Text>
      <Table columns={columns} dataSource={alerts} rowKey="id" scroll={{ x: 1200 }} />
    </div>
  );
};
