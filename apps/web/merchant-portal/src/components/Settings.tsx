import { Card, Tabs, Form, Input, Switch, Button, Select, Typography, Avatar, Divider, message } from 'antd';
import { User, Bell, Shield, Globe, Smartphone, Mail, Lock } from 'lucide-react';
import { PageHeader } from './common/PageHeader';

const { Title, Text } = Typography;

export function Settings() {
    const [form] = Form.useForm();

    const handleSave = () => {
        message.success({ content: 'Settings saved successfully!', className: 'custom-message' });
    };

    const items = [
        {
            key: 'profile',
            label: <span className="flex items-center gap-2"><User size={16} /> Profile Information</span>,
            children: (
                <div className="max-w-2xl animate-in fade-in duration-500">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar size={80} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Merchant" className="bg-zinc-100 shadow-sm" />
                        <div>
                            <Button size="large" style={{ borderRadius: 12, fontWeight: 600 }}>Change Avatar</Button>
                            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: '12px' }}>JPG, GIF or PNG. 1MB max.</Text>
                        </div>
                    </div>

                    <Form form={form} layout="vertical" initialValues={{ firstName: 'John', lastName: 'Doe', email: 'merchant@dashdrive.com', phone: '+1 234 567 8900' }}>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input size="large" style={{ borderRadius: 12 }} />
                            </Form.Item>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input size="large" style={{ borderRadius: 12 }} />
                            </Form.Item>
                        </div>
                        <Form.Item name="email" label="Email Address" rules={[{ type: 'email' }]}>
                            <Input size="large" style={{ borderRadius: 12 }} />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone Number">
                            <Input size="large" style={{ borderRadius: 12 }} />
                        </Form.Item>

                        <Divider />
                        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>Store Information</Title>

                        <Form.Item name="storeName" label="Store Name" initialValue="DashDrive Supermart">
                            <Input size="large" style={{ borderRadius: 12 }} />
                        </Form.Item>
                        <Form.Item name="storeDesc" label="Store Description">
                            <Input.TextArea rows={4} style={{ borderRadius: 12 }} />
                        </Form.Item>

                        <Button type="primary" size="large" style={{ borderRadius: 12, fontWeight: 600, marginTop: 16 }} onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Form>
                </div>
            )
        },
        {
            key: 'preferences',
            label: <span className="flex items-center gap-2"><Globe size={16} /> Preferences</span>,
            children: (
                <div className="max-w-2xl animate-in fade-in duration-500">
                    <Form layout="vertical">
                        <Title level={5} style={{ marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f4f4f5' }}>Regional Settings</Title>
                        <Form.Item label="Language">
                            <Select size="large" defaultValue="en" style={{ width: '100%', borderRadius: 12 }}>
                                <Select.Option value="en">English (US)</Select.Option>
                                <Select.Option value="es">Español</Select.Option>
                                <Select.Option value="fr">Français</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Time Zone">
                            <Select size="large" defaultValue="est" style={{ width: '100%', borderRadius: 12 }}>
                                <Select.Option value="pst">Pacific Time (PT)</Select.Option>
                                <Select.Option value="est">Eastern Time (ET)</Select.Option>
                                <Select.Option value="utc">Coordinated Universal Time (UTC)</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Currency">
                            <Select size="large" defaultValue="usd" style={{ width: '100%', borderRadius: 12 }}>
                                <Select.Option value="usd">USD ($)</Select.Option>
                                <Select.Option value="eur">EUR (€)</Select.Option>
                                <Select.Option value="gbp">GBP (£)</Select.Option>
                            </Select>
                        </Form.Item>

                        <Button type="primary" size="large" style={{ borderRadius: 12, fontWeight: 600, marginTop: 16 }} onClick={handleSave}>
                            Update Preferences
                        </Button>
                    </Form>
                </div>
            )
        },
        {
            key: 'notifications',
            label: <span className="flex items-center gap-2"><Bell size={16} /> Notifications</span>,
            children: (
                <div className="max-w-3xl animate-in fade-in duration-500 space-y-6">
                    <div className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm"><Mail size={20} className="text-zinc-600" /></div>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>Email Notifications</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Receive daily summaries and critical alerts via email.</Text>
                            </div>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm"><Smartphone size={20} className="text-zinc-600" /></div>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>Push Notifications</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Get immediate alerts for new orders and customer messages.</Text>
                            </div>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <Divider />
                    <Title level={5}>Detailed Alerts</Title>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Text strong>New Order Received</Text>
                            <Switch defaultChecked size="small" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Text strong>Order Cancelled</Text>
                            <Switch defaultChecked size="small" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Text strong>Low Stock Alert</Text>
                            <Switch defaultChecked size="small" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Text strong>Weekly Performance Report</Text>
                            <Switch size="small" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'security',
            label: <span className="flex items-center gap-2"><Shield size={16} /> Security</span>,
            children: (
                <div className="max-w-2xl animate-in fade-in duration-500">
                    <div className="mb-10">
                        <Title level={5} style={{ marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f4f4f5' }}>Change Password</Title>
                        <Form layout="vertical">
                            <Form.Item label="Current Password">
                                <Input.Password size="large" style={{ borderRadius: 12 }} />
                            </Form.Item>
                            <Form.Item label="New Password">
                                <Input.Password size="large" style={{ borderRadius: 12 }} />
                            </Form.Item>
                            <Form.Item label="Confirm New Password">
                                <Input.Password size="large" style={{ borderRadius: 12 }} />
                            </Form.Item>
                            <Button size="large" style={{ borderRadius: 12, fontWeight: 600 }}>Update Password</Button>
                        </Form>
                    </div>

                    <div>
                        <Title level={5} style={{ marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f4f4f5' }}>Two-Factor Authentication</Title>
                        <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-2xl">
                            <div className="flex gap-3 items-center">
                                <Lock size={20} className="text-emerald-500" />
                                <div>
                                    <Text strong style={{ display: 'block' }}>Authenticator App</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Configured and active</Text>
                                </div>
                            </div>
                            <Button danger style={{ borderRadius: 10, fontWeight: 600 }}>Disable</Button>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
            <PageHeader
                title="Settings"
                description="Manage your store preferences, account details, and security settings."
            />

            <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0 }}>
                <Tabs
                    defaultActiveKey="profile"
                    items={items}
                    tabPosition="left"
                    style={{ minHeight: 600 }}
                    tabBarStyle={{ width: 240, padding: '24px 0', borderRight: '1px solid #f0f0f0' }}
                    renderTabBar={(props, DefaultTabBar) => (
                        <div className="p-4">
                            <DefaultTabBar {...props} />
                        </div>
                    )}
                />
            </Card>
        </div>
    );
}
