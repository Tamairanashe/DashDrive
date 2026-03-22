import React from 'react';
import { Typography, Space } from 'antd';

const { Text } = Typography;

export const HeatMapLegend: React.FC<{ enabledLayers: string[], service: string, serviceColor?: string }> = ({ 
    enabledLayers, 
    service, 
    serviceColor = '#3b82f6' 
}) => {
    return (
        <div style={{
            position: 'absolute', bottom: 24, left: 24, zIndex: 1000,
            background: 'rgba(255,255,255,0.9)', padding: '16px', borderRadius: 12, border: '1px solid #f0f0f0',
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)'
        }}>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>Visual Intelligence</Text>
            <Space direction="vertical" size={12}>
                {enabledLayers.includes('demand') && (
                    <>
                        <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', border: '2px solid rgba(239, 68, 68, 0.4)' }} /> <Text style={{ fontSize: 13 }}>High Demand (Red)</Text></Space>
                        <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e' }} /> <Text style={{ fontSize: 13 }}>Stable Market</Text></Space>
                    </>
                )}
                {enabledLayers.includes('supply') && (
                    <Space><div style={{ width: 14, height: 14, borderRadius: '2px', background: '#3b82f6' }} /> <Text style={{ fontSize: 13 }}>Driver Density</Text></Space>
                )}
                {enabledLayers.includes('rain') && (
                    <Space><div style={{ width: 14, height: 14, borderRadius: '2px', background: '#0ea5e9', opacity: 0.4 }} /> <Text style={{ fontSize: 13 }}>Rain Clusters (Sky Blue)</Text></Space>
                )}
                {enabledLayers.includes('traffic') && (
                    <Space><div style={{ width: 24, height: 4, borderRadius: '2px', background: '#ef4444' }} /> <Text style={{ fontSize: 13 }}>Traffic Gridlock (Red Line)</Text></Space>
                )}
                {enabledLayers.includes('events') && (
                    <Space><div className="pulse-marker" style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', border: '2px solid white' }} /> <Text style={{ fontSize: 13 }}>Local Events (Gold)</Text></Space>
                )}
                {service !== 'ALL' && (
                    <Space><div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', border: `2px solid ${serviceColor}` }} /> <Text style={{ fontSize: 13 }}>{service} Assets</Text></Space>
                )}
                <Space><div className="pulse-marker" style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', border: '2px solid white' }} /> <Text style={{ fontSize: 13 }}>Individual Demand Points</Text></Space>
            </Space>
        </div>
    );
};
