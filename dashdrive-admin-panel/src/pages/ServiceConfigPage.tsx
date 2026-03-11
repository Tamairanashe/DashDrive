import React, { useState } from 'react';
import { Typography, Row, Col, Card, Tabs, Switch, Form, InputNumber, Button, Divider, message } from 'antd';
import { CarOutlined, CoffeeOutlined, ShopOutlined, ShoppingOutlined, PushpinOutlined, WalletOutlined, SaveOutlined, BankOutlined, CalendarOutlined, KeyOutlined, ThunderboltOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ServiceConfigPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            message.success('Service configuration updated successfully.');
            setLoading(false);
        }, 800);
    };

    const renderConfigForm = (name: string, defaultComm: number, defaultFee: number) => (
        <Form layout="vertical" style={{ maxWidth: 400, marginTop: 24 }}>
            <Form.Item label="Enable Service Globally">
                <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="Default Commission Rate (%)">
                <InputNumber min={0} max={100} defaultValue={defaultComm} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Base Delivery Fee ($)">
                <InputNumber min={0} defaultValue={defaultFee} style={{ width: '100%' }} />
            </Form.Item>
            <Divider />
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                Save Changes
            </Button>
        </Form>
    );

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Service Engine Configuration</Title>
                    <Text type="secondary">Enable limits and base properties for operating verticals.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs tabPosition="left" size="large">
                    <Tabs.TabPane tab={<span><CarOutlined /> Ride Hailing</span>} key="ride">
                        <Title level={5}>Ride Hailing Configuration</Title>
                        {renderConfigForm('Ride Hailing', 15, 2.50)}
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane tab={<span><CoffeeOutlined /> Food Delivery</span>} key="food">
                        <Title level={5}>Food Delivery Configuration</Title>
                        {renderConfigForm('Food Delivery', 18, 1.50)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><ShopOutlined /> Mart / Grocery</span>} key="mart">
                        <Title level={5}>Mart / Grocery Configuration</Title>
                        {renderConfigForm('Mart Delivery', 10, 3.00)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><ShoppingOutlined /> Shopping</span>} key="shop">
                        <Title level={5}>Shopping Configuration</Title>
                        {renderConfigForm('Shopping', 12, 4.00)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><PushpinOutlined /> Parcel Delivery</span>} key="parcel">
                        <Title level={5}>Parcel Delivery Configuration</Title>
                        {renderConfigForm('Parcel Delivery', 20, 5.00)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><BankOutlined /> Hotels</span>} key="hotels">
                        <Title level={5}>Hotels Configuration</Title>
                        {renderConfigForm('Hotels', 10, 0)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CalendarOutlined /> Events Booking</span>} key="events">
                        <Title level={5}>Events Configuration</Title>
                        {renderConfigForm('Events', 12, 1.00)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><KeyOutlined /> Car Rental</span>} key="rental">
                        <Title level={5}>Car Rental Configuration</Title>
                        {renderConfigForm('Car Rental', 15, 10.00)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><CarOutlined /> Taxis</span>} key="taxis">
                        <Title level={5}>City Taxi Configuration</Title>
                        {renderConfigForm('Taxis', 12, 1.50)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><GlobalOutlined /> Public Transport</span>} key="transport">
                        <Title level={5}>Public Transport Configuration</Title>
                        {renderConfigForm('Transport', 5, 0)}
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><ThunderboltOutlined /> Fuel & Energy</span>} key="fuel">
                        <Title level={5}>Fuel & Energy Configuration</Title>
                        {renderConfigForm('Fuel Services', 2, 0.50)}
                    </Tabs.TabPane>
                    
                    <Tabs.TabPane tab={<span><WalletOutlined /> Core Payments</span>} key="payments">
                        <Title level={5}>Payment Gateway & Fees</Title>
                        <Form layout="vertical" style={{ maxWidth: 400, marginTop: 24 }}>
                            <Form.Item label="Flat Transaction Fee ($)">
                                <InputNumber defaultValue={0.30} style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Percentage Fee (%)">
                                <InputNumber defaultValue={2.9} style={{ width: '100%' }} />
                            </Form.Item>
                            <Divider />
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                                Save Payment Settings
                            </Button>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
