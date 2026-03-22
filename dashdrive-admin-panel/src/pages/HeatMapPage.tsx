import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    App, Layout, Card, Row, Col, Divider, 
    Drawer, Tabs, Input, List, Avatar, Space, 
    Typography, Tag, Statistic, Calendar, Form, 
    Select, Slider, TimePicker, InputNumber, Button, Switch, Table, Flex 
} from 'antd';
import { 
    HistoryOutlined, PlusOutlined, TeamOutlined, 
    StarFilled, ThunderboltOutlined, GlobalOutlined, 
    FieldTimeOutlined, SyncOutlined 
} from '@ant-design/icons';

// Feature Components
import { HeatMapTopBar } from '../features/heatmap/components/HeatMapTopBar';
import { HeatMapFiltersSider } from '../features/heatmap/components/HeatMapFiltersSider';
import { HeatMapCanvas } from '../features/heatmap/components/HeatMapCanvas';
import { ZoneInsightDrawer } from '../features/heatmap/components/ZoneInsightDrawer';
import { AiRecommendationCard } from '../features/heatmap/components/AiRecommendationCard';
import { TrafficControl } from '../features/heatmap/components/TrafficControl';
import { GoogleMapsSidebar } from '../features/heatmap/components/GoogleMapsSidebar';
import { TrafficBar } from '../features/heatmap/components/TrafficBar';

import { WeatherPanel } from '../features/heatmap/components/WeatherPanel';
import { useWeather } from '../features/heatmap/hooks/useWeather';

// Hooks & Types
import { 
    Zone, 
    EventCluster, 
    MarketplaceAction, 
    PeakHourConfig 
} from '../features/heatmap/types';
import { 
    LOCATION_DATA, 
    LOCATION_COORDS, 
    SERVICE_TYPES, 
    MOCK_EVENT_CLUSTERS, 
    getMockZonesForService 
} from '../features/heatmap/mocks/heatmapMocks';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;

