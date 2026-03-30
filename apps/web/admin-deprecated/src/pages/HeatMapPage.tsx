import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    App, Layout, Card, Row, Col, Divider, 
    Drawer, Input, List, Space, 
    Typography, Tag, Flex 
} from 'antd';
import { 
    HistoryOutlined, 
    GlobalOutlined 
} from '@ant-design/icons';

// Feature Components
import { HeatMapTopBar } from '../features/heatmap/components/HeatMapTopBar';
import { HeatMapFiltersSider } from '../features/heatmap/components/HeatMapFiltersSider';
import { HeatMapCanvas } from '../features/heatmap/components/HeatMapCanvas';
import { ZoneInsightDrawer } from '../features/heatmap/components/ZoneInsightDrawer';
import { HeatMapSummaryBar } from '../features/heatmap/components/HeatMapSummaryBar';
import { MarketAnalyticsDrawer } from '../features/heatmap/components/MarketAnalyticsDrawer';
import { GlobalZoneExplorerDrawer } from '../features/heatmap/components/GlobalZoneExplorerDrawer';
import { ZoneTelemetryList } from '../features/heatmap/components/ZoneTelemetryList';

import { useSocket } from '../context/SocketContext';
import { useMarketGrid, GridCell } from '../features/heatmap/hooks/useMarketGrid';
import { LOCATION_COORDS } from '../features/heatmap/mocks/heatmapMocks';
import { MarketplaceAction } from '../features/heatmap/types';

const { Text, Title } = Typography;

