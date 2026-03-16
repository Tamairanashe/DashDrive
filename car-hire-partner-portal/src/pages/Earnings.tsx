import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Space, Tag, Button } from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  FilterOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const { Title, Text } = Typography;

const monthlyData = [
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 4800 },
  { month: 'Apr', amount: 6100 },
  { month: 'May', amount: 5900 },
  { month: 'Jun', amount: 7200 },
];

const Earnings: React.FC = () => {
  const columns = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
    },
    {
      title: 'Gross Revenue',
      dataIndex: 'gross',
      key: 'gross',
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: 'Platform Fee (15%)',
      dataIndex: 'fee',
      key: 'fee',
      render: (val: number) => <Text type="danger">-${val.toLocaleString()}</Text>,
    },
    {
      title: 'Net Earnings',
      dataIndex: 'net',
      key: 'net',
      render: (val: number) => <Text strong className="text-green-600">${val.toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Paid' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag>
      ),
    },
  ];

  const dataSource = [
    { key: '1', period: 'Mar 1 - Mar 15, 2026', bookings: 24, gross: 3200, fee: 480, net: 2720, status: 'Pending' },
    { key: '2', period: 'Feb 15 - Feb 28, 2026', bookings: 28, gross: 4100, fee: 615, net: 3485, status: 'Paid' },
    { key: '3', period: 'Feb 1 - Feb 14, 2026', bookings: 22, gross: 2900, fee: 435, net: 2465, status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Earnings & Reports</Title>
        <Space>
          <Button icon={<FilterOutlined />}>Select Period</Button>
          <Button type="primary" icon={<DownloadOutlined />}>Download Report</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-l-blue-500">
            <Statistic
              title="Total Lifetime Earnings"
              value={42850}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-l-green-500">
            <Statistic
              title="Pending Payout"
              value={2720}
              precision={2}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-sm border-l-4 border-l-orange-500">
            <Statistic
              title="Average Monthly"
              value={5616}
              precision={0}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Monthly Revenue Overview" bordered={false} className="shadow-sm">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#1677ff' : '#bae7ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Payout History" bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </Card>
    </div>
  );
};

export default Earnings;
