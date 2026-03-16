import React from 'react';
import { Card, Row, Col, Typography, Progress, Statistic } from 'antd';
import { Pie, DualAxes } from '@ant-design/plots';

const { Title } = Typography;

export default function Insights() {
  const utilizationData = [
    { vehicle: 'Tesla Model 3', value: 75 },
    { vehicle: 'Toyota Corolla', value: 82 },
    { vehicle: 'BMW X5', value: 45 },
    { vehicle: 'Honda Civic', value: 68 },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: utilizationData,
    angleField: 'value',
    colorField: 'vehicle',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '18px',
        },
        content: 'Utilization',
      },
    },
  };

  const performanceData = [
    { month: 'Jan', revenue: 3500, trips: 22 },
    { month: 'Feb', revenue: 4200, trips: 28 },
    { month: 'Mar', revenue: 3800, trips: 25 },
    { month: 'Apr', revenue: 5100, trips: 35 },
    { month: 'May', revenue: 6000, trips: 42 },
    { month: 'Jun', revenue: 7200, trips: 50 },
  ];

  const dualAxesConfig = {
    data: [performanceData, performanceData],
    xField: 'month',
    yField: ['revenue', 'trips'],
    geometryOptions: [
      { geometry: 'column', color: '#6366f1' },
      { geometry: 'line', color: '#10b981', lineStyle: { lineWidth: 3 } },
    ],
  };

  return (
    <div className="space-y-6">
      <Title level={4} className="!mb-0">Performance Insights</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Vehicle Utilization Rate" variant="borderless" className="shadow-sm h-full">
            <Pie {...pieConfig} height={300} />
            <div className="mt-4 text-center text-sm text-gray-500">
              Formula: booked_days / available_days
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Revenue vs Trip Volume" variant="borderless" className="shadow-sm h-full">
            <DualAxes {...dualAxesConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm text-center">
            <Statistic title="Average Guest Rating" value={4.9} suffix="/ 5.0" styles={{ content: { color: '#f59e0b' } }} />
            <Progress percent={98} showInfo={false} strokeColor="#f59e0b" className="mt-2" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm text-center">
            <Statistic title="Trip Conversion Rate" value={68} suffix="%" />
            <Progress percent={68} showInfo={false} strokeColor="#4f46e5" className="mt-2" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="shadow-sm text-center">
            <Statistic title="Response Rate" value={100} suffix="%" styles={{ content: { color: '#10b981' } }} />
            <Progress percent={100} showInfo={false} strokeColor="#10b981" className="mt-2" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
