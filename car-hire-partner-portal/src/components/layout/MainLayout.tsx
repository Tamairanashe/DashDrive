import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CarOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  ShopOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHostMode, setIsHostMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const renterMenuItems = [
    {
      key: '/',
      icon: <ShopOutlined />,
      label: 'Explore Cars',
    },
    {
      key: '/bookings',
      icon: <ClockCircleOutlined />,
      label: 'My Bookings',
    },
  ];

  const hostMenuItems = [
    {
      key: '/host',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/host/vehicles',
      icon: <CarOutlined />,
      label: 'Vehicles',
    },
    {
      key: '/host/bookings',
      icon: <ClockCircleOutlined />,
      label: 'Bookings',
    },
    {
      key: '/host/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar',
    },
    {
      key: '/host/earnings',
      icon: <DollarOutlined />,
      label: 'Earnings',
    },
  ];

  const menuItems = isHostMode ? hostMenuItems : renterMenuItems;

  const userMenuItems: { items: any[] } = {
    items: [
      {
        key: 'profile',
        label: 'My Profile',
        icon: <UserOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        theme="dark" 
        className="premium-sider shadow-2xl z-20"
        width={260}
      >
        <div className="flex items-center justify-center p-4 h-20 border-b border-white/5">
          <div className="flex items-center gap-3">
            <CarOutlined className="text-3xl text-blue-500" />
            {!collapsed && (
              <Title level={4} className="!m-0 !text-white font-black tracking-tighter">
                DASH<span className="text-blue-500">HIRE</span>
              </Title>
            )}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="mt-6 px-3 border-none"
        />
        <div className="absolute bottom-8 left-0 right-0 px-6">
          {!collapsed && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <Text className="text-white/40 text-[10px] block mb-2 font-bold uppercase tracking-widest">System Health</Text>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Text className="text-white/80 text-xs font-semibold">All Systems Nominal</Text>
              </div>
            </div>
          )}
        </div>
      </Sider>
      <Layout>
        <Header className="glass-header flex justify-between items-center px-8 z-10 h-20">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="hover:!bg-blue-50 !text-gray-600 transition-all rounded-xl"
            style={{ fontSize: '18px', width: 48, height: 48 }}
          />
          
          <div className="flex items-center gap-8">
            <Button 
              onClick={() => {
                const newMode = !isHostMode;
                setIsHostMode(newMode);
                navigate(newMode ? '/host' : '/');
              }}
              icon={<SwapOutlined />}
              className={`rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${
                isHostMode 
                ? 'bg-blue-600 text-white shadow-blue-200 border-none' 
                : 'bg-white text-blue-600 border-blue-100 shadow-gray-100'
              }`}
            >
              {isHostMode ? 'Switch to Renter' : 'Switch to Hosting'}
            </Button>
            
            <Space size={20}>
              <Button 
                type="text" 
                icon={<BellOutlined className="text-xl text-gray-400" />} 
                className="hover:!bg-blue-50 rounded-xl"
              />
              <Dropdown menu={userMenuItems} trigger={['click']} placement="bottomRight">
                <Space className="cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-all py-2 border border-transparent hover:border-gray-100">
                  <Avatar 
                    size={40}
                    icon={<UserOutlined />} 
                    className="bg-blue-600 shadow-lg shadow-blue-200" 
                  />
                  <div className="hidden sm:flex flex-col items-start leading-none gap-1">
                    <Text strong className="text-[13px] text-gray-800">John Partner</Text>
                    <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider text-blue-500">
                      {isHostMode ? 'Marketplace Host' : 'Verified Renter'}
                    </Text>
                  </div>
                  <DownOutlined className="text-[10px] text-gray-400" />
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content
          className="m-6 p-8 overflow-auto custom-scrollbar"
          style={{
            background: 'transparent',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
