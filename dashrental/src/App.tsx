/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CarDetails } from './pages/CarDetails';
import { Trips } from './pages/Trips';
import { Profile } from './pages/Profile';
import { HostCarListing } from './pages/HostCarListing';
import { Checkout } from './pages/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import { HostLayout } from './components/HostLayout';
import { HostDashboard } from './pages/HostDashboard';
import { HostTrips } from './pages/HostTrips';
import { HostVehicles } from './pages/HostVehicles';
import { HostClaims } from './pages/HostClaims';
import { HostBusiness } from './pages/HostBusiness';
import { HostSettings } from './pages/HostSettings';
import { HostMessages } from './pages/HostMessages';
import { motion, AnimatePresence } from 'motion/react';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          {/* Host Routes */}
          <Route path="/host" element={<HostLayout />}>
            <Route index element={<HostDashboard />} />
            <Route path="new" element={<HostCarListing />} />
            <Route path="trips" element={<HostTrips />} />
            <Route path="vehicles" element={<HostVehicles />} />
            <Route path="inbox" element={<HostMessages />} />
            <Route path="claims" element={<HostClaims />} />
            <Route path="business" element={<HostBusiness />} />
            <Route path="settings" element={<HostSettings />} />
          </Route>

          {/* Guest Routes */}
          <Route path="*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/car/:id" element={<CarDetails />} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="*" element={<div className="p-12 text-center text-xl text-gray-500">Coming soon</div>} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-700">
          <AnimatedRoutes />
          <Toaster position="top-center" 
            toastOptions={{
              style: {
                borderRadius: '1rem',
                background: '#1f2937',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: '600',
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
