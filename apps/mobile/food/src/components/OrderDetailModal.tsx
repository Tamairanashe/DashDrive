import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { orderService } from '../services/orderService';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    notes: string;
}

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    orderId: string;
    customerName: string;
}

export default function OrderDetailModal({ visible, onClose, orderId, customerName }: OrderDetailModalProps) {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible && orderId) {
            fetchItems();
        }
    }, [visible, orderId]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await orderService.fetchOrderItems(orderId);
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching order items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Order Items</Text>
                            <Text style={styles.subtitle}>{customerName}</Text>
                        </View>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#8E8E93" />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
                        ) : items.length === 0 ? (
                            <Text style={styles.emptyText}>No items listed for this order.</Text>
                        ) : (
                            items.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    <View style={styles.itemMain}>
                                        <View style={styles.quantityBadge}>
                                            <Text style={styles.quantityText}>{item.quantity}x</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                        </View>
                                    </View>
                                    {item.notes ? (
                                        <View style={styles.notesContainer}>
                                            <Ionicons name="information-circle-outline" size={14} color="#FF9500" />
                                            <Text style={styles.notesText}>{item.notes}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <Pressable style={styles.doneButton} onPress={onClose}>
                        <Text style={styles.doneButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '80%',
        minHeight: '40%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 4,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    itemRow: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    itemMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityBadge: {
        backgroundColor: Colors.primarySoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 12,
    },
    quantityText: {
        color: Colors.primary,
        fontWeight: '800',
        fontSize: 14,
    },
    itemName: {
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    notesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(255,149,0,0.1)',
        padding: 8,
        borderRadius: 8,
    },
    notesText: {
        color: '#FF9500',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    emptyText: {
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    doneButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    doneButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '700',
    },
});
