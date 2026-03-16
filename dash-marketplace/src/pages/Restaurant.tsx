import { Row, Col, Card, Typography, Button, Space, Divider } from 'antd';
import { StarFilled, RightOutlined } from '@ant-design/icons';
import { menuCategories, menuItems } from '../constants';

const { Title, Text } = Typography;

interface RestaurantProps {
  selectedStore: any;
  cartCount: number;
  onBack: () => void;
  onAddToCart: () => void;
  onCheckout: () => void;
}

const Restaurant: React.FC<RestaurantProps> = ({ 
  selectedStore, 
  cartCount, 
  onBack, 
  onAddToCart, 
  onCheckout 
}) => {
  if (!selectedStore) return null;

  return (
    <div className="restaurant-view">
      <div className="restaurant-hero" style={{ background: selectedStore.bg }}>
        <div className="container hero-inner">
          <Button 
            className="back-btn glass-effect" 
            icon={<RightOutlined rotate={180} />} 
            onClick={onBack}
          >
            Back to shops
          </Button>
          <div className="hero-content">
            <div className="hero-logo shadow-lg" style={{ background: '#fff', color: selectedStore.textColor }}>
              {selectedStore.logo}
            </div>
            <div className="hero-text">
              <Title level={1}>{selectedStore.name}</Title>
              <Space size={16}>
                <Space size={4}>
                  <StarFilled style={{ color: '#ffcc00' }} />
                  <Text strong>{selectedStore.rating}</Text>
                  <Text type="secondary">(500+)</Text>
                </Space>
                <Text type="secondary">Delivery {selectedStore.time}</Text>
              </Space>
            </div>
          </div>
        </div>
      </div>

      <div className="container restaurant-body">
        <Row gutter={40}>
          <Col xs={0} lg={5}>
            <div className="sticky-nav">
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                {menuCategories.map((cat, idx) => (
                  <Button 
                    key={cat} 
                    type="text" 
                    className={`nav-item ${idx === 1 ? 'active' : ''}`}
                    block
                  >
                    {cat}
                  </Button>
                ))}
              </Space>
            </div>
          </Col>

          <Col xs={24} lg={13}>
            <Title level={2} style={{ marginBottom: 32 }}>Popular</Title>
            <Row gutter={[20, 24]}>
              {menuItems.map(item => (
                <Col key={item.id} span={24}>
                  <Card className="food-card premium-card hover-lift" bordered={false}>
                    <div className="food-card-body">
                      <div className="food-info">
                        <Title level={4} className="food-name">{item.name}</Title>
                        <Text type="secondary" className="food-desc">{item.description}</Text>
                        <div className="food-footer">
                          <Text strong className="food-price">{item.price} ֏</Text>
                          <Button 
                            shape="round" 
                            type="primary"
                            className="add-to-cart-btn"
                            onClick={onAddToCart}
                          >
                            + Add
                          </Button>
                        </div>
                      </div>
                      <div className="food-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col xs={0} lg={6}>
            <div className="sticky-cart">
              <Card className="cart-card glass-effect shadow-xl" bordered={false}>
                <Title level={4}>Your Cart</Title>
                <div className="cart-empty">
                  {cartCount === 0 ? (
                    <>
                      <div className="cart-icon-bg">🥘</div>
                      <Text type="secondary">Select items to start an order</Text>
                    </>
                  ) : (
                    <div className="cart-items">
                      <Text strong>{cartCount} items selected</Text>
                      <Divider />
                      <div className="cart-total">
                        <Text type="secondary">Subtotal</Text>
                        <Text strong>8,700 ֏</Text>
                      </div>
                      <Button 
                        type="primary" 
                        block 
                        size="large" 
                        className="checkout-btn shadow-md"
                        onClick={onCheckout}
                      >
                        Go to Checkout
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Restaurant;
