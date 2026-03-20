import React, { useState, useEffect } from 'react';
import { 
    Typography, Row, Col, Card, Statistic, Table, Progress, 
    Space, Divider, Button, DatePicker, Tooltip, Drawer, 
    Form, Select, Input, Checkbox, Skeleton,
    Empty, Badge, Tag, App, Flex
} from 'antd';
import { 
    LineChartOutlined, UserOutlined, CarOutlined, 
    ShoppingCartOutlined, DollarOutlined, ArrowUpOutlined,
    InfoCircleOutlined, DownloadOutlined, ReloadOutlined,
    FilePdfOutlined, FileExcelOutlined, FileTextOutlined,
    PieChartOutlined, BarChartOutlined, RiseOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for charts
const REVENUE_DATA = [
    { name: 'Mon', revenue: 4000, orders: 240 },
    { name: 'Tue', revenue: 3000, orders: 198 },
    { name: 'Wed', revenue: 2000, orders: 150 },
    { name: 'Thu', revenue: 2780, orders: 190 },
    { name: 'Fri', revenue: 1890, orders: 120 },
    { name: 'Sat', revenue: 2390, orders: 170 },
    { name: 'Sun', revenue: 3490, orders: 210 },
];

const VERTICAL_DATA = [
    { name: 'Ride Hailing', value: 45, color: '#3b82f6' },
    { name: 'Food Delivery', value: 30, color: '#f59e0b' },
    { name: 'Mart Delivery', value: 15, color: '#10b981' },
    { name: 'Other Services', value: 10, color: '#8b5cf6' },
];

export const AnalyticsPage: React.FC = () => {
    const { message, notification, modal } = App.useApp();
    const [loading, setLoading] = useState(true);
    const [reportDrawerVisible, setReportDrawerVisible] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [topMerchants, setTopMerchants] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        setTimeout(() => {
            setTopMerchants([
                { id: 1, name: 'KFC Main Branch', orders: 1245, revenue: 15400, trend: '+15%', status: 'Active' },
                { id: 2, name: 'Metro Mart', orders: 980, revenue: 12000, trend: '+5%', status: 'Active' },
                { id: 3, name: 'Burger King', orders: 850, revenue: 8900, trend: '-2%', status: 'Review' },
                { id: 4, name: 'Nandos', orders: 720, revenue: 7600, trend: '+8%', status: 'Active' },
                { id: 5, name: 'Pizza Hut', orders: 600, revenue: 5400, trend: '+12%', status: 'Active' },
                { id: 6, name: 'Chicken Inn', orders: 550, revenue: 4900, trend: '+3%', status: 'Inactive' },
            ]);
            setLoading(false);
        }, 1200);
    };

    const handleGenerateReport = (values: any) => {
        setGeneratingReport(true);
        setTimeout(() => {
            setGeneratingReport(false);
            setReportDrawerVisible(false);
            notification.success({
                message: 'Report Generated Successfully',
                description: `Your ${values.type || 'Financial'} report for ${values.format || 'PDF'} format is ready for download.`,
                icon: <FilePdfOutlined style={{ color: '#52c41a' }} />,
            });
        }, 2000);
    };

    return (
        <div style={{ paddingBottom: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Projected Growth & Business Analytics</Title>
                    <Text type="secondary">
                        Comprehensive insights into platform health, service performance, and market trends.
                        <Tooltip title="This page provides real-time data on revenue, order volume, and service distribution across all markets.">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#94a3b8' }} />
                        </Tooltip>
                    </Text>
                </Col>
                <Col>
                    <Space size="middle">
                        <RangePicker />
                        <Button icon={<ReloadOutlined />} onClick={fetchData} />
                        <Button 
                            type="primary" 
                            icon={<LineChartOutlined />} 
                            onClick={() => setReportDrawerVisible(true)}
                        >
                            Generate Detailed Report
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Top Level KPIs */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                {[
                    { title: 'Gross Merchandise Value (GMV)', value: 48291.50, prefix: <DollarOutlined />, color: '#10b981', trend: '+12.5%', info: 'Total value of all orders processed before commissions.' },
                    { title: 'Active User Base', value: 14205, prefix: <UserOutlined />, color: '#3b82f6', trend: '+5.4%', info: 'Customers who performed at least one action in the selected period.' },
                    { title: 'Service Velocity', value: 3240, prefix: <ShoppingCartOutlined />, color: '#f59e0b', trend: '+8.2%', info: 'Average speed of order completion/delivery across all verticals.' },
                    { title: 'Success Rate', value: '98.4%', prefix: <RiseOutlined />, color: '#8b5cf6', trend: '+0.4%', info: 'Percentage of orders completed without disputes or technical failures.' }
                ].map((kpi, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text type="secondary" strong>{kpi.title}</Text>
                                <Tooltip title={kpi.info}>
                                    <InfoCircleOutlined style={{ fontSize: 12, color: '#cbd5e1' }} />
                                </Tooltip>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <Text style={{ fontSize: 24, fontWeight: 800 }}>{typeof kpi.value === 'number' ? `$${kpi.value.toLocaleString()}` : kpi.value}</Text>
                            </div>
                            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="success" icon={<ArrowUpOutlined />} style={{ borderRadius: 4, border: 'none' }}>
                                    {kpi.trend}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 11 }}>vs last period</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                {/* Main Revenue Chart */}
                <Col xs={24} lg={16}>
                    <Card 
                        title="Revenue & Order Volume Trend" 
                        variant="borderless" 
                        className="shadow-sm"
                        style={{ borderRadius: 12 }}
                        extra={<Space><Badge color="#3b82f6" text="Revenue" /><Badge color="#f59e0b" text="Orders" /></Space>}
                    >
                        <div style={{ height: 350, width: '100%', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={REVENUE_DATA}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                    <Area type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={3} fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Vertical Distribution */}
                <Col xs={24} lg={8}>
                    <Card 
                        title="Platform Vertical Mix" 
                        variant="borderless" 
                        className="shadow-sm" 
                        style={{ borderRadius: 12, height: '100%' }}
                        extra={
                            <Tooltip title="Distribution of volume across different services like Ride, Food, and Mart.">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    >
                        <div style={{ height: 250, minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={VERTICAL_DATA}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {VERTICAL_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Space orientation="vertical" style={{ width: '100%' }}>
                            {VERTICAL_DATA.map(item => (
                                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space size="small">
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                                        <Text style={{ fontSize: 13 }}>{item.name}</Text>
                                    </Space>
                                    <Text strong>{item.value}%</Text>
                                </div>
                            ))}
                        </Space>
                    </Card>
                </Col>

                {/* Top Merchants Table */}
                <Col xs={24}>
                    <Card 
                        title="Market Leaders (Top Merchants)" 
                        variant="borderless" 
                        className="shadow-sm"
                        style={{ borderRadius: 12 }}
                        extra={<Button type="link">View All Merchants</Button>}
                    >
                        <Table 
                            loading={loading}
                            dataSource={topMerchants}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            size="middle"
                            columns={[
                                { 
                                    title: 'Merchant Name', 
                                    dataIndex: 'name', 
                                    key: 'name', 
                                    render: (t) => <Text strong>{t}</Text> 
                                },
                                { 
                                    title: 'Order Velocity', 
                                    dataIndex: 'orders', 
                                    key: 'orders',
                                    render: (v) => <Space>{v.toLocaleString()} <Text type="secondary" style={{ fontSize: 11 }}>orders</Text></Space>
                                },
                                { 
                                    title: 'Net Contribution', 
                                    dataIndex: 'revenue', 
                                    key: 'revenue', 
                                    render: (v) => <Text style={{ color: '#10b981', fontWeight: 600 }}>${v.toLocaleString()}</Text> 
                                },
                                { 
                                    title: 'Growth / Trend', 
                                    dataIndex: 'trend', 
                                    key: 'trend', 
                                    render: (t: string) => (
                                        <Tag color={t.startsWith('+') ? 'success' : 'error'} icon={t.startsWith('+') ? <ArrowUpOutlined /> : <WarningOutlined />} style={{ borderRadius: 4, border: 'none' }}>
                                            {t}
                                        </Tag>
                                    ) 
                                },
                                {
                                    title: 'Status',
                                    dataIndex: 'status',
                                    key: 'status',
                                    render: (s) => <Badge status={s === 'Active' ? 'success' : 'warning'} text={s} />
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Report Generation Drawer */}
            <Drawer
                title={
                    <Space>
                        <LineChartOutlined style={{ color: '#1890ff' }} />
                        Configure Professional Analytics Report
                    </Space>
                }
                width={480}
                onClose={() => setReportDrawerVisible(false)}
                open={reportDrawerVisible}
                extra={
                    <Space>
                        <Button onClick={() => setReportDrawerVisible(false)}>Cancel</Button>
                        <Button 
                            type="primary" 
                            onClick={() => (document.getElementById('report-form') as any)?.requestSubmit()}
                            loading={generatingReport}
                        >
                            Start Generation
                        </Button>
                    </Space>
                }
            >
                <Form id="report-form" layout="vertical" onFinish={handleGenerateReport}>
                    <Title level={5} style={{ marginTop: 0 }}>Basic Options</Title>
                    <Form.Item label="Report Category" name="type" initialValue="Financial Executive Summary" rules={[{ required: true }]}>
                        <Select options={[
                            { label: 'Financial Executive Summary', value: 'Financial Executive Summary' },
                            { label: 'Operational Performance Log', value: 'Operational Performance Log' },
                            { label: 'Market Distribution Analytics', value: 'Market Distribution Analytics' },
                            { label: 'User Retention & Growth', value: 'User Retention & Growth' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Data Range" name="range" rules={[{ required: true }]}>
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider />

                    <Title level={5}>Advanced Filters</Title>
                    <Form.Item label="Include Services" name="services" initialValue={['ride', 'food', 'mart']}>
                        <Checkbox.Group options={[
                            { label: 'Ride Hailing', value: 'ride' },
                            { label: 'Food Delivery', value: 'food' },
                            { label: 'Mart Delivery', value: 'mart' },
                            { label: 'Shopping', value: 'shopping' },
                            { label: 'Parcel Delivery', value: 'parcel' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Format" name="format" initialValue="PDF" rules={[{ required: true }]}>
                        <Select options={[
                            { label: 'Professional PDF Document', value: 'PDF' },
                            { label: 'Excel Spreadsheet (.xlsx)', value: 'Excel' },
                            { label: 'Raw CSV Data', value: 'CSV' },
                        ]} />
                    </Form.Item>

                    <Card size="small" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                        <Space align="start">
                            <InfoCircleOutlined style={{ marginTop: 4, color: '#1890ff' }} />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Generated reports will be stored in your <strong>History Logs</strong> for 30 days and will be sent to your registered email.
                            </Text>
                        </Space>
                    </Card>
                </Form>
            </Drawer>
        </div>
    );
};

