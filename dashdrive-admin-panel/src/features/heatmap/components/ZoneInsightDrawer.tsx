import React from 'react';
import { 
    Typography, Row, Col, Card, Button, Space, 
    Tag, Statistic, Divider, Alert, Tabs, InputNumber, 
    Select, Input, List, Avatar 
} from 'antd';
import { 
    ThunderboltOutlined, 
    CarOutlined, 
    ArrowUpOutlined, 
    NotificationOutlined,
    InfoCircleOutlined,
    GlobalOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { Zone, EventCluster, MarketplaceAction } from '../types';

const { Text } = Typography;
const { Option } = Select;

interface ZoneInsightDrawerProps {
    selectedZone: Zone;
    service: string;
    events: EventCluster[];
    traffic: any;
    weather: any;
    surgeValue: number;
    setSurgeValue: (val: number) => void;
    incentiveAmount: number;
    setIncentiveAmount: (val: number) => void;
    broadcastMode: 'INCENTIVE' | 'MANUAL';
    setBroadcastMode: (mode: 'INCENTIVE' | 'MANUAL') => void;
    manualBroadcastMessage: string;
    setManualBroadcastMessage: (msg: string) => void;
    commandLog: MarketplaceAction[];
    handleDeploySurge: () => void;
    handleBroadcast: () => void;
    onResetSurge: () => void;
    navigate: (url: string) => void;
}

export const ZoneInsightDrawer: React.FC<ZoneInsightDrawerProps> = ({
    selectedZone,
    service,
    events,
    traffic,
    weather,
    surgeValue,
    setSurgeValue,
    incentiveAmount,
    setIncentiveAmount,
    broadcastMode,
    setBroadcastMode,
    manualBroadcastMessage,
    setManualBroadcastMessage,
    commandLog,
    handleDeploySurge,
    handleBroadcast,
    onResetSurge,
    navigate
}) => {
    const getZoneColor = (demand: string) => {
        switch(demand) {
            case 'low': return '#22c55e';
            case 'medium': return '#eab308';
            case 'high': return '#ef4444';
            case 'critical': return '#a855f7';
            default: return '#3b82f6';
        }
    };

    const activeEvent = events.find(e => 
        e.isGlobal || (Math.abs(e.lat - selectedZone.lat) < 0.05 && Math.abs(e.lng - selectedZone.lng) < 0.05)
    );

    return (
        <Card
            variant="borderless"
            className="shadow-sm"
            style={{ borderRadius: 12 }}
            title={
                <Space>
                    <GlobalOutlined style={{ color: getZoneColor(selectedZone.demand) }} />
                    <Text strong>{selectedZone.name} Intelligence</Text>
                </Space>
            }
        >
            {selectedZone.demand === 'critical' && (
                <Alert
                    message="Under-Supplied Market"
                    description="Demand outweighs active drivers by 400%. Action recommended."
                    type="error"
                    showIcon
                    style={{ marginBottom: 20, borderRadius: 8 }}
                />
            )}

            <Row gutter={[16, 20]}>
                <Col span={12}>
                    <Statistic title="Rider Supply" value={selectedZone.drivers} prefix={<CarOutlined />} styles={{ content: { color: '#3b82f6', fontWeight: 800 } }} />
                </Col>
                <Col span={12}>
                    <Statistic title="Active Bids" value={selectedZone.orders} prefix={<ArrowUpOutlined />} styles={{ content: { color: getZoneColor(selectedZone.demand), fontWeight: 800 } }} />
                </Col>
                <Col span={12}><Statistic title="Avg ETA" value={selectedZone.waitTime} /></Col>
                <Col span={12}><Statistic title="Surge Strategy" value={`${selectedZone.surge}x`} prefix={<ThunderboltOutlined />} styles={{ content: { color: '#eab308', fontWeight: 800 } }} /></Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: 12, border: '1px solid #fef3c7' }}>
                <Text strong style={{ fontSize: 12, color: '#92400e', display: 'block', marginBottom: 12 }}>SURGE TACTICAL CONTROL</Text>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Row gutter={8}>
                        <Col span={14}>
                            <Select style={{ width: '100%' }} value={surgeValue} onChange={setSurgeValue}>
                                <Option value={1.2}>1.2x Multiplier</Option>
                                <Option value={1.5}>1.5x Multiplier</Option>
                                <Option value={1.8}>1.8x Multiplier</Option>
                                <Option value={2.0}>2.0x Multiplier</Option>
                            </Select>
                        </Col>
                        <Col span={10}>
                            <InputNumber style={{ width: '100%' }} min={1} max={5} step={0.1} value={surgeValue} onChange={v => setSurgeValue(v || 1)} precision={2} />
                        </Col>
                    </Row>
                    <Button block type="primary" danger icon={<ThunderboltOutlined />} onClick={handleDeploySurge}>
                        Deploy {surgeValue}x Surge
                    </Button>
                    <Button block type="text" size="small" onClick={onResetSurge} style={{ color: '#92400e', fontSize: 11 }}>
                        Reset to Standard Market Rate
                    </Button>
                </Space>
            </div>

            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, border: '1px solid #e0f2fe', marginTop: 12 }}>
                <Text strong style={{ fontSize: 12, color: '#0369a1', display: 'block', marginBottom: 12 }}>BROADCAST CENTER</Text>
                <Tabs 
                    size="small" 
                    activeKey={broadcastMode} 
                    onChange={(k: any) => setBroadcastMode(k)}
                    items={[
                        {
                            key: 'INCENTIVE',
                            label: (<span><ThunderboltOutlined /> Incentive</span>),
                            children: (
                                <InputNumber prefix="$" style={{ width: '100%', marginTop: 8 }} min={1} max={50} value={incentiveAmount} onChange={v => setIncentiveAmount(v || 1)} precision={2} />
                            )
                        },
                        {
                            key: 'MANUAL',
                            label: (<span><NotificationOutlined /> Informational</span>),
                            children: (
                                <Input.TextArea rows={3} placeholder="Type alert message..." value={manualBroadcastMessage} onChange={e => setManualBroadcastMessage(e.target.value)} style={{ marginTop: 8, fontSize: 12 }} />
                            )
                        }
                    ]}
                />
                <Button block type="primary" icon={<NotificationOutlined />} onClick={handleBroadcast} style={{ background: '#0ea5e9', border: 'none', marginTop: 12 }}>
                    Broadcast {broadcastMode}
                </Button>
            </div>

            <Divider style={{ margin: '8px 0' }} />
            <Button block type="dashed" icon={<EnvironmentOutlined />} onClick={() => navigate(`/dashboard/fleet?zone=${selectedZone.id}`)}>
                Inspect Fleet in {selectedZone.name}
            </Button>

            <Divider style={{ margin: '16px 0' }}>Command Log</Divider>
            <List
                dataSource={commandLog.slice(0, 5)}
                size="small"
                renderItem={item => (
                    <List.Item style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                            avatar={<Avatar size="small" icon={item.type === 'INCENTIVE' ? <ThunderboltOutlined /> : <InfoCircleOutlined />} />}
                            title={<Space><Text strong style={{ fontSize: 11 }}>{item.time}</Text> <Tag color={item.type === 'INCENTIVE' ? 'gold' : 'blue'}>{item.type}</Tag></Space>}
                            description={<Text italic style={{ fontSize: 11 }}>"{item.msg}"</Text>}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};
