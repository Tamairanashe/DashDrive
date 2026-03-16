import React from 'react';
import { Row, Col, Card, Typography, Space, Avatar, Button } from 'antd';
import { CheckCircleFilled, LoadingOutlined, BellOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TrackingProps {
  onBackHome: () => void;
}

const Tracking: React.FC<TrackingProps> = ({ onBackHome }) => {
  return (
    <div className="container tracking-view">
      <Row gutter={40}>
        <Col xs={24} lg={10}>
          <div className="tracking-status">
            <Title level={1}>Order is on its way</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>Estimated arrival: 18:45</Text>
            
            <div className="status-stepper">
              <div className="step-item completed">
                <div className="step-icon"><CheckCircleFilled /></div>
                <div className="step-label">
                  <Text strong>Order confirmed</Text>
                  <Text type="secondary" style={{ display: 'block' }}>18:10</Text>
                </div>
              </div>
              <div className="step-item active">
                <div className="step-icon"><LoadingOutlined color="#ffcc00" /></div>
                <div className="step-label">
                  <Text strong>Courier is picking up</Text>
                  <Text type="secondary" style={{ display: 'block' }}>Expected 18:25</Text>
                </div>
              </div>
              <div className="step-item pending">
                <div className="step-icon"></div>
                <div className="step-label">
                  <Text strong>Delivering to you</Text>
                  <Text type="secondary" style={{ display: 'block' }}>Expected 18:45</Text>
                </div>
              </div>
            </div>

            <Card className="courier-card glass-effect hover-lift" bordered={false}>
              <Space size={16}>
                <Avatar size={64} src="https://i.pravatar.cc/150?u=courier" />
                <div>
                  <Text strong style={{ fontSize: 18, display: 'block' }}>David</Text>
                  <Text type="secondary">Your Courier • ⭐ 5.0</Text>
                </div>
                <Button shape="circle" icon={<BellOutlined />} style={{ marginLeft: 'auto' }} />
              </Space>
            </Card>
            
            <Button 
              block 
              size="large" 
              className="back-home-btn"
              onClick={onBackHome}
            >
              Back to Home
            </Button>
          </div>
        </Col>
        
        <Col xs={24} lg={14}>
          <div className="mock-map-container shadow-2xl">
            <div className="map-overlay">
              <div className="courier-marker">🛵</div>
              <div className="home-marker">🏠</div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
              alt="Map" 
              className="map-image"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Tracking;
