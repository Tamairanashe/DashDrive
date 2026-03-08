import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, Table, Button, Tag, Space, Modal, Form, Input, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, CarOutlined, SettingOutlined, SolutionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const VehicleManagementPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [attributes, setAttributes] = useState<any[]>([]);
    
    useEffect(() => {
        setTimeout(() => {
            setVehicles([
                { id: 'V-100', driver: 'John Doe', type: 'Motorcycle', plate: 'AB-123', status: 'Active' },
                { id: 'V-101', driver: 'Jane Smith', type: 'Sedan', plate: 'XYZ-987', status: 'Maintenance' },
            ]);
            setRequests([
                { id: 'REQ-1', driver: 'Bob Lee', type: 'Van', plate: 'VAN-001', submitted: '2026-03-05' }
            ]);
            setAttributes([
                { id: 1, name: 'Sedan', capacity: '4 Passengers', cargo: 'Standard Trunk' },
                { id: 2, name: 'Motorcycle', capacity: '1 Passenger', cargo: 'Delivery Box' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Vehicle & Fleet Management</Title>
                    <Text type="secondary">Manage driver vehicles, review incoming requests, and define asset classes.</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />}>Add Vehicle</Button>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab={<span><CarOutlined /> Active Vehicles</span>} key="1">
                        <Table 
                            loading={loading}
                            dataSource={vehicles} 
                            rowKey="id"
                            columns={[
                                { title: 'ID', dataIndex: 'id' },
                                { title: 'Driver', dataIndex: 'driver', render: (t) => <strong>{t}</strong> },
                                { title: 'Type', dataIndex: 'type' },
                                { title: 'License Plate', dataIndex: 'plate' },
                                { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'Active' ? 'green' : 'orange'}>{s}</Tag> },
                                { title: 'Action', render: () => <Space><Button size="small" icon={<EditOutlined />}/></Space>}
                            ]}
                        />
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane tab={<span><SolutionOutlined /> Pending Requests</span>} key="2">
                        <Table 
                            loading={loading}
                            dataSource={requests} 
                            rowKey="id"
                            locale={{ emptyText: <Empty description="No Pending Vehicle Requests" /> }}
                            columns={[
                                { title: 'Driver', dataIndex: 'driver' },
                                { title: 'Type', dataIndex: 'type' },
                                { title: 'Plate', dataIndex: 'plate' },
                                { title: 'Submitted', dataIndex: 'submitted' },
                                { title: 'Action', render: () => (
                                    <Space>
                                        <Button size="small" type="primary" icon={<CheckCircleOutlined />}>Approve</Button>
                                        <Button size="small" danger icon={<CloseCircleOutlined />}>Reject</Button>
                                    </Space>
                                )}
                            ]}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><SettingOutlined /> Attributes Master</span>} key="3">
                         <Table 
                            loading={loading}
                            dataSource={attributes} 
                            rowKey="id"
                            columns={[
                                { title: 'Class Name', dataIndex: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Passenger Cap', dataIndex: 'capacity' },
                                { title: 'Cargo Def', dataIndex: 'cargo' },
                                { title: 'Action', render: () => <Space><Button size="small" icon={<EditOutlined />}/><Button size="small" danger icon={<DeleteOutlined />}/></Space>}
                            ]}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
