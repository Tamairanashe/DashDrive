import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface KPIWidgetProps {
    label: string;
    value: string;
    trend: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export default function KPIWidget({ label, value, trend, icon, color }: KPIWidgetProps) {
    const isPositive = trend.startsWith('+');
    const isNeutral = !trend.startsWith('+') && !trend.startsWith('-');

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
                <View style={styles.trendContainer}>
                    <Text style={[
                        styles.trend,
                        { color: isPositive ? Colors.primary : isNeutral ? Colors.textSecondary : Colors.rejected }
                    ]}>
                        {trend}
                    </Text>
                    <Text style={styles.trendLabel}> vs yesterday</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    content: {
        flexDirection: 'column',
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trend: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    trendLabel: {
        fontSize: 11,
        color: Colors.textMuted,
        marginLeft: 4,
    },
});
