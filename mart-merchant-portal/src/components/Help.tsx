import { Card, Input, Button, Form, Typography, Collapse, Tag } from 'antd';
import { Search, MessageCircle, Phone, FileText, Send, HelpCircle } from 'lucide-react';
import { PageHeader } from './common/PageHeader';

const { Title, Text } = Typography;

export function Help() {
    const [form] = Form.useForm();

    const quickLinks = [
        { title: 'Getting Started', icon: <FileText size={24} className="text-blue-500" />, desc: 'Guide to setting up your merchant account and first store.' },
        { title: 'Managing Orders', icon: <FileText size={24} className="text-emerald-500" />, desc: 'Learn how to process, accept, and fulfill incoming orders.' },
        { title: 'Inventory Basics', icon: <FileText size={24} className="text-purple-500" />, desc: 'Adding products, tracking stock, and setting up alerts.' },
        { title: 'Payouts & Financials', icon: <FileText size={24} className="text-amber-500" />, desc: 'Understanding your earnings, payout schedule, and reports.' },
    ];

    const faqs = [
        {
            key: '1',
            label: 'How do I change my payout bank account?',
            children: 'You can update your payout information by navigating to Settings > Profile > Payment Details. Please note that for security reasons, it may take 3-5 business days for bank account changes to be verified.'
        },
        {
            key: '2',
            label: 'What happens if a customer cancels an order?',
            children: 'If a customer cancels an order before it is marked as "Processing", you will not be charged any fees. If the order has already been processed or handed to a rider, please contact support for a partial resolution.'
        },
        {
            key: '3',
            label: 'How do I temporarily close my store?',
            children: 'Go to Stores > Store Hours. You can toggle the "Store Open" switch to immediately stop accepting new orders, or set up Holiday Hours for planned upcoming closures.'
        },
        {
            key: '4',
            label: 'Can I add multiple staff members?',
            children: 'Yes! Navigate to Settings > Staff to send email invitations to your team. You can assign different roles (Manager, Cashier, Viewer) to restrict their access to sensitive financials.'
        }
    ];

    const handleSubmit = () => {
        form.resetFields();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
            <PageHeader
                title="Help & Support"
                description="Find answers to common questions or contact our merchant success team."
            />

            {/* Search Hero */}
            <Card bordered={false} className="shadow-sm bg-gradient-to-br from-zinc-900 to-zinc-800 border-0" bodyStyle={{ padding: '64px 32px', textAlign: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 16 }}>How can we help you today?</Title>
                <div className="max-w-2xl mx-auto relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 size-5" />
                    <Input
                        size="large"
                        placeholder="Search for articles, guides, or keywords..."
                        style={{ paddingLeft: 48, borderRadius: 16, height: 56, fontSize: '16px', border: 'none' }}
                        className="shadow-xl"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Tag style={{ margin: 0, borderRadius: 6, border: 'none', backgroundColor: '#f4f4f5', color: '#52525b', fontWeight: 600 }}>Ctrl</Tag>
                        <Tag style={{ margin: 0, borderRadius: 6, border: 'none', backgroundColor: '#f4f4f5', color: '#52525b', fontWeight: 600 }}>K</Tag>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Links & FAQ */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Guides */}
                    <div>
                        <Title level={4} style={{ marginBottom: 24 }}>Popular Guides</Title>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickLinks.map((link, idx) => (
                                <Card key={idx} hoverable bordered={false} className="shadow-sm transition-all group cursor-pointer" bodyStyle={{ padding: 24 }}>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-zinc-50 rounded-2xl group-hover:scale-110 transition-transform">
                                            {link.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <Text strong style={{ fontSize: '16px' }}>{link.title}</Text>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: 4, lineHeight: 1.5 }}>
                                                {link.desc}
                                            </Text>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                        <Title level={4} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f4f4f5' }}>Frequently Asked Questions</Title>
                        <Collapse
                            accordion
                            ghost
                            expandIconPosition="end"
                            items={faqs}
                            className="bg-transparent"
                        />
                    </Card>
                </div>

                {/* Right Column: Contact & Support Status */}
                <div className="space-y-8">
                    {/* Contact Channels */}
                    <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: 32 }}>
                        <Title level={4} style={{ marginBottom: 24 }}>Need immediate help?</Title>

                        <div className="space-y-3">
                            <Button size="large" block className="text-left flex items-center justify-start h-auto py-3 px-4 rounded-2xl border-zinc-200">
                                <MessageCircle className="text-emerald-500 mr-3" size={20} />
                                <div>
                                    <Text strong style={{ display: 'block' }}>Live Chat Support</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Typically replies in 3 mins</Text>
                                </div>
                            </Button>
                            <Button size="large" block className="text-left flex items-center justify-start h-auto py-3 px-4 rounded-2xl border-zinc-200">
                                <Phone className="text-blue-500 mr-3" size={20} />
                                <div>
                                    <Text strong style={{ display: 'block' }}>Phone Support</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Available 24/7 for merchants</Text>
                                </div>
                            </Button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <Title level={5} style={{ marginBottom: 16 }}>Send us a message</Title>
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item name="subject" rules={[{ required: true }]}>
                                    <Input placeholder="Subject" size="large" style={{ borderRadius: 12 }} />
                                </Form.Item>
                                <Form.Item name="message" rules={[{ required: true }]}>
                                    <Input.TextArea placeholder="Describe your issue in detail..." rows={4} style={{ borderRadius: 12 }} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" size="large" block icon={<Send size={16} />} style={{ borderRadius: 12, fontWeight: 600 }}>
                                    Submit Ticket
                                </Button>
                            </Form>
                        </div>
                    </Card>

                    {/* System Status */}
                    <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-start gap-4">
                        <div className="p-2 bg-emerald-400 text-white rounded-xl mt-1 shrink-0">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <Text strong style={{ color: '#065f46', display: 'block', marginBottom: 2 }}>All Systems Operational</Text>
                            <Text style={{ color: '#047857', fontSize: '13px', lineHeight: 1.4 }}>Merchant portal, orders, and rider assignments are functioning normally.</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
