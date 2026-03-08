import React, { useState, useEffect, useRef } from 'react';
import { Typography, Row, Col, Card, Input, Button, Tag, Space, Select } from 'antd';
import { WarningOutlined, FilterOutlined, CodeOutlined, SyncOutlined, BugOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const SystemLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mock streaming logs
        const mockEvents = [
            { level: 'INFO', service: 'AUTH', msg: 'User login successful', ip: '192.168.1.1', time: new Date().toISOString() },
            { level: 'WARN', service: 'DISPATCH', msg: 'High latency detected in routing matrix', ip: '10.0.0.5', time: new Date().toISOString() },
            { level: 'ERROR', service: 'FINANCE', msg: 'Payout webhook failed to Stripe', ip: '10.0.0.5', time: new Date().toISOString() },
            { level: 'INFO', service: 'CMS', msg: 'Banner template cache cleared', ip: '127.0.0.1', time: new Date().toISOString() },
            { level: 'INFO', service: 'WEBSOCKET', msg: 'New admin client connected', ip: '192.168.1.20', time: new Date().toISOString() },
        ];
        
        setLogs(mockEvents);

        const interval = setInterval(() => {
            const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
            setLogs(prev => [...prev.slice(-49), { ...randomEvent, time: new Date().toISOString() }]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (autoScroll && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    const getColor = (level: string) => {
        switch (level) {
            case 'INFO': return 'blue';
            case 'WARN': return 'orange';
            case 'ERROR': return 'red';
            default: return 'default';
        }
    };

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={4} style={{ margin: 0 }}>System Logs Console</Title>
                    <Text type="secondary">Real-time metrics and tracing from microservice containers.</Text>
                </Col>
                <Col>
                    <Space>
                        <Select defaultValue="ALL" style={{ width: 120 }}>
                            <Option value="ALL">All Services</Option>
                            <Option value="AUTH">Auth</Option>
                            <Option value="DISPATCH">Dispatch</Option>
                            <Option value="FINANCE">Finance</Option>
                        </Select>
                        <Search placeholder="Filter logs..." style={{ width: 200 }} />
                        <Button icon={<FilterOutlined />}>Filters</Button>
                    </Space>
                </Col>
            </Row>

            <Card 
                bordered={false} 
                className="shadow-sm" 
                style={{ background: '#0f172a', color: '#f8fafc', height: '65vh', overflow: 'hidden' }}
                bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ padding: '12px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <BugOutlined style={{ color: '#ef4444' }} />
                        <Text style={{ color: '#94a3b8', fontFamily: 'monospace' }}>tail -f /var/log/dashdrive/*.log</Text>
                    </Space>
                    <Button 
                        type="text" 
                        icon={<SyncOutlined spin />} 
                        style={{ color: autoScroll ? '#10b981' : '#64748b' }}
                        onClick={() => setAutoScroll(!autoScroll)}
                    >
                        Auto-scroll
                    </Button>
                </div>
                
                <div 
                    ref={terminalRef} 
                    style={{ flex: 1, overflowY: 'auto', padding: 24, fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6' }}
                >
                    {logs.map((log, index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                            <span style={{ color: '#64748b', marginRight: 12 }}>[{new Date(log.time).toLocaleTimeString()}]</span>
                            <span style={{ 
                                color: log.level === 'ERROR' ? '#ef4444' : log.level === 'WARN' ? '#f59e0b' : '#38bdf8',
                                fontWeight: 'bold', 
                                width: 50, 
                                display: 'inline-block' 
                            }}>
                                {log.level}
                            </span>
                            <span style={{ color: '#e2e8f0', marginRight: 16 }}>[{log.service}]</span>
                            <span style={{ color: '#cbd5e1' }}>{log.msg}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
