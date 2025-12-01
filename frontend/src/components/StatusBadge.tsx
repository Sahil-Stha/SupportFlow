import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
    status: string;
    type?: 'ticket' | 'priority' | 'asset';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'ticket' }) => {
    let colors = 'bg-gray-100 text-gray-800';

    if (type === 'ticket') {
        switch (status) {
            case 'NEW': colors = 'bg-blue-100 text-blue-800'; break;
            case 'IN_PROGRESS': colors = 'bg-yellow-100 text-yellow-800'; break;
            case 'ON_HOLD': colors = 'bg-orange-100 text-orange-800'; break;
            case 'RESOLVED': colors = 'bg-green-100 text-green-800'; break;
            case 'CLOSED': colors = 'bg-gray-100 text-gray-800'; break;
        }
    } else if (type === 'priority') {
        switch (status) {
            case 'LOW': colors = 'bg-gray-100 text-gray-800'; break;
            case 'MEDIUM': colors = 'bg-blue-100 text-blue-800'; break;
            case 'HIGH': colors = 'bg-orange-100 text-orange-800'; break;
            case 'CRITICAL': colors = 'bg-red-100 text-red-800'; break;
        }
    } else if (type === 'asset') {
        switch (status) {
            case 'IN_STOCK': colors = 'bg-green-100 text-green-800'; break;
            case 'ASSIGNED': colors = 'bg-blue-100 text-blue-800'; break;
            case 'IN_REPAIR': colors = 'bg-yellow-100 text-yellow-800'; break;
            case 'RETIRED': colors = 'bg-red-100 text-red-800'; break;
        }
    }

    return (
        <span className={clsx('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', colors)}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default StatusBadge;
