// src/pages/operations/roads-management-insights/components/analytics/RoadsBottomAnalytics.tsx

import React from 'react';
import { Card, Col, Empty, List, Row, Space, Table, Tag, Typography } from 'antd';
import type {
  ChartPoint,
  RoutePerformanceRow,
  RoadsTrendChartsData,
  RoadsTablesData,
  TopDelayedRoadRow,
} from '../../types/roadsInsights.types';

const { Text } = Typography;

export interface RoadsBottomAnalyticsProps {
  trends?: RoadsTrendChartsData | null;
  tables?: RoadsTablesData | null;
  loading?: boolean;
}

interface SimpleMetricListProps {
  title: string;
  data?: ChartPoint[];
  suffix?: string;
  loading?: boolean;
}

const SimpleMetricList: React.FC<SimpleMetricListProps> = ({
  title,
  data = [],
  suffix = '',
  loading = false,
}) => {
  return (
    <Card title={title} loading={loading}>
      {data.length === 0 ? (
        <Empty description="No data available" />
      ) : (
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>{item.label}</Text>
                <Text strong>
                  {item.value}
                  {suffix}
                </Text>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

const RoadsBottomAnalytics: React.FC<RoadsBottomAnalyticsProps> = ({
  trends,
  tables,
  loading = false,
}) => {
  const topDelayedRoads = tables?.topDelayedRoads ?? [];
  const routePerformance = tables?.routePerformance ?? [];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <SimpleMetricList
            title="Travel Time Trend"
            data={trends?.travelTimeTrend}
            suffix=" min"
            loading={loading}
          />
        </Col>

        <Col xs={24} xl={8}>
          <SimpleMetricList
            title="Congestion by Hour"
            data={trends?.congestionByHour}
            loading={loading}
          />
        </Col>

        <Col xs={24} xl={8}>
          <Card title="Reliability by Corridor" loading={loading}>
            {(trends?.reliabilityByCorridor ?? []).length === 0 ? (
              <Empty description="No corridor analytics available" />
            ) : (
              <List
                dataSource={trends?.reliabilityByCorridor ?? []}
                renderItem={(item) => (
                  <List.Item>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text>{item.corridorName}</Text>
                      <Tag color={item.reliabilityScore >= 80 ? 'green' : item.reliabilityScore >= 65 ? 'orange' : 'red'}>
                        {item.reliabilityScore}/100
                      </Tag>
                    </Space>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Top Delayed Roads" loading={loading}>
            <Table<TopDelayedRoadRow>
              rowKey="id"
              pagination={false}
              dataSource={topDelayedRoads}
              scroll={{ x: 720 }}
              columns={[
                {
                  title: 'Road',
                  dataIndex: 'roadName',
                  key: 'roadName',
                },
                {
                  title: 'Zone',
                  dataIndex: 'zone',
                  key: 'zone',
                },
                {
                  title: 'Avg Speed',
                  dataIndex: 'averageSpeedKph',
                  key: 'averageSpeedKph',
                  render: (value: number) => `${value} km/h`,
                },
                {
                  title: 'Delay',
                  dataIndex: 'delayMinutes',
                  key: 'delayMinutes',
                  render: (value: number) => `${value} min`,
                },
                {
                  title: 'Speed Limit',
                  dataIndex: 'speedLimitKph',
                  key: 'speedLimitKph',
                  render: (value?: number) => (value ? `${value} km/h` : '—'),
                },
                {
                  title: 'Incidents',
                  dataIndex: 'incidentCount',
                  key: 'incidentCount',
                },
                {
                  title: 'Reliability',
                  dataIndex: 'reliabilityScore',
                  key: 'reliabilityScore',
                  render: (value: number) => `${value}/100`,
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (value: TopDelayedRoadRow['status']) => {
                    const color =
                      value === 'success'
                        ? 'green'
                        : value === 'warning'
                          ? 'orange'
                          : value === 'error'
                            ? 'red'
                            : 'default';

                    return <Tag color={color}>{value.toUpperCase()}</Tag>;
                  },
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Route Performance" loading={loading}>
            <Table<RoutePerformanceRow>
              rowKey="id"
              pagination={false}
              dataSource={routePerformance}
              scroll={{ x: 720 }}
              columns={[
                {
                  title: 'Route',
                  dataIndex: 'routeName',
                  key: 'routeName',
                },
                {
                  title: 'Origin',
                  dataIndex: 'origin',
                  key: 'origin',
                },
                {
                  title: 'Destination',
                  dataIndex: 'destination',
                  key: 'destination',
                },
                {
                  title: 'ETA',
                  dataIndex: 'etaMinutes',
                  key: 'etaMinutes',
                  render: (value: number) => `${value} min`,
                },
                {
                  title: 'Actual Avg',
                  dataIndex: 'actualAverageMinutes',
                  key: 'actualAverageMinutes',
                  render: (value: number) => `${value} min`,
                },
                {
                  title: 'Variance',
                  dataIndex: 'varianceMinutes',
                  key: 'varianceMinutes',
                  render: (value: number) => `${value} min`,
                },
                {
                  title: 'Reliability',
                  dataIndex: 'reliabilityScore',
                  key: 'reliabilityScore',
                  render: (value: number) => `${value}/100`,
                },
                {
                  title: 'Status',
                  dataIndex: 'routeStatus',
                  key: 'routeStatus',
                  render: (value: RoutePerformanceRow['routeStatus']) => {
                    const color =
                      value === 'preferred'
                        ? 'green'
                        : value === 'blocked'
                          ? 'red'
                          : 'default';

                    return <Tag color={color}>{value.toUpperCase()}</Tag>;
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default RoadsBottomAnalytics;
