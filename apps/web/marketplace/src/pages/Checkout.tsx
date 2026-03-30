import React from 'react';
import { Row, Col, Typography, Button, Space, Divider, Tag, Card } from 'antd';
import { 
  LeftOutlined, 
  CreditCardOutlined, 
  StarFilled
} from '@ant-design/icons';
import MainFooter from '../components/layout/MainFooter';

const { Title, Text, Paragraph } = Typography;

interface CheckoutProps {
  selectedStore: any;
  cartCount: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({
  selectedStore: property,
  onBack,
  onPlaceOrder,
  isPlacingOrder
}) => {
  if (!property) return null;

  return (
    <div className="marketplace-layout">
      <div className="details-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 24 }}>
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={onBack} 
            style={{ fontSize: 20 }}
          />
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>Confirm and pay</Title>
        </div>

        <Row gutter={100}>
          {/* Left Side: Review Details */}
          <Col xs={24} lg={14}>
            <section style={{ marginBottom: 48 }}>
              <Title level={3} style={{ fontWeight: 600 }}>Your trip</Title>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <div>
                  <Text strong style={{ display: 'block', fontSize: 16 }}>Dates</Text>
                  <Text style={{ fontSize: 16 }}>Oct 15 – 20, 2026</Text>
                </div>
                <Button type="link" style={{ fontWeight: 600, color: '#222', textDecoration: 'underline' }}>Edit</Button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <div>
                  <Text strong style={{ display: 'block', fontSize: 16 }}>Guests</Text>
                  <Text style={{ fontSize: 16 }}>2 guests</Text>
                </div>
                <Button type="link" style={{ fontWeight: 600, color: '#222', textDecoration: 'underline' }}>Edit</Button>
              </div>
            </section>

            <Divider style={{ margin: '48px 0' }} />

            <section style={{ margin: '48px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 600 }}>Pay with</Title>
                <Space size={8}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="12" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" alt="Mastercard" />
                </Space>
              </div>
              
              <Card style={{ borderRadius: 12, border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size={16}>
                    <CreditCardOutlined style={{ fontSize: 24, color: '#222' }} />
                    <div>
                      <Text strong style={{ fontSize: 16 }}>Dash Wallet</Text>
                      <Text type="secondary" style={{ display: 'block' }}>Balance: $1,240.00</Text>
                    </div>
                  </Space>
                  <Tag color="success">SELECTED</Tag>
                </div>
              </Card>
            </section>

            <Divider style={{ margin: '48px 0' }} />

            <section style={{ margin: '48px 0' }}>
              <Title level={3} style={{ fontWeight: 600 }}>Ground rules</Title>
              <Paragraph style={{ fontSize: 16, color: '#222', marginTop: 16 }}>
                We ask every guest to remember a few simple things about what makes a great guest.
              </Paragraph>
              <ul style={{ color: '#222', paddingLeft: 20, lineHeight: '2', fontSize: 16 }}>
                <li>Follow the house rules</li>
                <li>Treat your Host's home like your own</li>
              </ul>
            </section>

            <Divider style={{ margin: '48px 0' }} />

            <div style={{ marginTop: 24 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, DashDrive's Rebooking and Refund Policy, and that DashDrive can charge my payment method if I’m responsible for damage.
              </Text>
            </div>

            <Button 
              type="primary" 
              size="large" 
              block 
              style={{ marginTop: 32, height: 56, borderRadius: 8, background: '#ff385c', border: 'none', fontWeight: 600, fontSize: 18 }}
              loading={isPlacingOrder}
              onClick={onPlaceOrder}
            >
              Confirm and pay
            </Button>
          </Col>

          {/* Right Side: Price Summary Card */}
          <Col xs={24} lg={10}>
            <Card 
              style={{ borderRadius: 12, padding: '16px 8px', position: 'sticky', top: 120, border: '1px solid #ddd', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}
            >
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <img 
                  src={property.image} 
                  alt={property.name} 
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{property.name}</Title>
                  <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>{property.time}</Text>
                  <Space size={4}>
                    <StarFilled style={{ fontSize: 10 }} />
                    <Text strong style={{ fontSize: 12 }}>{property.rating}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>(128 reviews)</Text>
                  </Space>
                </div>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              <div>
                <Title level={4} style={{ fontWeight: 600, marginBottom: 24 }}>Price details</Title>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 16 }}>${property.price} x 5 nights</Text>
                  <Text style={{ fontSize: 16 }}>${property.price * 5}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 16 }}>Cleaning fee</Text>
                  <Text style={{ fontSize: 16 }}>$50</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Text style={{ fontSize: 16 }}>DashDrive service fee</Text>
                  <Text style={{ fontSize: 16 }}>$112</Text>
                </div>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 18 }}>Total (USD)</Text>
                  <Text strong style={{ fontSize: 18 }}>${property.price * 5 + 50 + 112}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <MainFooter />
    </div>
  );
};

export default Checkout;
