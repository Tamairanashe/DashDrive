import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Space, Switch, Slider, 
  Table, Tag, Button, Statistic, Divider, message, 
  InputNumber, List, Avatar, Badge, Empty, Tabs, 
  Progress, Alert, Tooltip, Descriptions
} from 'antd';
import { 
  ThunderboltOutlined, ControlOutlined, SyncOutlined, 
  RadarChartOutlined, SettingOutlined, PlayCircleOutlined, 
  PauseCircleOutlined, UserOutlined, CarOutlined,
  WarningOutlined, CheckCircleOutlined, SwapOutlined,
  InfoCircleOutlined, TeamOutlined, BoxPlotOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Mock Data ---

const INITIAL_ZONES = [
  { id: 'z1', name: 'CBD', auto: true, multiplier: 1.8, demand: 'High', drivers: 12 },
  { id: 'z2', name: 'Avondale', auto: true, multiplier: 1.1, demand: 'Medium', drivers: 25 },
  { id: 'z3', name: 'Borrowdale', auto: false, multiplier: 1.5, demand: 'High', drivers: 18 },
];

const MOCK_CANDIDATES = [
  { id: 'D-221', name: 'Alex T.', distance: '0.8 km', eta: '3 min', score: 92, status: 'Idle' },
  { id: 'D-309', name: 'Sarah M.', distance: '1.2 km', eta: '5 min', score: 85, status: 'Idle' },
  { id: 'D-120', name: 'John K.', distance: '1.6 km', eta: '6 min', score: 80, status: 'Completing Trip' },
];

const MOCK_QUEUE = [
  { id: 'ORD-1021', type: 'Ride', customer: 'Alice J.', zone: 'CBD', waitTime: '02:15', status: 'Waiting', priority: 'Normal' },
  { id: 'ORD-1022', type: 'Food', customer: 'Bob S.', zone: 'Avondale', waitTime: '01:45', status: 'Assigning', priority: 'High' },
  { id: 'ORD-1023', type: 'Mart', customer: 'Charlie R.', zone: 'CBD', waitTime: '00:30', status: 'Waiting', priority: 'VIP' },
  { id: 'ORD-1030', type: 'Ride', customer: 'Diana P.', zone: 'Airport', waitTime: '05:00', status: 'Failed', priority: 'Normal', reason: 'No Driver Available' },
];

const MOCK_BATCH = {
  id: 'BATCH-401',
  store: 'Fresh Mart CBD',
  orders: ['ORD-551', 'ORD-552', 'ORD-553'],
  efficiency: '+45%',
  status: 'Forming'
};

export const DispatchManagementPage: React.FC = () => {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [radius, setRadius] = useState(5);
  const [isEnabled, setIsEnabled] = useState(true);

  const handleManualAssign = (driverName: string) => {
    if (!selectedOrder) return;
    message.success(`Manually assigned ${driverName} to ${selectedOrder.id}`);
    setQueue(prev => prev.filter(o => o.id !== selectedOrder.id));
    setSelectedOrder(null);
  };

  const queueColumns = [
    { 
      title: 'Order ID', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text: string, record: any) => (
        <Space>
            <Text strong>{text}</Text>
            {record.priority === 'VIP' && <Tag color="gold" icon={<StarOutlined style={{color: '#d48806'}} />} style={{margin: 0, border: 'none', background: '#fff1b8'}}>VIP</Tag>}
            {record.priority === 'High' && <Badge status="error" />}
        </Space>
      )
    },
    { 
      title: 'Service', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color={type === 'Ride' ? 'blue' : type === 'Food' ? 'orange' : 'green'}>{type}</Tag>
    },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { 
      title: 'Wait Time', 
      dataIndex: 'waitTime', 
      key: 'waitTime',
      render: (time: string, record: any) => (
        <Text type={record.status === 'Failed' || parseInt(time) > 4 ? 'danger' : 'secondary'}>{time}</Text>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Waiting' ? 'default' : status === 'Assigning' ? 'processing' : 'error'}>{status}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => setSelectedOrder(record)}>Oversight</Button>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Logistics Dispatch & Rules Brain</Title>
          <Text type="secondary">Monitor the live matching queue and override automated assignments.</Text>
        </Col>
        <Col>
          <Space>
            <Badge status={isEnabled ? 'success' : 'error'} text={isEnabled ? 'Engine Active' : 'Engine Paused'} />
            <Button 
              danger={isEnabled}
              icon={isEnabled ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setIsEnabled(!isEnabled)}
            >
              {isEnabled ? 'Pause Dispatch' : 'Resume Dispatch'}
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Column: Queue and Rules */}
        <Col xs={24} lg={15}>
          <Card 
            className="shadow-sm" 
            bordered={false}
            title={<Space><RadarChartOutlined /> Live Dispatch Queue</Space>}
            extra={<Button icon={<SyncOutlined />} size="small">Refresh</Button>}
          >
            <Tabs defaultActiveKey="1" items={[
              {
                key: '1',
                label: `Pending (${queue.filter(o => o.status !== 'Failed').length})`,
                children: <Table columns={queueColumns} dataSource={queue.filter(o => o.status !== 'Failed')} pagination={false} size="small" rowKey="id" />
              },
              {
                key: '2',
                label: `Failed Assignments (${queue.filter(o => o.status === 'Failed').length})`,
                children: <Table columns={queueColumns} dataSource={queue.filter(o => o.status === 'Failed')} pagination={false} size="small" rowKey="id" />
              }
            ]} />
          </Card>

          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={12}>
              <Card title={<Space><ControlOutlined /> Engine Rules</Space>} bordered={false} className="shadow-sm" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                   <div>
                     <Text type="secondary" style={{fontSize: 12}}>Search Radius</Text>
                     <Slider min={1} max={15} value={radius} onChange={setRadius} tooltip={{ formatter: (v) => `${v} km` }} />
                   </div>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <Text type="secondary" style={{fontSize: 12}}>Acceptance Timeout</Text>
                     <InputNumber size="small" defaultValue={15} addonAfter="sec" />
                   </div>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <Text type="secondary" style={{fontSize: 12}}>Max Retry Attempts</Text>
                     <InputNumber size="small" defaultValue={3} />
                   </div>
                   <Button block size="small" icon={<SettingOutlined />}>Advanced Config</Button>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={<Space><BoxPlotOutlined /> Mart Order Batching</Space>} bordered={false} className="shadow-sm" size="small">
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <Row justify="space-between">
                    <Text strong>{MOCK_BATCH.id}</Text>
                    <Tag color="green">{MOCK_BATCH.efficiency} Efficiency</Tag>
                  </Row>
                  <Text type="secondary" style={{fontSize: 12}}>{MOCK_BATCH.store}</Text>
                  <Divider style={{margin: '8px 0'}} />
                  <Space size="small">
                    {MOCK_BATCH.orders.map(o => <Tag key={o} style={{fontSize: 10}}>{o}</Tag>)}
                  </Space>
                </div>
                <Button block type="dashed" size="small">Create New Batch</Button>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Column: Order Oversight & Details */}
        <Col xs={24} lg={9}>
          {!selectedOrder ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: '#fff', borderRadius: 8, border: '1px dashed #e2e8f0' }}>
               <Empty description="Select an order for Oversight" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {selectedOrder.status === 'Failed' && (
                <Alert
                  message="Assignment Failure"
                  description={selectedOrder.reason}
                  type="error"
                  showIcon
                  action={
                    <Button size="small" type="primary" onClick={() => message.info("Expansion command sent")}>Expand Radius</Button>
                  }
                />
              )}

              <Card title="Order Insight" bordered={false} className="shadow-sm" size="small">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Order">{selectedOrder.id}</Descriptions.Item>
                  <Descriptions.Item label="Customer">{selectedOrder.customer}</Descriptions.Item>
                  <Descriptions.Item label="Zone">{selectedOrder.zone}</Descriptions.Item>
                  <Descriptions.Item label="Priority">
                     <Tag color={selectedOrder.priority === 'VIP' ? 'gold' : 'blue'}>{selectedOrder.priority}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="Driver Candidates" bordered={false} className="shadow-sm" size="small">
                <List
                  dataSource={MOCK_CANDIDATES}
                  renderItem={item => (
                    <List.Item 
                      actions={[<Button type="link" size="small" onClick={() => handleManualAssign(item.name)}>Assign</Button>]}
                      style={{ padding: '8px 0' }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<Space><Text strong>{item.name}</Text> <Tag style={{fontSize: 10}} color="cyan">{item.score}% Match</Tag></Space>}
                        description={`${item.distance} • ${item.eta} • ${item.status}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>

              <Card title="Matching Log" bordered={false} className="shadow-sm" size="small">
                 <Timeline
                    size="small"
                    items={[
                      { children: 'Engine initialized search (r=5km)', color: 'green' },
                      { children: '3 candidates identified', color: 'green' },
                      { children: 'Request sent to Driver Alex T. (92%)', color: 'blue' },
                      { children: 'Alex T. Timeout (15s)', color: 'red' },
                      { children: 'Retrying with Sarah M. (85%)', color: 'gray' },
                    ]}
                 />
              </Card>

              <Button block icon={<CloseCircleOutlined />} onClick={() => setSelectedOrder(null)}>Close Oversight</Button>
            </Space>
          )}

          <Card 
            title={<Space><ThunderboltOutlined /> Surge Controls</Space>} 
            bordered={false} 
            className="shadow-sm" 
            style={{ marginTop: 24 }}
            size="small"
          >
            <Table 
                dataSource={zones} 
                pagination={false} 
                size="small"
                rowKey="id"
                columns={[
                    { title: 'Zone', dataIndex: 'name', key: 'name' },
                    { title: 'Multiplier', dataIndex: 'multiplier', key: 'multiplier', render: (m) => <Text strong>{m}x</Text> },
                    { title: 'Auto', dataIndex: 'auto', key: 'auto', render: (a) => <Switch size="small" checked={a} /> }
                ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Internal icon fix for VIP
const StarOutlined = ({style}: {style?: React.CSSProperties}) => (
    <svg style={style} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

const Timeline = ({items, size}: {items: any[], size?: string}) => (
    <div style={{padding: '8px 0'}}>
        {items.map((it, i) => (
            <div key={i} style={{display: 'flex', gap: 12, marginBottom: 8, fontSize: 12}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', background: it.color || '#d1d5db', marginTop: 4, flexShrink: 0}} />
                <Text type="secondary">{it.children}</Text>
            </div>
        ))}
    </div>
);
