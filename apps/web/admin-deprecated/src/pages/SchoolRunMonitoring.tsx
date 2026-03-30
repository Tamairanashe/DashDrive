import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Typography, Row, Col, Statistic, Progress, Drawer, Modal, Button, List, Timeline, Badge, Avatar, message } from 'antd';
import { SafetyCertificateOutlined, TeamOutlined, CheckCircleOutlined, AlertOutlined, CarOutlined, PhoneOutlined, BankOutlined, HomeOutlined, EyeOutlined, CompassOutlined, UserOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { MarkerF, PolylineF, OverlayViewF, OverlayView } from '@react-google-maps/api';
import { BaseMap, useBaseMap } from '../components/BaseMap';

const DriverMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '32px', height: '32px', background: '#fff', border: '3px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
    </OverlayViewF>
);

const PickupMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '24px', height: '24px', background: '#0f172a', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
    </OverlayViewF>
);

const SchoolMarker = ({ position }: { position: google.maps.LatLngLiteral }) => (
    <OverlayViewF position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
        <div style={{ transform: 'translate(-50%, -50%)', width: '24px', height: '24px', background: '#3b82f6', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
    </OverlayViewF>
);

const MapFitter = ({ bounds }: { bounds: google.maps.LatLngLiteral[] | null }) => {
    const { map } = useBaseMap();
    useEffect(() => {
        if (map && bounds && bounds.length > 0) {
            const gBounds = new google.maps.LatLngBounds();
            bounds.forEach(p => gBounds.extend(p));
            map.fitBounds(gBounds, { top: 50, right: 50, bottom: 50, left: 50 });
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
            route: [{lat: -17.8200, lng: 31.0500}, {lat: -17.8210, lng: 31.0510}, {lat: -17.8220, lng: 31.0520}, {lat: -17.8300, lng: 31.0600}]
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
            route: [{lat: -17.8200, lng: 31.0500}, {lat: -17.8220, lng: 31.0520}, {lat: -17.8250, lng: 31.0550}, {lat: -17.8300, lng: 31.0600}]
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
            route: [{lat: -17.8000, lng: 31.0333}, {lat: -17.7750, lng: 31.0700}, {lat: -17.7505, lng: 31.1005}, {lat: -17.7500, lng: 31.1000}]
        },
    ];

    const mapBounds: google.maps.LatLngLiteral[] | null = selectedRun ? [
        { lat: selectedRun.pickup.lat, lng: selectedRun.pickup.lng },
        { lat: selectedRun.schoolLoc.lat, lng: selectedRun.schoolLoc.lng },
        { lat: selectedRun.driver.lat, lng: selectedRun.driver.lng }
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
                    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
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
                            <BaseMap center={[selectedRun.driver.lat, selectedRun.driver.lng]} zoom={13} height={400}>
                                <MapFitter bounds={mapBounds} />
                                <DriverMarker position={{ lat: selectedRun.driver.lat, lng: selectedRun.driver.lng }} />
                                <PickupMarker position={{ lat: selectedRun.pickup.lat, lng: selectedRun.pickup.lng }} />
                                <SchoolMarker position={{ lat: selectedRun.schoolLoc.lat, lng: selectedRun.schoolLoc.lng }} />
                                <PolylineF 
                                    path={selectedRun.route} 
                                    options={{ 
                                        strokeColor: "#3b82f6", 
                                        strokeWeight: 3, 
                                        strokeOpacity: 0.6,
                                        icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '20px' }]
                                    }} 
                                />
                            </BaseMap>
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

