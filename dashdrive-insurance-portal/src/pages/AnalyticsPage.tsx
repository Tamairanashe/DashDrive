import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space } from 'antd';
import { LineChartOutlined, FileProtectOutlined, DollarOutlined, PercentageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}>
            <Statistic title="Total Policies Sold" value={2840} prefix={<FileProtectOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic title="Premium Revenue" value={52000} prefix="$" valueStyle={{ color: '#52c41a' }} precision={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Statistic title="Claims Ratio" value={3.2} suffix="%" valueStyle={{ color: '#faad14' }} />
            <Text type="secondary">Claims vs active policies</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff0f6', borderColor: '#ffadd2' }}>
            <Statistic title="Loss Ratio" value={42} suffix="%" valueStyle={{ color: '#eb2f96' }} />
            <Text type="secondary">Payouts vs premiums</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Policy Growth" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <FileProtectOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Active policies over time</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Claim Trends" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Claims filed, approved, rejected per month</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Premium Revenue" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <DollarOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Monthly premium revenue vs target</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Loss Ratio" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <PercentageOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Payouts vs premiums (loss ratio)</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
