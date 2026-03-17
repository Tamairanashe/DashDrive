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
import api from './api/client';
import { message } from 'antd';

const { Content } = Layout;

type ViewType = 'EXPLORE' | 'LISTING_DETAILS' | 'BOOKING_CONFIRMATION' | 'MY_TRIPS';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('EXPLORE');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


  const handlePlaceOrder = async () => {
    if (!selectedProperty) return;
    
    setIsPlacingOrder(true);
    try {
      // 1. Create Booking
      const response = await api.post('/marketplace/bookings', {
        listing_id: selectedProperty.id,
        guest_id: 'default-user-id', // TODO: Get from Auth
        check_in: new Date().toISOString(),
        check_out: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // 2. Process Payment
      await api.post(`/marketplace/bookings/${response.data.id}/confirm`, {
        userId: 'default-user-id',
        paymentMethod: 'wallet',
      });

      message.success('Booking confirmed successfully!');
      setCurrentView('MY_TRIPS');
    } catch (error) {
      console.error("Booking error:", error);
      message.error('Failed to confirm booking. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
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
