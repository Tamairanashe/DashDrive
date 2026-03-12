import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, List, Button, Tag, Space, Avatar, Input, Empty } from 'antd';
import { FileTextOutlined, PictureOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { BlogSection } from '../components/BlogSection';

const { Title, Text } = Typography;
const { Search } = Input;

export const ContentManagerPage: React.FC = () => {
    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Content & Media Library</Title>
                    <Text type="secondary">Manage the company blog and upload static media assets.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
                <Tabs defaultActiveKey="1" size="large">
                    
                    <Tabs.TabPane tab={<span><FileTextOutlined /> Blog Section</span>} key="1">
                        <BlogSection />
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
