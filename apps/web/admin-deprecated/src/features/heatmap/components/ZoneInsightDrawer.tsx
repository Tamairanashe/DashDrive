import React from 'react';
import { 
    Typography, Row, Col, Card, Button, Space, 
    Tag, Statistic, InputNumber, Input
} from 'antd';
import { 
    ThunderboltOutlined, 
    CarOutlined, 
    NotificationOutlined,
    GlobalOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    RiseOutlined,
    RightOutlined
} from '@ant-design/icons';
import { MarketplaceAction } from '../types';
import { GridCell } from '../hooks/useMarketGrid';

const { Text, Title } = Typography;

interface ZoneInsightDrawerProps {
    selectedCell: GridCell;
    service: string;
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
    selectedCell,
    service,
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
    const statusColor = {
        'healthy': '#22c55e',
        'warning': '#eab308',
        'high_demand': '#ef4444',
        'critical': '#a855f7'
    }[selectedCell.derived.status];

    const statusLabel = {
        'healthy': 'HEALTHY',
        'warning': 'WARNING',
        'high_demand': 'HIGH DEMAND',
        'critical': 'CRITICAL'
    }[selectedCell.derived.status];

    return (
        <Card
            variant="borderless"
            className="shadow-sm"
            style={{ borderRadius: 12, background: '#ffffff', padding: 0 }}
            styles={{ body: { padding: '16px 20px' } }}
        >
            <Row gutter={[24, 24]} align="middle">
                {/* 1. Header & Quick Stats Bento */}
                <Col xs={24} md={8} lg={6}>
                    <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                            <GlobalOutlined style={{ color: statusColor, fontSize: 20 }} />
                            <Title level={5} style={{ margin: 0, textTransform: 'capitalize' }}>{selectedCell.name}</Title>
                            <Tag color={statusColor} style={{ borderRadius: '4px', border: 'none' }}>
                                {statusLabel}
                            </Tag>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {selectedCell.derived.status === 'critical' || selectedCell.derived.status === 'high_demand' 
                                ? "Heavy demand pressure detected." 
                                : "Market cell operating normally."}
                        </Text>
                        
                        <Row gutter={8} style={{ marginTop: 8 }}>
                            <Col span={12}>
                                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Demand</Text>
                                    <Text strong style={{ fontSize: 18, color: '#ef4444' }}>
                                        <ThunderboltOutlined style={{ marginRight: 4 }} />
                                        {selectedCell.metrics.demandCount}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Supply</Text>
                                    <Text strong style={{ fontSize: 18, color: '#3b82f6' }}>
                                        <CarOutlined style={{ marginRight: 4 }} />
                                        {selectedCell.metrics.idleSupply}
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                        
                        <Button type="link" onClick={() => navigate('/dispatch')} style={{ padding: 0, marginTop: 4 }}>
                            Open in Dispatch Queue <RightOutlined style={{ fontSize: 10 }} />
                        </Button>
                    </Space>
                </Col>

                {/* 2. Advanced Metrics Bento */}
                <Col xs={24} md={8} lg={6}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, height: '100%' }}>
                        <Text strong style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 12 }}>PERFORMANCE</Text>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Statistic 
                                    title={<span style={{fontSize: 12}}>ETA vs Baseline</span>} 
                                    value={`${selectedCell.metrics.etaCurrent} / ${selectedCell.metrics.etaBaseline}m`} 
                                    prefix={<ClockCircleOutlined style={{ color: selectedCell.derived.etaInflation > 1.5 ? '#ef4444' : '#10b981', fontSize: 14 }} />}
                                    styles={{ content: { fontSize: 16, fontWeight: 700, color: selectedCell.derived.etaInflation > 1.5 ? '#ef4444' : '#334155' } }}
                                />
                            </Col>
                            <Col span={24}>
                                <Statistic 
                                    title={<span style={{fontSize: 12}}>Failures / Cancels</span>} 
                                    value={`${selectedCell.metrics.cancellations}`} 
                                    prefix={<CloseCircleOutlined style={{ color: selectedCell.derived.cancellationRate > 0.1 ? '#ef4444' : '#64748b', fontSize: 14 }} />}
                                    styles={{ content: { fontSize: 16, fontWeight: 700, color: '#334155' } }}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>

                {/* 3. Surge Bento */}
                <Col xs={24} md={8} lg={6}>
                    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: 12, height: '100%', background: '#fff' }}>
                        <Space orientation="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong><RiseOutlined style={{ color: '#f59e0b', marginRight: 6 }} /> Dynamic Surge</Text>
                                <Tag color="orange" style={{ margin: 0, border: 'none' }}>Rec: {selectedCell.metrics.surgeSuggestion.toFixed(1)}x</Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>Multiply pricing to throttle demand.</Text>
                            <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                                <InputNumber 
                                    min={1.0} max={3.0} step={0.1} 
                                    value={surgeValue} 
                                    onChange={(val) => setSurgeValue(val || 1.0)} 
                                    addonAfter="x"
                                    style={{ width: '60%' }}
                                />
                                <Button type="primary" onClick={handleDeploySurge} style={{ background: '#f59e0b', borderColor: '#f59e0b', fontWeight: 600, width: '40%' }}>Execute</Button>
                            </Space.Compact>
                            <Button type="text" onClick={onResetSurge} size="small" style={{ padding: 0, fontSize: 12, color: '#3b82f6' }}>Apply Recommendation</Button>
                        </Space>
                    </div>
                </Col>

                {/* 4. Intervention Bento */}
                <Col xs={24} md={8} lg={6}>
                    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: 12, height: '100%', background: '#fff' }}>
                        <Space orientation="vertical" style={{ width: '100%' }} size="small">
                            <Text strong><NotificationOutlined style={{ color: '#10b981', marginRight: 6 }} /> Active Driver Pushes</Text>
                            
                            <Space style={{ marginBottom: 4 }}>
                                <Button 
                                    size="small" 
                                    type={broadcastMode === 'INCENTIVE' ? 'primary' : 'default'} 
                                    style={broadcastMode === 'INCENTIVE' ? { background: '#10b981', borderColor: '#10b981' } : {}}
                                    onClick={() => setBroadcastMode('INCENTIVE')}
                                >Bonus Drop</Button>
                                <Button size="small" type={broadcastMode === 'MANUAL' ? 'primary' : 'default'} onClick={() => setBroadcastMode('MANUAL')}>Custom</Button>
                            </Space>
                            
                            {broadcastMode === 'INCENTIVE' ? (
                                <Space.Compact style={{ width: '100%' }}>
                                    <InputNumber 
                                        min={1} max={50} step={1} 
                                        value={incentiveAmount} 
                                        onChange={(val) => setIncentiveAmount(val || 5)} 
                                        addonBefore="+$"
                                        style={{ width: '50%' }}
                                    />
                                    <Button type="primary" onClick={handleBroadcast} style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600, width: '50%' }}>Broadcast</Button>
                                </Space.Compact>
                            ) : (
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input 
                                        placeholder="Message..." 
                                        value={manualBroadcastMessage}
                                        onChange={(e) => setManualBroadcastMessage(e.target.value)}
                                        style={{ width: '60%' }}
                                    />
                                    <Button type="primary" onClick={handleBroadcast} style={{ width: '40%' }}>Send</Button>
                                </Space.Compact>
                            )}
                        </Space>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
