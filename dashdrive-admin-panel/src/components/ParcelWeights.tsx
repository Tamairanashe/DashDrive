import React, { useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Typography,
    Card,
    Row,
    Col,
    Statistic,
    Divider,
    Alert,
    message,
    Tooltip
} from 'antd';
import {
    SettingOutlined,
    PlusOutlined,
    ThunderboltOutlined,
    LineChartOutlined,
    EditOutlined,
    DeleteOutlined,
    InboxOutlined,
    CalculatorOutlined,
    BulbOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface WeightSlab {
    id: string;
    range: string;
    baseFee: string;
    perKmRate: string;
    handlingFee: string;
    status: 'Active' | 'Draft';
}

const mockSlabs: WeightSlab[] = [
    { id: 'SLB-01', range: '0 - 1 kg', baseFee: '$4.50', perKmRate: '$0.50', handlingFee: '$0.00', status: 'Active' },
    { id: 'SLB-02', range: '1 - 5 kg', baseFee: '$8.50', perKmRate: '$0.80', handlingFee: '$1.50', status: 'Active' },
    { id: 'SLB-03', range: '5 - 10 kg', baseFee: '$12.00', perKmRate: '$1.20', handlingFee: '$3.50', status: 'Active' },
    { id: 'SLB-04', range: '10 - 20 kg', baseFee: '$22.00', perKmRate: '$2.00', handlingFee: '$7.50', status: 'Active' },
    { id: 'SLB-05', range: '20kg+', baseFee: '$45.00', perKmRate: '$3.50', handlingFee: '$15.00', status: 'Draft' }
];

export const ParcelWeights: React.FC = () => {
    const columns = [
        {
            title: 'Slab Identifier',
            key: 'id',
            render: (_: any, record: WeightSlab) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.id}</Text>
                    <Tag color={record.status === 'Active' ? 'success' : 'warning'} style={{ fontSize: 9 }}>
                        {record.status}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Weight Range',
            dataIndex: 'range',
            key: 'range',
            render: (text: string) => (
                <Space>
                    <InboxOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Base Fee',
            dataIndex: 'baseFee',
            key: 'baseFee',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Per KM Rate',
            dataIndex: 'perKmRate',
            key: 'perKmRate',
            render: (text: string) => <Text type="secondary">{text}</Text>,
        },
        {
            title: 'Extra Handling',
            dataIndex: 'handlingFee',
            key: 'handlingFee',
            render: (text: string) => <Text type="secondary">{text}</Text>,
        },
        {
            title: 'Operations',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Pricing Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Define modular weight brackets and volumetric calculation rules for heavy-duty logistics</Text>
            </div>
                <Button 
                    type="primary" 
                    icon={<SettingOutlined />} 
                    size="large"
                    style={{ borderRadius: 12, backgroundColor: '#0f172a' }}
                >
                    Simulation Mode
                </Button>
            </div>

            {/* Dashboard Hero */}
            <Card bordered={false} className="shadow-sm">
                <Row gutter={48} align="middle">
                    <Col span={6}>
                        <Card 
                            styles={{ body: { padding: 24 } }} 
                            style={{ backgroundColor: '#0f172a', textAlign: 'center', borderRadius: 24 }}
                        >
                            <Text style={{ color: '#3b82f6', fontWeight: 900, fontSize: 10, letterSpacing: 2 }}>GLOBAL FORMULA</Text>
                            <Title level={4} style={{ color: 'white', margin: '12px 0 4px 0' }}>Base + (KM × Rate)</Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 10 }}>+ Additional Surcharges</Text>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Statistic title="Minimum Fare" value={4.50} prefix="$" precision={2} />
                                <Text type="secondary" style={{ fontSize: 11 }}>Standard Route</Text>
                            </Col>
                            <Col span={6}>
                                <Statistic title="Fuel Surcharge" value={2.5} suffix="%" precision={1} />
                                <Text type="secondary" style={{ fontSize: 11 }}>Applied Dynamically</Text>
                            </Col>
                            <Col span={6}>
                                <Statistic title="Night Premium" value={2.00} prefix="+$" precision={2} />
                                <Text type="secondary" style={{ fontSize: 11 }}>22:00 - 06:00</Text>
                            </Col>
                            <Col span={6}>
                                <Statistic 
                                    title="Revenue Growth" 
                                    value={18} 
                                    prefix="+" 
                                    suffix="%" 
                                    valueStyle={{ color: '#3f8600' }} 
                                />
                                <Text type="secondary" style={{ fontSize: 11 }}>vs Last Month</Text>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0' }} />
                        <Space>
                            <ThunderboltOutlined style={{ color: '#faad14' }} />
                            <Text type="secondary" italic style={{ fontSize: 12 }}>
                                System is currently applying <Text strong underline>Surge Pricing x1.2</Text> in High-Volume Zone A.
                            </Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card bordered={false} className="shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <CalculatorOutlined style={{ color: '#8c8c8c' }} />
                        <Text strong>Pricing Slabs</Text>
                    </Space>
                    <Button type="link" size="small" icon={<PlusOutlined />}>Add Slab</Button>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={mockSlabs} 
                    rowKey="id"
                    pagination={false}
                />
            </Card>

            <Alert
                message={
                    <Space>
                        <BulbOutlined />
                        <Text strong style={{ color: 'white' }}>Insight: Slab Efficiency Optimization</Text>
                    </Space>
                }
                description={
                    <Text type="secondary">
                        Data shows <Text strong underline>2.5kg - 4kg parcels</Text> are significantly under-priced vs fuel costs. 
                        We recommend splitting <Text strong italic>SLB-02</Text> into two distinct slabs.
                    </Text>
                }
                type="info"
                showIcon={false}
                style={{ backgroundColor: '#064e3b', border: 'none', borderRadius: 24, padding: 32 }}
                action={
                    <Button 
                        ghost 
                        style={{ color: '#064e3b', backgroundColor: 'white', border: 'none', borderRadius: 12, fontWeight: 'bold' }}
                        size="large"
                    >
                        Apply Suggestion
                    </Button>
                }
            />
        </Space>
    );
};
;
