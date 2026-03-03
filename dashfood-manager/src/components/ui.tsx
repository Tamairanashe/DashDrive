import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ title, subtitle, headerAction, children, className, ...props }: any) => (
    <div className={cn("bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden", className)} {...props}>
        {(title || subtitle || headerAction) && (
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                <div>
                    {title && <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>}
                    {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
                </div>
                {headerAction}
            </div>
        )}
        <div className="p-6">{children}</div>
    </div>
);

export const Button = ({ variant = 'primary', size = 'md', className, children, ...props }: any) => {
    const variants: any = {
        primary: "bg-zinc-900 text-white hover:bg-zinc-800",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        outline: "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
        ghost: "text-zinc-600 hover:bg-zinc-100",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    };

    const sizes: any = {
        sm: "px-3 py-1.5 text-xs font-medium",
        md: "px-4 py-2 text-sm font-medium",
        lg: "px-6 py-3 text-base font-medium",
        icon: "p-2",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const Badge = ({ children, variant = 'neutral' }: any) => {
    const variants: any = {
        neutral: "bg-zinc-100 text-zinc-600",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        warning: "bg-amber-50 text-amber-700 border border-amber-100",
        error: "bg-red-50 text-red-700 border border-red-100",
        info: "bg-blue-50 text-blue-700 border border-blue-100",
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
            {children}
        </span>
    );
};
