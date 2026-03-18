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
import { SupportHubPage } from './pages/SupportHubPage';
import { DriverVerificationPage } from './pages/DriverVerificationPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { RoutingOptimizationPage } from './pages/RoutingOptimizationPage';
import { SettlementPage } from './pages/SettlementPage';
import { EnterpriseSetupPage } from './pages/EnterpriseSetupPage';
import { AppCMSPage } from './pages/AppCMSPage';
import { MarketingHubPage } from './pages/MarketingHubPage';
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
import { CityToCityPage } from './pages/CityToCityPage';
import { EventsBookingPage } from './pages/EventsBookingPage';
import { CarRentalManagementPage } from './pages/CarRentalManagementPage';
import { MarketplaceConfigPage } from './pages/MarketplaceConfigPage';
import { MarketplaceManagementPage } from './pages/MarketplaceManagementPage';
import { LoanProductManagement } from './pages/Fintech/LoanProductManagement';
import { InsuranceManagement } from './pages/Fintech/InsuranceManagement';
import { KycVerification } from './pages/Fintech/KycVerification';
import { CreateBlogPage } from './pages/CreateBlogPage';
import { SystemSettingsPage } from './pages/SystemSettingsPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { ApiManagementPage } from './pages/ApiManagementPage';
import { ThemeProvider } from './context/ThemeContext';
import { FinancialReportsHub } from './pages/FinancialReportsHub';
import { TechnicalResolutionPage } from './pages/TechnicalResolutionPage';
import { FintechPartnerHub } from './pages/FintechPartnerHub';
import { ReputationManagementHub } from './pages/ReputationManagementHub';
import FareManagementHub from './pages/FareManagementHub';
import { DriverBundleHub } from './pages/Fintech/DriverBundleHub';
import { UtilityPaymentHub } from './pages/Fintech/UtilityPaymentHub';
import { DashWalletTransfer } from './pages/Fintech/DashWalletTransfer';
import { MarketingGrowthEngine } from './pages/GrowthEnginePage';
import { OperationsHubPage } from './pages/OperationsHubPage';
import { DriverManagementHub } from './pages/DriverManagementHub';
import { DriverRetentionHub } from './pages/DriverRetentionHub';
import { CourierManagementHub } from './pages/CourierManagementHub';
import { FleetOperatorHub } from './pages/FleetOperatorHub';
import SchoolRunMonitoring from './pages/SchoolRunMonitoring';

export default function App() {
  // Authentication check bypassed as requested
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <LoginPage />;
  // }

  return (
    <ThemeProvider>
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
            <Route path="services/hotels" element={<MarketplaceManagementPage />} />
            <Route path="services/events" element={<EventsBookingPage />} />
            <Route path="services/rental" element={<CarRentalManagementPage />} />
            <Route path="services/marketplace" element={<MarketplaceManagementPage />} />
            <Route path="services/transport" element={<CityToCityPage />} />
            <Route path="services/payments" element={<FintechPage />} />
            <Route path="services/school-run" element={<SchoolRunMonitoring />} />
            <Route path="services/payments/loans" element={<LoanProductManagement />} />
            <Route path="services/payments/insurance" element={<InsuranceManagement />} />
            <Route path="services/payments/kyc" element={<KycVerification />} />
            <Route path="services/config" element={<ServiceConfigPage />} />
            
            {/* Driver Management */}
            <Route path="drivers/list" element={<DriverManagementHub />} />
            <Route path="drivers/verification" element={<DriverManagementHub />} />
            <Route path="drivers/rewards" element={<DriverRetentionHub />} />
            <Route path="drivers/leaderboard" element={<DriverRetentionHub />} />
            <Route path="drivers/tier-setup" element={<DriverRetentionHub />} />
            <Route path="drivers/bundles" element={<DriverBundleHub />} />

            {/* Courier Management */}
            <Route path="partners/couriers/list" element={<CourierManagementHub initialTab="1" />} />
            <Route path="partners/couriers/requests" element={<CourierManagementHub initialTab="2" />} />
            <Route path="partners/couriers/earnings" element={<CourierManagementHub initialTab="4" />} />

            {/* Fleet Management */}
            <Route path="partners/fleets/list" element={<FleetOperatorHub initialTab="1" />} />
            <Route path="partners/fleets/requests" element={<FleetOperatorHub initialTab="2" />} />
            <Route path="partners/fleets/earnings" element={<FleetOperatorHub initialTab="5" />} />

            {/* User Management */}
            <Route path="users/customers" element={<CustomerListPage />} />
            <Route path="users/tier-setup" element={<CustomerLevelSetupPage />} />
            <Route path="users/employees" element={<UserManagementPage />} />
            <Route path="users/wallet" element={<UserManagementPage />} />
            
            {/* Operations */}
            <Route path="ops/hub" element={<OperationsHubPage initialTab="1" />} />
            <Route path="ops/zones" element={<OperationsHubPage initialTab="2" />} />
            <Route path="ops/dispatch" element={<OperationsHubPage initialTab="3" />} />
            <Route path="ops/tracking" element={<OperationsHubPage initialTab="4" />} />
            <Route path="ops/alerts" element={<OperationsHubPage initialTab="5" />} />
            <Route path="ops/logs" element={<OperationsHubPage initialTab="6" />} />
            <Route path="ops/surge" element={<OperationsHubPage initialTab="7" />} />
            <Route path="ops/analytics" element={<OperationsHubPage initialTab="8" />} />

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
            <Route path="marketing/growth-engine" element={<MarketingGrowthEngine />} />

            {/* Finance */}
            <Route path="finance/fares" element={<FareManagementHub />} />
            <Route path="finance/transactions" element={<FinancialReportsHub />} />
            <Route path="finance/earnings" element={<FinancialReportsHub />} />
            <Route path="finance/commissions" element={<FinancialReportsHub />} />
            <Route path="finance/analytics" element={<FinancialReportsHub />} />
            <Route path="finance/settlements" element={<SettlementPage />} />
            <Route path="finance/partners" element={<FintechPartnerHub />} />
            <Route path="finance/marketplace" element={<MarketplaceConfigPage />} />
            <Route path="finance/utility" element={<UtilityPaymentHub />} />
            <Route path="finance/transfer" element={<DashWalletTransfer />} />

            {/* Content */}
            <Route path="content/blog" element={<ContentManagerPage />} />
            <Route path="content/blog/create" element={<CreateBlogPage />} />

            {/* Quality & Reputation */}
            <Route path="quality/reviews" element={<ReputationManagementHub activeTab="1" />} />
            <Route path="quality/feedback" element={<ReputationManagementHub activeTab="2" />} />
            <Route path="quality/moderation" element={<ReputationManagementHub activeTab="3" />} />
            <Route path="quality/analytics" element={<ReputationManagementHub activeTab="4" />} />

            {/* Support */}
            <Route path="support/hub" element={<SupportHubPage />} />
            <Route path="support/tickets" element={<SupportHubPage />} />
            <Route path="support/technical" element={<TechnicalResolutionPage />} />

            {/* Enterprise */}
            <Route path="enterprise/setup" element={<EnterpriseSetupPage />} />
            <Route path="enterprise/config" element={<ConfigurationPage />} />
            <Route path="enterprise/roles" element={<EnterpriseSettingsPage />} />
            <Route path="enterprise/settings" element={<SystemSettingsPage />} />
            <Route path="enterprise/api" element={<ApiManagementPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