export const HeatMapPage: React.FC = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();

    // --- State Management ---
    const [selectedCountry, setSelectedCountry] = useState('Zimbabwe');
    const [selectedRegion, setSelectedRegion] = useState('Mashonaland');
    const [selectedCity, setSelectedCity] = useState('Harare');
    const [service, setService] = useState('ALL');
    const [loading, setLoading] = useState(false);
    
    const [mapCenter, setMapCenter] = useState<[number, number]>([-17.8248, 31.0530]);
    
    // Live Weather Integration
    const { current, forecast, alerts, legacyWeather, loading: weatherLoading } = useWeather(mapCenter[0], mapCenter[1]);
    
    const [traffic] = useState({ level: 'Heavy Congestion', delay: '+12 min', impact: '+25%' });
    const [marketTemperament] = useState({ label: 'Evening Rush', status: 'Peak' });
    const [enabledLayers, setEnabledLayers] = useState<string[]>([]);
    
    const [zones, setZones] = useState<Zone[]>([]);
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [isDrilldownActive, setIsDrilldownActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Traffic Control State
    const [trafficMode, setTrafficMode] = useState<'live' | 'typical'>('live');
    const [mapTypeId, setMapTypeId] = useState('roadmap');
    const [typicalDay, setTypicalDay] = useState<string>('1'); // Monday
    const [typicalTime, setTypicalTime] = useState<string>('09:00');

    // Drawers & UI State
    const [isZoneListVisible, setIsZoneListVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tactical State
    const [surgeValue, setSurgeValue] = useState<number>(1.5);
    const [incentiveAmount, setIncentiveAmount] = useState<number>(5.00);
    const [broadcastMode, setBroadcastMode] = useState<'INCENTIVE' | 'MANUAL'>('INCENTIVE');
    const [manualBroadcastMessage, setManualBroadcastMessage] = useState<string>('');
    const [events, setEvents] = useState<EventCluster[]>(MOCK_EVENT_CLUSTERS);
    const [commandLog, setCommandLog] = useState<MarketplaceAction[]>([
        { time: '17:45', msg: 'Peak Hour Alert sent to CBD Terminal', type: 'INCENTIVE' },
        { time: '17:10', msg: 'Weather warning: Heavy rain in Avondale', type: 'MANUAL' }
    ]);

    const [peakHours, setPeakHours] = useState<PeakHourConfig[]>([
        { id: 1, day: 'Monday', zone: 'GLOBAL', startTime: '08:00', endTime: '12:00', multiplier: '1.5x' },
        { id: 6, day: 'Sunday', zone: 'z-2', startTime: '16:00', endTime: '20:00', multiplier: '2.0x' },
    ]);
    const [isAutoBroadcastEnabled, setIsAutoBroadcastEnabled] = useState(false);

    // --- Side Effects ---
    useEffect(() => {
        const loadMarketData = async () => {
            setLoading(true);
            await new Promise(res => setTimeout(res, 600));
            const newZones = getMockZonesForService(service.toLowerCase());
            setZones(newZones);
            if (!selectedZone) setSelectedZone(newZones[0]);
            setLoading(false);
        };
        loadMarketData();
    }, [selectedCity, service]);

    // --- Handlers ---
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const handleMapSearch = (val: string) => {
        const found = zones.find(z => z.name.toLowerCase().includes(val.toLowerCase()));
        if (found) {
            setMapCenter([found.lat, found.lng]);
            setIsDrilldownActive(true);
            setSelectedZone(found);
            message.success(`Navigating to ${found.name}`);
        } else {
            message.warning('Location or zone not found in current sector.');
        }
    };

    const handleDeploySurge = () => {
        if (!selectedZone) return;
        message.loading('Deploying Surge Multiplier...', 1.5).then(() => {
            message.success(`Global Surge: ${surgeValue}x Applied to ${selectedZone.name}`);
        });
    };

    const handleBroadcast = () => {
        if (!selectedZone) return;
        const msg = broadcastMode === 'INCENTIVE' 
            ? `Peak Hour Alert: High demand in ${selectedZone.name}! $${incentiveAmount.toFixed(2)} active.`
            : manualBroadcastMessage;
            
        if (!msg.trim()) return message.warning('Please enter a message.');
        
        message.loading('Targeting nearby drivers...', 1.2).then(() => {
            setCommandLog([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg, type: broadcastMode }, ...commandLog]);
            message.success('Broadcast Sent Successfully');
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

    return (
        <Layout style={{ background: 'transparent', paddingBottom: 24 }}>
            <Card variant="borderless" className="shadow-sm" style={{ marginBottom: 24, borderRadius: 12 }}>
                <HeatMapTopBar 
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    service={service}
                    setService={setService}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    setIsZoneListVisible={setIsZoneListVisible}
                />
                <Divider style={{ margin: '16px 0' }} />
                <HeatMapFiltersSider 
                    weather={legacyWeather}
                    traffic={traffic}
                    marketTemperament={marketTemperament}
                    enabledLayers={enabledLayers}
                    setEnabledLayers={setEnabledLayers}
                />
            </Card>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        id="heatmap-container"
                        variant="borderless" 
                        className="shadow-sm" 
                        style={{ height: isFullscreen ? '100vh' : 'auto', border: isFullscreen ? 'none' : undefined, borderRadius: isFullscreen ? 0 : 12 }}
                        styles={{ 
                            body: { 
                                padding: 0, 
                                height: isFullscreen ? '100vh' : 'calc(100vh - 180px)', 
                                position: 'relative', 
                                borderRadius: isFullscreen ? 0 : 12,
                                transition: 'all 0.3s ease'
                            } 
                        }}
                    >
                        <HeatMapCanvas 
                            selectedCity={selectedCity}
                            mapCenter={mapCenter}
                            isDrilldownActive={isDrilldownActive}
                            enabledLayers={enabledLayers}
                            zones={zones}
                            service={service}
                            events={events}
                            setSelectedZone={setSelectedZone}
                            setMapCenter={setMapCenter}
                            setIsDrilldownActive={setIsDrilldownActive}
                            handleMapSearch={handleMapSearch}
                            handleDateChange={() => {}}
                            setIsCalendarVisible={setIsCalendarVisible}
                            isFullscreen={isFullscreen}
                            toggleFullscreen={toggleFullscreen}
                            trafficMode={trafficMode}
                            mapId="330dd4d2eb9c8b55d0e41205"
                            mapTypeId={mapTypeId}
                        />
                        <GoogleMapsSidebar 
                            enabledLayers={enabledLayers}
                            setEnabledLayers={setEnabledLayers}
                            mapTypeId={mapTypeId}
                            setMapTypeId={setMapTypeId}
                            onMenuClick={() => setIsZoneListVisible(true)}
                            isMinimized={!isFullscreen}
                        />


                        <TrafficBar 
                            mode={trafficMode}
                            setMode={setTrafficMode}
                            day={typicalDay}
                            setDay={setTypicalDay}
                            time={typicalTime}
                            setTime={setTypicalTime}
                            isVisible={enabledLayers.includes('traffic')}
                        />
                        <WeatherPanel 
                            current={current}
                            forecast={forecast}
                            alerts={alerts}
                            loading={weatherLoading}
                            isVisible={enabledLayers.includes('rain')}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {selectedZone ? (
                        <Flex vertical gap={16}>
                            <ZoneInsightDrawer 
                                selectedZone={selectedZone}
                                service={service}
                                events={events}
                                traffic={traffic}
                                weather={legacyWeather}
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
                                onResetSurge={() => setSurgeValue(selectedZone.surge)}
                                navigate={navigate}
                            />
                            <AiRecommendationCard 
                                selectedZone={selectedZone}
                                traffic={traffic}
                                weather={legacyWeather}
                                activeEvent={events.find(e => e.isGlobal || Math.abs(e.lat - selectedZone.lat) < 0.05)}
                            />
                        </Flex>
                    ) : (
                        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0' }}>
                           <GlobalOutlined style={{ fontSize: 40, color: '#bfdbfe', marginBottom: 16 }} />
                           <Title level={5}>Target a zone for AI insights</Title>
                           <Text type="secondary">Real-time marketplace data will appear here.</Text>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Zone Market Explorer Drawer */}
            <Drawer
                title={<Space><HistoryOutlined /> Market Explorer</Space>}
                placement="left"
                onClose={() => setIsZoneListVisible(false)}
                open={isZoneListVisible}
                styles={{ body: { padding: 0 } }}
                getContainer={() => document.getElementById('heatmap-container') || document.body}
            >

                <div style={{ padding: 20 }}>
                    <Input.Search 
                        placeholder="Search zones..." 
                        style={{ marginBottom: 20 }} 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <List
                        dataSource={zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                        renderItem={item => (
                            <List.Item
                                onClick={() => { setSelectedZone(item); setMapCenter([item.lat, item.lng]); setIsZoneListVisible(false); }}
                                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8, marginBottom: 8, border: '1px solid #f1f5f9' }}
                            >
                                <List.Item.Meta title={item.name} description={`${item.drivers} Drivers • Surge: ${item.surge}x`} />
                                <Tag color={item.demand === 'critical' ? 'purple' : item.demand === 'high' ? 'red' : 'green'}>{item.demand}</Tag>
                            </List.Item>
                        )}
                    />
                </div>
            </Drawer>

            {/* Operations Calendar Drawer */}
            <Drawer
                title="Market Operations Calendar"
                placement="right"
                width={500}
                onClose={() => setIsCalendarVisible(false)}
                open={isCalendarVisible}
                getContainer={() => document.getElementById('heatmap-container') || document.body}
            >

                <Tabs items={[
                    {
                        key: '1',
                        label: 'Scheduled Events',
                        children: (
                            <div style={{ padding: 16 }}>
                                <Calendar fullscreen={false} style={{ marginBottom: 24, border: '1px solid #f1f5f9', borderRadius: 12, padding: 8 }} />
                                <Form layout="vertical" onFinish={(v) => {
                                    setEvents([...events, { id: `ev-${Date.now()}`, name: v.name, type: 'Manual', impact: '+20%', lat: -17.82, lng: 31.05, attendees: '10k' }]);
                                    message.success('Event scheduled');
                                }}>
                                    <Form.Item name="name" label="Event Name"><Input placeholder="Starlight Concert" /></Form.Item>
                                    <Button type="primary" block htmlType="submit">Schedule Intelligence</Button>
                                </Form>
                                <Divider />
                                <List dataSource={events} renderItem={e => <List.Item><List.Item.Meta title={e.name} description={e.impact} /></List.Item>} />
                            </div>
                        )
                    },
                    {
                        key: '2',
                        label: 'Peak Config',
                        children: (
                            <div style={{ padding: 16 }}>
                                <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                                    <Row justify="space-between" align="middle">
                                        <Text strong>AI Auto-Broadcast</Text>
                                        <Switch checked={isAutoBroadcastEnabled} onChange={setIsAutoBroadcastEnabled} />
                                    </Row>
                                </div>
                                <Table 
                                    dataSource={peakHours} 
                                    size="small" 
                                    pagination={false}
                                    columns={[
                                        { title: 'Day', dataIndex: 'day' },
                                        { title: 'Window', render: (_, r) => `${r.startTime}-${r.endTime}` },
                                        { title: 'Multiplier', dataIndex: 'multiplier' }
                                    ]}
                                />
                            </div>
                        )
                    }
                ]} />
            </Drawer>

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
