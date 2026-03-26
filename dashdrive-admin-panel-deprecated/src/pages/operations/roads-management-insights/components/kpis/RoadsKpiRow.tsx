// src/pages/operations/roads-management-insights/components/kpis/RoadsKpiRow.tsx

import React from 'react';
import { Card, Col, Row, Space, Statistic, Tag, Tooltip, Typography } from 'antd';
import type { HealthStatus, RoadsKpiSummary } from '../../types/roadsInsights.types';

const { Text } = Typography;

export interface RoadsKpiRowProps {
  data?: RoadsKpiSummary;
  loading?: boolean;
}

interface RoadsKpiCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  status?: HealthStatus;
  tooltip?: string;
  loading?: boolean;
}

const statusColorMap: Record<HealthStatus, string> = {
  success: 'green',
  warning: 'orange',
  error: 'red',
  default: 'default',
};

const RoadsKpiCard: React.FC<RoadsKpiCardProps> = ({
  title,
  value,
  suffix,
  status = 'default',
  tooltip,
  loading = false,
}) => {
  const content = (
    <Card loading={loading} className="shadow-sm" style={{ height: '100%', borderRadius: '12px' }}>
      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12, lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Text>
          <Tag color={statusColorMap[status]} style={{ margin: 0, fontSize: 10 }}>
            {status.toUpperCase()}
          </Tag>
        </div>
        <Statistic 
          value={value} 
          suffix={suffix} 
          styles={{ content: { fontSize: 22, fontWeight: 700, color: '#1f1f1f' } }}
        />
      </Space>
    </Card>
  );

  if (!tooltip) return content;

  return <Tooltip title={tooltip}>{content}</Tooltip>;
};

const deriveReliabilityStatus = (value: number): HealthStatus => {
  if (value >= 85) return 'success';
  if (value >= 70) return 'warning';
  return 'error';
};

const deriveCountStatus = (value: number, inverse = false): HealthStatus => {
  if (inverse) {
    if (value <= 5) return 'success';
    if (value <= 12) return 'warning';
    return 'error';
  }

  if (value >= 20) return 'warning';
  if (value >= 10) return 'default';
  return 'success';
};

const RoadsKpiRow: React.FC<RoadsKpiRowProps> = ({ data, loading = false }) => {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Active Congestions"
          value={data?.activeCongestedSegments ?? 0}
          status={deriveCountStatus(data?.activeCongestedSegments ?? 0)}
          tooltip="Current road segments experiencing congestion pressure."
          loading={loading}
        />
      </Col>

      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Avg. Corridor Speed"
          value={data?.averageCorridorSpeedKph ?? 0}
          suffix="km/h"
          status="default"
          tooltip="Average speed across monitored corridors."
          loading={loading}
        />
      </Col>

      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Routes Below SLA"
          value={data?.routesBelowSla ?? 0}
          status={deriveCountStatus(data?.routesBelowSla ?? 0, true)}
          tooltip="Routes currently under expected service reliability threshold."
          loading={loading}
        />
      </Col>

      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Risk Intersections"
          value={data?.highRiskIntersections ?? 0}
          status={deriveCountStatus(data?.highRiskIntersections ?? 0, true)}
          tooltip="Intersections requiring active monitoring or intervention."
          loading={loading}
        />
      </Col>

      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Open Incidents"
          value={data?.openIncidents ?? 0}
          status={deriveCountStatus(data?.openIncidents ?? 0, true)}
          tooltip="Active incidents affecting network operations."
          loading={loading}
        />
      </Col>

      <Col xs={24} sm={12} lg={4}>
        <RoadsKpiCard
          title="Reliability Index"
          value={data?.networkReliabilityIndex ?? 0}
          suffix="/100"
          status={deriveReliabilityStatus(data?.networkReliabilityIndex ?? 0)}
          tooltip="Overall road-network reliability score."
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default RoadsKpiRow;
