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

// Renter Pages
import Home from './pages/Home';
import Search from './pages/Search';
import VehicleDetails from './pages/VehicleDetails';

const { Header, Sider, Content } = Layout;

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
          className="border-r border-gray-100 shadow-xl"
          width={260}
        >
          <div className="h-16 flex items-center px-6 font-black text-2xl text-indigo-600 border-b border-gray-50 uppercase tracking-tighter">
            {collapsed ? 'D' : 'DashDrive'}
          </div>
          <Menu 
            theme="light" 
            selectedKeys={[location.pathname]} 
            mode="inline" 
            items={hostMenuItems}
            className="mt-4 border-none"
          />
        </Sider>
      )}
      <Layout style={{ background: 'transparent' }}>
        <Header className={`${isHostMode ? 'bg-white/80' : 'bg-white'} backdrop-blur-md px-8 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50 h-20`}>
          <div className="flex items-center space-x-12">
            {!isHostMode && (
              <div className="font-black text-2xl text-indigo-600 uppercase tracking-tighter">
                DashDrive
              </div>
            )}
            {isHostMode ? (
              <div className="font-bold text-xl text-gray-800">{currentTitle}</div>
            ) : (
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">Find a car</Link>
                <Link to="/search" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">Browse Marketplace</Link>
              </nav>
            )}
          </div>

          <Space size="large">
            <Button 
              onClick={toggleMode}
              className="rounded-full border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50"
            >
              {isHostMode ? 'Switch to Renting' : 'Switch to Hosting'}
            </Button>
            
            {isHostMode && (
              <Badge count={5} size="small" offset={[2, 2]}>
                <div className="p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <BellOutlined className="text-xl text-gray-600" />
                </div>
              </Badge>
            )}
            
            <Dropdown menu={{ items: [{ key: '1', label: 'Profile' }, { key: '2', label: 'Logout' }] }} placement="bottomRight">
              <Avatar size="large" icon={<UserOutlined />} className="cursor-pointer bg-indigo-100 text-indigo-600 border-2 border-white shadow-sm" />
            </Dropdown>
          </Space>
        </Header>
        <Content className={`${isHostMode ? 'm-8' : 'm-0'} overflow-auto`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Routes location={location}>
                {/* Renter Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/vehicle/:id" element={<VehicleDetails />} />

                {/* Host Routes */}
                <Route path="/host" element={<Dashboard />} />
                <Route path="/host/listings" element={<Listings />} />
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 16,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 12,
            controlHeight: 40,
            fontWeight: 600,
          },
          Card: {
            borderRadius: 24,
          },
          Menu: {
            itemBorderRadius: 12,
            itemMarginInline: 12,
          }
        }
      }}
    >
      <Router>
        <AppLayout />
      </Router>
    </ConfigProvider>
  );
}
