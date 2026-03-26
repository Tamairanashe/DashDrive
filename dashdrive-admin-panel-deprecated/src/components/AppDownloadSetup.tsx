import React, { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Switch,
  Button,
  Space,
  Upload,
  message,
  Divider,
  Tooltip,
  Alert,
  Badge
} from 'antd';
import {
  InfoCircleOutlined,
  AndroidOutlined,
  AppleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  CheckCircleFilled,
  PictureOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const AppDownloadSetup: React.FC = () => {
  const { isDark } = useTheme();
  const [active, setActive] = useState(true);
  
  // State for Driver App Section
  const [driverTitle, setDriverTitle] = useState('');
  const [driverSubtitle, setDriverSubtitle] = useState('');
  
  // State for User App Section
  const [userTitle, setUserTitle] = useState('');
  const [userSubtitle, setUserSubtitle] = useState('');
  const [userPlayStore, setUserPlayStore] = useState(true);
  const [userAppleStore, setUserAppleStore] = useState(true);

  const beforeUpload = (file: any) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must be smaller than 1MB!');
    }
    return isLt1M || Upload.LIST_IGNORE;
  };

  const handleReset = () => {
    setDriverTitle('');
    setDriverSubtitle('');
    setUserTitle('');
    setUserSubtitle('');
    message.info('Form has been reset');
  };

  const handleSave = () => {
    message.success('Settings saved successfully');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Visibility Status */}
      <Card 
        bordered={false} 
        className="shadow-sm"
        style={{ borderRadius: 12 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>Status</Title>
            <Text type="secondary">If you turn of the availability status, this section will not show in the website</Text>
          </div>
          <Switch 
            checked={active} 
            onChange={setActive} 
            style={{ background: active ? '#10b981' : undefined }}
          />
        </div>
      </Card>

      {/* App Download Setup Section */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title level={5} style={{ margin: 0 }}>App Download Setup Section</Title>
            <Tooltip title="See how your app download setup section will look to customers.">
              <InfoCircleOutlined style={{ color: '#8e8e8e' }} />
            </Tooltip>
          </div>
        }
      >
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>See how your app download setup section will look to customers.</Paragraph>
        
        <div style={{ 
          background: isDark ? '#1a1a1a' : '#f8fafc', 
          padding: 40, 
          borderRadius: 20, 
          border: `1px dashed ${isDark ? '#333' : '#e2e8f0'}`,
          textAlign: 'center'
        }}>
          <Row gutter={[48, 48]} justify="center">
            <Col span={10}>
                <div style={{ padding: 24, background: isDark ? '#141414' : '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Text strong type="secondary" style={{ fontSize: 10, display: 'block', marginBottom: 12, letterSpacing: '0.1em' }}>DRIVER APP PREVIEW</Text>
                    <Title level={4} style={{ marginBottom: 8 }}>{driverTitle || 'Ex: Ride Sharing'}</Title>
                    <Paragraph type="secondary" style={{ fontSize: 13 }}>{driverSubtitle || 'Ex: Section Description'}</Paragraph>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                        <Button icon={<AndroidOutlined />} style={{ borderRadius: 8, height: 40, display: 'flex', alignItems: 'center' }}>Google Play</Button>
                        <Button icon={<AppleOutlined />} style={{ borderRadius: 8, height: 40, display: 'flex', alignItems: 'center' }}>App Store</Button>
                    </div>
                </div>
            </Col>
            <Col span={10}>
                <div style={{ padding: 24, background: isDark ? '#141414' : '#fff', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Text strong type="secondary" style={{ fontSize: 10, display: 'block', marginBottom: 12, letterSpacing: '0.1em' }}>USER APP PREVIEW</Text>
                    <Title level={4} style={{ marginBottom: 8 }}>{userTitle || 'Ex: Ride Sharing'}</Title>
                    <Paragraph type="secondary" style={{ fontSize: 13 }}>{userSubtitle || 'Ex: Section Description'}</Paragraph>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                        {userPlayStore && <Button icon={<AndroidOutlined />} style={{ borderRadius: 8, height: 40, display: 'flex', alignItems: 'center' }}>Google Play</Button>}
                        {userAppleStore && <Button icon={<AppleOutlined />} style={{ borderRadius: 8, height: 40, display: 'flex', alignItems: 'center' }}>App Store</Button>}
                    </div>
                </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Download The Driver App Button section */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={<Title level={5} style={{ margin: 0 }}>Download The Driver App Button</Title>}
      >
        <Paragraph type="secondary">Configure the section content by setting the title and subtitle</Paragraph>
        
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Title *</Text>
              <Input 
                placeholder="Ex: Ride Sharing" 
                maxLength={100} 
                value={driverTitle}
                onChange={e => setDriverTitle(e.target.value)}
                suffix={<Text type="secondary" style={{ fontSize: 12 }}>{driverTitle.length}/100</Text>}
              />
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Sub Title *</Text>
              <Input 
                placeholder="Ex: Section Description" 
                maxLength={200}
                value={driverSubtitle}
                onChange={e => setDriverSubtitle(e.target.value)}
                suffix={<Text type="secondary" style={{ fontSize: 12 }}>{driverSubtitle.length}/200</Text>}
              />
            </div>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 8, marginBottom: 16 }}>Download Buttons</Title>
        <Paragraph type="secondary">Complete the setup of the app store download buttons you want to display to users.</Paragraph>
        
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card size="small" style={{ borderRadius: 12, border: `1px solid ${isDark ? '#333' : '#f0f0f0'}` }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <AndroidOutlined />
                    </div>
                    <Text strong>Play Store Button</Text>
                </Space>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: isDark ? '#1a2b25' : '#f6ffed', padding: '12px 16px', borderRadius: 8, border: `1px solid ${isDark ? '#234438' : '#b7eb8f'}` }}>
                    <CheckCircleFilled style={{ color: '#52c41a', marginTop: 4 }} />
                    <Text style={{ fontSize: 12 }}>App download button is connected successfully. Data is synced from App Version Setup</Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" style={{ borderRadius: 12, border: `1px solid ${isDark ? '#333' : '#f0f0f0'}` }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <AppleOutlined />
                    </div>
                    <Text strong>Apple Store Button</Text>
                </Space>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: isDark ? '#1a2b25' : '#f6ffed', padding: '12px 16px', borderRadius: 8, border: `1px solid ${isDark ? '#234438' : '#b7eb8f'}` }}>
                    <CheckCircleFilled style={{ color: '#52c41a', marginTop: 4 }} />
                    <Text style={{ fontSize: 12 }}>App download button is connected successfully. Data is synced from App Version Setup</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Download The User App Button section */}
      <Card 
        bordered={false} 
        className="shadow-sm" 
        style={{ borderRadius: 12 }}
        title={<Title level={5} style={{ margin: 0 }}>Download The User App Button</Title>}
      >
        <Paragraph type="secondary">Here you can setup the necessary information related to the app download option</Paragraph>

        <Row gutter={48}>
          <Col span={14}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Title *</Text>
              <Input 
                placeholder="Ex: Ride Sharing" 
                maxLength={100} 
                value={userTitle}
                onChange={e => setUserTitle(e.target.value)}
                suffix={<Text type="secondary" style={{ fontSize: 12 }}>{userTitle.length}/100</Text>}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Sub Title *</Text>
              <Input.TextArea 
                placeholder="Ex: Section Description" 
                maxLength={200}
                rows={3}
                value={userSubtitle}
                onChange={e => setUserSubtitle(e.target.value)}
                style={{ borderRadius: 8 }}
              />
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{userSubtitle.length}/200</Text>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Background Image</Text>
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={beforeUpload}
                showUploadList={true}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PlusOutlined />
                  <div style={{ marginTop: 8, fontSize: 12 }}>No file chosen</div>
                </div>
              </Upload>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
                .png, .jpg, .jpeg, .webp, .gif, Image Size - Max 1MB (1:1)
              </Text>
            </div>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 16, marginBottom: 16 }}>Download Buttons</Title>
        <Paragraph type="secondary">Please select the options that you would like to make visible to your users</Paragraph>

        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card size="small" style={{ borderRadius: 12, border: `1px solid ${isDark ? '#333' : '#f0f0f0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space orientation="vertical" size={12} style={{ width: '80%' }}>
                    <Space>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <AndroidOutlined />
                        </div>
                        <Text strong>Play Store Button</Text>
                    </Space>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: isDark ? '#1a2b25' : '#f6ffed', padding: '8px 12px', borderRadius: 8, border: `1px solid ${isDark ? '#234438' : '#b7eb8f'}` }}>
                        <CheckCircleFilled style={{ color: '#52c41a', marginTop: 2, fontSize: 12 }} />
                        <Text style={{ fontSize: 11 }}>App download button is connected successfully. Data is synced from App Version Setup</Text>
                    </div>
                </Space>
                <Switch checked={userPlayStore} onChange={setUserPlayStore} style={{ background: userPlayStore ? '#10b981' : undefined }} />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" style={{ borderRadius: 12, border: `1px solid ${isDark ? '#333' : '#f0f0f0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space orientation="vertical" size={12} style={{ width: '80%' }}>
                    <Space>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <AppleOutlined />
                        </div>
                        <Text strong>Apple Store Button</Text>
                    </Space>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: isDark ? '#1a2b25' : '#f6ffed', padding: '8px 12px', borderRadius: 8, border: `1px solid ${isDark ? '#234438' : '#b7eb8f'}` }}>
                        <CheckCircleFilled style={{ color: '#52c41a', marginTop: 2, fontSize: 12 }} />
                        <Text style={{ fontSize: 11 }}>App download button is connected successfully. Data is synced from App Version Setup. with reset and save buttons</Text>
                    </div>
                </Space>
                <Switch checked={userAppleStore} onChange={setUserAppleStore} style={{ background: userAppleStore ? '#10b981' : undefined }} />
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Footer Actions */}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 40 }}>
        <Button size="large" icon={<ReloadOutlined />} onClick={handleReset} style={{ borderRadius: 8 }}>Reset</Button>
        <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave} style={{ background: '#10b981', borderColor: '#10b981', borderRadius: 8, padding: '0 40px' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

