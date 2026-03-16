import React, { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Select,
  Button,
  Space,
  Divider,
  message,
  Tooltip,
  Alert
} from 'antd';
import {
  InfoCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  ControlOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const BlogPrioritySetup: React.FC = () => {
  const { isDark } = useTheme();
  
  // State for Categories Sorting
  const [categorySort, setCategorySort] = useState('newest');
  
  // State for Blog List Sorting
  const [blogSort, setBlogSort] = useState('newest');

  const handleReset = () => {
    setCategorySort('newest');
    setBlogSort('newest');
    message.info('Sorting options have been reset to default');
  };

  const handleSave = () => {
    message.success('Priority settings saved successfully');
  };

  const sortingOptions = [
    { value: 'newest', label: 'Default - Sort by Date (Newest First)' },
    { value: 'oldest', label: 'Sort by Date (Oldest First)' },
    { value: 'popularity', label: 'Sort by Popularity (Show Most Clicked First)' },
    { value: 'alphabetical_az', label: 'Sort by Alphabetical (A To Z)' },
    { value: 'alphabetical_za', label: 'Sort by Alphabetical (Z To A)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Alert
        message="Priority & Sorting Logic"
        description="Configure how categories and blog posts are ordered across both the Admin Panel and the public website."
        type="info"
        showIcon
        icon={<ControlOutlined />}
        style={{ borderRadius: 12 }}
      />

      {/* Categories Section */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={
          <Space>
            <OrderedListOutlined style={{ color: '#10b981' }} />
            <Title level={5} style={{ margin: 0 }}>Categories</Title>
          </Space>
        }
      >
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Set up and manage categories with sorting and visibility for both admin and website users.
        </Paragraph>
        
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Category sorting list</Text>
              <Select 
                style={{ width: '100%' }}
                value={categorySort}
                onChange={setCategorySort}
                placeholder="Select sorting option"
              >
                {sortingOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Blog List Section */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={
          <Space>
            <OrderedListOutlined style={{ color: '#0089D1' }} />
            <Title level={5} style={{ margin: 0 }}>Blog List</Title>
          </Space>
        }
      >
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          Manage and display blogs with sorting options for both admin and website users.
        </Paragraph>
        
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Blog sorting list</Text>
              <Select 
                style={{ width: '100%' }}
                value={blogSort}
                onChange={setBlogSort}
                placeholder="Select sorting option"
              >
                {sortingOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Footer Actions */}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 40 }}>
        <Button 
          size="large" 
          icon={<ReloadOutlined />} 
          onClick={handleReset} 
          style={{ borderRadius: 8 }}
        >
          Reset
        </Button>
        <Button 
          type="primary" 
          size="large" 
          icon={<SaveOutlined />} 
          onClick={handleSave} 
          style={{ background: '#10b981', borderColor: '#10b981', borderRadius: 8, padding: '0 40px' }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
