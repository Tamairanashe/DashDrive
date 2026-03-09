import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProviderLayout } from './layouts/ProviderLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { CustomersPage } from './pages/CustomersPage';
import { RiskPage } from './pages/RiskPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { RepaymentsPage } from './pages/RepaymentsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BillingPage } from './pages/BillingPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MarketingPage } from './pages/MarketingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProviderLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="borrowers" element={<CustomersPage />} />
          <Route path="risk" element={<RiskPage />} />
          <Route path="disbursements" element={<PaymentsPage />} />
          <Route path="repayments" element={<RepaymentsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
