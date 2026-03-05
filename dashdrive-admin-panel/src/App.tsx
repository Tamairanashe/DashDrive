import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { EarningChart } from './components/EarningChart';
import { Leaderboard } from './components/Leaderboard';
import { RecentActivity } from './components/RecentActivity';
import { HeatMapView } from './components/HeatMapView';
import { FleetView } from './components/FleetView';
import { CustomerDetails } from './components/CustomerDetails';
import { DriverDetails } from './components/DriverDetails';
import { SuperAppDashboard } from './components/SuperAppDashboard';
import { CustomerList } from './components/CustomerList';
import { DriverList } from './components/DriverList';
import { DriverVerification } from './components/DriverVerification';
import { FintechDashboard } from './components/FintechDashboard';
import { Transactions } from './components/Transactions';
import { CustomerWallet } from './components/CustomerWallet';
import { DriverWallet } from './components/DriverWallet';
import { WithdrawRequests } from './components/WithdrawRequests';
import { CashlessPayments } from './components/CashlessPayments';
import { PayBills } from './components/PayBills';
import { PayLaterBNPL } from './components/PayLaterBNPL';
import { Loans } from './components/Loans';
import { Donations } from './components/Donations';
import { PaymentReports } from './components/PaymentReports';
import { DFSScores } from './components/DFSScores';
import { ZoneSetup } from './components/ZoneSetup';
import { AnalyticsView } from './components/AnalyticsView';
import { DriverRewards } from './components/DriverRewards';
import { RideDashboard } from './components/RideDashboard';
import { RideRequests } from './components/RideRequests';
import { Trips } from './components/Trips';
import { RideDrivers } from './components/RideDrivers';
import { FareSetup } from './components/FareSetup';
import { SurgePricing } from './components/SurgePricing';
import { FoodDashboard } from './components/FoodDashboard';
import { FoodOrders } from './components/FoodOrders';
import { RestaurantManagement } from './components/RestaurantManagement';
import { MenuManagement } from './components/MenuManagement';
import { FoodDeliveryZones } from './components/FoodDeliveryZones';
import { PromotionsManagement } from './components/PromotionsManagement';
import { MartOrders } from './components/MartOrders';
import { MartStores } from './components/MartStores';
import { MartInventory } from './components/MartInventory';
import { MartCategories } from './components/MartCategories';
import { MartDeliveryFees } from './components/MartDeliveryFees';
import { ShoppingDashboard } from './components/ShoppingDashboard';
import { ShoppingProducts } from './components/ShoppingProducts';
import { ShoppingCategories } from './components/ShoppingCategories';
import { ShoppingOrders } from './components/ShoppingOrders';
import { ShoppingVendors } from './components/ShoppingVendors';
import { ShoppingReviews } from './components/ShoppingReviews';
import { ParcelDashboard } from './components/ParcelDashboard';
import { ParcelOrders } from './components/ParcelOrders';
import { ParcelCategories } from './components/ParcelCategories';
import { ParcelWeights } from './components/ParcelWeights';
import { ParcelAttributes } from './components/ParcelAttributes';
import { RefundRequests } from './components/RefundRequests';
import { FinanceReports } from './components/FinanceReports';
import { MarketingHub } from './components/MarketingHub';
import { VehicleManagement } from './components/VehicleManagement';
import { PagesManager } from './components/PagesManager';
import { MediaLibrary } from './components/MediaLibrary';
import { BusinessSetup } from './components/BusinessSetup';
import { EnterpriseBusinessSetup } from './components/EnterpriseBusinessSetup';
import { GeneralConfig } from './components/GeneralConfig';
import { RolesPermissions } from './components/RolesPermissions';
import { SystemSettings } from './components/SystemSettings';
import { SupportTickets } from './components/SupportTickets';
import { NotificationSettings } from './components/NotificationSettings';
import { ThirdPartyConfig } from './components/ThirdPartyConfig';
import { FaceVerification } from './components/FaceVerification';
import { AISetup } from './components/AISetup';
import { ServiceGroups } from './components/ServiceGroups';
import { BlogSetup } from './components/BlogSetup';
import { AppDownloadSetup } from './components/AppDownloadSetup';
import { PrioritySetup } from './components/PrioritySetup';
import { CustomerLevelSetup } from './components/CustomerLevelSetup';
import { Employees } from './components/Employees';
import { UserWallet } from './components/UserWallet';
import { DispatchManagement } from './components/DispatchManagement';
import { SolvedAlertList } from './components/SolvedAlertList';
import { SystemLogs } from './components/SystemLogs';
import { cn } from './utils';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  XCircle,
  RotateCcw,
  Calendar,
  AlertTriangle,
  UserCheck,
  Car
} from 'lucide-react';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('Dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const navigateToCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentView('Customer Details');
  };

  const navigateToDriver = (id: string) => {
    setSelectedDriverId(id);
    setCurrentView('Driver Details');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return <SuperAppDashboard onNavigate={setCurrentView} />;
      case 'Heat Map':
        return <HeatMapView />;
      case 'Fleet View':
        return <FleetView onCustomerClick={navigateToCustomer} onDriverClick={navigateToDriver} />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Ride Dashboard':
        return <RideDashboard />;
      case 'Ride Requests':
        return <RideRequests />;
      case 'Trips':
        return <Trips />;
      case 'Ride Drivers':
        return <RideDrivers />;
      case 'Fare Setup':
        return <FareSetup />;
      case 'Surge Pricing':
        return <SurgePricing />;
      case 'Food Dashboard':
        return <FoodDashboard />;
      case 'Food Orders':
        return <FoodOrders />;
      case 'Restaurant Management':
        return <RestaurantManagement />;
      case 'Menu Management':
        return <MenuManagement />;
      case 'Food Delivery Zones':
        return <FoodDeliveryZones />;
      case 'Promotions Management':
        return <PromotionsManagement />;
      case 'Mart Orders':
        return <MartOrders />;
      case 'Stores':
        return <MartStores />;
      case 'Products / Inventory':
        return <MartInventory />;
      case 'Categories':
        return <MartCategories />;
      case 'Delivery Fees':
        return <MartDeliveryFees />;
      case 'PShopping Dashboard':
        return <ShoppingDashboard />;
      case 'Shopping Products':
        return <ShoppingProducts />;
      case 'Shopping Categories':
        return <ShoppingCategories />;
      case 'Shopping Orders':
        return <ShoppingOrders />;
      case 'Vendors / Merchants':
        return <ShoppingVendors />;
      case 'Reviews & Ratings':
        return <ShoppingReviews />;
      case 'Parcel Dashboard':
        return <ParcelDashboard />;
      case 'Parcel Orders':
        return <ParcelOrders />;
      case 'Parcel Categories':
        return <ParcelCategories />;
      case 'Parcel Weights':
        return <ParcelWeights />;
      case 'Parcel Attributes':
        return <ParcelAttributes />;
      case 'Refund Requests':
        return <RefundRequests />;
      case 'Customers':
        return <CustomerList onCustomerClick={navigateToCustomer} />;
      case 'Driver List':
        return <DriverList onDriverClick={navigateToDriver} />;
      case 'Driver Verification':
        return <DriverVerification />;
      case 'Zone Setup':
        return <ZoneSetup />;
      case 'Live Tracking':
        return <FleetView onCustomerClick={navigateToCustomer} onDriverClick={navigateToDriver} />;
      case 'Customer Details':
        return <CustomerDetails customerId={selectedCustomerId || 'C-201'} onBack={() => setCurrentView('Customers')} />;
      case 'Driver Details':
        return <DriverDetails driverId={selectedDriverId || 'V-101'} onBack={() => setCurrentView('Drivers')} />;
      case 'Fintech Dashboard':
        return <FintechDashboard />;
      case 'Transactions':
        return <Transactions />;
      case 'Customer Wallet':
        return <CustomerWallet />;
      case 'Driver Wallet':
        return <DriverWallet />;
      case 'Withdraw Requests':
        return <WithdrawRequests />;
      case 'Cashless Payments':
        return <CashlessPayments />;
      case 'Pay Bills':
        return <PayBills />;
      case 'PayLater (BNPL)':
        return <PayLaterBNPL />;
      case 'Loans':
        return <Loans />;
      case 'Donations':
        return <Donations />;
      case 'Payment Reports':
        return <PaymentReports />;
      case 'DFS (Financial Scores)':
        return <DFSScores />;
      case 'Tier Overview':
      case 'Tier Rules':
      case 'Benefits Setup':
      case 'Tier History':
      case 'Global Settings':
        return <DriverRewards activeTab={currentView} />;
      case 'Earnings Reports':
      case 'Commission Reports':
      case 'Financial Analytics':
        return <FinanceReports />;
      case 'Banner Setup':
      case 'Coupon Setup':
      case 'Discount Setup':
      case 'Send Notifications':
      case 'Newsletter':
        return <MarketingHub />;
      case 'Vehicle Attribute':
      case 'Vehicle List':
      case 'Vehicle Request':
      case 'Add New Vehicle':
        return <VehicleManagement />;
      case 'Pages':
        return <PagesManager />;
      case 'Media Library':
        return <MediaLibrary />;
      case 'Enterprise Business Setup':
      case 'Business Info':
      case 'Operations':
      case 'Driver Setup':
      case 'Customer Setup':
      case 'Fare & Penalty':
      case 'Trips Logic':
      case 'Parcel Logic':
      case 'Mart Logic':
      case 'Refund Policy':
      case 'Safety & Security':
      case 'Referral Logic':
      case 'Shopping Logic':
      case 'Food Delivery Logic':
      case 'Chatting Setup':
        return <EnterpriseBusinessSetup activeTab={currentView} />;
      case 'Business Setup':
        return <BusinessSetup />;
      case 'Configuration':
      case 'Logic Engine':
        return <GeneralConfig activeTab={currentView} />;
      case 'Service Groups':
        return <ServiceGroups />;
      case 'Feature Flags':
      case 'App Versioning':
        return <GeneralConfig activeTab={currentView} />;
      case 'Face Verification API':
        return <FaceVerification />;
      case 'AI Setup':
        return <AISetup />;
      case 'App Download Setup':
        return <AppDownloadSetup />;
      case 'Blog Setup':
        return <BlogSetup />;
      case 'Priority Setup':
        return <PrioritySetup />;
      case '3rd Party':
        return <ThirdPartyConfig />;
      case 'Notifications':
        return <NotificationSettings activeTab={currentView} />;
      case 'Roles & Permissions':
      case 'Roles Overview':
      case 'Employee Management':
      case 'Permission Matrix':
        return <RolesPermissions activeTab={currentView} />;
      case 'System Settings':
      case 'Infrastructure':
      case 'Integrations':
      case 'Security Policies':
      case 'Webhooks':
        return <SystemSettings activeTab={currentView} />;
      case 'Support Tickets':
      case 'Active':
      case 'Agents':
      case 'Performance':
      case 'Settings':
        return <SupportTickets initialTab={currentView as any} />;
      case 'Customer Level Setup':
        return <CustomerLevelSetup />;
      case 'Employees':
        return <Employees />;
      case 'User Wallet':
        return <UserWallet />;
      case 'Dispatch Management':
        return <DispatchManagement />;
      case 'Solved Alert List':
        return <SolvedAlertList />;
      case 'System Logs':
        return <SystemLogs />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <AlertTriangle className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-bold">View Under Construction</h2>
            <p className="text-sm">The {currentView} module is currently being implemented.</p>
            <button
              onClick={() => setCurrentView('Dashboard')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main font-sans">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out",
        isCollapsed ? "ml-24" : "ml-72"
      )}>
        <Header />

        <div className="p-8 h-[calc(100vh-80px)] overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
