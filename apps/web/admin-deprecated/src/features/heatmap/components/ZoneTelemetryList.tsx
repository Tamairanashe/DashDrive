import React, { useState, useMemo } from 'react';
import { 
    Input, Space, Typography, 
    List, Tag, Segmented, Row, Col, Divider, Card
} from 'antd';
import { 
    EnvironmentOutlined,
    CarOutlined, ThunderboltOutlined, ShoppingCartOutlined,
    AppstoreOutlined, BuildOutlined
} from '@ant-design/icons';
import { useSocket } from '../../../context/SocketContext';

const { Text } = Typography;

interface GlobalZone {
    id: string;
    name: string;
    level: string;
    rides: number;
    food: number;
    shopping: number;
    mart: number;
    c2c: number;
    lat: number;
    lng: number;
}

interface ZoneTelemetryListProps {
    onSelectZone?: (zoneId: string, zoneName: string, lat: number, lng: number) => void;
    height?: string | number;
    showHeader?: boolean;
}

export const ZoneTelemetryList: React.FC<ZoneTelemetryListProps> = ({
    onSelectZone,
    height = '100%',
    showHeader = true
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [scope, setScope] = useState<string>('World');
    const [liveZones, setLiveZones] = useState<GlobalZone[]>([]);
    const { socket } = useSocket();

    // Consume live global data
    React.useEffect(() => {
        if (!socket) return;
        
        socket.on('globalZonesUpdate', (zones: GlobalZone[]) => {
            setLiveZones(zones);
        });

        return () => {
             socket.off('globalZonesUpdate');
        };
    }, [socket]);

    const filteredZones = useMemo(() => {
        let zones = liveZones;
        
        // Scope Filtering
        if (scope === 'Zimbabwe') {
            zones = zones.filter(z => z.level === 'Zimbabwe');
        } else if (scope === 'Africa') {
            zones = zones.filter(z => z.level === 'Africa' || z.level === 'Zimbabwe');
        } // World shows all
        
        // Text Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            zones = zones.filter(z => z.name.toLowerCase().includes(query) || z.level.toLowerCase().includes(query));
        }

        return zones.sort((a, b) => b.rides - a.rides);
    }, [searchQuery, scope, liveZones]);

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%', height, overflowY: 'auto', paddingBottom: 20 }}>
            
            {/* Search & Scope Toggle */}
            <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
                <Segmented
                    block
                    options={['World', 'Africa', 'Zimbabwe']}
                    value={scope}
                    onChange={(val: any) => setScope(val)}
                    style={{ marginBottom: 16, padding: 4, background: '#f1f5f9' }}
                />
                <Input.Search 
                    placeholder="Search zones..." 
                    allowClear
                    size="large"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="filled"
                />
            </div>

            {/* Results List */}
            <List
                itemLayout="vertical"
                dataSource={filteredZones}
                renderItem={zone => (
                    <Card 
                        size="small" 
                        style={{ marginBottom: 16, borderRadius: 12, borderColor: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}
                        hoverable
                        onClick={() => {
                            if (onSelectZone) onSelectZone(zone.id, zone.name, zone.lat, zone.lng);
                        }}
                        styles={{ body: { padding: '12px 16px' }}}
                    >
                        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                            <Col>
                                <Space orientation="vertical" size={0}>
                                    <Text strong style={{ fontSize: 16, color: '#0f172a' }}>{zone.name}</Text>
                                    <Space size={4}>
                                        <EnvironmentOutlined style={{ color: '#64748b', fontSize: 12 }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>Continent: {zone.level}</Text>
                                    </Space>
                                </Space>
                            </Col>
                            <Col>
                                <Tag color={zone.level === 'Zimbabwe' ? 'green' : zone.level === 'Africa' ? 'orange' : 'blue'} style={{ borderRadius: 12 }}>
                                    {zone.level === 'World' ? 'Global' : 'Regional'}
                                </Tag>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '8px 0', borderColor: '#f1f5f9' }} />

                        {/* Service Aggregates */}
                        <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                            <Col span={8}>
                                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 8, textAlign: 'center' }}>
                                    <CarOutlined style={{ color: '#3b82f6', marginBottom: 4 }} />
                                    <Text strong style={{ display: 'block', fontSize: 14 }}>{zone.rides.toLocaleString()}</Text>
                                    <Text type="secondary" style={{ fontSize: 10 }}>Rides</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ background: '#fff7ed', padding: '6px 8px', borderRadius: 8, textAlign: 'center' }}>
                                    <ThunderboltOutlined style={{ color: '#f97316', marginBottom: 4 }} />
                                    <Text strong style={{ display: 'block', fontSize: 14 }}>{zone.food.toLocaleString()}</Text>
                                    <Text type="secondary" style={{ fontSize: 10 }}>Food</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ background: '#fdf2f8', padding: '6px 8px', borderRadius: 8, textAlign: 'center' }}>
                                    <ShoppingCartOutlined style={{ color: '#ec4899', marginBottom: 4 }} />
                                    <Text strong style={{ display: 'block', fontSize: 14 }}>{zone.mart.toLocaleString()}</Text>
                                    <Text type="secondary" style={{ fontSize: 10 }}>Mart</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                )}
            />
        </Space>
    );
};
