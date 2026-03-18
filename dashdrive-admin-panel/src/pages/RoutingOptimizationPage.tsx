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
// Using react-leaflet for map
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export const RoutingOptimizationPage: React.FC = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [simulatedData, setSimulatedData] = useState<any>(null);

  useEffect(() => {
    // Generate initial unstructured route
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
      distance: 14.5, // Mock unoptimized distance
      optimized: false
    });
  };

  const handleOptimization = () => {
    setOptimizing(true);
    message.loading({ content: 'Running TSP Solver...', key: 'opt' });
    
    setTimeout(() => {
      // Simulate Nearest Neighbor result
      setSimulatedData({
        ...simulatedData,
        stops: [
          { id: 3, lat: -15.3900, lng: 28.2800, name: 'Pickup A', type: 'PICKUP' },
          { id: 2, lat: -15.4050, lng: 28.3100, name: 'Pickup B', type: 'PICKUP' },
          { id: 1, lat: -15.4300, lng: 28.3200, name: 'Dropoff C', type: 'DROPOFF' },
        ],
        distance: 8.2, // Mock optimized distance
        optimized: true
      });
      message.success({ content: 'Sequence Optimized!', key: 'opt', duration: 2 });
      setOptimizing(false);
    }, 1500);
  };

  const currentPolyline = simulatedData ? [
    [simulatedData.rider.lat, simulatedData.rider.lng],
    ...simulatedData.stops.map((s: any) => [s.lat, s.lng])
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
          <Card bordered={false} bodyStyle={{ padding: 0, height: '500px', overflow: 'hidden', borderRadius: '8px' }}>
             {simulatedData && (
                <MapContainer center={[-15.4100, 28.3000]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  
                  <Marker position={[simulatedData.rider.lat, simulatedData.rider.lng]} icon={riderIcon}>
                     <Popup>Rider: {simulatedData.rider.name}</Popup>
                  </Marker>
                  
                  {simulatedData.stops.map((stop: any, idx: number) => (
                      <Marker key={stop.id} position={[stop.lat, stop.lng]}>
                          <Popup>Stop {idx + 1}: {stop.name}</Popup>
                      </Marker>
                  ))}

                  <Polyline 
                      positions={currentPolyline as any} 
                      color={simulatedData.optimized ? "#10b981" : "#ef4444"} 
                      weight={4}
                      dashArray={simulatedData.optimized ? "" : "5, 10"}
                  />
                </MapContainer>
             )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
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
                       { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t === 'PICKUP' ? 'orange' : 'blue'}>{t}</Tag> }
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
