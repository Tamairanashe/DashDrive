// src/pages/operations/roads-management-insights/components/modals/ExportReportModal.tsx

import React from 'react';
import { Button, Form, Input, Modal, Select, Space, Switch, Typography } from 'antd';
import type { RoadsFilters, RoadsMapLayers } from '../../types/roadsInsights.types';

const { Text } = Typography;

export type RoadsExportFormat = 'pdf' | 'csv' | 'json' | 'png';

export interface RoadsExportPayload {
  format: RoadsExportFormat;
  title: string;
  includeMapSnapshot: boolean;
  includeKpis: boolean;
  includeAnalytics: boolean;
  includeTables: boolean;
  includeActiveFilters: boolean;
  includeEnabledLayers: boolean;
}

export interface ExportReportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (payload: RoadsExportPayload) => Promise<void> | void;
  loading?: boolean;
  filters: RoadsFilters;
  layers: RoadsMapLayers;
}

interface ExportFormValues extends RoadsExportPayload {}

const ExportReportModal: React.FC<ExportReportModalProps> = ({
  open,
  onClose,
  onExport,
  loading = false,
  filters,
  layers,
}) => {
  const [form] = Form.useForm<ExportFormValues>();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onExport(values);
  };

  return (
    <Modal
      title="Export Roads Insights Report"
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Export
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        <Text type="secondary">
          Export the current roads intelligence view with selected analytics, tables, and map context.
        </Text>

        <Form<ExportFormValues>
          form={form}
          layout="vertical"
          initialValues={{
            format: 'pdf',
            title: 'Roads Management Insights Report',
            includeMapSnapshot: true,
            includeKpis: true,
            includeAnalytics: true,
            includeTables: true,
            includeActiveFilters: true,
            includeEnabledLayers: true,
          }}
        >
          <Form.Item
            name="title"
            label="Report title"
            rules={[{ required: true, message: 'Please enter a report title' }]}
          >
            <Input placeholder="Report title" />
          </Form.Item>

          <Form.Item
            name="format"
            label="Export format"
            rules={[{ required: true, message: 'Please choose a format' }]}
          >
            <Select
              options={[
                { label: 'PDF', value: 'pdf' },
                { label: 'CSV', value: 'csv' },
                { label: 'JSON', value: 'json' },
                { label: 'PNG Snapshot', value: 'png' },
              ]}
            />
          </Form.Item>

          <Form.Item name="includeMapSnapshot" label="Include map snapshot" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="includeKpis" label="Include KPI summary" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="includeAnalytics" label="Include analytics" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="includeTables" label="Include tables" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="includeActiveFilters" label="Include active filters" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="includeEnabledLayers" label="Include enabled layers" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>

        <div>
          <Text strong>Current filters</Text>
          <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>

        <div>
          <Text strong>Enabled layers</Text>
          <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>
            {JSON.stringify(layers, null, 2)}
          </pre>
        </div>
      </Space>
    </Modal>
  );
};

export default ExportReportModal;
