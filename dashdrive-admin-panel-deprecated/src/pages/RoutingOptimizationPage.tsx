import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Statistic, 
  Space,
  message,
  Table,
  Tag
} from 'antd';
import { 
  NodeIndexOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined 
} from '@ant-design/icons';
import { MarkerF, PolylineF, InfoWindowF } from '@react-google-maps/api';
import { BaseMap } from '../components/BaseMap';

const { Title, Text } = Typography;

export const RoutingOptimizationPage: React.FC = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [simulatedData, setSimulatedData] = useState<any>(null);

  useEffect(() => {
    generateInitialRoute();
  }, []);

  const generateInitialRoute = () => {
    setSimulatedData({
      rider: { lat: -15.4120, lng: 28.2910, name: 'John Doe' },
      stops: [
        { id: 1, lat: -15.4300, lng: 28.3200, name: 'Dropoff C', type: 'DROPOFF' },
        { id: 2, lat: -15.4050, lng: 28.3100, name: 'Pickup B', type: 'PICKUP' },
        { id: 3, lat: -15.3900, lng: 28.2800, name: 'Pickup A', type: 'PICKUP' },
      ],
      distance: 14.5,
      optimized: false
    });
  };

  const handleOptimization = () => {
    setOptimizing(true);
    message.loading({ content: 'Running TSP Solver...', key: 'opt' });
    
    setTimeout(() => {
      setSimulatedData({
        ...simulatedData,
        stops: [
          { id: 3, lat: -15.3900, lng: 28.2800, name: 'Pickup A', type: 'PICKUP' },
          { id: 2, lat: -15.4050, lng: 28.3100, name: 'Pickup B', type: 'PICKUP' },
          { id: 1, lat: -15.4300, lng: 28.3200, name: 'Dropoff C', type: 'DROPOFF' },
        ],
        distance: 8.2,
        optimized: true
      });
      message.success({ content: 'Sequence Optimized!', key: 'opt', duration: 2 });
      setOptimizing(false);
    }, 1500);
  };

  const currentPath = simulatedData ? [
    { lat: simulatedData.rider.lat, lng: simulatedData.rider.lng },
    ...simulatedData.stops.map((s: any) => ({ lat: s.lat, lng: s.lng }))
  ] : [];

  const savings = simulatedData && simulatedData.optimized ? (14.5 - simulatedData.distance).toFixed(1) : 0;

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Route Optimization Engine</Title>
          <Text type="secondary">Monitor the performance of the Nearest Neighbor TSP solver.</Text>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card bordered={false} styles={{ body: { padding: 0, height: '500px', overflow: 'hidden', borderRadius: '8px' } }}>
             {simulatedData && (
                <BaseMap center={{ lat: -15.4100, lng: 28.3000 }} zoom={13} height={500}>
                  <MarkerF 
                    position={{ lat: simulatedData.rider.lat, lng: simulatedData.rider.lng }} 
                    icon={{
                        url: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
                        scaledSize: new google.maps.Size(32, 32)
                    }}
                  />
                  
                  {simulatedData.stops.map((stop: any, idx: number) => (
                      <MarkerF key={stop.id} position={{ lat: stop.lat, lng: stop.lng }} />
                  ))}

                  <PolylineF 
                      path={currentPath} 
                      options={{
                          strokeColor: simulatedData.optimized ? "#10b981" : "#ef4444", 
                          strokeWeight: 4,
                          strokeOpacity: 0.8,
                          icons: simulatedData.optimized ? [] : [{
                              icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 },
                              offset: '0',
                              repeat: '20px'
                          }]
                      }} 
                  />
                </BaseMap>
             )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            
            <Card bordered={false} className="shadow-sm">
                <Statistic 
                    title="Simulated Rider Distance" 
                    value={simulatedData?.distance} 
                    suffix="km" 
                    valueStyle={{ color: simulatedData?.optimized ? '#10b981' : '#0f172a' }}
                />
                {simulatedData?.optimized && (
                    <Text type="success" strong><ThunderboltOutlined /> Saved {savings} km</Text>
                )}
            </Card>

            <Card bordered={false} title="Active Sequence" extra={
              <Button 
                type="primary" 
                icon={<NodeIndexOutlined />} 
                loading={optimizing}
                onClick={handleOptimization}
                disabled={simulatedData?.optimized}
              >
                Run Solver
              </Button>
            } className="shadow-sm">
               <Table 
                   dataSource={simulatedData?.stops || []} 
                   rowKey="id"
                   pagination={false}
                   size="small"
                   columns={[
                       { title: '#', key: 'seq', render: (_text, _rec, idx) => <b>{idx + 1}</b> },
                       { title: 'Waypoint', dataIndex: 'name', key: 'name' },
                       { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'PICKUP' ? 'orange' : 'blue'}>{t}</Tag> }
                   ]}
               />
               
               {simulatedData?.optimized && (
                 <div style={{ marginTop: 16 }}>
                    <Button block onClick={generateInitialRoute}>Reset Simulation</Button>
                  </div>
               )}
            </Card>

          </Space>
        </Col>
      </Row>
    </div>
  );
};

