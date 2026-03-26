import React, { useState } from 'react';
import { 
  Typography, Row, Col, Card, Table, Button, Tag, Space, 
  Form, Input, Select, Badge, Drawer, InputNumber, message,
  DatePicker, Divider, Statistic, Switch, Tooltip,
  Modal, notification, Empty
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, CalendarOutlined, GiftOutlined,
  InfoCircleOutlined, CheckCircleOutlined,
  HistoryOutlined, CopyOutlined, WarningOutlined,
  ReloadOutlined, RestOutlined
} from '@ant-design/icons';
import { Gift, Percent, Calendar, Search, ShieldCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Mock Bonus Data
const initialBonuses = [
  { 
    id: 'BNS-401', 
    title: 'Ramadan 50% Top-up', 
    description: 'Special holiday bonus for all users in the Harare region.',
    minAddAmount: 100, 
    maxBonus: 5000, 
    amount: 50,
    amountType: 'percentage',
    startDate: '2026-03-01', 
    endDate: '2026-04-30',
    status: 'Active'
  },
  { 
    id: 'BNS-402', 
    title: 'Quick Recharge 20%', 
    description: 'Weekly top-up incentive for Silver tier and above.',
    minAddAmount: 50, 
    maxBonus: 1000, 
    amount: 20,
    amountType: 'percentage',
    startDate: '2026-01-01', 
    endDate: '2026-12-31',
    status: 'Active'
  },
];

export const WalletBonusManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bonuses, setBonuses] = useState(initialBonuses);
  const [filteredBonuses, setFilteredBonuses] = useState(initialBonuses);
  const [trashedBonuses, setTrashedBonuses] = useState<any[]>([]);
  const [trashVisible, setTrashVisible] = useState(false);
  const [editingBonus, setEditingBonus] = useState<any>(null);
  const [selectedBonus, setSelectedBonus] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilteredBonuses(bonuses);
  };

  const handleRestoreBonus = (bonus: any) => {
    setTrashedBonuses(prev => prev.filter(b => b.id !== bonus.id));
    setBonuses(prev => [bonus, ...prev]);
    setFilteredBonuses(prev => [bonus, ...prev]);
    message.success(`Bonus "${bonus.title}" restored successfully`);
  };
  
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();

  const handleSaveBonus = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const formattedValues = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        status: 'Active',
        id: editingBonus ? editingBonus.id : `BNS-${Math.floor(100 + Math.random() * 900)}`
      };

      if (editingBonus) {
        const updated = bonuses.map(b => b.id === editingBonus.id ? formattedValues : b);
        setBonuses(updated);
        setFilteredBonuses(updated);
        notification.success({ message: 'Bonus Config Updated', description: `Changes to "${values.title}" have been saved.` });
      } else {
        const updated = [formattedValues, ...bonuses];
        setBonuses(updated);
        setFilteredBonuses(updated);
        notification.success({ message: 'Bonus Program Created', description: `"${values.title}" is now active for eligible users.` });
      }

      setDrawerVisible(false);
      setEditingBonus(null);
      form.resetFields();
      setLoading(false);
    }, 1200);
  };

  const handleEdit = (record: any) => {
    setEditingBonus(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)]
    });
    setDrawerVisible(true);
  };

  const handleDelete = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const bonusToRemove = bonuses.find(b => b.id === selectedBonus.id);
      if (bonusToRemove) {
        setTrashedBonuses(prev => [...prev, { ...bonusToRemove, deletedAt: new Date().toISOString(), reason: values.reason }]);
        const updated = bonuses.filter(b => b.id !== selectedBonus.id);
        setBonuses(updated);
        setFilteredBonuses(updated);
      }
      
      notification.warning({
          message: 'Bonus Moved to Trash',
          description: `The "${selectedBonus.title}" program has been moved to trash. Reason: ${values.reason}`,
      });
      
      setDeleteModalVisible(false);
      deleteForm.resetFields();
      setLoading(false);
    }, 1200);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    message.loading({ content: 'Syncing campaign data...', key: 'refresh' });
    setTimeout(() => {
      setRefreshing(false);
      message.success({ content: 'Campaign list refreshed!', key: 'refresh' });
    }, 1000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bonuses.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.description.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    );
    setFilteredBonuses(filtered);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Bonus ID copied');
  };

  const columns = [
    { 
        title: 'Campaign Details', 
        key: 'campaign',
        render: (_: any, record: any) => (
            <Space size="middle">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                    <GiftOutlined style={{ color: '#f97316', fontSize: 18 }} />
                </div>
                <div>
                    <Text strong style={{ fontSize: 14, display: 'block' }}>{record.title}</Text>
                    <Space size={4}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
                        <Tooltip title="Copy ID">
                            <Button type="text" size="small" icon={<CopyOutlined style={{ fontSize: 10 }} />} onClick={() => copyToClipboard(record.id)} />
                        </Tooltip>
                    </Space>
                </div>
            </Space>
        )
    },
    { 
      title: 'Logic / Eligibility', 
      key: 'logic',
      render: (_: any, record: any) => (
        <Space orientation="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 11 }}>Min Deposit: <Text strong style={{ fontSize: 11, color: '#0f172a' }}>$ {record.minAddAmount.toFixed(2)}</Text></Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Max Cap: <Text strong style={{ fontSize: 11, color: '#0f172a' }}>$ {record.maxBonus.toFixed(2)}</Text></Text>
        </Space>
      )
    },
    { 
      title: 'Bonus Value', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number, record: any) => (
        <Tag color="purple" style={{ fontWeight: 'bold', border: 'none', borderRadius: 4, padding: '0 8px' }}>
          {record.amountType === 'percentage' ? `${val}%` : `$ ${val.toFixed(2)}`}
        </Tag>
      )
    },
    { 
        title: 'Timeline', 
        key: 'timeline', 
        render: (_: any, record: any) => (
            <Space orientation="vertical" size={2}>
                <Text style={{ fontSize: 11 }}><CalendarOutlined className="mr-1" /> {dayjs(record.startDate).format('MMM D, YYYY')}</Text>
                <Text type="secondary" style={{ fontSize: 10, marginLeft: 16 }}>Until {dayjs(record.endDate).format('MMM D, YYYY')}</Text>
            </Space>
        )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => (
        <Badge status={s === 'Active' ? 'success' : 'default'} text={s} />
      )
    },
    { 
      title: 'Operational Controls', 
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit Program">
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete Transfer">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => { setSelectedBonus(record); setDeleteModalVisible(true); }} />
          </Tooltip>
        </Space>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Global Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <Title level={4} style={{ margin: 0 }}>Wallet Incentive Engine</Title>
          <Text type="secondary">
              Design and manage bonus programs to encourage wallet deposits and platform loyalty.
              <Tooltip title="Users receive these bonuses automatically when they top up their wallets during the campaign period.">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#94a3b8' }} />
              </Tooltip>
          </Text>
        </div>
        <Space size="middle">
          <Button icon={<HistoryOutlined />} onClick={() => navigate('/enterprise/audit-logs')}>Bonus Logs</Button>
          <Button icon={<RestOutlined />} onClick={() => setTrashVisible(true)}>Manage Trash</Button>
          <Button icon={<SyncOutlined spin={refreshing} />} onClick={handleRefresh} />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ borderRadius: 8 }}
            onClick={() => {
              setEditingBonus(null);
              form.resetFields();
              setDrawerVisible(true);
            }}
          >
            Create New Program
          </Button>
        </Space>
      </div>

      {/* Bonus List */}
      <Card variant="borderless" className="shadow-md rounded-2xl overflow-hidden">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Title level={5} style={{ margin: 0 }}>Active Campaigns</Title>
             <Tag color="blue" style={{ borderRadius: 4, border: 'none' }}>{filteredBonuses.length} Programs</Tag>
          </div>
          <Space>
            <Tooltip title="Reset Filters">
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters} />
            </Tooltip>
            <Input 
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Search by title, ID or description..." 
              style={{ width: 320, borderRadius: 10 }}
              value={searchQuery}
              onChange={handleSearch}
              allowClear
            />
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredBonuses} 
          rowKey="id"
          loading={loading}
          pagination={{ 
              pageSize: 10,
              showTotal: (total) => <Text type="secondary" style={{ fontSize: 12 }}>Showing {total} unique incentive programs</Text>
          }}
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
             <div style={{ background: '#3b82f6', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <InfoCircleOutlined style={{ fontSize: 14 }} />
            </div>
            <div className="text-xs text-blue-700 leading-relaxed">
            <Text strong style={{ color: '#1d4ed8', display: 'block', marginBottom: 2 }}>Admin Strategy Guide (Simple English)</Text>
            Use <strong>Percentage</strong> bonuses to encourage larger deposits, and <strong>Fixed</strong> bonuses for special one-time rewards. 
            Remember to set an <strong>End Date</strong> to create a sense of urgency for your users.
          </div>
        </div>
      </Card>

      {/* Setup Drawer */}
      <Drawer
        title={<span className="font-black text-xl flex items-center gap-2"><GiftOutlined /> {editingBonus ? 'Edit Program Config' : 'Setup New Incentive'}</span>}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={480}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>Save Program</Button>
          </Space>
        }
        destroyOnClose
      >
        <Alert
          message="Campaign Logic"
          description="Once saved, this bonus will be visible to users in their app. It will only apply if their deposit meets the minimum requirement."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSaveBonus} initialValues={{ amountType: 'percentage' }}>
          <Form.Item name="title" label="Campaign Title*" rules={[{ required: true, message: 'Give this campaign a name.' }]}>
            <Input placeholder="Ex: Summer Top-up Special" maxLength={80} showCount />
          </Form.Item>
          
          <Form.Item name="description" label="Short Description (Visible to Users)*" rules={[{ required: true, message: 'Describe the benefit.' }]}>
            <Input.TextArea rows={3} placeholder="Ex: Get an extra 20% credit when you add $50 or more..." maxLength={255} showCount />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="amount" label="Bonus Value*" rules={[{ required: true, message: 'Enter value.' }]}>
                <InputNumber 
                  className="w-full h-10 border-slate-200" 
                  min={1} 
                  placeholder="Ex: 20"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="amountType" label="Calculation Type" rules={[{ required: true }]}>
                <Select className="h-10">
                  <Option value="percentage">Percentage (%)</Option>
                  <Option value="fixed">Fixed Amount ($)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minAddAmount" label="Minimum Deposit ($)" rules={[{ required: true, message: 'Enter min amount.' }]}>
                <InputNumber className="w-full" prefix="$" min={0} placeholder="Ex: 50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxBonus" label="Max Cap per User ($)" rules={[{ required: true, message: 'Enter max cap.' }]}>
                <InputNumber className="w-full" prefix="$" min={0} placeholder="Ex: 100" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="dateRange" label="Campaign Validity Period*" rules={[{ required: true, message: 'Select dates.' }]}>
            <RangePicker className="w-full" format="YYYY-MM-DD" placeholder={['Start Date', 'End Date']} />
          </Form.Item>

          <Divider />
          <Button block onClick={() => form.resetFields()}>Reset to Defaults</Button>
        </Form>
      </Drawer>

      {/* Deletion Modal */}
      <Modal
        title={<span><WarningOutlined style={{ color: '#ef4444' }} /> Mandatory Campaign Termination Insight</span>}
        open={deleteModalVisible}
        onCancel={() => { setDeleteModalVisible(false); deleteForm.resetFields(); }}
        onOk={() => deleteForm.submit()}
        confirmLoading={loading}
        okText="Terminate Program"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <Form form={deleteForm} layout="vertical" onFinish={handleDelete}>
            <p>You are about to stop the <strong>{selectedBonus?.title}</strong> program.</p>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Existing bonuses already credited to users will not be affected, but new deposits will no longer receive this incentive. Please provide a reason.</p>
            <Form.Item 
                name="reason" 
                label="Required: Termination Reason" 
                rules={[{ required: true, message: 'Please explain why this program is being ended early.' }]}
            >
                <TextArea placeholder="Ex: Replaced by Autumn campaign..." rows={4} />
            </Form.Item>
        </Form>
      </Modal>

      {/* Trash Drawer */}
      <Drawer
        title={<span><RestOutlined /> Trashed Campaigns</span>}
        open={trashVisible}
        onClose={() => setTrashVisible(false)}
        width={500}
      >
        <Table 
          dataSource={trashedBonuses}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Campaign', dataIndex: 'title', key: 'title' },
            { title: 'Deleted At', dataIndex: 'deletedAt', key: 'date', render: (d) => new Date(d).toLocaleString() },
            { 
              title: 'Actions', 
              key: 'actions', 
              align: 'right',
              render: (_, record) => (
                <Space>
                  <Button size="small" icon={<ReloadOutlined />} onClick={() => handleRestoreBonus(record)}>Restore</Button>
                  <Button size="small" danger onClick={() => setTrashedBonuses(prev => prev.filter(b => b.id !== record.id))}>Purge</Button>
                </Space>
              )
            }
          ]}
          locale={{ emptyText: <Empty description="No trashed campaigns" /> }}
        />
      </Drawer>
    </div>
  );
};

const Alert: React.FC<{message: string, description: string, type: 'info' | 'warning', showIcon: boolean, style?: React.CSSProperties}> = ({message, description, type, showIcon, style}) => (
    <div style={{ 
        padding: 12, 
        background: type === 'info' ? '#eff6ff' : '#fffbe6', 
        borderRadius: 8, 
        border: `1px solid ${type === 'info' ? '#dbeafe' : '#ffe58f'}`,
        display: 'flex', gap: 12, ...style 
    }}>
        {showIcon && (type === 'info' ? <CheckCircleOutlined style={{ color: '#3b82f6', marginTop: 4 }} /> : <WarningOutlined style={{ color: '#faad14', marginTop: 4 }} />)}
        <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{message}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
        </div>
    </div>
);