export const HeatMapPage: React.FC = () => {
    const navigate = useNavigate();
    const { message, notification } = App.useApp();
    const { socket, isConnected } = useSocket();

    // --- State Management ---
    const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
    const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
    const [selectedCity, setSelectedCity] = useState('Harare');
    const [serviceA, setServiceA] = useState('ALL');
    const [serviceB, setServiceB] = useState('FOOD');
    const [timeframe, setTimeframe] = useState('LIVE');
    const [loading, setLoading] = useState(false);
    const [dateRangeA, setDateRangeA] = useState<any>(null);
    const [dateRangeB, setDateRangeB] = useState<any>(null);
    const [isSyncLocked, setIsSyncLocked] = useState(true);
    
    const [mapCenter, setMapCenter] = useState<[number, number]>([-17.8248, 31.0530]);
    const [enabledLayers, setEnabledLayers] = useState<string[]>(['imbalance', 'demand']);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'OVERVIEW' | 'COMPARE'>('OVERVIEW');
    
    // Primary Data Stream (Map A)
    const { cells: cellsA, globalMetrics: metricsA } = useMarketGrid(mapCenter, serviceA, dateRangeA);
    
    // Comparison Data Stream (Map B) - Only active if viewMode is COMPARE
    const { cells: cellsB, globalMetrics: metricsB } = useMarketGrid(
        mapCenter, 
        isSyncLocked ? serviceA : serviceB, 
        isSyncLocked ? dateRangeA : dateRangeB
    );

    // Use cellsA for overview, cellsA/cellsB for compare
    const cells = cellsA;
    const globalMetrics = metricsA;

    const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
    const [isDrilldownActive, setIsDrilldownActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapTypeId, setMapTypeId] = useState('roadmap');

    // Drawers & UI State
    const [isZoneListVisible, setIsZoneListVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tactical State (Specific to selected cell)
    const [surgeValue, setSurgeValue] = useState<number>(1.5);
    const [incentiveAmount, setIncentiveAmount] = useState<number>(5.00);
    const [broadcastMode, setBroadcastMode] = useState<'INCENTIVE' | 'MANUAL'>('INCENTIVE');
    const [manualBroadcastMessage, setManualBroadcastMessage] = useState<string>('');
    const [commandLog, setCommandLog] = useState<MarketplaceAction[]>([]);

    useEffect(() => {
        if (LOCATION_COORDS[selectedCity]) {
            setMapCenter([LOCATION_COORDS[selectedCity].lat, LOCATION_COORDS[selectedCity].lng]);
            setSelectedCell(null);
            setIsDrilldownActive(false);
        }
    }, [selectedCity]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const handleDeploySurge = () => {
        if (!selectedCell) return;
        message.loading('Deploying Surge Multiplier...', 1.5).then(() => {
            message.success(`Surge Active: ${surgeValue}x Applied to Cell ${selectedCell.id.substring(0,6)}`);
            setCommandLog([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: `Surge deployed: ${surgeValue}x`, type: 'MANUAL' }, ...commandLog]);
        });
    };

    const handleBroadcast = () => {
        if (!selectedCell) return;
        const msg = broadcastMode === 'INCENTIVE' 
            ? `Capacity Constrained in Cell! Drivers get +$${incentiveAmount.toFixed(2)} active incentive.`
            : manualBroadcastMessage;
            
        if (!msg.trim()) return message.warning('Please enter a message.');
        
        message.loading('Targeting active driver supply...', 1.2).then(() => {
            setCommandLog([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg, type: broadcastMode }, ...commandLog]);
            message.success('Incentive Broadcast Successfully Syncing');
        });
    };

    const toggleFullscreen = () => {
        const el = document.getElementById('heatmap-container');
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Calculate generic temperament label based on total network
    let networkTemperament = { label: 'Balanced Market', status: 'Healthy' };
    if (globalMetrics.avgEta > 12) networkTemperament = { label: 'Severe Capacity Degradation', status: 'Critical' };
    else if (globalMetrics.totalDemand > globalMetrics.totalIdle * 2) networkTemperament = { label: 'Supply Constrained', status: 'Warning' };

    return (
        <Layout style={{ background: 'transparent', paddingBottom: 16, position: 'relative' }}>
            <Card variant="borderless" className="shadow-sm" style={{ marginBottom: 16, borderRadius: 12 }}>
                <HeatMapTopBar 
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    service={serviceA}
                    setService={(val) => {
                        setServiceA(val);
                        if (isSyncLocked) setServiceB(val);
                    }}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    setIsZoneListVisible={setIsZoneListVisible}
                    isConnected={isConnected} 
                    onAnalyticsClick={() => setIsAnalyticsOpen(true)}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    dateRange={dateRangeA}
                    setDateRange={(val) => {
                        setDateRangeA(val);
                        if (isSyncLocked) setDateRangeB(val);
                    }}
                    isSyncLocked={isSyncLocked}
                    setIsSyncLocked={setIsSyncLocked}
                    serviceB={serviceB}
                    setServiceB={setServiceB}
                    dateRangeB={dateRangeB}
                    setDateRangeB={setDateRangeB}
                />
                <Divider style={{ margin: '12px 0' }} />
                <HeatMapSummaryBar 
                    summary={{
                        activeRequests: globalMetrics.totalDemand,
                        availableDrivers: globalMetrics.totalIdle,
                        demandSupplyRatio: parseFloat((globalMetrics.totalDemand / Math.max(1, globalMetrics.totalIdle)).toFixed(2)),
                        activeSurgeZones: globalMetrics.totalActiveSurgeZones,
                        avgPickupEta: `${Math.round(globalMetrics.avgEta)} min`,
                        completionRate: parseFloat((100 - globalMetrics.networkCancelRate).toFixed(1))
                    }} 
                    loading={loading} 
                />
                <Divider style={{ margin: '12px 0' }} />
                <HeatMapFiltersSider 
                    marketTemperament={networkTemperament}
                    enabledLayers={enabledLayers}
                    setEnabledLayers={setEnabledLayers}
                />
            </Card>

            {viewMode === 'OVERVIEW' ? (
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card 
                            id="heatmap-container"
                            variant="borderless" 
                            className="shadow-sm" 
                            style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 420px)', minHeight: 400, border: isFullscreen ? 'none' : undefined, borderRadius: 12 }}
                            styles={{ 
                                body: { 
                                    padding: 0, 
                                    height: '100%', 
                                    position: 'relative', 
                                    borderRadius: isFullscreen ? 0 : 12,
                                    transition: 'all 0.3s ease'
                                } 
                            }}
                        >
                            <HeatMapCanvas 
                                mapCenter={mapCenter}
                                enabledLayers={enabledLayers}
                                cells={cells}
                                selectedCell={selectedCell}
                                setSelectedCell={(cell) => {
                                    setSelectedCell(cell);
                                    if (cell) {
                                        setIsDrilldownActive(true);
                                        setSurgeValue(parseFloat(cell.metrics.surgeSuggestion.toFixed(1)));
                                    } else {
                                        setIsDrilldownActive(false);
                                    }
                                }}
                                setMapCenter={setMapCenter}
                                isFullscreen={isFullscreen}
                                toggleFullscreen={toggleFullscreen}
                                mapId="330dd4d2eb9c8b55d0e41205"
                                mapTypeId={mapTypeId}
                            />
                        </Card>
                    </Col>

                    {selectedCell && (
                        <Col span={24}>
                            <ZoneInsightDrawer 
                                selectedCell={selectedCell}
                                service={serviceA}
                                surgeValue={surgeValue}
                                setSurgeValue={setSurgeValue}
                                incentiveAmount={incentiveAmount}
                                setIncentiveAmount={setIncentiveAmount}
                                broadcastMode={broadcastMode}
                                setBroadcastMode={setBroadcastMode}
                                manualBroadcastMessage={manualBroadcastMessage}
                                setManualBroadcastMessage={setManualBroadcastMessage}
                                commandLog={commandLog}
                                handleDeploySurge={handleDeploySurge}
                                handleBroadcast={handleBroadcast}
                                onResetSurge={() => setSurgeValue(parseFloat(selectedCell?.metrics?.surgeSuggestion?.toFixed(1) || '1.0'))}
                                navigate={navigate}
                            />
                        </Col>
                    )}
                </Row>
            ) : (
                <Row gutter={[20, 20]} style={{ height: 'calc(100vh - 400px)', minHeight: 450 }}>
                    {/* Persistent Sidebar (Like Screenshot) */}
                    <Col span={6} style={{ height: '100%', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 12, overflow: 'hidden' }}>
                        <Title level={5} style={{ marginBottom: 16, paddingLeft: 8 }}>Cross-Service Telemetry</Title>
                        <div style={{ height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                             <ZoneTelemetryList onSelectZone={(id, name, lat, lng) => {
                                 setMapCenter([lat, lng]);
                                 if (socket) socket.emit('subscribeToZone', { lat, lng });
                             }} />
                        </div>
                    </Col>
                    
                    {/* Split View Maps */}
                    <Col span={18} style={{ height: '100%' }}>
                        <Row gutter={[16, 16]} style={{ height: '100%' }}>
                            <Col span={12} style={{ height: '100%' }}>
                                <Card 
                                    title={<Text strong>Market A: Ride Hailing</Text>} 
                                    styles={{ body: { padding: 0, height: 'calc(100% - 48px)' } }} 
                                    style={{ height: '100%', borderRadius: 16, overflow: 'hidden', border: '2px solid #3b82f6' }}
                                >
                                    <HeatMapCanvas 
                                        mapCenter={mapCenter}
                                        enabledLayers={enabledLayers}
                                        cells={cellsA}
                                        selectedCell={selectedCell}
                                        setSelectedCell={setSelectedCell}
                                        setMapCenter={setMapCenter}
                                        isFullscreen={isFullscreen}
                                        toggleFullscreen={toggleFullscreen}
                                        mapId="split_a"
                                        mapTypeId={mapTypeId}
                                    />
                                </Card>
                            </Col>
                            <Col span={12} style={{ height: '100%' }}>
                                <Card 
                                    title={<Text strong>Market B: Food & Parcels</Text>} 
                                    styles={{ body: { padding: 0, height: 'calc(100% - 48px)' } }} 
                                    style={{ height: '100%', borderRadius: 16, overflow: 'hidden', border: '2px solid #ef4444' }}
                                >
                                    <HeatMapCanvas 
                                        mapCenter={mapCenter}
                                        enabledLayers={enabledLayers}
                                        cells={cellsB}
                                        selectedCell={selectedCell}
                                        setSelectedCell={setSelectedCell}
                                        setMapCenter={setMapCenter}
                                        isFullscreen={isFullscreen}
                                        toggleFullscreen={toggleFullscreen}
                                        mapId="split_b"
                                        mapTypeId={mapTypeId}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}

            <GlobalZoneExplorerDrawer
                visible={isZoneListVisible}
                onClose={() => setIsZoneListVisible(false)}
                onSelectZone={(zoneId, zoneName, lat, lng) => {
                    message.loading(`Centering tracking systems on ${zoneName}...`, 1.0).then(() => {
                        setMapCenter([lat, lng]);
                        if (socket) {
                            socket.emit('subscribeToZone', { lat, lng });
                        }
                        message.success(`Network metrics bound to ${zoneName}`);
                    });
                    setIsZoneListVisible(false);
                }}
            />

            <MarketAnalyticsDrawer 
                open={isAnalyticsOpen} 
                onClose={() => setIsAnalyticsOpen(false)} 
                cells={cells}
                globalMetrics={globalMetrics}
                onSelectCell={(cell) => {
                    setSelectedCell(cell);
                    setIsDrilldownActive(true);
                    setMapCenter([cell.center.lat, cell.center.lng]);
                }}
            />

            <style>{`
                .pulse-marker { animation: pulse 2s infinite; }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            `}</style>
        </Layout>
    );
};
