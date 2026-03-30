import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    textClassName?: string;
    icon?: React.ReactNode;
}

export const Button = ({
    label,
    variant = "primary",
    size = "md",
    loading = false,
    className,
    textClassName,
    icon,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary border-primary",
        secondary: "bg-secondary dark:bg-zinc-800 border-secondary dark:border-zinc-800",
        outline: "bg-transparent border-primary/50 dark:border-zinc-700",
        ghost: "bg-transparent border-transparent",
    };

    const sizes = {
        sm: "px-3 py-2",
        md: "px-6 py-4",
        lg: "px-8 py-5",
    };

    const textVariants = {
        primary: "text-secondary font-uber-bold",
        secondary: "text-primary dark:text-white font-uber-bold",
        outline: "text-primary font-uber-medium dark:text-zinc-300",
        ghost: "text-primary font-uber-medium dark:text-zinc-300",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled || loading}
            className={cn(
                "flex-row items-center justify-center rounded-2xl border-2",
                variants[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === "primary" ? "#000" : (variant === "secondary" ? "#00ff90" : "#00ff90")} />
            ) : (
                <View className="flex-row items-center">
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text
                        className={cn(
                            "text-center",
                            textVariants[variant],
                            textSizes[size],
                            textClassName
                        )}
                    >
                        {label}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
