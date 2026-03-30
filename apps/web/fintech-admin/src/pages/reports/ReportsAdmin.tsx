import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Title, Text } = Typography;

const revenueData = [
  { name: 'Q1', loans: 4000, insurance: 2400, bnpl: 1500 },
  { name: 'Q2', loans: 4500, insurance: 2800, bnpl: 1800 },
  { name: 'Q3', loans: 5200, insurance: 3200, bnpl: 2100 },
  { name: 'Q4 (Est)', loans: 6000, insurance: 3800, bnpl: 2500 },
];

export const ReportsAdmin: React.FC = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Ecosystem Reports Hub</Title>
          <Text type="secondary">Consolidated financial performance and volume metrics across all DashDrive Fintech domains.</Text>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title={<span style={{ color: '#fff' }}>Quarterly Revenue Breakdown (by Product)</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8 }}
            headStyle={{ borderBottom: '1px solid #303030' }}
          >
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#303030" />
                  <XAxis dataKey="name" stroke="#8c8c8c" />
                  <YAxis stroke="#8c8c8c" tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #303030', borderRadius: 6 }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: '#303030', opacity: 0.4 }}
                  />
                  <Legend />
                  <Bar dataKey="loans" stackId="a" fill="#1677ff" name="Loan Interest" />
                  <Bar dataKey="insurance" stackId="a" fill="#059669" name="Insurance Commission" />
                  <Bar dataKey="bnpl" stackId="a" fill="#722ed1" name="BNPL Merchant Fees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
