import {
    Clock, MapPin, CreditCard,
    ChevronLeft, Printer, FileText, Share2,
    CheckCircle2, Send, AlertCircle,
    Undo2, MessageCircle
} from 'lucide-react';
import { Card, Table, Button, Typography, Tag, Timeline, Divider, Space } from 'antd';

const { Title, Text } = Typography;

interface OrderDetailProps {
    orderId: string;
    onBack: () => void;
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
    // Mock data for the single order view
    const order = {
        id: orderId,
        status: 'Processing',
        date: 'Feb 21, 2026 at 11:45 AM',
        customer: {
            name: 'Darrell Steward',
            email: 'darrell.s@example.com',
            phone: '+1 (555) 000-0000',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Darrell'
        },
        shippingAddress: {
            street: '123 Grocery Lane, Suite 400',
            city: 'London',
            state: 'UK',
            zip: 'E1 6AN'
        },
        billingAddress: {
            street: '123 Grocery Lane, Suite 400',
            city: 'London',
            state: 'UK',
            zip: 'E1 6AN'
        },
        items: [
            { id: 1, name: 'Coconut Clarity', price: 25.00, qty: 4, total: 100.00, image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=100&h=100&fit=crop', status: 'Picked' },
            { id: 2, name: 'Fresh Butter', price: 12.00, qty: 3, total: 36.00, image: 'https://images.unsplash.com/photo-1549392848-d42edee1af20?w=100&h=100&fit=crop', status: 'In Stock' }
        ],
        summary: {
            subtotal: 136.00,
            tax: 12.50,
            shipping: 5.00,
            total: 153.50
        },
        timeline: [
            { time: '11:45 AM', date: 'Feb 21', event: 'Order Placed', desc: 'Order received via Mart App', current: false },
            { time: '12:10 PM', date: 'Feb 21', event: 'Payment Confirmed', desc: 'Transaction authorized via Mastercard', current: false },
            { time: '01:30 PM', date: 'Feb 21', event: 'Processing Started', desc: 'Merchant acknowledged order', current: true }
        ]
    };

    const columns = [
        {
            title: 'Item Detail',
            key: 'item',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-4">
                    <img src={record.image} alt="" className="size-14 rounded-2xl object-cover border border-gray-50" />
                    <div>
                        <Text strong style={{ fontSize: '14px' }}>{record.name}</Text>
                        <br />
                        <Tag color="success" style={{ marginTop: 4, borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', padding: '0 8px' }}>
                            {record.status}
                        </Tag>
                    </div>
                </div>
            )
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <Text strong>${price.toFixed(2)}</Text>
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            align: 'center' as const,
            render: (qty: number) => <Text strong>{qty}</Text>
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right' as const,
            render: (total: number) => <Text strong style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>${total.toFixed(2)}</Text>
        }
    ];

    const timelineItems = order.timeline.map((event) => ({
        color: event.current ? '#2563eb' : '#e5e7eb',
        dot: event.current ? <div className="size-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /> : undefined,
        children: (
            <div className="-mt-1 pb-4">
                <Text strong style={{ display: 'block', fontSize: '14px' }}>{event.event}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{event.desc}</Text>
                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    {event.date}, {event.time}
                </div>
            </div>
        )
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Button type="text" onClick={onBack} icon={<ChevronLeft size={18} />} style={{ fontWeight: 600, color: '#9ca3af', padding: 0 }}>
                    Back to Orders
                </Button>
                <Space size="middle">
                    <Button icon={<Share2 size={16} />} style={{ borderRadius: 12 }} />
                    <Button icon={<Printer size={16} />} style={{ borderRadius: 12, fontWeight: 600 }}>
                        Print Packing Slip
                    </Button>
                    <Button type="primary" icon={<CheckCircle2 size={16} />} style={{ borderRadius: 12, fontWeight: 600 }}>
                        Mark as Shipped
                    </Button>
                </Space>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Stats & Items */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Snapshot */}
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <Title level={3} style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                                    Order {order.id}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '14px', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                                    <Clock size={14} /> {order.date}
                                </Text>
                            </div>
                            <Tag color="blue" style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', borderRadius: 12, border: 'none' }}>
                                {order.status}
                            </Tag>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={order.items}
                            pagination={false}
                            rowKey="id"
                            className="custom-table"
                            style={{ marginBottom: 24 }}
                        />

                        <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <Space size="middle" wrap>
                                <Button type="default" icon={<FileText size={16} className="text-blue-600" />} style={{ borderRadius: 12, fontWeight: 600, color: '#2563eb', borderColor: '#eff6ff', backgroundColor: '#fff' }}>
                                    Packing Slip PDF
                                </Button>
                                <Button type="default" icon={<Send size={16} className="text-purple-600" />} style={{ borderRadius: 12, fontWeight: 600, color: '#9333ea', borderColor: '#faf5ff', backgroundColor: '#fff' }}>
                                    Email Customer
                                </Button>
                            </Space>
                            <div className="w-full md:w-64 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <Text type="secondary" strong>Subtotal</Text>
                                    <Text strong>${order.summary.subtotal.toFixed(2)}</Text>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <Text type="secondary" strong>Estimated Tax</Text>
                                    <Text strong>${order.summary.tax.toFixed(2)}</Text>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <Text type="secondary" strong>Shipping Fee</Text>
                                    <Text strong>${order.summary.shipping.toFixed(2)}</Text>
                                </div>
                                <Divider style={{ margin: '12px 0' }} dashed />
                                <div className="flex justify-between items-center text-lg font-black uppercase tracking-tighter">
                                    <Text type="secondary">Total</Text>
                                    <Text style={{ color: '#2563eb', fontSize: '20px' }}>${order.summary.total.toFixed(2)}</Text>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <MapPin size={20} />
                                </div>
                                <Title level={5} style={{ margin: 0 }}>Shipping Address</Title>
                            </div>
                            <div className="text-sm font-medium leading-relaxed">
                                <Text strong style={{ display: 'block', marginBottom: 4 }}>{order.customer.name}</Text>
                                <Text type="secondary" style={{ display: 'block' }}>{order.shippingAddress.street}</Text>
                                <Text type="secondary" style={{ display: 'block' }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</Text>
                            </div>
                        </Card>
                        <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                    <CreditCard size={20} />
                                </div>
                                <Title level={5} style={{ margin: 0 }}>Billing Address</Title>
                            </div>
                            <div className="text-sm font-medium leading-relaxed">
                                <Text strong style={{ display: 'block', marginBottom: 4 }}>{order.customer.name}</Text>
                                <Text type="secondary" style={{ display: 'block' }}>{order.billingAddress.street}</Text>
                                <Text type="secondary" style={{ display: 'block' }}>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</Text>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Customer & Timeline */}
                <div className="space-y-8">
                    {/* Customer Profile */}
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                        <div className="flex items-center justify-between mb-8">
                            <Title level={5} style={{ margin: 0 }}>Customer Details</Title>
                            <Button type="text" shape="circle" icon={<MessageCircle size={18} />} style={{ color: '#9ca3af' }} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <img src={order.customer.avatar} alt="" className="size-16 rounded-full border-4 border-gray-50" />
                            <div>
                                <Title level={5} style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 900 }}>{order.customer.name}</Title>
                                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>{order.customer.email}</Text>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Count</Text>
                                <Text strong>12 Orders</Text>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                <Text type="secondary" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lifetime Value</Text>
                                <Text strong style={{ color: '#059669' }}>$1,452.00</Text>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline Audit Trail */}
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                        <Title level={5} style={{ margin: 0, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Activity size={18} className="text-amber-500" /> Order History
                        </Title>
                        <Timeline items={timelineItems} style={{ marginTop: 16 }} />
                    </Card>

                    {/* Quick Actions Support */}
                    <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                        <div className="p-3 bg-amber-400 text-white rounded-2xl w-fit mb-4">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="font-bold text-amber-900 mb-2">Issue with Order?</h3>
                        <p className="text-sm text-amber-800/70 font-medium mb-6">Handle returns or partial refunds directly from here.</p>
                        <Button type="primary" block size="large" icon={<Undo2 size={18} />} style={{ backgroundColor: '#78350f', borderColor: '#78350f', borderRadius: 16, fontWeight: 700 }}>
                            Initiate Refund
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Minimal missing component for the single order view
function Activity({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
