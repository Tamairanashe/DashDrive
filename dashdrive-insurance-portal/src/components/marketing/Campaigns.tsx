import { Plus, Zap, Filter, Search, MoreVertical, Users, TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import { Card, Table, Typography, Button, Input, Row, Col, Statistic, Space, Tag, Modal, Form, Select, DatePicker, Avatar, Tooltip as AntTooltip, Progress } from 'antd';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

export function Campaigns({ token }: { token: string }) {
    const [campaignList, setCampaignList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadCampaigns = async () => {
        try {
            const data = [
                { id: 'CAMP-001', name: 'Premium Life Promo', product: 'Life Insurance', audience: 'New Parents', reach: 45000, conversions: 1200, budget: 5000, spent: 3200, status: 'Active', progress: 64 },
                { id: 'CAMP-002', name: 'Auto Renewal Drive', product: 'Comprehensive Auto', audience: 'Existing Policyholders', reach: 28000, conversions: 850, budget: 2000, spent: 1800, status: 'Active', progress: 90 },
                { id: 'CAMP-003', name: 'Home Shield Launch', product: 'Home Insurance', audience: 'Homeowners', reach: 12000, conversions: 320, budget: 3000, spent: 1500, status: 'Completed', progress: 100 },
            ];
            setCampaignList(data);
        } catch (err: any) {
            console.error('Failed to load campaigns:', err);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, [token]);

    const columns = [
        {
            title: 'Campaign Details',
            key: 'name',
            width: '30%',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Avatar 
                        shape="square" 
                        size={48} 
                        style={{ backgroundColor: '#f0f5ff', borderRadius: '12px' }}
                        icon={<Zap size={20} color="#1890ff" />}
                    />
                    <div>
                        <Text strong style={{ display: 'block', fontSize: '15px' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.id}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Goal & Product',
            key: 'product',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={0}>
                    <Tag color="blue" style={{ borderRadius: '6px', border: 'none', fontWeight: 600 }}>{record.product}</Tag>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>Target: {record.audience}</Text>
                </Space>
            )
        },
        {
            title: 'Performance',
            key: 'performance',
            render: (_: any, record: any) => (
                <Row gutter={24}>
                    <Col>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: '11px' }}>Reach</Text>}
                            value={record.reach}
                            valueStyle={{ fontSize: '14px', fontWeight: 700 }}
                        />
                    </Col>
                    <Col>
                        <Statistic 
                            title={<Text type="secondary" style={{ fontSize: '11px' }}>Conversions</Text>}
                            value={record.conversions}
                            valueStyle={{ fontSize: '14px', fontWeight: 700, color: '#52c41a' }}
                        />
                    </Col>
                </Row>
            )
        },
        {
            title: 'Budget Utilization',
            key: 'budget',
            width: '20%',
            render: (_: any, record: any) => (
                <div style={{ maxWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Text strong style={{ fontSize: '13px' }}>${record.spent.toLocaleString()}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>of ${record.budget.toLocaleString()}</Text>
                    </div>
                    <Progress 
                        percent={record.progress} 
                        size="small" 
                        strokeColor={record.progress > 90 ? '#ff4d4f' : '#1890ff'} 
                        trailColor="#f0f0f0"
                        showInfo={false}
                    />
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <StatusBadge status={status} />
        },
        {
            title: '',
            key: 'action',
            align: 'right' as const,
            render: () => (
                <AntTooltip title="Actions">
                    <Button type="text" shape="circle" icon={<MoreVertical size={18} color="#8c8c8c" />} />
                </AntTooltip>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Marketing Campaigns</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Track and optimize your active promotional initiatives</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<Plus size={18} />} 
                    size="large"
                    style={{ 
                        borderRadius: '12px', 
                        height: '46px', 
                        padding: '0 24px',
                        background: '#722ed1',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(114, 46, 209, 0.2)'
                    }} 
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Campaign
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {[
                    { label: 'Total Reach', value: '124,800', change: '+12%', icon: <Users size={20} />, color: '#1890ff', bg: '#e6f7ff' },
                    { label: 'Total Conversions', value: '8,420', change: '+8%', icon: <Zap size={20} />, color: '#52c41a', bg: '#f6ffed' },
                    { label: 'Avg. ROI', value: '4.2x', change: '+0.5', icon: <TrendingUp size={20} />, color: '#faad14', bg: '#fffbe6' },
                ].map((stat, i) => (
                    <Col xs={24} md={8} key={i}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: '20px', 
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                                background: '#fff'
                            }}
                        >
                            <Space size={16}>
                                <div style={{ 
                                    padding: '12px', 
                                    backgroundColor: stat.bg, 
                                    color: stat.color, 
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>{stat.label}</Text>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <Text style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</Text>
                                        <Text style={{ color: '#52c41a', fontSize: '12px', fontWeight: 600 }}>{stat.change}</Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card 
                bordered={false} 
                style={{ 
                    borderRadius: '24px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }} 
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                    <Input 
                        placeholder="Search by campaign name or product..." 
                        prefix={<Search size={18} color="#bfbfbf" style={{ marginRight: '8px' }} />}
                        style={{ maxWidth: '400px', borderRadius: '12px', height: '42px' }}
                    />
                    <Space>
                        <Button icon={<Filter size={18} />} style={{ borderRadius: '10px', height: '40px' }}>Filters</Button>
                        <Button style={{ borderRadius: '10px', height: '40px' }}>Export Results</Button>
                    </Space>
                </div>
                <Table 
                    dataSource={campaignList} 
                    columns={columns} 
                    pagination={{ pageSize: 10, position: ['bottomRight'] }}
                    rowKey="id"
                    style={{ padding: '0 8px' }}
                />
            </Card>

            <Modal 
                title={
                    <Space direction="vertical" size={2}>
                        <Title level={4} style={{ margin: 0 }}>Create New Campaign</Title>
                        <Text type="secondary" style={{ fontSize: '13px', fontWeight: 400 }}>Configure your promotional strategy and target parameters</Text>
                    </Space>
                }
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="back" style={{ borderRadius: '8px' }} onClick={() => setIsModalOpen(false)}>Discard</Button>,
                    <Button key="submit" type="primary" style={{ borderRadius: '8px', background: '#722ed1' }} onClick={() => setIsModalOpen(false)}>Launch Campaign</Button>
                ]}
                width={700}
                centered
                bodyStyle={{ paddingTop: '24px' }}
            >
                <Form layout="vertical">
                    <Form.Item label={<Text strong>Campaign Identifier</Text>} required tooltip="Unique name for internal tracking">
                        <Input placeholder="e.g., Q2 Auto Insurance Retention Drive" style={{ height: '42px', borderRadius: '10px' }} />
                    </Form.Item>
                    
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Insurance Product</Text>} required>
                                <Select placeholder="Select product catalog" style={{ height: '42px' }}>
                                    <Select.Option value="life"><Space><DollarSign size={14} /> Life Insurance</Space></Select.Option>
                                    <Select.Option value="auto"><Space><Zap size={14} /> Auto Insurance</Space></Select.Option>
                                    <Select.Option value="home"><Space><Calendar size={14} /> Home Insurance</Space></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Target Demographic</Text>} required>
                                <Select placeholder="Select audience" style={{ height: '42px' }}>
                                    <Select.Option value="new"><Space><Users size={14} /> New Acquisitions</Space></Select.Option>
                                    <Select.Option value="existing"><Space><Target size={14} /> Existing Retention</Space></Select.Option>
                                    <Select.Option value="high"><Space><TrendingUp size={14} /> High Net Worth</Space></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Search Regions</Text>} required>
                                <Select placeholder="Select geographical coverage" mode="multiple" style={{ width: '100%' }}>
                                    <Select.Option value="ny">New York Metro</Select.Option>
                                    <Select.Option value="ca">California Statewide</Select.Option>
                                    <Select.Option value="tx">Texas Triangle</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Allocated Budget</Text>} required>
                                <Input prefix={<Text type="secondary">$</Text>} placeholder="5,000" style={{ height: '42px', borderRadius: '10px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Activation Date</Text>} required>
                                <DatePicker style={{ width: '100%', height: '42px', borderRadius: '10px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Expiry Date</Text>} required>
                                <DatePicker style={{ width: '100%', height: '42px', borderRadius: '10px' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

