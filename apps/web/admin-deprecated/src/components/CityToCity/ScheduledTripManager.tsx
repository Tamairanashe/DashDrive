import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Avatar, Tooltip, Row, Col, Progress, Calendar, Badge, List } from 'antd';
import { 
    ClockCircleOutlined,
    SwapOutlined,
    UsergroupAddOutlined,
    CarOutlined,
    PrinterOutlined,
    BellOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title, Paragraph } = Typography;

const initialTrips = [
    { 
        id: 'TRP-1001', 
        route: 'Harare → Bulawayo', 
        departure: 'Today, 07:00 AM', 
        status: 'in_transit',
        driver: { name: 'Gift M.', rating: 4.8 },
        vehicle: 'Toyota Hiace (ABC-1234)',
        capacity: 14,
        booked: 14,
        passengers: [
            { name: 'Sarah J.', seats: 1, paid: true },
            { name: 'Michael K.', seats: 2, paid: true },
        ]
    },
    { 
        id: 'TRP-1002', 
        route: 'Harare → Mutare', 
        departure: 'Today, 10:30 AM', 
        status: 'boarding',
        driver: { name: 'Blessing C.', rating: 4.9 },
        vehicle: 'Mercedes Sprinter (XYZ-9876)',
        capacity: 18,
        booked: 12,
        passengers: []
    },
    { 
        id: 'TRP-1003', 
        route: 'Bulawayo → Gweru', 
        departure: 'Tomorrow, 08:00 AM', 
        status: 'scheduled',
        driver: { name: 'Simba O.', rating: 4.6 },
        vehicle: 'Honda Fit (REG-4432)',
        capacity: 4,
        booked: 3,
        passengers: []
    }
];

export const ScheduledTripManager: React.FC = () => {
    const [trips, setTrips] = useState(initialTrips);

    const columns = [
        {
            title: 'Trip Detail',
            key: 'trip',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.route}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined /> {record.departure}
                    </Text>
                </Space>
            )
        },
        {
            title: 'Driver & Fleet',
            key: 'driver',
            render: (_: any, record: any) => (
                <Space>
                    <Avatar shape="square" icon={<CarOutlined />} />
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{record.driver.name}</Text>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{record.vehicle}</div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Seat Allocation',
            key: 'occupancy',
            render: (_: any, record: any) => {
                const percent = (record.booked / record.capacity) * 100;
                return (
                    <div style={{ width: 150 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ fontSize: 12 }}>{record.booked}/{record.capacity} Seats</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{Math.round(percent)}%</Text>
                        </div>
                        <Progress 
                            percent={percent} 
                            size="small" 
                            showInfo={false} 
                            strokeColor={percent === 100 ? '#10b981' : percent > 50 ? '#3b82f6' : '#f59e0b'}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Lifecycle Status',
            dataIndex: 'status',
            render: (status: string) => {
                const statusMap: any = {
                    scheduled: { color: 'blue', text: 'Scheduled' },
                    boarding: { color: 'orange', text: 'Boarding' },
                    in_transit: { color: 'green', text: 'On Route' },
                    completed: { color: 'gray', text: 'Completed' },
                };
                const { color, text } = statusMap[status] || { color: 'default', text: status };
                return <Tag color={color} style={{ borderRadius: 6 }}>{text}</Tag>;
            }
        },
        {
            title: 'Live Monitor',
            key: 'actions',
            render: () => (
                <Space>
                    <Tooltip title="View Manifest">
                        <Button icon={<UsergroupAddOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title="Print Ticket">
                        <Button icon={<PrinterOutlined />} size="small" />
                    </Tooltip>
                    <Button type="link" size="small">Track Live</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={18}>
                    <Card variant="borderless" style={{ borderRadius: 20 }} title="Confirmed inter-City Journeys">
                        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                            <Space>
                                <Button type="primary" style={{ background: '#10b981' }}>Export Manifests</Button>
                                <Button icon={<BellOutlined />}>Notify Passengers</Button>
                            </Space>
                            <Space>
                                <Tag icon={<CheckCircleOutlined />} color="success">98% Ontime</Tag>
                                <Tag icon={<ClockCircleOutlined />} color="warning">2 Delayed</Tag>
                            </Space>
                        </div>
                        <Table 
                            dataSource={trips} 
                            columns={columns} 
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={6}>
                    <Card variant="borderless" style={{ borderRadius: 20 }} title="Operations Calendar">
                        <Calendar fullscreen={false} headerRender={() => null} />
                        <Divider />
                        <Title level={5}>Timeline Events</Title>
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={[
                                { time: '09:00', event: 'Harare-Bulawayo Departure', status: 'done' },
                                { time: '11:30', event: 'Driver B. Chipunza Break', status: 'pending' },
                                { time: '13:00', event: 'Shift Handover Bulawayo', status: 'pending' },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <Space>
                                        <Text type="secondary" style={{ width: 45 }}>{item.time}</Text>
                                        <Badge status={item.status === 'done' ? 'success' : 'processing'} />
                                        <Text style={{ fontSize: 13 }}>{item.event}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const Divider = () => <div style={{ height: 1, background: '#f1f5f9', margin: '16px 0' }} />;
