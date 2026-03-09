import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space } from 'antd';
import { RiseOutlined, LineChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const AnalyticsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic title="Total Revenue" value={12400} prefix="$" valueStyle={{ color: '#52c41a' }} precision={2} />
            <Text type="secondary">Generated mostly from Vehicle Loans</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic title="Total Loan Volume" value={250000} prefix="$" valueStyle={{ color: '#1890ff' }} precision={2} />
            <Text type="secondary">Active disbursed capital</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Statistic title="Overall Approval Rate" value={58} suffix="%" valueStyle={{ color: '#faad14' }} />
            <Text type="secondary">Across all active products</Text>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Revenue Growth" bordered={false} style={{ height: '380px' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <RiseOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Revenue over time</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Loan Distribution" bordered={false} style={{ height: '380px' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Loan distribution by type</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
