import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography } from 'antd';
import { DollarOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';

const { Title } = Typography;

export default function Earnings() {
  const revenueData = [
    { month: 'Oct', value: 4200 },
    { month: 'Nov', value: 3800 },
    { month: 'Dec', value: 5100 },
    { month: 'Jan', value: 3500 },
    { month: 'Feb', value: 4200 },
    { month: 'Mar', value: 7200 },
  ];

  const config = {
    data: revenueData,
    xField: 'month',
    yField: 'value',
    color: '#10b981',
    columnWidthRatio: 0.5,
    label: {
      position: 'top',
      style: {
        fill: '#6b7280',
        opacity: 0.6,
      },
    },
  };

  const columns = [
    { title: 'Trip ID', dataIndex: 'tripId', key: 'tripId', render: (text: string) => <span className="font-mono text-indigo-600">{text}</span> },
    { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Gross Earnings', dataIndex: 'gross', key: 'gross', render: (val: number) => `$${val.toFixed(2)}` },
    { title: 'Platform Fee (20%)', dataIndex: 'fee', key: 'fee', render: (val: number) => <span className="text-red-500">-${val.toFixed(2)}</span> },
    { title: 'Net Payout', dataIndex: 'net', key: 'net', render: (val: number) => <span className="font-semibold text-green-600">${val.toFixed(2)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const transactions = [
    { key: '1', tripId: 'TRX-1023', vehicle: 'Tesla Model 3', date: 'Mar 12, 2026', gross: 240, fee: 48, net: 192, status: 'Pending' },
    { key: '2', tripId: 'TRX-1020', vehicle: 'Honda Civic', date: 'Mar 05, 2026', gross: 220, fee: 44, net: 176, status: 'Paid' },
    { key: '3', tripId: 'TRX-1018', vehicle: 'Toyota Corolla', date: 'Feb 28, 2026', gross: 135, fee: 27, net: 108, status: 'Paid' },
    { key: '4', tripId: 'TRX-1015', vehicle: 'BMW X5', date: 'Feb 20, 2026', gross: 450, fee: 90, net: 360, status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <Title level={4} className="!mb-0">Earnings & Payouts</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic 
              title="Total Earnings (YTD)" 
              value={28000} 
              prefix={<DollarOutlined />} 
              precision={2} 
              styles={{ content: { color: '#10b981' } }}
            />
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <ArrowUpOutlined className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span> vs last year
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="Pending Payouts" value={192} prefix={<DollarOutlined />} precision={2} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="Average Trip Revenue" value={185} prefix={<DollarOutlined />} precision={2} />
          </Card>
        </Col>
      </Row>

      <Card title="Monthly Revenue" variant="borderless" className="shadow-sm">
        <Column {...config} height={300} />
      </Card>

      <Card title="Transaction History" variant="borderless" className="shadow-sm p-0" styles={{ body: { padding: 0 } }}>
        <Table columns={columns} dataSource={transactions} pagination={false} />
      </Card>
    </div>
  );
}
