import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, List, Button, Tag, Space, Avatar, Input, Empty } from 'antd';
import { FileTextOutlined, PictureOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

export const ContentManagerPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setPosts([
                { id: 'POST-1', title: 'DashDrive Expands to New Region!', category: 'Company News', date: '2026-03-01', status: 'Published' },
                { id: 'POST-2', title: 'Top 10 Eats for Friday Night', category: 'Foodie Guide', date: '2026-03-04', status: 'Draft' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Content & Media Library</Title>
                    <Text type="secondary">Manage the company blog and upload static media assets.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm">
                <Tabs defaultActiveKey="1" size="large">
                    
                    <Tabs.TabPane tab={<span><FileTextOutlined /> Blog Articles</span>} key="1">
                        <Row justify="space-between" style={{ marginBottom: 16 }}>
                            <Col><Search placeholder="Search articles..." style={{ width: 300 }} /></Col>
                            <Col><Button type="primary" icon={<PlusOutlined />}>Write Post</Button></Col>
                        </Row>
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={posts}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button size="small" type="text" icon={<EditOutlined />} />,
                                        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<FileTextOutlined />} />}
                                        title={<strong>{item.title}</strong>}
                                        description={
                                            <Space>
                                                <Tag>{item.category}</Tag>
                                                <Text type="secondary">{item.date}</Text>
                                                <Tag color={item.status === 'Published' ? 'green' : 'default'}>{item.status}</Tag>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><PictureOutlined /> Media Assets</span>} key="2">
                        <Empty 
                            description="Cloud bucket is empty." 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            style={{ margin: '60px 0' }} 
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Button type="primary" icon={<PlusOutlined />}>Upload Files</Button>
                        </div>
                    </Tabs.TabPane>

                </Tabs>
            </Card>
        </div>
    );
};
