import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space, Select, Spin, Empty, Alert, Button } from 'antd';
import {
  FileProtectOutlined, CheckCircleOutlined, CloseCircleOutlined,
  DollarOutlined, ExclamationCircleOutlined, LineChartOutlined,
  AlertOutlined, PercentageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Insurance Overview</Title></Col>
        <Col>
          <Space>
            <Select defaultValue="all_country" style={{ width: 130 }} options={[{ value: 'all_country', label: 'All Countries' }, { value: 'zw', label: 'Zimbabwe' }, { value: 'za', label: 'South Africa' }]} />
            <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: 'All Cities' }, { value: 'harare', label: 'Harare' }, { value: 'bulawayo', label: 'Bulawayo' }]} />
            <Select defaultValue="all_products" style={{ width: 160 }} options={[{ value: 'all_products', label: 'All Products' }, { value: 'accident', label: 'Accident Cover' }, { value: 'vehicle', label: 'Vehicle Damage' }, { value: 'trip', label: 'Trip Protection' }]} />
            <Select defaultValue="30d" style={{ width: 120 }} options={[{ value: '7d', label: '7 Days' }, { value: '30d', label: '30 Days' }, { value: '90d', label: '90 Days' }, { value: '1y', label: '1 Year' }]} />
          </Space>
        </Col>
      </Row>

      {/* Primary KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col span={4}><Card bordered={false}><Statistic title="Active Policies" value={3200} prefix={<FileProtectOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="New Today" value={14} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Claims Submitted" value={12} prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Claims Approved" value={8} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Claims Paid" value={24500} prefix="$" valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Premium Revenue" value={81000} prefix="$" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}><Card bordered={false}><Statistic title="Approval Rate" value={72} suffix="%" prefix={<PercentageOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Rejection Rate" value={18} suffix="%" prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Avg Claim Amount" value={1850} prefix="$" /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Fraud Alerts" value={3} prefix={<AlertOutlined />} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Policy Growth" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <FileProtectOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Active policies growth over time</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Claims Frequency" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Claims filed per week</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Premium Revenue" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <DollarOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Monthly premium revenue</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Claims Payout Ratio" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <PercentageOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Payouts vs premiums collected</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
