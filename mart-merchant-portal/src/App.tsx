import { useState } from 'react'
import { ConfigProvider } from 'antd'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Orders } from './components/Orders'
import { Inventory } from './components/Inventory'
import { Performance } from './components/Performance'
import { AddProduct } from './components/AddProduct'
import { Financials } from './components/Financials'
import { Stores } from './components/stores/Stores';
import { StoreHours } from './components/stores/StoreHours';
import { HolidayHours } from './components/stores/HolidayHours';
import { MarketingOverview } from './components/marketing/MarketingOverview';
import { Offers } from './components/marketing/Offers';
import { Campaigns } from './components/marketing/Campaigns';
import { FeaturedProducts } from './components/marketing/FeaturedProducts';
import { Promotions } from './components/marketing/Promotions';
import { Customers } from './components/Customers';
import { Settings } from './components/Settings';
import { Help } from './components/Help';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Inter', system-ui, sans-serif",
          colorPrimary: '#18181b', // zinc-900
          colorInfo: '#18181b',
          colorSuccess: '#10b981', // emerald-500
          colorWarning: '#f59e0b', // amber-500
          colorError: '#ef4444', // red-500
          borderRadius: 12,
          fontWeightStrong: 500, // Lightweight headers
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#fafafa', // zinc-50
            siderBg: '#ffffff',
          },
          Card: {
            borderRadius: 24,
            headerFontSize: 16,
          },
        },
      }}
    >
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'inventory' && <Inventory onAddProduct={() => setActiveTab('addProduct')} />}
        {activeTab === 'performance' && <Performance />}
        {activeTab === 'addProduct' && <AddProduct />}
        {activeTab === 'financials' && <Financials />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'stores' && <Stores onNavigate={setActiveTab} />}
        {activeTab === 'store-hours' && <StoreHours />}
        {activeTab === 'holiday-hours' && <HolidayHours />}
        {activeTab === 'marketing-overview' && <MarketingOverview />}
        {activeTab === 'offers' && <Offers />}
        {activeTab === 'campaigns' && <Campaigns />}
        {activeTab === 'featured-products' && <FeaturedProducts />}
        {activeTab === 'promotions' && <Promotions />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'help' && <Help />}
        {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'inventory' &&
          activeTab !== 'performance' && activeTab !== 'addProduct' && activeTab !== 'financials' &&
          activeTab !== 'stores' && activeTab !== 'store-hours' && activeTab !== 'holiday-hours' &&
          activeTab !== 'marketing-overview' && activeTab !== 'offers' &&
          activeTab !== 'campaigns' && activeTab !== 'featured-products' && activeTab !== 'promotions' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              Content for {activeTab} is coming soon...
            </div>
          )}
      </Layout>
    </ConfigProvider>
  )
}

export default App
