import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/src/lib/MapView";
import { darkMapStyle, mapStyle } from "@/src/styles/mapStyles";

// Mock trip data
const TRIP = {
    destination: { lat: 51.4700, lng: -0.4543, address: "Terminal 2, Heathrow" },
    rider: { name: "Zoe Chit", rating: 5.0 },
    eta: "28 min",
    distance: "17.3 km",
    vertical: "SCHOOL_RUN",
    student: { name: "Zoe Chit", school: "St. Andrews Primary" }
};

export default function TripActiveScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [seconds, setSeconds] = useState(0);
    const [isSafetyModalVisible, setIsSafetyModalVisible] = useState(TRIP.vertical === "SCHOOL_RUN");
    const [checklist, setChecklist] = useState({
        identity: false,
        seatbelt: false,
        locks: false
    });
    const [pinCode, setPinCode] = useState("");
    const [isPinVerified, setIsPinVerified] = useState(false);

    // Trip timer
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleComplete = () => {
        if (TRIP.vertical === "SCHOOL_RUN" && !isPinVerified) {
            alert("Please verify the School Drop-off PIN first.");
            return;
        }
        router.replace("/pilot/trip-completed" as any);
    };

    const isChecklistComplete = checklist.identity && checklist.seatbelt && checklist.locks;

    return (
        <View style={styles.container}>
            {/* Map Navigation */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: 51.50,
                    longitude: -0.25,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}
                customMapStyle={isDark ? darkMapStyle : mapStyle}
            >
                <Marker coordinate={{ latitude: 51.50, longitude: -0.15 }}>
                    <View style={styles.carMarker}>
                        <Ionicons name="car" size={20} color="white" />
                    </View>
                </Marker>
                <Marker coordinate={{ latitude: TRIP.destination.lat, longitude: TRIP.destination.lng }}>
                    <View style={styles.destinationMarker}>
                        <Ionicons name="flag" size={16} color={isDark ? 'black' : 'white'} />
                    </View>
                </Marker>
            </MapView>

            {/* Navigation Overlay */}
            <View style={[styles.navOverlay, { paddingTop: insets.top + 12 }]}>
                <View style={[styles.navBanner, { backgroundColor: '#00ff90' }]}>
                    <View style={styles.navInfo}>
                        <View style={styles.navIconBox}>
                            <Ionicons name="navigate" size={20} color="#00ff90" />
                        </View>
                        <View>
                            <Text style={styles.navInstruction}>Continue on M4</Text>
                            <Text style={styles.navDistance}>2.5 miles</Text>
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
                <View style={styles.riderHeader}>
                    <View style={[styles.riderMain, { flex: 1 }]}>
                        <View style={[styles.avatarBox, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Ionicons name="person" size={24} color="#00ff90" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.riderName, { color: isDark ? '#fff' : '#18181b' }]} numberOfLines={1}>{TRIP.rider.name}</Text>
                            <View style={styles.ratingBox}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{TRIP.rider.rating}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.riderActions}>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/video-call" as any)}
                            style={[styles.smallIconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="videocam" size={18} color="#00ff90" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/call" as any)}
                            style={[styles.smallIconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="call" size={18} color="#00ff90" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/pilot/chat" as any)}
                            style={[styles.smallIconButton, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                        >
                            <Ionicons name="chatbubble" size={18} color="#00ff90" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tripTimerBox}>
                        <Text style={styles.timerLabel}>Trip Time</Text>
                        <Text style={[styles.timerValue, { color: isDark ? '#fff' : '#18181b' }]}>{formatTime(seconds)}</Text>
                    </View>
                </View>

                {/* Destination */}
                <View style={[styles.destBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }]}>
                    <Ionicons name="location" size={16} color="#adadad" />
                    <Text style={[styles.destText, { color: isDark ? '#d1d5db' : '#4b5563' }]} numberOfLines={1}>
                        {TRIP.destination.address}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.safetyButton}>
                        <Ionicons name="shield-checkmark" size={24} color="#ef4444" />
                    </TouchableOpacity>
                    {TRIP.vertical === "SCHOOL_RUN" && !isPinVerified ? (
                         <TouchableOpacity
                            onPress={() => setIsSafetyModalVisible(true)}
                            style={[styles.completeButton, { backgroundColor: '#FFD700' }]}
                        >
                            <Text style={[styles.completeText, { color: '#000' }]}>Verify Drop-off PIN</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleComplete}
                            style={[styles.completeButton, { backgroundColor: isDark ? '#fff' : '#18181b' }]}
                        >
                            <Text style={[styles.completeText, { color: isDark ? '#000' : '#fff' }]}>Complete Trip</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Safety Modal */}
                <Modal visible={isSafetyModalVisible} animationType="slide" transparent>
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-white dark:bg-zinc-900 rounded-t-[40px] p-8 pb-12">
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className="text-2xl font-uber-bold dark:text-white">Safety Check</Text>
                                <Ionicons name="shield-checkmark" size={28} color="#FFD700" />
                            </View>

                            {!isChecklistComplete ? (
                                <>
                                    <Text className="text-zinc-500 font-uber-medium mb-6">Complete the following before starting the trip.</Text>
                                    <CheckItem 
                                        label="Student Identity Verified" 
                                        checked={checklist.identity} 
                                        onPress={() => setChecklist(prev => ({ ...prev, identity: !prev.identity }))} 
                                    />
                                    <CheckItem 
                                        label="Seatbelts Fastened" 
                                        checked={checklist.seatbelt} 
                                        onPress={() => setChecklist(prev => ({ ...prev, seatbelt: !prev.seatbelt }))} 
                                    />
                                    <CheckItem 
                                        label="Child Safety Locks Engaged" 
                                        checked={checklist.locks} 
                                        onPress={() => setChecklist(prev => ({ ...prev, locks: !prev.locks }))} 
                                    />
                                    <TouchableOpacity 
                                        disabled={!isChecklistComplete}
                                        onPress={() => setIsSafetyModalVisible(false)}
                                        className={`mt-6 py-4 rounded-2xl items-center ${isChecklistComplete ? 'bg-primary' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                                    >
                                        <Text className={`font-uber-bold text-lg ${isChecklistComplete ? 'text-black' : 'text-zinc-400'}`}>Start Run</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text className="text-zinc-500 font-uber-medium mb-6">Enter the 4-digit PIN provided by the school official at drop-off.</Text>
                                    <View className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl mb-6">
                                        <Text className="text-center text-3xl font-uber-bold tracking-[10px] dark:text-white">****</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setIsPinVerified(true);
                                            setIsSafetyModalVisible(false);
                                        }}
                                        className="py-4 rounded-2xl items-center bg-primary"
                                    >
                                        <Text className="font-uber-bold text-lg text-black">Verify PIN</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

function CheckItem({ label, checked, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-row items-center py-3 mb-2">
            <View className={`h-6 w-6 rounded-lg border-2 items-center justify-center mr-4 ${checked ? 'bg-primary border-primary' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {checked && <Ionicons name="checkmark" size={16} color="black" />}
            </View>
            <Text className="text-lg font-uber-medium dark:text-white">{label}</Text>
        </TouchableOpacity>
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
    destinationMarker: {
        height: 40,
        width: 40,
        backgroundColor: '#18181b',
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
        backgroundColor: '#18181b',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    navInstruction: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
    },
    navDistance: {
        color: '#18181b',
        fontSize: 18,
        fontWeight: 'bold',
    },
    navEtaBox: {
        alignItems: 'flex-end',
    },
    navEtaText: {
        color: '#18181b',
        fontSize: 20,
        fontWeight: 'bold',
    },
    navEtaSubtext: {
        color: 'rgba(0,0,0,0.4)',
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
    riderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    riderMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    riderName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: '#71717a',
        marginLeft: 4,
    },
    tripTimerBox: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    riderActions: {
        flexDirection: 'row',
        gap: 8,
    },
    smallIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerLabel: {
        fontSize: 12,
        color: '#71717a',
    },
    timerValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    destBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    destText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    safetyButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
