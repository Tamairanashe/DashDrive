import React, { useMemo } from 'react';
import { OverlayViewF, OverlayView } from '@react-google-maps/api';

interface AdvancedZoneMarkerProps {
    position: google.maps.LatLngLiteral;
    title: string;
    type: 'driver' | 'order' | 'hub' | 'critical';
    status?: string;
    onClick?: () => void;
}

/**
 * A high-fidelity marker component using Google Maps Advanced Markers.
 * Inspired by premium marketplace designs (Uber/Lyft).
 */
export const AdvancedZoneMarker: React.FC<AdvancedZoneMarkerProps> = ({
    position,
    title,
    type,
    status,
    onClick
}) => {
    // Custom SVG string for the marker glyph
    const getGlyphSvg = (markerType: string) => {
        switch (markerType) {
            case 'driver':
                return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.92 6.01L18.72 5.42C18.45 4.61 17.69 4 16.82 4H7.17C6.3 4 5.54 4.61 5.28 5.41L5.08 6.01C4.42 8.01 4 10.01 4 12V20C4 21.1 4.9 22 6 22H7C8.1 22 9 21.1 9 20V19H15V20C15 21.1 15.9 22 17 22H18C19.1 22 20 21.1 20 20V12C20 10.01 19.58 8.01 18.92 6.01ZM6.85 7H17.14L17.47 8H6.52L6.85 7ZM18 17H6V12.65C6 12.65 6 12.65 6.01 12.65H17.99C17.99 12.65 18 12.65 18 12.65V17ZM9.5 15C9.5 15.83 8.83 16.5 8 16.5C7.17 16.5 6.5 15.83 6.5 15C6.5 14.17 7.17 13.5 8 13.5C8.83 13.5 9.5 14.17 9.5 15ZM17.5 15C17.5 15.83 16.83 16.5 16 16.5C15.17 16.5 14.5 15.83 14.5 15C14.5 14.17 15.17 13.5 16 13.5C16.83 13.5 17.5 14.17 17.5 15Z" fill="white"/></svg>';
            case 'order':
                return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/></svg>';
            default:
                return '<circle cx="12" cy="12" r="8" fill="white"/>';
        }
    };

    const getMarkerColors = (markerType: string) => {
        switch (markerType) {
            case 'driver':
                return { background: '#3b82f6', border: '#1d4ed8' };
            case 'order':
                return { background: '#f59e0b', border: '#d97706' };
            case 'critical':
                return { background: '#ef4444', border: '#b91c1c' };
            default:
                return { background: '#64748b', border: '#475569' };
        }
    };

    const { background, border } = useMemo(() => getMarkerColors(type), [type]);

    return (
        <OverlayViewF 
            position={position} 
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div 
                style={{ 
                    position: 'absolute', 
                    transform: 'translate(-50%, -100%)',
                    cursor: 'pointer',
                    zIndex: type === 'critical' || status === 'critical' ? 100 : 10
                }}
                onClick={onClick}
                title={title}
            >
                <div 
                    className={`advanced-marker-pin ${type === 'critical' || status === 'critical' ? 'marker-pulse' : ''}`}
                    style={{ 
                        backgroundColor: background, 
                        borderColor: border
                    }}
                >
                    <div 
                        className="glyph-container"
                        style={{ width: 22, height: 22 }}
                        dangerouslySetInnerHTML={{ __html: getGlyphSvg(type) }} 
                    />
                </div>
                {/* Visual Label for high-fidelity feel */}
                {(status === 'busy' || type === 'critical') && (
                    <div style={{ 
                        position: 'absolute', 
                        top: -25, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                    }}>
                        {status?.toUpperCase() || type.toUpperCase()}
                    </div>
                )}
            </div>
        </OverlayViewF>
    );
};
