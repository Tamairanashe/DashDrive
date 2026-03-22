// src/pages/operations/roads-management-insights/components/drawers/ExportJobsDrawer.tsx

import React from 'react';
import { Drawer, List, Progress, Tag, Button, Typography, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DownloadOutlined, SyncOutlined, StopOutlined, ReloadOutlined } from '@ant-design/icons';
import { ExportJobItem } from '../../types/exportJobs.types';

const { Text } = Typography;

interface ExportJobsDrawerProps {
  visible: boolean;
  onClose: () => void;
  jobs: ExportJobItem[];
  onRemoveJob: (id: string) => void;
  onRetryJob?: (id: string) => void;
  onCancelJob?: (id: string) => void;
}

export const ExportJobsDrawer: React.FC<ExportJobsDrawerProps> = ({
  visible,
  onClose,
  jobs,
  onRemoveJob,
  onRetryJob,
  onCancelJob,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'processing': return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'failed': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'cancelled': return <StopOutlined style={{ color: '#fa8c16' }} />;
      default: return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed': return <Tag color="success">Completed</Tag>;
      case 'processing': return <Tag color="processing">Processing</Tag>;
      case 'failed': return <Tag color="error">Failed</Tag>;
      case 'cancelled': return <Tag color="warning">Cancelled</Tag>;
      default: return <Tag color="default">Queued</Tag>;
    }
  };

  return (
    <Drawer
      title="Export Jobs"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <List
        dataSource={jobs}
        renderItem={(job) => (
          <List.Item
            key={job.id}
            actions={[
              job.status === 'completed' && job.downloadUrl ? (
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />} 
                  href={job.downloadUrl}
                  target="_blank"
                >
                  Download
                </Button>
              ) : null,
              (job.status === 'failed' || job.status === 'cancelled') && onRetryJob ? (
                <Button 
                  type="link" 
                  icon={<ReloadOutlined />} 
                  onClick={() => onRetryJob(job.id)}
                >
                  Retry
                </Button>
              ) : null,
              (job.status === 'queued' || job.status === 'processing') && onCancelJob ? (
                <Button 
                  type="link" 
                  danger 
                  icon={<StopOutlined />} 
                  onClick={() => onCancelJob(job.id)}
                >
                  Cancel
                </Button>
              ) : null,
              <Button type="link" danger onClick={() => onRemoveJob(job.id)}>Remove</Button>
            ]}
          >
            <List.Item.Meta
              avatar={getStatusIcon(job.status)}
              title={
                <Space>
                  <Text strong>{job.fileName || `Export #${job.id.slice(0, 8)}`}</Text>
                  {getStatusTag(job.status)}
                </Space>
              }
              description={
                <div style={{ marginTop: 8 }}>
                  {job.status === 'processing' && (
                    <>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Stage: {job.stage || 'Initializing...'}</Text>
                      <Progress percent={job.progress} size="small" status="active" />
                    </>
                  )}
                  {job.status === 'failed' && (
                    <Text type="danger">{job.errorMessage || 'Unknown error occurred'}</Text>
                  )}
                  {job.status === 'completed' && (
                    <Text type="secondary">Generated on {new Date(job.completedAt || Date.now()).toLocaleString()}</Text>
                  )}
                  {job.status === 'queued' && (
                    <Text type="secondary">Waiting in queue...</Text>
                  )}
                  {job.status === 'cancelled' && (
                    <Text type="secondary">Job was cancelled by user.</Text>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};
