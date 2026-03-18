import React, { useState } from 'react';
import { 
  Typography, Row, Col, Card, Table, Button, Tag, Space, 
  Input, Badge, Tooltip, Progress, Divider, Tabs, Drawer,
  Form, Select, InputNumber, Upload, message, Dropdown,
  Modal, notification
} from 'antd';
import { 
  CrownOutlined, UserOutlined, StarOutlined, 
  TrophyOutlined, FireOutlined, SearchOutlined,
  EditOutlined, DeleteOutlined, InfoCircleOutlined,
  CheckCircleOutlined, InboxOutlined, PlusOutlined,
  ReloadOutlined, DownloadOutlined, FileTextOutlined,
  FileExcelOutlined, PrinterOutlined, RestOutlined,
  HistoryOutlined, CopyOutlined, WarningOutlined
} from '@ant-design/icons';
import { Users, TrendingUp, Award, Zap, ShieldCheck, Search, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const initialLevels = [
  {
    id: 'LVL-101',
    name: 'Bronze',
    icon: <TrophyOutlined style={{ color: '#cd7f32' }} />,
    targets: [
      { label: 'Rides Needed', target: 50, points: 100 },
      { label: 'Spend Amount', target: 5000, points: 50, isCurrency: true },
      { label: 'Cancellation Limit', target: 80, points: 150, isRate: true },
      { label: 'Reviews Given', target: 30, points: 50 },
    ],
    totalTrip: 23,
    maxCancellationRate: 3.85,
    totalCustomer: 1,
    status: 'Active'
  },
  {
    id: 'LVL-102',
    name: 'Silver',
    icon: <TrophyOutlined style={{ color: '#c0c0c0' }} />,
    targets: [
      { label: 'Rides Needed', target: 200, points: 500 },
      { label: 'Spend Amount', target: 20000, points: 1000, isCurrency: true },
      { label: 'Cancellation Limit', target: 30, points: 100, isRate: true },
      { label: 'Reviews Given', target: 65, points: 1000 },
    ],
    totalTrip: 18,
    maxCancellationRate: 13.64,
    totalCustomer: 2,
    status: 'Active'
  },
  {
    id: 'LVL-103',
    name: 'Gold',
    icon: <TrophyOutlined style={{ color: '#ffd700' }} />,
    targets: [
      { label: 'Rides Needed', target: 1500, points: 1000 },
      { label: 'Spend Amount', target: 50000, points: 200, isCurrency: true },
      { label: 'Cancellation Limit', target: 75, points: 800, isRate: true },
      { label: 'Reviews Given', target: 80, points: 500 },
    ],
    totalTrip: 0,
    maxCancellationRate: 0,
    totalCustomer: 0,
    status: 'Active'
  },
  {
    id: 'LVL-104',
    name: 'Platinum',
    icon: <CrownOutlined style={{ color: '#e5e4e2' }} />,
    targets: [
      { label: 'Rides Needed', target: 2000, points: 2000 },
      { label: 'Spend Amount', target: 30000, points: 500, isCurrency: true },
      { label: 'Cancellation Limit', target: 20, points: 50, isRate: true },
      { label: 'Reviews Given', target: 90, points: 100 },
    ],
    totalTrip: 0,
    maxCancellationRate: 0,
    totalCustomer: 0,
    status: 'Active'
  },
  {
    id: 'LVL-105',
    name: 'Diamond',
    icon: <StarOutlined style={{ color: '#b9f2ff' }} />,
    targets: [
      { label: 'Rides Needed', target: 3000, points: 500 },
      { label: 'Spend Amount', target: 30000, points: 120, isCurrency: true },
      { label: 'Cancellation Limit', target: 2, points: 50, isRate: true },
      { label: 'Reviews Given', target: 100, points: 90 },
    ],
    totalTrip: 0,
    maxCancellationRate: 0,
    totalCustomer: 0,
    status: 'Active'
  }
];

export const CustomerLevelManagement: React.FC = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState(initialLevels);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();
  
  const [trashLevels, setTrashLevels] = useState([
    { id: 'TRSH-1', name: 'Legacy Star', deletedAt: '2023-10-15 14:30', reason: 'Redundant tier system' },
    { id: 'TRSH-2', name: 'Alpha Test', deletedAt: '2023-11-20 09:15', reason: 'Temporary testing tier' },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    message.loading({ content: 'Syncing tier data...', key: 'refresh' });
    setTimeout(() => {
      setRefreshing(false);
      message.success({ content: 'Loyalty tiers synchronized!', key: 'refresh' });
    }, 1200);
  };

  const handleAddLevel = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const newLevel = {
        id: `LVL-${Date.now().toString().slice(-4)}`,
        name: values.name,
        icon: <StarOutlined style={{ color: '#1890ff' }} />,
        targets: [
          { label: 'Rides Needed', target: values.minRide, points: values.ridePoints },
          { label: 'Spend Amount', target: values.minSpend, points: values.spendPoints, isCurrency: true },
          { label: 'Cancellation Limit', target: values.maxCancel, points: values.cancelPoints, isRate: true },
          { label: 'Reviews Given', target: values.minReview, points: values.reviewPoints },
        ],
        totalTrip: 0,
        maxCancellationRate: 0,
        totalCustomer: 0,
        status: 'Active'
      };
      
      setLevels([...levels, newLevel]);
      notification.success({
        message: 'Tier Created',
        description: `New loyalty tier "${values.name}" has been successfully configured and is now active.`,
      });
      setDrawerVisible(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const handleDeleteLevel = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const removedLevel = levels.find(l => l.id === selectedLevel.id);
      if (removedLevel) {
        setTrashLevels([
            ...trashLevels, 
            { ...removedLevel, deletedAt: new Date().toLocaleString(), reason: values.reason }
        ]);
        setLevels(levels.filter(l => l.id !== selectedLevel.id));
      }
      
      notification.warning({
        message: 'Tier Removed',
        description: `Tier "${selectedLevel.name}" has been moved to trash. Reason logged: ${values.reason}`,
      });
      setDeleteModalVisible(false);
      deleteForm.resetFields();
      setLoading(false);
    }, 1200);
  };

  const restoreLevel = (id: string) => {
    const levelToRestore = trashLevels.find(l => l.id === id);
    if (levelToRestore) {
        setLevels([...levels, { ...levelToRestore, status: 'Active' } as any]);
        setTrashLevels(trashLevels.filter(l => l.id !== id));
        message.success('Loyalty tier restored successfully');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('ID copied to clipboard');
  };

  const downloadMenu = {
    items: [
      { key: 'csv', label: 'Export as CSV', icon: <FileTextOutlined /> },
      { key: 'excel', label: 'Export as Excel', icon: <FileExcelOutlined /> },
      { key: 'print', label: 'Print List', icon: <PrinterOutlined /> },
    ],
    onClick: ({ key }: { key: string }) => {
      message.info(`Exporting data as ${key.toUpperCase()}...`);
    }
  };

  const filteredLevels = levels.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { title: 'Bronze', count: 1, color: 'bronze', icon: <TrophyOutlined />, info: 'Entry-level tier for all new customers.' },
    { title: 'Silver', count: 2, color: 'silver', icon: <TrophyOutlined />, info: 'Intermediate tier with standard benefits.' },
    { title: 'Gold', count: 0, color: 'gold', icon: <TrophyOutlined />, info: 'High-value tier with priority service.' },
    { title: 'Platinum', count: 0, color: 'platinum', icon: <CrownOutlined />, info: 'Premium tier for frequent users.' },
    { title: 'Diamond', count: 0, color: 'diamond', icon: <StarOutlined />, info: 'Elite tier with maximum rewards and concierge support.' },
  ];

  const columns = [
    { 
        title: 'Level Identity', 
        key: 'identity',
        render: (_: any, record: any) => (
            <Space size="middle">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100" style={{ fontSize: 20 }}>
                    {record.icon}
                </div>
                <div>
                    <Text strong style={{ fontSize: 14, display: 'block' }}>{record.name}</Text>
                    <Space size={4}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
                        <Tooltip title="Copy ID">
                            <Button 
                                type="text" 
                                size="small" 
                                icon={<CopyOutlined style={{ fontSize: 10 }} />} 
                                onClick={() => copyToClipboard(record.id)}
                            />
                        </Tooltip>
                    </Space>
                </div>
            </Space>
        )
    },
    { 
      title: 'Growth Targets (Required for Next Level)', 
      key: 'targets',
      width: 400,
      render: (_: any, record: any) => (
        <div className="space-y-1 py-2">
          {record.targets.map((t: any, idx: number) => (
            <Row key={idx} gutter={8}>
              <Col span={10}>
                  <Space size={4}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t.label} :</Text>
                    <Tooltip title={`Required to reach the next tier.`}>
                        <InfoCircleOutlined style={{ fontSize: 10, color: '#ccd5e1' }} />
                    </Tooltip>
                  </Space>
              </Col>
              <Col span={14}>
                <Text strong style={{ fontSize: 12 }}>
                  {t.isCurrency ? `$ ${t.target.toLocaleString()}` : t.isRate ? `${t.target}%` : t.target}
                  <Text type="secondary" className="ml-1 font-normal">({t.points} Reward Points)</Text>
                </Text>
              </Col>
            </Row>
          ))}
        </div>
      )
    },
    { 
      title: 'Current Utilization', 
      key: 'usage',
      render: (_: any, record: any) => (
          <Space direction="vertical" size={2}>
              <Text style={{ fontSize: 12 }}><Users className="w-3 h-3 inline mr-2 text-slate-400" /> {record.totalCustomer} Customers</Text>
              <Text style={{ fontSize: 12 }}><TrendingUp className="w-3 h-3 inline mr-2 text-slate-400" /> {record.totalTrip} Total Trips</Text>
          </Space>
      )
    },
    { 
      title: 'Health', 
      key: 'health',
      align: 'center' as const,
      render: (_: any, record: any) => (
          <div>
            <Tag 
                style={{ border: 'none', borderRadius: 4 }}
                color={record.maxCancellationRate > 10 ? 'error' : 'success'}
            >
                {record.maxCancellationRate}% Cancel Rate
            </Tag>
          </div>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => <Badge status={s === 'Active' ? 'success' : 'default'} text={s} />
    },
    { 
      title: 'Operational Controls', 
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Modify Tier Configuration">
            <Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedLevel(record); setDrawerVisible(true); }} />
          </Tooltip>
          <Tooltip title="Archive / Delete Tier">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => { setSelectedLevel(record); setDeleteModalVisible(true); }} />
          </Tooltip>
        </Space>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Standard Controls */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <Title level={4} style={{ margin: 0 }}>Customer Loyalty Framework</Title>
          <Text type="secondary">
              Configure growth paths, rewards, and eligibility for tiered customer status.
              <Tooltip title="This module controls how customers move from Bronze to Diamond based on their platform activity.">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#94a3b8' }} />
              </Tooltip>
          </Text>
        </div>
        <Space size="middle">
          <Button icon={<HistoryOutlined />} onClick={() => navigate('/enterprise/audit-logs')}>Tier Logs</Button>
          <Tooltip title="Synchronize latest tier data">
            <Button 
              icon={<ReloadOutlined spin={refreshing} />} 
              onClick={handleRefresh}
              className="flex items-center justify-center border-slate-200"
            />
          </Tooltip>

          <Dropdown menu={downloadMenu} placement="bottomRight">
            <Button icon={<DownloadOutlined />} className="border-slate-200">
              Download
            </Button>
          </Dropdown>

          <Button 
            icon={<RestOutlined />} 
            className="border-slate-200 text-slate-600"
            onClick={() => setTrashVisible(true)}
          >
            Manage Trashed
          </Button>

          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="rounded-lg font-bold"
            onClick={() => { setSelectedLevel(null); form.resetFields(); setDrawerVisible(true); }}
          >
            Create New Tier
          </Button>
        </Space>
      </div>

      {/* Summary Cards with Tooltips */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, idx) => (
          <Col xs={12} sm={8} lg={4.8} key={idx} style={{ flex: '0 0 20%', maxWidth: '20%' }}>
            <Tooltip title={stat.info}>
                <Card className="shadow-sm border-0 bg-slate-50/50 hover:bg-white transition-all cursor-help">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                    {stat.icon}
                    </div>
                    <div>
                    <Title level={5} style={{ margin: 0, fontSize: 14 }}>{stat.title}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>Registered Customers</Text>
                    <div className="text-xl font-bold mt-1">{stat.count}</div>
                    </div>
                </div>
                </Card>
            </Tooltip>
          </Col>
        ))}
      </Row>

      {/* Tier List */}
      <Card bordered={false} className="shadow-md rounded-2xl overflow-hidden">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <Title level={5} style={{ margin: 0 }}>Active Tier Configuration</Title>
            <Tabs 
              size="small" 
              className="mt-1"
              items={[
                { label: 'All Levels', key: 'all' },
                { label: 'Active Only', key: 'active' },
                { label: 'Disabled', key: 'inactive' },
              ]} 
            />
          </div>
          
          <Input 
            prefix={<Search className="w-4 h-4 text-slate-400" />} 
            placeholder="Search tiers by name..." 
            style={{ width: 300, borderRadius: 10 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredLevels} 
          rowKey="id"
          pagination={false}
          loading={loading}
          className="customer-levels-table"
        />

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <div style={{ background: '#f59e0b', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <InfoCircleOutlined style={{ fontSize: 14 }} />
            </div>
            <div className="text-xs text-amber-700 leading-relaxed">
            <Text strong style={{ color: '#b45309', display: 'block', marginBottom: 2 }}>Administrator Guidance (Simple English)</Text>
            To keep users engaged, make each level slightly harder to reach than the last one. Reward points are the main "currency" users earn to climb these tiers. <strong>Ensure you have enough rewards (bonuses) configured in the next tab to make these tiers desirable.</strong>
          </div>
        </div>
      </Card>

      {/* Trash Drawer */}
      <Drawer
        title={<span className="font-black text-xl flex items-center gap-2 text-slate-700"><RestOutlined /> Trashed Tier History</span>}
        open={trashVisible}
        onClose={() => setTrashVisible(false)}
        width={500}
        destroyOnClose
      >
        <Alert
          message="Archived Levels"
          description="These tiers are no longer visible to customers. Restoring a tier will immediately make it active and eligible for customers to join."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Table 
          dataSource={trashLevels}
          pagination={false}
          rowKey="id"
          size="middle"
          columns={[
            { title: 'Level Name', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
            { 
                title: 'Deletion Context', 
                key: 'context', 
                render: (_, record) => (
                    <Space direction="vertical" size={0}>
                         <Text type="secondary" style={{ fontSize: 11 }}>Reason: {record.reason || 'Not specified'}</Text>
                         <Text type="secondary" style={{ fontSize: 10 }}>Date: {record.deletedAt}</Text>
                    </Space>
                ) 
            },
            { 
              title: 'Action', 
              key: 'action',
              align: 'right' as const,
              render: (_, record) => (
                <Button 
                  type="link" 
                  size="small" 
                  icon={<ReloadOutlined />} 
                  onClick={() => restoreLevel(record.id)}
                >
                  Restore
                </Button>
              )
            }
          ]}
        />
      </Drawer>

      {/* Deletion Reason Modal */}
      <Modal
        title={<span><WarningOutlined style={{ color: '#ef4444' }} /> Mandatory Deletion Insight</span>}
        open={deleteModalVisible}
        onCancel={() => { setDeleteModalVisible(false); deleteForm.resetFields(); }}
        onOk={() => deleteForm.submit()}
        confirmLoading={loading}
        okText="Remove Tier"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <Form form={deleteForm} layout="vertical" onFinish={handleDeleteLevel}>
            <p>You are about to delete the <strong>{selectedLevel?.name}</strong> loyalty tier.</p>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>This action will disconnect users currently assigned to this tier. Please provide a clear reason for the audit log.</p>
            <Form.Item 
                name="reason" 
                label="Required: Deletion Reason" 
                rules={[{ required: true, message: 'Please explain why this tier is being removed.' }]}
            >
                <TextArea placeholder="Ex: Consolidation of Bronze and Silver tiers..." rows={4} />
            </Form.Item>
        </Form>
      </Modal>

      {/* Config Drawer */}
      <Drawer
        title={<span className="font-black text-xl flex items-center gap-2"><CrownOutlined /> {selectedLevel ? 'Edit Tier Config' : 'Create New Loyalty Tier'}</span>}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={550}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>Save Tier Config</Button>
          </Space>
        }
        destroyOnClose
      >
        <Alert
          message="Setup Guide"
          description="Loyalty levels are assigned automatically. Once a customer hits the targets below, they instantly level up and receive the configured reward."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleAddLevel} initialValues={selectedLevel ? {
            name: selectedLevel.name,
            minRide: selectedLevel.targets[0].target,
            ridePoints: selectedLevel.targets[0].points,
            minSpend: selectedLevel.targets[1].target,
            spendPoints: selectedLevel.targets[1].points,
            maxCancel: selectedLevel.targets[2].target,
            cancelPoints: selectedLevel.targets[2].points,
            minReview: selectedLevel.targets[3].target,
            reviewPoints: selectedLevel.targets[3].points,
        } : {}}>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="Tier Display Name*" rules={[{ required: true }]}>
                <Input placeholder="Ex: Black Diamond or Platinum Plus" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tier Icon / Graphic*">
            <Dragger name="file" multiple={false} maxCount={1} accept=".png">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload Badge Graphic</p>
              <p className="ant-upload-hint" style={{ fontSize: 11 }}>.png format only, max size 1MB (200x200 recommended)</p>
            </Dragger>
          </Form.Item>

          <Divider><Text strong>Level-Up Rewards</Text></Divider>
          <Text type="secondary" className="block mb-4" style={{ fontSize: 12 }}>Rewards are automatically credited to the User Wallet upon reaching this tier.</Text>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rewardType" label="Reward Delivery" initialValue="fixed">
                <Select>
                  <Option value="fixed">Wallet Credit (Fixed $)</Option>
                  <Option value="percentage">Cashback Bonus (%)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rewardAmount" label="Value*" initialValue={10}>
                <InputNumber className="w-full" prefix="$" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Divider><Text strong>Achievement Targets (To Reach Next Tier)</Text></Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minRide" label="Rides Completed" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} placeholder="50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ridePoints" label="Points Awarded" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} placeholder="100" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minSpend" label="Gross Spend Target ($)" rules={[{ required: true }]}>
                <InputNumber className="w-full" prefix="$" min={0} placeholder="5000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="spendPoints" label="Points Awarded" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} placeholder="50" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxCancel" label="Safe Cancellation %" rules={[{ required: true }]}>
                <InputNumber className="w-full" suffix="%" min={0} max={100} placeholder="5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cancelPoints" label="Points Awarded" rules={[{ required: true }]}>
                <InputNumber className="w-full" min={0} placeholder="150" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Button block onClick={() => form.resetFields()}>Reset to Defaults</Button>
        </Form>
      </Drawer>

      <style dangerouslySetInnerHTML={{ __html: `
        .customer-levels-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          font-weight: 600 !important;
          font-size: 13px !important;
        }
        .bg-bronze-100 { background-color: #f5ece5; }
        .text-bronze-600 { color: #cd7f32; }
        .bg-silver-100 { background-color: #f2f2f2; }
        .text-silver-600 { color: #909090; }
        .bg-gold-100 { background-color: #fffbef; }
        .text-gold-600 { color: #d4af37; }
        .bg-platinum-100 { background-color: #f9f9f8; }
        .text-platinum-600 { color: #707070; }
        .bg-diamond-100 { background-color: #f0fbff; }
        .text-diamond-600 { color: #0ea5e9; }
      `}} />
    </div>
  );
};

const Alert: React.FC<{message: string, description: string, type: 'info' | 'warning', showIcon: boolean, style?: React.CSSProperties}> = ({message, description, type, showIcon, style}) => (
    <div style={{ 
        padding: 12, 
        background: type === 'info' ? '#f0fdf4' : '#fffbe6', 
        borderRadius: 8, 
        border: `1px solid ${type === 'info' ? '#dcfce7' : '#ffe58f'}`,
        display: 'flex',
        gap: 12,
        ...style
    }}>
        {showIcon && (type === 'info' ? <CheckCircleOutlined style={{ color: '#10b981', marginTop: 4 }} /> : <WarningOutlined style={{ color: '#faad14', marginTop: 4 }} />)}
        <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{message}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
        </div>
    </div>
);
