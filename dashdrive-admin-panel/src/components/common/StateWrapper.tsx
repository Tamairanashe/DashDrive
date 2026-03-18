import React from 'react';
import { Spin, Empty, Result, Button, Space, Typography } from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';

interface StateWrapperProps {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  minHeight?: number | string;
}

/**
 * StateWrapper handles the primary functional UI states:
 * - Loading: Spinner with optional skeleton support.
 * - Empty: SAP/Material inspired empty states with CTAs.
 * - Error: Graceful error messages with retry logic.
 * - Ideal: The actual content.
 */
export const StateWrapper: React.FC<StateWrapperProps> = ({
  loading,
  error,
  isEmpty,
  emptyTitle = 'No Data Found',
  emptyDescription = 'There is currently no information to display here.',
  onRetry,
  children,
  minHeight = 300,
}) => {
  if (loading) {
    return (
      <div style={{ 
        minHeight, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
        <Typography.Text type="secondary">Loading data, please wait...</Typography.Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status="error"
          title="Operation Failed"
          subTitle={error}
          extra={[
            <Button 
              type="primary" 
              key="retry" 
              icon={<ReloadOutlined />} 
              onClick={onRetry}
              size="large"
            >
              Retry Operation
            </Button>
          ]}
        />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <Typography.Title level={5} style={{ margin: 0 }}>{emptyTitle}</Typography.Title>
              <Typography.Text type="secondary">{emptyDescription}</Typography.Text>
              {onRetry && (
                <Button type="link" onClick={onRetry}>Refresh</Button>
              )}
            </Space>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
