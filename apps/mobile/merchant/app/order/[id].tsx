import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Linking, ActivityIndicator } from 'react-native';
import { Text, View, Card } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Phone, MapPin, ChevronLeft, CheckCircle2, Clock, Truck } from 'lucide-react-native';
import { format } from 'date-fns';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];
    const router = useRouter();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order details', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!order) return null;

    return (
        <ScrollView style={styles.container}>
            <RNView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <RNView style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Order #{order.orderNumber}</Text>
                    <Text style={styles.headerSubtitle}>{format(new Date(order.createdAt), 'MMM d, HH:mm')}</Text>
                </RNView>
                <RNView style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.statusText, { color: colors.primary }]}>{order.status}</Text>
                </RNView>
            </RNView>

            <RNView style={styles.content}>
                <Text style={styles.sectionTitle}>Items</Text>
                <Card style={styles.itemsCard}>
                    {order.items.map((item: any, index: number) => (
                        <RNView key={index} style={styles.itemRow}>
                            <RNView style={styles.itemMain}>
                                <Text style={styles.itemQty}>{item.quantity}x</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                            </RNView>
                            <Text style={styles.itemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
                        </RNView>
                    ))}
                    <RNView style={styles.separator} />
                    <RNView style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
                    </RNView>
                </Card>

                <Text style={styles.sectionTitle}>Customer Info</Text>
                <Card style={styles.infoCard}>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    <TouchableOpacity style={styles.actionRow} onPress={() => Linking.openURL(`tel:${order.customerPhone}`)}>
                        <Phone size={18} color={colors.primary} />
                        <Text style={styles.actionText}>{order.customerPhone}</Text>
                    </TouchableOpacity>
                    <RNView style={styles.actionRow}>
                        <MapPin size={18} color={colors.primary} />
                        <Text style={styles.actionText}>{order.deliveryAddress}</Text>
                    </RNView>
                </Card>

                {order.status === 'PENDING' && (
                    <RNView style={styles.actionButtonGroup}>
                        <TouchableOpacity
                            style={[styles.mainAction, { backgroundColor: colors.primary, flex: 2 }]}
                            onPress={() => updateStatus('CONFIRMED')}
                        >
                            <CheckCircle2 size={24} color="#fff" />
                            <Text style={styles.mainActionText}>Accept Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.mainAction, { backgroundColor: colors.error, flex: 1 }]}
                            onPress={() => updateStatus('CANCELLED')}
                        >
                            <Text style={styles.mainActionText}>Reject</Text>
                        </TouchableOpacity>
                    </RNView>
                )}

                {order.status === 'CONFIRMED' && (
                    <TouchableOpacity
                        style={[styles.mainAction, { backgroundColor: colors.primary }]}
                        onPress={() => updateStatus('PREPARING')}
                    >
                        <Clock size={24} color="#fff" />
                        <Text style={styles.mainActionText}>Start Preparing</Text>
                    </TouchableOpacity>
                )}

                {order.status === 'PREPARING' && (
                    <TouchableOpacity
                        style={[styles.mainAction, { backgroundColor: colors.primary }]}
                        onPress={() => updateStatus('READY')}
                    >
                        <CheckCircle2 size={24} color="#fff" />
                        <Text style={styles.mainActionText}>Mark as Ready</Text>
                    </TouchableOpacity>
                )}

                <RNView style={{ height: 40 }} />
            </RNView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 20,
    },
    itemsCard: {
        padding: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    itemMain: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: 'transparent',
    },
    itemQty: {
        fontWeight: 'bold',
        color: '#10B981',
    },
    itemName: {
        fontWeight: '500',
    },
    itemPrice: {
        color: '#94A3B8',
    },
    separator: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    infoCard: {
        padding: 16,
    },
    customerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    actionText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    mainAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
        marginTop: 32,
        gap: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    mainActionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionButtonGroup: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: 'transparent',
    },
});
