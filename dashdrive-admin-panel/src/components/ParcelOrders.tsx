import React, { useState } from 'react';
import { 
    Table, 
    Tag, 
    Badge, 
    Button, 
    Input, 
    Space, 
    Typography, 
    Card, 
    Drawer, 
    Descriptions, 
    Divider,
    Avatar,
    Tooltip,
    Row,
    Col,
    Modal,
    Alert
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    DownloadOutlined,
    EyeOutlined,
    EnvironmentOutlined,
    UserOutlined,
    InboxOutlined,
    FieldTimeOutlined,
    CheckCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { MapPreview } from './MapPreview';

const { Text, Title } = Typography;

interface ParcelOrder {
    id: string;
    sender: { name: string; phone: string; location: string; coords: [number, number] };
    receiver: { name: string; phone: string; location: string; coords: [number, number] };
    category: string;
    weight: string;
    type: 'Standard' | 'Express';
    courier: { name: string; id: string; avatar: string; coords?: [number, number] } | null;
    status: 'Pending' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Failed' | 'Cancelled' | 'Bidding';
    fee: string;
    sysRecFare: number;
    proposedFare: number;
    bids: number;
    time: string;
    paymentMethod: 'Wallet' | 'Cash' | 'PayLater';
}

const mockOrders: ParcelOrder[] = [
    {
        id: 'PRC-9001',
        sender: { name: 'Alex Johnson', phone: '+880 1712 345678', location: 'Gulshan 2, Road 45', coords: [23.7949, 90.4143] },
        receiver: { name: 'Sarah Miller', phone: '+880 1822 998877', location: 'Banani, Block E', coords: [23.7937, 90.4066] },
        category: 'Electronics',
        weight: '1.2 kg',
        type: 'Express',
        courier: { name: 'Rahat Khan', id: 'DRV-401', avatar: 'https://i.pravatar.cc/150?u=rahat' },
        status: 'In Transit',
        fee: '$12.40',
        sysRecFare: 14.00,
        proposedFare: 12.40,
        bids: 5,
        time: '12 mins ago',
        paymentMethod: 'Wallet'
    },
    {
        id: 'PRC-9002',
        sender: { name: 'Michael Chen', phone: '+880 1610 554433', location: 'Dhanmondi 32', coords: [23.7509, 90.3789] },
        receiver: { name: 'Emma Wilson', phone: '+880 1515 112233', location: 'Uttara Sector 7', coords: [23.8759, 90.3795] },
        category: 'Documents',
        weight: '0.4 kg',
        type: 'Standard',
        courier: null,
        status: 'Bidding',
        fee: '$4.50',
        sysRecFare: 6.00,
        proposedFare: 4.50,
        bids: 3,
        time: '45 mins ago',
        paymentMethod: 'Cash'
    },
    {
        id: 'PRC-9003',
        sender: { name: 'IKEA Global', phone: '+880 1999 887766', location: 'Tejgaon Industrial Area', coords: [23.7685, 90.3995] },
        receiver: { name: 'Home Essentials', phone: '+880 1333 445566', location: 'Mirpur 10', coords: [23.8069, 90.3687] },
        category: 'Heavy Goods',
        weight: '18.5 kg',
        type: 'Express',
        courier: { name: 'Sabbir Hossain', id: 'DRV-102', avatar: 'https://i.pravatar.cc/150?u=sabbir' },
        status: 'Picked Up',
        fee: '$42.00',
        sysRecFare: 45.00,
        proposedFare: 42.00,
        bids: 1,
        time: '1h ago',
        paymentMethod: 'PayLater'
    }
];

export const ParcelOrders: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<ParcelOrder | null>(null);
    const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);

    const getStatusBadge = (status: ParcelOrder['status']) => {
        switch (status) {
            case 'Picked Up':
                return <Tag icon={<InboxOutlined />} color="blue">ðŸ“¦ Picked Up</Tag>;
            case 'In Transit':
                return <Tag icon={<SyncOutlined spin />} color="processing">ðŸšš In Transit</Tag>;
            case 'Delivered':
                return <Tag icon={<CheckCircleOutlined />} color="success">âœ… Delivered</Tag>;
            case 'Bidding':
                return <Tag color="blue">ðŸ¤ Bidding</Tag>;
            case 'Pending':
                return <Badge status="warning" text="Pending" />;
            case 'Assigned':
                return <Badge status="processing" text="Assigned" />;
            case 'Cancelled':
                return <Badge status="error" text="Cancelled" />;
            default:
                return <Badge status="default" text={status} />;
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Pickup',
            dataIndex: ['sender', 'name'],
            key: 'pickup',
            render: (name: string, record: ParcelOrder) => (
                <Tooltip title={record.sender.location}>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 13 }}>{name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.sender.location}</Text>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Dropoff',
            dataIndex: ['receiver', 'name'],
            key: 'dropoff',
            render: (name: string, record: ParcelOrder) => (
                <Tooltip title={record.receiver.location}>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 13 }}>{name}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.receiver.location}</Text>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Package / Weight',
            key: 'attributes',
            render: (_: any, record: ParcelOrder) => (
                <Space direction="vertical" size={0}>
                    <Tag color="cyan" style={{ margin: 0 }}>{record.category}</Tag>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.weight}</Text>
                </Space>
            )
        },
        {
            title: 'Proposed Fare',
            key: 'fare',
            render: (_: any, record: ParcelOrder) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ color: '#10b981' }}>${record.proposedFare.toFixed(2)}</Text>
                    <Text delete type="secondary" style={{ fontSize: 10 }}>${record.sysRecFare.toFixed(2)}</Text>
                </Space>
            ),
        },
        {
            title: 'Bids',
            dataIndex: 'bids',
            key: 'bids',
            render: (bids: number) => <Badge count={bids} color="#1890ff" />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: ParcelOrder['status']) => getStatusBadge(status),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ParcelOrder) => (
                <Space>
                    <Button 
                        type="link" 
                        size="small"
                        icon={<EyeOutlined />} 
                        onClick={() => setSelectedOrder(record)}
                    >
                        Details
                    </Button>
                    {record.status === 'Bidding' && (
                        <Button 
                            type="primary" 
                            size="small"
                            onClick={() => {
                                setSelectedOrder(record);
                                setIsBidsModalOpen(true);
                            }}
                        >
                            Review Bids
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col>
                    <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Live Dispatch Operations</Title>
                    <Text type="secondary" style={{ fontSize: 15 }}>Monitor real-time courier movement, manage counter-offers, and oversee shipment fulfillment</Text>
                </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Space size="middle">
                    <Input
                        placeholder="Search by ID, Sender, Courier..."
                        prefix={<SearchOutlined />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: 400 }}
                    />
                    <Button icon={<FilterOutlined />}>Filters</Button>
                </Space>
                <Space>
                    <Button icon={<ReloadOutlined />}>Refresh</Button>
                    <Button type="primary" icon={<DownloadOutlined />}>Export Manifest</Button>
                </Space>
            </div>

            <Table 
                columns={columns} 
                dataSource={mockOrders} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                className="custom-table"
            />

            <Drawer
                title={`Order Details: ${selectedOrder?.id}`}
                placement="right"
                width={600}
                onClose={() => setSelectedOrder(null)}
                open={!!selectedOrder && !isBidsModalOpen}
            >
                {selectedOrder && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ height: 250, borderRadius: 12, overflow: 'hidden' }}>
                            <MapPreview
                                type="order-route"
                                data={{
                                    restaurant: { lat: selectedOrder.sender.coords[0], lng: selectedOrder.sender.coords[1], address: selectedOrder.sender.location },
                                    customer: { lat: selectedOrder.receiver.coords[0], lng: selectedOrder.receiver.coords[1], address: selectedOrder.receiver.location },
                                    restaurantName: selectedOrder.sender.name,
                                    customerName: selectedOrder.receiver.name
                                }}
                                label={`Parcel ID ${selectedOrder.id}`}
                            />
                        </div>

                        <Card size="small" title="Bidding Analysis">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Rider Bid">
                                            <Text strong style={{ color: '#10b981', fontSize: 18 }}>${selectedOrder.proposedFare.toFixed(2)}</Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col span={8}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="System Rec.">
                                            <Text type="secondary">${selectedOrder.sysRecFare.toFixed(2)}</Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col span={8}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Active Bids">
                                            <Badge count={selectedOrder.bids} color="#1890ff" />
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        </Card>

                        <Card size="small" title="Logistics Nodes">
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label={<span><EnvironmentOutlined /> Sender</span>}>
                                    <Text strong>{selectedOrder.sender.name}</Text>
                                    <br />
                                    <Text type="secondary">{selectedOrder.sender.location}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<span><EnvironmentOutlined /> Receiver</span>}>
                                    <Text strong>{selectedOrder.receiver.name}</Text>
                                    <br />
                                    <Text type="secondary">{selectedOrder.receiver.location}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card size="small" title="Package Information">
                            <Descriptions column={2} bordered size="small">
                                <Descriptions.Item label="Category">{selectedOrder.category}</Descriptions.Item>
                                <Descriptions.Item label="Weight">{selectedOrder.weight}</Descriptions.Item>
                                <Descriptions.Item label="Service Type">{selectedOrder.type}</Descriptions.Item>
                                <Descriptions.Item label="Payment">{selectedOrder.paymentMethod}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card size="small" title="Courier Status">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    {selectedOrder.courier ? (
                                        <>
                                            <Avatar size="large" src={selectedOrder.courier.avatar} />
                                            <div>
                                                <Text strong>{selectedOrder.courier.name}</Text>
                                                <br />
                                                <Text type="secondary">ID: {selectedOrder.courier.id}</Text>
                                            </div>
                                        </>
                                    ) : (
                                        <Text type="danger">No courier assigned yet</Text>
                                    )}
                                </Space>
                                {getStatusBadge(selectedOrder.status)}
                            </div>
                        </Card>

                        <Divider />

                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button danger>Cancel Parcel</Button>
                            {selectedOrder.status === 'Bidding' ? (
                                <Button type="primary" onClick={() => setIsBidsModalOpen(true)}>Manage Bids</Button>
                            ) : (
                                <Button type="primary">Reassign Courier</Button>
                            )}
                        </Space>
                    </Space>
                )}
            </Drawer>

            <Modal 
                title={selectedOrder ? `Bids for Parcel ${selectedOrder.id}` : 'Manage Bids'} 
                open={isBidsModalOpen} 
                onCancel={() => setIsBidsModalOpen(false)} 
                footer={[<Button key="close" onClick={() => setIsBidsModalOpen(false)}>Close</Button>]}
                width={700}
            >
                {selectedOrder && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Alert 
                            message="Bidding Model Active" 
                            description={`Rider has proposed $${selectedOrder.proposedFare.toFixed(2)}. System recommendation was $${selectedOrder.sysRecFare.toFixed(2)}.`}
                            type="info"
                            showIcon
                        />
                        <Table 
                            dataSource={[
                                { id: 'b1', name: 'Tendai M.', vehicle: 'Delivery Van', bid: selectedOrder.proposedFare + 1.5, eta: '5 min' },
                                { id: 'b2', name: 'James K.', vehicle: 'Motorbike', bid: selectedOrder.proposedFare + 0.5, eta: '3 min' },
                                { id: 'b3', name: 'Sarah L.', vehicle: 'Electric Scooter', bid: selectedOrder.proposedFare, eta: '8 min' },
                            ]}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            columns={[
                                { title: 'Driver', dataIndex: 'name', render: (t) => <Text strong>{t}</Text> },
                                { title: 'Vehicle', dataIndex: 'vehicle' },
                                { title: 'ETA', dataIndex: 'eta' },
                                { title: 'Counter-Offer', dataIndex: 'bid', render: (val: number) => <Text strong color="#1890ff">${val.toFixed(2)}</Text> },
                                { title: 'Action', key: 'action', render: () => <Button type="primary" size="small">Force Accept</Button> }
                            ]}
                        />
                    </Space>
                )}
            </Modal>
        </div>
    );
};

