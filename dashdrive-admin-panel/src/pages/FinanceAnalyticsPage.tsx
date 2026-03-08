import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Tabs, Table, Empty, Space, Button, Tag } from 'antd';
import { DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, FileTextOutlined, PieChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const FinanceAnalyticsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setTransactions([
                { id: 'TX-1001', type: 'Payout', amount: 450.00, status: 'Completed', date: '2026-03-05' },
                { id: 'TX-1002', type: 'Commission', amount: 12.50, status: 'Completed', date: '2026-03-05' },
                { id: 'TX-1003', type: 'Refund', amount: -25.00, status: 'Pending', date: '2026-03-06' },
            ]);
            setLoading(false);
        }, 1200);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Finance & Analytics</Title>
                    <Text type="secondary">Monitor platform revenues, driver payouts, and settlement ledgers.</Text>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Total Platform Revenue (30d)" value={12450.00} precision={2} prefix="$" valueStyle={{ color: '#10b981' }} />
                        <Text type="success"><ArrowUpOutlined /> 12% vs last month</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Pending Payouts" value={3450.50} precision={2} prefix="$" valueStyle={{ color: '#f59e0b' }} />
                        <Text type="secondary">Escrowed funds awaiting settlement</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Refunds Processed" value={420.00} precision={2} prefix="$" valueStyle={{ color: '#ef4444' }} />
                        <Text type="danger"><ArrowDownOutlined /> 4% vs last month</Text>
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab={<span><DollarOutlined /> Transactions Ledger</span>} key="1">
                        <Table 
                            loading={loading}
                            dataSource={transactions} 
                            rowKey="id"
                            locale={{ emptyText: <Empty description="No Transactions Found" /> }}
                            columns={[
                                { title: 'Transaction ID', dataIndex: 'id' },
                                { title: 'Type', dataIndex: 'type' },
                                { title: 'Amount', dataIndex: 'amount', render: (val) => `$${val.toFixed(2)}` },
                                { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'Completed' ? 'green' : 'orange'}>{s}</Tag> },
                                { title: 'Date', dataIndex: 'date' }
                            ]}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><PieChartOutlined /> Earnings Reports</span>} key="2">
                        <Empty description="Earnings charts will populate here." style={{ margin: '40px 0' }} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><FileTextOutlined /> Commission Reports</span>} key="3">
                        <Empty description="Commission splits report is unavailable." style={{ margin: '40px 0' }} />
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
};
