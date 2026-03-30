import React, { useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Typography,
    Card,
    Tooltip,
    Alert,
    Avatar,
    Row,
    Col,
    Divider
} from 'antd';
import {
    PlusCircleOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    DeploymentUnitOutlined,
    SignatureOutlined,
    SettingOutlined,
    RightOutlined,
    SkinOutlined,
    InsuranceOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ParcelAttribute {
    id: string;
    name: string;
    description: string;
    feeType: 'Fixed' | 'Percentage';
    feeValue: string;
    icon: any;
    assignedCategories: string[];
    priority: 'Standard' | 'High' | 'Critical';
}

const mockAttributes: ParcelAttribute[] = [
    {
        id: 'ATTR-01',
        name: 'Fragile Handling',
        description: 'Enhanced padding and top-load placement. Mandatory for glass/ceramics.',
        feeType: 'Percentage',
        feeValue: '15%',
        icon: SkinOutlined,
        assignedCategories: ['Home & Kitchen', 'Electronics'],
        priority: 'High'
    },
    {
        id: 'ATTR-02',
        name: 'Logistics Insurance',
        description: 'Comprehensive coverage up to $2,000 for loss or structural damage.',
        feeType: 'Percentage',
        feeValue: '2.5%',
        icon: InsuranceOutlined,
        assignedCategories: ['Electronics', 'Heavy Goods'],
        priority: 'Critical'
    },
    {
        id: 'ATTR-03',
        name: 'Temperature Control',
        description: 'Cold-chain maintenance for perishable or medical logistics.',
        feeType: 'Fixed',
        feeValue: '$25.00',
        icon: ThunderboltOutlined,
        assignedCategories: ['Food & Pharma'],
        priority: 'High'
    },
    {
        id: 'ATTR-04',
        name: 'Signature Required',
        description: 'Proof of delivery via digital signature at exact coordinates.',
        feeType: 'Fixed',
        feeValue: '$1.50',
        icon: SignatureOutlined,
        assignedCategories: ['Documents', 'High Value'],
        priority: 'Standard'
    }
];

export const ParcelAttributes: React.FC = () => {
    const getPriorityTag = (priority: ParcelAttribute['priority']) => {
        switch (priority) {
            case 'Critical':
                return <Tag color="red">Critical</Tag>;
            case 'High':
                return <Tag color="volcano">High</Tag>;
            default:
                return <Tag color="blue">Standard</Tag>;
        }
    };

    const columns = [
        {
            title: 'Attribute',
            key: 'attribute',
            render: (_: any, record: ParcelAttribute) => (
                <Space>
                    <Avatar 
                        icon={<record.icon />} 
                        style={{ backgroundColor: '#f0f5ff', color: '#1890ff' }} 
                        shape="square"
                        size="large"
                    />
                    <Space orientation="vertical" size={0}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>,
        },
        {
            title: 'Fee Structure',
            key: 'fee',
            render: (_: any, record: ParcelAttribute) => (
                <Space orientation="vertical" size={0}>
                    <Text strong style={{ color: '#10b981' }}>{record.feeValue}</Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>{record.feeType}</Text>
                </Space>
            ),
        },
        {
            title: 'Auto-Assigned',
            dataIndex: 'assignedCategories',
            key: 'categories',
            render: (categories: string[]) => (
                <Space wrap>
                    {categories.map(cat => (
                        <Tag key={cat} color="cyan" style={{ fontSize: 10 }}>{cat}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: ParcelAttribute['priority']) => getPriorityTag(priority),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Button type="link" size="small">Edit Logic</Button>
            ),
        },
    ];

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Smart Surcharge Engine</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Configure automated price adjustments based on package characteristics and handling complexity</Text>
            </div>
                <Button 
                    type="primary" 
                    icon={<PlusCircleOutlined />} 
                    size="large"
                    style={{ borderRadius: 12 }}
                >
                    New Attribute
                </Button>
            </div>

            {/* Automation Hero Section */}
            <Card 
                className="bg-slate-900 overflow-hidden" 
                styles={{ body: { padding: '32px 40px' } }}
                bordered={false}
            >
                <Row align="middle" gutter={40}>
                    <Col>
                        <Avatar 
                            size={80} 
                            icon={<ThunderboltOutlined />} 
                            style={{ backgroundColor: 'rgba(24, 144, 255, 0.15)', color: '#1890ff' }} 
                        />
                    </Col>
                    <Col flex="1">
                        <Title level={4} style={{ color: 'white', margin: 0 }}>Smart Surcharge Engine</Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                            Our AI automatically applies <Text strong style={{ color: 'white' }}>Insurance Premium</Text> and <Text strong style={{ color: 'white' }}>High Value Handling</Text> based on real-time price scanning of declared contents.
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary" size="large" ghost icon={<SettingOutlined />}>
                            Configure AI Logic
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card bordered={false} className="shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
                <Table 
                    columns={columns} 
                    dataSource={mockAttributes} 
                    rowKey="id"
                    pagination={false}
                />
            </Card>

            <Alert
                message="Optimization Insight"
                description="Linking 'Fragile Handling' to 'Electronics' has reduced accidental damage claims by 24% this quarter. Consider adding 'Proof of Age' for Pharma categories."
                type="success"
                showIcon
                action={
                    <Button size="small" type="link">
                        View Analytics
                    </Button>
                }
            />
        </Space>
    );
};


