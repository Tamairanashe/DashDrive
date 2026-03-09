import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileProtectOutlined,
  ExclamationCircleOutlined,
  AlertOutlined,
  DollarOutlined,
  LineChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  AccountBookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const InsuranceLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/products', icon: <ShoppingOutlined />, label: 'Insurance Products' },
    { key: '/policies', icon: <FileProtectOutlined />, label: 'Policies' },
    { key: '/claims', icon: <ExclamationCircleOutlined />, label: 'Claims' },
    { key: '/risk', icon: <AlertOutlined />, label: 'Risk Monitoring' },
    { key: '/premiums', icon: <DollarOutlined />, label: 'Premium Payments' },
    { key: '/fraud', icon: <SafetyCertificateOutlined />, label: 'Fraud Detection' },
    { key: '/billing', icon: <AccountBookOutlined />, label: 'Billing & Commissions' },
    { key: '/analytics', icon: <LineChartOutlined />, label: 'Analytics' },
    { key: '/marketing', icon: <SoundOutlined />, label: 'Marketing' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const userMenu = {
    items: [
      { key: '1', label: 'Profile Settings', icon: <SettingOutlined /> },
      { key: '2', danger: true, label: 'Sign Out', icon: <LogoutOutlined /> },
    ],
  };

  const currentLabel = menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={260}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <SafetyCertificateOutlined style={{ fontSize: 24, color: '#722ed1' }} />
          {!collapsed && <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Insurance Portal</Title>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
            <Title level={4} style={{ margin: 0 }}>{currentLabel}</Title>
          </Space>
          <Space size="large">
            <Button type="primary" style={{ background: '#722ed1' }}>DashDrive Connect</Button>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#722ed1' }} icon={<SafetyCertificateOutlined />} />
                <Text strong>Global Insure Console</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
