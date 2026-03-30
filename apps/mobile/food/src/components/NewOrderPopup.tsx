import React from 'react';
import { StyleSheet, View, Modal, Pressable, Vibration } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useOrderStore, Order } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { orderService } from '../services/orderService';
import { Colors } from '../theme/colors';

export default function NewOrderPopup() {
    const { incomingOrder, setIncomingOrder } = useOrderStore();
    const { user } = useAuthStore();

    if (!incomingOrder) return null;

    const handleAccept = async () => {
        if (!user) return;
        try {
            await orderService.updateOrderStatus(
                incomingOrder.id,
                'in_progress',
                incomingOrder.external_order_id,
                user.id
            );
            setIncomingOrder(null);
        } catch (error) {
            console.error("Error accepting order:", error);
        }
    };

    const handleDismiss = () => {
        setIncomingOrder(null);
    };

    return (
        <Modal
            visible={!!incomingOrder}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>NEW ORDER</Text>
                    </View>

                    <Text style={styles.customerName}>{incomingOrder.customer_name}</Text>
                    <Text style={styles.orderId}>#{incomingOrder.id.slice(0, 8).toUpperCase()}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                            <Text style={styles.statValue}>${incomingOrder.total_amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="time-outline" size={20} color={Colors.primary} />
                            <Text style={styles.statValue}>0:00</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.actionRow}>
                        <Pressable
                            style={[styles.button, styles.dismissButton]}
                            onPress={handleDismiss}
                        >
                            <Text style={styles.dismissText}>DISMISS</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.acceptButton]}
                            onPress={handleAccept}
                        >
                            <Text style={styles.acceptText}>ACCEPT</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 10,
    },
    badge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 24,
    },
    badgeText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    customerName: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 32,
        textTransform: 'uppercase',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 40,
        marginBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 20,
        borderRadius: 16,
        width: '100%',
        justifyContent: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 32,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    acceptButton: {
        backgroundColor: Colors.primary,
    },
    dismissText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    acceptText: {
        color: '#000',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
