import React from 'react';
import { 
    Typography, Space, Tag, Badge, Divider, Select 
} from 'antd';
import { 
    CloudOutlined, 
    StopOutlined, 
    FieldTimeOutlined 
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface HeatMapFiltersSiderProps {
    weather: any;
    traffic: any;
    marketTemperament: any;
    enabledLayers: string[];
    setEnabledLayers: (val: string[]) => void;
}

export const HeatMapFiltersSider: React.FC<HeatMapFiltersSiderProps> = ({
    weather,
    traffic,
    marketTemperament,
    enabledLayers,
    setEnabledLayers
}) => {
    return (
        <Space size="large" wrap block style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space size="large" wrap>
                <Space>
                    <CloudOutlined style={{ color: '#0ea5e9' }} />
                    <Text strong>{weather.condition}</Text>
                    <Tag color="cyan" style={{ borderRadius: 4 }}>{weather.impact}</Tag>
                </Space>
                <Divider orientation="vertical" />
                <Space>
                    <StopOutlined style={{ color: '#ef4444' }} />
                    <Text strong>Traffic</Text>
                    <Tag color="error" style={{ borderRadius: 4 }}>{traffic.impact}</Tag>
                </Space>
                <Divider orientation="vertical" />
                <Space>
                    <FieldTimeOutlined style={{ color: '#f59e0b' }} />
                    <Text strong>{marketTemperament.label}</Text>
                    <Badge status="processing" text={marketTemperament.status} />
                </Space>
            </Space>
            <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>Visual Layers:</Text>
                <Select 
                    mode="multiple"
                    placeholder="Active Layers"
                    value={enabledLayers}
                    onChange={setEnabledLayers}
                    style={{ minWidth: 260 }}
                    maxTagCount="responsive"
                    size="middle"
                    className="premium-select"
                >
                    <Option value="demand">Market Demand</Option>
                    <Option value="supply">Driver Supply</Option>
                    <Option value="rain">Weather (Rain)</Option>
                    <Option value="traffic">Traffic (Jams)</Option>
                    <Option value="events">Local Events</Option>
                </Select>
            </Space>
        </Space>
    );
};
