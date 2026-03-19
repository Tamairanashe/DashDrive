import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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
  Modal,
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
  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false);
  
  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogCategory, setBlogCategory] = useState<string | undefined>(undefined);
  const [writerName, setWriterName] = useState('');
  const [publishDate, setPublishDate] = useState<any>(null);
  
  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [helpDrawerVisible, setHelpDrawerVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCodeView, setIsCodeView] = useState(false);
  
  const quillRef = useRef<ReactQuill>(null);
  const textAreaRef = useRef<any>(null);

  const handleFormat = (format: string, value: any = true) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (range) {
      if (format === 'clean') {
        quill.removeFormat(range.index, range.length);
      } else {
        // Toggle format if no value is provided and it's a boolean format
        const currentFormat = quill.getFormat(range);
        const newValue = (value === true && currentFormat[format]) ? false : value;
        quill.format(format, newValue);
      }
    }
  };

  const handleLink = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const url = prompt('Enter URL:', 'https://');
    if (url) quill.format('link', url);
  };

  const handleImage = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const url = prompt('Enter Image URL:', 'https://');
    if (url) {
      quill.insertEmbed(range.index, 'image', url);
    }
  };

  const handleTable = () => {
    message.info('Table insertion simplified: use the grid below to insert a basic structure.');
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;
    
    quill.insertText(range.index, "\n[Table Placeholder - Use specialized tool for complex tables]\n");
  };

  const handleColor = (color: string, type: 'text' | 'bg') => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    if (type === 'text') quill.format('color', color);
    else quill.format('background', color);
  };

  const handleStyleChange = (key: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    if (key === 'p') quill.format('header', false);
    else if (key.startsWith('h')) quill.format('header', parseInt(key.substring(1)));
    else if (key === 'blockquote') quill.format('blockquote', true);
    else if (key === 'code') quill.format('code-block', true);
  };

  const handleAlign = (align: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    quill.format('align', align === 'left' ? false : align);
  };
  
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
    if (!blogTitle && aiStep === 'main') {
        message.warning('Please enter a topic or some keywords first');
        return;
    }
    message.loading({ content: 'DashAI is brainstorming titles...', key: 'ai_gen_title' });
    setTimeout(() => {
      const titles = [
        "Revolutionizing Urban Mobility: The DashDrive Story",
        "Why Ride-Sharing is the Future of Sustainable Cities",
        "10 Tips for Maximizing Your Fleet Efficiency",
        "The Impact of AI on Modern Logistics and Delivery",
        "Future of Transportation: From EVs to Autonomous Fleets"
      ];
      const generated = titles[Math.floor(Math.random() * titles.length)];
      setBlogTitle(generated);
      message.success({ content: 'Title generated by DashAI!', key: 'ai_gen_title' });
    }, 1500);
  };

  const handleGenerateDescription = () => {
    if (!blogTitle) {
      message.warning('Please provide a title first so AI can write relevant content');
      return;
    }
    message.loading({ content: 'DashAI is writing your blog post...', key: 'ai_gen_desc' });
    setTimeout(() => {
      const content = `<h3>Introduction</h3><p>In today's fast-paced world, the landscape of <strong>${blogTitle.toLowerCase()}</strong> is changing more rapidly than ever. As urban populations grow, the need for efficient, scalable, and sustainable solutions becomes critical.</p><h3>The Challenge</h3><p>Traditional systems are often siloed and inefficient, leading to increased costs and reduced satisfaction. This is where modern technology and data-driven approaches step in.</p><h3>Our Solution</h3><p>At DashDrive, we've developed a suite of tools designed to address these exact pain points. By leveraging AI and real-time analytics, we enable our partners to:</p><ul><li>Optimize route planning</li><li>Reduce idle time</li><li>Enhance user experience</li></ul><h3>Conclusion</h3><p>The future of mobility is connected, intelligent, and user-centric. Stay tuned for more updates as we continue to innovate!</p>`;
      setBlogDescription(content);
      message.success({ content: 'Blog content generated successfully!', key: 'ai_gen_desc' });
    }, 2000);
  };

  const handleAIAssistantGenerate = () => {
    setLoading(true);
    message.loading({ content: 'Analyzing requirements and generating blog...', key: 'ai_assistant' });
    
    setTimeout(() => {
        const topic = aiPrompt || aiDescription || "Our New Services";
        setBlogTitle(`Exploring ${topic}: A Deep Dive`);
        setBlogDescription(`<h3>Overview</h3><p>This blog post explores the intricacies of <strong>${topic}</strong>. We discuss why it matters in the current market and how DashDrive is leading the way.</p><h3>Key Takeaways</h2><ul><li>Innovation is at the core of our strategy.</li><li>Scale is achieved through smart partnerships.</li><li>User feedback drives our product roadmap.</li></ul>`);
        setBlogCategory('business');
        setWriterName('DashAI Assistant');
        
        setLoading(false);
        setAiDrawerVisible(false);
        setAiStep('main');
        setAiPrompt('');
        setAiDescription('');
        
        message.success({ content: 'Full blog post generated and populated!', key: 'ai_assistant' });
    }, 2500);
  };

  // RTE Menus
  const styleItems = [
    { key: 'p', label: 'Normal Text', onClick: () => handleStyleChange('p') },
    { key: 'blockquote', label: 'Quote Text', onClick: () => handleStyleChange('blockquote') },
    { key: 'code', label: 'Code', onClick: () => handleStyleChange('code') },
    { type: 'divider' as const },
    { key: 'h1', label: 'Header 1', onClick: () => handleStyleChange('h1') },
    { key: 'h2', label: 'Header 2', onClick: () => handleStyleChange('h2') },
    { key: 'h3', label: 'Header 3', onClick: () => handleStyleChange('h3') },
    { key: 'h4', label: 'Header 4', onClick: () => handleStyleChange('h4') },
    { key: 'h5', label: 'Header 5', onClick: () => handleStyleChange('h5') },
    { key: 'h6', label: 'Header 6', onClick: () => handleStyleChange('h6') },
  ];

  const colorItems = [
    { key: 'black', label: <Space onClick={() => handleColor('#000', 'text')}><div style={{ width: 14, height: 14, background: '#000', borderRadius: 2 }} /> Black</Space> },
    { key: 'red', label: <Space onClick={() => handleColor('#ff4d4f', 'text')}><div style={{ width: 14, height: 14, background: '#ff4d4f', borderRadius: 2 }} /> Red</Space> },
    { key: 'green', label: <Space onClick={() => handleColor('#52c41a', 'text')}><div style={{ width: 14, height: 14, background: '#52c41a', borderRadius: 2 }} /> Green</Space> },
    { key: 'blue', label: <Space onClick={() => handleColor('#1890ff', 'text')}><div style={{ width: 14, height: 14, background: '#1890ff', borderRadius: 2 }} /> Blue</Space> },
    { key: 'transparent', label: <div onClick={() => handleColor('transparent', 'text')}>Transparent</div> },
  ];

  const bgColorItems = [
    { key: 'white', label: <Space onClick={() => handleColor('#fff', 'bg')}><div style={{ width: 14, height: 14, background: '#fff', borderRadius: 2, border: '1px solid #ddd' }} /> White</Space> },
    { key: 'yellow', label: <Space onClick={() => handleColor('#fffb8f', 'bg')}><div style={{ width: 14, height: 14, background: '#fffb8f', borderRadius: 2 }} /> Highlight</Space> },
    { key: 'green', label: <Space onClick={() => handleColor('#b7eb8f', 'bg')}><div style={{ width: 14, height: 14, background: '#b7eb8f', borderRadius: 2 }} /> Light Green</Space> },
    { key: 'blue', label: <Space onClick={() => handleColor('#91d5ff', 'bg')}><div style={{ width: 14, height: 14, background: '#91d5ff', borderRadius: 2 }} /> Light Blue</Space> },
  ];

  const paragraphItems = [
    { key: 'left', label: 'Align Left', icon: <AlignLeftOutlined />, extra: 'Ctrl+Shift+L', onClick: () => handleAlign('left') },
    { key: 'center', label: 'Align Center', icon: <AlignCenterOutlined />, extra: 'Ctrl+Shift+E', onClick: () => handleAlign('center') },
    { key: 'right', label: 'Align Right', icon: <AlignRightOutlined />, extra: 'Ctrl+Shift+R', onClick: () => handleAlign('right') },
    { key: 'justify', label: 'Justify Full', icon: <MenuFoldOutlined />, extra: 'Ctrl+Shift+J', onClick: () => handleAlign('justify') },
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
    <div style={{ 
      maxWidth: isFullscreen ? '100%' : 1200, 
      margin: isFullscreen ? 0 : '0 auto', 
      paddingBottom: 100,
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      right: isFullscreen ? 0 : 'auto',
      bottom: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 1000 : 1,
      background: isDark ? '#141414' : '#f0f2f5',
      overflow: isFullscreen ? 'auto' : 'visible',
      padding: isFullscreen ? '24px' : '0 0 100px 0'
    }}>
      {/* Help Modal */}
      <Drawer
        title={<Space><QuestionCircleOutlined style={{ color: '#10b981' }} /> Editor Help & Shortcuts</Space>}
        open={helpDrawerVisible}
        onClose={() => setHelpDrawerVisible(false)}
        extra={[
          <Button key="close" type="primary" onClick={() => setHelpDrawerVisible(false)} style={{ background: '#10b981', borderColor: '#10b981' }}>
            Got it!
          </Button>
        ]}
        width={500}
        styles={{
          header: { background: isDark ? '#1a1a1a' : '#fff' },
          body: { background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#fff' : '#000' }
        }}
      >
        <div style={{ padding: '10px 0' }}>
          <Title level={5}>Keyboard Shortcuts</Title>
          <ul style={{ paddingLeft: 20 }}>
            <li><Text strong>Ctrl + B</Text>: Bold</li>
            <li><Text strong>Ctrl + U</Text>: Underline</li>
            <li><Text strong>Ctrl + I</Text>: Italic</li>
            <li><Text strong>Ctrl + Shift + L</Text>: Align Left</li>
            <li><Text strong>Ctrl + Shift + E</Text>: Align Center</li>
            <li><Text strong>Ctrl + Shift + R</Text>: Align Right</li>
            <li><Text strong>Ctrl + Shift + J</Text>: Justify Full</li>
          </ul>
          
          <Divider />
          
          <Title level={5}>Markdown & HTML Support</Title>
          <Paragraph>
            The editor supports basic markdown and HTML tags for advanced styling. Use the toolbar buttons to automatically wrap selected text.
          </Paragraph>
          
          <Title level={5}>AI Assistance</Title>
          <Paragraph>
            Click the <GeminiStar /> icon or use the "Generate" buttons to have AI help you write titles, descriptions, and full blog posts from images.
          </Paragraph>
        </div>
      </Drawer>

      {/* Header */}
      {!isFullscreen && (
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
      )}

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col span={16}>
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            
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
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
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
                  <Divider orientation="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Formatting */}
                  <AntTooltip title="Bold (Ctrl+B)">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<BoldOutlined />} 
                      onClick={() => handleFormat('bold')}
                    />
                  </AntTooltip>
                  <AntTooltip title="Underline (Ctrl+U)">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<UnderlineOutlined />} 
                      onClick={() => handleFormat('underline')}
                    />
                  </AntTooltip>
                  <AntTooltip title="Italic (Ctrl+I)">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<ItalicOutlined />} 
                      onClick={() => handleFormat('italic')}
                    />
                  </AntTooltip>
                  {/* Formatting Painter */}
                  <AntTooltip title="Remove Font Style (Ctrl+\)">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<FormatPainterOutlined />} 
                      onClick={() => {
                        const newText = blogDescription.replace(/<\/?[^>]+(>|$)/g, "");
                        setBlogDescription(newText);
                        message.info('Styles removed');
                      }}
                    />
                  </AntTooltip>
                  
                  {/* Colors */}
                  <Dropdown menu={{ items: colorItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FontColorsOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Dropdown menu={{ items: bgColorItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BgColorsOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider orientation="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Lists */}
                  <AntTooltip title="Unordered list">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<UnorderedListOutlined />} 
                      onClick={() => handleFormat('list', 'bullet')}
                    />
                  </AntTooltip>
                  <AntTooltip title="Ordered list">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<OrderedListOutlined />} 
                      onClick={() => handleFormat('list', 'ordered')}
                    />
                  </AntTooltip>
                  
                   {/* Alignment */}
                  <Dropdown menu={{ items: paragraphItems }} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlignLeftOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider orientation="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Indent / Outdent */}
                  <AntTooltip title="Outdent">
                    <Button size="small" type="text" icon={<MenuFoldOutlined />} onClick={() => handleFormat('indent', '-1')} />
                  </AntTooltip>
                  <AntTooltip title="Indent">
                    <Button size="small" type="text" icon={<MenuUnfoldOutlined />} onClick={() => handleFormat('indent', '+1')} />
                  </AntTooltip>
                  <Divider orientation="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Tables */}
                  <Dropdown dropdownRender={() => (
                    <div style={{ padding: 12, background: isDark ? '#1f1f1f' : '#fff', border: `1px solid ${isDark ? '#333' : '#f0f0f0'}`, borderRadius: 8 }}>
                      <Text style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>Insert Table</Text>
                      <Button type="primary" size="small" onClick={handleTable} block>Insert 2x2 Grid</Button>
                    </div>
                  )} trigger={['click']}>
                    <Button size="small" type="text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TableOutlined /> <CaretDownOutlined style={{ fontSize: 10 }} />
                    </Button>
                  </Dropdown>
                  <Divider orientation="vertical" style={{ height: 20, borderColor: isDark ? '#333' : '#d9d9d9' }} />

                  {/* Media & Tools */}
                  <AntTooltip title="Link (Ctrl+K)">
                    <Button size="small" type="text" icon={<LinkOutlined />} onClick={handleLink} />
                  </AntTooltip>
                  <AntTooltip title="Picture Upload">
                    <Button size="small" type="text" icon={<PictureOutlined />} onClick={handleImage} />
                  </AntTooltip>
                  <AntTooltip title="Full Screen">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<FullscreenOutlined />} 
                      onClick={() => {
                        setIsFullscreen(!isFullscreen);
                        message.info(isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
                      }}
                    />
                  </AntTooltip>
                  <AntTooltip title="Code View">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<CodeOutlined />} 
                      onClick={() => setIsCodeView(!isCodeView)}
                    />
                  </AntTooltip>
                  <AntTooltip title="Help">
                    <Button 
                      size="small" 
                      type="text" 
                      icon={<QuestionCircleOutlined />} 
                      onClick={() => setHelpDrawerVisible(true)}
                    />
                  </AntTooltip>
                </div>

                {isCodeView ? (
                  <TextArea 
                    ref={textAreaRef}
                    rows={isFullscreen ? 30 : 15} 
                    placeholder="Start writing your blog content here..." 
                    value={blogDescription}
                    onChange={(e) => setBlogDescription(e.target.value)}
                    style={{ 
                      borderRadius: '0 0 8px 8px', 
                      background: isDark ? '#000' : '#f5f5f5', 
                      color: isDark ? '#0f0' : '#444', 
                      borderColor: isDark ? '#333' : '#d9d9d9',
                      fontSize: 13,
                      fontFamily: 'monospace',
                      lineHeight: '1.6'
                    }}
                  />
                ) : (
                  <div style={{ 
                    borderRadius: '0 0 8px 8px', 
                    border: `1px solid ${isDark ? '#333' : '#d9d9d9'}`,
                    borderTop: 'none',
                    minHeight: isFullscreen ? '400px' : '300px'
                  }}>
                    <ReactQuill 
                      ref={quillRef}
                      theme="snow"
                      value={blogDescription}
                      onChange={setBlogDescription}
                      placeholder="Start writing your blog content here..."
                      style={{ 
                        height: isFullscreen ? 'calc(100vh - 350px)' : '300px',
                        background: isDark ? '#1a1a1a' : '#fff',
                        color: isDark ? '#fff' : '#000'
                      }}
                      modules={{
                        toolbar: false, // We use our custom toolbar
                      }}
                    />
                  </div>
                )}

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
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            
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
                    onClick={() => setCategoryDrawerVisible(true)}
                    style={{ fontSize: 12, color: '#10b981', padding: 0, height: 'auto' }}
                  >
                    Manage Categories
                  </Button>
                </div>
                <Select 
                  placeholder="Select Category" 
                  style={{ width: '100%' }} 
                  size="large"
                  value={blogCategory}
                  onChange={(val) => setBlogCategory(val)}
                >
                  <Option value="business">Business & Growth</Option>
                  <Option value="guides">Guides & Tutorials</Option>
                  <Option value="market">Market Insights</Option>
                </Select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Writer Name *</Text>
                <Input 
                  placeholder="Enter writer's name" 
                  size="large" 
                  value={writerName}
                  onChange={(e) => setWriterName(e.target.value)}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Publish Date *</Text>
                <DatePicker 
                  style={{ width: '100%' }} 
                  size="large" 
                  format="DD MMM, YYYY"
                  value={publishDate}
                  onChange={(date) => setPublishDate(date)}
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
                <Button 
                  size="large" 
                  danger 
                  type="text" 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setBlogTitle('');
                    setBlogDescription('');
                    setBlogCategory(undefined);
                    setWriterName('');
                    setPublishDate(null);
                    message.info('Form reset');
                  }}
                >
                  Reset Form
                </Button>
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

                <Space orientation="vertical" style={{ width: '100%' }} size="middle">
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
                  multiple={false}
                  showUploadList={false}
                  onChange={(info) => {
                    const { status } = info.file;
                    if (status === 'uploading') {
                      setUploadLoading(true);
                      message.loading({ content: 'Analyzing image...', key: 'ai_upload' });
                    }
                    if (status === 'done' || status === 'error') {
                      // Simulate successful analysis even on error for mock purposes
                      setUploadLoading(false);
                      message.success({ content: 'Image analyzed! AI is ready.', key: 'ai_upload' });
                      setAiDescription('A high-quality image of ' + info.file.name);
                    }
                  }}
                  customRequest={({ onSuccess }: any) => {
                    setTimeout(() => onSuccess("ok"), 1000);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <CameraOutlined style={{ color: '#10b981' }} />
                  </p>
                  <p className="ant-upload-text" style={{ color: isDark ? '#fff' : '#000' }}>
                    {uploadLoading ? 'Analyzing...' : 'Add Image'}
                  </p>
                </Dragger>

                <div style={{ marginBottom: 32 }}>
                  <Text style={{ color: isDark ? '#fff' : '#000', display: 'block', marginBottom: 8 }}>Description</Text>
                  <TextArea 
                    rows={4} 
                    placeholder="Describe about blog"
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    style={{ background: isDark ? '#222' : '#f8fafc', border: `1px solid ${isDark ? '#444' : '#e2e8f0'}`, color: isDark ? '#fff' : '#000', borderRadius: 12 }}
                  />
                </div>

                <Button 
                  type="primary" 
                  block 
                  size="large"
                  onClick={handleAIAssistantGenerate}
                  loading={loading}
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
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
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
        onClose={() => setCategoryDrawerVisible(false)}
        open={categoryDrawerVisible}
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

