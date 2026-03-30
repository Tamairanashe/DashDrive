import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Drawer, Timeline, Avatar } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ClaimsAdmin: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const columns = [
    { title: 'Global Claim ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Provider', dataIndex: 'provider', key: 'provider' },
    { title: 'Claimant', dataIndex: 'claimant', key: 'claimant', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Amount requested', dataIndex: 'amount', key: 'amount' },
    { 
      title: 'Current Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Paid' ? 'success' : status === 'Under Investigation' ? 'processing' : status === 'Rejected' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: 'Risk Flag', 
      dataIndex: 'risk', 
      key: 'risk',
      render: (risk: string) => risk === 'High' ? <Tag color="red" icon={<InfoCircleOutlined />}>High Risk</Tag> : <Text type="secondary">Normal</Text>
    },
    {
      title: 'Audit Trail',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          ghost 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedClaim(record);
            setOpen(true);
          }}
        >
          View Timeline
        </Button>
      )
    }
  ];

  const data = [
    { key: '1', id: 'GCLM-10552', provider: 'Allied Shield Ins.', claimant: 'Elena Rodriguez', amount: '$4,500', status: 'Under Investigation', risk: 'Normal' },
    { key: '2', id: 'GCLM-10553', provider: 'AutoGuard Partners', claimant: 'David Kim', amount: '$12,000', status: 'Rejected', risk: 'High' },
    { key: '3', id: 'GCLM-10554', provider: 'DashDrive Internal', claimant: 'Marcus Johnson', amount: '$800', status: 'Paid', risk: 'Normal' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Claim Audit Trail & Oversight</Title>
          <Text type="secondary">Monitor the lifecycle and adjudication status of claims processed by partners on the platform.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search Claim ID..." style={{ width: 250 }} />
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        style={{ background: '#1f1f1f', borderRadius: 8 }}
      />

      <Drawer
        title={<span style={{ color: '#fff' }}>Audit Timeline: {selectedClaim?.id}</span>}
        placement="right"
        width={500}
        onClose={() => setOpen(false)}
        open={open}
        style={{ background: '#141414', color: '#fff' }}
        headerStyle={{ borderBottom: '1px solid #303030' }}
      >
        {selectedClaim && (
          <Timeline mode="left">
            <Timeline.Item color="green" label="Oct 20, 2026">
              <Text strong style={{ color: '#fff' }}>Claim Submitted</Text><br/>
              <Text type="secondary">Origin: Driver App</Text>
            </Timeline.Item>
            <Timeline.Item color="blue" label="Oct 20, 2026">
              <Text strong style={{ color: '#fff' }}>Fraud Heuristics Check</Text><br/>
              <Text type="secondary">Result: {selectedClaim.risk} Risk</Text>
            </Timeline.Item>
            <Timeline.Item color="gray" label="Oct 21, 2026">
              <Text strong style={{ color: '#fff' }}>Routed to Provider</Text><br/>
              <Text type="secondary">Target: {selectedClaim.provider} Portal</Text>
            </Timeline.Item>
            {selectedClaim.status === 'Paid' && (
              <Timeline.Item dot={<CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />} label="Oct 24, 2026">
                <Text strong style={{ color: '#52c41a' }}>Payout Issued</Text><br/>
                <Text type="secondary">Amount: {selectedClaim.amount}</Text>
              </Timeline.Item>
            )}
            {selectedClaim.status === 'Rejected' && (
              <Timeline.Item color="red" label="Oct 22, 2026">
                <Text strong style={{ color: '#ff4d4f' }}>Claim Rejected</Text><br/>
                <Text type="secondary">Reason: Policy Exclusions</Text>
              </Timeline.Item>
            )}
            {selectedClaim.status === 'Under Investigation' && (
              <Timeline.Item color="blue" label="Current">
                <Text strong style={{ color: '#1677ff' }}>Awaiting Partner Adjudication</Text><br/>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8 }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text type="secondary">Assigned to: Agent 42 ({selectedClaim.provider})</Text>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        )}
      </Drawer>
    </div>
  );
};
