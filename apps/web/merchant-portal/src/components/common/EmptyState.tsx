import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
            <div className="bg-gray-50 p-4 rounded-full mb-6">
                {icon || (
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-8">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
