import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import VehicleDetails from './pages/VehicleDetails';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';
import Vehicles from './pages/host/Vehicles';
import HostBookings from './pages/host/Bookings';
import Earnings from './pages/host/Earnings';
import Calendar from './pages/host/Calendar';
import { ConfigProvider } from 'antd';
import { dashHireTheme } from './theme/dashHireTheme';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ConfigProvider theme={dashHireTheme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/host/create" element={<CreateListing />} />
            <Route path="/host/vehicles" element={<Vehicles />} />
            <Route path="/host/bookings" element={<HostBookings />} />
            <Route path="/host/earnings" element={<Earnings />} />
            <Route path="/host/calendar" element={<Calendar />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
