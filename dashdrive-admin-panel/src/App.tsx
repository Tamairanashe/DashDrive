import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MerchantListPage } from './pages/MerchantListPage';
import { DriverListPage } from './pages/DriverListPage';
import { CustomerListPage } from './pages/CustomerListPage';
import { FleetViewPage } from './pages/FleetViewPage';
import { ZoneSetupPage } from './pages/ZoneSetupPage';
import { FraudManagementPage } from './pages/FraudManagementPage';
import { SupportTicketsPage } from './pages/SupportTicketsPage';
import { DriverVerificationPage } from './pages/DriverVerificationPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { RoutingOptimizationPage } from './pages/RoutingOptimizationPage';
import { SettlementPage } from './pages/SettlementPage';
import { EnterpriseSetupPage } from './pages/EnterpriseSetupPage';
import { AppCMSPage } from './pages/AppCMSPage';
import { MarketingHubPage } from './pages/MarketingHubPage';
import { FinanceAnalyticsPage } from './pages/FinanceAnalyticsPage';
import { VehicleManagementPage } from './pages/VehicleManagementPage';
import { ServiceConfigPage } from './pages/ServiceConfigPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { CustomerLevelSetupPage } from './pages/CustomerLevelSetupPage';
import { SystemLogsPage } from './pages/SystemLogsPage';
import { DriverRewardsPage } from './pages/DriverRewardsPage';
import { EnterpriseSettingsPage } from './pages/EnterpriseSettingsPage';
import { ContentManagerPage } from './pages/ContentManagerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HeatMapPage } from './pages/HeatMapPage';
import { DispatchManagementPage } from './pages/DispatchManagementPage';
import { FoodDeliveryPage } from './pages/FoodDeliveryPage';
import { MartDeliveryPage } from './pages/MartDeliveryPage';
import { ShoppingPage } from './pages/ShoppingPage';
import { RideHailingPage } from './pages/RideHailingPage';
import { ParcelDeliveryPage } from './pages/ParcelDeliveryPage';
import { FintechPage } from './pages/FintechPage';
import { DriverLeaderboardPage } from './pages/DriverLeaderboardPage';
import { DriverLevelSetupPage } from './pages/DriverLevelSetupPage';
import { GrowthEnginePage } from './pages/GrowthEnginePage';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          
          {/* Dashboard Domain */}
          <Route path="dashboard/heatmap" element={<HeatMapPage />} />
          <Route path="dashboard/fleet" element={<FleetViewPage />} />
          <Route path="dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="dashboard/dispatch" element={<DispatchManagementPage />} />

          {/* Services */}
          <Route path="services/ride" element={<RideHailingPage />} />
          <Route path="services/food" element={<FoodDeliveryPage />} />
          <Route path="services/mart" element={<MartDeliveryPage />} />
          <Route path="services/shopping" element={<ShoppingPage />} />
          <Route path="services/parcel" element={<ParcelDeliveryPage />} />
          <Route path="services/payments" element={<FintechPage />} />
          
          {/* Driver Management */}
          <Route path="drivers/list" element={<DriverListPage />} />
          <Route path="drivers/verification" element={<DriverVerificationPage />} />
          <Route path="drivers/rewards" element={<DriverRewardsPage />} />
          <Route path="drivers/leaderboard" element={<DriverLeaderboardPage />} />
          <Route path="drivers/tier-setup" element={<DriverLevelSetupPage />} />

          {/* User Management */}
          <Route path="users/customers" element={<CustomerListPage />} />
          <Route path="users/tier-setup" element={<CustomerLevelSetupPage />} />
          <Route path="users/employees" element={<UserManagementPage />} />
          <Route path="users/wallet" element={<UserManagementPage />} />
          
          {/* Operations */}
          <Route path="ops/zones" element={<ZoneSetupPage />} />
          <Route path="ops/dispatch" element={<RoutingOptimizationPage />} />
          <Route path="ops/tracking" element={<LiveTrackingPage />} />
          <Route path="ops/alerts" element={<FraudManagementPage />} />
          <Route path="ops/logs" element={<SystemLogsPage />} />

          {/* Vehicle Management */}
          <Route path="vehicles/attributes" element={<VehicleManagementPage />} />
          <Route path="vehicles/list" element={<VehicleManagementPage />} />
          <Route path="vehicles/requests" element={<VehicleManagementPage />} />
          <Route path="vehicles/add" element={<VehicleManagementPage />} />

          {/* Marketing */}
          <Route path="marketing/banners" element={<MarketingHubPage />} />
          <Route path="marketing/coupons" element={<MarketingHubPage />} />
          <Route path="marketing/discounts" element={<MarketingHubPage />} />
          <Route path="marketing/notifications" element={<MarketingHubPage />} />
          <Route path="marketing/newsletter" element={<MarketingHubPage />} />
          <Route path="marketing/growth-engine" element={<GrowthEnginePage />} />

          {/* Finance */}
          <Route path="finance/transactions" element={<FinanceAnalyticsPage />} />
          <Route path="finance/earnings" element={<FinanceAnalyticsPage />} />
          <Route path="finance/commissions" element={<FinanceAnalyticsPage />} />
          <Route path="finance/analytics" element={<FinanceAnalyticsPage />} />
          <Route path="finance/settlements" element={<SettlementPage />} />

          {/* Content */}
          <Route path="content/blog" element={<ContentManagerPage />} />
          <Route path="content/pages" element={<AppCMSPage />} />
          <Route path="content/media" element={<ContentManagerPage />} />

          {/* Support */}
          <Route path="support/tickets" element={<SupportTicketsPage />} />

          {/* Enterprise */}
          <Route path="enterprise/setup" element={<EnterpriseSetupPage />} />
          <Route path="enterprise/config" element={<EnterpriseSettingsPage />} />
          <Route path="enterprise/roles" element={<EnterpriseSettingsPage />} />
          <Route path="enterprise/settings" element={<EnterpriseSettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
