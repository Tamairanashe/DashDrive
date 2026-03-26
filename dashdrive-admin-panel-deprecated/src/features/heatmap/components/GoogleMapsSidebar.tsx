import React from 'react';
import { Button, Tooltip, Space, Divider, Badge, Flex } from 'antd';
import { 
    MenuOutlined,
    ThunderboltOutlined,
    TeamOutlined,
    SwapOutlined,
    RiseOutlined,
    GlobalOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

interface GoogleMapsSidebarProps {
    enabledLayers: string[];
    setEnabledLayers: (layers: string[]) => void;
    mapTypeId: string;
    setMapTypeId: (id: string) => void;
    onMenuClick?: () => void;
    isMinimized?: boolean;
}

export const GoogleMapsSidebar: React.FC<GoogleMapsSidebarProps> = ({
    enabledLayers,
    setEnabledLayers,
    mapTypeId,
    setMapTypeId,
    onMenuClick,
    isMinimized = false
}) => {
    const toggleLayer = (layer: string) => {
        if (enabledLayers.includes(layer)) {
            setEnabledLayers(enabledLayers.filter(l => l !== layer));
        } else {
            setEnabledLayers([...enabledLayers, layer]);
        }
    };

    const isLayerEnabled = (layer: string) => enabledLayers.includes(layer);

    const SidebarButton = ({ 
        icon, 
        tooltip, 
        onClick, 
        active = false, 
        badge = false 
    }: { 
        icon: React.ReactNode, 
        tooltip: string, 
        onClick: () => void, 
        active?: boolean,
        badge?: boolean
    }) => (
        <Tooltip title={tooltip} placement="right">
            <Button
                type="text"
                icon={badge ? <Badge dot status="processing">{icon}</Badge> : icon}
                onClick={onClick}
                style={{
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    fontSize: 20,
                    color: active ? '#1a73e8' : '#5f6368',
                    background: active ? '#e8f0fe' : 'transparent',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    boxShadow: active ? '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)' : 'none'
                }}
                className={active ? 'sidebar-btn-active' : 'sidebar-btn'}
            />
        </Tooltip>
    );

    return (
        <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            bottom: isMinimized ? 'auto' : 16,
            width: 64,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 0',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: isMinimized ? '280px' : 'none',
            overflow: 'hidden'
        }}>
            <Flex vertical gap={isMinimized ? 8 : 16} align="center" style={{ width: '100%' }}>
                {/* Menu Button */}
                <SidebarButton 
                    icon={<MenuOutlined />} 
                    tooltip="Market Explorer" 
                    onClick={onMenuClick || (() => {})} 
                />
                
                <Divider style={{ margin: isMinimized ? '4px 0' : '8px 0', borderBlockStartColor: 'rgba(0,0,0,0.06)' }} />

                {/* Main Enterprise Layers */}
                <SidebarButton 
                    icon={<ThunderboltOutlined />} 
                    tooltip="Demand Intensity" 
                    onClick={() => toggleLayer('demand')}
                    active={isLayerEnabled('demand')}
                />
                
                <SidebarButton 
                    icon={<TeamOutlined />} 
                    tooltip="Active Supply" 
                    onClick={() => toggleLayer('supply')}
                    active={isLayerEnabled('supply')}
                />

                {!isMinimized && (
                    <>
                        <SidebarButton 
                            icon={<SwapOutlined />} 
                            tooltip="Market Imbalance" 
                            onClick={() => toggleLayer('imbalance')}
                            active={isLayerEnabled('imbalance')}
                            badge={isLayerEnabled('imbalance')} // Highlight if actively monitoring matrix
                        />

                        <SidebarButton 
                            icon={<RiseOutlined />} 
                            tooltip="Surge Multipliers" 
                            onClick={() => toggleLayer('surge')}
                            active={isLayerEnabled('surge')}
                        />
                    </>
                )}
            </Flex>

            {!isMinimized && (
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <Divider style={{ margin: '8px 0', borderBlockStartColor: 'rgba(0,0,0,0.06)' }} />
                    
                    {/* Map Type Toggle */}
                    <SidebarButton 
                        icon={mapTypeId === 'satellite' ? <GlobalOutlined /> : <AppstoreOutlined />} 
                        tooltip={mapTypeId === 'satellite' ? 'Default View' : 'Satellite View'} 
                        onClick={() => setMapTypeId(mapTypeId === 'satellite' ? 'roadmap' : 'satellite')}
                        active={mapTypeId === 'satellite'}
                    />

                    <div style={{ height: 8 }} />
                </div>
            )}

            <style>{`
                .sidebar-btn:hover {
                    background: #f1f3f4 !important;
                    color: #202124 !important;
                }
                .sidebar-btn-active:hover {
                    background: #d2e3fc !important;
                }
            `}</style>
        </div>
    );
};
