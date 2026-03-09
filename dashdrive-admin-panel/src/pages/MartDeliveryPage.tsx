import React, { useState } from 'react';
import { Typography, Tabs, Card, Table, Tag, Badge, Space, Button, Select, Divider, Row, Col, Statistic } from 'antd';
import { 
    ShopOutlined, 
    AppstoreOutlined, 
    SyncOutlined, 
    ShoppingCartOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    ReloadOutlined,
    DollarOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { MartVendorManagement } from '../components/MartVendorManagement';
import { MartServiceRules } from '../components/MartServiceRules';

const { Title, Text } = Typography;

export const MartDeliveryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('vendors');
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    // Mock Data Sets
    const mockVendors = [
        { id: 'M-101', name: 'Fresh Choice Supermarket', location: 'Avondale', items: 1250, status: 'Active', rating: 4.8 },
        { id: 'M-102', name: 'OK Mart', location: 'Belvedere', items: 4500, status: 'Active', rating: 4.5 },
        { id: 'M-103', name: 'Village Grocer', location: 'Borrowdale', items: 850, status: 'Offline', rating: 4.9 },
    ];

    const mockCatalog = [
        { id: 'P-991', name: 'Irvines Farm Eggs (30 pack)', category: 'Dairy & Eggs', vendor: 'Fresh Choice', price: 6.50, stock: 45 },
        { id: 'P-992', name: 'Zambezi Lager (6 pack)', category: 'Beverages', vendor: 'OK Mart', price: 8.00, stock: 120 },
        { id: 'P-993', name: 'Tanganda Tea Leaves (500g)', category: 'Pantry', vendor: 'Village Grocer', price: 4.25, stock: 12 },
    ];

    const mockSyncStatus = [
        { id: 'SYNC-1', vendor: 'OK Mart', integrationType: 'Square POS', lastSync: '2 mins ago', status: 'Healthy', itemsUpdate: '+12, -4' },
        { id: 'SYNC-2', vendor: 'Fresh Choice Supermarket', integrationType: 'Vend POS', lastSync: '1 hour ago', status: 'Warning', itemsUpdate: 'Failed mapping' },
        { id: 'SYNC-3', vendor: 'Village Grocer', integrationType: 'Custom API', lastSync: '10 sec ago', status: 'Healthy', itemsUpdate: 'Stock verified' },
    ];

    const mockOrders = [
        { id: 'ORD-5412', customer: 'Sarah M.', vendor: 'OK Mart', items: 14, total: 45.50, status: 'Picking', time: '10:15 AM' },
        { id: 'ORD-5413', customer: 'David C.', vendor: 'Fresh Choice', items: 3, total: 12.00, status: 'Out for Delivery', time: '09:45 AM' },
        { id: 'ORD-5415', customer: 'Nyasha K.', vendor: 'Village Grocer', items: 25, total: 110.20, status: 'Pending', time: '10:30 AM' },
    ];

    const handleManualSync = (id: string) => {
        setIsSyncing(id);
        setTimeout(() => setIsSyncing(null), 2000); // Mock sync delay
    };

    return (
        <div style={{ maxWidth: 1600, margin: '0 auto', paddingBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Grocery & Mart Delivery</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>Manage retail partners, aisle catalogs, live inventory syncing, and parcel logistics.</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Grocery Orders" 
                            value={342} 
                            prefix={<ShoppingCartOutlined style={{ color: '#1677ff' }} />} 
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Partner Stores" 
                            value={48} 
                            prefix={<ShopOutlined style={{ color: '#52c41a' }} />} 
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="SKU Sync Health" 
                            value={98.5} 
                            precision={1}
                            suffix="%" 
                            prefix={<SyncOutlined style={{ color: '#faad14' }} />} 
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic 
                            title="Avg. Basket Value" 
                            value={65.20} 
                            precision={2}
                            prefix={<DollarOutlined style={{ color: '#722ed1' }} />} 
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16, overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab} 
                    size="large"
                    tabBarStyle={{ padding: '16px 24px 0 24px', margin: 0, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
                >
                    <Tabs.TabPane tab={<span><ShopOutlined /> Mart Vendors</span>} key="vendors">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Partner Supermarkets & Stores</Title>
                                    <Text type="secondary" style={{ fontSize: 15 }}>Onboard and manage active grocery retail locations.</Text>
                                </div>
                            </div>
                            <MartVendorManagement />
                        </div>
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane tab={<span><AppstoreOutlined /> Product Catalog</span>} key="catalog">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Global Aisle Master Catalog</Title>
                                    <Text type="secondary" style={{ fontSize: 15 }}>Review and approve items sold across all retail partners.</Text>
                                </div>
                                <Space>
                                    <Select defaultValue="All Stores" style={{ width: 150 }} options={[{value: 'All Stores', label: 'All Stores'}, {value: 'OK Mart', label: 'OK Mart'}]} />
                                    <Select defaultValue="All Aisles" style={{ width: 150 }} options={[{value: 'All Aisles', label: 'All Aisles'}, {value: 'Dairy', label: 'Dairy & Eggs'}]} />
                                </Space>
                            </div>
                            <Table 
                                dataSource={mockCatalog}
                                rowKey="id"
                                columns={[
                                    { title: 'SKU / ID', dataIndex: 'id', key: 'id', render: (t) => <Text type="secondary">{t}</Text> },
                                    { title: 'Product Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                                    { title: 'Category (Aisle)', dataIndex: 'category', key: 'category', render: (t) => <Tag>{t}</Tag> },
                                    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
                                    { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => `$${p.toFixed(2)}` },
                                    { title: 'Stock Level', dataIndex: 'stock', key: 'stock', render: (s) => <span style={{ color: s < 20 ? 'red' : 'inherit' }}>{s} units</span> },
                                    { title: 'Actions', key: 'actions', render: () => <Button type="link" size="small">Edit Details</Button> }
                                ]}
                            />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><SyncOutlined /> Inventory Sync</span>} key="inventory">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <Title level={5}>Live POS Integrations</Title>
                                    <Text type="secondary">Monitor the health of third-party POS stock synchronization hooks.</Text>
                                </div>
                            </div>
                            <Table 
                                dataSource={mockSyncStatus}
                                rowKey="id"
                                columns={[
                                    { title: 'Vendor Endpoint', dataIndex: 'vendor', key: 'vendor', render: (t) => <Text strong>{t}</Text> },
                                    { title: 'Integration Type', dataIndex: 'integrationType', key: 'integrationType', render: (t) => <Tag color="blue">{t}</Tag> },
                                    { title: 'Last Sync', dataIndex: 'lastSync', key: 'lastSync' },
                                    { title: 'Payload Data', dataIndex: 'itemsUpdate', key: 'itemsUpdate' },
                                    { 
                                        title: 'Health', 
                                        dataIndex: 'status', 
                                        key: 'status', 
                                        render: (status) => status === 'Healthy' 
                                            ? <Tag icon={<CheckCircleOutlined />} color="success">Healthy Sync</Tag> 
                                            : <Tag icon={<WarningOutlined />} color="warning">Fix Required</Tag> 
                                    },
                                    { 
                                        title: 'Actions', 
                                        key: 'actions', 
                                        render: (_, record) => (
                                            <Button 
                                                type="default" 
                                                size="small" 
                                                icon={<ReloadOutlined />} 
                                                loading={isSyncing === record.id}
                                                onClick={() => handleManualSync(record.id)}
                                            >
                                                Force Sync
                                            </Button>
                                        ) 
                                    }
                                ]}
                            />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><ShoppingCartOutlined /> Live Orders</span>} key="orders">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <div style={{ marginBottom: 16 }}>
                                <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Active Grocery Dispatches</Title>
                                <Text type="secondary" style={{ fontSize: 15 }}>Monitor live consumer cart deliveries in real-time.</Text>
                            </div>
                            <Table 
                                dataSource={mockOrders}
                                rowKey="id"
                                columns={[
                                    { title: 'Order ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong>{t}</Text> },
                                    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                                    { title: 'Fulfilling Mart', dataIndex: 'vendor', key: 'vendor' },
                                    { title: 'Cart Size', dataIndex: 'items', key: 'items', render: (i) => `${i} items` },
                                    { title: 'Total', dataIndex: 'total', key: 'total', render: (t) => <Text strong>${t.toFixed(2)}</Text> },
                                    { 
                                        title: 'Status', 
                                        dataIndex: 'status', 
                                        key: 'status', 
                                        render: (status) => {
                                            let color = 'blue';
                                            if (status === 'Out for Delivery') color = 'purple';
                                            if (status === 'Pending') color = 'orange';
                                            return <Badge color={color} text={status} />;
                                        } 
                                    },
                                    { title: 'Placed At', dataIndex: 'time', key: 'time' },
                                    { title: 'Actions', key: 'actions', render: () => <Button type="link" size="small">View Receipt & Tracking</Button> }
                                ]}
                            />
                        </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><SettingOutlined /> Service Rules</span>} key="settings">
                        <div style={{ padding: 24, minHeight: 'calc(100vh - 280px)' }}>
                            <MartServiceRules />
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
