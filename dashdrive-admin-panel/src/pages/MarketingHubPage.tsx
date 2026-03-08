import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Empty, 
  Form, 
  Input, 
  Modal, 
  message 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, NotificationOutlined, DollarOutlined, PictureOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const MarketingHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setBanners([
        { id: 1, title: 'Summer Splash', status: 'Active', clicks: 1240 }
      ]);
      setCoupons([]); // Empty state example
      setNotifications([
        { id: 1, title: 'System Maintenance', audience: 'All Users', sentAt: '2026-03-01' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddNew = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Marketing & Communications Hub</Title>
          <Text type="secondary">Manage banners, coupons, and push notifications.</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Create New
          </Button>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          
          <Tabs.TabPane tab={<span><PictureOutlined /> Banners</span>} key="1">
            <Table 
              loading={loading}
              dataSource={banners} 
              rowKey="id"
              locale={{ emptyText: <Empty description="No Banners Active" /> }}
              columns={[
                { title: 'Title', dataIndex: 'title' },
                { title: 'Status', dataIndex: 'status', render: (s) => <Tag color="green">{s}</Tag> },
                { title: 'Clicks', dataIndex: 'clicks' },
                { title: 'Action', render: () => <Space><Button size="small" icon={<EditOutlined />}/><Button size="small" danger icon={<DeleteOutlined />}/></Space>}
              ]}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><DollarOutlined /> Coupons</span>} key="2">
            <Table 
              loading={loading}
              dataSource={coupons} 
              rowKey="id"
              locale={{ emptyText: <Empty description="No Coupons Found" /> }}
              columns={[
                { title: 'Code', dataIndex: 'code' },
                { title: 'Discount', dataIndex: 'discount' },
                { title: 'Usage', dataIndex: 'usage' },
              ]}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><NotificationOutlined /> Push Notifications</span>} key="3">
            <Table 
              loading={loading}
              dataSource={notifications} 
              rowKey="id"
              locale={{ emptyText: <Empty description="No Notifications Sent" /> }}
              columns={[
                { title: 'Title', dataIndex: 'title' },
                { title: 'Audience', dataIndex: 'audience' },
                { title: 'Sent At', dataIndex: 'sentAt' },
              ]}
            />
          </Tabs.TabPane>

        </Tabs>
      </Card>

      <Modal title="Create Marketing Asset" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => { message.success('Asset created'); setModalOpen(false); }}>
        <Form layout="vertical">
            <Form.Item label="Asset Name"><Input placeholder="Enter title" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Also adding a mock import in this file so we avoid dependency issues elsewhere
import { Col, Row } from 'antd';
