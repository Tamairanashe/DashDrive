import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Row, Col, Tabs, Space, message } from 'antd';
import { PictureOutlined, AppstoreAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title, Text } = Typography;

export const AppCMSPage: React.FC = () => {
    const [banners, setBanners] = useState<any[]>([]);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock CMS data
        setBanners([
            { id: 'BAN-1', title: 'Summer Promo', vertical: 'FOOD', isActive: true, displayOrder: 1 },
            { id: 'BAN-2', title: 'Free Delivery Month', vertical: 'MART', isActive: true, displayOrder: 2 }
        ]);
        setBlocks([
            { id: 'BLK-1', title: 'Trending Restaurants', type: 'CAROUSEL', vertical: 'FOOD', isActive: true },
            { id: 'BLK-2', title: 'Daily Essentials', type: 'GRID', vertical: 'MART', isActive: true }
        ]);
    }, []);

    const bannerColumns = [
        { title: 'Banner Title', dataIndex: 'title', key: 'title', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Vertical', dataIndex: 'vertical', key: 'vertical', render: (t: string) => <Tag color="blue">{t}</Tag> },
        { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Hidden'}</Tag> },
        { title: 'Order', dataIndex: 'displayOrder', key: 'displayOrder' },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => message.info(`Edit banner`)}>Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => message.warning(`Delete banner`)} />
                </Space>
            ),
        },
    ];

    const blockColumns = [
        { title: 'Block Title', dataIndex: 'title', key: 'title', render: (text: string) => <Text strong>{text}</Text> },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
        { title: 'Vertical', dataIndex: 'vertical', key: 'vertical', render: (t: string) => <Tag color="blue">{t}</Tag> },
        { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Hidden'}</Tag> },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => message.info(`Edit block`)}>Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => message.warning(`Delete block`)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Content Management System</Title>
                    <Text type="secondary">Manage app banners, home feed blocks, and promotional content.</Text>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab={<span><PictureOutlined /> App Banners</span>} key="1">
                    <Card bordered={false} className="shadow-sm" extra={<Button type="primary" icon={<AppstoreAddOutlined />}>Add Banner</Button>}>
                        <Table columns={bannerColumns} dataSource={banners} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
                    </Card>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span><AppstoreAddOutlined /> Content Blocks</span>} key="2">
                    <Card bordered={false} className="shadow-sm" extra={<Button type="primary" icon={<AppstoreAddOutlined />}>Add Content Block</Button>}>
                        <Table columns={blockColumns} dataSource={blocks} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
                    </Card>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
