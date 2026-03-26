import React, { useMemo } from 'react';
import { Drawer, Typography, Row, Col, Card, Space, Select, Button } from 'antd';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, Legend, Cell
} from 'recharts';
import { GridCell } from '../hooks/useMarketGrid';

const { Title, Text } = Typography;

import { useSocket } from '../../../context/SocketContext';

interface MarketAnalyticsDrawerProps {
    open: boolean;
    onClose: () => void;
    cells: GridCell[];
    globalMetrics: any;
    onSelectCell?: (cell: GridCell) => void;
}

export const MarketAnalyticsDrawer: React.FC<MarketAnalyticsDrawerProps> = ({
    open,
    onClose,
    cells,
    globalMetrics,
    onSelectCell
}) => {
    const [trends, setTrends] = React.useState<any[]>([]);
    const { socket } = useSocket();

    // Consume live market trends
    React.useEffect(() => {
        if (!socket) return;
        
        socket.on('marketTrendsUpdate', (history: any[]) => {
            setTrends(history);
        });

        return () => {
             socket.off('marketTrendsUpdate');
        };
    }, [socket]);
    // Ranking the top 5 worst cells (Live from cells prop)
    const rankedCells = useMemo(() => {
        return [...cells]
            .sort((a, b) => b.derived.imbalanceRatio - a.derived.imbalanceRatio)
            .slice(0, 5)
            .map(c => ({
                id: c.id,
                name: c.name,
                imbalance: parseFloat(c.derived.imbalanceRatio.toFixed(1)),
                eta: c.metrics.etaCurrent,
                status: c.derived.status,
                raw: c // Keep referential identity for click-to-nav
            }));
    }, [cells]);

    const getBarColor = (status: string) => {
        switch(status) {
            case 'critical': return '#a855f7';
            case 'high_demand': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#10b981';
        }
    };

    return (
        <Drawer
            title={
                <Space>
                    <Title level={4} style={{ margin: 0 }}>Market Analytics Archive</Title>
                    <Select defaultValue="12H" variant="borderless" style={{ width: 120, marginLeft: 16 }}>
                        <Select.Option value="1H">Last Hour</Select.Option>
                        <Select.Option value="12H">Last 12 Hours</Select.Option>
                        <Select.Option value="24H">Last 24 Hours</Select.Option>
                        <Select.Option value="WEEK">Last 7 Days</Select.Option>
                    </Select>
                </Space>
            }
            placement="bottom"
            onClose={onClose}
            open={open}
            height={450}
            styles={{
                body: { background: '#f8fafc', padding: '24px' },
                header: { background: '#ffffff', borderBottom: '1px solid #f1f5f9' }
            }}
            extra={
                <Space>
                    <Button onClick={onClose}>Close Archive</Button>
                    <Button type="primary">Export Report PDF</Button>
                </Space>
            }
        >
            <Row gutter={[24, 24]} style={{ height: '100%' }}>
                <Col xs={24} lg={10} style={{ height: '100%' }}>
                    <Card 
                        title="Demand vs Supply Spread" 
                        variant="borderless" 
                        className="shadow-sm" 
                        style={{ height: '100%', borderRadius: 12 }}
                        styles={{ body: { height: 'calc(100% - 60px)', padding: '16px 24px' } }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Area type="monotone" name="Requests" dataKey="demand" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                                <Area type="monotone" name="Idle Supply" dataKey="supply" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSupply)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={7} style={{ height: '100%' }}>
                    <Card 
                        title="Network ETA Inflation" 
                        variant="borderless" 
                        className="shadow-sm" 
                        style={{ height: '100%', borderRadius: 12 }}
                        styles={{ body: { height: 'calc(100% - 60px)', padding: '16px 24px' } }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Line type="monotone" name="Wait Time (min)" dataKey="eta" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={7} style={{ height: '100%' }}>
                    <Card 
                        title="Highest Risk Zones" 
                        variant="borderless" 
                        className="shadow-sm" 
                        style={{ height: '100%', borderRadius: 12 }}
                        styles={{ body: { height: 'calc(100% - 60px)', padding: '16px 12px' } }}
                    >
                        {rankedCells.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={rankedCells} 
                                    layout="vertical" 
                                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                                    onClick={(data: any) => {
                                        if (data && data.activePayload && data.activePayload.length > 0 && onSelectCell) {
                                            onSelectCell(data.activePayload[0].payload.raw);
                                            onClose();
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} width={70} />
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="imbalance" name="Market Pressure Ratio" radius={[0, 4, 4, 0]}>
                                        {rankedCells.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text type="secondary">Waiting for Market Initialisation...</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Drawer>
    );
};
