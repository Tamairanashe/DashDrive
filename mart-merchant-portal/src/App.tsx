import { useState, useEffect } from 'react'
import { ConfigProvider, message } from 'antd'
import { api } from './api'

import { Layout as MartLayout } from './components/Layout'
import { DirectLayout } from './components/direct/DirectLayout'
import { DirectOverview } from './components/direct/DirectOverview'
import { DirectDeliveries } from './components/direct/DirectDeliveries'
import { DirectCreateDelivery } from './components/direct/DirectCreateDelivery'
import { DirectTracking } from './components/direct/DirectTracking'
import { DirectBilling } from './components/direct/DirectBilling'
import { DirectDeveloper } from './components/direct/DirectDeveloper'
import { PublicTracking } from './components/direct/PublicTracking'
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
import { Login } from './components/Login';
import { DirectLogin } from './components/DirectLogin';
import { FoodLogin } from './components/FoodLogin';
import { SignUp } from './components/SignUp';

import { ForgotPassword } from './components/ForgotPassword';
import { EmailVerification } from './components/EmailVerification';
import { OnboardingWizard } from './components/OnboardingWizard';
import { LandingPage } from './components/LandingPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [directActiveTab, setDirectActiveTab] = useState('overview');
  const [portalType, setPortalType] = useState<'mart' | 'direct' | null>(null);
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'direct_login' | 'food_login' | 'signup' | 'forgot_password' | 'email_verification' | 'onboarding' | 'public_tracking'>('landing');

  const [merchant, setMerchant] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('merchant_token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const storedToken = localStorage.getItem('merchant_token');
      if (!storedToken) return;
      const profile = await api.merchants.getProfile(storedToken);
      setMerchant(profile);
      setPortalType('mart');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // localStorage.removeItem('merchant_token'); // Don't remove yet, might be transient
      // setToken(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('merchant_token');
    setToken(null);
    setMerchant(null);
    setPortalType(null);
    setAuthMode('landing');
  };

  // Simple routing for public tracking links
  useEffect(() => {
    if (window.location.pathname.startsWith('/track/')) {
      setAuthMode('public_tracking');
    }
  }, []);

  if (!portalType) {
    if (authMode === 'landing') {
      return (
        <LandingPage
          onSignIn={() => setAuthMode('login')}
          onDirectSignIn={() => setAuthMode('direct_login')}
          onFoodSignIn={() => setAuthMode('food_login')}
          onSignUp={() => setAuthMode('signup')}
        />
      );
    } else if (authMode === 'login') {
      return <Login onLogin={() => setToken(localStorage.getItem('merchant_token'))} onSwitchToSignup={() => setAuthMode('signup')} onForgotPassword={() => setAuthMode('forgot_password')} />;
    } else if (authMode === 'direct_login') {
      return <DirectLogin onLogin={() => { setToken(localStorage.getItem('merchant_token')); setPortalType('direct'); }} onSwitchToSignup={() => setAuthMode('signup')} onForgotPassword={() => setAuthMode('forgot_password')} />;
    } else if (authMode === 'food_login') {
      return <FoodLogin onLogin={() => setToken(localStorage.getItem('merchant_token'))} onSwitchToSignup={() => setAuthMode('signup')} onForgotPassword={() => setAuthMode('forgot_password')} />;
    } else if (authMode === 'signup') {
      return <SignUp onSignup={() => setAuthMode('email_verification')} onSwitchToLogin={() => setAuthMode('login')} />;
    } else if (authMode === 'forgot_password') {
      return <ForgotPassword onBackToLogin={() => setAuthMode('login')} />;
    } else if (authMode === 'email_verification') {
      return <EmailVerification onVerified={() => setAuthMode('onboarding')} />;
    } else if (authMode === 'onboarding') {
      return <OnboardingWizard onComplete={() => setToken(localStorage.getItem('merchant_token'))} />;
    } else if (authMode === 'public_tracking') {
      return <PublicTracking />;
    }
  }

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
      {portalType === 'direct' ? (
        <DirectLayout
          activeTab={directActiveTab}
          setActiveTab={setDirectActiveTab}
          onLogout={() => setPortalType(null)}
        >
          {directActiveTab === 'overview' && <DirectOverview />}
          {directActiveTab === 'deliveries' && <DirectDeliveries />}
          {directActiveTab === 'create-delivery' && <DirectCreateDelivery />}
          {directActiveTab === 'tracking' && <DirectTracking />}
          {directActiveTab === 'billing' && <DirectBilling />}
          {directActiveTab === 'developer' && <DirectDeveloper />}
          {directActiveTab !== 'overview' && directActiveTab !== 'deliveries' &&
            directActiveTab !== 'create-delivery' && directActiveTab !== 'tracking' &&
            directActiveTab !== 'billing' && (
              <div className="flex items-center justify-center h-full text-gray-400">
                Content for {directActiveTab} is coming soon...
              </div>
            )}
        </DirectLayout>
      ) : (
        <MartLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          merchant={merchant}
        >
          {activeTab === 'dashboard' && <Dashboard token={token} merchant={merchant} />}
          {activeTab === 'orders' && <Orders token={token} merchant={merchant} />}
          {activeTab === 'inventory' && <Inventory token={token} merchant={merchant} onAddProduct={() => setActiveTab('addProduct')} />}
          {activeTab === 'performance' && <Performance token={token} merchant={merchant} />}
          {activeTab === 'addProduct' && <AddProduct token={token} merchant={merchant} onBack={() => setActiveTab('inventory')} />}
          {activeTab === 'financials' && <Financials token={token} merchant={merchant} />}
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
        </MartLayout>
      )}
    </ConfigProvider>
  )
}

export default App
