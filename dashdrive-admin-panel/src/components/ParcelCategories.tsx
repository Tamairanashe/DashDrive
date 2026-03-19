import React, { useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Typography,
    Card,
    Tooltip,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Divider,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SafetyCertificateOutlined,
    AlertOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ParcelCategory {
    id: string;
    name: string;
    description: string;
    baseRate: string;
    handlingType: 'Standard' | 'Fragile' | 'High Value' | 'Hazardous';
    restrictedItems: string[];
    safetyGuide: string;
    status: 'Active' | 'Under Review';
}

const mockCategories: ParcelCategory[] = [
    {
        id: 'CAT-001',
        name: 'Electronics',
        description: 'Smartphones, laptops, and peripheral hardware.',
        baseRate: '$12.00',
        handlingType: 'High Value',
        restrictedItems: ['Loose Batteries', 'Damaged Screens'],
        safetyGuide: 'Anti-static wrap required. Mandatory insurance above $500.',
        status: 'Active'
    },
    {
        id: 'CAT-002',
        name: 'Documents',
        description: 'Legal papers, contracts, and sensitive printed material.',
        baseRate: '$4.50',
        handlingType: 'Standard',
        restrictedItems: ['Cash', 'Passports'],
        safetyGuide: 'Weather-proof sealing mandatory. Sign-on-delivery enforced.',
        status: 'Active'
    },
    {
        id: 'CAT-003',
        name: 'Home & Kitchen',
        description: 'Glassware, ceramics, and small appliances.',
        baseRate: '$8.50',
        handlingType: 'Fragile',
        restrictedItems: ['Propane Tanks', 'Corrosive Cleaners'],
        safetyGuide: 'Double-box method for glassware. Fragile markers on all sides.',
        status: 'Active'
    },
    {
        id: 'CAT-004',
        name: 'Heavy Goods',
        description: 'Furniture, gym equipment, and bulk items > 20kg.',
        baseRate: '$35.00',
        handlingType: 'Standard',
        restrictedItems: ['Explosives', 'Livestock'],
        safetyGuide: 'Two-person lift or trolley required. Cargo bike/van only.',
        status: 'Active'
    }
];

export const ParcelCategories: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const getHandlingTag = (type: ParcelCategory['handlingType']) => {
        switch (type) {
            case 'Fragile':
                return <Tag color="orange">Fragile</Tag>;
            case 'High Value':
                return <Tag color="gold">High Value</Tag>;
            case 'Hazardous':
                return <Tag color="red">Hazardous</Tag>;
            default:
                return <Tag color="blue">Standard</Tag>;
        }
    };

    const columns = [
        {
            title: 'Category Name',
            key: 'name',
            render: (_: any, record: ParcelCategory) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.id}</Text>
                </Space>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text>,
        },
        {
            title: 'Handling Type',
            dataIndex: 'handlingType',
            key: 'handlingType',
            render: (type: ParcelCategory['handlingType']) => getHandlingTag(type),
        },
        {
            title: 'Base Rate',
            dataIndex: 'baseRate',
            key: 'baseRate',
            render: (rate: string) => <Text strong style={{ color: '#10b981' }}>{rate}</Text>,
        },
        {
            title: 'Restricted Items',
            dataIndex: 'restrictedItems',
            key: 'restrictedItems',
            render: (items: string[]) => (
                <Space wrap>
                    {items.map(item => (
                        <Tag key={item} color="default" style={{ fontSize: 10 }}>{item}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Safety Protocol',
            dataIndex: 'safetyGuide',
            key: 'safetyGuide',
            render: (guide: string) => (
                <Tooltip title={guide}>
                    <Space>
                        <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                        <Text type="secondary" ellipsis style={{ maxWidth: 150, fontSize: 12 }}>{guide}</Text>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Logistics Taxonomy</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Classify shipment types, handle requirements, and manage global parcel safety protocols</Text>
            </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                    style={{ borderRadius: 12 }}
                >
                    New Category
                </Button>
            </div>

            <Card bordered={false} className="shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
                <Table 
                    columns={columns} 
                    dataSource={mockCategories} 
                    rowKey="id"
                    pagination={false}
                />
            </Card>

            <Card size="small" className="bg-blue-50 border-blue-100">
                <Space align="start">
                    <InfoCircleOutlined style={{ color: '#1890ff', marginTop: 4 }} />
                    <div>
                        <Text strong>Compliance Tip:</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Ensure all restricted entities are updated according to the latest regional logistics guidelines. 
                            Mandatory sign-on-delivery is enforced for all 'High Value' items automatically.
                        </Text>
                    </div>
                </Space>
            </Card>

            <Modal 
                title="Create New Category" 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    message.success('New category defined successfully');
                    setIsModalOpen(false);
                }}
                okText="Define Category"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item label="Category Name" required>
                        <Input placeholder="e.g. Hazardous Materials" />
                    </Form.Item>
                    <Form.Item label="Handling Protocol">
                        <Select defaultValue="Standard">
                            <Select.Option value="Standard">Standard</Select.Option>
                            <Select.Option value="Fragile">Fragile</Select.Option>
                            <Select.Option value="High Value">High Value</Select.Option>
                            <Select.Option value="Hazardous">Hazardous</Select.Option>
                        </Select>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Base Rate ($)">
                                <InputNumber style={{ width: '100%' }} prefix="$" defaultValue={5.00} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ID Prefix">
                                <Input disabled defaultValue="CAT-" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Compliance Guide">
                        <Input.TextArea placeholder="Describe safety and handling requirements..." rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};


