import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SideMenu } from "../../src/components/SideMenu";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "../../src/lib/MapView";
import { useSavedPlacesStore } from "../../src/lib/store";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";
import { useSocketStore } from "../../src/lib/socketStore";

const { width, height } = Dimensions.get("window");

// Default Request for fallback
const DEFAULT_REQUEST = {
    id: "1",
    rider: { name: "Requesting...", rating: 5.0 },
    pickup: { title: "Pickup Location", subtitle: "Tap to view" },
    dropoff: { title: "Dropoff Location", subtitle: "Tap to view" },
    distance: "0 km",
    duration: "0 min",
    fare: "£0.00",
    vertical: "FOOD",
    instructions: "Standard pickup"
};

/*
- [x] Manual testing of pilot flow (Fixed navigation context crashes)
- [x] Resolved NativeWind interop issues with `SafeAreaView` and custom `Card` component
- [x] Optimized "View Request" layout for better fitting and safe area avoidance
*/

interface PilotStatusToggleProps {
    isOnline: boolean;
    onToggle: (value: boolean) => void;
}

const PilotStatusToggle = ({ isOnline, onToggle }: PilotStatusToggleProps) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [containerWidth, setContainerWidth] = useState(0);
    const progress = useSharedValue(isOnline ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isOnline ? 1 : 0, { damping: 20, stiffness: 120 });
    }, [isOnline]);

    const handleToggle = (value: boolean) => {
        if (value !== isOnline) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle(value);
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const padding = 4;
            const thumbWidth = (containerWidth - padding * 2) / 2;
            if (thumbWidth > 0) {
                const delta = event.translationX / thumbWidth;
                progress.value = Math.max(0, Math.min(1, (isOnline ? 1 : 0) + delta));
            }
        })
        .onEnd(() => {
            const newValue = progress.value > 0.5;
            progress.value = withSpring(newValue ? 1 : 0);
            runOnJS(handleToggle)(newValue);
        });

    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            runOnJS(handleToggle)(!isOnline);
        });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const thumbStyle = useAnimatedStyle(() => {
        const padding = 4;
        const thumbWidth = (containerWidth - padding * 2) / 2;
        return {
            transform: [{ translateX: progress.value * thumbWidth }],
            width: thumbWidth || '50%',
            opacity: containerWidth > 0 ? 1 : 0,
        };
    });

    const offlineTextStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                progress.value,
                [0, 1],
                ['#000000', isDark ? '#71717a' : '#a1a1aa']
            ),
            fontFamily: 'UberMoveBold',
        };
    });

    const onlineTextStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                progress.value,
                [0, 1],
                [isDark ? '#71717a' : '#a1a1aa', '#000000']
            ),
            fontFamily: 'UberMoveBold',
        };
    });

    const thumbColorStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                [isDark ? '#e4e4e7' : '#ffffff', '#00ff90']
            ),
        };
    });

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                style={[styles.toggleContainer, {
                    backgroundColor: isDark ? '#18181b' : '#f4f4f5',
                    borderColor: isDark ? '#27272a' : '#e4e4e7',
                    borderWidth: 1
                }]}
            >
                <Animated.View style={[
                    styles.toggleThumb,
                    thumbStyle,
                    thumbColorStyle,
                    {
                        shadowColor: '#000',
                        shadowOpacity: isDark ? 0.3 : 0.1,
                        shadowRadius: 4,
                        elevation: 3
                    }
                ]} />
                <View style={styles.toggleTextLayer}>
                    <View style={styles.toggleOption}>
                        <Animated.Text style={[styles.toggleText, offlineTextStyle]}>Offline</Animated.Text>
                    </View>
                    <View style={styles.toggleOption}>
                        <Animated.Text style={[styles.toggleText, onlineTextStyle]}>Online</Animated.Text>
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default function PilotHomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { setUserMode } = useSavedPlacesStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [todayEarnings, setTodayEarnings] = useState(127.50);
    const [todayTrips, setTodayTrips] = useState(8);
    
    // Real-time Socket Support
    const { socket, connect, disconnect } = useSocketStore();
    const [activeRequest, setActiveRequest] = useState<any>(null);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "45%"], []);

    // Radar pulse animation
    const radarScale = useSharedValue(1);
    const radarOpacity = useSharedValue(0.6);

    useEffect(() => {
        if (isOnline) {
            radarScale.value = withRepeat(
                withTiming(2.5, { duration: 2000, easing: Easing.out(Easing.ease) }),
                -1,
                false
            );
            radarOpacity.value = withRepeat(
                withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
                -1,
                false
            );

            // Real Socket Connection
            connect("pilot_001"); // In production, this would be the logged-in user's ID
            
            if (socket) {
                socket.on('delivery_request', (data) => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setActiveRequest({
                        id: data.attemptId,
                        rider: { name: data.vertical === 'DIRECT' ? 'Enterprise B2B' : 'Community Order', rating: 4.9 },
                        pickup: { title: data.pickup, subtitle: 'Tap to navigate' },
                        dropoff: { title: data.dropoff, subtitle: 'Destination' },
                        distance: data.distance,
                        duration: 'Calculating...', 
                        fare: `£${data.estimatedEarnings}`,
                        vertical: data.vertical,
                        instructions: data.instructions
                    });
                    setShowRequest(true);
                });
            }

            return () => {
                if (socket) socket.off('delivery_request');
            };
        } else {
            radarScale.value = 1;
            radarOpacity.value = 0;
            setShowRequest(false);
            setActiveRequest(null);
            disconnect();
        }
    }, [isOnline, socket]);

    const radarStyle = useAnimatedStyle(() => ({
        transform: [{ scale: radarScale.value }],
        opacity: radarOpacity.value,
    }));

    const [region] = useState({
        latitude: 51.5074,
        longitude: -0.1278,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
    });

    const handleViewRequest = () => {
        router.push({
            pathname: "/pilot/request-detail",
            params: { data: JSON.stringify(activeRequest) }
        } as any);
    };

    const handleToggleOnline = (value: boolean) => {
        setIsOnline(value);
        if (!value) {
            setShowRequest(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Map Background */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                region={region}
                customMapStyle={isDark ? darkMapStyle : mapStyle}
            >
                {/* Driver location marker */}
                <Marker coordinate={{ latitude: 51.5074, longitude: -0.1278 }}>
                    <View style={styles.markerContainer}>
                        {isOnline && (
                            <Animated.View
                                style={[
                                    styles.radarPulse,
                                    radarStyle
                                ]}
                            />
                        )}
                        <View style={[styles.carMarker, { borderColor: isDark ? '#18181b' : '#fff' }]}>
                            <Ionicons name="car" size={24} color="black" />
                        </View>
                    </View>
                </Marker>

                {/* Pickup indicator */}
                {showRequest && (
                    <Circle
                        center={{ latitude: 51.512, longitude: -0.135 }}
                        radius={200}
                        fillColor="rgba(0, 255, 144, 0.15)"
                        strokeColor="#00ff90"
                        strokeWidth={2}
                    />
                )}
            </MapView>

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => setIsMenuOpen(true)}
                        style={[styles.menuButton, { backgroundColor: isDark ? '#18181b' : '#fff' }]}
                    >
                        <Ionicons name="menu" size={24} color={isDark ? 'white' : 'black'} />
                    </TouchableOpacity>

                    <PilotStatusToggle isOnline={isOnline} onToggle={handleToggleOnline} />

                    <TouchableOpacity
                        onPress={() => router.push("/pilot/earnings" as any)}
                        style={[styles.earningsQuickView, { backgroundColor: isDark ? '#18181b' : '#fff' }]}
                    >
                        <Ionicons name="wallet-outline" size={18} color="#00ff90" />
                        <Text style={[styles.earningsText, { color: isDark ? '#fff' : '#18181b' }]}>
                            £{todayEarnings.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Ride Request Popup */}
            {showRequest && (
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                    style={styles.requestPopupContainer}
                >
                    <View style={[styles.requestPopup, { backgroundColor: isDark ? '#18181b' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <View style={styles.requestHeader}>
                            <View style={styles.riderInfo}>
                                <View style={styles.riderAvatarBox}>
                                    <Ionicons name="person" size={20} color="#00ff90" />
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.riderName, { color: isDark ? '#fff' : '#18181b' }]}>
                                            {(activeRequest || DEFAULT_REQUEST).rider.name}
                                        </Text>
                                        <View style={[styles.verticalBadge, { 
                                            backgroundColor: (activeRequest || DEFAULT_REQUEST).vertical === 'DIRECT' ? '#3b82f6' : '#00ff90' 
                                        }]}>
                                            <Text style={styles.verticalBadgeText}>
                                                {(activeRequest || DEFAULT_REQUEST).vertical}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Text style={styles.ratingValue}>{(activeRequest || DEFAULT_REQUEST).rider.rating}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fareInfo}>
                                <Text style={styles.fareValue}>{(activeRequest || DEFAULT_REQUEST).fare}</Text>
                                <Text style={styles.bonusLabel}>Instructions: {(activeRequest || DEFAULT_REQUEST).instructions}</Text>
                            </View>
                        </View>

                        <View style={styles.routePreview}>
                            <View style={styles.routeItem}>
                                <View style={styles.routeVisual}>
                                    <View style={styles.pickupDot} />
                                    <View style={[styles.routeLine, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]} />
                                </View>
                                <View style={styles.routeContent}>
                                    <Text style={styles.routeType}>Pickup</Text>
                                    <Text style={[styles.routeAddress, { color: isDark ? '#fff' : '#18181b' }]}>{(activeRequest || DEFAULT_REQUEST).pickup.title}</Text>
                                </View>
                            </View>
                            <View style={styles.routeItem}>
                                <View style={styles.routeVisual}>
                                    <View style={[styles.dropoffDot, { backgroundColor: isDark ? '#fff' : '#18181b' }]} />
                                </View>
                                <View style={styles.routeContent}>
                                    <Text style={styles.routeType}>Dropoff</Text>
                                    <Text style={[styles.routeAddress, { color: isDark ? '#fff' : '#18181b' }]}>{(activeRequest || DEFAULT_REQUEST).dropoff.title}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.requestStats, { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <View style={styles.statItem}>
                                <Ionicons name="navigate-outline" size={16} color="#adadad" />
                                <Text style={styles.statLabel}>Distance</Text>
                                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b' }]}>{(activeRequest || DEFAULT_REQUEST).distance}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="time-outline" size={16} color="#adadad" />
                                <Text style={styles.statLabel}>Duration</Text>
                                <Text style={[styles.statValue, { color: isDark ? '#fff' : '#18181b' }]}>Calculating...</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleViewRequest}
                            style={styles.viewRequestButton}
                        >
                            <Text style={styles.viewRequestText}>View Request</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: isDark ? '#18181b' : '#fff' }}
                handleIndicatorStyle={{ backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' }}
            >
                <BottomSheetView style={styles.bottomSheetContent}>
                    <Text style={styles.sectionHeader}>Today's Summary</Text>

                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryBox, { backgroundColor: isDark ? '#27272a' : '#fff', borderColor: isDark ? '#3f3f46' : '#f4f4f5' }]}>
                            <Ionicons name="wallet" size={24} color="#00ff90" />
                            <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#18181b' }]}>£{todayEarnings.toFixed(2)}</Text>
                            <Text style={styles.summaryLabel}>Earnings</Text>
                        </View>
                        <View style={[styles.summaryBox, { backgroundColor: isDark ? '#27272a' : '#fff', borderColor: isDark ? '#3f3f46' : '#f4f4f5' }]}>
                            <Ionicons name="car-sport" size={24} color="#00ff90" />
                            <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#18181b' }]}>{todayTrips}</Text>
                            <Text style={styles.summaryLabel}>Trips</Text>
                        </View>
                    </View>

                    <View style={[styles.statusBanner, { backgroundColor: isOnline ? 'rgba(0,255,144,0.1)' : (isDark ? '#27272a' : '#f4f4f5') }]}>
                        <View style={styles.statusBannerContent}>
                            <Ionicons
                                name={isOnline ? "radio-outline" : "moon-outline"}
                                size={20}
                                color={isOnline ? "#00ff90" : "#adadad"}
                            />
                            <Text style={[styles.statusBannerText, { color: isOnline ? '#00ff90' : (isDark ? '#a1a1aa' : '#71717a') }]}>
                                {isOnline
                                    ? "Searching for ride requests nearby..."
                                    : "Go online to start receiving ride requests"
                                }
                            </Text>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>

            {/* Side Menu */}
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toggleContainer: {
        width: 140,
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    toggleThumb: {
        position: 'absolute',
        top: 2,
        bottom: 2,
        left: 2,
        borderRadius: 18,
        elevation: 0,
    },
    toggleTextLayer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1,
    },
    toggleOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleText: {
        fontSize: 12, // Slightly larger
        fontFamily: 'UberMoveBold',
        // Removed textTransform: 'uppercase'
        letterSpacing: 0.5,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    radarPulse: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00ff90',
    },
    carMarker: {
        height: 56,
        width: 56,
        backgroundColor: '#00ff90',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    header: {
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
    menuButton: {
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
    statusText: {
        fontWeight: 'bold',
        marginRight: 12,
    },
    earningsQuickView: {
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    earningsText: {
        marginLeft: 8,
        fontWeight: 'bold',
    },
    requestPopupContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 280,
    },
    requestPopup: {
        padding: 20,
        borderRadius: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#00ff90',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    requestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    riderAvatarBox: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 255, 144, 0.2)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    riderName: {
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 12,
        color: '#71717a',
        marginLeft: 4,
    },
    statBox: {
        alignItems: 'flex-end',
    },
    fareValue: {
        fontSize: 24,
        fontFamily: 'UberMoveBold',
        color: '#00ff90',
    },
    bonusLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#3b82f6',
    },
    routePreview: {
        marginBottom: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'start',
    },
    routeVisual: {
        width: 20,
        alignItems: 'center',
        marginRight: 8,
    },
    pickupDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00ff90',
        marginTop: 4,
    },
    routeLine: {
        width: 2,
        height: 24,
        marginVertical: 4,
    },
    dropoffDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    routeContent: {
        flex: 1,
    },
    routeType: {
        fontSize: 10,
        color: '#71717a',
    },
    routeAddress: {
        fontWeight: '500',
    },
    requestStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: '#71717a',
        marginTop: 4,
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    viewRequestButton: {
        backgroundColor: '#00ff90',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    viewRequestText: {
        fontFamily: 'UberMoveBold',
        color: '#18181b',
        fontSize: 18,
    },
    bottomSheetContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    sectionHeader: {
        fontSize: 12,
        fontFamily: 'UberMoveBold',
        color: '#71717a',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    summaryBox: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryValue: {
        fontSize: 24,
        fontFamily: 'UberMoveBold',
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#71717a',
    },
    statusBanner: {
        padding: 16,
        borderRadius: 16,
    },
    statusBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBannerText: {
        marginLeft: 12,
        fontWeight: '500',
    },
    verticalBadge: {
        marginLeft: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    verticalBadgeText: {
        fontSize: 10,
        fontFamily: 'UberMoveBold',
        color: '#18181b',
    },
});
