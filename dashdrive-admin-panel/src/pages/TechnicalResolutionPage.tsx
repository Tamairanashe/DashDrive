import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Button, Space, Typography, Card, Badge, Row, Col, 
  Tabs, Statistic, Drawer, Descriptions, Alert, Input, Form,
  Timeline, Divider, message, Switch
} from 'antd';
import { 
  BugOutlined, CodeOutlined, HistoryOutlined, CloudSyncOutlined,
  CompassOutlined, GlobalOutlined, DatabaseOutlined, 
  SafetyCertificateOutlined, ReloadOutlined, 
  CloseOutlined, SearchOutlined, WarningOutlined, MobileOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

interface TechnicalTicket {
  key: string;
  ticketId: string;
  orderId: string;
  issueType: string;
  escalatedBy: string;
  timeEscalated: string;
  priority: 'High' | 'Critical';
  status: 'Investigating' | 'Hotfix Pending' | 'Resolved' | 'Failed - Retry Required';
  systemLogs: string[];
}

const SCENARIOS = [
  { value: 'success', label: 'Architectural Resolution (Success)', color: 'green' },
  { value: 'failure', label: 'DB Constraint Violation (Failure)', color: 'red' },
  { value: 'warning', label: 'Partial Success / Dirty Read (Warning)', color: 'orange' }
];

export const TechnicalResolutionPage: React.FC = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TechnicalTicket | null>(null);
  const [isPatchDrawerVisible, setIsPatchDrawerVisible] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState('1');
  const [selectedScenario, setSelectedScenario] = useState('success');
  const [tickets, setTickets] = useState<TechnicalTicket[]>([]);

  useEffect(() => {
    setTickets([
      {
        key: 'tt1',
        ticketId: 'TECH-7001',
        orderId: '#ORD-10045',
        issueType: 'Payment Sync Failure',
        escalatedBy: 'Senior Support (L1)',
        timeEscalated: '20 July 2025, 10:15 am',
        priority: 'Critical',
        status: 'Investigating',
        systemLogs: [
          '[10:15:01] ERROR: Stripe webhook verification failed for session_id: cs_live_...',
          '[10:15:05] WARN: Retrying connection to PostgreSQL (Attempt 1/3)',
          '[10:15:12] FATAL: Record locking contention for Order #ORD-10045'
        ]
      },
      {
        key: 'tt2',
        ticketId: 'TECH-7002',
        orderId: '#ORD-10022',
        issueType: 'GPS Drift Detected',
        escalatedBy: 'QA Auditor',
        timeEscalated: '20 July 2025, 11:30 am',
        priority: 'High',
        status: 'Hotfix Pending',
        systemLogs: [
          '[11:30:22] INFO: Socket.io connection stable at 45ms latency',
          '[11:32:01] WARN: High GPS variance (σ=14.2m) reported from driver device_id: DRV_99',
          '[11:32:15] DEBUG: Recalculating route using OSMR engine'
        ]
      }
    ]);
  }, []);

  const handleApplyResolution = () => {
    if (!selectedTicket) return;

    setLoading(true);
    message.loading('Starting transactional override...', 1.5).then(() => {
      setLoading(false);
      
      if (selectedScenario === 'success') {
        setTickets(prev => prev.map(t => t.key === selectedTicket.key ? {
          ...t,
          status: 'Resolved',
          systemLogs: [...t.systemLogs, `[${new Date().toLocaleTimeString()}] SUCCESS: Manual override applied. State: ORDER_STATE_COMPLETED_SUCCESS`]
        } : t));
        message.success('Correction applied: Transaction successfully committed.');
        setIsPatchDrawerVisible(false);
      } else if (selectedScenario === 'failure') {
        setTickets(prev => prev.map(t => t.key === selectedTicket.key ? {
          ...t,
          status: 'Failed - Retry Required',
          systemLogs: [...t.systemLogs, `[${new Date().toLocaleTimeString()}] FAILURE: DB foreign key constraint violation. Integrity check failed.`]
        } : t));
        message.error('Resolution Failed: Database rejected the update due to relational constraints.');
      } else {
        setTickets(prev => prev.map(t => t.key === selectedTicket.key ? {
          ...t,
          status: 'Hotfix Pending',
          systemLogs: [...t.systemLogs, `[${new Date().toLocaleTimeString()}] WARNING: Update partially applied. Secondary index sync delayed.`]
        } : t));
        message.warning('Partial Resolution: Main state updated, but downstream systems (Elasticsearch) failed to sync.');
      }
    });
  };

  const columns = [
    { title: 'Ticket ID', dataIndex: 'ticketId', key: 'ticketId', render: (text: string) => <Text strong code>{text}</Text> },
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Issue Type', dataIndex: 'issueType', key: 'issueType', render: (t: string) => <Badge status="error" text={t} /> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color="volcano">{p}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Resolved' ? 'green' : 'gold'}>{s}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: TechnicalTicket) => (
        <Button type="primary" size="small" ghost icon={<CodeOutlined />} onClick={() => setSelectedTicket(record)}>
          Launch Console
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={4}><BugOutlined /> Technical Resolution Hub</Title>
          <Text type="secondary">L2 Engineering Console - Advanced diagnostics and system state management</Text>
        </div>
        <Space>
           <Button icon={<CloudSyncOutlined />}>System Health: STABLE</Button>
           <Button type="primary" icon={<ReloadOutlined />}>Sync Pipeline</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card 
            variant="borderless" 
            className="shadow-sm" 
            title={<Space><HistoryOutlined /> Escalation Queue (L2)</Space>}
            extra={<Input.Search size="small" placeholder="Search logs/tickets..." style={{ width: 250 }} />}
            style={{ borderRadius: 16 }}
          >
            <Table 
              dataSource={tickets} 
              columns={columns} 
              pagination={{ pageSize: 5 }} 
              size="small"
            />
          </Card>

          {selectedTicket ? (
            <Card 
              variant="borderless" 
              className="shadow-sm" 
              style={{ marginTop: 16, borderRadius: 16, border: '1px solid #d9d9d933' }}
              title={<Space><CodeOutlined /> Diagnostic Workbench: {selectedTicket.ticketId}</Space>}
              extra={<Button size="small" type="link" onClick={() => setSelectedTicket(null)}>Close Workbench</Button>}
            >
              <Tabs 
                activeKey={activeConsoleTab} 
                onChange={setActiveConsoleTab}
                className="premium-tabs"
                items={[
                  {
                    key: '1',
                    label: <Space><CodeOutlined /> API Workbench</Space>,
                    children: (
                      <div style={{ background: '#1e1e1e', padding: 16, borderRadius: 8, color: '#d4d4d4', fontFamily: 'monospace', fontSize: 12 }}>
                        <div style={{ color: '#569cd6', marginBottom: 8 }}>// GET /api/v1/orders/{selectedTicket.orderId}/tracking</div>
                        <div>{'{'}</div>
                        <div style={{ paddingLeft: 16 }}>
                          <span style={{ color: '#9cdcfe' }}>"status"</span>: <span style={{ color: '#ce9178' }}>"success"</span>,<br />
                          <span style={{ color: '#9cdcfe' }}>"payload"</span>: {'{'}<br />
                          <div style={{ paddingLeft: 16 }}>
                            <span style={{ color: '#9cdcfe' }}>"lat"</span>: -17.824,<br />
                            <span style={{ color: '#9cdcfe' }}>"lng"</span>: 31.049,<br />
                            <span style={{ color: '#9cdcfe' }}>"provider_id"</span>: <span style={{ color: '#ce9178' }}>"DRV_99"</span>,<br />
                            <span style={{ color: '#9cdcfe' }}>"latency_ms"</span>: 42<br />
                          </div>
                          {'}'}<br />
                        </div>
                        <div>{'}'}</div>
                        <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                        <Button size="small" type="primary" ghost icon={<ReloadOutlined />}>Re-trigger Webhook</Button>
                      </div>
                    )
                  },
                  {
                    key: '2',
                    label: <Space><GlobalOutlined /> GPS Playback</Space>,
                    children: (
                      <div style={{ height: 300, background: '#f0f2f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                         <GlobalOutlined style={{ fontSize: 60, color: '#bfbfbf' }} />
                         <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: '#ffffffcc', padding: 8, borderRadius: 4, textAlign: 'center' }}>
                            <Text strong style={{ fontSize: 12 }}>Route Reconstruction Active - Accuracy: 98%</Text>
                         </div>
                      </div>
                    )
                  },
                  {
                    key: '3',
                    label: <Space><MobileOutlined /> Device Health</Space>,
                    children: (
                      <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Device Type">iPhone 14 Pro</Descriptions.Item>
                        <Descriptions.Item label="OS Version">iOS 16.5</Descriptions.Item>
                        <Descriptions.Item label="App Version">v2.4.1 (Build 1092)</Descriptions.Item>
                        <Descriptions.Item label="Network">5G (MTN)</Descriptions.Item>
                        <Descriptions.Item label="Battery">82%</Descriptions.Item>
                        <Descriptions.Item label="Disk Space">12.4 GB Free</Descriptions.Item>
                      </Descriptions>
                    )
                  }
                ]}
              />
            </Card>
          ) : (
            <Card variant="borderless" style={{ marginTop: 16, textAlign: 'center', borderRadius: 16, background: isDark ? '#1a1a1a' : '#fafafa' }}>
               <Empty description="Select a ticket from the queue to start resolution" />
            </Card>
          )}
        </Col>

        <Col span={8}>
          <Card variant="borderless" className="shadow-sm" title={<Space><DatabaseOutlined /> System State Tools</Space>} style={{ borderRadius: 16 }}>
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ padding: 12, border: '1px solid #d9d9d933', borderRadius: 8 }}>
                <Text strong style={{ fontSize: 13 }}>Force State Correction</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>Manually push an order to a terminal state.</Text>
                <div style={{ marginTop: 8 }}>
                  <Button block icon={<CloudSyncOutlined />} onClick={() => setIsPatchDrawerVisible(true)}>Initialize DB Patch</Button>
                </div>
              </div>

              <div style={{ padding: 12, border: '1px solid #d9d9d933', borderRadius: 8 }}>
                <Text strong style={{ fontSize: 13 }}>Cache Operations</Text>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>Flush User Session</Text>
                  <Switch size="small" />
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>Reload Wallet Schema</Text>
                  <Button size="small" type="link">Purge</Button>
                </div>
              </div>

              <div style={{ padding: 12, background: isDark ? '#1d1b11' : '#fffbe6', borderRadius: 8, border: '1px solid #ffe58f' }}>
                <Title level={5} style={{ margin: 0, fontSize: 14 }}><WarningOutlined style={{ color: '#faad14' }} /> Audit Warning</Title>
                <Text style={{ fontSize: 12 }}>All manual state adjustments are logged and mapped to your Employee ID for security audit.</Text>
              </div>
            </Space>
          </Card>

            {selectedTicket && (
            <Card variant="borderless" style={{ marginTop: 16, borderRadius: 16 }} title={<Space><CompassOutlined /> Real-time Logs</Space>}>
              <Timeline 
                items={tickets.find(t => t.key === selectedTicket.key)?.systemLogs.map((log, i) => ({
                  color: log.includes('ERROR') || log.includes('FAILURE') ? 'red' : log.includes('WARN') || log.includes('WARNING') ? 'gold' : log.includes('SUCCESS') ? 'green' : 'blue',
                  children: <Text style={{ fontSize: 11, fontFamily: 'monospace' }}>{log}</Text>
                }))}
              />
            </Card>
          )}
        </Col>
      </Row>

      <Drawer
        title={<Space><DatabaseOutlined /> Database Hotfix Utility</Space>}
        open={isPatchDrawerVisible}
        onClose={() => setIsPatchDrawerVisible(false)}
        width={500}
        extra={
          <Space>
            <Button key="cancel" onClick={() => setIsPatchDrawerVisible(false)}>Abort</Button>
            <Button key="apply" type="primary" danger loading={loading} onClick={handleApplyResolution}>Apply Correction</Button>
          </Space>
        }
      >
        <Alert 
          message="Critical Action Required"
          description="Select the resolution scenario to simulate different architectural outcomes."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Form layout="vertical">
          <Form.Item label="Target System">
             <Text strong>{selectedTicket?.ticketId || 'N/A'}</Text>
          </Form.Item>
          <Form.Item label="Resolution Scenario">
            <Space orientation="vertical" style={{ width: '100%' }}>
              {SCENARIOS.map(s => (
                <Card 
                  key={s.value}
                  size="small"
                  hoverable
                  onClick={() => setSelectedScenario(s.value)}
                  style={{ 
                    border: selectedScenario === s.value ? `2px solid #1890ff` : '1px solid #d9d9d933',
                    background: selectedScenario === s.value ? (isDark ? '#2d2d2d' : '#f0f5ff') : 'transparent'
                  }}
                >
                  <Space>
                    <Badge color={s.color} />
                    <Text strong={selectedScenario === s.value}>{s.label}</Text>
                  </Space>
                </Card>
              ))}
            </Space>
          </Form.Item>
          <Form.Item label="Authorization Reason">
            <Input.TextArea placeholder="Enter managerial authorization or Jira ID..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

const Empty: React.FC<{ description: string }> = ({ description }) => (
  <div style={{ padding: 40 }}>
    <CloudSyncOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <br />
    <Text type="secondary">{description}</Text>
  </div>
);

