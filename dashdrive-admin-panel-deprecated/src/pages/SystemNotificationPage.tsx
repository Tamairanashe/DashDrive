import React from 'react';
import { Typography, Card, List, Badge, Button, Space } from 'antd';
import { NotificationOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const SystemNotificationPage: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>System Notifications</Title>
                    <Text type="secondary">Send global alerts, push notifications, and maintenance notices.</Text>
                </div>
                <Button type="primary" icon={<SendOutlined />}>Send New Notification</Button>
            </div>

            <Card bordered={false} className="shadow-sm rounded-2xl">
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { title: 'System Maintenance', date: '2026-03-24', status: 'Scheduled' },
                        { title: 'Promo: 50% Off First Ride', date: '2026-03-20', status: 'Sent' },
                    ]}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<Button type="link">View Stats</Button>]}
                        >
                            <List.Item.Meta
                                avatar={<Badge status={item.status === 'Sent' ? 'success' : 'processing'} count={<NotificationOutlined style={{ color: '#aaa' }} />} />}
                                title={item.title}
                                description={`Date: ${item.date} | Status: ${item.status}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};
