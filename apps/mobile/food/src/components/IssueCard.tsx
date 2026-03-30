import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

export interface Issue {
    id: string;
    type: 'missing_item' | 'late' | 'wrong_order' | 'refund' | 'complaint' | 'pickup_delay';
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'reviewing' | 'resolved' | 'escalated';
    created_at: string;
    resolution_notes?: string;
    orders: {
        customer_name: string;
        total_amount: number;
    };
}

const SEVERITY_COLORS = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
    critical: '#B71C1C',
};

const TYPE_LABELS = {
    missing_item: 'Missing Item',
    late: 'SLA Breach (Late)',
    wrong_order: 'Wrong Order',
    refund: 'Refund Request',
    complaint: 'Customer Complaint',
    pickup_delay: 'Pickup Delay Risk',
};

const TYPE_ICONS: Record<Issue['type'], keyof typeof Ionicons.prototype.name> = {
    missing_item: 'cube-outline',
    late: 'timer-outline',
    wrong_order: 'close-circle-outline',
    refund: 'cash-outline',
    complaint: 'chatbubble-outline',
    pickup_delay: 'car-outline',
};

export default function IssueCard({ issue }: { issue: Issue }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[issue.severity] }]}>
                    <Text style={styles.severityText}>{issue.severity.toUpperCase()}</Text>
                </View>
                <Text style={styles.date}>
                    {new Date(issue.created_at).toLocaleDateString()}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name={TYPE_ICONS[issue.type] as any} size={24} color="#FFFFFF" />
                <Text style={styles.type}>{TYPE_LABELS[issue.type]}</Text>
            </View>

            {issue.resolution_notes && (
                <Text style={styles.notes} numberOfLines={2}>{issue.resolution_notes}</Text>
            )}

            <View style={styles.orderInfo}>
                <Ionicons name="person-outline" size={16} color="#888" />
                <Text style={styles.customerName}>{issue.orders?.customer_name || 'Unknown Customer'}</Text>
                <Text style={styles.orderAmount}> • ${issue.orders?.total_amount.toFixed(2)}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: issue.status === 'open' ? '#F44336' : '#4CAF50' }]} />
                    <Text style={styles.statusText}>{issue.status.replace('_', ' ')}</Text>
                </View>
                <Pressable style={styles.detailLink}>
                    <Text style={styles.detailLinkText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={14} color="#2196F3" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    severityText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '600',
    },
    type: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    notes: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 12,
    },
    customerName: {
        fontSize: 15,
        color: '#8E8E93',
        marginLeft: 8,
        fontWeight: '600',
    },
    orderAmount: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    detailLink: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    detailLinkText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '700',
        marginRight: 4,
    },
});
