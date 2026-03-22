import React from 'react';
import { Card, Typography, Space, Alert, Tag, Divider, Row } from 'antd';
import { ThunderboltOutlined, InfoCircleOutlined, CloudOutlined, FieldTimeOutlined, StopOutlined } from '@ant-design/icons';
import { Zone, EventCluster } from '../types';

const { Text, Title } = Typography;

interface AiRecommendationCardProps {
    selectedZone: Zone;
    traffic: any;
    weather: any;
    activeEvent?: EventCluster;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
    selectedZone,
    traffic,
    weather,
    activeEvent
}) => {
    // Basic recommendation logic based on environmental factors
    const generateRecommendation = () => {
        let recommendation = `Surge remains high due to ${traffic.level}. Market friction is up 40%. `;
        
        if (activeEvent) {
            recommendation += `Event Context: ${activeEvent.name} is driving ${activeEvent.impact} demand spikes. `;
        } else {
            recommendation += `Weather impact: ${weather.impact}. `;
        }
        
        recommendation += `Recommend $2.00 driver bonus for bypass routes to stabilize ETA.`;
        return recommendation;
    };

    return (
        <Card 
            title={<Space><ThunderboltOutlined style={{ color: '#eab308' }} /> <Text strong>AI Tactics Engine</Text></Space>}
            variant="borderless"
            className="shadow-sm"
            style={{ borderRadius: 12, marginTop: 16 }}
            styles={{ body: { padding: '16px' } }}
        >
            <Alert
                message="Tactical Insight"
                description={generateRecommendation()}
                type="warning"
                showIcon
                style={{ fontSize: '12px', padding: '12px', borderRadius: 8 }}
            />
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Title level={5}>Environmental Friction</Title>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Row justify="space-between">
                    <Text type="secondary"><CloudOutlined /> Weather impact</Text>
                    <Text type="success">{weather.impact}</Text>
                </Row>
                <Row justify="space-between">
                    <Text type="secondary"><StopOutlined /> Traffic impact</Text>
                    <Text type="danger">{traffic.impact}</Text>
                </Row>
                <Row justify="space-between">
                    <Text type="secondary"><InfoCircleOutlined /> Regional events</Text>
                    <Text type="warning">{activeEvent ? activeEvent.impact : 'Normal'}</Text>
                </Row>
            </Space>
        </Card>
    );
};
