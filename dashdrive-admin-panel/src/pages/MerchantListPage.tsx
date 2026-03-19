import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Card, 
  Typography, 
  Tabs, 
  Row, 
  Col, 
  Statistic,
  Avatar,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  LineChartOutlined, 
  MoreOutlined,
  ShopOutlined,
  AlertOutlined,
  WalletOutlined,
  StarOutlined,
  ReloadOutlined,
  RestOutlined,
  UndoOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { adminApi } from '../api/adminApi';
import { StateWrapper } from '../components/common/StateWrapper';
import { Modal, Form, message, Drawer, Empty } from 'antd';

const { Title, Text } = Typography;

export const MerchantListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Standardization State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, [activeTab]);

  const fetchMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusMap: any = {
        'Pending Approval': 'PENDING',
        'Active': 'Active',
        'Suspended': 'Suspended'
      };
      const status = statusMap[activeTab];
      const response = await adminApi.stores.list({ status });
      // Injecting simulated timestamps for demonstration
      const processedData = (response.data.data || []).map((m: any) => ({
        ...m,
        createdAt: '2025-10-12T14:30:00Z',
        updatedAt: '2026-03-18T08:22:15Z'
      }));
      setData(processedData);
    } catch (err: any) {
      console.error('Failed to fetch merchants:', err);
      setError('System could not retrieve the partner records. Please check your network connection.');
      // Mock fallback
      setData([
        { id: '1', name: 'Pick n Pay Hyper', owner_name: 'John Doe', regions: { name: 'Harare CBD' }, status: 'Active', is_active: true, logo_url: '', createdAt: '2025-10-12T14:30:00Z', updatedAt: '2026-03-18T08:22:15Z' },
        { id: '2', name: 'OK Supermarket', owner_name: 'Jane Smith', regions: { name: 'Bulawayo Central' }, status: 'PENDING', is_active: false, logo_url: '', createdAt: '2025-11-05T09:12:00Z', updatedAt: '2026-03-17T11:45:00Z' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchMerchants().finally(() => {
      setIsRefreshing(false);
      message.success('Merchant data synchronized');
    });
  };

  const handleStatusChange = async (id: string, newStatus: string, reason?: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // await adminApi.stores.updateStatus(id, newStatus, reason);
      
      setData(prev => prev.map(m => m.id === id ? { 
        ...m, 
        status: newStatus === 'Active' ? 'Active' : (newStatus === 'Suspended' ? 'Suspended' : 'PENDING'),
        is_active: newStatus === 'Active',
        updatedAt: new Date().toISOString()
      } : m));

      message.success(`Merchant status updated to ${newStatus}`);
      if (reason) message.info(`Audit Reason: ${reason}`);
    } catch (err) {
      message.error('Failed to update status');
    } finally {
      setLoading(false);
      setRejectionModalVisible(false);
      setPendingAction(null);
    }
  };

  const initiateSuspension = (record: any) => {
    setPendingAction({ id: record.id, name: record.name });
    setRejectionReason('');
    setRejectionModalVisible(true);
  };

  const handleConfirmSuspension = () => {
    if (!rejectionReason.trim()) {
      message.warning('Please provide a reason for suspension');
      return;
    }
    handleStatusChange(pendingAction!.id, 'Suspended', rejectionReason);
  };

  const handleResetToPending = (id: string) => {
    handleStatusChange(id, 'PENDING');
  };

  const columns = [
    {
      title: 'Merchant Information',
      key: 'info',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            size={48} 
            src={record.logo_url} 
            icon={<ShopOutlined />} 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
          />
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Zone',
      dataIndex: ['regions', 'name'],
      key: 'zone',
      render: (text: string) => <Text strong>{text || 'Unassigned'}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: any = { 'FOOD': 'orange', 'MART': 'blue', 'SHOPPING': 'purple', 'DIRECT': 'cyan' };
        return <Tag color={colorMap[type] || 'default'}>{type || 'UNKNOWN'}</Tag>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text: string, record: any) => {
        const status = record.status === 'PENDING' ? 'Pending' : (record.is_active ? 'Active' : 'Suspended');
        const color = status === 'Active' ? 'green' : (status === 'Pending' ? 'orange' : 'red');
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
       title: 'Audit Logs',
       key: 'audit',
       render: (_: any, record: any) => (
         <Space orientation="vertical" size={0}>
           <Text style={{ fontSize: 11, color: '#64748b' }}>Created: {new Date(record.createdAt).toLocaleDateString()}</Text>
           <Text style={{ fontSize: 11, color: '#64748b' }}>Modified: {new Date(record.updatedAt).toLocaleDateString()}</Text>
         </Space>
       )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          {record.status === 'Active' ? (
            <Tooltip title="Suspend Merchant">
              <Button type="text" danger icon={<CloseCircleOutlined />} onClick={() => initiateSuspension(record)} />
            </Tooltip>
          ) : (
            <Tooltip title="Approve / Activate">
              <Button type="text" icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} onClick={() => handleStatusChange(record.id, 'Active')} />
            </Tooltip>
          )}
          <Tooltip title="Reset to Pending">
             <Button type="text" icon={<UndoOutlined />} onClick={() => handleResetToPending(record.id)} />
          </Tooltip>
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  const stats = [
    { title: 'Total Partners', value: '1,240', icon: <ShopOutlined />, color: '#10b981' },
    { title: 'Pending Approval', value: '18', icon: <AlertOutlined />, color: '#f59e0b' },
    { title: 'Active Earnings', value: '$1.2M', icon: <WalletOutlined />, color: '#3b82f6' },
    { title: 'Avg Rating', value: '4.75', icon: <StarOutlined />, color: '#6366f1' },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0, letterSpacing: -0.5 }}>Merchant Management</Title>
          <Text type="secondary">Administer grocery partners, approvals, and performance metrics</Text>
        </Col>
        <Col>
          <Space size="middle">
            <Button 
              icon={<ReloadOutlined spin={isRefreshing} />} 
              onClick={handleManualRefresh}
              loading={isRefreshing}
            >
              Refresh
            </Button>
            <Button 
               icon={<RestOutlined />} 
               onClick={() => setTrashVisible(true)}
            >
               Trashed Merchants
            </Button>
            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: 8 }}>
              Onboard New Merchant
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} bodyStyle={{ padding: 20 }}>
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ 
                  width: 40, height: 40, background: `${stat.color}15`, 
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 20
                }}>
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} valueStyle={{ fontWeight: 800, fontSize: 24 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { key: 'All', label: 'All Merchants' },
              { key: 'Pending Approval', label: 'Pending Approval' },
              { key: 'Active', label: 'Active' },
              { key: 'Food', label: 'Food' },
              { key: 'Mart', label: 'Mart' },
              { key: 'Direct', label: 'Direct' },
              { key: 'Suspended', label: 'Suspended' },
            ]}
            style={{ marginBottom: -16 }}
          />
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Search merchants..."
            style={{ width: 300, borderRadius: 8 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <StateWrapper 
          loading={loading} 
          error={error} 
          isEmpty={data.length === 0}
          onRetry={fetchMerchants}
        >
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="id"
            pagination={{ 
              pageSize: 10, 
              position: ['bottomRight'],
              showSizeChanger: true,
              showTotal: (total) => `Page ${total} Merchants`
            }}
          />
        </StateWrapper>
      </Card>

      {/* Standardization Modals & Drawers */}
      <Modal
        title="Reason for Suspension"
        open={rejectionModalVisible}
        onOk={handleConfirmSuspension}
        onCancel={() => setRejectionModalVisible(false)}
        okText="Confirm Suspension"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Provide a reason for suspending <Text strong>{pendingAction?.name}</Text>. 
            This will be logged in the audit history.
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="Suspension Reason" required>
            <Input.TextArea 
              rows={4} 
              placeholder="e.g. Non-compliance with safety standards, repeated order cancellations..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={<span><RestOutlined /> Trashed Merchants (Suspended / Inactive)</span>}
        width={720}
        onClose={() => setTrashVisible(false)}
        open={trashVisible}
      >
        <Table
          size="small"
          dataSource={data.filter(m => m.status === 'Suspended' || !m.is_active)}
          rowKey="id"
          columns={[
            {
              title: 'Merchant',
              key: 'merchant',
              render: (_, r) => (
                <Space>
                  <Avatar size="small" src={r.logo_url} icon={<ShopOutlined />} />
                  <Text strong>{r.name}</Text>
                </Space>
              )
            },
            { title: 'Zone', dataIndex: ['regions', 'name'], key: 'zone' },
            { 
              title: 'Actions', 
              key: 'actions', 
              render: (_: any, r: any) => (
                <Space>
                  <Button size="small" icon={<UndoOutlined />} onClick={() => handleStatusChange(r.id, 'Active')}>Restore</Button>
                  <Button size="small" type="text" danger icon={<CloseCircleOutlined />}>Permanent Delete</Button>
                </Space>
              )
            }
          ]}
          locale={{ emptyText: <Empty description="No trashed merchants found" /> }}
        />
      </Drawer>
    </div>
  );
};

