import React from 'react';
import { 
    Typography, Row, Col, Select, Button, Space, Divider 
} from 'antd';
import { 
    GlobalOutlined, 
    SyncOutlined, 
    EnvironmentOutlined, 
    UnorderedListOutlined 
} from '@ant-design/icons';
import { LOCATION_DATA, SERVICE_TYPES } from '../mocks/heatmapMocks';

const { Title } = Typography;

interface HeatMapTopBarProps {
    selectedCountry: string;
    setSelectedCountry: (val: string) => void;
    selectedRegion: string;
    setSelectedRegion: (val: string) => void;
    selectedCity: string;
    setSelectedCity: (val: string) => void;
    service: string;
    setService: (val: string) => void;
    loading: boolean;
    handleRefresh: () => void;
    setIsZoneListVisible: (val: boolean) => void;
}

export const HeatMapTopBar: React.FC<HeatMapTopBarProps> = ({
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
    service,
    setService,
    loading,
    handleRefresh,
    setIsZoneListVisible
}) => {
    return (
        <Row justify="space-between" align="middle">
            <Col>
                <Space align="center" size="middle">
                    <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>Market Intensity Hub</Title>
                    <Divider orientation="vertical" />
                    <Space size="small" wrap>
                        <Select 
                            value={selectedCountry} 
                            style={{ width: 140 }} 
                            variant="borderless"
                            onChange={(val) => {
                                setSelectedCountry(val);
                                const firstRegion = Object.keys(LOCATION_DATA[val].regions)[0];
                                setSelectedRegion(firstRegion);
                                setSelectedCity(LOCATION_DATA[val].regions[firstRegion][0]);
                            }}
                            prefix={<GlobalOutlined style={{ color: '#3b82f6', marginRight: 8 }} />}
                        >
                            {Object.keys(LOCATION_DATA).map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                        </Select>
                        <Select 
                            value={selectedRegion} 
                            style={{ width: 140 }} 
                            variant="borderless"
                            onChange={(val) => {
                                setSelectedRegion(val);
                                setSelectedCity(LOCATION_DATA[selectedCountry].regions[val][0]);
                            }}
                        >
                            {Object.keys(LOCATION_DATA[selectedCountry].regions).map(r => <Select.Option key={r} value={r}>{r}</Select.Option>)}
                        </Select>
                        <Select 
                            value={selectedCity} 
                            style={{ width: 120 }} 
                            variant="borderless"
                            onChange={setSelectedCity}
                            suffixIcon={<EnvironmentOutlined />}
                        >
                            {LOCATION_DATA[selectedCountry].regions[selectedRegion].map((c: string) => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                        </Select>
                        <Divider orientation="vertical" />
                        <Select 
                            value={service} 
                            style={{ width: 180, fontWeight: 700 }} 
                            bordered={true}
                            className="premium-select-glow"
                            onChange={setService}
                        >
                            <Select.Option value="ALL">All Services Overview</Select.Option>
                            {SERVICE_TYPES.map(s => (
                                <Select.Option key={s.id} value={s.id}>
                                    <Space>{s.icon} {s.name}</Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Space>
                </Space>
            </Col>
            <Col>
                <Space>
                    <Button 
                        icon={<UnorderedListOutlined />} 
                        onClick={() => setIsZoneListVisible(true)}
                    >
                        Zone List
                    </Button>
                    <Button icon={<SyncOutlined spin={loading} />} onClick={handleRefresh} type="text">Scan AI Alpha</Button>
                </Space>
            </Col>
        </Row>
    );
};
