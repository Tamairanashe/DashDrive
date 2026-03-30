
import React from 'react';
import { Row, Col, Statistic, Card, Tooltip } from 'antd';
import { 
    TeamOutlined, 
    ThunderboltOutlined, 
    FieldTimeOutlined, 
    CheckCircleOutlined,
    SwapOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { MarketSummary } from '../types';

interface HeatMapSummaryBarProps {
    summary: MarketSummary;
    loading?: boolean;
}

export const HeatMapSummaryBar: React.FC<HeatMapSummaryBarProps> = ({ summary, loading }) => {
    return (
        <Card size="small" variant="borderless" style={{ background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <Row gutter={24} justify="space-around">
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>Active Requests <Tooltip title="Total customer demand in last 5m"><InfoCircleOutlined style={{ fontSize: 10 }} /></Tooltip></span>}
                        value={summary.activeRequests}
                        prefix={<ThunderboltOutlined style={{ color: '#f59e0b' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>Available Partners <Tooltip title="Idle drivers/couriers ready for dispatch"><InfoCircleOutlined style={{ fontSize: 10 }} /></Tooltip></span>}
                        value={summary.availableDrivers}
                        prefix={<TeamOutlined style={{ color: '#10b981' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>D/S Ratio <Tooltip title="Demand/Supply balance score (1.0 is ideal)"><InfoCircleOutlined style={{ fontSize: 10 }} /></Tooltip></span>}
                        value={summary.demandSupplyRatio}
                        precision={2}
                        prefix={<SwapOutlined style={{ color: '#3b82f6' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>Avg Pickup ETA</span>}
                        value={summary.avgPickupEta}
                        prefix={<FieldTimeOutlined style={{ color: '#6366f1' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>Completion Rate</span>}
                        value={summary.completionRate}
                        suffix="%"
                        prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
                <Col>
                    <Statistic 
                        title={<span style={{ fontSize: 12 }}>Surge Zones</span>}
                        value={summary.activeSurgeZones}
                        prefix={<ThunderboltOutlined style={{ color: '#ef4444' }} />}
                        loading={loading}
                        styles={{ content: { fontSize: 18, fontWeight: 700 } }}
                    />
                </Col>
            </Row>
        </Card>
    );
};
