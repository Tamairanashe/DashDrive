import React from 'react';
import { Typography, Row, Col, Card, Statistic, Space, Select } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, DollarOutlined, WarningOutlined, LineChartOutlined, BankOutlined, PercentageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Lending Overview</Title></Col>
        <Col>
          <Space>
            <Select defaultValue="all_country" style={{ width: 130 }} options={[{ value: 'all_country', label: 'All Countries' }, { value: 'zw', label: 'Zimbabwe' }, { value: 'za', label: 'South Africa' }]} />
            <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: 'All Cities' }, { value: 'harare', label: 'Harare' }, { value: 'bulawayo', label: 'Bulawayo' }]} />
            <Select defaultValue="all_products" style={{ width: 160 }} options={[{ value: 'all_products', label: 'All Products' }, { value: 'vehicle', label: 'Vehicle Loan' }, { value: 'fuel', label: 'Fuel Credit' }, { value: 'micro', label: 'Microloan' }]} />
            <Select defaultValue="30d" style={{ width: 120 }} options={[{ value: '7d', label: '7 Days' }, { value: '30d', label: '30 Days' }, { value: '90d', label: '90 Days' }, { value: '1y', label: '1 Year' }]} />
          </Space>
        </Col>
      </Row>

      {/* Primary KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col span={4}><Card bordered={false}><Statistic title="Applications" value={420} prefix={<FileTextOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Approved" value={240} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Disbursed" value={195} prefix={<DollarOutlined />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Loan Volume" value={280000} prefix="$" precision={0} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Outstanding" value={150000} prefix="$" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={4}><Card bordered={false}><Statistic title="Commission Owed" value={12400} prefix="$" valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={6}><Card bordered={false}><Statistic title="Default Rate" value={2.1} suffix="%" prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Repayment Rate" value={94.2} suffix="%" prefix={<PercentageOutlined />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Avg Loan Size" value={3200} prefix="$" /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Revenue" value={18500} prefix="$" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Loan Approvals Over Time" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Approvals vs. Rejections (30 days)</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Portfolio Growth" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <DollarOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Outstanding loan portfolio over time</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Average Loan Size" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <BankOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Avg loan size by product type</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Driver vs Rider Loans" bordered={false} style={{ height: 340 }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <PercentageOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Loan distribution by user type</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
