import { Search, Bell, ShoppingBag, Truck } from 'lucide-react';
import { Layout, Input, Badge, Avatar, Typography, Space, Select } from 'antd';

const { Header: AntdHeader } = Layout;
const { Title, Text } = Typography;

interface HeaderProps {
    title: string;
    subtitle: string;
    merchant: any;
    currentPortal?: 'mart' | 'direct';
    onSwitchPortal?: (type: 'mart' | 'direct') => void;
}

export function Header({ title, subtitle, merchant, currentPortal, onSwitchPortal }: HeaderProps) {
    const storeName = merchant?.stores?.[0]?.name || 'Mart Merchant';
    const email = merchant?.email || 'merchant@dashdrive.com';
    const avatar = merchant?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${merchant?.id || 'Felix'}`;
    return (
        <AntdHeader
            className="bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10"
            style={{ height: '80px', lineHeight: 'normal', padding: '0 32px' }}
        >
            <div className="flex items-center gap-8">
                <div className="flex flex-col justify-center">
                    <Title level={4} style={{ margin: 0, fontWeight: 600, lineHeight: 1.2 }}>{title}</Title>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, lineHeight: 1.5 }}>{subtitle}</Text>
                </div>

                {onSwitchPortal && (
                    <Select
                        value={currentPortal}
                        onChange={onSwitchPortal}
                        style={{ width: 180 }}
                        className="service-switcher"
                        dropdownStyle={{ borderRadius: 12 }}
                        options={[
                            { 
                                value: 'mart', 
                                label: (
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={14} className="text-emerald-500" />
                                        <Text strong size="small">Dash Mart</Text>
                                    </div>
                                ) 
                            },
                            { 
                                value: 'direct', 
                                label: (
                                    <div className="flex items-center gap-2">
                                        <Truck size={14} className="text-blue-500" />
                                        <Text strong size="small">Dash Direct</Text>
                                    </div>
                                ) 
                            }
                        ]}
                    />
                )}
            </div>

            <div className="flex items-center gap-6">
                <Input
                    prefix={<Search className="text-gray-400 size-4" />}
                    placeholder="Search users, orders, products..."
                    style={{ width: 320, borderRadius: 12 }}
                    size="large"
                />

                <div className="flex items-center gap-5 border-l border-gray-100 pl-6 h-full">
                    <Badge dot color="red" offset={[-4, 4]}>
                        <div className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-center justify-center">
                            <Bell size={20} />
                        </div>
                    </Badge>

                    <Space size="middle" className="cursor-pointer" align="center">
                        <div className="text-right hidden sm:flex flex-col justify-center mt-1">
                            <Text strong style={{ display: 'block', lineHeight: 1.2 }}>{storeName}</Text>
                            <Text type="secondary" style={{ fontSize: '10px', lineHeight: 1.5 }}>{email}</Text>
                        </div>
                        <Badge dot color="#10b981" offset={[-6, 35]}>
                            <Avatar src={avatar} size={40} shape="square" style={{ borderRadius: 12, backgroundColor: '#f5f5f5' }} />
                        </Badge>
                    </Space>
                </div>
            </div>
        </AntdHeader>
    );
}
