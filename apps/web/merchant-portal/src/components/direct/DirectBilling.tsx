import { Card, Table, Typography, Button, Space, Statistic, Tag } from 'antd';
import { Download, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface InvoiceRecord {
    id: string;
    month: string;
    deliveries: number;
    amount: string;
    status: 'Paid' | 'Pending';
}

export function DirectBilling() {

    const invoiceData: InvoiceRecord[] = [
        { id: 'INV-2026-03', month: 'March 2026', deliveries: 124, amount: '$850.25', status: 'Pending' },
        { id: 'INV-2026-02', month: 'February 2026', deliveries: 412, amount: '$2,850.00', status: 'Paid' },
        { id: 'INV-2026-01', month: 'January 2026', deliveries: 389, amount: '$2,654.40', status: 'Paid' },
        { id: 'INV-2025-12', month: 'December 2025', deliveries: 540, amount: '$3,890.10', status: 'Paid' },
    ];

    const columns: ColumnsType<InvoiceRecord> = [
        {
            title: 'Invoice ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Billing Period',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Total Deliveries',
            dataIndex: 'deliveries',
            key: 'deliveries',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <Text className="font-medium">{text}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Paid' ? 'success' : 'processing'} className="px-3 py-1 rounded-md font-medium border-0">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Button type="link" icon={<Download size={16} />} className="text-gray-500 hover:text-black">
                    Download PDF
                </Button>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" className="w-full max-w-6xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={3} style={{ margin: 0 }}>Billing & Invoices</Title>
                    <Text className="text-gray-500 mt-1 block">Manage your enterprise billing and API consumption.</Text>
                </div>
                <Button type="primary" className="bg-black hover:bg-gray-800 rounded-lg h-10 font-semibold px-6">
                    Manage Payment Methods
                </Button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-gray-100 rounded-2xl">
                    <Statistic
                        title={<Text className="text-gray-500 font-semibold">Current Unbilled Balance</Text>}
                        value={850.25}
                        precision={2}
                        prefix="$"
                        valueStyle={{ fontWeight: 800, fontSize: '32px', marginTop: '8px' }}
                    />
                    <Text className="text-gray-400 text-sm mt-4 block">
                        Estimated March 2026 total. Closes in 26 days.
                    </Text>
                </Card>

                <Card className="shadow-sm border-gray-100 rounded-2xl">
                    <Statistic
                        title={<Text className="text-gray-500 font-semibold">Deliveries this month</Text>}
                        value={124}
                        valueStyle={{ fontWeight: 800, fontSize: '32px', marginTop: '8px' }}
                    />
                    <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm mt-4 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                        <ArrowUpRight size={14} /> +4% vs last month
                    </div>
                </Card>

                <Card className="shadow-sm border-gray-100 rounded-2xl bg-gray-50/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text className="text-gray-500 font-semibold mb-2 block">Current Plan</Text>
                            <div className="flex items-center gap-2 mb-1">
                                <Title level={4} style={{ margin: 0 }}>Enterprise API</Title>
                                <Tag color="blue" className="m-0 border-0 bg-blue-100 text-blue-700 font-bold">PRO</Tag>
                            </div>
                            <Text className="text-gray-500 text-sm">Volume pricing unlocked.</Text>
                        </div>
                        <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl">
                            <TrendingUp size={24} className="text-indigo-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Invoices Table */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-400" />
                        <span className="text-lg font-bold">Invoice History</span>
                    </div>
                }
                className="shadow-sm border-gray-100 rounded-2xl"
            >
                <Table
                    columns={columns}
                    dataSource={invoiceData}
                    rowKey="id"
                    pagination={false}
                    className="overflow-x-auto"
                />
            </Card>

        </Space>
    );
}
