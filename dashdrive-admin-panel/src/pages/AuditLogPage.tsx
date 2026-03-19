import React, { useState } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Card, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Badge,
  Tooltip,
  Breadcrumb
} from 'antd';
import { 
  SearchOutlined, 
  HistoryOutlined, 
  FilterOutlined, 
  InfoCircleOutlined,
  HomeOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { StateWrapper } from '../components/common/StateWrapper';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock Audit Data
const mockAuditLogs = [
  {
    key: '1',
    timestamp: '2026-03-18T10:30:00Z',
    admin: 'admin_jchit',
    event: 'COMMISSION_UPDATE',
    module: 'Enterprise Setup',
    context: 'Updated Ride Hailing commission from 15% to 18%',
    ip: '192.168.1.45',
    status: 'Success'
  },
  {
    key: '2',
    timestamp: '2026-03-18T09:15:22Z',
    admin: 'admin_jchit',
    event: 'DRIVER_STATUS_CHANGE',
    module: 'Driver Management',
    context: 'Deactivated driver DRV-9982 (Compliance issues)',
    ip: '192.168.1.45',
    status: 'Success'
  },
  {
    key: '3',
    timestamp: '2026-03-17T16:45:10Z',
    admin: 'sys_auto',
    event: 'SYSTEM_SYNC',
    module: 'Governance',
    context: 'Synchronized pricing with Zone: City-Center',
    ip: '127.0.0.1',
    status: 'Success'
  },
  {
    key: '4',
    timestamp: '2026-03-17T14:20:00Z',
    admin: 'ops_manager',
    event: 'ACCESS_DENIED',
    module: 'Financial Hub',
    context: 'Unauthorized attempt to access Settlement Reports',
    ip: '10.0.0.5',
    status: 'Failure'
  }
];

export const AuditLogPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (t: string) => (
        <Space orientation="vertical" size={0}>
          <Text strong style={{ fontSize: 13 }}>{new Date(t).toLocaleDateString()}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>{new Date(t).toLocaleTimeString()}</Text>
        </Space>
      ),
      width: 150,
      sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'Admin / Principal',
      dataIndex: 'admin',
      key: 'admin',
      render: (a: string) => (
        <Space>
          <Badge status="processing" size="small" />
          <Text strong>{a}</Text>
        </Space>
      ),
      width: 180,
    },
    {
      title: 'Event Type',
      dataIndex: 'event',
      key: 'event',
      render: (e: string) => <Tag color="blue">{e}</Tag>,
      width: 200,
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 150,
    },
    {
      title: 'Context / Activity',
      dataIndex: 'context',
      key: 'context',
      ellipsis: true,
      render: (c: string) => (
          <Tooltip title={c}>
            <Text>{c}</Text>
          </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => (
        <Tag color={s === 'Success' ? 'green' : 'red'}>{s}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: () => (
        <Space>
           <Button type="text" shape="circle" icon={<EyeOutlined />} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Breadcrumb 
        style={{ marginBottom: 16 }}
        items={[
          { title: <Space><HomeOutlined /> Dashboard</Space>, href: '/' },
          { title: 'Governance' },
          { title: 'Audit Logs' },
        ]}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, letterSpacing: -0.5 }}>
            <HistoryOutlined style={{ marginRight: 8, color: '#10b981' }} /> Audit Logs & Governance
          </Title>
          <Text type="secondary">Trace platform activities, administrative changes, and security events.</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />}>Export CSV</Button>
          <Button type="primary" icon={<HistoryOutlined />}>Archived Logs</Button>
        </Space>
      </div>

      <Card 
        style={{ borderRadius: 12, marginBottom: 24 }}
        styles={{ body: { padding: 16 } }}
      >
        <Space wrap size="middle">
          <Input 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            placeholder="Search logs..." 
            style={{ width: 250 }}
          />
          <Select placeholder="Module" style={{ width: 150 }} allowClear>
            <Select.Option value="Enterprise">Enterprise</Select.Option>
            <Select.Option value="Driver">Driver Hub</Select.Option>
            <Select.Option value="Financial">Financials</Select.Option>
          </Select>
          <Select placeholder="Event Type" style={{ width: 180 }} allowClear>
            <Select.Option value="UPDATE">Updates</Select.Option>
            <Select.Option value="DELETE">Deletions</Select.Option>
            <Select.Option value="LOGIN">Logins</Select.Option>
          </Select>
          <RangePicker showTime />
          <Button icon={<FilterOutlined />}>Apply Filters</Button>
        </Space>
      </Card>

      <StateWrapper loading={loading} isEmpty={mockAuditLogs.length === 0}>
        <Table 
          columns={columns} 
          dataSource={mockAuditLogs}
          pagination={{
            total: mockAuditLogs.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} logs found`
          }}
          scroll={{ x: 1200 }}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </StateWrapper>
    </div>
  );
};

