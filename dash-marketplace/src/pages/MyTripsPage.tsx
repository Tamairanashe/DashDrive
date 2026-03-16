import React from 'react';
import { Row, Col, Card, Typography, Space, Avatar, Button, Tabs, Tag } from 'antd';
import { 
  CheckCircleFilled, 
  MessageOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface TrackingProps {
  onBackHome: () => void;
}

const Tracking: React.FC<TrackingProps> = ({ onBackHome }) => {
  const upcomingTrips = [
    {
      id: 'T-1024',
      name: 'Zambezi Sunset Villa',
      location: 'Victoria Falls',
      dates: 'Oct 15 – 20, 2026',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      status: 'confirmed',
      host: 'Sarah'
    }
  ];

  const pastTrips = [
    {
      id: 'T-0982',
      name: 'Emerald Lake Cabin',
      location: 'Nyanga',
      dates: 'Aug 12 – 15, 2025',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
      status: 'completed',
      host: 'John'
    }
  ];

  const TripCard = ({ trip }: { trip: any }) => (
    <Card 
      className="glass-effect hover-lift" 
      bordered={false} 
      style={{ borderRadius: 24, marginBottom: 24, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
    >
      <Row>
        <Col xs={24} sm={8}>
          <img 
            src={trip.image} 
            alt={trip.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180 }} 
          />
        </Col>
        <Col xs={24} sm={16} style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase' }}>{trip.location}</Text>
              <Title level={3} style={{ color: '#fff', margin: '4px 0' }}>{trip.name}</Title>
              <Space size={8} style={{ marginTop: 8 }}>
                <CalendarOutlined style={{ color: '#ffcc00' }} />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{trip.dates}</Text>
              </Space>
            </div>
            <Tag color={trip.status === 'confirmed' ? 'success' : 'default'} style={{ borderRadius: 12 }}>
              {trip.status.toUpperCase()}
            </Tag>
          </div>
          
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={16}>
              <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trip.host}`} />
              <Text style={{ color: '#fff' }}>Hosted by {trip.host}</Text>
            </Space>
            <Space>
              <Button icon={<MessageOutlined />} ghost shape="circle" />
              <Button type="primary" style={{ borderRadius: 12, fontWeight: 700 }}>View Details</Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="container tracking-view" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={1} style={{ margin: 0, color: '#fff' }}>Trips</Title>
        <Button onClick={onBackHome} icon={<RightOutlined rotate={180} />} ghost style={{ borderRadius: 12 }}>
          Back to Explore
        </Button>
      </div>

      <Tabs defaultActiveKey="1" className="property-tabs">
        <TabPane tab="Upcoming" key="1">
          <div style={{ marginTop: 24 }}>
            {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </TabPane>
        <TabPane tab="Past" key="2">
          <div style={{ marginTop: 24 }}>
            {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Tracking;
