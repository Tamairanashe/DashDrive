import React from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    View
} from "react-native";
import { cn } from "../../lib/utils";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
    textClassName?: string;
}

export const Input = ({
    label,
    error,
    icon,
    className,
    containerClassName,
    textClassName,
    ...props
}: InputProps) => {
    return (
        <View className={cn("mb-4", containerClassName)}>
            {label && (
                <Text className="mb-2 text-sm font-uber-medium text-accent-gray dark:text-zinc-500">
                    {label}
                </Text>
            )}
            <View
                className={cn(
                    "flex-row items-center rounded-2xl border-2 border-accent-light dark:border-zinc-800 bg-accent-light/30 dark:bg-zinc-800/50 px-4 py-4",
                    error && "border-red-500",
                    className
                )}
            >
                {icon && <View className="mr-3">{icon}</View>}
                <TextInput
                    className={cn(
                        "flex-1 text-base font-uber-medium text-black dark:text-white",
                        textClassName
                    )}
                    placeholderTextColor="#71717a"
                    {...props}
                />
            </View>
            {error && (
                <Text className="mt-1 text-xs font-uber-medium text-red-500">
                    {error}
                </Text>
            )}
        </View>
    );
};
