import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic } from 'antd';
import { AlertOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const RiskPage: React.FC = () => {
  const riskData = [
    { user: 'Driver Tino', incidentCount: 4, claimsRatio: '12%', riskLevel: 'High', lastIncident: '2026-02-28', flags: ['Inconsistent claim details', 'Repeated accidents'] },
    { user: 'Driver John', incidentCount: 1, claimsRatio: '2%', riskLevel: 'Low', lastIncident: '2026-03-08', flags: [] },
    { user: 'Rider Mike', incidentCount: 2, claimsRatio: '5%', riskLevel: 'Medium', lastIncident: '2026-03-03', flags: ['Low account age'] },
    { user: 'Driver Sarah', incidentCount: 1, claimsRatio: '3%', riskLevel: 'Low', lastIncident: '2026-03-06', flags: [] },
  ];

  const riskColor = (r: string) => r === 'Low' ? 'green' : r === 'Medium' ? 'orange' : 'red';

  const columns = [
    { title: 'User', dataIndex: 'user', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Incidents', dataIndex: 'incidentCount' },
    { title: 'Claims Ratio', dataIndex: 'claimsRatio' },
    { title: 'Risk Level', dataIndex: 'riskLevel', render: (r: string) => <Tag color={riskColor(r)} icon={r === 'High' ? <AlertOutlined /> : undefined}>{r}</Tag> },
    { title: 'Last Incident', dataIndex: 'lastIncident' },
    { title: 'Flags', dataIndex: 'flags', render: (f: string[]) => f.length > 0 ? f.map((fl, i) => <Tag key={i} color="warning">{fl}</Tag>) : <Tag color="success">Clear</Tag> },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}><Card bordered={false}><Statistic title="High Risk Users" value={1} prefix={<AlertOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Medium Risk" value={1} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Low Risk" value={2} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>
      <Title level={4}>Risk Monitoring</Title>
      <Table columns={columns} dataSource={riskData} rowKey="user" scroll={{ x: 900 }} />
    </div>
  );
};
