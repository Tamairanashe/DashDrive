// src/pages/operations/roads-management-insights/components/header/RoadsPageHeader.tsx

import React from 'react';
import { Alert, Button, Card, Col, Row, Space, Typography, Badge } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface RoadsPageHeaderProps {
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onOpenSavedViews?: () => void;
  onOpenExport?: () => void;
  onOpenExportJobs?: () => void;
  exportJobsCount?: number;
}

const RoadsPageHeader: React.FC<RoadsPageHeaderProps> = ({
  loading = false,
  error,
  onRefresh,
  onOpenSavedViews,
  onOpenExport,
  onOpenExportJobs,
  exportJobsCount = 0,
}) => {
  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      {error ? <Alert type="error" showIcon message={error} /> : null}

      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              Roads Management Insights
            </Title>
            <Text type="secondary">
              Monitor road performance, route reliability, and live traffic intelligence.
            </Text>
          </Col>

          <Col>
            <Space wrap>
              <Button onClick={onRefresh} loading={loading}>
                Refresh
              </Button>
              <Button onClick={onOpenSavedViews}>Saved Views</Button>
              <Badge count={exportJobsCount}>
                <Button 
                  icon={<HistoryOutlined />} 
                  onClick={onOpenExportJobs}
                >
                  Jobs
                </Button>
              </Badge>
              <Button type="primary" onClick={onOpenExport}>
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default RoadsPageHeader;
