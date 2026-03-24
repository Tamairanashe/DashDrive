import React from 'react';
import { Card, Typography, Row, Col, Space, Badge, Statistic, Tag } from 'antd';
const { Title, Text } = Typography;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSocket } from '../../context/SocketContext';

const mockData = [
  { name: '08:00', rides: 45, cancels: 2 },
  { name: '10:00', rides: 52, cancels: 5 },
  { name: '12:00', rides: 88, cancels: 8 },
  { name: '14:00', rides: 70, cancels: 4 },
  { name: '16:00', rides: 110, cancels: 12 },
  { name: '18:00', rides: 140, cancels: 15 },
];

export const OperationsDashboard = () => {
  const { isConnected, socket } = useSocket();
  const [data, setData] = React.useState(mockData);
  const [kpis, setKpis] = React.useState({
    activeRides: 242,
    matchingTime: 1.4,
    cancelRate: 4.2
  });
  const [demandData, setDemandData] = React.useState([
    { location: 'Borrowdale', demand: 120 },
    { location: 'Avondale', demand: 95 },
    { location: 'CBD', demand: 210 },
    { location: 'Hatfield', demand: 60 },
  ]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on('platform_event', (eventData: any) => {
      const { event, payload } = eventData;

      if (event === 'RIDE_STARTED' || event === 'RIDE_COMPLETED') {
        const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setData(prev => {
          const newData = [...prev.slice(1), { name: timeLabel, rides: payload.currentActive || 0, cancels: prev[prev.length-1].cancels }];
          return newData;
        });
        setKpis(prev => ({ ...prev, activeRides: payload.currentActive || prev.activeRides }));
      } else if (event === 'MARKET_DEMAND_SHIFT') {
        setDemandData(prev => prev.map(d => 
          d.location === payload.zoneName ? { ...d, demand: d.demand + (payload.increase || 0) } : d
        ));
      }
    });

    return () => {
      socket.off('platform_event');
    };
  }, [socket]);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Title level={2}>Operations Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#f0fdf4' }}>
            <Statistic 
              title={<Text strong style={{ color: '#15803d' }}>Active Rides</Text>}
              value={kpis.activeRides}
              valueStyle={{ fontWeight: 800 }}
              suffix={isConnected && <Badge status="processing" color="green" className="animate-pulse" />}
            />
            <Text type="success" style={{ fontSize: 12 }}>+12.5% from last hour</Text>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#eff6ff' }}>
            <Statistic 
              title={<Text strong style={{ color: '#1d4ed8' }}>Avg. Matching Time</Text>}
              value={kpis.matchingTime}
              suffix="min"
              valueStyle={{ fontWeight: 800 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>-0.2 min target</Text>
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered={false} className="shadow-sm" style={{ background: '#fef2f2' }}>
            <Statistic 
              title={<Text strong style={{ color: '#b91c1c' }}>Overall Cancel Rate</Text>}
              value={kpis.cancelRate}
              suffix="%"
              valueStyle={{ fontWeight: 800 }}
            />
            <Text type="danger" style={{ fontSize: 12 }}>+0.8% alert threshold</Text>
          </Card>
        </Col>
      </Row>

      <Card title="Ride Velocity (24h)" bordered={false} className="shadow-lg">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rides" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cancels" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Peak Demand Centers" bordered={false} className="shadow-sm">
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="System Health" bordered={false} className="shadow-sm">
             <ul className="space-y-3" style={{ listStyle: 'none', padding: 0 }}>
               <li className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                 <Text type="secondary">WebSocket Connections</Text>
                 <Tag color="success">Healthy (1.2k)</Tag>
               </li>
               <li className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                 <Text type="secondary">Geo-Indexing Lag</Text>
                 <Tag color="success">12ms</Tag>
               </li>
               <li className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <Text type="secondary">Payment Gateway</Text>
                 <Tag color="warning">Degraded (Retrying)</Tag>
               </li>
             </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
