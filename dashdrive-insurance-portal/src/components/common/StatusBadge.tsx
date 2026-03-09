import React from 'react';
import { Tag } from 'antd';

type StatusType =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'PREPARING'
    | 'READY'
    | 'PICKED_UP'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'IN_TRANSIT'
    | 'ASSIGNED'
    | 'ACTIVE'
    | 'INACTIVE'
    | 'EXPIRED'
    | 'FEATURED';

interface StatusBadgeProps {
    status: StatusType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const normalizedStatus = status.toUpperCase();

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'PENDING':
                return 'warning';
            case 'ACCEPTED':
            case 'ASSIGNED':
                return 'blue';
            case 'PREPARING':
            case 'IN_TRANSIT':
                return 'processing';
            case 'READY':
            case 'PICKED_UP':
                return 'purple';
            case 'DELIVERED':
            case 'ACTIVE':
            case 'FEATURED':
                return 'success';
            case 'REJECTED':
            case 'CANCELLED':
            case 'INACTIVE':
            case 'EXPIRED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Tag color={getStatusColor(normalizedStatus)} style={{ borderRadius: '6px', fontWeight: 600 }}>
            {normalizedStatus.replace('_', ' ')}
        </Tag>
    );
};
