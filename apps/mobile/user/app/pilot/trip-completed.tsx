import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock completed trip data
const TRIP_SUMMARY = {
    rider: { name: "Emma W." },
    fare: 28.50,
    tip: 5.00,
    distance: "18.5 km",
    duration: "32 min",
    pickup: "44 Warton Road, Stratford",
    dropoff: "Terminal 2, Heathrow Airport",
};

export default function TripCompletedScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [rating, setRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const totalEarnings = TRIP_SUMMARY.fare + TRIP_SUMMARY.tip;

    const handleRate = (stars: number) => {
        setRating(stars);
    };

    const handleSubmitRating = () => {
        setHasRated(true);
    };

    const handleFindNextRide = () => {
        router.replace("/pilot" as any);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
            >
                {/* Success Animation */}
                <Animated.View
                    entering={FadeInUp.duration(500)}
                    style={styles.header}
                >
                    <View style={styles.checkIconBox}>
                        <Ionicons name="checkmark" size={48} color="black" />
                    </View>
                    <Text style={[styles.headerText, { color: isDark ? '#fff' : '#18181b' }]}>Trip Completed!</Text>
                </Animated.View>

                {/* Earnings Card */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <View style={[styles.earningsCard, { backgroundColor: isDark ? 'rgba(0, 255, 144, 0.1)' : 'rgba(0, 255, 144, 0.05)', borderColor: 'rgba(0, 255, 144, 0.2)' }]}>
                        <Text style={[styles.earningsLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                            You earned
                        </Text>
                        <Text style={styles.earningsAmount}>
                            £{totalEarnings.toFixed(2)}
                        </Text>

                        <View style={[styles.earningsSplit, { borderTopColor: 'rgba(0, 255, 144, 0.2)' }]}>
                            <View style={styles.splitItem}>
                                <Text style={styles.splitLabel}>Fare</Text>
                                <Text style={[styles.splitValue, { color: isDark ? '#fff' : '#18181b' }]}>£{TRIP_SUMMARY.fare.toFixed(2)}</Text>
                            </View>
                            {TRIP_SUMMARY.tip > 0 && (
                                <View style={styles.splitItem}>
                                    <Text style={styles.splitLabel}>Tip</Text>
                                    <Text style={styles.tipValue}>+£{TRIP_SUMMARY.tip.toFixed(2)}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Animated.View>

                {/* Trip Details */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                    <View style={[styles.detailsCard, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <View style={styles.routePoint}>
                            <View style={styles.visualColumn}>
                                <View style={styles.dotPickup} />
                                <View style={[styles.dotLine, { backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }]} />
                            </View>
                            <Text style={[styles.routeText, { color: isDark ? '#fff' : '#18181b' }]}>{TRIP_SUMMARY.pickup}</Text>
                        </View>
                        <View style={styles.routePoint}>
                            <View style={styles.visualColumn}>
                                <View style={[styles.dotDropoff, { backgroundColor: isDark ? '#fff' : '#18181b' }]} />
                            </View>
                            <Text style={[styles.routeText, { color: isDark ? '#fff' : '#18181b' }]}>{TRIP_SUMMARY.dropoff}</Text>
                        </View>

                        <View style={[styles.summaryStats, { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <View style={styles.statRow}>
                                <Ionicons name="navigate-outline" size={16} color="#adadad" />
                                <Text style={[styles.summaryStatValue, { color: isDark ? '#fff' : '#18181b' }]}>{TRIP_SUMMARY.distance}</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Ionicons name="time-outline" size={16} color="#adadad" />
                                <Text style={[styles.summaryStatValue, { color: isDark ? '#fff' : '#18181b' }]}>{TRIP_SUMMARY.duration}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Rate Rider */}
                {!hasRated ? (
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <View style={[styles.rateCard, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Text style={[styles.rateTitle, { color: isDark ? '#fff' : '#18181b' }]}>
                                Rate {TRIP_SUMMARY.rider.name}
                            </Text>

                            <View style={styles.starRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleRate(star)}
                                        style={styles.starTouch}
                                    >
                                        <Ionicons
                                            name={rating >= star ? "star" : "star-outline"}
                                            size={36}
                                            color={rating >= star ? "#FFD700" : "#d4d4d8"}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {rating > 0 && (
                                <TouchableOpacity
                                    onPress={handleSubmitRating}
                                    style={[styles.submitRatingButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                                >
                                    <Text style={[styles.submitRatingText, { color: isDark ? '#fff' : '#18181b' }]}>Submit Rating</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInDown.duration(300)}>
                        <View style={styles.thanksBanner}>
                            <Ionicons name="checkmark-circle" size={20} color="#00ff90" />
                            <Text style={styles.thanksText}>Thanks for rating!</Text>
                        </View>
                    </Animated.View>
                )}

                {/* Actions */}
                <View style={styles.actionsBox}>
                    <TouchableOpacity
                        onPress={handleFindNextRide}
                        style={styles.primaryButton}
                    >
                        <Text style={styles.primaryButtonText}>Find Next Ride</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace("/pilot" as any)}
                        style={[styles.secondaryButton, { backgroundColor: isDark ? '#18181b' : '#f4f4f5' }]}
                    >
                        <Text style={[styles.secondaryButtonText, { color: isDark ? '#fff' : '#18181b' }]}>Go Offline</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    checkIconBox: {
        width: 96,
        height: 96,
        backgroundColor: '#00ff90',
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
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
    earningsSplit: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
    },
    splitItem: {
        alignItems: 'center',
    },
    splitLabel: {
        fontSize: 12,
        color: '#71717a',
    },
    splitValue: {
        fontWeight: 'bold',
    },
    tipValue: {
        fontWeight: 'bold',
        color: '#00ff90',
    },
    detailsCard: {
        padding: 16,
        marginBottom: 24,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    routePoint: {
        flexDirection: 'row',
        alignItems: 'start',
        marginBottom: 12,
    },
    visualColumn: {
        width: 20,
        alignItems: 'center',
        marginRight: 8,
    },
    dotPickup: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00ff90',
        marginTop: 4,
    },
    dotLine: {
        width: 2,
        height: 24,
        marginVertical: 4,
    },
    dotDropoff: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    routeText: {
        flex: 1,
        fontSize: 14,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryStatValue: {
        marginLeft: 4,
        fontWeight: '500',
    },
    rateCard: {
        padding: 20,
        marginBottom: 24,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    rateTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    starTouch: {
        marginHorizontal: 8,
    },
    submitRatingButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitRatingText: {
        fontWeight: '500',
    },
    thanksBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    thanksText: {
        marginLeft: 8,
        fontWeight: '500',
        color: '#00ff90',
    },
    actionsBox: {
        marginTop: 8,
    },
    primaryButton: {
        backgroundColor: '#00ff90',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
    },
    secondaryButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontWeight: '500',
    },
});
