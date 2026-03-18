import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Input, Typography, Modal, Form, InputNumber, Switch, Tooltip, Row, Col } from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    EnvironmentOutlined, 
    ThunderboltOutlined,
    InfoCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

const initialRoutes = [
    { id: 1, origin: 'Harare', destination: 'Bulawayo', distance: 440, estTime: '5h 30m', minPrice: 40, maxPrice: 70, status: 'Active', demand: 'High' },
    { id: 2, origin: 'Harare', destination: 'Mutare', distance: 263, estTime: '3h 15m', minPrice: 20, maxPrice: 45, status: 'Active', demand: 'Moderate' },
    { id: 3, origin: 'Bulawayo', destination: 'Victoria Falls', distance: 435, estTime: '6h 00m', minPrice: 50, maxPrice: 100, status: 'Inactive', demand: 'Low' },
    { id: 4, origin: 'Harare', destination: 'Masvingo', distance: 297, estTime: '4h 00m', minPrice: 25, maxPrice: 55, status: 'Active', demand: 'High' },
];

export const RouteManager: React.FC = () => {
    const [routes, setRoutes] = useState(initialRoutes);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Route',
            key: 'route',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.origin} → {record.destination}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.distance}km • {record.estTime}</Text>
                </Space>
            ),
        },
        {
            title: 'Pricing Guidelines',
            key: 'pricing',
            render: (_: any, record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text style={{ color: '#10b981', fontWeight: 600 }}>${record.minPrice} – ${record.maxPrice}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Suggested Corridor</Text>
                </Space>
            ),
        },
        {
            title: 'Demand Status',
            dataIndex: 'demand',
            render: (demand: string) => (
                <Tag color={demand === 'High' ? 'red' : demand === 'Moderate' ? 'blue' : 'default'} style={{ borderRadius: 6 }}>
                    {demand}
                </Tag>
            ),
        },
        {
            title: 'System Status',
            dataIndex: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'success' : 'default'} icon={status === 'Active' ? <ThunderboltOutlined /> : null}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Tooltip title="Edit Route">
                        <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Price History">
                        <Button type="text" icon={<HistoryOutlined />} />
                    </Tooltip>
                    <Button type="link" size="small">Manage Drivers</Button>
                </Space>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
        >
            <Card 
                variant="borderless" 
                style={{ borderRadius: 20 }}
                title={
                    <Space>
                        <EnvironmentOutlined style={{ color: '#3b82f6' }} />
                        <span>Logistics Network Control</span>
                    </Space>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ borderRadius: 8, background: '#3b82f6' }}>
                        Create New Route
                    </Button>
                }
            >
                <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <Input.Search placeholder="Filter cities..." style={{ width: 300, borderRadius: 8 }} />
                    <Space>
                        <Button icon={<ThunderboltOutlined />}>Smart Pricing AI</Button>
                    </Space>
                </div>

                <Table 
                    dataSource={routes} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{ pageSize: 5 }}
                    className="custom-table"
                />
            </Card>

            <Modal
                title="Configure New City Route"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                centered
            >
                <Form layout="vertical" form={form} style={{ marginTop: 20 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Origin City" name="origin" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Harare" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Destination City" name="destination" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Bulawayo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Distance (km)" name="distance">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Min Price ($)" name="minPrice">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Max Price ($)" name="maxPrice">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Enable Smart Alerts" valuePropName="checked">
                        <Space>
                            <Switch defaultChecked />
                            <Text type="secondary" style={{ fontSize: 12 }}>Notify ops when demand exceeds driver supply by 30%</Text>
                        </Space>
                    </Form.Item>
                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                            <Button type="primary" style={{ background: '#3b82f6' }}>Activate Route</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </motion.div>
    );
};
