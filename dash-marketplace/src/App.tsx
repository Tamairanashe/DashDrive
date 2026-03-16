import { useState } from 'react';
import { 
  ConfigProvider, 
  Layout, 
} from 'antd';
import './App.css';
import { dashTheme } from './theme/dashTheme';
import Header from './components/layout/Header';
import Marketplace from './pages/Marketplace';
import Restaurant from './pages/Restaurant';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';

const { Content } = Layout;

function App() {
  const [currentView, setCurrentView] = useState<'MARKETPLACE' | 'RESTAURANT' | 'CHECKOUT' | 'TRACKING'>('MARKETPLACE');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 84;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setCurrentView('TRACKING');
    }, 2000);
  };

  return (
    <ConfigProvider theme={dashTheme}>
      <Layout className="yandex-layout">
        <Header 
          cartCount={cartCount} 
          onLogoClick={() => {
            setSelectedStore(null);
            setCurrentView('MARKETPLACE');
          }}
          onCartClick={() => { if (cartCount > 0) setCurrentView('CHECKOUT'); }}
        />

        <Content className="yandex-content">
          {currentView === 'MARKETPLACE' && (
            <Marketplace 
              onStoreSelect={(store) => {
                setSelectedStore(store);
                setCurrentView('RESTAURANT');
              }}
              scrollToSection={scrollToSection}
            />
          )}
          {currentView === 'RESTAURANT' && (
            <Restaurant 
              selectedStore={selectedStore}
              cartCount={cartCount}
              onBack={() => setCurrentView('MARKETPLACE')}
              onAddToCart={() => setCartCount(c => c + 1)}
              onCheckout={() => setCurrentView('CHECKOUT')}
            />
          )}
          {currentView === 'CHECKOUT' && (
            <Checkout 
              selectedStore={selectedStore}
              cartCount={cartCount}
              onBack={() => setCurrentView('RESTAURANT')}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          )}
          {currentView === 'TRACKING' && (
            <Tracking onBackHome={() => {
              setCartCount(0);
              setSelectedStore(null);
              setCurrentView('MARKETPLACE');
            }} />
          )}
        </Content>

        <footer className="yandex-footer">
          <div className="container" style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid #262626' }}>
            <span style={{ color: '#888' }}>© 2026 DashDrive. All rights reserved.</span>
          </div>
        </footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
