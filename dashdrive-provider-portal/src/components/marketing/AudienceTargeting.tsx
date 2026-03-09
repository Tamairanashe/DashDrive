import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Tag, Drawer, Form, Input, Select, InputNumber, Row, Col, Divider } from 'antd';
import { Users, Plus, Target, MapPin, Award, DollarSign, Star } from 'lucide-react';

const { Title, Text } = Typography;

export function AudienceTargeting({ token }: { token: string }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [segments, setSegments] = useState([
        { id: 'SEG-001', name: 'High Volume Drivers', city: 'Nairobi', tier: 'Diamond', earnings: '> $2500', rating: '4.8+', size: '2,450', status: 'Active' },
        { id: 'SEG-002', name: 'New Merchants', city: 'All Cities', tier: 'N/A', earnings: 'N/A', rating: 'N/A', size: '1,200', status: 'Active' },
        { id: 'SEG-003', name: 'Long Term Borrowers', city: 'Mombasa', tier: 'Platinum', earnings: '> $1800', rating: '4.7+', size: '3,100', status: 'Active' },
    ]);

    const columns = [
        {
            title: 'Segment Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <div style={{ fontWeight: 600 }}><Target size={14} style={{ marginRight: 8 }} /> {text}</div>
        },
        {
            title: 'Filters',
            key: 'filters',
            render: (_: any, record: any) => (
                <Space wrap>
                    <Tag icon={<MapPin size={12} />}>{record.city}</Tag>
                    {record.tier !== 'N/A' && <Tag icon={<Award size={12} />}>{record.tier}</Tag>}
                    {record.earnings !== 'N/A' && <Tag icon={<DollarSign size={12} />}>{record.earnings}</Tag>}
                    {record.rating !== 'N/A' && <Tag icon={<Star size={12} />}>{record.rating}</Tag>}
                </Space>
            )
        },
        {
            title: 'Audience Size',
            dataIndex: 'size',
            key: 'size',
            render: (size: string) => <Tag color="blue">{size} users</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color="green">{status}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Button type="link">Edit</Button>
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Audience Targeting</Title>
                    <Text type="secondary">Define and manage specific user segments for your loan marketing campaigns.</Text>
                </div>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsDrawerOpen(true)}>
                    Create Segment
                </Button>
            </div>

            <Row gutter={24}>
                <Col span={6}>
                    <Card style={{ borderRadius: '16px' }} bodyStyle={{ padding: '20px' }}>
                        <Statistic title="Total Reachable Audience" value="85,200" prefix={<Users size={20} />} valueStyle={{ fontWeight: 800 }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ borderRadius: '16px' }} bodyStyle={{ padding: '20px' }}>
                        <Statistic title="Active Segments" value={segments.length} prefix={<Target size={20} />} valueStyle={{ fontWeight: 800 }} />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 0 }}>
                <Table columns={columns} dataSource={segments} rowKey="id" pagination={false} />
            </Card>

            <Drawer
                title="Create Audience Segment"
                placement="right"
                width={500}
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                footer={
                    <div style={{ textAlign: 'right', padding: '16px' }}>
                        <Button onClick={() => setIsDrawerOpen(false)} style={{ marginRight: 8 }}>Cancel</Button>
                        <Button type="primary" onClick={() => setIsDrawerOpen(false)}>Create Segment</Button>
                    </div>
                }
            >
                <Form layout="vertical">
                    <Form.Item label="Segment Name" required>
                        <Input placeholder="e.g., High Volume Nairobi Drivers" />
                    </Form.Item>
                    
                    <Divider orientation="left" style={{ fontSize: '12px', color: '#94a3b8' }}>Targeting Rules</Divider>
                    
                    <Form.Item label="City">
                        <Select mode="multiple" placeholder="Select cities">
                            <Select.Option value="nairobi">Nairobi</Select.Option>
                            <Select.Option value="mombasa">Mombasa</Select.Option>
                            <Select.Option value="kisumu">Kisumu</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Driver Tier">
                        <Select mode="multiple" placeholder="Select tiers">
                            <Select.Option value="blue">Blue</Select.Option>
                            <Select.Option value="gold">Gold</Select.Option>
                            <Select.Option value="platinum">Platinum</Select.Option>
                            <Select.Option value="diamond">Diamond</Select.Option>
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Min. Monthly Earnings">
                                <InputNumber prefix="$" style={{ width: '100%' }} placeholder="2000" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Min. Driver Rating">
                                <InputNumber step={0.1} min={1} max={5} style={{ width: '100%' }} placeholder="4.5" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Credit History / Status">
                        <Select mode="multiple" placeholder="Select criteria">
                            <Select.Option value="loan">Existing Loan Active</Select.Option>
                            <Select.Option value="no-loan">No Active Loans</Select.Option>
                            <Select.Option value="top-up">Eligible for Top-up</Select.Option>
                        </Select>
                    </Form.Item>

                    <Card style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Estimated Segment Size</Text>
                            <Title level={5} style={{ margin: 0, color: '#3b82f6' }}>~ 1,840 users</Title>
                        </div>
                    </Card>
                </Form>
            </Drawer>
        </div>
    );
}

function Statistic({ title, value, prefix, valueStyle }: any) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#64748b' }}>
                {prefix}
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>{title}</Text>
            </div>
            <div style={valueStyle}>{value}</div>
        </div>
    );
}
