import React, { useState } from 'react';
import { 
    Card, Space, Typography, Select, 
    Slider, Divider, Row, Col, Segmented, Button, Tooltip 
} from 'antd';
import { 
    DashboardOutlined, 
    HistoryOutlined, 
    ControlOutlined,
    CloseOutlined,
    GlobalOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface UnifiedMapControlsProps {
    enabledLayers: string[];
    service: string;
    serviceColor?: string;
}

export const UnifiedMapControls: React.FC<UnifiedMapControlsProps> = ({
    enabledLayers,
    service,
    serviceColor = '#3b82f6'
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isExpanded) {
        return (
            <Tooltip title="Market Intelligence & Traffic Controls" placement="right">
                <Button 
                    type="primary" 
                    shape="circle" 
                    icon={<ControlOutlined />}
                    size="large"
                    onClick={() => setIsExpanded(true)}
                    style={{
                        position: 'absolute', bottom: 24, right: 64, zIndex: 1010,
                        background: '#1e293b', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                />
            </Tooltip>
        );
    }

    return (
        <Card 
            style={{ 
                position: 'absolute', bottom: 24, right: 64, zIndex: 1010,
                width: 320, background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)', borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)', border: '1px solid #f0f0f0',
                overflow: 'hidden'
            }}
            styles={{ body: { padding: 0 } }}
        >
            {/* Header */}
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <ControlOutlined style={{ color: '#3b82f6' }} />
                    <Title level={5} style={{ margin: 0, fontSize: '14px' }}>Map Intelligence</Title>
                </Space>
                <Button 
                    type="text" 
                    size="small" 
                    icon={<CloseOutlined style={{ fontSize: '12px' }} />} 
                    onClick={() => setIsExpanded(false)} 
                />
            </div>

            <div style={{ padding: '16px' }}>

                {/* Visual Intelligence Legend Section */}
                <div>
                    <Text strong style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: 12 }}>VISUAL LAYERS</Text>
                    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                        {enabledLayers.includes('demand') && (
                            <Row justify="space-between">
                                <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> <Text style={{ fontSize: '12px' }}>High Demand</Text></Space>
                                <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> <Text style={{ fontSize: '12px' }}>Stable</Text></Space>
                            </Row>
                        )}
                        {enabledLayers.includes('supply') && (
                            <Space><div style={{ width: 10, height: 4, borderRadius: '2px', background: '#3b82f6' }} /> <Text style={{ fontSize: '12px' }}>Driver Density</Text></Space>
                        )}
                        {enabledLayers.includes('rain') && (
                            <Space><div style={{ width: 10, height: 10, borderRadius: '2px', background: '#0ea5e9', opacity: 0.4 }} /> <Text style={{ fontSize: '12px' }}>Weather Clusters</Text></Space>
                        )}
                        {enabledLayers.includes('events') && (
                            <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} /> <Text style={{ fontSize: '12px' }}>Regional Events</Text></Space>
                        )}
                        {service !== 'ALL' && (
                            <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', border: `2px solid ${serviceColor}` }} /> <Text style={{ fontSize: '12px' }}>{service} Assets</Text></Space>
                        )}
                    </Space>
                    <Space style={{ marginTop: 12, padding: '8px', background: '#f8fafc', borderRadius: 8, width: '100%' }}>
                        <InfoCircleOutlined style={{ color: '#3b82f6', fontSize: '12px' }} />
                        <Text style={{ fontSize: '10px' }}>Layers automatically refresh every 60s.</Text>
                    </Space>
                </div>
            </div>
        </Card>
    );
};
