import React from 'react';

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
    | 'ASSIGNED';

interface StatusBadgeProps {
    status: StatusType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const normalizedStatus = status.toUpperCase();

    const getStatusStyles = (s: string) => {
        switch (s) {
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'ACCEPTED':
            case 'ASSIGNED':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'PREPARING':
            case 'IN_TRANSIT':
                return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'READY':
            case 'PICKED_UP':
                return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'DELIVERED':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'REJECTED':
            case 'CANCELLED':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(normalizedStatus)}`}>
            {normalizedStatus.replace('_', ' ')}
        </span>
    );
};
