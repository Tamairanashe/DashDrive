import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  TransactionOutlined,
  LineChartOutlined,
  ApiOutlined,
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Statistic, Row, Col, Card } = {
  Statistic: require('antd').Statistic,
  Row: require('antd').Row,
  Col: require('antd').Col,
  Card: require('antd').Card,
};

export const ProviderDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'products', icon: <ShoppingOutlined />, label: 'Products' },
    { key: 'applications', icon: <FileTextOutlined />, label: 'Applications' },
    { key: 'customers', icon: <UserOutlined />, label: 'Customers' },
    { key: 'risk', icon: <SafetyCertificateOutlined />, label: 'Risk & Verification' },
    { key: 'payments', icon: <TransactionOutlined />, label: 'Payments' },
    { key: 'analytics', icon: <LineChartOutlined />, label: 'Analytics' },
    { key: 'integrations', icon: <ApiOutlined />, label: 'Integrations' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const userMenu = {
    items: [
      { key: '1', label: 'Profile Settings', icon: <SettingOutlined /> },
      { key: '2', danger: true, label: 'Sign Out', icon: <LogoutOutlined /> },
    ],
  };

  const renderOverview = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Applications Received" value={420} prefix={<FileTextOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Approved" value={210} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Rejected" value={90} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic title="Funds Disbursed" value={120000} prefix="$" precision={2} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Application Volume Trends" bordered={false} className="shadow-sm" style={{ height: '400px' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <LineChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Applications over 30 Days</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Performance Quick Stats" bordered={false} className="shadow-sm" style={{ height: '400px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Approval Rate</Text>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>50%</Title>
              </div>
              <div>
                <Text type="secondary">Revenue Generated</Text>
                <Title level={3} style={{ margin: 0 }}>$9,800.00</Title>
              </div>
              <div>
                <Text type="secondary">Default Risk Metric</Text>
                <Title level={4} style={{ margin: 0, color: '#faad14' }}>Medium (3.2%)</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic title="Total Revenue" value={12400} prefix="$" valueStyle={{ color: '#52c41a' }} precision={2} />
            <Text type="secondary">Generated mostly from Vehicle Loans</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic title="Total Loan Volume" value={250000} prefix="$" valueStyle={{ color: '#1890ff' }} precision={2} />
            <Text type="secondary">Active disbursed capital</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Statistic title="Overall Approval Rate" value={58} suffix="%" valueStyle={{ color: '#faad14' }} />
            <Text type="secondary">Across all active products</Text>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Revenue Growth & Loan Distribution" bordered={false} className="shadow-sm" style={{ height: '400px' }}>
             <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
              <Space direction="vertical" align="center">
                <RiseOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                <Text type="secondary">Chart: Revenue vs Submissions Timeline</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderOverview();
      case 'products':
        return <div>Products Management goes here...</div>;
      case 'applications':
        return <div>Applications Management goes here...</div>;
      case 'customers':
        return <div>Customer Profiles goes here...</div>;
      case 'risk':
        return <div>Risk & Verification goes here...</div>;
      case 'payments':
        return <div>Payments & Disbursements goes here...</div>;
      case 'analytics':
        return renderAnalytics();
      case 'integrations':
        return <div>Integrations & API goes here...</div>;
      case 'settings':
        return <div>Provider Settings goes here...</div>;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={260}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BankOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          {!collapsed && <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Partner Portal</Title>}
        </div>
        <Menu 
          mode="inline" 
          selectedKeys={[activeMenu]} 
          items={menuItems} 
          onClick={(e) => setActiveMenu(e.key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>
            {menuItems.find(item => item.key === activeMenu)?.label}
          </Title>
          <Space size="large">
            <Button type="primary">DashDrive Connect</Button>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<BankOutlined />} />
                <Text strong>XYZ Bank Console</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, borderRadius: 8 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};
