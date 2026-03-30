import React from 'react';
import { 
    Typography, Space, Tag, Badge, Divider, Select 
} from 'antd';
import { 
    FieldTimeOutlined,
    SwapOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface HeatMapFiltersSiderProps {
    marketTemperament: { label: string, status: string };
    enabledLayers: string[];
    setEnabledLayers: (val: string[]) => void;
}

export const HeatMapFiltersSider: React.FC<HeatMapFiltersSiderProps> = ({
    marketTemperament,
    enabledLayers,
    setEnabledLayers
}) => {
    return (
        <Space size="large" wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space size="large" wrap>
                <Space>
                    <FieldTimeOutlined style={{ color: '#f59e0b' }} />
                    <Text strong>{marketTemperament.label}</Text>
                    <Badge status="processing" text={marketTemperament.status} />
                </Space>
                <Divider orientation="vertical" />
                <Space>
                    <SwapOutlined style={{ color: '#3b82f6' }} />
                    <Text strong>Imbalance Matrix</Text>
                    <Tag color="blue" style={{ borderRadius: 4 }}>Active</Tag>
                </Space>
                <Divider orientation="vertical" />
                <Space>
                    <ThunderboltOutlined style={{ color: '#ef4444' }} />
                    <Text strong>Surge Governance</Text>
                    <Tag color="red" style={{ borderRadius: 4 }}>Live</Tag>
                </Space>
            </Space>
            <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>Data Layers:</Text>
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
                    <Option value="demand">Demand Intensity</Option>
                    <Option value="supply">Active Supply (Drivers)</Option>
                    <Option value="imbalance">Market Imbalance</Option>
                    <Option value="surge">Surge Multipliers</Option>
                    <Option value="eta">Fulfillment ETA</Option>
                </Select>
            </Space>
        </Space>
    );
};
