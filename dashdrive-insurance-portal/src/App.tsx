import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InsuranceLayout } from './layouts/InsuranceLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { RiskPage } from './pages/RiskPage';
import { PremiumsPage } from './pages/PremiumsPage';
import { FraudPage } from './pages/FraudPage';
import { BillingPage } from './pages/BillingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MarketingPage } from './pages/MarketingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InsuranceLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="claims" element={<ClaimsPage />} />
          <Route path="risk" element={<RiskPage />} />
          <Route path="premiums" element={<PremiumsPage />} />
          <Route path="fraud" element={<FraudPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
