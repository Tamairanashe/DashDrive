import { useState } from 'react';
import { 
  ConfigProvider, 
  Layout, 
} from 'antd';
import './App.css';
import { dashTheme } from './theme/dashTheme';
import Header from './components/layout/Header';
import Marketplace from './pages/Marketplace';
import ListingDetailsPage from './pages/ListingDetailsPage';
import Checkout from './pages/Checkout';
import MyTripsPage from './pages/MyTripsPage';

const { Content } = Layout;

type ViewType = 'EXPLORE' | 'LISTING_DETAILS' | 'BOOKING_CONFIRMATION' | 'MY_TRIPS';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('EXPLORE');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      setCurrentView('MY_TRIPS');
    }, 2000);
  };

  return (
    <ConfigProvider theme={dashTheme}>
      <Layout className="marketplace-layout">
        <Header 
          cartCount={cartCount} 
          onLogoClick={() => {
            setSelectedProperty(null);
            setCurrentView('EXPLORE');
          }}
          onCartClick={() => { if (cartCount > 0) setCurrentView('BOOKING_CONFIRMATION'); }}
        />

        <Content>
          {currentView === 'EXPLORE' && (
            <Marketplace 
              onStoreSelect={(property) => {
                setSelectedProperty(property);
                setCurrentView('LISTING_DETAILS');
                window.scrollTo(0, 0);
              }}
            />
          )}
          {currentView === 'LISTING_DETAILS' && (
            <ListingDetailsPage 
              property={selectedProperty}
              onBack={() => setCurrentView('EXPLORE')}
              onReserve={() => {
                setCartCount(1);
                setCurrentView('BOOKING_CONFIRMATION');
                window.scrollTo(0, 0);
              }}
            />
          )}
          {currentView === 'BOOKING_CONFIRMATION' && (
            <Checkout 
              selectedStore={selectedProperty}
              cartCount={cartCount}
              onBack={() => setCurrentView('LISTING_DETAILS')}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          )}
          {currentView === 'MY_TRIPS' && (
            <MyTripsPage onBackHome={() => {
              setCartCount(0);
              setSelectedProperty(null);
              setCurrentView('EXPLORE');
            }} />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
