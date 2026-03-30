import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Alert } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '@/src/components/StatusBadge';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../store/useAuthStore';
import OrderDetailModal from './OrderDetailModal';

import SlaTimer from './SlaTimer';
import { Colors } from '../theme/colors';
import { usePrepTimer } from '../hooks/usePrepTimer';
import { useSLASettings } from "../store/useSLASettings";
import { usePickupDelayMonitor } from '../hooks/usePickupDelayMonitor';
// Note: In a production app, we'd pass the current load factor from the parent dashboard
// For this standalone card, we'll assume a moderate load factor of 1.2x if not provided
const MOCK_LOAD_FACTOR = 1.2;

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    id: string;
    external_order_id?: string;
    customer_name: string;
    status: string;
    total_amount: number;
    created_at: string;
    accepted_at?: string;
    ready_at?: string;
    items?: OrderItem[];
}

export default function OrderCard({ order, isTablet = false }: { order: Order; isTablet?: boolean }) {
    const [showDetails, setShowDetails] = useState(false);
    const { user, hasRole } = useAuthStore();

    const { warningMinutes, breachMinutes } = useSLASettings();
    const [prepMinutes, setPrepMinutes] = useState(0);

    // Predictive ETA Logic
    const avgPrep = 12; // Static fallback or derived from store metrics
    const expectedPrepMinutes = Math.round(avgPrep * MOCK_LOAD_FACTOR);
    const expectedReadyAt = new Date(new Date(order.created_at).getTime() + expectedPrepMinutes * 60000);
    const etaString = expectedReadyAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const pickup = usePickupDelayMonitor(order);

    useEffect(() => {
        // The usePrepTimer hook is called here to update the state variable
        const currentPrepTime = usePrepTimer(order.status, order.created_at, order.accepted_at);
        setPrepMinutes(currentPrepTime);
    }, [order.status, order.created_at, order.accepted_at]);

    const elapsedMinutes = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
    const isEscalated = (order.status !== 'completed' && order.status !== 'unfulfilled') && elapsedMinutes >= breachMinutes;

    const getNextAction = () => {
        switch (order.status) {
            case 'new': return 'ACCEPT';
            case 'in_progress': return 'MARK READY';
            case 'ready': return 'COMPLETE';
            default: return null;
        }
    };

    const handleAction = async () => {
        if (!user) return;

        let nextStatus: 'new' | 'in_progress' | 'ready' | 'completed' | 'unfulfilled' = 'new';
        if (order.status === 'new') nextStatus = 'in_progress';
        else if (order.status === 'in_progress') nextStatus = 'ready';
        else if (order.status === 'ready') nextStatus = 'completed';

        if (nextStatus !== 'new') {
            await orderService.updateOrderStatus(
                order.id,
                nextStatus,
                order.external_order_id,
                user.id
            );
        }
    };

    const isNew = order.status === 'new';

    return (
        <View style={[
            styles.container,
            isNew && styles.newOrderGlow,
            isTablet && styles.tabletContainer
        ]}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                            {isNew && <View style={styles.newPulse} />}
                        </View>
                        {order.status === 'in_progress' && (
                            <View style={styles.prepTimerContainer}>
                                <Ionicons name="restaurant-outline" size={12} color={Colors.preparing} />
                                <Text style={styles.prepTimerText}>{prepMinutes} min</Text>
                            </View>
                        )}
                        {order.status === 'new' && (
                            <View style={styles.etaContainer}>
                                <Ionicons name="time-outline" size={12} color="#8E8E93" />
                                <Text style={styles.etaText}>Exp. Ready {etaString}</Text>
                            </View>
                        )}
                        {order.status === 'ready' && pickup.delayed && (
                            <View style={[styles.delayBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                <Ionicons name="alert-circle" size={12} color="#EF4444" />
                                <Text style={[styles.delayBadgeText, { color: '#EF4444' }]}>Delayed ({pickup.minutes}m)</Text>
                            </View>
                        )}
                        {order.status === 'ready' && pickup.warning && (
                            <View style={[styles.delayBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                <Ionicons name="hourglass-outline" size={12} color="#F59E0B" />
                                <Text style={[styles.delayBadgeText, { color: '#F59E0B' }]}>Waiting ({pickup.minutes}m)</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text style={[styles.customerName, isTablet && styles.tabletCustomerName]}>
                            {order.customer_name}
                        </Text>
                        {isEscalated && (
                            <View style={styles.escalationBadge}>
                                <Text style={styles.escalationBadgeText}>🚨 ESCALATED</Text>
                            </View>
                        )}
                    </View>
                </View>
                {!isTablet && <StatusBadge status={order.status} />}
            </View>

            {order.items && order.items.length > 0 && (
                <View style={[styles.itemsPreview, isTablet && styles.tabletItemsPreview]}>
                    {order.items.slice(0, isTablet ? 5 : 2).map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        </View>
                    ))}
                    {order.items.length > (isTablet ? 5 : 2) && (
                        <Text style={styles.moreItems}>+ {order.items.length - (isTablet ? 5 : 2)} more items</Text>
                    )}
                </View>
            )}

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <SlaTimer createdAt={order.created_at} status={order.status} />
                </View>
                <View style={[styles.detailRow, { marginLeft: 'auto' }]}>
                    <Ionicons name="cash-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>${order.total_amount.toFixed(2)}</Text>
                </View>
            </View>

            {getNextAction() && (
                <Pressable
                    style={[
                        styles.button,
                        order.status === 'new' && styles.acceptButton,
                        order.status === 'in_progress' && styles.readyButton,
                        order.status === 'ready' && styles.completeButton,
                    ]}
                    onPress={handleAction}
                >
                    <Text style={[
                        styles.buttonText,
                        order.status === 'ready' && { color: '#000' }
                    ]}>
                        {getNextAction()}
                    </Text>
                </Pressable>
            )}

            <Pressable style={styles.detailsLink} onPress={() => setShowDetails(true)}>
                <Text style={styles.detailsLinkText}>Full Details</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </Pressable>

            <OrderDetailModal
                visible={showDetails}
                onClose={() => setShowDetails(false)}
                orderId={order.id}
                customerName={order.customer_name}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    tabletContainer: {
        padding: 14,
        marginBottom: 8,
    },
    newOrderGlow: {
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    newPulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 10,
        fontWeight: '900',
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    customerName: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    tabletCustomerName: {
        fontSize: 16,
    },
    details: {
        flexDirection: 'row',
        marginBottom: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8,
        padding: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginLeft: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButton: {
        backgroundColor: Colors.primary,
    },
    rejectButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.rejected,
    },
    readyButton: {
        backgroundColor: Colors.preparing,
    },
    completeButton: {
        backgroundColor: Colors.ready,
    },
    prepTimerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 150, 0, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    prepTimerText: {
        fontSize: 11,
        fontWeight: '900',
        color: Colors.preparing,
        marginLeft: 4,
    },
    etaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    etaText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8E8E93',
        marginLeft: 4,
        letterSpacing: 0.3,
    },
    escalationBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    escalationBadgeText: {
        color: '#EF4444',
        letterSpacing: 0.5,
    },
    delayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    delayBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    rejectButtonText: {
        color: Colors.rejected,
        fontWeight: '900',
        fontSize: 12,
    },
    itemsPreview: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    tabletItemsPreview: {
        padding: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 12,
        fontWeight: '900',
        color: Colors.primary,
        width: 24,
    },
    itemName: {
        fontSize: 13,
        color: Colors.textPrimary,
        fontWeight: '600',
        flex: 1,
    },
    moreItems: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginTop: 2,
        fontStyle: 'italic',
    },
    detailsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    detailsLinkText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        marginRight: 4,
    },
});
