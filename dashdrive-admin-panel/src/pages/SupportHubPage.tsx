import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Typography, Card, Badge, Input, Select, 
  message, Avatar, Row, Col, List, Divider, Empty, Drawer,
  Tabs, Statistic, Descriptions, Segmented
} from 'antd';
import { 
  MessageOutlined, CheckCircleOutlined, SearchOutlined, SendOutlined, 
  PaperClipOutlined, SmileOutlined, UserOutlined, CopyOutlined,
  CloseOutlined, AuditOutlined, CustomerServiceOutlined,
  WarningOutlined, SafetyCertificateOutlined, ReloadOutlined,
  UndoOutlined, AlertOutlined, ReadOutlined, SafetyOutlined,
  FileTextOutlined, GlobalOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface DisputeRecord {
  key: string;
  sl: number;
  ticketId: string;
  orderId: string;
  serviceType: string;
  customerName: string;
  partnerName: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Assigned' | 'Investigating' | 'Pending Response' | 'Resolved' | 'Escalated' | 'Rejected';
  amount: number;
  date: string;
  escalationReason?: string;
  internalNotes?: { agent: string; date: string; note: string }[];
  financialImpact?: { refundAmount: number; platformCommission: number; partnerPayout: number };
  resolutionDetail?: { resolvedBy: string; resolvedAt: string; decision: string; note: string };
}

interface TicketRecord {
  key: string;
  ticketId: string;
  customer: string;
  service: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
  assignedAgent: string;
  created: string;
}

export const SupportHubPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  
  // Live Chat State
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [savedAnswersVisible, setSavedAnswersVisible] = useState(false);
  const [answerSearch, setAnswerSearch] = useState('');

  // Senior Workspace State
  const [disputeFilter, setDisputeFilter] = useState('All');
  const [newInternalNote, setNewInternalNote] = useState('');

  // Dispute State
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [isDisputeDrawerVisible, setIsDisputeDrawerVisible] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);

  // Tickets State
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [isTicketDrawerVisible, setIsTicketDrawerVisible] = useState(false);
  
  // Audit State
  const [selectedAuditPartner, setSelectedAuditPartner] = useState<any>(null);
  const [isAuditDrawerVisible, setIsAuditDrawerVisible] = useState(false);

  const [refunds, setRefunds] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

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
    {
      key: '4',
      topic: 'How to become a driver?',
      answer: "To join: 1. Switch to 'Driver mode' in app. 2. Tap 'Online registration'. 3. Upload Doc (License, Reg Certificate). 4. Minimum age 18. Start after team approval."
    }
  ];

  const filteredAnswers = savedAnswers.filter(a => 
    a.topic.toLowerCase().includes(answerSearch.toLowerCase()) ||
    a.answer.toLowerCase().includes(answerSearch.toLowerCase())
  );

  const handleCopy = (text: string) => {
    setChatMessage(text);
    message.success('Answer inserted into chat!');
    setSavedAnswersVisible(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    setLoading(true);
    // Mock Chats
    const mockChats = [
      { 
        id: '1', 
        name: 'Jonathon Smith', 
        phone: '+880 17********', 
        lastMessage: 'When driver want to cancel a ongoing trip', 
        time: '21 Nov 2024', 
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        status: 'online',
        unread: 0,
        messages: [
          { id: 'm1', text: 'When driver want to cancel a ongoing trip', sender: 'driver', time: '15:30' },
          { id: 'm2', text: "If you need to cancel an ongoing trip, please ensure the reason is valid...", sender: 'admin', time: '15:32' },
        ],
        type: 'driver'
      },
      { id: '2', name: 'Devid Jack', phone: '+880 18********', lastMessage: 'If you need to...', time: '21 Nov 2024', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', status: 'offline', unread: 2, messages: [], type: 'customer' }
    ];
    setChats(mockChats);
    setSelectedChat(mockChats[0]);

    // Mock Disputes
    const mockDisputes: DisputeRecord[] = [
      { 
        key: 'd1', sl: 1, ticketId: 'TKT-1001', orderId: '#ORD-100047', serviceType: 'Ride Hailing', 
        customerName: 'Alice Johnson', partnerName: 'John Doe (Driver)', category: 'Driver Conduct', 
        priority: 'High', status: 'Investigating', amount: 15.00, date: '20 July 2025, 05:15 pm',
        financialImpact: { refundAmount: 15.00, platformCommission: 3.00, partnerPayout: 12.00 }
      },
      { 
        key: 'd2', sl: 2, ticketId: 'TKT-1002', orderId: '#ORD-100044', serviceType: 'Food Delivery', 
        customerName: 'Bob Smith', partnerName: 'QuickMart', category: 'Missing Item', 
        priority: 'Urgent', status: 'Escalated', amount: 12.50, date: '20 July 2025, 05:30 pm',
        escalationReason: 'Customer claims whole order was missing despite photo proof.',
        internalNotes: [
          { agent: 'Agent John', date: '20 July 2025, 05:45 pm', note: 'Checked driver photo, it shows the bag at the door. Customer insists it was not there.' }
        ],
        financialImpact: { refundAmount: 12.50, platformCommission: 2.50, partnerPayout: 10.00 }
      },
      { 
        key: 'd3', sl: 3, ticketId: 'TKT-1003', orderId: '#ORD-100032', serviceType: 'Mart', 
        customerName: 'George White', partnerName: 'Fresh Mart', category: 'Damaged Goods', 
        priority: 'Medium', status: 'Resolved', amount: 8.00, date: '19 July 2025, 10:15 am',
        internalNotes: [
          { agent: 'Agent Sarah', date: '19 July 2025, 11:00 am', note: 'Customer provided photo of crushed tomatoes.' }
        ],
        financialImpact: { refundAmount: 8.00, platformCommission: 1.60, partnerPayout: 6.40 },
        resolutionDetail: {
          resolvedBy: 'Senior Manager',
          resolvedAt: '19 July 2025, 02:30 pm',
          decision: 'Full Refund Issued',
          note: 'Damage verified. Issued full refund and charged back partner.'
        }
      }
    ];
    setDisputes(mockDisputes);

    // Mock Tickets
    const mockTickets: TicketRecord[] = [
      { key: 't1', ticketId: 'REQ-5001', customer: 'Sarah Miller', service: 'Food Delivery', category: 'Account Issues', priority: 'High', status: 'Open', assignedAgent: 'Agent John', created: '20 Nov 2024, 10:20 am' },
      { key: 't2', ticketId: 'REQ-5002', customer: 'Mike Ross', service: 'Mart', category: 'App Problem', priority: 'Medium', status: 'In Progress', assignedAgent: 'Agent Sarah', created: '20 Nov 2024, 11:45 am' }
    ];
    setTickets(mockTickets);

    // Mock Refunds
    setRefunds([
      { key: 'r1', id: 'REF-2001', customer: 'David Jones', amount: 25.50, status: 'Pending', created: '21 Nov 2024', orderDate: '21 Nov 2024, 09:00 am', reason: 'Food quality' },
      { key: 'r2', id: 'REF-2002', customer: 'Emma Wilson', amount: 15.00, status: 'Approved', created: '20 Nov 2024', orderDate: '19 Nov 2024, 08:30 pm', reason: 'Late delivery' }
    ]);

    // Mock Complaints
    setComplaints([
      { key: 'c1', id: 'CMP-3001', customer: 'Robert Brown', category: 'Behavior', status: 'In Review', created: '21 Nov 2024', partner: 'John Doe (Driver)', partnerRating: 4.2, pastComplaints: 3 },
      { key: 'c2', id: 'CMP-3002', customer: 'Linda White', category: 'Overcharge', status: 'Resolved', created: '19 Nov 2024', partner: 'QuickMart', partnerRating: 4.8, pastComplaints: 0 }
    ]);

    setLoading(false);
  };

  const handleResolveDispute = (key: string) => {
    setDisputes(prev => prev.map(d => d.key === key ? { ...d, status: 'Resolved' } : d));
    message.success('Dispute resolved successfully');
    setIsDisputeDrawerVisible(false);
  };

  const handleEscalateDispute = (key: string) => {
    setDisputes(prev => prev.map(d => d.key === key ? { 
      ...d, 
      status: 'Escalated', 
      priority: 'Urgent',
      escalationReason: 'Manually escalated for managerial review.'
    } : d));
    message.warning('Dispute escalated to senior management');
    setIsDisputeDrawerVisible(false);
  };

  const handleAssignToTechnical = (key: string) => {
    setTickets(prev => prev.map(t => t.key === key ? { 
      ...t, 
      assignedAgent: 'Tech Support (L2)', 
      status: 'In Progress',
      priority: 'High'
    } : t));
    message.success('Ticket transferred to Technical Support (L2)');
    setIsTicketDrawerVisible(false);
  };

  const handleAddInternalNote = () => {
    if (!newInternalNote.trim() || !selectedDispute) return;
    const note = {
      agent: 'Senior Manager',
      date: new Date().toLocaleString(),
      note: newInternalNote
    };
    setDisputes(prev => prev.map(d => d.key === selectedDispute.key ? {
      ...d,
      internalNotes: [...(d.internalNotes || []), note]
    } : d));
    setNewInternalNote('');
    message.success('Note added successfully');
  };

  const handleResolutionPreset = (preset: string) => {
    message.success(`Applied resolution: ${preset}`);
    if (selectedDispute) {
      setDisputes(prev => prev.map(d => d.key === selectedDispute.key ? { 
        ...d, 
        status: 'Resolved',
        resolutionDetail: {
          resolvedBy: 'Senior Manager',
          resolvedAt: new Date().toLocaleString(),
          decision: preset,
          note: newInternalNote || 'Resolution applied via senior presets.'
        }
      } : d));
    }
    setIsDisputeDrawerVisible(false);
  };

  const disputeColumns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', key: 'ticketId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { 
      title: 'Service', 
      dataIndex: 'serviceType', 
      key: 'serviceType',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority',
      render: (p: string) => <Tag color={p === 'Urgent' ? 'red' : p === 'High' ? 'orange' : 'blue'}>{p}</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => <Tag color={s === 'Resolved' ? 'green' : 'gold'}>{s}</Tag>
    },
    { title: 'Action', key: 'action', render: (_: any, record: DisputeRecord) => (
      <Button type="link" onClick={() => { setSelectedDispute(record); setIsDisputeDrawerVisible(true); }}>View</Button>
    )}
  ];

  const ticketColumns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', key: 'ticketId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={p === 'Critical' ? 'red' : 'orange'}>{p}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag>{s}</Tag> },
    { title: 'Assigned Agent', dataIndex: 'assignedAgent', key: 'assignedAgent' },
    { title: 'Created', dataIndex: 'created', key: 'created' },
    { title: 'Action', key: 'action', render: (_: any, record: TicketRecord) => <Button type="link" onClick={() => { setSelectedTicket(record); setIsTicketDrawerVisible(true); }}>Details</Button> }
  ];

  const renderLiveChat = () => (
    <div className="chat-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button 
          type="primary" 
          ghost 
          icon={<CheckCircleOutlined />}
          onClick={() => setSavedAnswersVisible(true)}
        >
          View Saved Answer
        </Button>
      </div>
      <Row style={{ height: '700px', border: isDark ? '1px solid #333' : '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden' }}>
        <Col span={8} style={{ borderRight: isDark ? '1px solid #333' : '1px solid #f0f0f0', background: isDark ? '#1a1a1a' : '#fcfcfc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16 }}>
            <Input prefix={<SearchOutlined />} placeholder="Search driver..." />
          </div>
          <List
            itemLayout="horizontal"
            dataSource={chats}
            renderItem={chat => (
              <div 
                onClick={() => setSelectedChat(chat)}
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer', 
                  background: selectedChat?.id === chat.id ? (isDark ? '#2d2d2d' : '#edf6ff') : 'transparent',
                  borderLeft: selectedChat?.id === chat.id ? '4px solid #1890ff' : '4px solid transparent'
                }}
              >
                <Space>
                  <Badge dot status={chat.status === 'online' ? 'success' : 'default'}>
                    <Avatar src={chat.avatar} />
                  </Badge>
                  <div>
                    <Text strong>{chat.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{chat.lastMessage}</Text>
                  </div>
                </Space>
              </div>
            )}
          />
        </Col>
        <Col span={16} style={{ display: 'flex', flexDirection: 'column', background: isDark ? '#1e1e1e' : '#fff' }}>
          {selectedChat ? (
            <>
              <div style={{ padding: 16, borderBottom: isDark ? '1px solid #333' : '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <Avatar src={selectedChat.avatar} />
                  <div>
                    <Text strong>{selectedChat.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>{selectedChat.type === 'driver' ? 'Active Driver' : 'Customer'}</Text>
                  </div>
                </Space>
                <Button size="small" icon={<CopyOutlined />} onClick={() => message.info('Chat log saved to clipboard')}>Convert to Ticket</Button>
              </div>
              <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                {selectedChat.messages.map((m: any) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
                    <div style={{ 
                      padding: '10px 16px', 
                      borderRadius: 12, 
                      background: m.sender === 'admin' ? '#1890ff' : (isDark ? '#2d2d2d' : '#f0f0f0'),
                      color: m.sender === 'admin' ? '#fff' : 'inherit',
                      maxWidth: '80%'
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, borderTop: isDark ? '1px solid #333' : '1px solid #f0f0f0' }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Button icon={<PaperClipOutlined />} />
                  <Input 
                    placeholder="Type a message..." 
                    style={{ flex: 1 }} 
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onPressEnter={() => {
                        if(!chatMessage.trim()) return;
                        message.success('Message sent');
                        setChatMessage('');
                    }}
                  />
                  <Button icon={<SmileOutlined />} />
                  <Button type="primary" icon={<SendOutlined />} onClick={() => {
                      if(!chatMessage.trim()) return;
                      message.success('Message sent');
                      setChatMessage('');
                  }}>Send</Button>
                </Space.Compact>
              </div>
            </>
          ) : (
            <Empty description="Select a chat to start messaging" style={{ marginTop: 200 }} />
          )}
        </Col>
      </Row>
    </div>
  );

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>Customer Support Hub</Title>
        <Text type="secondary">Centralized management for tickets, chats, disputes, and complaints</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
            <Statistic title="Open Tickets" value={42} prefix={<CustomerServiceOutlined style={{ color: '#1890ff' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
            <Statistic title="Live Chats" value={18} prefix={<MessageOutlined style={{ color: '#52c41a' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
            <Statistic title="Escalated Disputes" value={disputes.filter(d => d.status === 'Escalated').length} prefix={<WarningOutlined style={{ color: '#ef4444' }} />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12 }}>
            <Statistic title="Resolution Rate" value={94.5} suffix="%" prefix={<SafetyCertificateOutlined style={{ color: '#eb2f96' }} />} />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" className="shadow-sm premium-tabs" style={{ borderRadius: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: '1', label: <Space><CustomerServiceOutlined /> Support Tickets</Space>, children: (
              <Table dataSource={tickets} columns={ticketColumns} loading={loading} pagination={{ pageSize: 8 }} />
            )},
            { key: '2', label: <Space><MessageOutlined /> Live Chat</Space>, children: renderLiveChat() },
            { key: '3', label: <Space><WarningOutlined /> Dispute Center</Space>, children: (
              <div>
                {/* Senior Console Banner */}
                <Card 
                  size="small" 
                  style={{ 
                    marginBottom: 24, 
                    background: isDark ? 'linear-gradient(90deg, #1e1b4b 0%, #1e1e1e 100%)' : 'linear-gradient(90deg, #eef2ff 0%, #ffffff 100%)',
                    borderColor: isDark ? '#312e81' : '#c7d2fe'
                  }}
                >
                  <Row align="middle" gutter={24}>
                    <Col span={16}>
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ color: isDark ? '#a5b4fc' : '#4338ca', fontSize: 13 }}>SENIOR RESOLUTION CONSOLE</Text>
                        <Title level={5} style={{ margin: 0 }}>Active Escalations & High-Impact Disputes</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>Specialized workspace for management-level intervention and financial audit.</Text>
                      </Space>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Space>
                        <Statistic 
                          title={<Text style={{ fontSize: 11 }}>Urgent Cases</Text>} 
                          value={disputes.filter(d => d.priority === 'Urgent').length} 
                          valueStyle={{ fontSize: 18, color: '#ef4444' }} 
                        />
                        <Divider type="vertical" style={{ height: 40 }} />
                        <Statistic 
                          title={<Text style={{ fontSize: 11 }}>Wait Time (Avg)</Text>} 
                          value="12m" 
                          valueStyle={{ fontSize: 18 }} 
                        />
                      </Space>
                    </Col>
                  </Row>
                </Card>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <AuditOutlined style={{ color: '#1890ff' }} />
                    <Text strong>Dispute Registry</Text>
                  </Space>
                  <Space>
                    <Segmented 
                      value={disputeFilter} 
                      onChange={(val) => setDisputeFilter(val as string)}
                      options={[
                        { label: 'All Cases', value: 'All' },
                        { label: <Badge dot color="red">Escalated</Badge>, value: 'Escalated' },
                        { label: 'Resolved', value: 'Resolved' }
                      ]} 
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchInitialData} />
                  </Space>
                </div>
                <Table 
                  dataSource={disputes.filter(d => {
                    if (disputeFilter === 'Escalated') return d.status === 'Escalated';
                    if (disputeFilter === 'Resolved') return d.status === 'Resolved';
                    return true;
                  })} 
                  columns={disputeColumns} 
                  loading={loading} 
                  pagination={{ pageSize: 8 }} 
                />
              </div>
            )},
            { key: '4', label: <Space><UndoOutlined /> Refund Requests</Space>, children: (
              <Table 
                dataSource={refunds} 
                columns={[
                  { title: 'Refund ID', dataIndex: 'id', key: 'id' },
                  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a: number) => `$${a.toFixed(2)}` },
                  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Approved' ? 'green' : s === 'Rejected' ? 'red' : 'orange'}>{s}</Tag> },
                  { title: 'Created', dataIndex: 'created', key: 'created' },
                  { title: 'Action', key: 'action', render: (_, record) => (
                    <Space>
                      <Button size="small" type="link" onClick={() => {
                        message.loading('Validating policy...', 1.5).then(() => {
                          const isEligible = record.amount < 50; 
                          if (isEligible) {
                            message.success(`System: Eligible for instant refund ($${record.amount}).`);
                          } else {
                            message.warning('System: Manual audit required (Amount > $50).');
                          }
                        });
                      }}>Policy Check</Button>
                      <Button size="small" type="primary" ghost onClick={() => {
                        setRefunds(prev => prev.map(r => r.key === record.key ? { ...r, status: 'Approved' } : r));
                        message.success('Refund Approved');
                      }}>Approve</Button>
                    </Space>
                  )}
                ]} 
                pagination={{ pageSize: 8 }} 
              />
            )},
            { key: '5', label: <Space><AlertOutlined /> Customer Complaints</Space>, children: (
              <Table 
                dataSource={complaints} 
                columns={[
                  { title: 'Complaint ID', dataIndex: 'id', key: 'id' },
                  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                  { title: 'Category', dataIndex: 'category', key: 'category' },
                  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Resolved' ? 'green' : 'blue'}>{s}</Tag> },
                  { title: 'Created', dataIndex: 'created', key: 'created' },
                  { title: 'Action', key: 'action', render: (_, record) => (
                    <Button type="link" onClick={() => {
                      setSelectedAuditPartner(record);
                      setIsAuditDrawerVisible(true);
                    }}>Audit Partner</Button>
                  )}
                ]} 
                pagination={{ pageSize: 8 }} 
              />
            )},
            { key: '6', label: <Space><ReadOutlined /> Knowledge Base</Space>, children: (
              <div style={{ padding: '24px 0' }}>
                <Row gutter={[24, 24]}>
                  <Col span={16}>
                    <Card variant="borderless" style={{ background: isDark ? '#1a1a1a' : '#fff', borderRadius: 16 }}>
                      <Title level={4}>How to become a driver</Title>
                      <Paragraph style={{ fontSize: 16, color: isDark ? '#8e8e8e' : '#64748b' }}>
                        You need to upload pictures of your documents and add your personal info.
                      </Paragraph>
                      
                      <Divider orientation={"left" as any}>Getting started</Divider>
                      <List
                        size="large"
                        dataSource={[
                          "Select 'Driver mode' in the app and open the side menu.",
                          "Tap 'Online registration'.",
                          "Upload the requested documents.",
                          "When the team approves the submitted documents, you can start accepting ride requests."
                        ]}
                        renderItem={(item, index) => (
                          <List.Item style={{ border: 'none', padding: '12px 0' }}>
                            <Space align="start">
                              <Avatar size="small" style={{ background: '#10b981' }}>{index + 1}</Avatar>
                              <Text style={{ fontSize: 15 }}>{item}</Text>
                            </Space>
                          </List.Item>
                        )}
                      />

                      <Divider orientation={"left" as any} style={{ marginTop: 32 }}>What you'll need when you apply</Divider>
                      <Paragraph>
                        This varies based on your location, but usually you'll need:
                      </Paragraph>
                      <ul style={{ paddingLeft: 20, fontSize: 15 }}>
                        <li style={{ marginBottom: 8 }}>Valid driver's license for your location</li>
                        <li style={{ marginBottom: 8 }}>Vehicle registration certificate</li>
                        <li>Minimum age: 18 years old</li>
                      </ul>

                      <div style={{ marginTop: 40, padding: 20, background: isDark ? '#1e1e1e' : '#f0f9ff', borderRadius: 12, borderLeft: '4px solid #3b82f6' }}>
                        <Space>
                          <SafetyOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
                          <Text strong>Verification Timeline:</Text>
                          <Text>The official review team typically processes documents within 24-48 business hours.</Text>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Quick Resources" variant="outlined" style={{ borderRadius: 16 }}>
                      <List
                        dataSource={[
                          { title: 'Driver Registration Manual', icon: <FileTextOutlined /> },
                          { title: 'Document Standards Guide', icon: <AuditOutlined /> },
                          { title: 'Self-Service Portal Access', icon: <GlobalOutlined /> }
                        ]}
                        renderItem={item => (
                          <List.Item style={{ cursor: 'pointer' }}>
                            <Space><Avatar icon={item.icon} shape="square" size="small" /> <Text>{item.title}</Text></Space>
                          </List.Item>
                        )}
                      />
                    </Card>
                    <Card title="Support Stats" variant="outlined" style={{ borderRadius: 16, marginTop: 24 }}>
                      <Statistic title="Avg Onboarding Time" value="1.8 Days" valueStyle={{ color: '#10b981' }} />
                      <Divider style={{ margin: '12px 0' }} />
                      <Statistic title="Approved Today" value={24} />
                    </Card>
                  </Col>
                </Row>
              </div>
            )},
          ]}
        />
      </Card>

      {/* Saved Answer Drawer */}
      <Drawer
        title={<span style={{ color: isDark ? '#e3e3e3' : '#0f172a' }}>Saved Answer</span>}
        closeIcon={<CloseOutlined style={{ color: isDark ? '#8e8e8e' : '#0f172a' }} />}
        placement="right"
        onClose={() => setSavedAnswersVisible(false)}
        open={savedAnswersVisible}
        width={400}
        styles={{
          header: { background: isDark ? '#1e1e1e' : '#fff' },
          body: { background: isDark ? '#121212' : '#f8fafc' }
        }}
      >
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Search by topics" 
          onChange={e => setAnswerSearch(e.target.value)}
          style={{ marginBottom: 24 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredAnswers.map((item, index) => (
            <div key={item.key} style={{ 
              background: isDark ? '#1e1e1e' : '#fff', 
              borderRadius: 12, 
              padding: 20, 
              border: isDark ? '1px solid #2d2d2d' : '1px solid #e2e8f0' 
            }}>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>{index + 1}. Topic</Text>
              <Title level={5} style={{ margin: '0 0 12px 0', fontSize: 14 }}>{item.topic}</Title>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <Text type="secondary" style={{ fontSize: 12 }}>Answer</Text>
                 <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(item.answer)} style={{ color: '#10b981', borderColor: '#10b981' }}>Copy</Button>
              </div>
              <Text style={{ fontSize: 13 }}>{item.answer}</Text>
            </div>
          ))}
        </div>
      </Drawer>

      {/* Support Ticket Details Drawer */}
      <Drawer
        title={
          <Space>
            <CustomerServiceOutlined style={{ color: '#1890ff' }} />
            <Text strong>Support Ticket Detail</Text>
          </Space>
        }
        open={isTicketDrawerVisible}
        onClose={() => setIsTicketDrawerVisible(false)}
        width={650}
        extra={
          <Space>
            <Button onClick={() => setIsTicketDrawerVisible(false)}>Close</Button>
            <Button key="assign" danger ghost onClick={() => handleAssignToTechnical(selectedTicket?.key || '')}>Assign to Technical</Button>
            <Button key="resolve" type="primary" onClick={() => {
              setTickets(prev => prev.map(t => t.key === selectedTicket?.key ? { ...t, status: 'Resolved' } : t));
              message.success('Ticket marked as resolved');
              setIsTicketDrawerVisible(false);
            }} style={{ background: '#0e172a' }}>Resolve Ticket</Button>
          </Space>
        }
      >
        {selectedTicket && (
          <Space direction="vertical" size="large" style={{ width: '100%', padding: '12px 0' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Ticket ID">{selectedTicket.ticketId}</Descriptions.Item>
              <Descriptions.Item label="Created">{selectedTicket.created}</Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedTicket.customer}</Descriptions.Item>
              <Descriptions.Item label="Agent">{selectedTicket.assignedAgent}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedTicket.category}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedTicket.priority === 'Critical' ? 'red' : 'orange'}>{selectedTicket.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Current Status" span={2}>
                <Tag color={selectedTicket.status === 'Resolved' ? 'green' : 'blue'}>{selectedTicket.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ background: isDark ? '#1a1a1a' : '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Conversation History</Text>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <Avatar icon={<UserOutlined />} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 13 }}>{selectedTicket.customer}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{selectedTicket.created}</Text>
                  </div>
                  <div style={{ marginTop: 4, padding: 12, background: isDark ? '#2d2d2d' : '#fff', borderRadius: '0 12px 12px 12px', border: '1px solid #e2e8f0' }}>
                    <Text>Hi, I am unable to update my profile picture. It keeps saying "Upload failed". Please help.</Text>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <div style={{ flex: 1, maxWidth: '85%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Today, 10:45 am</Text>
                    <Text strong style={{ fontSize: 13 }}>{selectedTicket.assignedAgent}</Text>
                  </div>
                  <div style={{ marginTop: 4, padding: 12, background: '#1890ff', borderRadius: '12px 0 12px 12px', color: '#fff' }}>
                    <Text style={{ color: '#fff' }}>Hello Sarah, I am looking into this now. Could you please confirm the file format and size?</Text>
                  </div>
                </div>
                <Avatar style={{ background: '#1890ff' }}>A</Avatar>
              </div>
            </div>
            
            <div style={{ marginTop: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>Internal Quick Response</Text>
              <Input.TextArea rows={3} placeholder="Type internal response or notes here..." style={{ borderRadius: 12 }} />
            </div>
          </Space>
        )}
      </Drawer>

        {/* Dispute Details Drawer */}
      <Drawer
        title={
          <Space>
            <AuditOutlined style={{ color: '#3b82f6' }} />
            <Text strong>Dispute Ticket Details</Text>
          </Space>
        }
        open={isDisputeDrawerVisible}
        onClose={() => setIsDisputeDrawerVisible(false)}
        width={700}
        extra={
          <Space>
            <Button onClick={() => setIsDisputeDrawerVisible(false)}>Close</Button>
            {selectedDispute?.status !== 'Resolved' && (
              <>
                <Button danger type="dashed" onClick={() => handleEscalateDispute(selectedDispute?.key || '')}>Escalate Case</Button>
                <Button type="primary" onClick={() => handleResolveDispute(selectedDispute?.key || '')} style={{ background: '#10b981' }}>Resolve & Refund</Button>
              </>
            )}
          </Space>
        }
      >
        {selectedDispute && (
          <Space direction="vertical" size="middle" style={{ width: '100%', padding: '12px 0' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Ticket ID">{selectedDispute.ticketId}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedDispute.date}</Descriptions.Item>
              <Descriptions.Item label="Service">{selectedDispute.serviceType}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedDispute.priority === 'Urgent' ? 'red' : 'gold'}>{selectedDispute.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedDispute.customerName}</Descriptions.Item>
              <Descriptions.Item label="Partner">{selectedDispute.partnerName}</Descriptions.Item>
              <Descriptions.Item label="Category" span={2}>{selectedDispute.category}</Descriptions.Item>
            </Descriptions>

            {selectedDispute.status === 'Escalated' && (
              <Card size="small" style={{ background: isDark ? '#2d1b1b' : '#fff1f0', borderColor: '#ffa39e', borderRadius: 12 }}>
                <Text strong type="danger"><WarningOutlined /> Escalation Reason: </Text>
                <Text italic>{selectedDispute.escalationReason || 'No reason provided'}</Text>
              </Card>
            )}

            {selectedDispute.status === 'Resolved' && selectedDispute.resolutionDetail && (
              <Card 
                size="small" 
                style={{ background: isDark ? '#162312' : '#f6ffed', borderColor: '#b7eb8f', borderRadius: 12 }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18, marginTop: 4 }} />
                  <div>
                    <Text strong style={{ color: '#52c41a' }}>Case Resolved & Settled</Text>
                    <br />
                    <Text strong style={{ fontSize: 13 }}>Decision: </Text>
                    <Text>{selectedDispute.resolutionDetail.decision}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      By {selectedDispute.resolutionDetail.resolvedBy} on {selectedDispute.resolutionDetail.resolvedAt}
                    </Text>
                  </div>
                </div>
                <Divider style={{ margin: '12px 12px 12px 30px' }} />
                <div style={{ paddingLeft: 30 }}>
                  <Text italic style={{ fontSize: 13 }}>" {selectedDispute.resolutionDetail.note} "</Text>
                </div>
              </Card>
            )}

            <Tabs defaultActiveKey="1" size="large" items={[
              {
                key: '1',
                label: selectedDispute.status === 'Resolved' ? 'Final Settlement' : 'Financial Impact',
                children: (
                  <Card style={{ borderRadius: 12, background: isDark ? '#1a1a1a' : '#f8fafc' }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Statistic 
                          title={<span style={{ fontSize: 12 }}>{selectedDispute.status === 'Resolved' ? "Refund Issued" : "Refund Amount"}</span>}
                          value={selectedDispute.financialImpact?.refundAmount} 
                          prefix="$" 
                          valueStyle={{ color: selectedDispute.status === 'Resolved' ? '#52c41a' : 'inherit', fontSize: 18, fontWeight: 700 }} 
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic title={<span style={{ fontSize: 12 }}>Commission Loss</span>} value={selectedDispute.financialImpact?.platformCommission} prefix="$" valueStyle={{ fontSize: 18, fontWeight: 700 }} />
                      </Col>
                      <Col span={8}>
                        <Statistic title={<span style={{ fontSize: 12 }}>Partner Payout</span>} value={selectedDispute.financialImpact?.partnerPayout} prefix="$" valueStyle={{ fontSize: 18, fontWeight: 700 }} />
                      </Col>
                    </Row>
                  </Card>
                )
              },
              {
                key: '2',
                label: 'Audit Log & Notes',
                children: (
                  <div style={{ maxHeight: 300, overflowY: 'auto', padding: '0 8px' }}>
                    <List
                      itemLayout="vertical"
                      dataSource={selectedDispute.internalNotes || []}
                      renderItem={item => (
                        <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: isDark ? '#2d2d2d' : '#f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text strong>{item.agent}</Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.date}</Text>
                          </div>
                          <Text style={{ fontSize: 13 }}>{item.note}</Text>
                        </div>
                      )}
                      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No internal notes yet" /> }}
                    />
                  </div>
                )
              },
              {
                key: '3',
                label: 'Evidence & Logs',
                children: (
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ background: isDark ? '#141414' : '#fafafa', padding: 16, borderRadius: 12, border: isDark ? '1px solid #333' : '1px solid #e2e8f0' }}>
                      <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}><AuditOutlined /> Investigation Support View</Text>
                      <div style={{ height: 160, background: isDark ? '#2d2d2d' : '#e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
                         <div>
                           <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                             <CheckCircleOutlined style={{ color: 'white' }} />
                           </div>
                           <br />
                           <Text strong style={{ fontSize: 13, color: '#10b981' }}>GPS Trace: Driver stayed at delivery point for 4m 12s</Text>
                           <br />
                           <Text type="secondary" style={{ fontSize: 11 }}>[ SIMULATED MAP VIEW ]</Text>
                         </div>
                      </div>
                    </div>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Card size="small" style={{ borderRadius: 12 }} cover={<div style={{ height: 100, background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 11 }}>Driver Photo Proof</Text></div>}>
                          <Text style={{ fontSize: 11 }} type="secondary">Delivery Confirmation</Text>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card size="small" style={{ borderRadius: 12 }} cover={<div style={{ height: 100, background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 11 }}>Order Receipt Log</Text></div>}>
                          <Text style={{ fontSize: 11 }} type="secondary">Merchant Settlement Slip</Text>
                        </Card>
                      </Col>
                    </Row>
                  </Space>
                )
              }
            ]} />

            {selectedDispute.status !== 'Resolved' && (
              <div style={{ background: isDark ? '#1a1a1a' : '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', marginTop: 8 }}>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>Senior Workspace Actions</Text>
                <Input.TextArea 
                  rows={3} 
                  placeholder="Add internal note for audit trail..." 
                  value={newInternalNote}
                  onChange={e => setNewInternalNote(e.target.value)}
                  style={{ marginBottom: 16, borderRadius: 12 }}
                />
                <Space wrap size={8}>
                  <Button type="primary" ghost onClick={handleAddInternalNote}>Add Internal Note</Button>
                  <Button onClick={() => handleResolutionPreset('Partial Refund (50%)')}>Apply 50% Refund</Button>
                  <Button onClick={() => handleResolutionPreset('Refund + $5 Credit')}>Refund + $5 Credit</Button>
                  <Button danger ghost onClick={() => handleResolutionPreset('Reject Claim')}>Reject & Close Claim</Button>
                </Space>
              </div>
            )}
          </Space>
        )}
      </Drawer>

      {/* Partner Audit Drawer */}
      <Drawer
        title={<Space><SafetyCertificateOutlined /> Partner Performance Audit</Space>}
        open={isAuditDrawerVisible}
        onClose={() => setIsAuditDrawerVisible(false)}
        width={500}
        extra={<Button onClick={() => setIsAuditDrawerVisible(false)}>Close</Button>}
      >
        {selectedAuditPartner && (
          <div style={{ padding: '8px 0' }}>
            <Descriptions bordered column={1} size="small" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <Descriptions.Item label="Partner Name"><Text strong>{selectedAuditPartner.partner}</Text></Descriptions.Item>
              <Descriptions.Item label="Overall Rating">
                <Space>
                  <Statistic value={selectedAuditPartner.partnerRating} precision={1} suffix="/ 5.0" valueStyle={{ fontSize: 16 }} />
                  <Tag color={selectedAuditPartner.partnerRating >= 4.5 ? 'success' : 'warning'}>
                    {selectedAuditPartner.partnerRating >= 4.5 ? 'EXCELLENT' : 'MONITOR'}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Historical Complaints">
                <Statistic value={selectedAuditPartner.pastComplaints} valueStyle={{ fontSize: 16, color: selectedAuditPartner.pastComplaints > 2 ? '#ef4444' : 'inherit' }} />
              </Descriptions.Item>
              <Descriptions.Item label="Risk Vector">
                <Tag color={selectedAuditPartner.pastComplaints > 2 ? 'red' : 'green'}>{selectedAuditPartner.pastComplaints > 2 ? 'CRITICAL RISK' : 'HEALTHY STANDING'}</Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 32, padding: 20, background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>QA Recommended Action:</Text>
              <div style={{ padding: 12, background: 'white', borderRadius: 8, borderLeft: `4px solid ${selectedAuditPartner.pastComplaints > 2 ? '#ef4444' : '#10b981'}` }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {selectedAuditPartner.pastComplaints > 2 
                    ? 'Issue official warning and mandatory customer service training. Temporary suspension suggested if next rating is < 3.0.' 
                    : 'Standard resolution flow. Partner maintains positive performance metrics.'}
                </Text>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Button type="primary" block style={{ background: '#0e172a', height: 44, borderRadius: 10 }}>Download Full Audit Report</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
