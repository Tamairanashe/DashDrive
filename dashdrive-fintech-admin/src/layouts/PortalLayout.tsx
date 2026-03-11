import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Badge, Input, ConfigProvider, theme } from 'antd';
import { 
  AppstoreOutlined, 
  TeamOutlined, 
  CarOutlined, 
  UserOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  AlertOutlined,
  DollarOutlined,
  PieChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  BellOutlined,
  RocketOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export const PortalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <AppstoreOutlined />, label: 'Dashboard' },
    {
      key: 'sub-users',
      icon: <TeamOutlined />,
      label: 'Directory',
      children: [
        { key: '/users', icon: <UserOutlined />, label: 'Global Users' },
        { key: '/drivers', icon: <CarOutlined />, label: 'Drivers' },
      ],
    },
    {
      key: 'sub-finance',
      icon: <BankOutlined />,
      label: 'Finance',
      children: [
        { key: '/loans', label: 'Loans' },
        { key: '/bnpl', label: 'BNPL' },
        { key: '/vehicle-financing', label: 'Vehicle Financing' },
      ],
    },
    {
      key: 'sub-insurance',
      icon: <SafetyCertificateOutlined />,
      label: 'Insurance',
      children: [
        { key: '/policies', label: 'Policies' },
        { key: '/claims', label: 'Claims' },
      ],
    },
    { key: '/partners', icon: <ApiOutlined />, label: 'Partners' },
    { key: '/risk', icon: <AlertOutlined />, label: 'Risk & Fraud' },
    { key: '/billing', icon: <DollarOutlined />, label: 'Billing' },
    { key: '/marketing', icon: <RocketOutlined />, label: 'Marketing' },
    { key: '/reports', icon: <PieChartOutlined />, label: 'Reports' },
    {
      key: 'sub-system',
      icon: <SettingOutlined />,
      label: 'System',
      children: [
        { key: '/integrations', label: 'Integrations' },
        { key: '/settings', label: 'Configuration' },
        { key: '/audit', icon: <AuditOutlined />, label: 'Audit Logs' },
      ],
    },
  ];

  const profileMenu = {
    items: [
      { key: '1', label: 'Admin Profile' },
      { key: '2', label: 'Global Settings' },
      { type: 'divider' as const },
      { key: '3', label: 'Log Out', danger: true },
    ]
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#722ed1', borderRadius: 6 } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed} width={260} theme="dark" style={{ background: '#000000', borderRight: '1px solid #1f1f1f' }}>
          <div style={{ height: 64, margin: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#fff', fontSize: collapsed ? 16 : 18, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {collapsed ? 'FA' : 'Fintech Admin'}
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ background: '#000000', borderRight: 'none' }}
          />
        </Sider>
        <Layout style={{ background: '#141414' }}>
          <Header style={{ padding: '0 24px', background: '#000000', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 64, height: 64, color: '#fff' }}
              />
              <Input.Search 
                placeholder="Global Search (Users, Loans, Policies)..." 
                style={{ width: 400, marginLeft: 16 }} 
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />} 
                allowClear
                size="middle"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Badge count={2} size="small" color="#f5222d">
                <Button type="text" icon={<BellOutlined style={{ fontSize: 20, color: '#fff' }} />} />
              </Badge>
              <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10, padding: '4px 8px' }}>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }} />
                  <span style={{ color: '#fff', fontWeight: 600 }}>Super Admin</span>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ margin: '24px', minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
