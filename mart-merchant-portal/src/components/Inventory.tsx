import { Search, Download, Plus, Filter, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Card, Table, Typography, Button, Input, Space, Tag } from 'antd';

const { Title, Text } = Typography;

const products = [
    {
        id: 1,
        name: 'ASUS ROG Gaming Laptop',
        category: 'Laptop',
        brand: 'ASUS',
        price: '$2,199',
        stock: 'Out of Stock',
        createdAt: '01 Dec, 2027',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=50&h=50&fit=crop'
    },
    {
        id: 2,
        name: 'Airpods Pro 2nd Gen',
        category: 'Accessories',
        brand: 'Apple',
        price: '$839',
        stock: 'In Stock',
        createdAt: '29 Jun, 2027',
        image: 'https://images.unsplash.com/photo-1588423770503-d1d6a97da552?w=50&h=50&fit=crop'
    },
    {
        id: 3,
        name: 'Apple Watch Ultra',
        category: 'Watch',
        brand: 'Apple',
        price: '$1,579',
        stock: 'Out of Stock',
        createdAt: '13 Mar, 2027',
        image: 'https://images.unsplash.com/photo-1434493907317-a46b59bc043a?w=50&h=50&fit=crop'
    }
];

interface InventoryProps {
    onAddProduct: () => void;
}

export function Inventory({ onAddProduct }: InventoryProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'Products',
            key: 'products',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-4">
                    <img src={record.image} alt="" className="size-12 rounded-xl object-cover bg-gray-50" />
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>{record.name}</Text>
                </div>
            )
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text: string) => <Text type="secondary" style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (text: string) => <Text type="secondary" style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text: string) => <Text strong style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: string) => (
                <Tag color={stock === 'In Stock' ? 'success' : 'error'} style={{ fontWeight: 900, borderRadius: 8, padding: '2px 8px', border: 'none' }}>
                    {stock}
                </Tag>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <Text type="secondary" style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right' as const,
            render: () => (
                <Button type="text" shape="circle" icon={<MoreHorizontal size={20} />} className="text-gray-400 hover:text-gray-800" />
            )
        }
    ];

    return (
        <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 0 }}>
            <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Title level={4} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.02em' }}>Products List</Title>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginTop: 4 }}>Track your store's progress to boost your sales.</Text>
                    </div>
                    <Space size="middle">
                        <Button size="large" icon={<Download size={16} />} style={{ fontWeight: 700, borderRadius: 12 }}>
                            Export
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            icon={<Plus size={18} />}
                            onClick={onAddProduct}
                            style={{ backgroundColor: '#2563eb', fontWeight: 900, borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            className="shadow-lg shadow-blue-100"
                        >
                            Add Product
                        </Button>
                    </Space>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <Input
                        prefix={<Search size={18} className="text-gray-400" />}
                        placeholder="Search..."
                        size="large"
                        style={{ maxWidth: 400, borderRadius: 12, backgroundColor: '#f9fafb', border: 'none' }}
                    />
                    <Space>
                        <Button type="text" size="large" icon={<Filter size={18} />} style={{ fontWeight: 700, color: '#6b7280', borderRadius: 12 }}>
                            Filter
                        </Button>
                    </Space>
                </div>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={products}
                    pagination={false}
                    rowKey="id"
                    className="custom-table"
                />
            </div>
        </Card>
    );
}
