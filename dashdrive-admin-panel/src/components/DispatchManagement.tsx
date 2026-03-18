import React from 'react';
import { Typography, Card, Button, Space, Tag, Input, Row, Col, Badge, Avatar, List, Tooltip } from 'antd';
import { Zap, MapPin, Clock, Search, Navigation, User, AlertCircle, CheckCircle2, Navigation2 } from 'lucide-react';

const { Title, Text } = Typography;
const StyledCard = Card as any;

// Mock Data
const pendingOrders = [
 {
 id: 'ORD-5829',
 type: 'Food',
 customer: 'John Smith',
 pickup: 'KFC Avondale',
 dropoff: '123 Main St, Harare',
 amount: '$14.50',
 timeElapsed: '12 mins',
 status: 'Unassigned',
 priority: 'High'
 },
 {
 id: 'ORD-5830',
 type: 'Mart',
 customer: 'Sarah Connor',
 pickup: 'Fresh Supermarket',
 dropoff: '45 West Road, Avondale',
 amount: '$45.00',
 timeElapsed: '5 mins',
 status: 'Unassigned',
 priority: 'Normal'
 },
 {
 id: 'RD-1092',
 type: 'Ride',
 customer: 'Mike Ross',
 pickup: 'Joina City',
 dropoff: 'Sam Levy Village',
 amount: '$8.00',
 timeElapsed: '2 mins',
 status: 'Searching',
 priority: 'Normal'
 }
];

const availableRiders = [
 {
 id: 'RID-101',
 name: 'James Walker',
 vehicle: 'Honda Fit (Car)',
 distance: '1.2 km away',
 rating: 4.8,
 status: 'Available',
 battery: '85%'
 },
 {
 id: 'RID-102',
 name: 'Peter Parker',
 vehicle: 'Yamaha 150 (Bike)',
 distance: '2.5 km away',
 rating: 4.9,
 status: 'Available',
 battery: '92%'
 },
 {
 id: 'RID-103',
 name: 'Arthur Morgan',
 vehicle: 'Toyota Belta (Car)',
 distance: '3.0 km away',
 rating: 4.5,
 status: 'Available',
 battery: '45%'
 }
];

export function DispatchManagement() {
 const getTypeColor = (type: string) => {
 switch (type) {
 case 'Food': return 'orange';
 case 'Mart': return 'green';
 case 'Ride': return 'blue';
 case 'Parcel': return 'purple';
 default: return 'default';
 }
 };

 return (
 <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
 <div className="flex justify-between items-center shrink-0">
 <div>
 <Title level={2} className="m-0 flex items-center gap-2">
 <Zap className="w-8 h-8 text-primary" />
 Manual Dispatch
 </Title>
 <Text type="secondary">Monitor unassigned orders and manually assign them to available riders.</Text>
 </div>
 <Space>
 <Badge count={3} color="#f59e0b" className="mr-4">
 <Button className="h-10 rounded-xl font-medium" icon={<AlertCircle className="w-4 h-4" />}>
 Critical SLA Alerts
 </Button>
 </Badge>
 <Button type="primary" className="h-10 px-6 rounded-xl font-medium shadow-md">
 Auto-Dispatch: ON
 </Button>
 </Space>
 </div>

 <Row gutter={24} className="flex-1 overflow-hidden">
 {/* Pending Orders Column */}
 <Col span={14} className="h-full flex flex-col">
 <StyledCard
 title={<div className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" /> Pending & Unassigned (3)</div>}
 className="rounded-3xl shadow-sm border-zinc-100 flex-1 flex flex-col"
 bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
 >
 <div className="p-4 border-b border-zinc-100 shrink-0">
 <Input placeholder="Search Order ID or Customer..." prefix={<Search className="w-4 h-4 text-zinc-400" />} className="rounded-xl h-10 w-full" />
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30">
 {pendingOrders.map(order => (
 <StyledCard key={order.id} className="rounded-2xl border-zinc-200 hover:border-primary/40 transition-colors shadow-sm cursor-pointer" styles={{ body: { padding: '16px' } }}>
 <div className="flex justify-between items-start mb-3">
 <Space>
 <Tag color={getTypeColor(order.type)} className="rounded-md border-0 m-0">{order.type}</Tag>
 <Text strong>{order.id}</Text>
 </Space>
 <Space>
 {order.priority === 'High' && <Tag color="error" className="rounded-md border-0 m-0">High Priority</Tag>}
 <Tag color="warning" className="rounded-md border-0 m-0 flex items-center gap-1">
 <Clock className="w-3 h-3" /> {order.timeElapsed}
 </Tag>
 </Space>
 </div>

 <div className="space-y-2 mb-4">
 <div className="flex items-start gap-2">
 <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
 <Text className="text-sm text-zinc-600 truncate">{order.pickup}</Text>
 </div>
 <div className="ml-1 border-l-2 border-dashed border-zinc-200 h-4" />
 <div className="flex items-start gap-2">
 <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
 <Text className="text-sm text-zinc-600 truncate">{order.dropoff}</Text>
 </div>
 </div>

 <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
 <Space>
 <Avatar size="small" icon={<User />} className="bg-zinc-200" />
 <Text strong className="text-sm">{order.customer}</Text>
 </Space>
 <Text strong>{order.amount}</Text>
 </div>
 </StyledCard>
 ))}
 </div>
 </StyledCard>
 </Col>

 {/* Available Riders Column */}
 <Col span={10} className="h-full flex flex-col">
 <StyledCard
 title={<div className="flex items-center gap-2"><Navigation2 className="w-5 h-5 text-blue-500" /> Nearby Available Riders</div>}
 className="rounded-3xl shadow-sm border-zinc-100 flex-1 flex flex-col"
 bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
 >
 <div className="p-4 border-b border-zinc-100 shrink-0 flex gap-2">
 <Input placeholder="Search Rider..." prefix={<Search className="w-4 h-4 text-zinc-400" />} className="rounded-xl h-10 flex-1" />
 </div>
 <List
 className="flex-1 overflow-y-auto"
 dataSource={availableRiders}
 renderItem={rider => (
 <List.Item className="p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 flex justify-between items-center group cursor-pointer">
 <Space align="start" size="middle">
 <Avatar size="large" className="bg-primary/10 text-primary font-bold">{rider.name.charAt(0)}</Avatar>
 <div className="flex flex-col">
 <Text strong className="text-zinc-800 leading-tight">{rider.name}</Text>
 <Text type="secondary" className="text-xs">{rider.vehicle}</Text>
 <Space size="small" className="mt-1">
 <Badge status="success" />
 <Text className="text-xs text-zinc-500 flex items-center gap-1">
 <MapPin className="w-3 h-3" /> {rider.distance}
 </Text>
 </Space>
 </div>
 </Space>
 <div className="flex flex-col items-end gap-2">
 <Tag color="green" className="rounded-md border-0 m-0 flex items-center gap-1 text-xs">
 <CheckCircle2 className="w-3 h-3" /> {rider.rating}
 </Tag>
 <Button type="primary" size="small" className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
 Assign
 </Button>
 </div>
 </List.Item>
 )}
 />
 </StyledCard>
 </Col>
 </Row>
 </div>
 );
}
