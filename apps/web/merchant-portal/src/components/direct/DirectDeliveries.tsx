import { Card, Table, Typography, Tag, Space, Input, Button, DatePicker } from 'antd';
import { Search, Download, Filter } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DeliveryRecord {
    id: string;
    date: string;
    pickup: string;
    dropoff: string;
    customer: string;
    status: 'In Transit' | 'Assigned' | 'Delivered' | 'Pending' | 'Cancelled';
    cost: string;
}

export function DirectDeliveries() {

    const data: DeliveryRecord[] = [
        { id: 'DEL1201', date: '2026-03-05 14:30', pickup: 'Store A', dropoff: 'Customer A', customer: 'John Doe', status: 'In Transit', cost: '$6.50' },
        { id: 'DEL1202', date: '2026-03-05 14:15', pickup: 'Store A', dropoff: 'Customer B', customer: 'Sarah Smith', status: 'Assigned', cost: '$8.20' },
        { id: 'DEL1203', date: '2026-03-05 13:00', pickup: 'Store B', dropoff: 'Customer C', customer: 'Mike Johnson', status: 'Delivered', cost: '$5.50' },
        { id: 'DEL1204', date: '2026-03-05 12:45', pickup: 'Warehouse', dropoff: 'Customer D', customer: 'Emily Chen', status: 'Delivered', cost: '$12.00' },
        { id: 'DEL1205', date: '2026-03-05 11:30', pickup: 'Store C', dropoff: 'Customer E', customer: 'Alex Wilson', status: 'Cancelled', cost: '$0.00' },
    ];

    const columns: ColumnsType<DeliveryRecord> = [
        {
            title: 'Delivery ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Pickup',
            dataIndex: 'pickup',
            key: 'pickup',
        },
        {
            title: 'Dropoff',
            dataIndex: 'dropoff',
            key: 'dropoff',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'In Transit') color = 'blue';
                if (status === 'Assigned') color = 'purple';
                if (status === 'Delivered') color = 'success';
                if (status === 'Pending') color = 'warning';
                if (status === 'Cancelled') color = 'error';

                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    return (
        <Space direction="vertical" size="large" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Title level={3} style={{ margin: 0 }}>All Deliveries</Title>
                <div className="flex gap-3">
                    <Button icon={<Download size={16} />} className="font-medium">Export CSV</Button>
                </div>
            </div>

            <Card className="shadow-sm border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Search by ID, Address, or Customer"
                        prefix={<Search className="text-gray-400" size={16} />}
                        className="max-w-md h-10 rounded-lg"
                    />
                    <RangePicker className="h-10 rounded-lg" />
                    <Button icon={<Filter size={16} />} className="h-10 rounded-lg font-medium">Filters</Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="overflow-x-auto border border-gray-100 rounded-xl"
                />
            </Card>
        </Space>
    );
}
