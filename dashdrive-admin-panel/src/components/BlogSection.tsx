import React, { useState } from 'react';
import { 
  Typography, 
  Switch, 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  DatePicker, 
  Table, 
  Space, 
  Button, 
  Tag, 
  Tooltip,
  Divider,
  Badge,
  Dropdown
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  SyncOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const BlogSection: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [blogActive, setBlogActive] = useState(true);

  const blogData = [
    {
      key: '1',
      id: '#1008',
      category: 'Business & Growth',
      title: 'Rapid Routes, Happy Clients: How DriveMond is redefining parcel delivery',
      writer: 'Michael Lee',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '2',
      id: '#1007',
      category: 'Guides & Tutorials',
      title: 'How to Integrate Your Business Tools with Our Ride Sharing Solutions',
      writer: 'Alex Johnson',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '3',
      id: '#1006',
      category: 'Market Insights',
      title: 'Key Insights from Our Users on Ride Sharing Benefits',
      writer: 'Emily Carter',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '4',
      id: '#1005',
      category: 'User Feedback',
      title: 'How Our Ride Sharing Solutions Have Transformed Customer Experiences',
      writer: 'Michael Lee',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '5',
      id: '#1004',
      category: 'Business & Growth',
      title: 'Enhancing Public Transit with Ride Sharing Services',
      writer: 'Alex Johnson',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '6',
      id: '#1003',
      category: 'Case Studies',
      title: 'Real-World Applications of Ride Sharing in Urban Planning',
      writer: 'Michael Lee',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '7',
      id: '#1002',
      category: 'Technology & Product',
      title: 'Seamlessly Integrate Your Business Tools with Our Ride Sharing Solutions',
      writer: 'Emily Carter',
      publishDate: '01 Feb, 2026',
      status: true,
    },
    {
      key: '8',
      id: '#1001',
      category: 'Business & Growth',
      title: 'Top Benefits of Using a Ride-Sharing App for Your Business',
      writer: 'Alex Johnson',
      publishDate: '01 Feb, 2026',
      status: true,
    },
  ];

  const columns = [
    {
      title: 'SL',
      dataIndex: 'key',
      key: 'key',
      width: 60,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color={isDark ? 'cyan' : 'blue'}>{cat}</Tag>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 350,
      render: (text: string) => <Text strong style={{ color: isDark ? '#e3e3e3' : 'inherit' }}>{text}</Text>,
    },
    {
      title: 'Writer',
      dataIndex: 'writer',
      key: 'writer',
    },
    {
      title: 'Publish Date',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Switch 
          size="small" 
          checked={status} 
          style={{ background: status ? '#10b981' : undefined }} 
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as const,
      render: () => (
        <Space>
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined style={{ color: '#10b981' }} />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Blog Activation Toggle */}
      <Card 
        bordered={false} 
        className="shadow-sm"
        style={{ borderRadius: 12 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>Activate Blog</Title>
            <Text type="secondary">Enabling this option will make the blog section visible on the website for viewers</Text>
          </div>
          <Switch 
            checked={blogActive} 
            onChange={setBlogActive} 
            style={{ background: blogActive ? '#10b981' : undefined }}
          />
        </div>
      </Card>

      {/* Intro Section Preview */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Blog Intro Section Preview</Title>
            <Tooltip title="See how your blog intro section setup will look to customers.">
              <InfoCircleOutlined style={{ color: '#8e8e8e' }} />
            </Tooltip>
          </div>
        }
      >
        <div style={{ 
          background: isDark ? '#1a1a1a' : '#f8fafc', 
          padding: 32, 
          borderRadius: 12, 
          textAlign: 'center',
          border: `1px dashed ${isDark ? '#333' : '#e2e8f0'}`
        }}>
          <Title level={3} style={{ marginBottom: 8, color: isDark ? '#e3e3e3' : '#0f172a' }}>Enter Blog Title</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Enter Blog Sub Title</Text>
        </div>
      </Card>

      {/* Configuration Section */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
             title={<Title level={5} style={{ margin: 0 }}>Intro Section</Title>}
             bordered={false}
             className="shadow-sm"
             style={{ borderRadius: 12 }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Title *</Text>
                  <Input 
                    placeholder="Enter Blog Title" 
                    maxLength={100} 
                    suffix={<Text type="secondary" style={{ fontSize: 12 }}>0/100</Text>}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Sub Title *</Text>
                  <Input 
                    placeholder="Enter Blog Sub Title" 
                    maxLength={255} 
                    suffix={<Text type="secondary" style={{ fontSize: 12 }}>0/255</Text>}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FilterOutlined style={{ color: '#10b981' }} />
            <Title level={5} style={{ margin: 0 }}>Filter Blog</Title>
          </div>
        }
        bordered={false}
        className="shadow-sm"
        style={{ borderRadius: 12 }}
      >
        <Row gutter={16} align="bottom">
          <Col span={6}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Category</Text>
            <Select placeholder="Select Category" style={{ width: '100%' }}>
              <Option value="business">Business & Growth</Option>
              <Option value="guides">Guides & Tutorials</Option>
              <Option value="market">Market Insights</Option>
              <Option value="feedback">User Feedback</Option>
            </Select>
          </Col>
          <Col span={6}>
             <Text strong style={{ display: 'block', marginBottom: 8 }}>Publish Date</Text>
             <DatePicker style={{ width: '100%' }} format="DD MMM, YYYY" />
          </Col>
          <Col span={8}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Search by Title</Text>
            <Input prefix={<SearchOutlined />} placeholder="Search by Title" />
          </Col>
          <Col span={4}>
            <Button block style={{ height: 32 }}>Reset Filters</Button>
          </Col>
        </Row>
      </Card>

      {/* Blog Table Toolbar */}
      <Card bordered={false} className="shadow-sm" style={{ borderRadius: 12, marginBottom: -16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Space>
            <Input 
              placeholder="Search by Title, ID..." 
              style={{ width: 250 }}
              prefix={<SearchOutlined style={{ color: '#8e8e8e' }} />}
            />
            <Button type="primary">Search</Button>
          </Space>
          
          <Space size="middle">
            <Tooltip title="Refresh">
              <Button 
                icon={<SyncOutlined />} 
                style={{ background: isDark ? '#2d2d2d' : '#f1f5f9', border: 'none' }}
              />
            </Tooltip>
            
            <Dropdown
              menu={{
                items: [
                  { key: 'excel', label: 'Excel (.xlsx)' },
                  { key: 'csv', label: 'CSV (.csv)' },
                  { key: 'pdf', label: 'PDF (.pdf)' },
                ],
              }}
              trigger={['click']}
            >
              <Button style={{ background: isDark ? '#2d2d2d' : '#f1f5f9', border: 'none' }}>
                Download <DownloadOutlined />
              </Button>
            </Dropdown>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ background: '#10b981', borderColor: '#10b981' }}
              onClick={() => navigate('/content/blog/create')}
            >
              Create Blog
            </Button>
          </Space>
        </div>
      </Card>

      {/* Blog List Table */}
      <Card bordered={false} className="shadow-sm" style={{ borderRadius: 12 }}>
        <Table 
          columns={columns} 
          dataSource={blogData} 
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};
