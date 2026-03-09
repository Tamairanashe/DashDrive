import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  TransactionOutlined,
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  DollarOutlined,
  FundOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AccountBookOutlined,
  FileProtectOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export const ProviderLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/products', icon: <ShoppingOutlined />, label: 'Loan Products' },
    { key: '/applications', icon: <FileTextOutlined />, label: 'Applications' },
    { key: '/borrowers', icon: <UserOutlined />, label: 'Borrower Profiles' },
    { key: '/risk', icon: <SafetyCertificateOutlined />, label: 'Risk & Credit Scoring' },
    { key: '/disbursements', icon: <TransactionOutlined />, label: 'Disbursements' },
    { key: '/repayments', icon: <DollarOutlined />, label: 'Repayments' },
    { key: '/portfolio', icon: <FundOutlined />, label: 'Portfolio Analytics' },
    { key: '/billing', icon: <AccountBookOutlined />, label: 'Billing & Commissions' },
    { key: '/invoices', icon: <FileProtectOutlined />, label: 'Invoices' },
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
          <BankOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          {!collapsed && <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Financier Portal</Title>}
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
