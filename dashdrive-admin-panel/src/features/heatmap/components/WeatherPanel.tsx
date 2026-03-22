
import React from 'react';
import { Card, Typography, Space, Row, Col, Divider, Tag, Empty, Skeleton } from 'antd';
import { 
    CloudOutlined, 
    EnvironmentOutlined, 
    SafetyOutlined, 
    DashboardOutlined,
    HeatMapOutlined,
    EyeOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import { CurrentWeather, WeatherForecastDay, WeatherAlert } from '../types';

const { Text, Title } = Typography;

interface WeatherPanelProps {
    current: CurrentWeather | null;
    forecast: WeatherForecastDay[];
    alerts: WeatherAlert[];
    loading: boolean;
    isVisible: boolean;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({
    current,
    forecast,
    alerts,
    loading,
    isVisible
}) => {
    if (!isVisible) return null;

    const renderDetailCard = (title: string, value: string | number, icon: React.ReactNode, unit?: string, subtitle?: string) => (
        <Card size="small" variant="borderless" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>{title}</Text>
                <Space align="baseline">
                    <Title level={4} style={{ margin: 0, fontWeight: 600 }}>{value}</Title>
                    {unit && <Text style={{ fontSize: 11 }}>{unit}</Text>}
                </Space>
                {subtitle && <Text type="secondary" style={{ fontSize: 10 }}>{subtitle}</Text>}
            </Space>
        </Card>
    );

    const getIconUrl = (baseUri: string, isLight: boolean = true) => {
        return `${baseUri}${isLight ? '' : '_dark'}.svg`;
    };

    return (
        <div style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24, 
            width: 380, 
            zIndex: 45, 
            pointerEvents: 'auto' 
        }}>
            <Card 
                className="premium-weather-card shadow-lg"
                variant="borderless"
                style={{ 
                    borderRadius: 20, 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                styles={{ body: { padding: '24px' } }}
            >
                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                ) : current ? (
                    <>
                        {alerts.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                {alerts.map(alert => (
                                    <Tag key={alert.id} color="error" style={{ width: '100%', marginBottom: 8, padding: '8px 12px', borderRadius: 8, border: 'none' }}>
                                        <Space>
                                            <SafetyOutlined />
                                            <Text strong style={{ color: '#fff' }}>{alert.event}</Text>
                                        </Space>
                                    </Tag>
                                ))}
                            </div>
                        )}

                        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Title level={2} style={{ margin: 0, fontSize: 42, lineHeight: 1 }}>{Math.round(current.temperature.degrees || 0)}°C</Title>
                                    <Text strong>{current.condition.text}</Text>
                                    <Space size="small">
                                        <Text type="secondary">Feels like: {Math.round(current.feelsLike.degrees || 0)}°</Text>
                                        <Divider type="vertical" />
                                        <Text type="secondary">Humidity: {current.humidity}%</Text>
                                    </Space>
                                </Space>
                            </Col>
                            <Col>
                                <img 
                                    src={getIconUrl(current.condition.icon)} 
                                    alt={current.condition.text} 
                                    style={{ width: 80, height: 80 }} 
                                />
                            </Col>
                        </Row>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: 12,
                            marginBottom: 20 
                        }}>
                            {renderDetailCard('Wind', current.wind.speed.value || 0, null, 'km/h', current.wind.direction.cardinal)}
                            {renderDetailCard('Visibility', current.visibility.distance, null, 'km')}
                            {renderDetailCard('UV Index', current.uvIndex, null, '/ 11')}
                            {renderDetailCard('Pressure', current.pressure, null, 'hPa')}
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        <Title level={5} style={{ marginBottom: 16 }}>3-Day Forecast</Title>
                        <Row gutter={8}>
                            {forecast.map((day, idx) => (
                                <Col span={8} key={idx}>
                                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: 12, borderRadius: 12 }}>
                                        <Text type="secondary" style={{ fontSize: 11 }}>{idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Day After'}</Text>
                                        <div style={{ margin: '8px 0' }}>
                                            <img src={getIconUrl(day.dayCondition.icon)} alt={day.dayCondition.text} style={{ width: 32, height: 32 }} />
                                        </div>
                                        <Space size={4}>
                                            <Text strong>{Math.round(day.maxTemp.degrees || 0)}°</Text>
                                            <Text type="secondary" style={{ fontSize: 11 }}>{Math.round(day.minTemp.degrees || 0)}°</Text>
                                        </Space>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <Empty description="Weather data unavailable" />
                )}
            </Card>
        </div>
    );
};
