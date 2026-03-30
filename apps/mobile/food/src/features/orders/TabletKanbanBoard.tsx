import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { Text } from '../../../components/Themed';
import { useOrderStore, Order } from "../../store/useOrderStore";
import OrderCard from "../../components/OrderCard";
import { Colors } from "../../theme/colors";
import { useKeepAwake } from "expo-keep-awake";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import {
    GestureDetector,
    Gesture,
    GestureUpdateEvent,
    GestureStateChangeEvent,
    PanGestureHandlerEventPayload
} from "react-native-gesture-handler";
import { orderService } from "../../services/orderService";
import { useKitchenLoadPredictor } from "../../hooks/useKitchenLoadPredictor";
import { useReadyShelfMonitor } from "../../hooks/useReadyShelfMonitor";
import KitchenLoadCard from "../../components/KitchenLoadCard";
import ReadyShelfCard from "../../components/ReadyShelfCard";
import { useStoreContext } from "../../store/useStoreContext";

/**
 * Uber-Style Operational Kanban Board
 * High-density operational view for kitchen tablets.
 */
export default function TabletKanbanBoard() {
    useKeepAwake();
    const { width } = useWindowDimensions();
    const orders = useOrderStore((state) => state.orders);
    const { activeStoreId } = useStoreContext();

    const { newOrders, preparing, ready, completed } = useMemo(() => {
        return {
            newOrders: orders.filter((o) => o.status === "new"),
            preparing: orders.filter((o) => o.status === "in_progress"),
            ready: orders.filter((o) => o.status === "ready"),
            completed: orders.filter((o) => o.status === "completed"),
        };
    }, [orders]);

    const [metrics, setMetrics] = useState({
        orders_today: 0,
        total_revenue: 0,
        avg_prep_min: 0,
        live_issues: 0,
        new_count: 0,
        in_progress_count: 0,
        ready_count: 0,
        avg_ready_wait_min: 0
    });

    const prediction = useKitchenLoadPredictor(metrics);
    const monitor = useReadyShelfMonitor(metrics);

    useEffect(() => {
        if (activeStoreId) {
            const fetch = async () => {
                const data = await orderService.fetchStoreMetrics(activeStoreId);
                if (data) setMetrics(data);
            };
            fetch();
            const interval = setInterval(fetch, 15000); // 15s poll
            return () => clearInterval(interval);
        }
    }, [activeStoreId]);

    const columnWidth = width / 4;

    const handleDrop = async (orderId: string, externalId: string | undefined, x: number) => {
        const columnIndex = Math.floor(x / columnWidth);
        const statusMap: Record<number, Order['status']> = {
            0: 'new',
            1: 'in_progress',
            2: 'ready',
            3: 'completed'
        };

        const nextStatus = statusMap[columnIndex];
        if (nextStatus) {
            console.log(`[Kanban] Drop detected: Order ${orderId} -> ${nextStatus}`);
            await orderService.updateOrderStatus(orderId, nextStatus, externalId);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* 🧠 Kitchen Intelligence Hub */}
            <View style={styles.intelligenceHeader}>
                <View style={{ flex: 1 }}>
                    <KitchenLoadCard prediction={prediction} />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                    <ReadyShelfCard monitor={monitor} />
                </View>
            </View>

            <View style={styles.container}>
                <KanbanColumn
                    title="NEW ORDERS"
                    data={newOrders}
                    color={Colors.newOrder}
                    icon="flash-outline"
                    onDrop={handleDrop}
                    columnIndex={0}
                />
                <KanbanColumn
                    title="PREPARING"
                    data={preparing}
                    color={Colors.preparing}
                    icon="restaurant-outline"
                    onDrop={handleDrop}
                    columnIndex={1}
                />
                <KanbanColumn
                    title="READY"
                    data={ready}
                    color={Colors.ready}
                    icon="checkmark-circle-outline"
                    onDrop={handleDrop}
                    columnIndex={2}
                />
                <KanbanColumn
                    title="COMPLETED"
                    data={completed}
                    color={Colors.textMuted}
                    icon="archive-outline"
                    onDrop={handleDrop}
                    columnIndex={3}
                />
            </View>
        </View>
    );
}

const DraggableCard = ({ order, onDrop, columnIndex }: {
    order: Order,
    onDrop: (id: string, extId: string | undefined, x: number) => void,
    columnIndex: number
}) => {
    const isPressed = useSharedValue(false);
    const offset = useSharedValue({ x: 0, y: 0 });
    const screenWidth = useWindowDimensions().width;
    const colWidth = screenWidth / 4;

    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true;
        })
        .onChange((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
            offset.value = {
                x: event.translationX,
                y: event.translationY,
            };
        })
        .onEnd((event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
            const absoluteX = (columnIndex * colWidth) + event.translationX + (colWidth / 2);
            runOnJS(onDrop)(order.id, order.external_order_id, absoluteX);

            isPressed.value = false;
            offset.value = withSpring({ x: 0, y: 0 });
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value.x },
                { translateY: offset.value.y },
                { scale: withSpring(isPressed.value ? 1.05 : 1) },
            ],
            zIndex: isPressed.value ? 1000 : 1,
            opacity: isPressed.value ? 0.9 : 1,
            shadowOpacity: isPressed.value ? 0.3 : 0,
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={animatedStyle}>
                <OrderCard order={order} isTablet={true} />
            </Animated.View>
        </GestureDetector>
    );
};

const KanbanColumn = ({ title, data, color, icon, onDrop, columnIndex }: {
    title: string,
    data: any[],
    color: string,
    icon: any,
    onDrop: (id: string, extId: string | undefined, x: number) => void,
    columnIndex: number
}) => (
    <View style={styles.column}>
        <View style={[styles.columnHeader, { borderBottomColor: color }]}>
            <View style={styles.headerTitleRow}>
                <Ionicons name={icon} size={18} color={color} style={{ marginRight: 8 }} />
                <Text style={styles.columnTitle}>{title}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{data.length}</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.columnContent} showsVerticalScrollIndicator={false}>
            {data.map((order) => (
                <DraggableCard
                    key={order.id}
                    order={order}
                    onDrop={onDrop}
                    columnIndex={columnIndex}
                />
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Colors.background,
    },
    intelligenceHeader: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    column: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
    },
    columnHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: Colors.surface,
        borderBottomWidth: 3,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 13,
        fontWeight: "900",
        color: Colors.textPrimary,
        letterSpacing: 1.5,
    },
    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#000",
    },
    columnContent: {
        padding: 12,
        paddingBottom: 40,
        gap: 12,
    },
});
