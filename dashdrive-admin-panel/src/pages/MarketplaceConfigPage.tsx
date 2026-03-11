import React, { useState } from 'react';
import { 
  Typography, Row, Col, Card, Table, Tag, Switch, 
  Button, Space, InputNumber, Select, Divider, Statistic, message 
} from 'antd';
import { 
  ShopOutlined, 
  SettingOutlined, 
  DollarOutlined, 
  SafetyCertificateOutlined,
  GlobalOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface FinancialProduct {
  id: string;
  name: string;
  type: 'Loan' | 'Insurance' | 'BNPL';
  provider: string;
  commission: number;
  status: boolean;
  region: string;
}

export const MarketplaceConfigPage: React.FC = () => {
  const [products, setProducts] = useState<FinancialProduct[]>([
    { id: 'FP-001', name: 'Micro-Loan 500', type: 'Loan', provider: 'XYZ Bank', commission: 5, status: true, region: 'Harare' },
    { id: 'FP-002', name: 'Driver Accident Cover', type: 'Insurance', provider: 'SafeGuard Insure', commission: 15, status: true, region: 'All' },
    { id: 'FP-003', name: 'Rider Trip Protection', type: 'Insurance', provider: 'SafeGuard Insure', commission: 20, status: true, region: 'All' },
    { id: 'FP-004', name: 'Asset Credit (Vehicle)', type: 'BNPL', provider: 'DashDrive Finance', commission: 0, status: true, region: 'Bulawayo' },
  ]);

  const handleStatusChange = (id: string, status: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    message.success(`Product status updated.`);
  };

  const handleCommissionChange = (id: string, value: number | null) => {
    if (value === null) return;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, commission: value } : p));
  };

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
      render: (t: string) => <Text strong>{t}</Text>
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (t: string, r: FinancialProduct) => (
        <Space direction="vertical" size={0}>
          <Text strong>{t}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.provider}</Text>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => (
        <Tag color={t === 'Loan' ? 'blue' : t === 'Insurance' ? 'green' : 'purple'}>
          {t.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (t: string) => <Space><GlobalOutlined /> {t}</Space>
    },
    {
      title: 'Platform Commission (%)',
      dataIndex: 'commission',
      key: 'commission',
      render: (v: number, r: FinancialProduct) => (
        <InputNumber 
          min={0} 
          max={100} 
          value={v} 
          formatter={value => `${value}%`}
          parser={value => value!.replace('%', '')}
          onChange={(val) => handleCommissionChange(r.id, val)}
          style={{ width: 100 }}
        />
      )
    },
    {
      title: 'Availability',
      dataIndex: 'status',
      key: 'status',
      render: (s: boolean, r: FinancialProduct) => (
        <Switch checked={s} onChange={(checked) => handleStatusChange(r.id, checked)} />
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Financial Marketplace Configuration</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Manage the catalog of financial products, regions, and platform commissions.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={() => message.success('All configurations saved to production.')}>
            Save All Changes
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="ACTIVE PRODUCTS" value={products.filter(p => p.status).length} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="AVG COMMISSION" value={10.5} suffix="%" prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="INSURANCE PARTNERS" value={2} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="LOAN PARTNERS" value={1} prefix={<SettingOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} title="Product Catalog & Commission Tiers" className="shadow-sm" style={{ borderRadius: 16 }}>
        <Table columns={columns} dataSource={products} rowKey="id" pagination={false} />
        
        <Divider />
        
        <div style={{ padding: '0 24px 24px' }}>
          <Title level={4}>Regional Marketplace Overrides</Title>
          <Text type="secondary">Product availability and pricing can be automatically adjusted based on local risk telemetry.</Text>
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={8}>
              <Card size="small" title="Harare Operations">
                <Text type="secondary">Marketplace Density: High</Text><br/>
                <Text strong>Auto-enable Insurance: YES</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Bulawayo Operations">
                <Text type="secondary">Marketplace Density: Medium</Text><br/>
                <Text strong>Auto-enable Insurance: YES</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="Mutare Operations">
                <Text type="secondary">Marketplace Density: Low</Text><br/>
                <Text strong>Auto-enable Insurance: NO</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};
