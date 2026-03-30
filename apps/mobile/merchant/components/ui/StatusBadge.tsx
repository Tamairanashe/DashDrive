import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'CANCELLED' | 'DELIVERED' | 'PICKED_UP';

interface StatusBadgeProps {
    status: OrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];
    const normalizedStatus = status.toUpperCase();

    const getColors = () => {
        switch (normalizedStatus) {
            case 'PENDING':
                return { bg: colors.warning + '20', text: colors.warning };
            case 'PREPARING':
                return { bg: colors.info + '20', text: colors.info };
            case 'READY':
                return { bg: colors.primary + '20', text: colors.primary };
            case 'CANCELLED':
                return { bg: colors.error + '20', text: colors.error };
            case 'PICKED_UP':
            case 'DELIVERED':
                return { bg: '#8B5CF620', text: '#8B5CF6' };
            default:
                return { bg: '#94A3B820', text: '#94A3B8' };
        }
    };

    const { bg, text } = getColors();

    return (
        <RNView style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.text, { color: text }]}>{normalizedStatus.replace('_', ' ')}</Text>
        </RNView>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
