import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Button, Input, Space, Dropdown, Menu } from 'antd';
import { SearchOutlined, FilterOutlined, MoreOutlined, EditOutlined, StopOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const GlobalUsers: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const columns = [
    { title: 'System ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Full Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Email Address', dataIndex: 'email', key: 'email' },
    { 
      title: 'Global Role', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => {
        let color = role === 'Super Admin' ? 'magenta' : role === 'Risk Manager' ? 'volcano' : role === 'Loan Officer' ? 'blue' : 'default';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'error'}>{status}</Tag>
    },
    { title: 'Last Active', dataIndex: 'lastActive', key: 'lastActive' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Dropdown menu={{
          items: [
            { key: '1', icon: <EditOutlined />, label: 'Edit Role/Permissions' },
            { key: '2', icon: <KeyOutlined />, label: 'Reset Password' },
            { type: 'divider' },
            { key: '3', icon: <StopOutlined />, label: 'Deactivate User', danger: true },
          ]
        }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} style={{ color: '#fff' }} />
        </Dropdown>
      )
    }
  ];

  const data = [
    { key: '1', id: 'USR-8001', name: 'Sarah Connor', email: 'sarah.connor@dashdrive.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago' },
    { key: '2', id: 'USR-8002', name: 'John Smith', email: 'john.smith@dashdrive.com', role: 'Risk Manager', status: 'Active', lastActive: '1 hr ago' },
    { key: '3', id: 'USR-8003', name: 'Alice Ray', email: 'alice.ray@dashdrive.com', role: 'Loan Officer', status: 'Active', lastActive: '5 hrs ago' },
    { key: '4', id: 'USR-8004', name: 'Bob Johnson', email: 'bob.j@dashdrive.com', role: 'Insurance Agent', status: 'Suspended', lastActive: '2 weeks ago' },
    { key: '5', id: 'USR-8005', name: 'Mike Ross', email: 'mike.r@dashdrive.com', role: 'Support Tier 2', status: 'Active', lastActive: 'Just now' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Global User Directory</Title>
          <Text type="secondary">Manage internal staff, administrators, and partner access levels across the platform.</Text>
        </Col>
        <Col>
          <Space>
            <Input 
              placeholder="Search users..." 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />} 
              style={{ width: 250 }} 
            />
            <Button icon={<FilterOutlined />}>Filters</Button>
            <Button type="primary" style={{ background: '#722ed1', borderColor: '#722ed1' }}>Invite User</Button>
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        style={{ background: '#1f1f1f', borderRadius: 8 }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
