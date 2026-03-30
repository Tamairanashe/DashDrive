import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const TableRowSkeleton: React.FC = () => (
    <tr className="animate-pulse border-b border-gray-100">
        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
        <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
        <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded-lg" /></td>
    </tr>
);

export const CardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
