/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Orders from './pages/Orders';
import Attendees from './pages/Attendees';
import Analytics from './pages/Analytics';
import Scanner from './pages/Scanner';
import Payouts from './pages/Payouts';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/attendees" element={<Attendees />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
