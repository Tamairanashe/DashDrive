import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { Spacing } from '../../constants/Spacing';

export interface SectionProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Section = ({
    title,
    action,
    children,
    style,
}: SectionProps) => {
    return (
        <View style={[styles.container, style]}>
            {(title || action) && (
                <View style={styles.header}>
                    {title && (
                        <Text variant="title3" style={styles.title}>
                            {title}
                        </Text>
                    )}
                    {action}
                </View>
            )}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xs,
    },
    title: {
        fontWeight: '700',
    },
});
