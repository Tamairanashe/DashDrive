import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Typography, Card, Badge, Input, Select, 
  message, Avatar, Tooltip, Row, Col, List, Divider, Empty, Drawer
} from 'antd';
import { 
  MessageOutlined, ClockCircleOutlined, CheckCircleOutlined,
  FilterOutlined, SearchOutlined, SendOutlined, PaperClipOutlined,
  SmileOutlined, MoreOutlined, UserOutlined, CarOutlined, CopyOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { adminApi } from '../api/adminApi';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;

export const SupportTicketsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [savedAnswersVisible, setSavedAnswersVisible] = useState(false);
  const [answerSearch, setAnswerSearch] = useState('');
  const { isDark } = useTheme();

  // Mock data for Saved Answers
  const savedAnswers = [
    { 
      key: '1', 
      topic: 'Cancel ongoing trip', 
      answer: "If you need to cancel an ongoing trip, please ensure the reason is valid (such as a safety concern, vehicle issue, or emergency). You can cancel the trip through the app by selecting the 'Cancel Ride' option and choosing a reason." 
    },
    { 
      key: '2', 
      topic: 'Referral Earning', 
      answer: 'Setup Driver Referral Earning from business management.' 
    },
    { 
      key: '3', 
      topic: 'Refund validity?', 
      answer: 'Admin can set the time period from business settings, during which customers can request a refund for their parcel after completing an order.' 
    },
  ];

  const filteredAnswers = savedAnswers.filter(a => 
    a.topic.toLowerCase().includes(answerSearch.toLowerCase()) ||
    a.answer.toLowerCase().includes(answerSearch.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Answer copied to clipboard!');
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      // Mocking the chatting list based on the user screenshot
      const mockChats = [
        { 
          id: '1', 
          name: 'Jonathon Smith', 
          phone: '+880 17********', 
          lastMessage: 'Setup Driver Referral Earning...', 
          time: '21 Nov 2024', 
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          status: 'online',
          unread: 0,
          messages: [
            { id: 'm1', text: 'When driver want to cancel a ongoing trip', sender: 'driver', time: '15:30' },
            { id: 'm2', text: "If you need to cancel an ongoing trip, please ensure the reason is valid (such as a safety concern, vehicle issue, or emergency). You can cancel the trip through the app by selecting the 'Cancel Ride' option and choosing a reason.", sender: 'admin', time: '15:32' },
            { id: 'm3', text: 'How to setup Referral Earning?', sender: 'driver', time: '15:35' },
            { id: 'm4', text: 'Setup Driver Referral Earning from business management.', sender: 'admin', time: '15:36' },
          ]
        },
        { 
          id: '2', 
          name: 'Devid Jack', 
          phone: '+880 18********', 
          lastMessage: 'If you need to canc...', 
          time: '21 Nov 2024', 
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
          status: 'offline',
          unread: 2,
          messages: []
        },
        { 
          id: '3', 
          name: 'Test Driver', 
          phone: '+880 19********', 
          lastMessage: 'If you need to canc...', 
          time: '21 Nov 2024', 
          avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
          status: 'offline',
          unread: 0,
          messages: []
        },
        { 
          id: '4', 
          name: 'Jenifer Jhon', 
          phone: '+880 16********', 
          lastMessage: 'Setup Driver Referr...', 
          time: '21 Nov 2024', 
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          status: 'online',
          unread: 1,
          messages: []
        }
      ];
      setChats(mockChats);
      setSelectedChat(mockChats[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchText.toLowerCase()) ||
    chat.phone.includes(searchText)
  );

  return (
    <div style={{ height: 'calc(100vh - 120px)', padding: '0px', display: 'flex', flexDirection: 'column' }}>
      <Row justify="space-between" align="middle" style={{ padding: '0 24px 16px 24px' }}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#1890ff', padding: 8, borderRadius: 8 }}>
              <MessageOutlined style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>Chatting List</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Real-time driver support and communication hub</Text>
            </div>
          </div>
        </Col>
        <Col>
          <Button 
            type="primary" 
            ghost 
            icon={<Badge count={0} offset={[10, 0]}><CheckCircleOutlined /></Badge>}
            onClick={() => setSavedAnswersVisible(true)}
          >
            View Saved Answer
          </Button>
        </Col>
      </Row>

      <Row style={{ 
        flex: 1, 
        overflow: 'hidden', 
        background: isDark ? '#1e1e1e' : '#fff', 
        borderRadius: 16, 
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)', 
        margin: '0 24px',
        border: isDark ? '1px solid #2d2d2d' : 'none'
      }}>
        {/* Left Sidebar: Drivers List */}
        <Col xs={24} sm={8} lg={6} style={{ 
          borderRight: isDark ? '1px solid #2d2d2d' : '1px solid #f0f0f0', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          background: isDark ? '#1a1a1a' : '#fcfcfc' 
        }}>
          <div style={{ padding: '20px 16px' }}>
            <Input 
              prefix={<SearchOutlined style={{ color: isDark ? '#8e8e8e' : '#bfbfbf' }} />} 
              placeholder="Search driver" 
              className="chat-search"
              style={{ 
                borderRadius: 8, 
                border: isDark ? '1px solid #333' : '1px solid #eee',
                background: isDark ? '#2d2d2d' : '#fff',
                color: isDark ? '#e3e3e3' : 'inherit'
              }}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <Title level={5} style={{ fontSize: 14, color: isDark ? '#e3e3e3' : '#333' }}>Drivers</Title>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              dataSource={filteredChats}
              renderItem={chat => (
                <div 
                  onClick={() => setSelectedChat(chat)}
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s',
                    background: selectedChat?.id === chat.id 
                      ? (isDark ? '#2d2d2d' : '#edf6ff') 
                      : 'transparent',
                    borderLeft: selectedChat?.id === chat.id 
                      ? '4px solid #10b981' 
                      : '4px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                  className="chat-item-hover"
                >
                  <Badge dot status={chat.status === 'online' ? 'success' : 'default'} offset={[-4, 38]}>
                    <Avatar size={48} src={chat.avatar} icon={<UserOutlined />} style={{ border: isDark ? '2px solid #2d2d2d' : '2px solid #fff' }} />
                  </Badge>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: 13, color: isDark ? '#e3e3e3' : 'inherit' }}>{chat.name}</Text>
                      <Text type="secondary" style={{ fontSize: 11, color: isDark ? '#8e8e8e' : 'inherit' }}>{chat.time}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 11, color: isDark ? '#8e8e8e' : 'inherit' }}>{chat.phone}</Text>
                      {chat.unread > 0 && <Badge count={chat.unread} style={{ backgroundColor: '#ff4d4f' }} />}
                    </div>
                    <Text type="secondary" ellipsis style={{ fontSize: 12, display: 'block', marginTop: 4, color: isDark ? '#8e8e8e' : 'inherit' }}>
                      {chat.lastMessage}
                    </Text>
                  </div>
                </div>
              )}
            />
          </div>
        </Col>

        {/* Right Pane: Conversation */}
        <Col xs={0} sm={16} lg={18} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          background: isDark ? '#1e1e1e' : '#fff' 
        }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: isDark ? '1px solid #2d2d2d' : '1px solid #f0f0f0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Space size={16}>
                  <Avatar size={40} src={selectedChat.avatar} icon={<UserOutlined />} />
                  <div>
                    <Title level={5} style={{ margin: 0, fontSize: 15, color: isDark ? '#e3e3e3' : 'inherit' }}>{selectedChat.name}</Title>
                    <Text type="secondary" style={{ fontSize: 12, color: isDark ? '#8e8e8e' : 'inherit' }}>{selectedChat.phone}</Text>
                  </div>
                </Space>
                <Space>
                  <Button icon={<MoreOutlined />} type="text" style={{ color: isDark ? '#8e8e8e' : 'inherit' }} />
                </Space>
              </div>

              {/* Messages Area */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '24px', 
                background: isDark ? '#121212' : '#f9f9f9', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 16 
              }}>
                {selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map((m: any) => (
                    <div key={m.id} style={{ alignSelf: m.sender === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <div style={{ 
                        background: m.sender === 'admin' 
                          ? (isDark ? '#2d2d2d' : '#2b2b2b') 
                          : (isDark ? '#1e1e1e' : '#3d444e'), 
                        color: isDark ? '#e3e3e3' : '#fff', 
                        padding: '12px 18px', 
                        borderRadius: m.sender === 'admin' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                        fontSize: 13,
                        lineHeight: '1.6',
                        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                        border: isDark ? '1px solid #333' : 'none'
                      }}>
                        {m.text}
                      </div>
                      <div style={{ 
                        textAlign: m.sender === 'admin' ? 'right' : 'left', 
                        marginTop: 4, 
                        fontSize: 10, 
                        color: isDark ? '#666' : '#999' 
                      }}>
                        {m.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description={<span style={{ color: isDark ? '#666' : 'inherit' }}>No messages yet. Start a conversation.</span>} style={{ marginTop: 100 }} />
                )}
              </div>

              {/* Message Input */}
              <div style={{ padding: '20px 24px', borderTop: isDark ? '1px solid #2d2d2d' : '1px solid #f0f0f0' }}>
                <div style={{ 
                  background: isDark ? '#121212' : '#f5f5f5', 
                  borderRadius: 12, 
                  padding: '8px 16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  border: isDark ? '1px solid #2d2d2d' : 'none'
                }}>
                  <Button icon={<PaperClipOutlined style={{ fontSize: 18, color: isDark ? '#666' : '#8c8c8c' }} />} type="text" />
                  <Input 
                    placeholder="Send a message" 
                    bordered={false} 
                    style={{ flex: 1, padding: '8px 0', color: isDark ? '#e3e3e3' : 'inherit' }} 
                  />
                  <Button icon={<SmileOutlined style={{ fontSize: 18, color: isDark ? '#666' : '#8c8c8c' }} />} type="text" />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    style={{ 
                      background: isDark ? '#2d2d2d' : '#2b2b2b', 
                      borderColor: isDark ? '#444' : '#2b2b2b', 
                      borderRadius: 8, 
                      height: 40, 
                      width: 40,
                      color: isDark ? '#10b981' : '#fff'
                    }} 
                  />
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              background: isDark ? '#1a1a1a' : '#f9f9f9', 
              color: isDark ? '#444' : '#8c8c8c' 
            }}>
              <MessageOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.2 }} />
              <Text type="secondary" style={{ color: isDark ? '#666' : 'inherit' }}>Select a driver from the list to start chatting</Text>
            </div>
          )}
        </Col>
      </Row>

      {/* Saved Answer Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <span style={{ color: isDark ? '#e3e3e3' : '#0f172a', fontWeight: 600, fontSize: 18 }}>Saved Answer</span>
          </div>
        }
        closeIcon={<CloseOutlined style={{ color: isDark ? '#8e8e8e' : '#0f172a' }} />}
        placement="right"
        onClose={() => setSavedAnswersVisible(false)}
        open={savedAnswersVisible}
        width={400}
        styles={{
          header: { 
            background: isDark ? '#1e1e1e' : '#fff', 
            borderBottom: isDark ? '1px solid #2d2d2d' : '1px solid #f1f5f9', 
            padding: '16px 24px' 
          },
          body: { 
            background: isDark ? '#121212' : '#f8fafc', 
            padding: '24px' 
          }
        }}
      >
        <Input 
          prefix={<SearchOutlined style={{ color: isDark ? '#666' : '#94a3b8' }} />} 
          placeholder="Search by topics" 
          onChange={e => setAnswerSearch(e.target.value)}
          style={{ 
            background: isDark ? '#1e1e1e' : '#fff', 
            border: isDark ? '1px solid #333' : '1px solid #e2e8f0', 
            borderRadius: 8, 
            padding: '10px 16px',
            color: isDark ? '#e3e3e3' : '#0f172a',
            marginBottom: 24
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredAnswers.map((item, index) => (
            <div key={item.key} style={{ 
              background: isDark ? '#1e1e1e' : '#fff', 
              borderRadius: 12, 
              padding: 20, 
              position: 'relative', 
              border: isDark ? '1px solid #2d2d2d' : '1px solid #e2e8f0', 
              boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
            }}>
              <Typography.Text style={{ color: isDark ? '#666' : '#64748b', fontSize: 12, display: 'block', marginBottom: 8 }}>
                {index + 1}. Topic
              </Typography.Text>
              <Typography.Title level={5} style={{ color: isDark ? '#e3e3e3' : '#0f172a', margin: '0 0 20px 0', fontSize: 14 }}>
                {item.topic}
              </Typography.Title>
              
              <Divider style={{ borderColor: isDark ? '#2d2d2d' : '#f1f5f9', margin: '0 0 20px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <Typography.Text style={{ color: isDark ? '#666' : '#64748b', fontSize: 12 }}>Answer</Typography.Text>
                 <Button 
                   type="default" 
                   size="small" 
                   icon={<CopyOutlined />} 
                   onClick={() => handleCopy(item.answer)}
                   style={{ 
                     background: 'transparent', 
                     borderColor: '#10b981', 
                     color: '#10b981', 
                     fontSize: 12 
                   }}
                 >
                   Copy
                 </Button>
              </div>
              
              <Typography.Paragraph style={{ color: isDark ? '#a0a0a0' : '#334155', fontSize: 13, lineHeight: '1.6', margin: 0 }}>
                {item.answer}
              </Typography.Paragraph>
            </div>
          ))}
        </div>
      </Drawer>

      <style dangerouslySetInnerHTML={{ __html: `
        .chat-item-hover:hover { background: ${isDark ? '#262626' : '#f0f7ff'} !important; }
      `}} />


    </div>
  );
};
