import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

interface ReadyShelfCardProps {
    monitor: {
        status: 'normal' | 'building' | 'congested' | 'critical';
        message: string;
        readyCount: number;
        avgWaitMin: number;
        bottleneck: 'logistics' | 'kitchen';
    } | null;
}

/**
 * Enterprise Ready Shelf Monitor Card
 * Visualizes logistics friction and congestion risks.
 */
export default function ReadyShelfCard({ monitor }: ReadyShelfCardProps) {
    if (!monitor) return null;

    const getStatusColor = () => {
        switch (monitor.status) {
            case 'critical': return '#EF4444';
            case 'congested': return '#F59E0B';
            case 'building': return '#FBBF24';
            default: return '#10B981';
        }
    };

    const getStatusIcon = () => {
        switch (monitor.status) {
            case 'critical': return 'warning';
            case 'congested': return 'alert-circle';
            case 'building': return 'layers';
            default: return 'checkmark-done-circle';
        }
    };

    const color = getStatusColor();

    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="archive" size={18} color="#8E8E93" />
                    <Text style={styles.title}>Ready Shelf Monitor</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
                    <Text style={[styles.badgeText, { color }]}>{monitor.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.statSection}>
                    <Text style={styles.statValue}>{monitor.readyCount}</Text>
                    <Text style={styles.statLabel}>READY</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statSection}>
                    <Text style={[styles.statValue, { color: monitor.avgWaitMin > 10 ? '#FF9500' : '#FFFFFF' }]}>
                        {monitor.avgWaitMin}m
                    </Text>
                    <Text style={styles.statLabel}>SHELF TIME</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                    <Text style={styles.message}>{monitor.message}</Text>
                    <View style={styles.diagnosisRow}>
                        <Text style={styles.diagnosisLabel}>DIAGNOSIS:</Text>
                        <View style={[styles.diagnosisBadge, { backgroundColor: monitor.bottleneck === 'logistics' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 144, 0.1)' }]}>
                            <Text style={[styles.diagnosisText, { color: monitor.bottleneck === 'logistics' ? '#EF4444' : '#00ff90' }]}>
                                {monitor.bottleneck === 'logistics' ? 'LOGISTICS FRICTION' : 'KITCHEN VOLUME'}
                            </Text>
                        </View>
                    </View>
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statSection: {
        alignItems: 'center',
        paddingRight: 16,
        minWidth: 60,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 10,
        color: '#8E8E93',
        fontWeight: '800',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoSection: {
        flex: 1,
        paddingLeft: 16,
    },
    message: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    diagnosisRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    diagnosisLabel: {
        fontSize: 10,
        color: '#8E8E93',
        fontWeight: '800',
    },
    diagnosisBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    diagnosisText: {
        fontSize: 9,
        fontWeight: '900',
    },
});
