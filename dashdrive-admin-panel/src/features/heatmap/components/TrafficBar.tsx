import React from 'react';
import { 
    Card, Space, Typography, Select, 
    Switch, Row, Col, Segmented, Slider, Divider 
} from 'antd';
import { 
    DashboardOutlined, 
    HistoryOutlined,
    CarOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface TrafficBarProps {
    mode: 'live' | 'typical';
    setMode: (mode: 'live' | 'typical') => void;
    day: string;
    setDay: (day: string) => void;
    time: string;
    setTime: (time: string) => void;
    isVisible: boolean;
}

export const TrafficBar: React.FC<TrafficBarProps> = ({
    mode,
    setMode,
    day,
    setDay,
    time,
    setTime,
    isVisible
}) => {
    if (!isVisible) return null;

    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 55,
            transition: 'all 0.3s ease'
        }}>
            <Card 
                size="small"
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0 8px'
                }}
                styles={{ body: { padding: '4px 12px' } }}
            >
                <Space size={24} align="center">
                    {/* Mode Selector Dropdown */}
                    <Select
                        value={mode}
                        onChange={setMode}
                        variant="borderless"
                        style={{ width: 140, fontWeight: 500 }}
                        dropdownStyle={{ borderRadius: 12 }}
                        options={[
                            { 
                                value: 'live', 
                                label: (
                                    <Space>
                                        <CarOutlined style={{ color: '#22c55e' }} />
                                        <Text strong={mode === 'live'}>Live traffic</Text>
                                    </Space>
                                ) 
                            },
                            { 
                                value: 'typical', 
                                label: (
                                    <Space>
                                        <HistoryOutlined style={{ color: '#3b82f6' }} />
                                        <Text strong={mode === 'typical'}>Typical traffic</Text>
                                    </Space>
                                ) 
                            }
                        ]}
                    />

                    {/* Conditional Content */}
                    {mode === 'live' ? (
                        <Space size={12}>
                            <Text type="secondary" style={{ fontSize: 11 }}>Fast</Text>
                            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <div style={{ width: 24, height: 4, background: '#22c55e', borderRadius: 2 }} />
                                <div style={{ width: 24, height: 4, background: '#eab308', borderRadius: 2 }} />
                                <div style={{ width: 24, height: 4, background: '#ef4444', borderRadius: 2 }} />
                                <div style={{ width: 24, height: 4, background: '#7f1d1d', borderRadius: 2 }} />
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>Slow</Text>
                        </Space>
                    ) : (
                        <Space size={16} align="center">
                            <div style={{ width: 200 }}>
                                <Slider 
                                    min={0} max={1439} step={15} tooltip={{ open: false }}
                                    value={(() => { const [h, m] = time.split(':').map(Number); return h * 60 + m; })()}
                                    onChange={(val) => {
                                        const h = Math.floor(val / 60); const m = val % 60;
                                        setTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                                    }}
                                    styles={{ track: { background: '#3b82f6' } }}
                                />
                            </div>
                            <Space size={4}>
                                <Text strong style={{ fontSize: 12, minWidth: 60 }}>{time}</Text>
                                <Segmented 
                                    size="small"
                                    options={days.map((d, i) => ({ label: d, value: i.toString() }))}
                                    value={day}
                                    onChange={(v) => setDay(v as string)}
                                    style={{ fontSize: '10px', background: '#f1f5f9' }}
                                />
                            </Space>
                        </Space>
                    )}

                    {/* Incidents Toggle (Optional visual filler to match screenshot) */}
                    <Space size={8}>
                        <Divider type="vertical" style={{ height: 24, borderColor: '#e2e8f0' }} />
                        <Switch size="small" defaultChecked />
                    </Space>
                </Space>
            </Card>
        </div>
    );
};
