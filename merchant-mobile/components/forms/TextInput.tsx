import React, { useState } from 'react';
import {
    View,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { Text } from '../ui/Text';
import { ErrorMessage } from '../feedback/ErrorMessage';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Typography } from '../../constants/Typography';

export interface TextInputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export const TextInput = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    onFocus,
    onBlur,
    style,
    ...props
}: TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label && (
                <Text variant="bodySmall" style={[styles.label, { color: colors.text }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.card,
                        borderColor: getBorderColor(),
                    }
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                <RNTextInput
                    style={[
                        styles.input,
                        { color: colors.text, ...Typography.bodyMedium },
                        style
                    ]}
                    placeholderTextColor={theme === 'light' ? '#94A3B8' : '#475569'}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
            {error && <ErrorMessage message={error} />}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.md,
    },
    label: {
        marginBottom: Spacing.xs,
        fontWeight: '600',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: Radius.md,
        minHeight: 48,
        paddingHorizontal: Spacing.md,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.sm,
    },
    leftIcon: {
        marginRight: Spacing.sm,
    },
    rightIcon: {
        marginLeft: Spacing.sm,
    },
});
