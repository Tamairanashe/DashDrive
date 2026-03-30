import React from 'react';
import {
    Typography, Row, Col, Select, Button, Space, Divider, Segmented, DatePicker, Flex
} from 'antd';
import {
    GlobalOutlined,
    SyncOutlined,
    LineChartOutlined,
    SwapOutlined
} from '@ant-design/icons';
import { LOCATION_DATA, SERVICE_TYPES } from '../mocks/heatmapMocks';

const { Title, Text } = Typography;

interface HeatMapTopBarProps {
    selectedCountry: string;
    setSelectedCountry: (val: string) => void;
    selectedRegion: string;
    setSelectedRegion: (val: string) => void;
    selectedCity: string;
    setSelectedCity: (val: string) => void;
    service: string;
    setService: (val: string) => void;
    timeframe: string;
    setTimeframe: (val: string) => void;
    loading: boolean;
    handleRefresh: () => void;
    setIsZoneListVisible: (val: boolean) => void;
    isConnected?: boolean;
    onAnalyticsClick: () => void;
    viewMode: 'OVERVIEW' | 'COMPARE';
    setViewMode: (val: 'OVERVIEW' | 'COMPARE') => void;
    dateRange: [any, any] | null;
    setDateRange: (val: [any, any] | null) => void;
    
    // Comparison Props
    isSyncLocked?: boolean;
    setIsSyncLocked?: (val: boolean) => void;
    serviceB?: string;
    setServiceB?: (val: string) => void;
    dateRangeB?: [any, any] | null;
    setDateRangeB?: (val: [any, any] | null) => void;
}

export const HeatMapTopBar: React.FC<HeatMapTopBarProps> = ({
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
    service,
    setService,
    timeframe,
    setTimeframe,
    loading,
    handleRefresh,
    setIsZoneListVisible,
    isConnected = false,
    onAnalyticsClick,
    viewMode,
    setViewMode,
    dateRange,
    setDateRange,
    isSyncLocked,
    setIsSyncLocked,
    serviceB,
    setServiceB,
    dateRangeB,
    setDateRangeB
}) => {
    const { RangePicker } = DatePicker;
    const isCompare = viewMode === 'COMPARE';

    return (
        <Flex vertical gap={16}>
            {/* Tier 1: Identity & Mode & Primary Date (Map A) */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Flex align="center" gap={12}>
                    <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap', fontSize: 18 }}>Market Intelligence Hub</Title>
                    <Segmented
                        value={viewMode}
                        onChange={(val: any) => setViewMode(val)}
                        options={[
                            { label: 'Overview', value: 'OVERVIEW' },
                            { label: 'Compare', value: 'COMPARE' }
                        ]}
                        style={{ background: '#f1f5f9', padding: 2 }}
                    />
                    
                    {isCompare && (
                        <Button 
                            type={isSyncLocked ? 'primary' : 'default'}
                            icon={isSyncLocked ? <SyncOutlined /> : <SwapOutlined />}
                            onClick={() => setIsSyncLocked?.(!isSyncLocked)}
                            size="small"
                            style={{ borderRadius: 20, fontSize: 11 }}
                        >
                            {isSyncLocked ? 'Sync Active' : 'Independent Maps'}
                        </Button>
                    )}
                </Flex>

                <Flex align="center" gap={12} wrap="wrap">
                    <Text strong style={{ fontSize: 12 }}>{isCompare ? 'Map A:' : ''}</Text>
                    <RangePicker 
                        value={dateRange}
                        onChange={setDateRange}
                        size="small"
                        style={{ borderRadius: 6, height: 32, border: '1px solid #e2e8f0', width: 220 }}
                        placeholder={['A Start', 'A End']}
                    />

                    {isCompare && !isSyncLocked && (
                        <>
                            <Divider type="vertical" />
                            <Text strong style={{ fontSize: 12 }}>Map B:</Text>
                            <RangePicker 
                                value={dateRangeB}
                                onChange={setDateRangeB}
                                size="small"
                                style={{ borderRadius: 6, height: 32, border: '1px solid #e2e8f0', width: 220 }}
                                placeholder={['B Start', 'B End']}
                            />
                        </>
                    )}
                    
                    <Button 
                        type="text"
                        icon={<GlobalOutlined />} 
                        onClick={() => setIsZoneListVisible(true)}
                        size="small"
                        style={{ borderRadius: 8, height: 32, fontWeight: 600 }}
                    />
                </Flex>
            </Flex>

            {/* Tier 2: Multi-Service Selectors */}
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Flex gap={12} align="center" wrap="wrap">
                    <Space size="small" style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>{isCompare ? 'Service A' : ''}</Text>
                        <Select 
                            value={service} 
                            size="small"
                            style={{ width: 130, fontWeight: 600 }} 
                            variant="borderless"
                            onChange={setService}
                        >
                            <Select.Option value="ALL">All Services</Select.Option>
                            {SERVICE_TYPES.map(s => (
                                <Select.Option key={s.id} value={s.id}>
                                    <Space>{s.icon} {s.name}</Space>
                                </Select.Option>
                            ))}
                        </Select>

                        {isCompare && !isSyncLocked && (
                            <>
                                <Divider type="vertical" />
                                <Text type="secondary" style={{ fontSize: 11 }}>Service B</Text>
                                <Select 
                                    value={serviceB} 
                                    size="small"
                                    style={{ width: 130, fontWeight: 600 }} 
                                    variant="borderless"
                                    onChange={setServiceB}
                                >
                                    <Select.Option value="ALL">All Services</Select.Option>
                                    {SERVICE_TYPES.map(s => (
                                        <Select.Option key={s.id} value={s.id}>
                                            <Space>{s.icon} {s.name}</Space>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </>
                        )}
                        
                        <Divider type="vertical" style={{ margin: 0 }} />
                        <Select 
                            value={timeframe} 
                            size="small"
                            style={{ width: 100, fontWeight: 600 }} 
                            variant="borderless"
                            onChange={setTimeframe}
                        >
                            <Select.Option value="LIVE">Live Socket</Select.Option>
                            <Select.Option value="1H">Last Hour</Select.Option>
                            <Select.Option value="24H">Last 24 Hrs</Select.Option>
                        </Select>
                    </Space>

                    <Button 
                        type="primary" 
                        size="small"
                        icon={<LineChartOutlined />} 
                        onClick={onAnalyticsClick}
                        style={{ background: '#1e293b', borderRadius: 6, height: 32 }}
                    >
                        Market Analytics
                    </Button>
                </Flex>

                <Flex align="center" gap={12}>
                    <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: 6, background: isConnected ? '#ecfdf5' : '#fff1f2', padding: '4px 10px', borderRadius: 20 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isConnected ? '#10b981' : '#f43f5e', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
                        <Text strong style={{ fontSize: 10, color: isConnected ? '#047857' : '#be123c' }}>{isConnected ? 'LIVE FEED ACTIVE' : 'RETRYING CON'}</Text>
                    </div>
                    <Button 
                        type="text" 
                        size="small"
                        icon={<SyncOutlined spin={loading} />} 
                        onClick={handleRefresh}
                        style={{ color: '#64748b' }}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};
