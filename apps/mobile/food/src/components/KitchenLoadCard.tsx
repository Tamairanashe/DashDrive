import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

interface KitchenLoadCardProps {
    prediction: {
        loadScore: number;
        status: 'healthy' | 'busy' | 'overload';
        message: string;
    } | null;
}

/**
 * Enterprise Kitchen Load Dashboard Widget
 * Provides real-time operational intelligence to managers.
 */
export default function KitchenLoadCard({ prediction }: KitchenLoadCardProps) {
    if (!prediction) return null;

    const getStatusColor = () => {
        switch (prediction.status) {
            case 'overload': return '#FF3B30'; // System Red
            case 'busy': return '#FF9500';     // System Orange
            case 'healthy': return '#34C759';  // System Green
            default: return '#10B981';
        }
    };

    const getStatusIcon = () => {
        switch (prediction.status) {
            case 'overload': return 'alert-circle';
            case 'busy': return 'flame';
            case 'healthy': return 'checkmark-circle';
            default: return 'analytics';
        }
    };

    const color = getStatusColor();

    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="restaurant" size={18} color="#8E8E93" />
                    <Text style={styles.title}>Kitchen Intelligence</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={getStatusIcon() as any} size={12} color={color} />
                    <Text style={[styles.badgeText, { color }]}>{prediction.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.scoreSection}>
                    <Text style={styles.scoreLabel}>Load Score</Text>
                    <Text style={[styles.scoreValue, { color }]}>{prediction.loadScore}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.messageSection}>
                    <Text style={styles.message}>{prediction.message}</Text>
                    <Text style={styles.subMessage}>
                        {prediction.status === 'overload'
                            ? 'Recommendation: Pause incoming orders'
                            : 'Performance within SLA thresholds'}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreSection: {
        alignItems: 'center',
        paddingRight: 16,
    },
    scoreLabel: {
        fontSize: 10,
        color: '#8E8E93',
        fontWeight: '700',
        marginBottom: 2,
    },
    scoreValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 4,
    },
    messageSection: {
        flex: 1,
        paddingLeft: 12,
    },
    message: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subMessage: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '500',
    },
});
