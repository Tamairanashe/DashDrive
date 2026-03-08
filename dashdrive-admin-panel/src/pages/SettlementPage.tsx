import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Row, Col, Drawer, Space, Descriptions, Statistic, message } from 'antd';
import { DollarOutlined, FileTextOutlined, BankOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../api/client'; // Assuming configured axios instance

const { Title, Text } = Typography;

export const SettlementPage: React.FC = () => {
    const [wallets, setWallets] = useState<any[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
    const [statement, setStatement] = useState<any>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/finance/wallets'); // from logistics engine
            setWallets(res.data);
        } catch (error) {
            console.error('Failed to fetch wallets');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatement = async (merchantId: string) => {
        try {
            const res = await api.get(`/finance/statements/merchant/${merchantId}`);
            setStatement(res.data);
        } catch (error) {
            message.error('Failed to fetch merchant statement');
        }
    };

    const handleViewDetails = (merchantId: string) => {
        setSelectedMerchant(merchantId);
        setStatement(null);
        setDrawerVisible(true);
        fetchStatement(merchantId);
    };

    const handleProcessPayout = () => {
        message.success('Payout processed successfully (Mock)');
        setDrawerVisible(false);
    };

    const columns = [
        {
            title: 'Merchant ID',
            dataIndex: 'ownerId',
            key: 'ownerId',
            render: (text: string) => <Text strong>{text.slice(0, 8)}...</Text>
        },
        {
            title: 'Current Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (val: number, record: any) => (
                <Text strong style={{ color: val > 0 ? '#10b981' : '#0f172a' }}>
                    {record.currency} {val.toFixed(2)}
                </Text>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isFrozen',
            key: 'isFrozen',
            render: (frozen: boolean) => (
                <Tag color={frozen ? 'red' : 'green'}>{frozen ? 'Frozen' : 'Active'}</Tag>
            )
        },
        {
            title: 'Last Activity',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Button size="small" type="primary" onClick={() => handleViewDetails(record.ownerId)}>
                    View Statement
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Financial Settlements</Title>
                    <Text type="secondary">Manage merchant wallet balances and process payouts.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Table 
                    columns={columns} 
                    dataSource={wallets} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }} 
                    loading={loading}
                />
            </Card>

            <Drawer
                title="Merchant Weekly Statement"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={500}
            >
                {statement ? (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" bordered={false} style={{ background: '#f8fafc' }}>
                                    <Statistic title="Total Earnings" value={statement.summary.totalEarnings} prefix={statement.currency} precision={2} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" bordered={false} style={{ background: '#f0fdf4' }}>
                                    <Statistic title="Net Payable" value={statement.currentBalance} prefix={statement.currency} precision={2} valueStyle={{ color: '#10b981' }} />
                                </Card>
                            </Col>
                        </Row>

                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Merchant ID"><Text copyable>{statement.merchantId}</Text></Descriptions.Item>
                            <Descriptions.Item label="Wallet ID"><Text copyable>{statement.walletId}</Text></Descriptions.Item>
                            <Descriptions.Item label="Period">
                                {new Date(statement.period.start).toLocaleDateString()} - {new Date(statement.period.end).toLocaleDateString()}
                            </Descriptions.Item>
                        </Descriptions>

                        <Card size="small" title="Recent Transactions" bordered={false} className="shadow-sm" style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {statement.transactions.slice(0, 10).map((t: any) => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                                    <div>
                                        <Text strong style={{ display: 'block', fontSize: 13 }}>{t.description}</Text>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{new Date(t.createdAt).toLocaleString()}</Text>
                                    </div>
                                    <Text strong style={{ color: t.type === 'CREDIT' ? '#10b981' : '#ef4444' }}>
                                        {t.type === 'CREDIT' ? '+' : '-'}{t.amount.toFixed(2)}
                                    </Text>
                                </div>
                            ))}
                        </Card>

                        <Button 
                            block 
                            type="primary" 
                            size="large" 
                            icon={<CheckCircleOutlined />} 
                            onClick={handleProcessPayout}
                            disabled={statement.currentBalance <= 0}
                        >
                            Process Payout
                        </Button>
                    </Space>
                ) : (
                    <div style={{ padding: 40, textAlign: 'center' }}>Loading statement...</div>
                )}
            </Drawer>
        </div>
    );
};
