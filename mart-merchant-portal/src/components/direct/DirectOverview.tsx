import { Card, Table, Typography, Tag, Space, Button } from 'antd';
import { Package, Truck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface DeliverySnapshot {
    id: string;
    pickup: string;
    dropoff: string;
    status: 'In Transit' | 'Assigned' | 'Delivered' | 'Pending';
}

export function DirectOverview() {

    const deliveryData: DeliverySnapshot[] = [
        { id: 'DEL1201', pickup: 'Store A', dropoff: 'Customer A', status: 'In Transit' },
        { id: 'DEL1202', pickup: 'Store A', dropoff: 'Customer B', status: 'Assigned' },
        { id: 'DEL1203', pickup: 'Store B', dropoff: 'Customer C', status: 'Delivered' },
        { id: 'DEL1204', pickup: 'Warehouse', dropoff: 'Customer D', status: 'Pending' },
    ];

    const columns: ColumnsType<DeliverySnapshot> = [
        {
            title: 'Delivery ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Pickup Location',
            dataIndex: 'pickup',
            key: 'pickup',
        },
        {
            title: 'Dropoff Location',
            dataIndex: 'dropoff',
            key: 'dropoff',
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

                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    return (
        <Space direction="vertical" size="large" className="w-full">

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text className="text-gray-500 font-medium tracking-wide">Deliveries Today</Text>
                            <Title level={2} style={{ margin: '8px 0 0 0' }}>24</Title>
                            <Text className="text-emerald-500 text-sm font-semibold flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} /> +12% from yesterday
                            </Text>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Package size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text className="text-gray-500 font-medium tracking-wide">Active Deliveries</Text>
                            <Title level={2} style={{ margin: '8px 0 0 0' }}>6</Title>
                            <Text className="text-gray-400 text-sm mt-2 block">
                                4 In Transit, 2 Assigned
                            </Text>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Truck size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <Text className="text-gray-500 font-medium tracking-wide">Completed Today</Text>
                            <Title level={2} style={{ margin: '8px 0 0 0' }}>18</Title>
                            <Text className="text-gray-400 text-sm mt-2 block">
                                100% completion rate
                            </Text>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Active Deliveries Snapshot */}
            <Card
                title={<span className="text-lg font-bold">Live Deliveries Snapshot</span>}
                extra={<Button type="link" className="font-semibold text-emerald-600 hover:text-emerald-500">View All</Button>}
                className="shadow-sm border-gray-100"
            >
                <Table
                    columns={columns}
                    dataSource={deliveryData}
                    rowKey="id"
                    pagination={false}
                    className="overflow-x-auto"
                />
            </Card>

        </Space>
    );
}
