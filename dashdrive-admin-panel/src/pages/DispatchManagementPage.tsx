import React, { useState, useEffect } from 'react';
import { 
  Typography, Row, Col, Card, Space, Switch, Slider, 
  Table, Tag, Button, Statistic, Divider, message, 
  InputNumber, List, Avatar, Badge, Empty, Tabs, 
  Progress, Alert, Tooltip, Descriptions, Segmented,
  Timeline, Drawer, Radio, Checkbox, Input, Select
} from 'antd';
import { 
  ThunderboltOutlined, ControlOutlined, SyncOutlined, 
  RadarChartOutlined, SettingOutlined, PlayCircleOutlined, 
  PauseCircleOutlined, UserOutlined, CarOutlined,
  WarningOutlined, CheckCircleOutlined, SwapOutlined,
  InfoCircleOutlined, TeamOutlined, BoxPlotOutlined,
  CloseCircleOutlined, ClockCircleOutlined, AreaChartOutlined,
  EnvironmentOutlined, RocketOutlined, AimOutlined,
  FilterOutlined, DeploymentUnitOutlined, EyeOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// --- Mock Data ---

const INITIAL_ZONES = [
  { id: 'z1', name: 'CBD', auto: true, multiplier: 1.8, demand: 'High', drivers: 12, ratio: 3.2 },
  { id: 'z2', name: 'Avondale', auto: true, multiplier: 1.1, demand: 'Medium', drivers: 25, ratio: 1.2 },
  { id: 'z3', name: 'Borrowdale', auto: false, multiplier: 1.5, demand: 'High', drivers: 18, ratio: 2.1 },
  { id: 'z4', name: 'Airport', auto: true, multiplier: 2.2, demand: 'Critical', drivers: 5, ratio: 4.5 },
];

const MOCK_CANDIDATES = [
  { id: 'D-221', name: 'Alex T.', distance: '0.8 km', eta: '3 min', score: 92, status: 'Idle', rating: 4.9 },
  { id: 'D-309', name: 'Sarah M.', distance: '1.2 km', eta: '5 min', score: 85, status: 'Idle', rating: 4.7 },
  { id: 'D-120', name: 'John K.', distance: '1.6 km', eta: '6 min', score: 80, status: 'Completing Trip', rating: 4.8 },
];

const MOCK_QUEUE = [
  { id: 'ORD-1021', type: 'Ride', customer: 'Alice J.', zone: 'CBD', waitTime: '02:15', status: 'Waiting', priority: 'Normal' },
  { id: 'ORD-1022', type: 'Food', customer: 'Bob S.', zone: 'Avondale', waitTime: '01:45', status: 'Assigning', priority: 'High' },
  { id: 'ORD-1023', type: 'Mart', customer: 'Charlie R.', zone: 'CBD', waitTime: '00:30', status: 'Waiting', priority: 'VIP' },
  { id: 'ORD-1030', type: 'Ride', customer: 'Diana P.', zone: 'Airport', waitTime: '05:00', status: 'Failed', priority: 'Normal', reason: 'No Driver Available' },
];

const PERFORMANCE_METRICS = [
  { label: 'Avg Pickup Time', value: '4.2 min', trend: '-12%', status: 'success' },
  { label: 'Success Rate', value: '98.4%', trend: '+2%', status: 'success' },
  { label: 'Active Batches', value: '142', trend: '+15%', status: 'processing' },
  { label: 'Surge Zones', value: '8', trend: '+3', status: 'warning' },
];

export const DispatchManagementPage: React.FC = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Weights State
  const [weights, setWeights] = useState({
    distance: 40,
    rating: 25,
    idle: 20,
    acceptance: 15
  });

  // Strategy Settings
  const [radius, setRadius] = useState(5);
  const [multiplier, setMultiplier] = useState(1.5);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleManualAssign = (driverName: string) => {
    message.success(`Manually assigned ${driverName} to request`);
    setSelectedOrder(null);
  };

  const queueColumns = [
    { 
      title: 'Request ID', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text: string, record: any) => (
        <Space>
            <Text strong>{text}</Text>
            {record.priority === 'VIP' && <Tag color="gold">VIP</Tag>}
        </Space>
      )
    },
    { 
      title: 'Service', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color={type === 'Ride' ? 'blue' : 'orange'}>{type}</Tag>
    },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { 
      title: 'Wait Time', 
      dataIndex: 'waitTime', 
      key: 'waitTime',
      render: (time: string) => <Text type={parseInt(time) > 4 ? 'danger' : 'secondary'}>{time}</Text>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Waiting' ? 'default' : status === 'Assigning' ? 'processing' : 'error'} text={status} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => setSelectedOrder(record)}>Oversight</Button>
      )
    }
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Dispatch & Matching Command</Title>
          <Text type="secondary">Enterprise-grade logistics engine for autonomous driver matching and batching.</Text>
        </Col>
        <Col>
          <Space size="large">
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Engine Protocol v4.2</Text>
              <Badge status={isEnabled ? 'success' : 'error'} text={<Text strong>{isEnabled ? 'AUTO-PILOT ACTIVE' : 'MANUAL OVERRIDE'}</Text>} />
            </div>
            <Button 
              size="large"
              type={isEnabled ? 'default' : 'primary'}
              danger={isEnabled}
              icon={isEnabled ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => {
                setIsEnabled(!isEnabled);
                message.info(isEnabled ? 'Matching engine paused' : 'AI Matching resumed');
              }}
              style={{ height: 48, borderRadius: 12, fontWeight: 600 }}
            >
              {isEnabled ? 'Pause Engine' : 'Resume Engine'}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Metrics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {PERFORMANCE_METRICS.map(m => (
          <Col span={6} key={m.label}>
            <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
              <Statistic 
                title={<Text type="secondary" style={{ fontSize: 13 }}>{m.label}</Text>}
                value={m.value}
                valueStyle={{ fontWeight: 700 }}
                suffix={<Text style={{ fontSize: 12, color: m.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{m.trend}</Text>}
              />
              <Progress percent={parseInt(m.value) || 85} size="small" showInfo={false} strokeColor={m.status === 'success' ? '#10b981' : m.status === 'warning' ? '#f59e0b' : '#3b82f6'} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24}>
        <Col xs={24} xl={16}>
          <Card bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              size="large"
              items={[
                {
                  key: '1',
                  label: <span><RadarChartOutlined /> Real-Time Queue</span>,
                  children: (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Space>
                          <Segmented options={['All Services', 'Ride Only', 'Delivery Only']} />
                          <Input prefix={<AimOutlined />} placeholder="Filter by target cluster..." style={{ width: 200 }} />
                        </Space>
                        <Button icon={<SyncOutlined />} type="text">Refresh Stream</Button>
                      </div>
                      <Table 
                        dataSource={queue} 
                        columns={queueColumns} 
                        pagination={{ pageSize: 5 }} 
                        size="middle"
                        rowKey="id"
                      />
                    </div>
                  )
                },
                {
                  key: '2',
                  label: <span><ControlOutlined /> Matching Strategy</span>,
                  children: (
                    <div style={{ padding: '0 10px' }}>
                      <Title level={5}>Scoring Weightage (AI Model)</Title>
                      <Paragraph type="secondary">Adjust weights used to rank drivers for any given request.</Paragraph>
                      
                      <Row gutter={40} style={{ marginBottom: 32 }}>
                        <Col span={12}>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong>Distance to Pickup</Text><Text type="secondary">{weights.distance}%</Text></div>
                            <Slider value={weights.distance} onChange={(v) => setWeights({...weights, distance: v})} />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong>Driver Rating</Text><Text type="secondary">{weights.rating}%</Text></div>
                            <Slider value={weights.rating} onChange={(v) => setWeights({...weights, rating: v})} />
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong>Idle Time Priority</Text><Text type="secondary">{weights.idle}%</Text></div>
                            <Slider value={weights.idle} onChange={(v) => setWeights({...weights, idle: v})} />
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text strong>Acceptance Velocity</Text><Text type="secondary">{weights.acceptance}%</Text></div>
                            <Slider value={weights.acceptance} onChange={(v) => setWeights({...weights, acceptance: v})} />
                          </div>
                        </Col>
                      </Row>

                      <Divider />

                      <Title level={5}>Execution Parameters</Title>
                      <Row gutter={40}>
                        <Col span={12}>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Initial Search Radius">
                              <InputNumber min={1} max={10} value={radius} onChange={(v) => setRadius(v || 3)} addonAfter="km" />
                            </Descriptions.Item>
                            <Descriptions.Item label="Expansion Steps">
                              <Select defaultValue="3" style={{ width: 120 }}>
                                <Option value="2">2 Steps</Option>
                                <Option value="3">3 Steps</Option>
                                <Option value="5">5 Steps</Option>
                              </Select>
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col span={12}>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Matching Model">
                              <Radio.Group defaultValue="sequential" size="small">
                                <Radio.Button value="sequential">Sequential</Radio.Button>
                                <Radio.Button value="batch">Batch / Batching</Radio.Button>
                              </Radio.Group>
                            </Descriptions.Item>
                            <Descriptions.Item label="Driver Timeout">
                              <InputNumber defaultValue={15} addonAfter="sec" />
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 24, padding: 16, background: isDark ? '#1a1a1a' : '#f8fafc', borderRadius: 12 }}>
                        <Button type="primary" style={{ background: '#0e172a' }}>Update Strategy Model</Button>
                      </div>
                    </div>
                  )
                },
                {
                  key: '3',
                  label: <span><BoxPlotOutlined /> Batching Logic</span>,
                  children: (
                    <div style={{ padding: '0 10px' }}>
                      <Alert 
                        type="info" 
                        showIcon 
                        message="Batching Intelligence" 
                        description="Optimize multi-order deliveries by overlapping routes. Applicable for Food and Mart services." 
                        style={{ marginBottom: 24 }} 
                      />
                      
                      <Row gutter={24}>
                        <Col span={12}>
                          <Title level={5}>Grouping Constraints</Title>
                          <Space orientation="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text>Maximum Orders per Batch</Text>
                              <InputNumber min={2} max={5} defaultValue={3} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text>Acceptable Route Deviation</Text>
                              <InputNumber min={10} max={60} defaultValue={25} addonAfter="%" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text>Prep Time Buffer</Text>
                              <InputNumber min={0} max={30} defaultValue={10} addonAfter="min" />
                            </div>
                          </Space>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title="Active Model Efficiency" style={{ background: isDark ? '#1a1a1a' : '#f1f5f9' }}>
                            <Progress type="dashboard" percent={78} strokeColor="#10b981" />
                            <div style={{ marginTop: 12 }}>
                              <Text type="secondary">Estimated $ saved/hr: </Text><Text strong style={{ color: '#10b981' }}>$1,240</Text>
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card 
            title={<Space><ThunderboltOutlined /> Surge & Demand Ratio</Space>} 
            bordered={false} 
            className="shadow-sm" 
            style={{ borderRadius: 16, marginBottom: 24 }}
            extra={<Tooltip title="AI Demand Prediction Enabled"><Badge status="processing" /></Tooltip>}
          >
            <Table 
              dataSource={INITIAL_ZONES} 
              pagination={false} 
              size="small" 
              rowKey="id"
              columns={[
                { title: 'Zone', dataIndex: 'name', key: 'name' },
                { title: 'Ratio', dataIndex: 'ratio', key: 'ratio', render: (r) => <Text style={{ color: r > 3 ? '#ef4444' : r > 2 ? '#f59e0b' : '#10b981' }}>{r} D/S</Text> },
                { title: 'Surge', dataIndex: 'multiplier', key: 'multiplier', render: (m) => <Text strong>{m}x</Text> },
                { title: 'Auto', dataIndex: 'auto', key: 'auto', render: (a) => <Switch size="small" checked={a} /> }
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <Button block icon={<ThunderboltOutlined />} type="dashed">Activate Global Surge (x1.5)</Button>
            </div>
          </Card>

          <Card title={<Space><AreaChartOutlined /> Success Metrics</Space>} bordered={false} className="shadow-sm" style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Matching Completion Rate</Text>
              <Progress percent={98} status="active" strokeColor="#10b981" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>ETA Prediction Accuracy</Text>
              <Progress percent={92} strokeColor="#3b82f6" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Driver Acceptance Rate</Text>
              <Progress percent={84} status="exception" strokeColor="#ef4444" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Oversight Drawer */}
      <Drawer
        title={<Space><DeploymentUnitOutlined /> Request Oversight: {selectedOrder?.id}</Space>}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        width={500}
        footer={
          <div style={{ display: 'flex', gap: 12 }}>
            <Button block icon={<CloseCircleOutlined />} onClick={() => setSelectedOrder(null)}>Cancel Search</Button>
            <Button block type="primary" icon={<ThunderboltOutlined />} style={{ background: '#0e172a' }}>Expand Radius</Button>
          </div>
        }
      >
        {selectedOrder && (
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {selectedOrder.status === 'Failed' && (
              <Alert 
                type="error" 
                showIcon 
                message="Matching Failure" 
                description="No drivers within the 5km radius accepted this request after 3 retry cycles." 
              />
            )}
            
            <Card size="small" title="Request Particulars">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Service Class">{selectedOrder.type}</Descriptions.Item>
                <Descriptions.Item label="Customer">{selectedOrder.customer}</Descriptions.Item>
                <Descriptions.Item label="Pickup Zone">{selectedOrder.zone}</Descriptions.Item>
                <Descriptions.Item label="Current WaitTime">{selectedOrder.waitTime}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="Top Ranked Candidates">
              <List
                dataSource={MOCK_CANDIDATES}
                renderItem={item => (
                  <List.Item actions={[<Button type="link" onClick={() => handleManualAssign(item.name)}>Force Match</Button>]}>
                    <List.Item.Meta 
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={<Space><Text strong>{item.name}</Text> <Tag color="green">{item.score}% Match</Tag></Space>}
                      description={`${item.distance} away • ETA ${item.eta}`}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card size="small" title="Dispatch Logic Trace">
              <Timeline
                items={[
                  { color: 'green', children: '00:01 - Engine started initial search (R=3km)' },
                  { color: 'blue', children: '00:05 - Request sent to Driver D-221 (92% Score)' },
                  { color: 'red', children: '00:20 - D-221 Explicit Rejection (Reason: Traffic)' },
                  { color: 'gray', children: '00:21 - Expanding search radius to R=5km' },
                  { color: 'blue', children: '00:25 - Request sent to Driver D-309 (85% Score)' },
                  { color: 'gray', children: 'Pending acceptance...' },
                ]}
              />
            </Card>
          </Space>
        )}
      </Drawer>

    </div>
  );
};

