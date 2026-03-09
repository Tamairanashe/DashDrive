import { Plus, Zap, Filter, Search, MoreVertical, Users, TrendingUp, Calendar, Target, DollarSign, MapPin } from 'lucide-react';
import { 
    Card, Table, Typography, Button, Input, Row, Col, 
    Space, Tag, Modal, Form, Select, DatePicker, Avatar, 
    Progress, Dropdown 
} from 'antd';
import { StatusBadge } from '../common/StatusBadge.tsx';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

export function Campaigns({ token }: { token: string }) {
    const [campaignList, setCampaignList] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const loadCampaigns = async () => {
        try {
            const data = [
                { id: 'CAMP-001', name: 'Business Loan Drive', product: 'SME Loan', audience: 'Small Businesses', reach: 35000, conversions: 950, budget: 10000, spent: 7200, status: 'Active', color: '#722ed1' },
                { id: 'CAMP-002', name: 'Fast Fuel Credit', product: 'Fuel Credit', audience: 'High-volume Drivers', reach: 58000, conversions: 2400, budget: 3000, spent: 2800, status: 'Active', color: '#1890ff' },
                { id: 'CAMP-003', name: 'Vehicle Upgrade Promo', product: 'Vehicle Loan', audience: 'Long-term Drivers', reach: 15000, conversions: 420, budget: 5000, spent: 1500, status: 'Completed', color: '#52c41a' },
            ];
            setCampaignList(data);
        } catch (err: any) {
            console.error('Failed to load campaigns:', err);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, [token]);

    const menuItems = [
        { key: 'edit', label: 'Edit Campaign' },
        { key: 'duplicate', label: 'Duplicate' },
        { key: 'pause', label: 'Pause Campaign', danger: true },
    ];

    const columns = [
        {
            title: 'Campaign Details',
            key: 'name',
            width: '30%',
            render: (_: any, record: any) => (
                <Space size="large">
                    <Avatar 
                        shape="square" 
                        size={48} 
                        style={{ backgroundColor: `${record.color}15`, borderRadius: '12px' }}
                        icon={<Zap size={24} color={record.color} />}
                    />
                    <div>
                        <Text strong style={{ display: 'block', fontSize: '15px' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.id} • {record.product}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Audience / Reach',
            key: 'audience',
            render: (_: any, record: any) => (
                <div>
                    <Text strong style={{ display: 'block' }}>{record.audience}</Text>
                    <Space size={4} style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        <Users size={12} />
                        <span>{record.reach.toLocaleString()} reached</span>
                    </Space>
                </div>
            )
        },
        {
            title: 'Performance',
            key: 'performance',
            render: (_: any, record: any) => (
                <div style={{ width: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Text strong>{record.conversions.toLocaleString()}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{Math.round((record.conversions/record.reach)*100)}% CVR</Text>
                    </div>
                    <Progress percent={Math.round((record.conversions/record.reach)*1000)} showInfo={false} size="small" strokeColor={record.color} />
                </div>
            )
        },
        {
            title: 'Budget Utilization',
            key: 'budget',
            render: (_: any, record: any) => (
                <div style={{ width: '150px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Text strong>${record.spent.toLocaleString()}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>of ${record.budget.toLocaleString()}</Text>
                    </div>
                    <Progress percent={Math.round((record.spent/record.budget)*100)} showInfo={false} size="small" strokeColor={record.spent/record.budget > 0.9 ? '#ff4d4f' : '#faad14'} />
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
                <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                    <Button type="text" shape="circle" icon={<MoreVertical size={18} color="#8c8c8c" />} />
                </Dropdown>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Campaign Center</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>Strategic growth management and acquisition tracking</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<Plus size={20} />} 
                    size="large"
                    style={{ 
                        borderRadius: '12px', 
                        height: '48px', 
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
                    { label: 'Total Reach', value: '124.8k', change: '+12%', icon: <Users size={20} />, color: '#1890ff', bg: '#e6f7ff' },
                    { label: 'Total Conversions', value: '8,420', change: '+8%', icon: <Zap size={20} />, color: '#52c41a', bg: '#f6ffed' },
                    { label: 'Avg. ROI', value: '4.2x', change: '+0.5', icon: <TrendingUp size={20} />, color: '#faad14', bg: '#fffbe6' },
                ].map((stat, i) => (
                    <Col xs={24} md={8} key={i}>
                        <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <Space size={20}>
                                <div style={{ 
                                    padding: '14px', 
                                    backgroundColor: stat.bg, 
                                    color: stat.color, 
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontWeight: 600, fontSize: '13px' }}>{stat.label}</Text>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{stat.value}</Title>
                                        <Text style={{ color: '#52c41a', fontWeight: 600, fontSize: '12px' }}>{stat.change}</Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card 
                bordered={false} 
                style={{ borderRadius: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }} 
                bodyStyle={{ padding: 0 }}
            >
                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                    <Input 
                        placeholder="Search campaigns by name, ID or product..." 
                        prefix={<Search size={18} color="#8c8c8c" />}
                        style={{ maxWidth: '400px', borderRadius: '12px', height: '42px', background: '#fafafa', border: 'none' }}
                    />
                    <Space>
                        <Button icon={<Filter size={18} />} style={{ borderRadius: '10px', height: '40px' }}>Advanced Filters</Button>
                        <Tag color="purple" style={{ borderRadius: '6px', padding: '4px 10px', fontWeight: 600, margin: 0 }}>Showing 12 Campaigns</Tag>
                    </Space>
                </div>
                <Table 
                    dataSource={campaignList} 
                    columns={columns} 
                    pagination={false}
                    rowKey="id"
                    style={{ padding: '8px' }}
                />
            </Card>

            <Modal 
                title={<Title level={4} style={{ margin: 0, fontWeight: 800 }}>Create Growth Campaign</Title>} 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="back" size="large" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '10px' }}>Discard</Button>,
                    <Button key="submit" size="large" type="primary" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '10px', background: '#722ed1', border: 'none' }}>Launch Campaign</Button>
                ]}
                width={700}
                centered
                bodyStyle={{ padding: '24px 0' }}
            >
                <Form layout="vertical" form={form} style={{ padding: '0 24px' }}>
                    <Form.Item label={<Text strong>Campaign Vision</Text>} required>
                        <Input size="large" placeholder="e.g., SME Growth Engine Q3" style={{ borderRadius: '10px' }} prefix={<Target size={18} color="#8c8c8c" style={{ marginRight: '8px' }} />} />
                    </Form.Item>
                    
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Product Selection</Text>} required>
                                <Select size="large" placeholder="Select financial product" style={{ borderRadius: '10px' }}>
                                    <Select.Option value="sme">Small Business Loan</Select.Option>
                                    <Select.Option value="fuel">Fuel Credit Line</Select.Option>
                                    <Select.Option value="vehicle">Asset Finance</Select.Option>
                                    <Select.Option value="personal">Personal Line of Credit</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Target Demographic</Text>} required>
                                <Select size="large" placeholder="Select audience" style={{ borderRadius: '10px' }}>
                                    <Select.Option value="drivers">Active Fleet Drivers</Select.Option>
                                    <Select.Option value="merchants">Verified Merchants</Select.Option>
                                    <Select.Option value="new">New Platform Users</Select.Option>
                                    <Select.Option value="churn">At-Risk Customers</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Geographic Reach</Text>} required>
                                <Select size="large" placeholder="Select regions" mode="multiple" style={{ borderRadius: '10px' }} suffixIcon={<MapPin size={16} />}>
                                    <Select.Option value="ny">New York Hub</Select.Option>
                                    <Select.Option value="ca">California Corridor</Select.Option>
                                    <Select.Option value="tx">Texas Triangle</Select.Option>
                                    <Select.Option value="fl">Florida Metro</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Authorized Budget</Text>} required>
                                <Input size="large" prefix={<DollarSign size={18} color="#8c8c8c" />} placeholder="Enter amount" style={{ borderRadius: '10px' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Launch Date</Text>} required>
                                <DatePicker size="large" style={{ width: '100%', borderRadius: '10px' }} suffixIcon={<Calendar size={18} />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<Text strong>Sunset Date</Text>} required>
                                <DatePicker size="large" style={{ width: '100%', borderRadius: '10px' }} suffixIcon={<Calendar size={18} />} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

