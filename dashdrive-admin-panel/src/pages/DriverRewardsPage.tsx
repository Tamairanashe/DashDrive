import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Table, Empty, Button, Progress, Avatar, Tag, Space, DatePicker } from 'antd';
import { TrophyOutlined, GiftOutlined, StarOutlined, PlusOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const DriverRewardsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [quests, setQuests] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setQuests([
                { id: 'Q-01', title: 'Weekend Warrior', description: 'Complete 30 trips between Friday and Sunday', reward: '$50.00', status: 'Active', progress: 65, activeDrivers: 145 },
                { id: 'Q-02', title: 'Rainy Night Bonus', description: 'Complete 10 trips during heavy rain conditions', reward: '$20.00', status: 'Draft', progress: 0, activeDrivers: 0 },
                { id: 'Q-03', title: 'New Area Explorer', description: 'Complete 5 trips in Zone B (Newly Opened)', reward: '$15.00', status: 'Ended', progress: 100, activeDrivers: 42 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Driver Quests & Rewards</Title>
                    <Text type="secondary">Incentivize driver supply by configuring dynamic goals and monetary rewards.</Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />}>Create Quest</Button>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Space align="center" style={{ marginBottom: 12 }}>
                            <Avatar size="large" icon={<TrophyOutlined />} style={{ background: '#fef08a', color: '#ca8a04' }} />
                            <div>
                                <Text type="secondary" style={{ display: 'block' }}>Active Quests</Text>
                                <Title level={3} style={{ margin: 0 }}>4</Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Space align="center" style={{ marginBottom: 12 }}>
                            <Avatar size="large" icon={<GiftOutlined />} style={{ background: '#bbf7d0', color: '#16a34a' }} />
                            <div>
                                <Text type="secondary" style={{ display: 'block' }}>Total Payouts (30d)</Text>
                                <Title level={3} style={{ margin: 0 }}>$1,240</Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="shadow-sm">
                        <Space align="center" style={{ marginBottom: 12 }}>
                            <Avatar size="large" icon={<StarOutlined />} style={{ background: '#bfdbfe', color: '#2563eb' }} />
                            <div>
                                <Text type="secondary" style={{ display: 'block' }}>Completion Rate</Text>
                                <Title level={3} style={{ margin: 0 }}>68%</Title>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" title="Quest Directory">
                <Table 
                    loading={loading}
                    dataSource={quests} 
                    rowKey="id"
                    columns={[
                        { title: 'Quest Name', dataIndex: 'title', render: (t, r) => (
                            <div>
                                <strong>{t}</strong>
                                <br/><Text type="secondary" style={{ fontSize: 12 }}>{r.description}</Text>
                            </div>
                        )},
                        { title: 'Bounty Reward', dataIndex: 'reward', render: (r) => <Tag color="green">{r}</Tag> },
                        { title: 'Overall Progress', dataIndex: 'progress', width: 200, render: (p) => <Progress percent={p} size="small" /> },
                        { title: 'Drivers Opted-In', dataIndex: 'activeDrivers', render: (a) => <strong>{a}</strong> },
                        { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'Active' ? 'blue' : s === 'Draft' ? 'default' : 'red'}>{s}</Tag> },
                        { title: 'Action', render: () => <Button size="small" icon={<LineChartOutlined />}>Analytics</Button>}
                    ]}
                />
            </Card>
        </div>
    );
};
