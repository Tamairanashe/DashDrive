import React from "react";
import { Text, View, ViewProps } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps extends ViewProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export const Card = ({
    title,
    description,
    children,
    className,
    ...props
}: CardProps) => {
    return (
        <View
            className={cn(
                "rounded-3xl bg-white dark:bg-zinc-900 p-5 shadow-sm shadow-secondary/10 dark:shadow-none",
                className
            )}
            {...props}
        >
            {(title || description) && (
                <View className="mb-4">
                    {title && (
                        <Text className="text-xl font-uber-bold text-secondary dark:text-white">
                            {title}
                        </Text>
                    )}
                    {description && (
                        <Text className="text-sm font-uber-medium text-secondary/50 dark:text-zinc-400">
                            {description}
                        </Text>
                    )}
                </View>
            )}
            {children}
        </View>
    );
};
