import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

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
            <div className="flex items-start gap-5">
                {Icon && (
                    <div className="p-3.5 bg-gray-900 text-white rounded-[20px] shadow-xl shadow-gray-200 mt-0.5 group hover:scale-105 transition-transform duration-300">
                        <Icon size={26} strokeWidth={2.5} />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-[0.02em] uppercase leading-none">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm font-bold text-gray-400 mt-2.5 uppercase tracking-wider flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-blue-500" />
                            {description}
                        </p>
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
