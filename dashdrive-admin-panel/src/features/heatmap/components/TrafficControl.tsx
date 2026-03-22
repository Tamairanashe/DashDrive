import React from 'react';
import { 
    Card, Space, Typography, Switch, 
    Select, Slider, Divider, Row, Col, Segmented
} from 'antd';
import { 
    DashboardOutlined, 
    HistoryOutlined, 
    ClockCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

interface TrafficControlProps {
    mode: 'live' | 'typical';
    setMode: (mode: 'live' | 'typical') => void;
    day: string;
    setDay: (day: string) => void;
    time: string;
    setTime: (time: string) => void;
}

export const TrafficControl: React.FC<TrafficControlProps> = ({
    mode,
    setMode,
    day,
    setDay,
    time,
    setTime
}) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <Card 
            size="small" 
            style={{ 
                position: 'absolute', 
                bottom: 24, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                zIndex: 1000,
                width: mode === 'live' ? 320 : 450,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '12px 16px' } }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size={mode === 'live' ? 0 : 12}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Select 
                            value={mode} 
                            onChange={setMode}
                            variant="borderless"
                            style={{ width: 130, fontWeight: 600 }}
                            options={[
                                { value: 'live', label: <Space><DashboardOutlined style={{ color: '#22c55e' }} />Live traffic</Space> },
                                { value: 'typical', label: <Space><HistoryOutlined style={{ color: '#3b82f6' }} />Typical traffic</Space> }
                            ]}
                        />
                    </Col>
                    <Col>
                        <Space size={4}>
                            <Text type="secondary" style={{ fontSize: 11 }}>Fast</Text>
                            <div style={{ display: 'flex', gap: 2 }}>
                                <div style={{ width: 12, height: 4, background: '#22c55e', borderRadius: 2 }} />
                                <div style={{ width: 12, height: 4, background: '#eab308', borderRadius: 2 }} />
                                <div style={{ width: 12, height: 4, background: '#ef4444', borderRadius: 2 }} />
                                <div style={{ width: 12, height: 4, background: '#7f1d1d', borderRadius: 2 }} />
                            </div>
                            <Text type="secondary" style={{ fontSize: 11 }}>Slow</Text>
                        </Space>
                    </Col>
                </Row>

                {mode === 'typical' && (
                    <>
                        <Divider style={{ margin: '8px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }} size={8}>
                            <Row justify="space-between" align="middle">
                                <Text style={{ fontSize: 12, color: '#64748b' }}>
                                    {dayMap[parseInt(day)]}, {time}
                                </Text>
                                <Segmented 
                                    size="small"
                                    options={days.map((d, i) => ({ label: d, value: i.toString() }))}
                                    value={day}
                                    onChange={(v) => setDay(v as string)}
                                />
                            </Row>
                            <Slider 
                                min={0} 
                                max={1439} 
                                step={15}
                                tooltip={{ open: false }}
                                value={
                                    (() => {
                                        const [h, m] = time.split(':').map(Number);
                                        return h * 60 + m;
                                    })()
                                }
                                onChange={(val) => {
                                    const h = Math.floor(val / 60);
                                    const m = val % 60;
                                    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                    setTime(timeStr);
                                }}
                            />
                        </Space>
                    </>
                )}
            </Space>
        </Card>
    );
};
