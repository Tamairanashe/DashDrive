import React from 'react';
import { Typography, Table, Tag, Card, Row, Col, Statistic } from 'antd';
import { AlertOutlined, WarningOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const RiskPage: React.FC = () => {
  const riskData = [
    { user: 'Driver John', creditScore: 82, riskLevel: 'Low', rating: 4.8, tripVolume: '45/week', earnings: '$900/mo', accountAge: '18 months', cancellationRate: '2%', previousLoans: 2 },
    { user: 'Driver Sarah', creditScore: 75, riskLevel: 'Low', rating: 4.6, tripVolume: '32/week', earnings: '$650/mo', accountAge: '12 months', cancellationRate: '5%', previousLoans: 1 },
    { user: 'Rider Mike', creditScore: 68, riskLevel: 'Medium', rating: 4.2, tripVolume: 'N/A', earnings: 'N/A', accountAge: '8 months', cancellationRate: '8%', previousLoans: 0 },
    { user: 'Driver Grace', creditScore: 91, riskLevel: 'Low', rating: 4.9, tripVolume: '55/week', earnings: '$1200/mo', accountAge: '24 months', cancellationRate: '1%', previousLoans: 3 },
    { user: 'Driver Tino', creditScore: 45, riskLevel: 'High', rating: 3.9, tripVolume: '12/week', earnings: '$400/mo', accountAge: '3 months', cancellationRate: '15%', previousLoans: 0 },
    { user: 'Driver Alex', creditScore: 78, riskLevel: 'Medium', rating: 4.5, tripVolume: '38/week', earnings: '$750/mo', accountAge: '14 months', cancellationRate: '4%', previousLoans: 1 },
  ];

  const riskColor = (r: string) => r === 'Low' ? 'green' : r === 'Medium' ? 'orange' : 'red';

  const columns = [
    { title: 'User', dataIndex: 'user', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Credit Score', dataIndex: 'creditScore', render: (v: number) => <Tag color={v >= 80 ? 'green' : v >= 60 ? 'orange' : 'red'}>{v}</Tag>, sorter: (a: any, b: any) => a.creditScore - b.creditScore },
    { title: 'Risk Level', dataIndex: 'riskLevel', render: (r: string) => <Tag color={riskColor(r)} icon={r === 'High' ? <AlertOutlined /> : undefined}>{r}</Tag> },
    { title: 'Rating', dataIndex: 'rating', render: (v: number) => `${v} ⭐` },
    { title: 'Trip Volume', dataIndex: 'tripVolume' },
    { title: 'Monthly Earnings', dataIndex: 'earnings' },
    { title: 'Account Age', dataIndex: 'accountAge' },
    { title: 'Cancel Rate', dataIndex: 'cancellationRate', render: (v: string) => { const n = parseFloat(v); return <Tag color={n <= 5 ? 'green' : n <= 10 ? 'orange' : 'red'}>{v}</Tag>; } },
    { title: 'Previous Loans', dataIndex: 'previousLoans' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}><Card bordered={false}><Statistic title="High Risk" value={riskData.filter(r => r.riskLevel === 'High').length} prefix={<AlertOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Medium Risk" value={riskData.filter(r => r.riskLevel === 'Medium').length} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Low Risk" value={riskData.filter(r => r.riskLevel === 'Low').length} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card title="Risk Scoring Factors" bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 8]}>
          <Col span={4}><Tag color="blue">Driver Rating</Tag></Col>
          <Col span={4}><Tag color="blue">Trip Volume</Tag></Col>
          <Col span={4}><Tag color="blue">Monthly Earnings</Tag></Col>
          <Col span={4}><Tag color="blue">Account Age</Tag></Col>
          <Col span={4}><Tag color="blue">Cancellation Rate</Tag></Col>
          <Col span={4}><Tag color="blue">Previous Loans</Tag></Col>
        </Row>
      </Card>

      <Title level={4}>Credit Risk Assessment</Title>
      <Table columns={columns} dataSource={riskData} rowKey="user" scroll={{ x: 1100 }} />
    </div>
  );
};
