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
import { useSocket } from '../context/SocketContext';

const { Title, Text } = Typography;

export const FintechPage: React.FC = () => {
  const { isConnected, socket } = useSocket();
  const [liveStats, setLiveStats] = React.useState({
    directProcessing: 982405.00,
    successRate: 99.4,
    openDisputes: 14
  });

  React.useEffect(() => {
    if (!socket) return;

    socket.on('platform_event', (data: any) => {
      const { event, payload } = data;
      
      if (event === 'TRANSACTION_COMPLETED') {
        setLiveStats(prev => ({
          ...prev,
          directProcessing: prev.directProcessing + (payload.amount || 0)
        }));
      } else if (event === 'GATEWAY_ERROR') {
        setLiveStats(prev => ({
          ...prev,
          successRate: Math.max(90, prev.successRate - 0.1)
        }));
      } else if (event === 'DISPUTE_CREATED') {
        setLiveStats(prev => ({
          ...prev,
          openDisputes: prev.openDisputes + 1
        }));
      }
    });

    return () => {
      socket.off('platform_event');
    };
  }, [socket]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Payments & Fintech Hub</Title>
          <Space>
            <Tag color={isConnected ? 'green' : 'orange'}>
                {isConnected ? <SyncOutlined spin /> : null} 
                {isConnected ? ' Live Processing' : ' Connecting to Gateway...'}
            </Tag>
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
                <Statistic title="Direct Processing" value={liveStats.directProcessing} precision={2} prefix="$" valueStyle={{ color: '#1677ff' }} />
                <Text style={{ fontSize: 11 }} type="success"><ArrowUpOutlined /> 4.2% daily growth</Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm">
                <Statistic title="Gateway Success Rate" value={liveStats.successRate} precision={1} suffix="%" valueStyle={{ color: '#52c41a' }} />
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
                <Statistic title="Open Disputes" value={liveStats.openDisputes} prefix={<HistoryOutlined />} valueStyle={{ color: '#faad14' }} />
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
