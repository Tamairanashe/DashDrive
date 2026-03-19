import React, { useState, useEffect } from 'react';
import { useAdminSocketStore } from '../lib/adminSocketStore';
import { Layout, Menu, Button, Input, Badge, Avatar, Space, Typography, ConfigProvider, theme, Segmented, Tooltip, Divider } from 'antd';
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
  PictureOutlined,
  CustomerServiceOutlined,
  BankOutlined,
  ControlOutlined,
  LockOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  TrophyOutlined,
  CrownOutlined,
  RiseOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  KeyOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  CommentOutlined,
  SafetyOutlined,
  HistoryOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { themeConfig } from '../theme/ThemeConfig';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { connect, disconnect } = useAdminSocketStore();
  const { theme: themeMode, setTheme, isDark } = useTheme();

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
        { key: '/services/hotels', icon: <ShopOutlined />, label: 'Marketplace & Stays' },
        { key: '/services/events', icon: <CalendarOutlined />, label: 'Events Booking' },
        { key: '/services/rental', icon: <KeyOutlined />, label: 'Car Rental' },
        { key: '/services/transport', icon: <CompassOutlined />, label: 'City to City' },
        { key: '/services/school-run', icon: <SafetyOutlined />, label: 'School Run Monitor' },
      ],
    },
    {
      key: 'PARTNERS',
      label: 'PARTNERS',
      type: 'group',
      children: [
        { 
          key: 'drivers', 
          icon: <TeamOutlined />, 
          label: 'Drivers',
          children: [
            { key: '/drivers/list', label: 'Master Management Hub' },
            { key: '/drivers/leaderboard', label: 'Engagement Hub' },
            { key: '/drivers/bundles', label: 'Ride Bundles' },
          ]
        },
        {
          key: 'couriers',
          icon: <RocketOutlined />,
          label: 'Couriers',
          children: [
            { key: '/partners/couriers/list', label: 'Courier List' },
            { key: '/partners/couriers/requests', label: 'Courier Requests' },
            { key: '/partners/couriers/earnings', label: 'Courier Earnings' },
          ]
        },
        {
          key: 'fleets',
          icon: <BankOutlined />,
          label: 'Fleet Operators',
          children: [
            { key: '/partners/fleets/list', label: 'Fleet List' },
            { key: '/partners/fleets/requests', label: 'Fleet Requests' },
            { key: '/partners/fleets/earnings', label: 'Fleet Earnings' },
          ]
        },
        {
          key: 'vehicles',
          icon: <CarOutlined />,
          label: 'Vehicle Management',
          children: [
            { key: '/vehicles/list', label: 'Vehicle List' },
            { key: '/vehicles/requests', label: 'Vehicle Requests' },
            { key: '/vehicles/attributes', label: 'Vehicle Attributes' },
          ]
        },
      ],
    },
    {
      key: 'USER MANAGEMENT',
      label: 'USER MANAGEMENT',
      type: 'group',
      children: [
        { key: '/users/management', icon: <TeamOutlined />, label: 'User Management' },
      ],
    },
    {
      key: 'OPERATIONS',
      label: 'OPERATIONS',
      type: 'group',
      children: [
        { key: '/ops/hub', icon: <ThunderboltOutlined />, label: 'Operations Hub' },
        { key: '/ops/zones', icon: <PushpinOutlined />, label: 'Zone Setup' },
        { key: '/ops/dispatch', icon: <RocketOutlined />, label: 'Dispatch Management' },
        { key: '/ops/tracking', icon: <GlobalOutlined />, label: 'Live Tracking' },
        { key: '/ops/alerts', icon: <BellOutlined />, label: 'Active Alerts' },
        { key: '/ops/surge', icon: <RiseOutlined />, label: 'Surge Control' },
        { key: '/ops/analytics', icon: <LineChartOutlined />, label: 'Performance Analytics' },
        { key: '/ops/logs', icon: <ToolOutlined />, label: 'History Logs' },
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
      key: 'FARE MANAGEMENT',
      label: 'FARE MANAGEMENT',
      type: 'group',
      children: [
        { key: '/finance/fares', icon: <DollarOutlined />, label: 'Fare Management' },
      ],
    },
    {
      key: 'FINANCIAL HUB',
      label: 'FINANCIAL HUB',
      type: 'group',
      children: [
        {key: '/finance/earnings', icon: <BankOutlined />, label: 'Financial Reports Hub' },
        { key: '/finance/settlements', icon: <DollarOutlined />, label: 'Settlement & Payouts' },
        { key: '/finance/partners', icon: <ApiOutlined />, label: 'Fintech Partner Hub' },
        { key: '/finance/marketplace', icon: <AppstoreOutlined />, label: 'Product Marketplace' },
        { key: '/finance/utility', icon: <ThunderboltOutlined />, label: 'Utility Aggregator' },
      ],
    },
    {
      key: 'CONTENT MANAGEMENT',
      label: 'CONTENT MANAGEMENT',
      type: 'group',
      children: [
        { key: '/content/blog', icon: <ReadOutlined />, label: 'Blog Setup' },
      ],
    },
    {
      key: 'QUALITY',
      label: 'QUALITY & REPUTATION',
      type: 'group',
      children: [
        { key: '/quality/reviews', icon: <StarOutlined />, label: 'Reviews & Ratings' },
        { key: '/quality/feedback', icon: <CommentOutlined />, label: 'Partner Feedback' },
        { key: '/quality/moderation', icon: <SafetyOutlined />, label: 'Moderation Queue' },
        { key: '/quality/analytics', icon: <LineChartOutlined />, label: 'Reputation Analytics' },
      ],
    },
    {
      key: 'SUPPORT',
      label: 'SUPPORT',
      type: 'group',
      children: [
        { key: '/support/hub', icon: <CustomerServiceOutlined />, label: 'Support Hub' },
        { key: '/support/technical', icon: <ToolOutlined />, label: 'Technical Resolution' },
      ],
    },
    {
      key: 'ENTERPRISE & GOVERNANCE',
      label: 'ENTERPRISE & GOVERNANCE',
      type: 'group',
      children: [
        { key: '/enterprise/setup', icon: <BankOutlined />, label: 'Enterprise Business Setup' },
        { key: '/enterprise/config', icon: <ControlOutlined />, label: 'Configuration' },
        { key: '/enterprise/audit-logs', icon: <HistoryOutlined />, label: 'Audit Logs' },
        { key: '/enterprise/roles', icon: <LockOutlined />, label: 'Access & Governance' },
        { key: '/enterprise/api', icon: <ApiOutlined />, label: 'API Management' },
        { key: '/enterprise/settings', icon: <SettingOutlined />, label: 'System Settings' },
      ],
    },
  ];

  return (
    <ConfigProvider 
      theme={{
        ...themeConfig,
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          ...themeConfig.token,
          colorBgLayout: isDark ? '#121212' : '#f8fafc',
          colorBgContainer: isDark ? '#1e1e1e' : '#ffffff',
          colorBorder: isDark ? '#2d2d2d' : '#f1f5f9',
          colorText: isDark ? '#e3e3e3' : '#0f172a',
          colorTextSecondary: isDark ? '#8e8e8e' : '#64748b',
        },
        components: {
          ...themeConfig.components,
          Menu: {
            ...themeConfig.components?.Menu,
            itemSelectedBg: isDark ? '#2d2d2d' : '#f1f5f9',
          },
          Card: {
            ...themeConfig.components?.Card,
            colorBgContainer: isDark ? '#1e1e1e' : '#ffffff',
          }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh', background: isDark ? '#121212' : '#f8fafc' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={280}
          theme={isDark ? 'dark' : 'light'}
          style={{
            borderRight: isDark ? '1px solid #2d2d2d' : '1px solid #f1f5f9',
            position: 'fixed',
            height: '100vh',
            left: 0,
            zIndex: 100,
            background: isDark ? '#1e1e1e' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ minHeight: 64, margin: '16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ 
                minWidth: 40, height: 40, background: isDark ? '#2d2d2d' : '#0e172a', borderRadius: 12, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' 
              }}>
                <RocketOutlined style={{ fontSize: 20, color: '#10b981' }} />
              </div>
              {!collapsed && <Text strong style={{ fontSize: 18, letterSpacing: -0.5, whiteSpace: 'nowrap', color: isDark ? '#e3e3e3' : '#0f172a' }}>DashDrive</Text>}
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              <Menu
                mode="inline"
                theme={isDark ? 'dark' : 'light'}
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                style={{ borderRight: 0, background: 'transparent' }}
              />
            </div>
            
            <div style={{ padding: '16px', borderTop: isDark ? '1px solid #2d2d2d' : '1px solid #f1f5f9', flexShrink: 0 }}>
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
        
        <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'all 0.2s', minHeight: '100vh', background: 'transparent' }}>
          <Header style={{ 
            background: isDark ? '#1e1e1e' : '#fff', 
            padding: '0 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            borderBottom: isDark ? '1px solid #2d2d2d' : '1px solid #f1f5f9',
            height: 64,
            lineHeight: 'normal'
          }}>
            <Space size="large" style={{ flex: 1 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 40, height: 40, color: isDark ? '#e3e3e3' : 'inherit' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <Tooltip title="System Health: Optimal (Latency < 45ms)">
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? '#2d2d2d' : '#f0fdf4', padding: '4px 10px', borderRadius: 20, border: `1px solid ${isDark ? '#333' : '#dcfce7'}` }}>
                     <Badge status="processing" color="#10b981" />
                     <Text style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>SYNX ACTIVE</Text>
                   </div>
                 </Tooltip>
                 <Divider orientation="vertical" style={{ height: 20 }} />
                 <Input
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="Global Search..."
                    variant="filled"
                    style={{ 
                      width: 300, 
                      background: isDark ? '#2d2d2d' : '#f8fafc', 
                      border: 'none',
                    }}
                  />
              </div>
            </Space>

            <Space size="middle">
              <Segmented
                size="small"
                value={themeMode}
                onChange={(value) => setTheme(value as any)}
                options={[
                  { value: 'light', icon: <SunOutlined /> },
                  { value: 'dark', icon: <MoonOutlined /> },
                  { value: 'system', icon: <DesktopOutlined /> },
                ]}
                style={{ background: isDark ? '#2d2d2d' : '#f1f5f9' }}
              />
              <Button type="text" icon={<QuestionCircleOutlined />} style={{ color: isDark ? '#8e8e8e' : 'inherit' }} />
              <Badge dot color="#10b981">
                <Button type="text" icon={<BellOutlined />} style={{ color: isDark ? '#8e8e8e' : 'inherit' }} />
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, borderLeft: isDark ? '1px solid #333' : '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'right', display: collapsed ? 'none' : 'block' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1.2 }}>Admin User</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.2 }}>Operations Manager</div>
                </div>
                <Avatar shape="square" icon={<UserOutlined />} style={{ background: isDark ? '#2d2d2d' : '#0e172a' }} />
              </div>
            </Space>
          </Header>
          
          <Content style={{ padding: 24, background: 'transparent', flex: 1 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg-layout: ${isDark ? '#121212' : '#f8fafc'};
          --bg-container: ${isDark ? '#1e1e1e' : '#ffffff'};
          --border-color: ${isDark ? '#2d2d2d' : '#f1f5f9'};
          --text-main: ${isDark ? '#e3e3e3' : '#0f172a'};
          --text-secondary: ${isDark ? '#8e8e8e' : '#64748b'};
        }

        ${isDark ? `
          body {
            background-color: #121212 !important;
            color: #e3e3e3 !important;
          }

          /* Force grayscale for hardcoded theme-related colors */
          [data-theme='dark'] .ant-typography, 
          [data-theme='dark'] h1, 
          [data-theme='dark'] h2, 
          [data-theme='dark'] h3, 
          [data-theme='dark'] h4, 
          [data-theme='dark'] .ant-list-item-meta-title,
          [data-theme='dark'] .ant-statistic-title {
             color: #e3e3e3 !important;
          }

          [data-theme='dark'] .ant-typography-secondary,
          [data-theme='dark'] .ant-list-item-meta-description,
          [data-theme='dark'] .ant-statistic-content {
             color: #8e8e8e !important;
          }

          .ant-modal-content, .ant-drawer-content {
            background-color: #1e1e1e !important;
            color: #e3e3e3 !important;
          }
          .ant-modal-header, .ant-drawer-header {
            background-color: #1e1e1e !important;
            border-bottom: 1px solid #2d2d2d !important;
          }
          .ant-modal-title, .ant-drawer-title {
            color: #e3e3e3 !important;
          }
          .ant-modal-close, .ant-drawer-close {
            color: #8e8e8e !important;
          }
          .ant-table {
            background: transparent !important;
          }
          .ant-table-thead > tr > th {
            background: #1e1e1e !important;
            color: #8e8e8e !important;
            border-bottom: 1px solid #2d2d2d !important;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #2d2d2d !important;
          }
          .ant-table-row:hover > td {
            background: #2d2d2d !important;
          }
          .ant-dropdown-menu {
            background-color: #1e1e1e !important;
            border: 1px solid #2d2d2d !important;
          }
          .ant-select-dropdown {
            background-color: #1e1e1e !important;
          }
          .ant-card {
            border-color: #2d2d2d !important;
            background: #1e1e1e !important;
          }
          .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next {
            background: #1e1e1e !important;
            border-color: #2d2d2d !important;
          }
          .ant-pagination-item a {
            color: #8e8e8e !important;
          }
          .ant-pagination-item-active {
            border-color: #10b981 !important;
          }
          .ant-pagination-item-active a {
            color: #10b981 !important;
          }

          /* Scrollbar Styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #121212;
          }
          ::-webkit-scrollbar-thumb {
            background: #2d2d2d;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #3d3d3d;
          }
        ` : ''}
      `}} />
    </ConfigProvider>
  );
};

