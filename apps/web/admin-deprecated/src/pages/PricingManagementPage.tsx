import React from 'react';
import { Typography, Card, Table, Tag, Space, Button } from 'antd';
import { DollarOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const PricingManagementPage: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Pricing & Fare Management</Title>
                    <Text type="secondary">Configure base fares, distance rates, and surge pricing multipliers.</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>Create New Fare Rule</Button>
            </div>

            <Card bordered={false} className="shadow-sm rounded-2xl">
                <Table 
                    columns={[
                        { title: 'Service Type', dataIndex: 'service', key: 'service' },
                        { title: 'Base Fare', dataIndex: 'base', key: 'base' },
                        { title: 'Per KM', dataIndex: 'perKm', key: 'perKm' },
                        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="green">{s}</Tag> },
                        { title: 'Action', key: 'action', render: () => <Button type="link">Edit</Button> }
                    ]}
                    dataSource={[
                        { key: '1', service: 'Ride Hailing (Standard)', base: '$2.50', perKm: '$0.80', status: 'Active' },
                        { key: '2', service: 'Food Delivery', base: '$1.00', perKm: '$0.30', status: 'Active' },
                    ]}
                />
            </Card>
        </div>
    );
};
