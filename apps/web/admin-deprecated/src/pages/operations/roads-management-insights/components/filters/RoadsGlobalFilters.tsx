// src/pages/operations/roads-management-insights/components/filters/RoadsGlobalFilters.tsx

import React from 'react';
import { Button, Card, Col, DatePicker, Row, Select, Space } from 'antd';
import type { RoadsFilters } from '../../types/roadsInsights.types';

const { RangePicker } = DatePicker;

type Option = {
  label: string;
  value: string;
};

export interface RoadsGlobalFiltersProps {
  filters: RoadsFilters;
  onChange: (next: Partial<RoadsFilters>) => void;
  onReset: () => void;
  loading?: boolean;
  cityOptions?: Option[];
  zoneOptions?: Option[];
  roadTypeOptions?: Option[];
  serviceTypeOptions?: Option[];
  incidentStatusOptions?: Option[];
}

const defaultCityOptions: Option[] = [
  { label: 'Harare', value: 'harare' },
  { label: 'Bulawayo', value: 'bulawayo' },
];

const defaultRoadTypeOptions: Option[] = [
  { label: 'Arterial', value: 'arterial' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Local', value: 'local' },
];

const defaultServiceTypeOptions: Option[] = [
  { label: 'Ride Hailing', value: 'ride_hailing' },
  { label: 'Parcel Delivery', value: 'parcel_delivery' },
  { label: 'Food Delivery', value: 'food_delivery' },
  { label: 'Mart Delivery', value: 'mart_delivery' },
  { label: 'Shopping', value: 'shopping' },
];

const defaultIncidentStatusOptions: Option[] = [
  { label: 'Active', value: 'active' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Monitoring', value: 'monitoring' },
];

const severityOptions: Option[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const modeOptions: Option[] = [
  { label: 'Live', value: 'live' },
  { label: 'Historical', value: 'historical' },
];

const RoadsGlobalFilters: React.FC<RoadsGlobalFiltersProps> = ({
  filters,
  onChange,
  onReset,
  loading = false,
  cityOptions = defaultCityOptions,
  zoneOptions = [],
  roadTypeOptions = defaultRoadTypeOptions,
  serviceTypeOptions = defaultServiceTypeOptions,
  incidentStatusOptions = defaultIncidentStatusOptions,
}) => {
  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={(dates) => {
              if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) {
                onChange({ dateRange: undefined });
                return;
              }

              onChange({
                dateRange: [dates[0].toISOString(), dates[1].toISOString()],
              });
            }}
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Select
            allowClear
            showSearch
            placeholder="Select city"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.cityId}
            options={cityOptions}
            onChange={(value) => onChange({ cityId: value })}
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Select
            allowClear
            showSearch
            placeholder="Select zone"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.zoneId}
            options={zoneOptions}
            onChange={(value) => onChange({ zoneId: value })}
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Select
            placeholder="Mode"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.mode}
            options={modeOptions}
            onChange={(value) => onChange({ mode: value as RoadsFilters['mode'] })}
          />
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Road types"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.roadType}
            options={roadTypeOptions}
            onChange={(value) => onChange({ roadType: value })}
          />
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Service types"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.serviceType}
            options={serviceTypeOptions}
            onChange={(value) => onChange({ serviceType: value })}
          />
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Severity"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.severity}
            options={severityOptions}
            onChange={(value) => onChange({ severity: value })}
          />
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Incident status"
            style={{ width: '100%' }}
            loading={loading}
            value={filters.incidentStatus}
            options={incidentStatusOptions}
            onChange={(value) => onChange({ incidentStatus: value })}
          />
        </Col>

        <Col xs={24}>
          <Space wrap>
            <Button onClick={onReset} disabled={loading}>
              Reset Filters
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default RoadsGlobalFilters;
