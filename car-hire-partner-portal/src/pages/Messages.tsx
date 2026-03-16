import React, { useState } from 'react';
import { Card, Avatar, Input, Button, Typography, Row, Col, Dropdown } from 'antd';
import { SendOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState('');

  const chats = [
    { id: 1, name: 'Sarah Jenkins', vehicle: 'Tesla Model 3', lastMessage: 'Thanks, see you tomorrow!', time: '10:30 AM', unread: 0 },
    { id: 2, name: 'Michael Chen', vehicle: 'BMW X5', lastMessage: 'Is the car available for airport delivery?', time: 'Yesterday', unread: 2 },
    { id: 3, name: 'Emma Watson', vehicle: 'Toyota Corolla', lastMessage: 'Perfect, I will book it now.', time: 'Mar 12', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'host', text: 'Hi Sarah, your trip is confirmed for tomorrow. The car will be clean and fully charged.', time: '09:00 AM' },
    { id: 2, sender: 'guest', text: 'Great! What time can I pick it up?', time: '09:15 AM' },
    { id: 3, sender: 'host', text: 'Anytime after 10:00 AM works for me.', time: '09:20 AM' },
    { id: 4, sender: 'guest', text: 'Thanks, see you tomorrow!', time: '10:30 AM' },
  ];

  const templates = [
    { key: '1', label: 'Check-in Instructions', content: 'Hi {{guest_name}}, your {{vehicle_make}} is ready! You can pick it up at {{pickup_location}} at {{start_time}}. The lockbox code is 1234. Have a great trip!' },
    { key: '2', label: 'Trip Reminder', content: 'Hello {{guest_name}}, just a quick reminder that your trip ends tomorrow at {{end_time}}. Please remember to return the car with a full tank of gas.' },
    { key: '3', label: 'Thank You', content: 'Thanks for booking with me, {{guest_name}}! I hope you enjoyed the {{vehicle_make}}. If you have a moment, I would really appreciate a 5-star review.' },
  ];

  const handleTemplateClick = (e: any) => {
    const template = templates.find(t => t.key === e.key);
    if (template) {
      const activeChatData = chats.find(c => c.id === activeChat);
      let content = template.content;
      if (activeChatData) {
        content = content.replace('{{guest_name}}', activeChatData.name.split(' ')[0]);
        content = content.replace('{{vehicle_make}}', activeChatData.vehicle);
        content = content.replace('{{pickup_location}}', '123 Main St');
        content = content.replace('{{start_time}}', '10:00 AM');
        content = content.replace('{{end_time}}', '10:00 AM');
      }
      setMessageText(content);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <Title level={4} className="!mb-4">Messages</Title>
      <Card className="shadow-sm flex-1 overflow-hidden" styles={{ body: { padding: 0, height: '100%', display: 'flex' } }}>
        <Row className="h-full w-full m-0">
          <Col span={8} className="border-r border-gray-200 h-full overflow-y-auto">
            <div className="flex flex-col">
              {chats.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${activeChat === item.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                  onClick={() => setActiveChat(item.id)}
                >
                  <Avatar icon={<UserOutlined />} className={`mr-3 flex-shrink-0 ${item.unread > 0 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`truncate ${item.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{item.name}</span>
                      <span className="text-xs text-gray-400 font-normal ml-2 flex-shrink-0">{item.time}</span>
                    </div>
                    <div className="text-xs text-indigo-600 mb-1">{item.vehicle}</div>
                    <div className={`truncate text-sm ${item.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {item.lastMessage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col span={16} className="h-full flex flex-col bg-gray-50">
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div className="font-semibold">{chats.find(c => c.id === activeChat)?.name}</div>
                  <div className="text-xs text-gray-500">Trip: {chats.find(c => c.id === activeChat)?.vehicle}</div>
                </div>
              </div>
              <Button>View Trip</Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'host' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'host' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none'}`}>
                    <div>{msg.text}</div>
                    <div className={`text-xs mt-1 text-right ${msg.sender === 'host' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <Dropdown menu={{ items: templates, onClick: handleTemplateClick }} placement="topLeft">
                  <Button icon={<FileTextOutlined />} title="Insert Template" />
                </Dropdown>
                <TextArea 
                  rows={2} 
                  placeholder="Type a message..." 
                  className="flex-1 resize-none" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="primary" className="h-auto" icon={<SendOutlined />}>Send</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
