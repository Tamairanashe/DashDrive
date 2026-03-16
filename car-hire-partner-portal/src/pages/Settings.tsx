import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Typography, Divider, Alert, Space, Popconfirm, Avatar, Tag, Table } from 'antd';
import { 
  UploadOutlined, 
  CheckCircleOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  TeamOutlined, 
  UserAddOutlined,
  MailOutlined,
  LockOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Settings() {
  const [team, setTeam] = useState([
    { id: 1, name: 'Sarah Miller', email: 'sarah.m@host.com', role: 'Co-host', status: 'Active', permissions: 'Full Access' },
    { id: 2, name: 'David Wilson', email: 'david.w@service.com', role: 'Cleaner', status: 'Pending', permissions: 'Calendar Only' },
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Check-in Instructions',
      content: 'Hi {{guest_name}}, your {{vehicle_make}} is ready! You can pick it up at {{pickup_location}} at {{start_time}}. The lockbox code is 1234. Have a great trip!',
    },
    {
      id: 2,
      name: 'Trip Reminder',
      content: 'Hello {{guest_name}}, just a quick reminder that your trip ends tomorrow at {{end_time}}. Please remember to return the car with a full tank of gas.',
    },
    {
      id: 3,
      name: 'Thank You',
      content: 'Thanks for booking with me, {{guest_name}}! I hope you enjoyed the {{vehicle_make}}. If you have a moment, I would really appreciate a 5-star review.',
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const teamColumns = [
    {
      title: 'Member',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar className="bg-indigo-100 text-indigo-600 font-bold">{text[0]}</Avatar>
          <div>
            <div className="font-bold text-gray-800">{text}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag className="rounded-full px-3">{role}</Tag>
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perm: string) => <Text size="small" type="secondary">{perm}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'} className="rounded-full px-3 border-none font-bold">
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space transition-all>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl"
    >
      <div className="flex justify-between items-end">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Account & Preferences</Title>
          <Text className="text-gray-400">Manage your profile, team, and automation settings.</Text>
        </div>
      </div>
      
      <Card 
        className="shadow-2xl rounded-[2.5rem] border-gray-100 overflow-hidden"
        styles={{ body: { padding: '40px' } }}
      >
        <Tabs 
          defaultActiveKey="1" 
          type="line"
          tabBarGutter={32}
          className="premium-tabs"
          items={[
          {
            key: '1',
            label: <span className="flex items-center"><EditOutlined className="mr-2" /> Profile</span>,
            children: (
              <div className="pt-8 max-w-2xl">
                <Alert 
                  className="mb-8 rounded-2xl border-none bg-indigo-50"
                  message={<span className="font-bold text-indigo-800">Identity Verified</span>} 
                  description={<span className="text-indigo-700">Your account is fully verified and eligible for premium insurance coverage.</span>} 
                  type="success" 
                  showIcon 
                  icon={<CheckCircleOutlined className="text-indigo-500" />}
                />
                <Form layout="vertical" initialValues={{ name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' }}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="Full Name" name="name" className="font-bold">
                        <Input className="rounded-xl h-12" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Email Address" name="email" className="font-bold">
                        <Input type="email" className="rounded-xl h-12" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Phone Number" name="phone" className="font-bold">
                    <Input className="rounded-xl h-12" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" className="h-12 px-8 rounded-xl bg-indigo-600">Save Profile</Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            key: 'team',
            label: <span className="flex items-center"><TeamOutlined className="mr-2" /> Hosting Team</span>,
            children: (
              <div className="pt-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="max-w-md">
                    <Title level={4} className="!font-black">Team Management</Title>
                    <Text className="text-gray-500">Add co-hosts to help manage your bookings, message guests, and coordinate cleanings.</Text>
                  </div>
                  <Button type="primary" icon={<UserAddOutlined />} className="bg-indigo-600 h-10 px-6 rounded-xl">
                    Invite Member
                  </Button>
                </div>
                
                <Table 
                  columns={teamColumns} 
                  dataSource={team} 
                  pagination={false} 
                  className="premium-table"
                />

                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-gray-100 mt-8">
                  <div className="flex items-start">
                    <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mr-4">
                      <LockOutlined className="text-indigo-500 text-xl" />
                    </div>
                    <div>
                      <Title level={5} className="!mb-1">Access Control</Title>
                      <Text className="text-gray-500 text-sm">Members only see information based on their role. You remain the primary host and owner of all payouts.</Text>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            key: '3',
            label: <span className="flex items-center"><MailOutlined className="mr-2" /> Automation</span>,
            children: (
              <div className="pt-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <Title level={4} className="!font-black mb-1">Saved Templates</Title>
                    <Text className="text-gray-500">Speed up your guest communication with smart templates.</Text>
                  </div>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setEditingTemplate({ id: Date.now(), name: '', content: '' })}
                    className="bg-indigo-600 h-10 px-6 rounded-xl"
                  >
                    New Template
                  </Button>
                </div>

                {editingTemplate ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="bg-indigo-50/30 border-dashed border-indigo-200 rounded-3xl">
                      <Form 
                        layout="vertical" 
                        initialValues={editingTemplate}
                        onFinish={(values) => {
                          const newTemplate = {
                            ...editingTemplate,
                            name: values.name,
                            content: values.content
                          };
                          if (templates.find(t => t.id === editingTemplate.id)) {
                            setTemplates(templates.map(t => t.id === editingTemplate.id ? newTemplate : t));
                          } else {
                            setTemplates([...templates, newTemplate]);
                          }
                          setEditingTemplate(null);
                        }}
                      >
                        <Form.Item label="Template Name" name="name" rules={[{ required: true }]}>
                          <Input className="rounded-xl h-12" placeholder="e.g. Airport Pickup" />
                        </Form.Item>
                        <Form.Item label="Message Content" name="content" rules={[{ required: true }]} extra="Variables: {{guest_name}}, {{vehicle_make}}, {{start_time}}, {{pickup_location}}">
                          <TextArea rows={4} className="rounded-xl" placeholder="Hi {{guest_name}}, your car is ready..." />
                        </Form.Item>
                        <Space>
                          <Button type="primary" htmlType="submit" className="bg-indigo-600 rounded-xl h-10 px-6">Save Template</Button>
                          <Button onClick={() => setEditingTemplate(null)} className="rounded-xl h-10 px-6">Cancel</Button>
                        </Space>
                      </Form>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((item) => (
                      <Card key={item.id} className="rounded-3xl border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <Title level={5} className="!mb-0 !font-bold">{item.name}</Title>
                          <Space>
                            <Button type="text" icon={<EditOutlined />} onClick={() => setEditingTemplate(item)} />
                            <Popconfirm title="Delete template?" onConfirm={() => setTemplates(templates.filter(t => t.id !== item.id))}>
                              <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        </div>
                        <Text className="text-gray-500 text-sm line-clamp-3">{item.content}</Text>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: '2',
            label: <span className="flex items-center"><BellOutlined className="mr-2" /> Notifications</span>,
            children: (
              <div className="pt-8 space-y-8 max-w-2xl">
                <div className="bg-white p-6 rounded-3xl border border-gray-100">
                  <Title level={5} className="!font-black mb-6">Communication Channels</Title>
                  <div className="space-y-6">
                    <NotifyRow title="New Booking Requests" desc="Instant alerts for incoming reservations." checked />
                    <NotifyRow title="Secure Messaging" desc="Chat notifications from your guests." checked />
                    <NotifyRow title="System Updates" desc="Important account and policy changes." />
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'payouts',
            label: <span className="flex items-center"><DollarOutlined className="mr-2" /> Payouts</span>,
            children: (
              <div className="pt-8 space-y-8 max-w-2xl">
                <Card className="rounded-3xl bg-gray-900 text-white border-none p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Text className="text-gray-400 text-xs uppercase font-bold tracking-widest">Linked Account</Text>
                      <Title level={4} className="!text-white !font-black !mb-0 mt-1 uppercase">•••• 4567</Title>
                    </div>
                    <Tag color="green" className="rounded-full px-3 border-none font-bold">Verified</Tag>
                  </div>
                  <Button ghost className="rounded-xl border-white/20 text-white hover:text-white hover:border-white">
                    Edit Payout Method
                  </Button>
                </Card>
              </div>
            )
          }
        ]} />
      </Card>
    </motion.div>
  );
}

function NotifyRow({ title, desc, checked = false }: any) {
  return (
    <div className="flex justify-between items-center group">
      <div>
        <div className="font-bold text-gray-800">{title}</div>
        <Text className="text-gray-400 text-xs">{desc}</Text>
      </div>
      <Switch defaultChecked={checked} className="group-hover:scale-110 transition-transform" />
    </div>
  );
}
