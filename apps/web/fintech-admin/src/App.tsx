import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { PortalLayout } from './layouts/PortalLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { GlobalUsers } from './pages/users/GlobalUsers';
import { Drivers } from './pages/users/Drivers';
import { LoansAdmin } from './pages/finance/LoansAdmin';
import { BNPLAdmin } from './pages/finance/BNPLAdmin';
import { VehicleFinancingAdmin } from './pages/finance/VehicleFinancingAdmin';
import { PoliciesAdmin } from './pages/insurance/PoliciesAdmin';
import { ClaimsAdmin } from './pages/insurance/ClaimsAdmin';
import { RiskAdmin } from './pages/risk/RiskAdmin';
import { PartnersAdmin } from './pages/settings/PartnersAdmin';
import { BillingAdmin } from './pages/billing/BillingAdmin';
import { MarketingAdmin } from './pages/marketing/MarketingAdmin';
import { ReportsAdmin } from './pages/reports/ReportsAdmin';
import { SettingsAdmin } from './pages/settings/SettingsAdmin';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#722ed1', // DashDrive Admin Protocol Purple
          colorBgBase: '#000000',
          colorBgContainer: '#141414',
          colorBgElevated: '#1f1f1f',
          colorBorderSecondary: '#303030',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Directory */}
            <Route path="users" element={<GlobalUsers />} />
            <Route path="drivers" element={<Drivers />} />
            
            {/* Finance Management */}
            <Route path="loans" element={<LoansAdmin />} />
            <Route path="bnpl" element={<BNPLAdmin />} />
            <Route path="vehicle-financing" element={<VehicleFinancingAdmin />} />
            
            {/* Insurance Management */}
            <Route path="policies" element={<PoliciesAdmin />} />
            <Route path="claims" element={<ClaimsAdmin />} />

            {/* Platform Management */}
            <Route path="partners" element={<PartnersAdmin />} />
            <Route path="risk" element={<RiskAdmin />} />
            <Route path="billing" element={<BillingAdmin />} />
            <Route path="marketing" element={<MarketingAdmin />} />
            <Route path="reports" element={<ReportsAdmin />} />
            
            {/* System Placeholders */}
            <Route path="integrations" element={<div style={{ color: 'white', padding: 24 }}>Service Health & APIs (Coming Soon)</div>} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="audit" element={<div style={{ color: 'white', padding: 24 }}>Immutable Action Logs (Coming Soon)</div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
