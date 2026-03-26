import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Tag, Button, Statistic, Segmented, DatePicker, Slider } from 'antd';
import { 
    LineChartOutlined, 
    EnvironmentOutlined, 
    HomeOutlined,
    PlayCircleOutlined,
    InfoCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { GoogleMap, PolylineF, MarkerF } from '@react-google-maps/api';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer, 
    Area, 
    AreaChart,
    Legend
} from 'recharts';

const { Title, Text, Paragraph } = Typography;

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '16px'
};

const center = {
    lat: -17.824858,
    lng: 31.053028
};

const MOCK_CHART_DATA = [
    { time: '12AM', travelTime: 2.1, reliableTime: 2.05 },
    { time: '4AM', travelTime: 2.1, reliableTime: 2.05 },
    { time: '8AM', travelTime: 3.5, reliableTime: 3.8 },
    { time: '12PM', travelTime: 2.8, reliableTime: 3.2 },
    { time: '4PM', travelTime: 3.9, reliableTime: 4.2 },
    { time: '8PM', travelTime: 2.5, reliableTime: 2.8 },
];

export const RouteReliability: React.FC = () => {
    const [playbackTime, setPlaybackTime] = useState(480); // 8:00 AM in minutes
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlaybackTime(prev => (prev + 15) % 1440);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatPlaybackTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const period = h < 12 ? 'AM' : 'PM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <div style={{ position: 'relative' }}>
            <Row gutter={[24, 24]}>
                {/* Left Panel: Advanced Filters */}
                <Col xs={24} lg={6}>
                    <Card variant="borderless" style={{ background: '#f8fafc', height: '100%', borderRadius: 16 }}>
                        <Title level={4} style={{ marginBottom: 4 }}>Route Reliability Analysis</Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>Monitor and Improve Key Transportation Routes</Text>
                        
                        <div style={{ marginTop: 24 }}>
                            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>Time Period</Text>
                            <Space wrap style={{ marginBottom: 16 }}>
                                <Button size="small">Last Week</Button>
                                <Button size="small" type="primary">Custom</Button>
                            </Space>
                            
                            <Row gutter={8} style={{ marginBottom: 16 }}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>From:</Text>
                                    <DatePicker size="small" placeholder="10/15/2025" style={{ width: '100%' }} />
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>To:</Text>
                                    <DatePicker size="small" placeholder="11/04/2025" style={{ width: '100%' }} />
                                </Col>
                            </Row>

                            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>Day of Week</Text>
                            <Segmented 
                                size="small" 
                                options={['S', 'M', 'T', 'W', 'T', 'F', 'S']} 
                                defaultValue="T"
                                block
                                style={{ marginBottom: 24 }}
                            />

                            <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>Time Range</Text>
                            <Slider 
                                range 
                                defaultValue={[420, 1320]} 
                                min={0} 
                                max={1439} 
                                step={30}
                                tooltip={{ formatter: formatPlaybackTime }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text type="secondary" style={{ fontSize: 10 }}>12AM</Text>
                                <Text type="secondary" style={{ fontSize: 10 }}>6AM</Text>
                                <Text type="secondary" style={{ fontSize: 10 }}>12PM</Text>
                                <Text type="secondary" style={{ fontSize: 10 }}>6PM</Text>
                                <Text type="secondary" style={{ fontSize: 10 }}>12AM</Text>
                            </div>
                        </div>

                        <div style={{ marginTop: 40 }}>
                             <Button block icon={<HomeOutlined />} style={{ borderRadius: 8 }}>Home</Button>
                        </div>
                    </Card>
                </Col>

                {/* Center: Map */}
                <Col xs={24} lg={12}>
                    <div style={{ position: 'relative' }}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={12}
                            options={{
                                styles: [
                                    {
                                        featureType: 'all',
                                        elementType: 'labels.text.fill',
                                        stylers: [{ color: '#64748b' }]
                                    }
                                ]
                            }}
                        >
                             <PolylineF 
                                path={[{lat: -17.82, lng: 31.04}, {lat: -17.83, lng: 31.05}, {lat: -17.84, lng: 31.06}]}
                                options={{ strokeColor: '#f59e0b', strokeWeight: 4, strokeOpacity: 0.8 }}
                            />
                            
                            {/* Landmarks with custom styling simulation */}
                            <MarkerF position={{lat: -17.827, lng: 31.052}} label={{ text: "Africa Unity Square", color: "white", className: "map-label" }} />
                            <MarkerF position={{lat: -17.82, lng: 31.02}} label={{ text: "Heroes Acre", color: "white", className: "map-label" }} />
                            <MarkerF position={{lat: -17.85, lng: 31.05}} label={{ text: "Mbare Musika", color: "white", className: "map-label" }} />
                            <MarkerF position={{lat: -17.80, lng: 31.04}} label={{ text: "Avondale", color: "white", className: "map-label" }} />
                        </GoogleMap>
                        
                        {/* Playback Control Overlay */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 20, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.98)',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            zIndex: 10,
                            minWidth: '450px',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                             <Button 
                                type="primary" 
                                shape="circle" 
                                icon={isPlaying ? <SyncOutlined spin /> : <PlayCircleOutlined />} 
                                size="large"
                                onClick={() => setIsPlaying(!isPlaying)}
                                style={{ background: isPlaying ? '#ffc107' : '#1a73e8', border: 'none' }}
                            />
                            <div style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Historical traffic data from Oct 15-Nov 4</Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 13 }}>Tuesdays between 7 AM to 10 PM</Text>
                                    <Text type="secondary" style={{ fontSize: 11 }}>{formatPlaybackTime(playbackTime)}</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Right Panel: Analysis Graph */}
                <Col xs={24} lg={6}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={5} style={{ margin: 0 }}>Route Analysis - Harare</Title>
                                <InfoCircleOutlined style={{ fontSize: 14, color: '#94a3b8' }} />
                            </div>
                        }
                        extra={<Button size="small" type="primary">Quick Compare</Button>}
                        variant="borderless" 
                        style={{ height: '100%', borderRadius: 16 }}
                    >
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
                            Major Arterial Roads
                        </Text>
                        
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <Statistic title="PEAK CONGESTION" value={40.4} suffix="%" valueStyle={{ color: '#ef4444', fontSize: 18 }} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="TRAVEL TIME" value="3h 49m" valueStyle={{ color: '#3b82f6', fontSize: 18 }} />
                            </Col>
                        </Row>

                        <div style={{ height: 300, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_CHART_DATA}>
                                    <defs>
                                        <linearGradient id="colorTravel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorReliable" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" iconType="plainline" wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
                                    <Area type="monotone" dataKey="reliableTime" name="95% Reliable Time" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReliable)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="travelTime" name="Travel Time" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTravel)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Text strong style={{ fontSize: 12 }}>Time of Day</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
            <style dangerouslySetInnerHTML={{ __html: `
                .map-label {
                    background: #1a73e8;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 11px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
            `}} />
        </div>
    );
};
