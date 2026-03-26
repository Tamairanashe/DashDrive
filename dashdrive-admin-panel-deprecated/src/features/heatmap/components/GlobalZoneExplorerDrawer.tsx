import React from 'react';
import { Drawer, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { ZoneTelemetryList } from './ZoneTelemetryList';

interface GlobalZoneExplorerDrawerProps {
    visible: boolean;
    onClose: () => void;
    onSelectZone?: (zoneId: string, zoneName: string, lat: number, lng: number) => void;
}

export const GlobalZoneExplorerDrawer: React.FC<GlobalZoneExplorerDrawerProps> = ({
    visible,
    onClose,
    onSelectZone
}) => {
    return (
        <Drawer
            title={
                <Space>
                    <GlobalOutlined style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: 600 }}>Global Market Explorer</span>
                </Space>
            }
            placement="left"
            width={480}
            onClose={onClose}
            open={visible}
            styles={{ body: { padding: '16px 20px', background: '#f8fafc' } }}
        >
            <ZoneTelemetryList onSelectZone={(id, name, lat, lng) => {
                if (onSelectZone) onSelectZone(id, name, lat, lng);
            }} />
        </Drawer>
    );
};
