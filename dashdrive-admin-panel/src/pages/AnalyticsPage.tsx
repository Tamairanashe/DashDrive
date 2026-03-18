import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Progress, Space, Divider, Button, DatePicker } from 'antd';
import { LineChartOutlined, UserOutlined, CarOutlined, ShoppingCartOutlined, DollarOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const AnalyticsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [topMerchants, setTopMerchants] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setTopMerchants([
                { id: 1, name: 'KFC Main Branch', orders: 1245, revenue: 15400, trend: '+15%' },
                { id: 2, name: 'Metro Mart', orders: 980, revenue: 12000, trend: '+5%' },
                { id: 3, name: 'Burger King', orders: 850, revenue: 8900, trend: '-2%' },
                { id: 4, name: 'Nandos', orders: 720, revenue: 7600, trend: '+8%' },
                { id: 5, name: 'Pizza Hut', orders: 600, revenue: 5400, trend: '+12%' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Business Analytics Overview</Title>
                    <Text type="secondary">Track platform growth, vertical performance, and deep insights.</Text>
                </Col>
                <Col>
                    <Space>
                        <RangePicker />
                        <Button type="primary" icon={<LineChartOutlined />}>Generate Report</Button>
                    </Space>
                </Col>
            </Row>

            {/* Top Level KPIs */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Total Active Users" value={14205} prefix={<UserOutlined />} />
                        <Text type="success"><ArrowUpOutlined /> 5.4% this week</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Total Active Drivers" value={840} prefix={<CarOutlined />} />
                        <Text type="success"><ArrowUpOutlined /> 2.1% this week</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Orders Today" value={3240} prefix={<ShoppingCartOutlined />} />
                        <Text type="success"><ArrowUpOutlined /> 12% vs yesterday</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Daily GMV" value={24500} precision={2} prefix={<DollarOutlined />} />
                        <Text type="success"><ArrowUpOutlined /> 8% vs yesterday</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Vertical Breakdown */}
                <Col xs={24} lg={8}>
                    <Card title="Revenue by Vertical" bordered={false} className="shadow-sm" style={{ height: '100%' }}>
                        <div style={{ padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text strong>Food Delivery</Text>
                                <Text>45%</Text>
                            </div>
                            <Progress percent={45} showInfo={false} strokeColor="#1890ff" />
                        </div>
                        <div style={{ padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text strong>Ride Hailing</Text>
                                <Text>30%</Text>
                            </div>
                            <Progress percent={30} showInfo={false} strokeColor="#52c41a" />
                        </div>
                        <div style={{ padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text strong>Mart / Groceries</Text>
                                <Text>15%</Text>
                            </div>
                            <Progress percent={15} showInfo={false} strokeColor="#faad14" />
                        </div>
                        <div style={{ padding: '12px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text strong>Parcel Delivery</Text>
                                <Text>10%</Text>
                            </div>
                            <Progress percent={10} showInfo={false} strokeColor="#722ed1" />
                        </div>
                    </Card>
                </Col>

                {/* Top Merchants Table */}
                <Col xs={24} lg={16}>
                    <Card title="Top Performing Merchants" bordered={false} className="shadow-sm">
                        <Table 
                            loading={loading}
                            dataSource={topMerchants}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: 'Merchant Name', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
                                { title: 'Total Orders', dataIndex: 'orders', key: 'orders' },
                                { title: 'Revenue Generate', dataIndex: 'revenue', key: 'revenue', render: (v) => `$${v.toLocaleString()}` },
                                { title: 'Trend', dataIndex: 'trend', key: 'trend', render: (t: string) => <Text type={t.startsWith('+') ? 'success' : 'danger'}>{t}</Text> },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
