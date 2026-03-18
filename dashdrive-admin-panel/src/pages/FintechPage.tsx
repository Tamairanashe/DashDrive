import React from 'react';
import { Tabs, Typography, Row, Col, Card, Statistic, Button, Space, Tag } from 'antd';
import { 
  BarChartOutlined, 
  CreditCardOutlined, 
  WalletOutlined, 
  HistoryOutlined, 
  SafetyCertificateOutlined,
  ArrowUpOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { FintechDashboard } from '../components/FintechDashboard';
import { Transactions } from '../components/Transactions';
import { UserWallet } from '../components/UserWallet';
import { RefundRequests } from '../components/RefundRequests';
import { PaymentGateways } from '../components/PaymentGateways';
import { FintechManagement } from '../components/FintechManagement';

const { Title, Text } = Typography;

export const FintechPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Payments & Fintech Hub</Title>
          <Space>
            <Tag color="green"><SyncOutlined spin /> Live Processing</Tag>
            <Text type="secondary">Consolidated financial operations and gateway management.</Text>
          </Space>
        </Col>
        <Col>
            <Space>
                <Button icon={<BarChartOutlined />}>Financial Reports</Button>
                <Button type="primary">Global Settlement</Button>
            </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm bg-blue-50/50">
                <Statistic title="Direct Processing" value={982405.00} precision={2} prefix="$" valueStyle={{ color: '#1677ff' }} />
                <Text style={{ fontSize: 11 }} type="success"><ArrowUpOutlined /> 4.2% daily growth</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm">
                <Statistic title="Gateway Success Rate" value={99.4} precision={1} suffix="%" valueStyle={{ color: '#52c41a' }} />
                <Text style={{ fontSize: 11 }} type="secondary">Target: 99.0%</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm">
                <Statistic title="Avg. Payout TAT" value={2.4} precision={1} suffix=" days" />
                <Text style={{ fontSize: 11 }} type="secondary">Settlement speed</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm bg-orange-50/50">
                <Statistic title="Open Disputes" value={14} prefix={<HistoryOutlined />} valueStyle={{ color: '#faad14' }} />
                <Text style={{ fontSize: 11 }} type="warning">Requires attention</Text>
            </Card>
          </Col>
      </Row>

      <Card bordered={false} styles={{ body: { padding: '24px' } }} className="shadow-sm">
        <FintechManagement />
      </Card>
    </div>
  );
};
