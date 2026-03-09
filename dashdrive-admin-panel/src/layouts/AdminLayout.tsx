import React, { useState, useEffect } from 'react';
import { useAdminSocketStore } from '../lib/adminSocketStore';
import { Layout, Menu, Button, Input, Badge, Avatar, Space, Typography, ConfigProvider } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  RocketOutlined,
  DashboardOutlined,
  PushpinOutlined,
  TeamOutlined,
  BarChartOutlined,
  CarOutlined,
  ShopOutlined,
  ShoppingOutlined,
  CoffeeOutlined,
  WalletOutlined,
  GlobalOutlined,
  ToolOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  HeatMapOutlined,
  MonitorOutlined,
  StarOutlined,
  SolutionOutlined,
  OrderedListOutlined,
  CarFilled,
  NotificationOutlined,
  MailOutlined,
  DollarOutlined,
  FileTextOutlined,
  PieChartOutlined,
  ReadOutlined,
  FilePptOutlined,
  PictureOutlined,
  CustomerServiceOutlined,
  BankOutlined,
  ControlOutlined,
  LockOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  TrophyOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { themeConfig } from '../theme/ThemeConfig';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { connect, disconnect } = useAdminSocketStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const menuItems: any[] = [
    {
      key: 'MAIN DASHBOARD',
      label: 'MAIN DASHBOARD',
      type: 'group',
      children: [
        { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/dashboard/heatmap', icon: <HeatMapOutlined />, label: 'Heat Map' },
        { key: '/dashboard/fleet', icon: <MonitorOutlined />, label: 'Fleet View' },
        { key: '/dashboard/analytics', icon: <BarChartOutlined />, label: 'Analytics' },
      ],
    },
    {
      key: 'SERVICES',
      label: 'SERVICES',
      type: 'group',
      children: [
        { key: '/services/ride', icon: <CarOutlined />, label: 'Ride Hailing' },
        { key: '/services/food', icon: <CoffeeOutlined />, label: 'Food Delivery' },
        { key: '/services/mart', icon: <ShopOutlined />, label: 'Mart Delivery' },
        { key: '/services/shopping', icon: <ShoppingOutlined />, label: 'Shopping' },
        { key: '/services/parcel', icon: <PushpinOutlined />, label: 'Parcel Delivery' },
        { key: '/services/payments', icon: <WalletOutlined />, label: 'Payments & Fintech' },
      ],
    },
    {
      key: 'DRIVER MANAGEMENT',
      label: 'DRIVER MANAGEMENT',
      type: 'group',
      children: [
        { key: '/drivers/list', icon: <CarFilled />, label: 'Driver List' },
        { key: '/drivers/verification', icon: <SafetyCertificateOutlined />, label: 'Driver Verification' },
        { key: '/drivers/rewards', icon: <StarOutlined />, label: 'Driver Rewards' },
        { key: '/drivers/leaderboard', icon: <TrophyOutlined />, label: 'Driver Leaderboard' },
        { key: '/drivers/tier-setup', icon: <CrownOutlined />, label: 'Driver Level Setup' },
      ],
    },
    {
      key: 'USER MANAGEMENT',
      label: 'USER MANAGEMENT',
      type: 'group',
      children: [
        { key: '/users/customers', icon: <TeamOutlined />, label: 'Customers' },
        { key: '/users/tier-setup', icon: <SolutionOutlined />, label: 'Customer Level Setup' },
        { key: '/users/employees', icon: <UserOutlined />, label: 'Employees' },
        { key: '/users/wallet', icon: <WalletOutlined />, label: 'User Wallet' },
      ],
    },
    {
      key: 'OPERATIONS',
      label: 'OPERATIONS',
      type: 'group',
      children: [
        { key: '/ops/zones', icon: <PushpinOutlined />, label: 'Zone Setup' },
        { key: '/ops/dispatch', icon: <RocketOutlined />, label: 'Dispatch Management' },
        { key: '/ops/tracking', icon: <GlobalOutlined />, label: 'Live Tracking' },
        { key: '/ops/alerts', icon: <OrderedListOutlined />, label: 'Solved Alert List' },
        { key: '/ops/logs', icon: <ToolOutlined />, label: 'System Logs' },
      ],
    },
    {
      key: 'VEHICLE MANAGEMENT',
      label: 'VEHICLE MANAGEMENT',
      type: 'group',
      children: [
        { key: '/vehicles/attributes', icon: <SettingOutlined />, label: 'Vehicle Attributes' },
        { key: '/vehicles/list', icon: <UnorderedListOutlined />, label: 'Vehicle List' },
        { key: '/vehicles/requests', icon: <SolutionOutlined />, label: 'Vehicle Requests' },
        { key: '/vehicles/add', icon: <PlusCircleOutlined />, label: 'Add New Vehicle' },
      ],
    },
    {
      key: 'PROMOTION & MARKETING',
      label: 'PROMOTION & MARKETING',
      type: 'group',
      children: [
        { key: '/marketing/banners', icon: <PictureOutlined />, label: 'Banner Setup' },
        { key: '/marketing/coupons', icon: <SolutionOutlined />, label: 'Coupon Setup' },
        { key: '/marketing/discounts', icon: <DollarOutlined />, label: 'Discount Setup' },
        { key: '/marketing/notifications', icon: <NotificationOutlined />, label: 'Send Notifications' },
        { key: '/marketing/newsletter', icon: <MailOutlined />, label: 'Newsletter' },
        { key: '/marketing/growth-engine', icon: <RiseOutlined />, label: 'Growth Engine' },
      ],
    },
    {
      key: 'FINANCE & REPORTS',
      label: 'FINANCE & REPORTS',
      type: 'group',
      children: [
        { key: '/services/payments', icon: <BankOutlined />, label: 'Fintech Hub' },
        { key: '/finance/transactions', icon: <DollarOutlined />, label: 'Transactions' },
        { key: '/finance/earnings', icon: <PieChartOutlined />, label: 'Earnings Reports' },
        { key: '/finance/commissions', icon: <FileTextOutlined />, label: 'Commission Reports' },
        { key: '/finance/analytics', icon: <BarChartOutlined />, label: 'Financial Analytics' },
        { key: '/finance/settlements', icon: <DollarOutlined />, label: 'Settlements & Payouts' },
      ],
    },
    {
      key: 'CONTENT MANAGEMENT',
      label: 'CONTENT MANAGEMENT',
      type: 'group',
      children: [
        { key: '/content/blog', icon: <ReadOutlined />, label: 'Blog Setup' },
        { key: '/content/pages', icon: <FilePptOutlined />, label: 'Pages' },
        { key: '/content/media', icon: <PictureOutlined />, label: 'Media Library' },
      ],
    },
    {
      key: 'SUPPORT',
      label: 'SUPPORT',
      type: 'group',
      children: [
        { key: '/support/tickets', icon: <CustomerServiceOutlined />, label: 'Support Tickets' },
      ],
    },
    {
      key: 'ENTERPRISE & GOVERNANCE',
      label: 'ENTERPRISE & GOVERNANCE',
      type: 'group',
      children: [
        { key: '/enterprise/setup', icon: <BankOutlined />, label: 'Enterprise Business Setup' },
        { key: '/enterprise/config', icon: <ControlOutlined />, label: 'Configuration' },
        { key: '/enterprise/roles', icon: <LockOutlined />, label: 'Roles & Permissions' },
        { key: '/enterprise/settings', icon: <SettingOutlined />, label: 'System Settings' },
      ],
    },
  ];

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={280}
          theme="light"
          style={{
            borderRight: '1px solid #f1f5f9',
            position: 'fixed',
            height: '100vh',
            left: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ minHeight: 64, margin: '16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ 
                minWidth: 40, height: 40, background: '#0e172a', borderRadius: 12, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' 
              }}>
                <RocketOutlined style={{ fontSize: 20 }} />
              </div>
              {!collapsed && <Text strong style={{ fontSize: 18, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>DashDrive</Text>}
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                style={{ borderRight: 0 }}
              />
            </div>
            
            <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
              <Button 
                  block={!collapsed}
                  type="text" 
                  icon={<LogoutOutlined />} 
                  style={{ textAlign: 'left', height: 44, color: '#ef4444' }}
              >
                  {!collapsed && "Logout"}
              </Button>
            </div>
          </div>
        </Sider>
        
        <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'all 0.2s', minHeight: '100vh' }}>
          <Header style={{ 
            background: '#fff', 
            padding: '0 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            borderBottom: '1px solid #f1f5f9',
            height: 64,
            lineHeight: 'normal'
          }}>
            <Space size="large" style={{ flex: 1 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 40, height: 40 }}
              />
              <Input
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                placeholder="Search orders, drivers, customers..."
                variant="filled"
                style={{ width: '100%', maxWidth: 400, background: '#f8fafc', border: 'none' }}
              />
            </Space>

            <Space size="middle">
              <Button type="text" icon={<QuestionCircleOutlined />} />
              <Badge dot color="#10b981">
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, borderLeft: '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'right', display: collapsed ? 'none' : 'block' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Admin User</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.2 }}>Operations Manager</div>
                </div>
                <Avatar shape="square" icon={<UserOutlined />} style={{ background: '#0e172a' }} />
              </div>
            </Space>
          </Header>
          
          <Content style={{ padding: 24, background: '#f8fafc', flex: 1 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
