import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Typography } from 'antd';
import { cn } from '../../utils/cn';

const { Title, Text } = Typography;

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12", className)}>
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className="p-3 bg-zinc-900 text-white rounded-xl shadow-md mt-1 transition-transform duration-300">
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                )}
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 500, letterSpacing: '-0.02em' }}>
                        {title}
                    </Title>
                    {description && (
                        <Text type="secondary" style={{ fontSize: '14px', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {description}
                        </Text>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-3 self-end md:self-center">
                    {actions}
                </div>
            )}
        </div>
    );
}
