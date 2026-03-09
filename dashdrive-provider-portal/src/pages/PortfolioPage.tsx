import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space } from 'antd';
import { FundOutlined, RiseOutlined, LineChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const PortfolioPage: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic title="Total Loan Portfolio" value={500000} prefix="$" valueStyle={{ color: '#1890ff' }} precision={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic title="Total Revenue" value={18500} prefix="$" valueStyle={{ color: '#52c41a' }} precision={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Statistic title="Default Rate" value={1.8} suffix="%" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff0f6', borderColor: '#ffadd2' }}>
            <Statistic title="Average Loan Size" value={3500} prefix="$" valueStyle={{ color: '#eb2f96' }} precision={0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Portfolio Value Over Time" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <FundOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Outstanding portfolio growth</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Approval Rate Trend" bordered={false} style={{ height: 380 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <RiseOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Approval vs Rejection trend</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Driver vs Rider Loan Distribution" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Loan breakdown by user type</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
