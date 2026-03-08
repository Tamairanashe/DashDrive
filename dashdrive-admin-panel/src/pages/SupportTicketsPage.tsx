import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Badge, 
  Input, 
  Select, 
  message,
  Avatar,
  Tooltip,
  Row,
  Col
} from 'antd';
import { 
  MessageOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { adminApi } from '../api/adminApi';

const { Title, Text } = Typography;
const { Option } = Select;

export const SupportTicketsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await adminApi.support.getSupportTickets(filterStatus);
      if (res.data?.length > 0) {
        setTickets(res.data);
      } else {
        // Mock data for demo
        setTickets([
          { 
            id: 'TCK-202', 
            subject: 'Missing Item in Order #1042', 
            status: 'OPEN', 
            priority: 'HIGH',
            customerName: 'Alice Johnson',
            createdAt: new Date().toISOString()
          },
          { 
            id: 'TCK-201', 
            subject: 'Rider took a wrong turn', 
            status: 'IN_PROGRESS', 
            priority: 'NORMAL',
            customerName: 'Bob Smith',
            createdAt: new Date(Date.now() - 7200000).toISOString()
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.support.updateTicketStatus(id, status);
      message.success('Ticket status updated');
      fetchTickets();
    } catch (err) {
      message.error('Update failed');
    }
  };

  const columns = [
    { title: 'Ticket ID', dataIndex: 'id', key: 'id', render: (id: string) => <Tag color="blue">{id}</Tag> },
    { 
      title: 'Customer', 
      dataIndex: 'customerName', 
      key: 'customerName',
      render: (name: string) => (
        <Space>
           <Avatar size="small" style={{ backgroundColor: '#87d068' }}>{name?.charAt(0)}</Avatar>
           <Text strong>{name}</Text>
        </Space>
      )
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority',
      render: (p: string) => <Tag color={p === 'HIGH' ? 'red' : 'orange'}>{p}</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => (
        <Badge status={s === 'OPEN' ? 'error' : s === 'IN_PROGRESS' ? 'processing' : 'success'} text={s} />
      )
    },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => <Text type="secondary">{new Date(d).toLocaleTimeString()}</Text> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Open Chat">
            <Button size="small" icon={<MessageOutlined />} type="link" />
          </Tooltip>
          <Select 
            size="small" 
            defaultValue={record.status} 
            onChange={(val) => updateStatus(record.id, val)}
            style={{ width: 120 }}
          >
            <Option value="OPEN">Open</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="RESOLVED">Resolved</Option>
            <Option value="CLOSED">Closed</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Support Help-Desk</Title>
          <Text type="secondary">Manage platform-wide customer and partner support tickets.</Text>
        </Col>
        <Col>
           <Space>
              <Input prefix={<SearchOutlined />} placeholder="Search tickets..." style={{ width: 250 }} />
              <Select placeholder="Filter status" style={{ width: 150 }} onChange={setFilterStatus} allowClear>
                 <Option value="OPEN">Open</Option>
                 <Option value="IN_PROGRESS">In Progress</Option>
                 <Option value="RESOLVED">Resolved</Option>
              </Select>
              <Button icon={<ClockCircleOutlined />} onClick={fetchTickets}>Refresh</Button>
           </Space>
        </Col>
      </Row>

      <Card bordered={false} className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={tickets} 
          loading={loading} 
          rowKey="id" 
        />
      </Card>
    </div>
  );
};
