import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Row, Col, Statistic, Badge, Tabs, List, Tooltip, Input, Select, Alert } from 'antd';
import { 
    DollarOutlined, 
    HistoryOutlined, 
    SafetyOutlined, 
    WarningOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    AuditOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title, Paragraph } = Typography;

const mockPayments = [
    { 
        id: 'PAY-8821', 
        tripId: 'TRP-1001', 
        amount: 50, 
        status: 'completed', 
        driver: 'Gift M.', 
        pax: 'Sarah J.',
        escrow: 'Released',
        time: '2 hours ago'
    },
    { 
        id: 'PAY-8825', 
        tripId: 'TRP-1005', 
        amount: 35, 
        status: 'held', 
        driver: 'Blessing C.', 
        pax: 'Michael K.',
        escrow: 'In Escrow',
        time: 'Ongoing'
    },
    { 
        id: 'PAY-8829', 
        tripId: 'TRP-1009', 
        amount: 45, 
        status: 'disputed', 
        driver: 'Simba O.', 
        pax: 'Robert K.',
        escrow: 'Frozen',
        time: 'Yesterday'
    }
];

export const FinancialManager: React.FC = () => {
    const [payments] = useState(mockPayments);

    const columns = [
        {
            title: 'Transaction Details',
            key: 'txn',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.id}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Trip: {record.tripId}</Text>
                </Space>
            )
        },
        {
            title: 'Entities',
            key: 'entities',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text style={{ fontSize: 13 }}>Driver: {record.driver}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>User: {record.pax}</Text>
                </Space>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: (amt: number) => <Text strong>${amt.toFixed(2)}</Text>
        },
        {
            title: 'Escrow State',
            dataIndex: 'escrow',
            render: (state: string) => {
                const color = state === 'Released' ? 'success' : state === 'Frozen' ? 'error' : 'processing';
                return <Tag color={color} style={{ borderRadius: 6 }}>{state}</Tag>;
            }
        },
        {
            title: 'Pay Status',
            dataIndex: 'status',
            render: (status: string) => {
                const config: any = {
                    completed: { icon: <CheckCircleOutlined />, color: 'success', text: 'Success' },
                    held: { icon: <ClockCircleOutlined />, color: 'warning', text: 'Held' },
                    disputed: { icon: <SyncOutlined spin />, color: 'error', text: 'Disputed' }
                };
                const item = config[status] || { text: status };
                return <Badge status={item.color as any} text={item.text} />;
            }
        },
        {
            title: 'Admin actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {record.status === 'disputed' ? (
                        <Button size="small" type="primary" danger>Resolve</Button>
                    ) : (
                        <Button size="small" type="link">Audit</Button>
                    )}
                    <Button size="small" type="link">Receipt</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 0' }}>
            <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic title="Total Escrow Vol." value={12450} prefix={<DollarOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic title="Pending Payouts" value={3240} prefix={<SyncOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic title="Revenue (C2C)" value={1580} prefix={<DollarOutlined />} styles={{ content: { color: '#10b981' } }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="glass-card">
                        <Statistic title="Active Disputes" value={3} prefix={<WarningOutlined />} styles={{ content: { color: '#ef4444' } }} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card variant="borderless" style={{ borderRadius: 20 }} title="Financial Transaction Ledger">
                        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                            <Input placeholder="Search payments..." prefix={<SearchOutlined />} style={{ width: 300 }} />
                            <Space>
                                <Button icon={<AuditOutlined />}>Reconciliation Report</Button>
                                <Button type="primary" icon={<DollarOutlined />}>Batch Release</Button>
                            </Space>
                        </div>
                        <Table 
                            dataSource={payments} 
                            columns={columns} 
                            rowKey="id"
                            pagination={{ pageSize: 15 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card variant="borderless" style={{ borderRadius: 20 }} title="Escrow Security Flow">
                        <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
                            <Text strong style={{ display: 'block', marginBottom: 12 }}>How Escrow Works for City-to-City</Text>
                            <List
                                size="small"
                                dataSource={[
                                    { step: 1, desc: 'Passenger booking → Funds held in system' },
                                    { step: 2, desc: 'Trip starts → Funds verified' },
                                    { step: 3, desc: 'Trip completed → Auto-release after 1h' },
                                    { step: 4, desc: 'Dispute → Funds frozen for audit' }
                                ]}
                                renderItem={item => (
                                    <List.Item>
                                        <Space>
                                            <Badge count={item.step} style={{ backgroundColor: '#64748b' }} />
                                            <Text style={{ fontSize: 13 }}>{item.desc}</Text>
                                        </Space>
                                    </List.Item>
                                )}
                            />
                        </div>

                        <Title level={5}>Recent Dispute Escalations</Title>
                        <Alert
                            message="Price Manipulation Suspected"
                            description="TRP-2021: Driver T. Mash attempted to collect extra $15 cash."
                            type="error"
                            showIcon
                            style={{ marginBottom: 16, borderRadius: 8 }}
                            action={<Button size="small" danger>Investigate</Button>}
                        />
                        <Alert
                            message="Trip No-Show"
                            description="TRP-2024: Passenger reported driver did not arrive at pickup."
                            type="warning"
                            showIcon
                            style={{ borderRadius: 8 }}
                            action={<Button size="small">Audit Logs</Button>}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
