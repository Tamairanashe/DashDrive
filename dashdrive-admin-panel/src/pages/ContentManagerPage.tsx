import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Tabs, List, Button, Tag, Space, Avatar, Input, Empty } from 'antd';
import { FileTextOutlined, PictureOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, ControlOutlined } from '@ant-design/icons';

import { BlogSection } from '../components/BlogSection';
import { AppDownloadSetup } from '../components/AppDownloadSetup';
import { BlogPrioritySetup } from '../components/BlogPrioritySetup';

const { Title, Text } = Typography;
const { Search } = Input;

export const ContentManagerPage: React.FC = () => {
    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>Blog Setup</Title>
                    <Text type="secondary">Manage the company blog and app download promotional sections.</Text>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
                <Tabs defaultActiveKey="1" size="large">
                    
                    <Tabs.TabPane tab={<span><FileTextOutlined /> Blog Section</span>} key="1">
                        <BlogSection />
                    </Tabs.TabPane>



                    <Tabs.TabPane tab={<span><DownloadOutlined /> App Download Setup</span>} key="3">
                        <AppDownloadSetup />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={<span><ControlOutlined /> Priority Setup</span>} key="4">
                        <BlogPrioritySetup />
                    </Tabs.TabPane>

                </Tabs>
            </Card>
        </div>
    );
};
