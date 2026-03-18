import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Typography, Row, Col, Statistic, Progress, Drawer, Modal, Button, List, Timeline, Badge, Avatar } from 'antd';
import { SafetyCertificateOutlined, TeamOutlined, CheckCircleOutlined, AlertOutlined, CarOutlined, PhoneOutlined, BankOutlined, HomeOutlined, EyeOutlined, CompassOutlined, UserOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.DivIcon({
    className: 'driver-marker',
    html: `<div style="width: 32px; height: 32px; background: #fff; border: 3px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const pickupIcon = new L.DivIcon({
    className: 'pickup-marker',
    html: `<div style="width: 24px; height: 24px; background: #0f172a; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const schoolIcon = new L.DivIcon({
    className: 'school-marker',
    html: `<div style="width: 24px; height: 24px; background: #3b82f6; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const MapFitter = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            // Invalidate size to fix rendering issues in Modals
            setTimeout(() => map.invalidateSize(), 300);
        }
    }, [bounds, map]);
    return null;
};

const { Title, Text } = Typography;

const SchoolRunMonitoring = () => {
    const [stats] = useState({
        activeSubscriptions: 124,
        totalRunsToday: 86,
        completedRuns: 72,
        fulfillmentRate: 83.7,
        safetyAlerts: 0
    });

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [trackingVisible, setTrackingVisible] = useState(false);
    const [selectedRun, setSelectedRun] = useState<any>(null);

    const handleViewDetails = (record: any) => {
        setSelectedRun(record);
        setDetailsVisible(true);
    };

    const handleTrackLive = (record: any) => {
        setSelectedRun(record);
        setTrackingVisible(true);
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'School',
            dataIndex: 'school',
            key: 'school',
        },
        {
            title: 'Parent',
            dataIndex: 'parent',
            key: 'parent',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'green' : 'gold'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Last Activity',
            dataIndex: 'lastActivity',
            key: 'lastActivity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => handleViewDetails(record)}><EyeOutlined /> View Details</a>
                    <a onClick={() => handleTrackLive(record)}><CompassOutlined /> Track Live</a>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            studentName: 'Zoe Chit',
            school: 'St. Andrews Primary',
            parent: 'Tamitoy',
            status: 'Active',
            lastActivity: 'Dropped off safely - 08:15 AM',
            pickup: { lat: -17.8200, lng: 31.0500 },
            schoolLoc: { lat: -17.8300, lng: 31.0600 },
            driver: { lat: -17.8220, lng: 31.0520 },
            route: [[-17.8200, 31.0500], [-17.8210, 31.0510], [-17.8220, 31.0520], [-17.8300, 31.0600]]
        },
        {
            key: '2',
            studentName: 'Ethan Chit',
            school: 'St. Andrews Primary',
            parent: 'Tamitoy',
            status: 'Active',
            lastActivity: 'In Transit',
            pickup: { lat: -17.8200, lng: 31.0500 },
            schoolLoc: { lat: -17.8300, lng: 31.0600 },
            driver: { lat: -17.8250, lng: 31.0550 },
            route: [[-17.8200, 31.0500], [-17.8220, 31.0520], [-17.8250, 31.0550], [-17.8300, 31.0600]]
        },
        {
            key: '3',
            studentName: 'Sarah Jenkins',
            school: 'Westfield High',
            parent: 'Michael J.',
            status: 'Pending PIN',
            lastActivity: 'Arrived at School',
            pickup: { lat: -17.8000, lng: 31.0333 },
            schoolLoc: { lat: -17.7500, lng: 31.1000 },
            driver: { lat: -17.7505, lng: 31.1005 },
            route: [[-17.8000, 31.0333], [-17.7750, 31.0700], [-17.7505, 31.1005], [-17.7500, 31.1000]]
        },
    ];

    const mapBounds: L.LatLngBoundsExpression | null = selectedRun ? [
        [selectedRun.pickup.lat, selectedRun.pickup.lng],
        [selectedRun.schoolLoc.lat, selectedRun.schoolLoc.lng],
        [selectedRun.driver.lat, selectedRun.driver.lng]
    ] : null;

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>School Run Monitoring</Title>
            
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Subscriptions"
                            value={stats.activeSubscriptions}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Daily Fulfillment"
                            value={stats.fulfillmentRate}
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <Progress percent={stats.fulfillmentRate} showInfo={false} strokeColor="#3f8600" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Safety Alerts"
                            value={stats.safetyAlerts}
                            prefix={<AlertOutlined />}
                            valueStyle={{ color: stats.safetyAlerts > 0 ? '#cf1322' : '#d9d9d9' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Verified Drivers"
                            value={42}
                            prefix={<SafetyCertificateOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Live Subscriptions & Fulfillment">
                <Table columns={columns} dataSource={data} />
            </Card>

            {/* View Details Drawer */}
            <Drawer
                title="School Run Details"
                placement="right"
                width={500}
                onClose={() => setDetailsVisible(false)}
                open={detailsVisible}
            >
                {selectedRun && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card size="small" title="Trip Information">
                            <List size="small">
                                <List.Item><Text type="secondary"><UserOutlined /> Student:</Text> <Text strong>{selectedRun.studentName}</Text></List.Item>
                                <List.Item><Text type="secondary"><BankOutlined /> School:</Text> <Text strong>{selectedRun.school}</Text></List.Item>
                                <List.Item><Text type="secondary"><HomeOutlined /> Parent:</Text> <Text strong>{selectedRun.parent}</Text></List.Item>
                                <List.Item><Text type="secondary"><ClockCircleOutlined /> Last Status:</Text> <Tag color="blue">{selectedRun.status}</Tag></List.Item>
                            </List>
                        </Card>

                        <Card size="small" title="Driver Information">
                            <Space align="center">
                                <Avatar size={48} icon={<UserOutlined />} />
                                <div style={{ marginLeft: 12 }}>
                                    <Text strong>John Doe</Text>
                                    <br />
                                    <Tag color="green">VETTED DRIVER</Tag>
                                </div>
                                <Button icon={<PhoneOutlined />} type="link">Call Driver</Button>
                            </Space>
                        </Card>

                        <Card size="small" title="Safety Checklist Tracking">
                            <Timeline
                                items={[
                                    { color: 'green', children: 'Student Identity Verified (07:45 AM)' },
                                    { color: 'green', children: 'Seatbelt Fastened (07:46 AM)' },
                                    { color: 'green', children: 'Safety Locks Engaged (07:46 AM)' },
                                    { color: 'blue', children: 'In Transit (07:48 AM)' },
                                    { dot: <ClockCircleOutlined />, children: 'Arriving at School (Est. 08:10 AM)' },
                                ]}
                            />
                        </Card>
                    </Space>
                )}
            </Drawer>

            {/* Live Tracking Modal */}
            <Modal
                title={`Live Tracking: ${selectedRun?.studentName}`}
                open={trackingVisible}
                onCancel={() => setTrackingVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setTrackingVisible(false)}>Close</Button>,
                    <Button key="emergency" type="primary" danger icon={<AlertOutlined />}>Emergency Alert</Button>
                ]}
                width={800}
            >
                <div style={{ padding: '20px', background: '#f0f2f5', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ height: '400px', background: '#e6f7ff', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        {selectedRun && (
                            <MapContainer center={[selectedRun.driver.lat, selectedRun.driver.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                                <MapFitter bounds={mapBounds} />
                                <Marker position={[selectedRun.driver.lat, selectedRun.driver.lng]} icon={driverIcon} />
                                <Marker position={[selectedRun.pickup.lat, selectedRun.pickup.lng]} icon={pickupIcon} />
                                <Marker position={[selectedRun.schoolLoc.lat, selectedRun.schoolLoc.lng]} icon={schoolIcon} />
                                <Polyline positions={selectedRun.route} color="#3b82f6" weight={3} opacity={0.6} dashArray="10, 10" />
                            </MapContainer>
                        )}
                        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                            <Tag color="blue" icon={<SyncOutlined spin />}>Live GPS Streaming</Tag>
                        </div>
                    </div>
                    
                    <Row gutter={16} style={{ marginTop: '20px' }}>
                        <Col span={8}>
                            <Statistic title="Current Speed" value={35} suffix="km/h" />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Est. Arrival" value="08:10" suffix="AM" />
                        </Col>
                        <Col span={8}>
                            <Statistic title="GPS Signal" value="Strong" prefix={<Badge status="processing" color="green" />} />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default SchoolRunMonitoring;
