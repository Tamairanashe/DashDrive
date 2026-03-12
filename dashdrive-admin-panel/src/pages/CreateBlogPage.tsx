import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Upload, 
  message,
  Divider,
  Breadcrumb,
  FloatButton,
  Tooltip,
  Drawer,
  Table,
  Switch,
  Dropdown,
  Menu,
  Tooltip as AntTooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  InboxOutlined, 
  SettingOutlined,
  SaveOutlined,
  SendOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CaretDownOutlined,
  FontSizeOutlined,
  FormatPainterOutlined,
  BlockOutlined,
  BgColorsOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  EyeOutlined,
  RadiusSettingOutlined,
  VerticalAlignMiddleOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LineHeightOutlined,
  BorderOutlined,
  BoldOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  TableOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
  FontColorsOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CameraOutlined,
  ItalicOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const GeminiStar = (props: any) => (
  <span className="anticon" {...props} style={{ display: 'inline-flex', alignItems: 'center', ...props.style }}>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
      <path d="M12 0C12 0 12.5 11.5 24 12C12.5 12.5 12 24 12 24C12 24 11.5 12.5 0 12C11.5 11.5 12 0 12 0Z" fill="currentColor"/>
    </svg>
  </span>
);

export const CreateBlogPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false);
  const [aiStep, setAiStep] = useState<'main' | 'upload' | 'generate'>('main');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  // Category Sample Data
  const [categories, setCategories] = useState([
    { key: '1', sl: 1, name: 'Market Insights', status: true },
    { key: '2', sl: 2, name: 'User Feedback', status: true },
    { key: '3', sl: 3, name: 'Guides & Tutorials', status: true },
    { key: '4', sl: 4, name: 'Business & Growth', status: true },
    { key: '5', sl: 5, name: 'Technology & Product', status: true },
    { key: '6', sl: 6, name: 'Case Studies', status: true },
  ]);
  
  // Image Validation
  const beforeUploadThumbnail = (file: any) => {
    const isAccepted = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
    if (!isAccepted) {
      message.error('You can only upload PNG, JPG, JPEG, WEBP or GIF files!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return (isAccepted && isLt1M) || Upload.LIST_IGNORE;
  };

  const beforeUploadMeta = (file: any) => {
    const isAccepted = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type);
    if (!isAccepted) {
      message.error('You can only upload PNG, JPG, JPEG or GIF files!');
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return (isAccepted && isLt1M) || Upload.LIST_IGNORE;
  };

  // AI Generation Simulation
  const handleGenerateTitle = () => {
    message.loading({ content: 'AI is thinking...', key: 'ai_gen_title' });
    setTimeout(() => {
      message.success({ content: 'Title generated!', key: 'ai_gen_title' });
    }, 1500);
  };

  const handleGenerateDescription = () => {
    message.loading({ content: 'AI is writing your blog...', key: 'ai_gen_desc' });
    setTimeout(() => {
      message.success({ content: 'Content generated!', key: 'ai_gen_desc' });
    }, 2000);
  };

  // RTE Menus
  const styleItems = [
    { key: 'p', label: 'Normal Text' },
    { key: 'blockquote', label: 'Quote Text' },
    { key: 'code', label: 'Code' },
    { type: 'divider' as const },
    { key: 'h1', label: 'Header 1' },
    { key: 'h2', label: 'Header 2' },
    { key: 'h3', label: 'Header 3' },
    { key: 'h4', label: 'Header 4' },
    { key: 'h5', label: 'Header 5' },
    { key: 'h6', label: 'Header 6' },
  ];

  const colorItems = [
    { key: 'black', label: <Space><div style={{ width: 14, height: 14, background: '#000', borderRadius: 2 }} /> Black</Space> },
    { key: 'red', label: <Space><div style={{ width: 14, height: 14, background: '#ff4d4f', borderRadius: 2 }} /> Red</Space> },
    { key: 'green', label: <Space><div style={{ width: 14, height: 14, background: '#52c41a', borderRadius: 2 }} /> Green</Space> },
    { key: 'blue', label: <Space><div style={{ width: 14, height: 14, background: '#1890ff', borderRadius: 2 }} /> Blue</Space> },
    { key: 'transparent', label: 'Transparent' },
  ];

  const paragraphItems = [
    { key: 'left', label: 'Align Left', icon: <AlignLeftOutlined />, extra: 'Ctrl+Shift+L' },
    { key: 'center', label: 'Align Center', icon: <AlignCenterOutlined />, extra: 'Ctrl+Shift+E' },
    { key: 'right', label: 'Align Right', icon: <AlignRightOutlined />, extra: 'Ctrl+Shift+R' },
    { key: 'justify', label: 'Justify Full', icon: <MenuFoldOutlined />, extra: 'Ctrl+Shift+J' },
  ];

  const tableMenu = (
    <div style={{ padding: 12, background: isDark ? '#1f1f1f' : '#fff', border: `1px solid ${isDark ? '#333' : '#f0f0f0'}`, borderRadius: 8 }}>
      <Text style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Select Table Size</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ width: 20, height: 20, border: `1px solid ${isDark ? '#444' : '#d9d9d9'}`, cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb 
          items={[
            { title: <Link to="/content/blog">Content Management</Link> },
            { title: 'Create New Blog' }
          ]} 
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} 
            style={{ borderRadius: 8 }}
          />
          <Title level={3} style={{ margin: 0 }}>Add New Blog Post</Title>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col span={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            {/* Title & Description Section */}
            <Card 
              bordered={false} 
              className="shadow-sm" 
              style={{ borderRadius: 16 }}
            >
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>Title <span style={{ color: '#ff4d4f' }}>*</span></Text>
                  <Button 
                    type="link" 
                    icon={<GeminiStar />} 
                    onClick={handleGenerateTitle}
                    style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                  >
                    Generate
                  </Button>
                </div>
                <Input 
                  size="large" 
                  placeholder="Enter a catchy title..." 
                  style={{ borderRadius: 8, background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#333' : '#d9d9d9' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong>Description <span style={{ color: '#ff4d4f' }}>*</span></Text>
                  <Button 
                    type="link" 
                    icon={<GeminiStar />} 
                    onClick={handleGenerateDescription}
                    style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                  >
                    Generate
                  </Button>
                </div>

                {/* Rich Text Toolbar */}
                <div style={{ 
                  background: isDark ? '#1a1a1a' : '#fff', 
                  border: `1px solid ${isDark ? '#333' : '#d9d9d9'}`, 
                  borderRadius: '8px 8px 0 0',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 4,
                  borderBottom: 'none'
                }}>
                  {/* Style Select */}
                  <Dropdown menu={{ items: styleItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RadiusSettingOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider type="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Formatting */}
                  <AntTooltip title="Bold (Ctrl+B)">
                    <Button size="small" type="text" icon={<BoldOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Underline (Ctrl+U)">
                    <Button size="small" type="text" icon={<UnderlineOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Remove Font Style (Ctrl+\)">
                    <Button size="small" type="text" icon={<FormatPainterOutlined />} />
                  </AntTooltip>
                  
                  {/* Colors */}
                  <Dropdown menu={{ items: colorItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FontColorsOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Dropdown menu={{ items: colorItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BgColorsOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider type="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Lists */}
                  <AntTooltip title="Unordered list (Ctrl+Shift+7)">
                    <Button size="small" type="text" icon={<UnorderedListOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Ordered list (Ctrl+Shift+8)">
                    <Button size="small" type="text" icon={<OrderedListOutlined />} />
                  </AntTooltip>
                  
                   {/* Alignment */}
                  <Dropdown menu={{ items: paragraphItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlignLeftOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider type="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Indent / Outdent */}
                  <AntTooltip title="Outdent (Ctrl+i)">
                    <Button size="small" type="text" icon={<MenuFoldOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Indent (Ctrl+])">
                    <Button size="small" type="text" icon={<MenuUnfoldOutlined />} />
                  </AntTooltip>
                  <Divider type="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Tables */}
                  <Dropdown dropdownRender={() => tableMenu} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TableOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider type="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Media & Tools */}
                  <AntTooltip title="Link (Ctrl+K)">
                    <Button size="small" type="text" icon={<LinkOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Picture Upload">
                    <Button size="small" type="text" icon={<PictureOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Full Screen">
                    <Button size="small" type="text" icon={<FullscreenOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Code View">
                    <Button size="small" type="text" icon={<CodeOutlined />} />
                  </AntTooltip>
                  <AntTooltip title="Help">
                    <Button size="small" type="text" icon={<QuestionCircleOutlined />} />
                  </AntTooltip>
                </div>

                <TextArea 
                  rows={15} 
                  placeholder="Start writing your blog content here..." 
                  style={{ 
                    borderRadius: '0 0 8px 8px', 
                    background: isDark ? '#1a1a1a' : '#fff', 
                    color: isDark ? '#fff' : '#000', 
                    borderColor: isDark ? '#333' : '#d9d9d9',
                    fontSize: 14,
                    lineHeight: '1.6'
                  }}
                />

                {/* Inner Use AI Button */}
                <Button
                  onClick={() => setAiDrawerVisible(true)}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    height: 48,
                    borderRadius: 24,
                    background: '#10b981',
                    borderColor: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    zIndex: 10
                  }}
                >
                  <GeminiStar style={{ fontSize: 20 }} />
                  <span style={{ fontWeight: 600 }}>Use AI</span>
                </Button>
              </div>
            </Card>

            {/* SEO Section */}
            <Card 
              bordered={false} 
              className="shadow-sm" 
              style={{ borderRadius: 16 }}
              title={
                <Space>
                  <SettingOutlined />
                  <Text strong>SEO Settings</Text>
                </Space>
              }
            >
              <Row gutter={24}>
                <Col span={24} style={{ marginBottom: 20 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Meta Title</Text>
                  <Input placeholder="Enter meta title for search engines" />
                </Col>
                <Col span={24} style={{ marginBottom: 20 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Meta Description</Text>
                  <TextArea rows={3} placeholder="Brief summary for SEO snippets" />
                </Col>
                <Col span={24}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Meta Image</Text>
                  <Dragger 
                    maxCount={1}
                    beforeUpload={beforeUploadMeta}
                    accept=".png,.jpg,.jpeg,.gif"
                    style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderRadius: 12 }}
                  >
                    <p className="ant-upload-drag-icon">
                      <CameraOutlined style={{ color: '#10b981' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag SEO social share image</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                      Format: .png, .jpg, .jpeg, .gif | Size: 1MB max | Ratio: 2:1
                    </p>
                  </Dragger>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>

        {/* Info & Settings Sidebar */}
        <Col span={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            {/* General Settings */}
            <Card 
              bordered={false} 
              className="shadow-sm" 
              style={{ borderRadius: 16 }}
              title={<Text strong>General Info</Text>}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>Category *</Text>
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={() => setCategoryModalVisible(true)}
                    style={{ fontSize: 12, color: '#10b981', padding: 0, height: 'auto' }}
                  >
                    Manage Categories
                  </Button>
                </div>
                <Select placeholder="Select Category" style={{ width: '100%' }} size="large">
                  <Option value="business">Business & Growth</Option>
                  <Option value="guides">Guides & Tutorials</Option>
                  <Option value="market">Market Insights</Option>
                </Select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Writer Name *</Text>
                <Input placeholder="Enter writer's name" size="large" />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Publish Date *</Text>
                <DatePicker 
                  style={{ width: '100%' }} 
                  size="large" 
                  format="DD MMM, YYYY"
                />
              </div>
            </Card>

            {/* Media Upload */}
            <Card 
              bordered={false} 
              className="shadow-sm" 
              style={{ borderRadius: 16 }}
              title={<Text strong>Thumbnail Image</Text>}
            >
              <Dragger 
                maxCount={1}
                beforeUpload={beforeUploadThumbnail}
                accept=".png,.jpg,.jpeg,.webp,.gif"
                style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderRadius: 12 }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#10b981' }} />
                </p>
                <p className="ant-upload-text">Click or drag image to upload thumbnail</p>
                <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                  PNG, JPG, JPEG, WEBP, GIF | 1MB max | 325 x 100px
                </p>
              </Dragger>
            </Card>

            {/* Actions */}
            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<SendOutlined />}
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                  Publish Blog
                </Button>
                <Button size="large" icon={<SaveOutlined />}>Save to Draft</Button>
                <Button size="large" danger type="text" icon={<ReloadOutlined />}>Reset Form</Button>
              </div>
            </Card>

          </Space>
        </Col>
      </Row>

      {/* Floating AI Assistant */}
      <FloatButton
        icon={<GeminiStar />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 56, height: 56, background: '#10b981' }}
        tooltip={<div>Ask DashAI for help with this blog</div>}
        onClick={() => setAiDrawerVisible(true)}
      />

      {/* AI Assistant Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {aiStep !== 'main' && (
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => setAiStep('main')}
                style={{ color: '#fff' }}
              />
            )}
            <GeminiStar style={{ color: '#10b981', fontSize: 20 }} />
            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18, fontWeight: 600 }}>
              {aiStep === 'main' ? 'AI Assistant' : aiStep === 'upload' ? 'Upload & Analyze Image' : 'Generate Blog Title'}
            </Text>
          </div>
        }
        placement="right"
        onClose={() => {
          setAiDrawerVisible(false);
          setAiStep('main');
        }}
        open={aiDrawerVisible}
        width={400}
        styles={{
          header: { background: isDark ? '#1a1a1a' : '#fff', borderBottom: `1px solid ${isDark ? '#333' : '#f0f0f0'}` },
          body: { background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#fff' : '#000', padding: 0 }
        }}
        closeIcon={<ArrowLeftOutlined style={{ color: isDark ? '#fff' : '#000', transform: 'rotate(45deg)' }} />} // Placeholder for X
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: isDark ? '#1a1a1a' : '#fff' }}>
          <div style={{ flex: 1, padding: 24 }}>
            {aiStep === 'main' && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <GeminiStar style={{ fontSize: 40, color: '#fff' }} />
                </div>
                <Title level={4} style={{ color: isDark ? '#fff' : '#000', marginBottom: 8 }}>Hi There,</Title>
                <Title level={2} style={{ color: isDark ? '#fff' : '#000', margin: '0 0 16px' }}>I am here to help you!</Title>
                <Paragraph style={{ color: isDark ? '#8e8e8e' : '#64748b', fontSize: 14, marginBottom: 40 }}>
                  I'm your personal assistance to easy your long task smile. Just select below how you give me instruction to get your Blog all Data.
                </Paragraph>

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Button 
                    block 
                    size="large" 
                    icon={<CameraOutlined />}
                    onClick={() => setAiStep('upload')}
                    style={{ 
                      height: 56, 
                      background: 'transparent', 
                      borderColor: '#10b981', 
                      color: '#10b981',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Upload Image
                  </Button>
                  <Button 
                    block 
                    size="large" 
                    icon={<SettingOutlined />}
                    onClick={() => setAiStep('generate')}
                    style={{ 
                      height: 56, 
                      background: isDark ? '#2d2d2d' : '#f1f5f9', 
                      border: 'none', 
                      color: isDark ? '#fff' : '#000',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Generate Blog Title
                  </Button>
                </Space>
              </div>
            )}

            {aiStep === 'upload' && (
              <div>
                <Title level={5} style={{ color: isDark ? '#fff' : '#000', marginBottom: 8 }}>Give the Description & upload image</Title>
                <Paragraph style={{ color: isDark ? '#8e8e8e' : '#64748b', fontSize: 13, marginBottom: 24 }}>
                  Please give proper description & image to generate full data for blog product
                </Paragraph>
                
                <ul style={{ color: isDark ? '#8e8e8e' : '#64748b', paddingLeft: 20, marginBottom: 32 }}>
                   <li>Try to use a clean & avoid blur image</li>
                   <li>Use as close as your product image</li>
                </ul>

                <Dragger 
                  style={{ background: isDark ? '#222' : '#f8fafc', borderRadius: 16, border: `1px dashed ${isDark ? '#444' : '#e2e8f0'}`, marginBottom: 32 }}
                >
                  <p className="ant-upload-drag-icon">
                    <CameraOutlined style={{ color: '#10b981' }} />
                  </p>
                  <p className="ant-upload-text" style={{ color: isDark ? '#fff' : '#000' }}>Add Image</p>
                </Dragger>

                <div style={{ marginBottom: 32 }}>
                  <Text style={{ color: isDark ? '#fff' : '#000', display: 'block', marginBottom: 8 }}>Description</Text>
                  <TextArea 
                    rows={4} 
                    placeholder="Describe about blog"
                    style={{ background: isDark ? '#222' : '#f8fafc', border: `1px solid ${isDark ? '#444' : '#e2e8f0'}`, color: isDark ? '#fff' : '#000', borderRadius: 12 }}
                  />
                </div>

                <Button 
                  type="primary" 
                  block 
                  size="large"
                  style={{ background: '#10b981', height: 48, borderRadius: 12 }}
                >
                  Generate Blog <GeminiStar />
                </Button>
              </div>
            )}

            {aiStep === 'generate' && (
              <div>
                <Title level={3} style={{ color: isDark ? '#fff' : '#000', marginBottom: 8 }}>Great!</Title>
                <Title level={5} style={{ color: isDark ? '#fff' : '#000', marginBottom: 16 }}>Please tell me which blog you want to create. Just type it simply, like:</Title>
                
                <ul style={{ color: isDark ? '#8e8e8e' : '#64748b', paddingLeft: 20, marginBottom: 32 }}>
                   <li>I want to write a blog about the top fashion trends this season</li>
                   <li>I need a blog post on how to choose the right running shoes</li>
                   <li>I want to create content that promotes our new skincare line</li>
                </ul>

                <div style={{ marginBottom: 32 }}>
                  <Text style={{ color: isDark ? '#fff' : '#000', display: 'block', marginBottom: 8 }}>Title</Text>
                  <Input 
                    placeholder="Tell me about your blog"
                    style={{ background: isDark ? '#222' : '#f8fafc', border: `1px solid ${isDark ? '#444' : '#e2e8f0'}`, color: isDark ? '#fff' : '#000', borderRadius: 12, height: 48 }}
                  />
                </div>

                <Button 
                  type="primary" 
                  block 
                  size="large"
                  style={{ background: '#10b981', height: 48, borderRadius: 12 }}
                >
                  Generate Blog <GeminiStar />
                </Button>
              </div>
            )}
          </div>

          <div style={{ 
            padding: '16px 24px', 
            background: isDark ? '#141414' : '#f8fafc', 
            textAlign: 'center',
            borderTop: `1px solid ${isDark ? '#333' : '#f0f0f0'}`
          }}>
            <Text type="secondary" style={{ color: isDark ? '#8e8e8e' : '#64748b', fontSize: 12 }}>
              AI may make mistakes. please recheck important data.
            </Text>
          </div>
        </div>
      </Drawer>

      {/* Category Management Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined style={{ color: '#10b981', fontSize: 20 }} />
            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18, fontWeight: 600 }}>
              Category Setup
            </Text>
          </div>
        }
        placement="right"
        onClose={() => setCategoryModalVisible(false)}
        open={categoryModalVisible}
        width={450}
        styles={{
          header: { background: isDark ? '#1a1a1a' : '#fff', borderBottom: `1px solid ${isDark ? '#333' : '#f0f0f0'}` },
          body: { background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#fff' : '#000', padding: 24 }
        }}
        closeIcon={<ArrowLeftOutlined style={{ color: isDark ? '#fff' : '#000', transform: 'rotate(45deg)' }} />}
      >
        <div style={{ color: isDark ? '#fff' : '#000' }}>
          {/* Add Category Form */}
          <div style={{ marginBottom: 32 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Category Name *</Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input 
                placeholder="Enter category name" 
                style={{ borderRadius: 8, height: 40, background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#d9d9d9' }} 
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <Button block style={{ height: 40, borderRadius: 8 }}>Reset</Button>
                <Button type="primary" block style={{ height: 40, borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}>Submit</Button>
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: isDark ? '#333' : '#f0f0f0' }} />

          {/* Category List Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: isDark ? '#fff' : '#000' }}>Category List</Title>
              <Input 
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                placeholder="Search Category"
                style={{ width: 240, borderRadius: 8, background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#d9d9d9' }}
              />
            </div>

            <Table 
              dataSource={categories}
              pagination={false}
              className={isDark ? 'dark-table' : ''}
              size="small"
              columns={[
                { title: 'SL', dataIndex: 'sl', key: 'sl', width: 50 },
                { title: 'Category', dataIndex: 'name', key: 'name' },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status',
                  width: 70,
                  render: (status) => <Switch checked={status} size="small" style={{ background: status ? '#10b981' : '#d9d9d9' }} />
                },
                { 
                  title: 'Action', 
                  key: 'action',
                  width: 80,
                  render: () => (
                    <Space size="small">
                      <Button type="text" icon={<EditOutlined style={{ color: '#10b981' }} />} size="small" />
                      <Button type="text" icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} size="small" />
                    </Space>
                  )
                }
              ]}
              rowClassName={() => isDark ? 'dark-row' : ''}
              style={{
                borderRadius: 8,
                overflow: 'hidden'
              }}
            />
          </div>
        </div>
      </Drawer>

      <style>{`
        .dark-table .ant-table { background: #1a1a1a !important; color: #fff !important; }
        .dark-table .ant-table-thead > tr > th { background: #141414 !important; color: #fff !important; border-bottom: 1px solid #333 !important; }
        .dark-table .ant-table-tbody > tr > td { background: #1a1a1a !important; color: #fff !important; border-bottom: 1px solid #333 !important; }
        .dark-table .ant-table-tbody > tr:hover > td { background: #262626 !important; }
      `}</style>
    </div>
  );
};
