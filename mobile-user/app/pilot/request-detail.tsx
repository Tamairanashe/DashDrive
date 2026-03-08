import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "../../src/lib/MapView";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";

// Mock fallback
const MOCK_REQUEST = {
    id: "1",
    rider: { name: "Emma W.", rating: 4.89, trips: 127 },
    pickup: { title: "44 Warton Road", subtitle: "Stratford, London", lat: 51.5385, lng: -0.0035 },
    dropoff: { title: "Terminal 2, Heathrow Airport", subtitle: "Hounslow", lat: 51.4700, lng: -0.4543 },
    distance: "18.5 km",
    duration: "32 min",
    fare: "£28.50",
    bonus: "£3.00",
    vertical: "FOOD",
    instructions: "Fragile items",
    expiresIn: 15
};

export default function RequestDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const requestData = useMemo(() => {
        if (params.data) {
            try {
                return JSON.parse(params.data as string);
            } catch (e) {
                return MOCK_REQUEST;
            }
        }
        return MOCK_REQUEST;
    }, [params.data]);

    const [timeLeft, setTimeLeft] = useState(requestData.expiresIn || 15);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            router.back();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Progress bar animation
    const progressWidth = useSharedValue(100);
    useEffect(() => {
        progressWidth.value = withTiming(0, {
            duration: (requestData.expiresIn || 15) * 1000,
            easing: Easing.linear,
        });
    }, []);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const handleAccept = () => {
        router.replace("/pilot/pickup-navigation" as any);
    };

    const handleDecline = () => {
        router.back();
    };

    // Route polyline coordinates
    const routeCoords = [
        { latitude: requestData.pickup.lat || 51.5385, longitude: requestData.pickup.lng || -0.0035 },
        { latitude: requestData.dropoff.lat || 51.47, longitude: requestData.dropoff.lng || -0.4543 },
    ];

    return (
        <View style={styles.container}>
            {/* Map Preview */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: 51.505,
                    longitude: -0.2,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                }}
                customMapStyle={isDark ? darkMapStyle : mapStyle}
            >
                <Marker coordinate={{ latitude: REQUEST.pickup.lat, longitude: REQUEST.pickup.lng }}>
                    <View style={styles.pickupMarker}>
                        <Ionicons name="location" size={16} color="black" />
                    </View>
                </Marker>

                <Marker coordinate={{ latitude: REQUEST.dropoff.lat, longitude: REQUEST.dropoff.lng }}>
                    <View style={styles.dropoffMarker}>
                        <Ionicons name="flag" size={14} color={isDark ? 'black' : 'white'} />
                    </View>
                </Marker>

                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#00ff90"
                    strokeWidth={4}
                />
            </MapView>

            {/* Header Overlay */}
            <View style={[styles.headerOverlay, { paddingTop: insets.top + 12 }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={handleDecline}
                        style={[styles.closeButton, { backgroundColor: isDark ? '#18181b' : '#fff' }]}
                    >
                        <Ionicons name="close" size={24} color={isDark ? 'white' : 'black'} />
                    </TouchableOpacity>

                    <View style={[styles.timerBadge, { backgroundColor: isDark ? '#18181b' : '#fff' }]}>
                        <Text style={[styles.timerText, timeLeft <= 5 && { color: '#ef4444' }, !isDark && timeLeft > 5 && { color: '#18181b' }, isDark && timeLeft > 5 && { color: '#fff' }]}>
                            {timeLeft}s
                        </Text>
                    </View>

                    <View style={{ width: 48 }} />
                </View>
            </View>

            {/* Request Details */}
            <View style={[styles.detailsCard, { backgroundColor: isDark ? '#18181b' : '#fff' }]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                >
                    {/* Timer Progress Bar */}
                    <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Animated.View
                            style={[
                                progressStyle,
                                styles.progressBarFill,
                                { backgroundColor: timeLeft <= 5 ? '#ef4444' : '#00ff90' }
                            ]}
                        />
                    </View>

                    {/* Fare */}
                    <View style={styles.fareSection}>
                        <Text style={[styles.fareAmount, { color: isDark ? '#fff' : '#18181b' }]}>{requestData.fare}</Text>
                        <View style={[styles.verticalBadge, { 
                            backgroundColor: requestData.vertical === 'DIRECT' ? '#3b82f6' : '#00ff90' 
                        }]}>
                            <Text style={styles.verticalBadgeText}>
                                {requestData.vertical || 'FOOD'} DELIVERY
                            </Text>
                        </View>
                    </View>

                    {/* Rider Info */}
                    <View style={[styles.infoBox, { backgroundColor: isDark ? '#27272a' : '#fff', borderColor: isDark ? '#3f3f46' : '#f4f4f5' }]}>
                        <View style={styles.riderRow}>
                            <View style={styles.avatarBox}>
                                <Ionicons name="person" size={24} color="#00ff90" />
                            </View>
                            <View>
                                <Text style={[styles.riderName, { color: isDark ? '#fff' : '#18181b' }]}>{requestData.rider.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#FFD700" />
                                    <Text style={styles.ratingValue}>{requestData.rider.rating}</Text>
                                    <Text style={styles.tripCount}>• {requestData.rider.trips || 0} trips</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Route Info */}
                    <View style={[styles.infoBox, { backgroundColor: isDark ? '#27272a' : '#fff', borderColor: isDark ? '#3f3f46' : '#f4f4f5' }]}>
                        <View style={styles.routeRow}>
                            <View style={styles.routeVisual}>
                                <View style={styles.dotPickup} />
                                <View style={[styles.dotLine, { backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }]} />
                            </View>
                            <View style={styles.routeText}>
                                <Text style={styles.routeType}>PICKUP</Text>
                                <Text style={[styles.routeTitle, { color: isDark ? '#fff' : '#18181b' }]}>{requestData.pickup.title}</Text>
                                <Text style={styles.routeSubtitle}>{requestData.pickup.subtitle}</Text>
                            </View>
                        </View>
                        <View style={styles.routeRow}>
                            <View style={styles.routeVisual}>
                                <View style={[styles.dotDropoff, { backgroundColor: isDark ? '#fff' : '#18181b' }]} />
                            </View>
                            <View style={styles.routeText}>
                                <Text style={styles.routeType}>DROPOFF</Text>
                                <Text style={[styles.routeTitle, { color: isDark ? '#fff' : '#18181b' }]}>{requestData.dropoff.title}</Text>
                                <Text style={styles.routeSubtitle}>{requestData.dropoff.subtitle}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Trip Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Ionicons name="navigate" size={20} color="#00ff90" />
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b' }]}>{requestData.distance}</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: isDark ? '#3f3f46' : '#f4f4f5' }]} />
                        <View style={styles.statBox}>
                            <Ionicons name="information-circle" size={20} color="#3b82f6" />
                            <Text style={styles.statLabel}>Notes</Text>
                            <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b', fontSize: 12 }]}>
                                {requestData.instructions || 'None'}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={handleDecline}
                            style={[styles.declineButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Text style={[styles.declineText, { color: isDark ? '#fff' : '#18181b' }]}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleAccept}
                            style={styles.acceptButton}
                        >
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        height: '35%',
    },
    pickupMarker: {
        height: 32,
        width: 32,
        backgroundColor: '#00ff90',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    dropoffMarker: {
        height: 32,
        width: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#18181b',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeButton: {
        height: 48,
        width: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    timerBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsCard: {
        flex: 1,
        marginTop: -32,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    progressBarBg: {
        height: 4,
        borderRadius: 2,
        marginBottom: 24,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    fareSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    fareAmount: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    bonusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    bonusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3b82f6',
        marginLeft: 4,
    },
    infoBox: {
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    riderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 255, 144, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    riderName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 14,
        marginLeft: 4,
        color: '#71717a',
    },
    tripCount: {
        fontSize: 14,
        marginLeft: 8,
        color: '#71717a',
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'start',
        marginBottom: 12, // Increased spacing
    },
    routeVisual: {
        width: 24,
        alignItems: 'center',
        marginRight: 12,
        marginTop: 4,
    },
    dotPickup: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00ff90',
    },
    dotLine: {
        width: 2,
        height: 32, // Adjusted length
        marginVertical: 4,
    },
    dotDropoff: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    routeText: {
        flex: 1,
    },
    routeType: {
        fontSize: 10,
        color: '#71717a',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    routeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    routeSubtitle: {
        fontSize: 13,
        color: '#71717a',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        marginBottom: 16,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#71717a',
        marginTop: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        width: 1,
        height: '100%',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    declineButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    declineText: {
        fontWeight: 'bold',
    },
    acceptButton: {
        flex: 2,
        backgroundColor: '#00ff90',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
    },
    verticalBadge: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    verticalBadgeText: {
        fontSize: 12,
        fontFamily: 'UberMoveBold',
        color: '#18181b',
    },
});
