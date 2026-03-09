import { Send } from 'lucide-react';
import { useState } from 'react';
import { Card, Typography, Button, Input, Select, Row, Col, Space } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

import { useEffect } from 'react';

export function Promotions({ token }: { token: string }) {
    const [title, setTitle] = useState('Policy Renewal Alert');
    const [message, setMessage] = useState('Your auto insurance expires in 7 days. Renew today to keep your 50% No-Claim Bonus!');

    useEffect(() => {
        if (token) {
            console.log('Promotions component initialized with token');
        }
    }, [token]);

    return (
        <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
                <div style={{ marginBottom: '32px' }}>
                    <Title level={4} style={{ margin: 0 }}>Push Promotions</Title>
                    <Text type="secondary">Reach your customers directly via mobile push notifications</Text>
                </div>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    {[
                        { label: 'Total Sent', value: '45.2k', color: '#3b82f6' },
                        { label: 'Opened', value: '18.4k', color: '#10b981' },
                        { label: 'Applications', value: '2.8k', color: '#f59e0b' },
                    ].map((stat, i) => (
                        <Col span={8} key={i}>
                            <Card bodyStyle={{ padding: '12px' }} style={{ borderRadius: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{stat.label}</Text>
                                <Text strong style={{ fontSize: '18px', color: stat.color }}>{stat.value}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '32px' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Campaign Title</Text>
                            <Input
                                size="large"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Policy Renewal Reminder"
                                style={{ borderRadius: '12px' }}
                            />
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Message Body</Text>
                            <TextArea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="What do you want to say?"
                                style={{ borderRadius: '12px' }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '4px' }}>
                                <Text type="secondary" style={{ fontSize: '11px' }}>{message.length}/160 characters</Text>
                            </div>
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Target Audience</Text>
                                <Select
                                    size="large"
                                    defaultValue="All Customers"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'All Customers', label: 'All Policyholders' },
                                        { value: 'Recent Customers', label: 'Recently Expired' },
                                        { value: 'High Spenders', label: 'High-Value Leads' },
                                    ]}
                                />
                            </Col>
                            <Col span={12}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Schedule</Text>
                                <Select
                                    size="large"
                                    defaultValue="Send Immediately"
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'Send Immediately', label: 'Send Immediately' },
                                        { value: 'Schedule for later', label: 'Schedule for later' },
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Button type="primary" block size="large" icon={<Send size={18} />} style={{ borderRadius: '12px', height: '48px', marginTop: '12px' }}>
                            Launch Promotion
                        </Button>
                    </Space>
                </Card>
            </Col>

            <Col xs={24} lg={12}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}>
                    <div style={{ 
                        position: 'relative', 
                        width: '280px', 
                        height: '560px', 
                        backgroundColor: '#111827', 
                        borderRadius: '40px', 
                        border: '8px solid #374151',
                        padding: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            width: '120px', 
                            height: '24px', 
                            backgroundColor: '#111827', 
                            borderRadius: '0 0 16px 16px' 
                        }} />
                        
                        <div style={{ marginTop: '40px' }}>
                            <div style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)', 
                                backdropFilter: 'blur(10px)', 
                                padding: '16px', 
                                borderRadius: '20px', 
                                border: '1px solid rgba(255,255,255,0.1)' 
                            }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#3b82f6', borderRadius: '4px' }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 700 }}>DASHDRIVE</Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginLeft: 'auto' }}>now</Text>
                                </div>
                                <Text strong style={{ color: 'white', display: 'block', fontSize: '12px' }}>{title || 'Promo'}</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{message || 'Message preview...'}</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
}
