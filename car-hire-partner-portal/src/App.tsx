/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Badge, Dropdown, Space, ConfigProvider, Button } from 'antd';
import {
  DashboardOutlined,
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  DollarOutlined,
  LineChartOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import CalendarView from './pages/Calendar';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Messages from './pages/Messages';
import Earnings from './pages/Earnings';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Claims from './pages/Claims';
import MarketplaceListings from './pages/MarketplaceListings';
import HostCalendar from './pages/HostCalendar';
import HostVehicleRegistration from './pages/HostVehicleRegistration';

// Renter Pages
import Home from './pages/Home';
import Search from './pages/Search';
import VehicleDetails from './pages/VehicleDetails';

const { Header, Sider, Content } = Layout;

// Define custom design tokens for a more premium look
const themeConfig = {
  token: {
    colorPrimary: '#6366f1', // Indigo 500
    colorInfo: '#6366f1',
    borderRadius: 16,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f9fafb',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 44,
      fontWeight: 600,
      paddingContentHorizontal: 24,
      boxShadow: 'none',
    },
    Card: {
      borderRadius: 24,
      boxShadowSecondary: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
    },
    Menu: {
      itemBorderRadius: 10,
      itemMarginInline: 12,
      itemSelectedBg: '#eff6ff',
      itemSelectedColor: '#2563eb',
    },
    Layout: {
      headerBg: 'rgba(255, 255, 255, 0.8)',
      headerHeight: 80,
    }
  }
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHostMode, setIsHostMode] = useState(false);
  const location = useLocation();

  const toggleMode = () => {
    setIsHostMode(!isHostMode);
  };

  const hostMenuItems = [
    { key: '/host', icon: <DashboardOutlined />, label: <Link to="/host">Dashboard</Link> },
    { key: '/host/listings', icon: <CarOutlined />, label: <Link to="/host/listings">Fleet</Link> },
    { key: '/host/marketplace', icon: <ShopOutlined />, label: <Link to="/host/marketplace">Properties</Link> },
    { key: '/host/calendar', icon: <CalendarOutlined />, label: <Link to="/host/calendar">Fleet Calendar</Link> },
    { key: '/host/calendar/properties', icon: <CalendarOutlined />, label: <Link to="/host/calendar/properties">Property Calendar</Link> },
    { key: '/host/trips', icon: <EnvironmentOutlined />, label: <Link to="/host/trips">Trips</Link> },
    { key: '/host/claims', icon: <SafetyCertificateOutlined />, label: <Link to="/host/claims">Claims</Link> },
    { key: '/host/messages', icon: <MessageOutlined />, label: <Link to="/host/messages">Messages</Link> },
    { key: '/host/earnings', icon: <DollarOutlined />, label: <Link to="/host/earnings">Earnings</Link> },
    { key: '/host/insights', icon: <LineChartOutlined />, label: <Link to="/host/insights">Insights</Link> },
    { key: '/host/settings', icon: <SettingOutlined />, label: <Link to="/host/settings">Settings</Link> },
  ];

  const currentTitle = isHostMode 
    ? hostMenuItems.find(item => location.pathname.startsWith(item.key as string))?.label.props.children || 'Host Dashboard'
    : 'Dash Car Hire';

  return (
    <Layout style={{ minHeight: '100vh', background: isHostMode ? '#f8fafc' : '#ffffff' }}>
      {isHostMode && (
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)} 
          theme="light"
          className="border-r border-gray-100 shadow-sm"
          width={280}
        >
          <div className="h-20 flex items-center px-8 border-b border-gray-50">
            <Link to="/" className="font-black text-2xl text-indigo-600 uppercase tracking-tighter">
              {collapsed ? 'D' : 'DashDrive'}
            </Link>
          </div>
          <Menu 
            theme="light" 
            selectedKeys={[location.pathname]} 
            mode="inline" 
            items={hostMenuItems}
            className="mt-6 border-none px-2"
          />
        </Sider>
      )}
      <Layout style={{ background: 'transparent' }}>
        <Header className={`${isHostMode ? 'bg-white/80' : 'bg-white/90'} backdrop-blur-xl px-12 flex justify-between items-center border-b border-gray-100/50 sticky top-0 z-[1000] h-20 shadow-sm transition-all duration-300`}>
          <div className="flex items-center space-x-12">
            {!isHostMode && (
              <Link to="/" className="font-black text-2xl text-indigo-600 uppercase tracking-tighter hover:text-indigo-500 transition-colors">
                DashDrive
              </Link>
            )}
            {isHostMode ? (
              <div className="font-bold text-lg text-gray-800 tracking-tight">{currentTitle}</div>
            ) : (
              <nav className="hidden md:flex items-center space-x-10">
                <Link to="/" className="text-gray-500 hover:text-indigo-600 font-bold transition-all hover:translate-y-[-1px]">Find a car</Link>
                <Link to="/search" className="text-gray-500 hover:text-indigo-600 font-bold transition-all hover:translate-y-[-1px]">Marketplace</Link>
              </nav>
            )}
          </div>

          <Space size="middle">
            <Button 
              onClick={toggleMode}
              type="text"
              className="rounded-xl text-indigo-600 font-black hover:bg-indigo-50 px-6 h-11"
            >
              {isHostMode ? 'Switch to Renting' : 'Switch to Hosting'}
            </Button>
            
            {isHostMode && (
              <Badge count={5} size="small" offset={[-2, 10]} color="#6366f1">
                <Button 
                  type="text" 
                  icon={<BellOutlined className="text-xl text-gray-400 group-hover:text-indigo-500" />} 
                  className="rounded-xl w-11 h-11 flex items-center justify-center hover:bg-gray-50 group"
                />
              </Badge>
            )}
            
            <Dropdown menu={{ items: [{ key: '1', label: 'Profile' }, { key: '2', label: 'Logout' }] }} placement="bottomRight" arrow>
              <Avatar 
                size={44} 
                icon={<UserOutlined />} 
                className="cursor-pointer bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm hover:border-indigo-300 transition-all" 
              />
            </Dropdown>
          </Space>
        </Header>
        <Content className={`${isHostMode ? 'p-10' : 'p-0'} transition-all duration-300`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + isHostMode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
              <Routes location={location}>
                {/* Renter Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/vehicle/:id" element={<VehicleDetails />} />

                {/* Host Routes */}
                <Route path="/host" element={<Dashboard />} />
                <Route path="/host/listings" element={<Listings />} />
                <Route path="/host/listings/new" element={<HostVehicleRegistration />} />
                <Route path="/host/marketplace" element={<MarketplaceListings />} />
                <Route path="/host/calendar" element={<CalendarView />} />
                <Route path="/host/calendar/properties" element={<HostCalendar />} />
                <Route path="/host/trips" element={<Trips />} />
                <Route path="/host/trips/:id" element={<TripDetails />} />
                <Route path="/host/claims" element={<Claims />} />
                <Route path="/host/messages" element={<Messages />} />
                <Route path="/host/earnings" element={<Earnings />} />
                <Route path="/host/insights" element={<Insights />} />
                <Route path="/host/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AppLayout />
      </Router>
    </ConfigProvider>
  );
}
