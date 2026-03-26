import React, { useState } from 'react';
import { 
    Card, Space, Typography, Button, 
    Divider, Row, Col, Tooltip, Badge 
} from 'antd';
import { 
    AppstoreOutlined, 
    GlobalOutlined, 
    CarOutlined, 
    NodeIndexOutlined, 
    TranslationOutlined,
    EnvironmentOutlined,
    CloseOutlined,
    DownOutlined,
    RightOutlined,
    DotChartOutlined,
    AreaChartOutlined,
    CloudOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface MapLayersControlProps {
    mapTypeId: string;
    setMapTypeId: (id: string) => void;
    enabledLayers: string[];
    setEnabledLayers: (layers: string[]) => void;
}

export const MapLayersControl: React.FC<MapLayersControlProps> = ({
    mapTypeId,
    setMapTypeId,
    enabledLayers,
    setEnabledLayers
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleLayer = (layer: string) => {
        if (enabledLayers.includes(layer)) {
            setEnabledLayers(enabledLayers.filter(l => l !== layer));
        } else {
            setEnabledLayers([...enabledLayers, layer]);
        }
    };

    const mapTypes = [
        { id: 'roadmap', label: 'Default', icon: <GlobalOutlined />, img: 'https://maps.gstatic.com/tactile/layerswitcher/images/roadmap.png' },
        { id: 'satellite', label: 'Satellite', icon: <AppstoreOutlined />, img: 'https://maps.gstatic.com/tactile/layerswitcher/images/satellite.png' },
        { id: 'terrain', label: 'Terrain', icon: <EnvironmentOutlined />, img: 'https://maps.gstatic.com/tactile/layerswitcher/images/terrain.png' }
    ];

    const mapDetails = [
        { id: 'traffic', label: 'Traffic', icon: <CarOutlined /> },
        { id: 'transit', label: 'Transit', icon: <NodeIndexOutlined /> },
        { id: 'biking', label: 'Biking', icon: <TranslationOutlined /> }
    ];

    const demandLayers = [
        { id: 'demand', label: 'Demand Heat', icon: <ThunderboltOutlined /> },
        { id: 'supply', label: 'Driver Supply', icon: <AreaChartOutlined /> },
        { id: 'rain', label: 'Weather', icon: <CloudOutlined /> },
        { id: 'events', label: 'Regional Events', icon: <DotChartOutlined /> }
    ];

    const currentType = mapTypes.find(t => t.id === mapTypeId) || mapTypes[0];
    const nextType = mapTypes[(mapTypes.indexOf(currentType) + 1) % mapTypes.length];

    return (
        <div 
            style={{ 
                position: 'absolute', bottom: 24, left: 24, zIndex: 1010,
                display: 'flex', alignItems: 'flex-end', gap: 12
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                if (!isExpanded) setIsHovered(false);
            }}
        >
            {/* Thumbnail Toggle */}
            <div 
                style={{
                    width: isHovered ? 80 : 64,
                    height: isHovered ? 80 : 64,
                    borderRadius: 12,
                    border: '2px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: `url(${nextType.img}) center/cover no-repeat`,
                    zIndex: 2
                }}
                onClick={() => setMapTypeId(nextType.id)}
            >
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.4)', color: 'white',
                    fontSize: 10, textAlign: 'center', padding: '2px 0',
                    fontWeight: 600
                }}>
                    {nextType.label}
                </div>
            </div>

            {/* Expand Button */}
            <Tooltip title="Layers" placement="right">
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={isExpanded ? <CloseOutlined /> : <AppstoreOutlined />}
                    size="large"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: '#1e293b', border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        opacity: isHovered || isExpanded ? 1 : 0.6,
                        transition: 'all 0.3s ease'
                    }}
                />
            </Tooltip>

            {/* Expanded Menu */}
            {isExpanded && (
                <Card 
                    style={{ 
                        position: 'absolute', bottom: 70, left: 0,
                        width: 320, background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)', borderRadius: '16px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)', border: '1px solid #f0f0f0',
                        overflow: 'hidden'
                    }}
                    styles={{ body: { padding: 16 } }}
                >
                    <div style={{ marginBottom: 16 }}>
                        <Title level={5} style={{ margin: 0, fontSize: '14px', marginBottom: 12 }}>Map details</Title>
                        <Row gutter={[12, 12]}>
                            {mapDetails.map(detail => (
                                <Col span={8} key={detail.id}>
                                    <div 
                                        onClick={() => toggleLayer(detail.id)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            cursor: 'pointer', padding: '8px', borderRadius: 8,
                                            background: enabledLayers.includes(detail.id) ? '#eff6ff' : 'transparent',
                                            transition: 'all 0.2s ease', border: `1px solid ${enabledLayers.includes(detail.id) ? '#3b82f6' : 'transparent'}`
                                        }}
                                    >
                                        <div style={{ 
                                            fontSize: 20, color: enabledLayers.includes(detail.id) ? '#3b82f6' : '#64748b' 
                                        }}>
                                            {detail.icon}
                                        </div>
                                        <Text style={{ 
                                            fontSize: 10, color: enabledLayers.includes(detail.id) ? '#3b82f6' : '#64748b',
                                            fontWeight: enabledLayers.includes(detail.id) ? 600 : 400
                                        }}>
                                            {detail.label}
                                        </Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div style={{ marginBottom: 16 }}>
                        <Title level={5} style={{ margin: 0, fontSize: '14px', marginBottom: 12 }}>Demand Intelligence</Title>
                        <Row gutter={[12, 12]}>
                            {demandLayers.map(layer => (
                                <Col span={6} key={layer.id}>
                                    <div 
                                        onClick={() => toggleLayer(layer.id)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            cursor: 'pointer', padding: '4px', borderRadius: 8,
                                            background: enabledLayers.includes(layer.id) ? '#f0fdf4' : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Badge dot={enabledLayers.includes(layer.id)} status="success">
                                            <div style={{ 
                                                fontSize: 18, color: enabledLayers.includes(layer.id) ? '#22c55e' : '#94a3b8' 
                                            }}>
                                                {layer.icon}
                                            </div>
                                        </Badge>
                                        <Text style={{ 
                                            fontSize: 9, color: enabledLayers.includes(layer.id) ? '#166534' : '#64748b',
                                            textAlign: 'center', lineHeight: '1.2'
                                        }}>
                                            {layer.label}
                                        </Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <Divider style={{ margin: '12px 0' }} />

                    <div>
                        <Title level={5} style={{ margin: 0, fontSize: '14px', marginBottom: 12 }}>Map type</Title>
                        <Row gutter={[12, 12]}>
                            {mapTypes.map(type => (
                                <Col span={8} key={type.id}>
                                    <div 
                                        onClick={() => setMapTypeId(type.id)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            cursor: 'pointer', padding: '4px', borderRadius: 8,
                                            border: `2px solid ${mapTypeId === type.id ? '#3b82f6' : '#f1f5f9'}`,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img src={type.img} style={{ width: '100%', height: 40, objectFit: 'cover', borderRadius: 4 }} alt={type.label} />
                                        <Text style={{ 
                                            fontSize: 10, color: mapTypeId === type.id ? '#3b82f6' : '#64748b',
                                            fontWeight: mapTypeId === type.id ? 600 : 400
                                        }}>
                                            {type.label}
                                        </Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card>
            )}
        </div>
    );
};
