import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock earnings data
const EARNINGS_DATA = {
    today: { amount: 127.50, trips: 8 },
    thisWeek: { amount: 842.30, trips: 42 },
    thisMonth: { amount: 3246.80, trips: 168 },
};

const RECENT_TRIPS = [
    { id: "1", time: "2:45 PM", from: "Stratford", to: "Heathrow", amount: 28.50 },
    { id: "2", time: "1:20 PM", from: "Canary Wharf", to: "Kings Cross", amount: 18.00 },
    { id: "3", time: "12:05 PM", from: "Greenwich", to: "Westminster", amount: 22.50 },
    { id: "4", time: "10:30 AM", from: "Shoreditch", to: "Camden", amount: 15.00 },
    { id: "5", time: "9:15 AM", from: "Brixton", to: "City of London", amount: 24.50 },
];

type Period = 'today' | 'thisWeek' | 'thisMonth';

export default function EarningsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');

    const isDark = colorScheme === 'dark';

    const periodLabels: Record<Period, string> = {
        today: 'Today',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
    };

    const currentData = EARNINGS_DATA[selectedPeriod];

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                backgroundColor: isDark ? '#000' : '#fff'
            }}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? '#18181b' : '#f4f4f5' }]}
                >
                    <Ionicons name="arrow-back" size={20} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Earnings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
                {/* Period Selector */}
                <View style={[styles.periodSelector, { backgroundColor: isDark ? '#18181b' : '#f4f4f5' }]}>
                    {(['today', 'thisWeek', 'thisMonth'] as Period[]).map((period) => (
                        <TouchableOpacity
                            key={period}
                            onPress={() => setSelectedPeriod(period)}
                            style={[
                                styles.periodTab,
                                selectedPeriod === period && {
                                    backgroundColor: isDark ? '#3f3f46' : '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.periodText,
                                    { color: selectedPeriod === period ? (isDark ? '#fff' : '#18181b') : (isDark ? '#71717a' : '#adadad') }
                                ]}
                            >
                                {periodLabels[period]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Main Earnings Card */}
                <View style={[
                    styles.earningsCard,
                    {
                        backgroundColor: isDark ? 'rgba(0, 255, 144, 0.1)' : 'rgba(0, 255, 144, 0.05)',
                        borderColor: 'rgba(0, 255, 144, 0.2)'
                    }
                ]}>
                    <Text style={[styles.earningsLabel, { color: isDark ? '#a1a1aa' : '#adadad' }]}>
                        {periodLabels[selectedPeriod]} Earnings
                    </Text>
                    <Text style={styles.earningsAmount}>
                        £{currentData.amount.toFixed(2)}
                    </Text>

                    <View style={[styles.statsRow, { borderTopColor: 'rgba(0, 255, 144, 0.2)' }]}>
                        <View style={styles.statItem}>
                            <Ionicons name="car-sport" size={24} color="#00ff90" />
                            <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b' }]}>
                                {currentData.trips}
                            </Text>
                            <Text style={styles.statLabel}>Trips</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="cash" size={24} color="#00ff90" />
                            <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b' }]}>
                                £{(currentData.amount / currentData.trips).toFixed(2)}
                            </Text>
                            <Text style={styles.statLabel}>Avg/Trip</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStatsRow}>
                    <View style={[styles.quickStatBox, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Ionicons name="time" size={20} color="#3b82f6" />
                        <Text style={[styles.quickStatValue, { color: isDark ? '#fff' : '#18181b' }]}>6.2h</Text>
                        <Text style={styles.quickStatLabel}>Online</Text>
                    </View>
                    <View style={[styles.quickStatBox, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Ionicons name="star" size={20} color="#FFD700" />
                        <Text style={[styles.quickStatValue, { color: isDark ? '#fff' : '#18181b' }]}>4.96</Text>
                        <Text style={styles.quickStatLabel}>Rating</Text>
                    </View>
                    <View style={[styles.quickStatBox, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Ionicons name="thumbs-up" size={20} color="#22c55e" />
                        <Text style={[styles.quickStatValue, { color: isDark ? '#fff' : '#18181b' }]}>98%</Text>
                        <Text style={styles.quickStatLabel}>Accept</Text>
                    </View>
                </View>

                {/* Recent Trips */}
                <Text style={[styles.sectionHeader, { color: isDark ? '#71717a' : '#adadad' }]}>
                    Recent Trips
                </Text>

                {RECENT_TRIPS.map((trip) => (
                    <View key={trip.id} style={[styles.tripCard, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <View style={styles.tripContent}>
                            <View style={styles.tripInfo}>
                                <View style={[styles.tripIconBox, { backgroundColor: 'rgba(0, 255, 144, 0.2)' }]}>
                                    <Ionicons name="car" size={18} color="#00ff90" />
                                </View>
                                <View>
                                    <Text style={[styles.tripRoute, { color: isDark ? '#fff' : '#18181b' }]}>
                                        {trip.from} → {trip.to}
                                    </Text>
                                    <Text style={styles.tripTime}>{trip.time}</Text>
                                </View>
                            </View>
                            <Text style={styles.tripAmount}>+£{trip.amount.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}

                {/* Cash Out Button */}
                <TouchableOpacity style={styles.cashOutButton}>
                    <Text style={styles.cashOutText}>Cash Out</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'between',
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 24,
    },
    backButton: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'System', // Adjust as needed
    },
    periodSelector: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 16,
        marginBottom: 24,
    },
    periodTab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    periodText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    earningsCard: {
        padding: 24,
        marginBottom: 24,
        borderRadius: 24,
        borderWidth: 1,
    },
    earningsLabel: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 8,
    },
    earningsAmount: {
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00ff90',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'around',
        paddingTop: 16,
        borderTopWidth: 1,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#71717a',
    },
    quickStatsRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 12,
    },
    quickStatBox: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
    },
    quickStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    quickStatLabel: {
        fontSize: 12,
        color: '#71717a',
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    tripCard: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 24,
        borderWidth: 1,
    },
    tripContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tripInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tripIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    tripRoute: {
        fontSize: 14,
        fontWeight: '500',
    },
    tripTime: {
        fontSize: 12,
        color: '#71717a',
    },
    tripAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00ff90',
    },
    cashOutButton: {
        backgroundColor: '#00ff90',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    cashOutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
    },
});
