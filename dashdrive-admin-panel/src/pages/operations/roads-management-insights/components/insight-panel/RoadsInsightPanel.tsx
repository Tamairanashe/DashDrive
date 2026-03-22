// src/pages/operations/roads-management-insights/components/insight-panel/RoadsInsightPanel.tsx

import React from 'react';
import { Card, List, Space, Statistic, Tabs, Tag, Typography } from 'antd';
import {
  HomeOutlined,
  EnvironmentOutlined,
  ForkOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type {
  RoadDetailsData,
  RoadsInsightTabKey,
  RoadsOverviewData,
  RoadsPanelAnalyticsData,
  RoadsSafetyData,
  RoadsSelectionState,
  RouteAnalysisData,
} from '../../types/roadsInsights.types';

const { Text } = Typography;

export interface RoadsInsightPanelProps {
  activeTab: RoadsInsightTabKey;
  onTabChange: (key: RoadsInsightTabKey) => void;
  selection: RoadsSelectionState;
  overviewData?: RoadsOverviewData;
  roadDetails?: RoadDetailsData | null;
  routeData?: RouteAnalysisData | null;
  safetyData?: RoadsSafetyData | null;
  analyticsData?: RoadsPanelAnalyticsData | null;
  loading?: boolean;
}

const OverviewTab: React.FC<{ data?: RoadsOverviewData; loading?: boolean }> = ({
  data,
  loading,
}) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Card size="small" loading={loading}>
      <Statistic title="Network Health Score" value={data?.networkHealthScore ?? 0} suffix="/100" />
    </Card>

    <Card size="small" title="Most Congested Corridors" loading={loading}>
      <List
        dataSource={data?.mostCongestedCorridors ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.name}</Text>
              <Tag>{String(item.value)}</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Worst Routes" loading={loading}>
      <List
        dataSource={data?.worstRoutes ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.name}</Text>
              <Tag color={item.status === 'error' ? 'red' : 'orange'}>{String(item.value)}</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Recommendations" loading={loading}>
      <List
        dataSource={data?.recommendations ?? []}
        renderItem={(item) => (
          <List.Item>
            <div>
              <Text strong>{item.title}</Text>
              <br />
              <Text type="secondary">{item.description}</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  </Space>
);

const RoadDetailsTab: React.FC<{
  data?: RoadDetailsData | null;
  loading?: boolean;
}> = ({ data, loading }) => {
  if (!data && !loading) {
    return <Text type="secondary">Select a road segment from the map.</Text>;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title={data?.roadName ?? 'Road Details'} loading={loading}>
        <p><strong>Classification:</strong> {data?.classification ?? '—'}</p>
        <p><strong>City:</strong> {data?.city ?? '—'}</p>
        <p><strong>Zone:</strong> {data?.zone ?? '—'}</p>
        <p><strong>Speed Limit:</strong> {data?.postedSpeedLimitKph ?? 'N/A'} km/h</p>
        <p><strong>Avg Speed:</strong> {data?.currentAverageSpeedKph ?? 'N/A'} km/h</p>
        <p><strong>Congestion:</strong> {data?.congestionLevel ?? 'N/A'}</p>
        <p><strong>Reliability:</strong> {data?.reliabilityScore ?? 'N/A'}/100</p>
      </Card>

      <Card size="small" title="Incident History" loading={loading}>
        <p>24h: {data?.incidentCount24h ?? 0}</p>
        <p>7d: {data?.incidentCount7d ?? 0}</p>
        <p>30d: {data?.incidentCount30d ?? 0}</p>
      </Card>

      <Card size="small" title="Recommendation" loading={loading}>
        <Text>{data?.recommendation ?? 'No recommendation available.'}</Text>
      </Card>

      <Card size="small" title="Related Routes" loading={loading}>
        <List
          dataSource={data?.relatedRoutes ?? []}
          renderItem={(route) => (
            <List.Item>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <Text>{route.name}</Text>
                <Tag>{route.reliabilityScore}/100</Tag>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};

const RoutesTab: React.FC<{
  data?: RouteAnalysisData | null;
  loading?: boolean;
}> = ({ data, loading }) => {
  if (!data && !loading) {
    return <Text type="secondary">Run a route comparison to view options.</Text>;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="Route Query" loading={loading}>
        <p><strong>Origin:</strong> {data?.query.origin ?? '—'}</p>
        <p><strong>Destination:</strong> {data?.query.destination ?? '—'}</p>
        <p><strong>Traffic Mode:</strong> {data?.query.trafficMode ?? '—'}</p>
        <p><strong>Historical Avg ETA:</strong> {data?.historicalAverageEtaMinutes ?? '—'} min</p>
        <p><strong>Recommended Route:</strong> {data?.recommendedRouteId ?? '—'}</p>
      </Card>

      <Card size="small" title="Route Options" loading={loading}>
        <List
          dataSource={data?.routes ?? []}
          renderItem={(route) => (
            <List.Item>
              <Card size="small" style={{ width: '100%' }}>
                <p><strong>{route.name}</strong></p>
                <p>ETA: {route.etaMinutes} min</p>
                <p>Distance: {route.distanceKm} km</p>
                <p>Reliability: {route.reliabilityScore}/100</p>
                <p>Delay: {route.delayMinutes ?? 0} min</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};

const SafetyTab: React.FC<{
  data?: RoadsSafetyData | null;
  loading?: boolean;
}> = ({ data, loading }) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Card size="small" title="High-Risk Intersections" loading={loading}>
      <List
        dataSource={data?.highRiskIntersections ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.name}</Text>
              <Tag color="red">{item.score}</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Overspeed Segments" loading={loading}>
      <List
        dataSource={data?.overspeedSegments ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.roadName}</Text>
              <Tag color="orange">+{item.gapKph} km/h</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Recommendations" loading={loading}>
      <List
        dataSource={data?.recommendations ?? []}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  </Space>
);

const AnalyticsTab: React.FC<{
  data?: RoadsPanelAnalyticsData | null;
  loading?: boolean;
}> = ({ data, loading }) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Card size="small" title="Travel Time Trend" loading={loading}>
      <List
        dataSource={data?.travelTimeTrend ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.label}</Text>
              <Text>{item.value} min</Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Corridor Ranking" loading={loading}>
      <List
        dataSource={data?.corridorRanking ?? []}
        renderItem={(item) => (
          <List.Item>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text>{item.name}</Text>
              <Tag>{item.score}</Tag>
            </Space>
          </List.Item>
        )}
      />
    </Card>

    <Card size="small" title="Service Impact Summary" loading={loading}>
      <List
        dataSource={data?.serviceImpactSummary ?? []}
        renderItem={(item) => (
          <List.Item>
            <div>
              <Text strong>{item.serviceType}</Text>
              <br />
              <Text type="secondary">
                {item.impactedRoutes} impacted routes · {item.delayMinutes} min avg delay
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  </Space>
);

const RoadsInsightPanel: React.FC<RoadsInsightPanelProps> = ({
  activeTab,
  onTabChange,
  selection,
  overviewData,
  roadDetails,
  routeData,
  safetyData,
  analyticsData,
  loading = false,
}) => {
  return (
    <Card
      styles={{ body: { paddingTop: 8 } }}
      extra={
        selection.selectedRoadId ? <Tag color="blue">Road Selected</Tag> : null
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => onTabChange(key as RoadsInsightTabKey)}
        items={[
          {
            key: 'overview',
            label: (
              <Space size={4}>
                <HomeOutlined />
                <span>Overview</span>
              </Space>
            ),
            children: <OverviewTab data={overviewData} loading={loading} />,
          },
          {
            key: 'roadDetails',
            label: (
              <Space size={4}>
                <EnvironmentOutlined />
                <span>Road Details</span>
              </Space>
            ),
            children: <RoadDetailsTab data={roadDetails} loading={loading} />,
          },
          {
            key: 'routes',
            label: (
              <Space size={4}>
                <ForkOutlined />
                <span>Routes</span>
              </Space>
            ),
            children: <RoutesTab data={routeData} loading={loading} />,
          },
          {
            key: 'safety',
            label: (
              <Space size={4}>
                <SafetyOutlined />
                <span>Safety</span>
              </Space>
            ),
            children: <SafetyTab data={safetyData} loading={loading} />,
          },
          {
            key: 'analytics',
            label: (
              <Space size={4}>
                <BarChartOutlined />
                <span>Analytics</span>
              </Space>
            ),
            children: <AnalyticsTab data={analyticsData} loading={loading} />,
          },
        ]}
      />
    </Card>
  );
};

export default RoadsInsightPanel;
