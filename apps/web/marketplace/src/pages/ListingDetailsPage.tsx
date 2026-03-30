import React, { useState } from 'react';
import { Row, Col, Typography, Button, Space, Divider, Avatar } from 'antd';
import { 
  StarFilled, 
  LeftOutlined, 
  ShareAltOutlined, 
  HeartOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  CloudOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import MainFooter from '../components/layout/MainFooter';

const { Title, Text, Paragraph } = Typography;

interface ListingDetailsProps {
  property: any;
  onBack: () => void;
  onReserve: () => void;
}

const ListingDetailsPage: React.FC<ListingDetailsProps> = ({ 
  property, 
  onBack, 
  onReserve 
}) => {
  const [selectedDates] = useState({ checkIn: 'Add date', checkOut: 'Add date' });

  if (!property) return null;

  const amenities = [
    { icon: <WifiOutlined />, label: 'Fast wifi – 50 Mbps' },
    { icon: <CarOutlined />, label: 'Free parking on premises' },
    { icon: <CoffeeOutlined />, label: 'Kitchen' },
    { icon: <CloudOutlined />, label: 'Air conditioning' },
    { icon: <SafetyCertificateOutlined />, label: 'Smoke alarm' },
  ];

  return (
    <div className="marketplace-layout">
      <div className="details-container">
        {/* Header Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Button type="text" icon={<LeftOutlined />} onClick={onBack} style={{ fontWeight: 600 }}>
            Back
          </Button>
          <Space size="middle">
            <Button type="text" icon={<ShareAltOutlined />} style={{ fontWeight: 600, textDecoration: 'underline' }}>Share</Button>
            <Button type="text" icon={<HeartOutlined />} style={{ fontWeight: 600, textDecoration: 'underline' }}>Save</Button>
          </Space>
        </div>

        {/* Title and Rating Summary */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>{property.name}</Title>
          <Space size={12} style={{ marginTop: 8 }}>
            <Space size={4}>
              <StarFilled style={{ fontSize: 12 }} />
              <Text strong>{property.rating}</Text>
            </Space>
            <Text underline style={{ fontWeight: 600, cursor: 'pointer' }}>128 reviews</Text>
            <Text>•</Text>
            <Text underline style={{ fontWeight: 600, cursor: 'pointer' }}>{property.time}</Text>
          </Space>
        </div>

        {/* Gallery Grid */}
        <div className="premium-gallery">
          <img src={property.image} className="gallery-img" style={{ gridRow: 'span 2' }} alt="Main" />
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" className="gallery-img" alt="View 1" />
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=400" className="gallery-img" alt="View 2" />
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" className="gallery-img" alt="View 3" />
          <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400" className="gallery-img" alt="View 4" />
        </div>

        {/* Main Content Layout */}
        <Row gutter={80}>
          <Col xs={24} lg={15}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={3} style={{ fontWeight: 600, marginBottom: 4 }}>Entire villa hosted by Sarah</Title>
                <Text style={{ fontSize: 16 }}>8 guests · 4 bedrooms · 4 beds · 3.5 baths</Text>
              </div>
              <Avatar size={56} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
            </div>

            <Divider style={{ margin: '32px 0' }} />

            <div style={{ marginBottom: 32 }}>
              <Space direction="vertical" size={24}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <StarFilled style={{ fontSize: 24, marginTop: 4, color: '#222' }} />
                  <div>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>Sarah is a Superhost</Text>
                    <Text type="secondary">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <SafetyCertificateOutlined style={{ fontSize: 24, marginTop: 4, color: '#222' }} />
                  <div>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>Great check-in experience</Text>
                    <Text type="secondary">95% of recent guests gave the check-in process a 5-star rating.</Text>
                  </div>
                </div>
              </Space>
            </div>

            <Divider style={{ margin: '32px 0' }} />

            <div style={{ marginBottom: 32 }}>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.6 }}>
                Relax with the whole family at this peaceful place to stay. This {property.name} is nestled in the heart of {property.time}, 
                offering breathtaking views and modern amenities. Whether you're here for a weekend getaway or an extended stay, 
                our villa provides the perfect blend of comfort and luxury.
              </Paragraph>
              <Button type="link" style={{ padding: 0, fontWeight: 600, color: '#222', textDecoration: 'underline' }}>Show more</Button>
            </div>

            <Divider style={{ margin: '32px 0' }} />

            <div style={{ marginBottom: 40 }}>
              <Title level={4} style={{ fontWeight: 600 }}>What this place offers</Title>
              <div className="amenity-grid">
                {amenities.map((item, idx) => (
                  <div key={idx} className="amenity-item" style={{ color: '#222' }}>
                    {item.icon}
                    <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  </div>
                ))}
              </div>
              <Button size="large" style={{ marginTop: 32, borderRadius: 8, height: 48, fontWeight: 600, border: '1px solid #222' }}>
                Show all 45 amenities
              </Button>
            </div>
          </Col>

          {/* Booking Widget Sidebar */}
          <Col xs={24} lg={9}>
            <div className="booking-widget-v2">
              <div style={{ marginBottom: 24 }}>
                <Space align="baseline">
                  <span style={{ fontSize: 22, fontWeight: 700 }}>${property.price}</span>
                  <Text style={{ fontSize: 16 }}>night</Text>
                </Space>
              </div>

              <div style={{ border: '1px solid #b0b0b0', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #b0b0b0' }}>
                  <div style={{ flex: 1, padding: '10px 12px', borderRight: '1px solid #b0b0b0' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Check-in</div>
                    <div style={{ fontSize: 14 }}>{selectedDates.checkIn}</div>
                  </div>
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Check-out</div>
                    <div style={{ fontSize: 14 }}>{selectedDates.checkOut}</div>
                  </div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Guests</div>
                  <div style={{ fontSize: 14 }}>1 guest</div>
                </div>
              </div>

              <Button type="primary" block size="large" style={{ height: 48, borderRadius: 8, fontWeight: 600, background: '#ff385c', border: 'none' }} onClick={onReserve}>
                Reserve
              </Button>

              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 14 }}>You won't be charged yet</Text>
              </div>

              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text underline style={{ fontSize: 16 }}>${property.price} x 5 nights</Text>
                  <Text style={{ fontSize: 16 }}>${property.price * 5}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text underline style={{ fontSize: 16 }}>Cleaning fee</Text>
                  <Text style={{ fontSize: 16 }}>$50</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Text underline style={{ fontSize: 16 }}>DashDrive service fee</Text>
                  <Text style={{ fontSize: 16 }}>$112</Text>
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 18 }}>Total before taxes</Text>
                  <Text strong style={{ fontSize: 18 }}>${property.price * 5 + 50 + 112}</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <MainFooter />
    </div>
  );
};

export default ListingDetailsPage;
