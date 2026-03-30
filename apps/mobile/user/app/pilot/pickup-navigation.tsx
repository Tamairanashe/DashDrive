import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "../../src/lib/MapView";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";

// Mock data
const TRIP = {
    rider: { name: "Emma W." },
    pickup: { lat: 51.5385, lng: -0.0035, address: "44 Warton Road" },
    eta: "4 min",
    distance: "1.2 km",
};

export default function PickupNavigationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleArrived = () => {
        router.replace("/pilot/trip-active" as any);
    };

    const handleCancel = () => {
        router.replace("/pilot" as any);
    };

    return (
        <View style={styles.container}>
            {/* Map Navigation */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: 51.53,
                    longitude: -0.05,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                customMapStyle={isDark ? darkMapStyle : mapStyle}
            >
                <Marker coordinate={{ latitude: 51.52, longitude: -0.08 }}>
                    <View style={styles.carMarker}>
                        <Ionicons name="car" size={20} color="white" />
                    </View>
                </Marker>
                <Marker coordinate={{ latitude: TRIP.pickup.lat, longitude: TRIP.pickup.lng }}>
                    <View style={styles.personMarker}>
                        <Ionicons name="person" size={20} color="black" />
                    </View>
                </Marker>
            </MapView>

            {/* Navigation Overlay */}
            <View style={[styles.navOverlay, { paddingTop: insets.top + 12 }]}>
                <View style={[styles.navBanner, { backgroundColor: '#18181b' }]}>
                    <View style={styles.navInfo}>
                        <View style={styles.navIconBox}>
                            <Ionicons name="navigate" size={20} color="#00ff90" />
                        </View>
                        <View>
                            <Text style={styles.navInstruction}>Head North on Warton Rd</Text>
                            <Text style={styles.navDistance}>400 meters</Text>
                        </View>
                    </View>
                    <View style={styles.navEtaBox}>
                        <Text style={styles.navEtaText}>{TRIP.eta}</Text>
                        <Text style={styles.navEtaSubtext}>{TRIP.distance}</Text>
                    </View>
                </View>
            </View>

            {/* Bottom Info Card */}
            <View style={[styles.bottomCard, { backgroundColor: isDark ? '#18181b' : '#fff', paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.riderRow}>
                    <View style={[styles.riderInfo, { flex: 1 }]}>
                        <View style={[styles.riderAvatarBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Ionicons name="person" size={28} color="#00ff90" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.riderName, { color: isDark ? '#fff' : '#18181b' }]} numberOfLines={1}>Picking up {TRIP.rider.name}</Text>
                            <Text style={styles.riderAddress} numberOfLines={1}>{TRIP.pickup.address}</Text>
                        </View>
                    </View>
                    <View style={styles.riderActions}>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/video-call" as any)}
                            style={[styles.iconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="videocam" size={20} color="#00ff90" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/call" as any)}
                            style={[styles.iconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="call" size={20} color="#00ff90" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/chat" as any)}
                            style={[styles.iconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="chatbubble" size={20} color="#00ff90" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={[styles.cancelButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                    >
                        <Text style={[styles.cancelButtonText, { color: isDark ? '#fff' : '#18181b' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleArrived}
                        style={styles.arrivedButton}
                    >
                        <Text style={styles.arrivedButtonText}>I've Arrived</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carMarker: {
        height: 40,
        width: 40,
        backgroundColor: '#3b82f6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    personMarker: {
        height: 40,
        width: 40,
        backgroundColor: '#00ff90',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    navOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    navBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    navInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navIconBox: {
        height: 40,
        width: 40,
        backgroundColor: '#27272a',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    navInstruction: {
        color: '#a1a1aa',
        fontSize: 12,
    },
    navDistance: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    navEtaBox: {
        alignItems: 'flex-end',
    },
    navEtaText: {
        color: '#00ff90',
        fontSize: 20,
        fontWeight: 'bold',
    },
    navEtaSubtext: {
        color: '#71717a',
        fontSize: 12,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 24,
        paddingHorizontal: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    riderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    riderAvatarBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    riderName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    riderAddress: {
        fontSize: 14,
        color: '#71717a',
    },
    riderActions: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: 'bold',
    },
    arrivedButton: {
        flex: 2,
        backgroundColor: '#00ff90',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    arrivedButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18181b',
    },
});
