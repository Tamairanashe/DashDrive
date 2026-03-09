import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Table, 
  Tag, 
  Statistic, 
  Space, 
  Button, 
  Avatar, 
  Progress, 
  Select, 
  Divider, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  List, 
  Badge,
  Tooltip,
  Breadcrumb
} from 'antd';
import { 
  TrophyOutlined, 
  StarOutlined, 
  TeamOutlined, 
  LineChartOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined, 
  SafetyCertificateOutlined, 
  RocketOutlined, 
  ThunderboltOutlined,
  CrownOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  DashboardOutlined, 
  RiseOutlined,
  SafetyOutlined,
  SearchOutlined,
  RightOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Internal icon helpers 
const ChevronRightOutlined = (props: any) => <RightOutlined {...props} />;
const SyncIcon = (props: any) => <SyncOutlined {...props} />;

interface DriverRewardsProps {
  activeTab: string;
}

interface Tier {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  points: number;
  minTrips: number;
  minRating: number;
  minAcceptanceRate: number;
  maxCancellations: number;
  driversCount: number;
  status: 'Active' | 'Inactive';
  benefits: string[];
}

interface Campaign {
  id: string;
  name: string;
  type: 'Trip Milestone' | 'Peak Hour' | 'Weekend' | 'Zone Incentive' | 'New Driver';
  startDate: string;
  endDate: string;
  rewardAmount: number;
  requirement: string;
  eligibleCities: string[];
  eligibleTiers: string[];
  status: 'Active' | 'Draft' | 'Ended';
  participation: number;
}

export const DriverRewards: React.FC<DriverRewardsProps> = ({ activeTab }) => {
  const [isCampaignModalVisible, setIsCampaignModalVisible] = useState(false);



  const renderGlobalSettings = () => (
    <Row gutter={[24, 24]}>
      <Col span={16}>
        <Card className="shadow-sm border-none" title={<Title level={4} style={{ margin: 0 }}>Rewards Hub Configuration</Title>}>
          <Form layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={<Text strong>Tier Review Cycle</Text>}>
                  <Select defaultValue="Monthly" style={{ width: '100%', borderRadius: 12 }}>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Quarterly">Quarterly</Option>
                    <Option value="Semi-Annual">Semi-Annual</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<Text strong>Points Per Ride</Text>}>
                  <InputNumber defaultValue={10} style={{ width: '100%', borderRadius: 12 }} suffix="Points" />
                </Form.Item>
              </Col>
            </Row>

            <Divider dashed>AUTOMATIC FRAUD CONTROLS</Divider>
            
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {[
                { label: 'Ghost Trip Detection', desc: 'Instantly disqualify campaigns if GPS deviation > 20%', status: true },
                { label: 'Multiple Account Link', desc: 'Freeze rewards if driver login detected on 2+ devices', status: true },
                { label: 'Unnatural Acceptance Spikes', disc: 'Flag accounts with sudden 100% acceptance during bonuses', status: false }
              ].map((fraud, i) => (
                <Card key={i} bodyStyle={{ padding: 20 }} className="bg-slate-50 border-none shadow-none" style={{ background: '#fafafa', borderRadius: 20 }}>
                  <Row justify="space-between" align="middle">
                    <div>
                      <Text strong>{fraud.label}</Text><br/>
                      <Text type="secondary" style={{ fontSize: 11 }}>{fraud.desc}</Text>
                    </div>
                    <Switch defaultChecked={fraud.status} />
                  </Row>
                </Card>
              ))}
            </Space>
          </Form>
        </Card>
      </Col>
      <Col span={8}>
        <Card className="shadow-sm border-none text-white" style={{ background: '#001529' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space size="middle">
              <SyncIcon style={{ fontSize: 24, color: '#0089D1' }} spin />
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>SYSTEM SYNCHRONIZER</Text>
            </Space>
            <div>
              <Title level={2} style={{ color: 'white', margin: 0 }}>Ready</Title>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>All rules synced with Production Node</Text>
            </div>
            <Button type="primary" block style={{ height: 48, borderRadius: 16, border: 'none', background: '#0089D1', fontWeight: 800 }}>Trigger Manual Re-assessment</Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  const campaigns = [
    { id: 'C-001', name: 'Weekend Driver Boost', type: 'Weekend', startDate: '2026-03-13', endDate: '2026-03-15', rewardAmount: 40, requirement: 'Complete 40 trips', eligibleCities: ['Harare', 'Lusaka'], eligibleTiers: ['Gold', 'Platinum'], status: 'Active', participation: 145 },
    { id: 'C-002', name: 'Airport Zone Bonus', type: 'Zone Incentive', startDate: '2026-03-09', endDate: '2026-03-16', rewardAmount: 3, requirement: 'Per trip from Airport Zone', eligibleCities: ['Harare'], eligibleTiers: ['All Tiers'], status: 'Active', participation: 320 },
    { id: 'C-003', name: 'New Driver Welcome', type: 'New Driver', startDate: '2026-03-01', endDate: '2026-03-31', rewardAmount: 100, requirement: 'Complete first 50 trips', eligibleCities: ['All'], eligibleTiers: ['Bronze'], status: 'Active', participation: 110 },
    { id: 'C-004', name: 'Peak Hour Challenge', type: 'Peak Hour', startDate: '2026-03-10', endDate: '2026-03-12', rewardAmount: 15, requirement: '10 trips during 5-8 PM', eligibleCities: ['Bulawayo'], eligibleTiers: ['Silver', 'Gold'], status: 'Active', participation: 85 },
    { id: 'C-005', name: 'Platinum Milestone', type: 'Trip Milestone', startDate: '2026-03-01', endDate: '2026-03-31', rewardAmount: 250, requirement: 'Complete 500 trips', eligibleCities: ['All'], eligibleTiers: ['Platinum'], status: 'Active', participation: 12 },
    { id: 'C-006', name: 'Rainy Day Incentive', type: 'Zone Incentive', startDate: '2026-03-09', endDate: '2026-03-09', rewardAmount: 5, requirement: 'Extra $5 per ride', eligibleCities: ['Harare'], eligibleTiers: ['All'], status: 'Draft', participation: 0 },
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Weekend': return <RocketOutlined style={{ color: '#eb2f96' }} />;
      case 'Peak Hour': return <ThunderboltOutlined style={{ color: '#faad14' }} />;
      case 'Zone Incentive': return <EnvironmentOutlined style={{ color: '#52c41a' }} />;
      case 'New Driver': return <TrophyOutlined style={{ color: '#1890ff' }} />;
      case 'Trip Milestone': return <DashboardOutlined style={{ color: '#722ed1' }} />;
      default: return <RocketOutlined />;
    }
  };

  const campaignColumns = [
    {
      title: 'Campaign',
      key: 'name',
      render: (_: any, record: any) => (
        <Space>
          <div style={{ 
            width: 40, height: 40, background: '#f8fafc', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}>
            {getTypeIcon(record.type)}
          </div>
          <div>
            <Text strong>{record.name}</Text><br/>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.type}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Reward',
      dataIndex: 'rewardAmount',
      key: 'reward',
      render: (val: number) => <Text strong style={{ color: '#52c41a' }}>${val}</Text>
    },
    {
      title: 'Requirement',
      dataIndex: 'requirement',
      key: 'requirement',
      render: (val: string) => <Text style={{ fontSize: 12 }}>{val}</Text>
    },
    {
      title: 'Eligible Levels',
      dataIndex: 'eligibleTiers',
      key: 'tiers',
      render: (tiers: string[]) => (
        <Space size={4} wrap>{tiers.map(t => <Tag key={t}>{t}</Tag>)}</Space>
      )
    },
    {
      title: 'Period',
      key: 'period',
      render: (_: any, record: any) => (
        <Text type="secondary" style={{ fontSize: 11 }}>{record.startDate} → {record.endDate}</Text>
      )
    },
    {
      title: 'Participation',
      dataIndex: 'participation',
      key: 'participation',
      render: (val: number) => (
        <Space>
          <Text strong>{val}</Text>
          <Progress percent={Math.min((val / 400) * 100, 100)} size="small" style={{ width: 60 }} showInfo={false} />
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : status === 'Draft' ? 'default' : 'error'}>{status}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: () => (
        <Space>
          <Tooltip title="Analytics"><Button size="small" type="text" icon={<LineChartOutlined />} /></Tooltip>
          <Tooltip title="Edit"><Button size="small" type="text" icon={<EditOutlined />} /></Tooltip>
        </Space>
      )
    }
  ];

  const renderCampaigns = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary Stats — matching standard DashDrive Statistic card pattern */}
      <Row gutter={[24, 24]}>
        {[
          { title: 'Active Campaigns', value: 4, icon: <RocketOutlined />, color: '#3b82f6' },
          { title: 'Eligible Drivers', value: 820, icon: <TeamOutlined />, color: '#10b981' },
          { title: 'Bonuses Paid (Week)', value: 12400, prefix: '$', icon: <DollarOutlined />, color: '#f59e0b' },
          { title: 'Top Driver Trips', value: 210, icon: <RiseOutlined />, color: '#6366f1' }
        ].map(stat => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 20 }}>
              <Space size={16}>
                <div style={{ 
                  width: 48, height: 48, background: `${stat.color}15`, 
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 24
                }}>
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} prefix={stat.prefix} valueStyle={{ fontWeight: 800 }} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Campaign Table */}
      <Card bordered={false} className="shadow-sm" bodyStyle={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong style={{ fontSize: 16 }}>Campaign Directory</Text><br/>
            <Text type="secondary" style={{ fontSize: 12 }}>Manage all active and upcoming bonus campaigns.</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>Create New Campaign</Button>
        </div>
        <Table 
          dataSource={campaigns}
          columns={campaignColumns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Achievements Section */}
      <Card bordered={false} className="shadow-sm">
        <Row gutter={24} align="middle">
          <Col span={8}>
            <Space direction="vertical" size={12}>
              <div style={{ width: 48, height: 48, background: '#faad1415', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />
              </div>
              <Title level={5} style={{ margin: 0 }}>Achievement & Gamification</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Incentivize long-term loyalty by rewarding consistency. Achievements unlock unique badges on the driver app.
              </Text>
              <Button type="primary">Configure Rules</Button>
            </Space>
          </Col>
          <Col span={16}>
            <Row gutter={16}>
              {[
                { label: 'The Centurion', icon: <RocketOutlined />, reward: 'Starter Badge', goal: 'First 100 trips', color: '#eb2f96' },
                { label: 'Five-Star Legend', icon: <StarOutlined />, reward: 'Premium Status', goal: '200 five-star ratings', color: '#faad14' },
                { label: 'Unstoppable', icon: <ThunderboltOutlined />, reward: '$150 Bonus', goal: '60 Days active', color: '#722ed1' }
              ].map(ach => (
                <Col span={8} key={ach.label}>
                  <Card bordered={false} style={{ background: '#f8fafc', textAlign: 'center' }} bodyStyle={{ padding: 20 }}>
                    <div style={{ width: 40, height: 40, margin: '0 auto 12px', background: `${ach.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ach.color, fontSize: 18 }}>
                      {ach.icon}
                    </div>
                    <Text strong style={{ display: 'block' }}>{ach.label}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{ach.goal}</Text>
                    <div style={{ marginTop: 8 }}><Tag color="blue">{ach.reward}</Tag></div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto' }}>
      {/* Main Content */}
      {activeTab === 'Campaigns' && renderCampaigns()}
      {activeTab === 'Global Settings' && renderGlobalSettings()}
    </div>
  );
};
