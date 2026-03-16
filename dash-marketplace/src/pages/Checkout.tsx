import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Divider } from 'antd';
import { EnvironmentFilled, RightOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CheckoutProps {
  selectedStore: any;
  cartCount: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({
  selectedStore,
  cartCount,
  onBack,
  onPlaceOrder,
  isPlacingOrder
}) => {
  return (
    <div className="container checkout-view">
      <div className="checkout-header">
        <Button 
          type="link" 
          icon={<RightOutlined rotate={180} />} 
          onClick={onBack} 
          style={{ color: '#888', padding: 0 }}
        >
          Back to menu
        </Button>
        <Title level={1}>Checkout</Title>
      </div>

      <Row gutter={40}>
        <Col xs={24} lg={15}>
          <Card className="checkout-main-card glass-effect hover-lift" title="Delivery Address" bordered={false}>
            <div className="address-section">
              <Space size={16} align="start">
                <EnvironmentFilled style={{ color: '#ffcc00', fontSize: 24, marginTop: 4 }} />
                <div>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>24 Amiryan Street</Text>
                  <Text type="secondary">Yerevan, Armenia • Apartment 4B</Text>
                </div>
                <Button type="link">Edit</Button>
              </Space>
            </div>
          </Card>

          <Card className="checkout-main-card glass-effect hover-lift" title="Payment Method" bordered={false} style={{ marginTop: 24 }}>
            <div className="payment-section">
              <Space size={16} align="start">
                <CreditCardOutlined style={{ color: '#ffcc00', fontSize: 24, marginTop: 4 }} />
                <div>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>•••• 4242</Text>
                  <Text type="secondary">Visa • Expires 12/28</Text>
                </div>
                <Button type="link">Change</Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card className="order-summary-card glass-effect shadow-2xl" bordered={false}>
            <Title level={4}>Order Summary</Title>
            <div className="restaurant-mini-info">
              <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>Ordering from</Text>
              <Text strong style={{ display: 'block', fontSize: 18 }}>{selectedStore?.name || 'Restaurant'}</Text>
            </div>
            <Divider />
            <div className="summary-items">
              <div className="summary-row">
                <Text>{cartCount}x Selected Items</Text>
                <Text strong>8,700 ֏</Text>
              </div>
              <div className="summary-row">
                <Text>Delivery Fee</Text>
                <Text strong style={{ color: '#ffcc00' }}>Free</Text>
              </div>
              <div className="summary-row">
                <Text>Service Fee</Text>
                <Text strong>250 ֏</Text>
              </div>
            </div>
            <Divider />
            <div className="summary-total">
              <Title level={3} style={{ margin: 0 }}>Total</Title>
              <Title level={3} style={{ margin: 0, color: '#ffcc00' }}>8,950 ֏</Title> 
            </div>
            <Button 
              type="primary" 
              block 
              size="large" 
              className="place-order-btn shadow-lg"
              onClick={onPlaceOrder}
              loading={isPlacingOrder}
            >
              {isPlacingOrder ? 'Confirming...' : 'Place Order'}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
