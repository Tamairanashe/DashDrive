import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Row, Col, Drawer, Space, Descriptions, Switch, message } from 'antd';
import { BuildOutlined, SettingOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title, Text } = Typography;

export const EnterpriseSetupPage: React.FC = () => {
    const [enterprises, setEnterprises] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch enterprises
        setEnterprises([
            { id: 'ENT-001', name: 'Acme Corp', adminEmail: 'admin@acme.com', isActive: true, createdAt: new Date().toISOString() },
            { id: 'ENT-002', name: 'Global Logistics', adminEmail: 'contact@globallogistics.com', isActive: true, createdAt: new Date().toISOString() }
        ]);
    }, []);

    const columns = [
        { title: 'Enterprise Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Admin Email', dataIndex: 'adminEmail', key: 'adminEmail' },
        { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag> },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button size="small" icon={<SettingOutlined />} onClick={() => message.info(`Manage ${record.name}`)}>
                    Manage
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Enterprise Setup</Title>
                    <Text type="secondary">Manage top-level enterprise clients and organizational units.</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<BuildOutlined />}>Add Enterprise</Button>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Table 
                    columns={columns} 
                    dataSource={enterprises} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }} 
                    loading={loading}
                />
            </Card>
        </div>
    );
};
