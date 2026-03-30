import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function TripExecution() {
    const router = useRouter();
    const [status, setStatus] = useState("Boarding"); // Boarding, Active, Completed

    return (
        <View style={styles.container}>
            {/* Map Placeholder */}
            <View style={styles.mapContainer}>
                <View style={styles.mapMock}>
                    <Ionicons name="navigate" size={48} color="#3b82f6" opacity={0.3} />
                    <Text style={styles.mapText}>Live Route Tracking...</Text>
                </View>
                
                {/* Overlay Header */}
                <SafeAreaView style={styles.mapOverlayHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-down" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: status === 'Active' ? '#4ade80' : '#fca311' }]} />
                        <Text style={styles.statusText}>{status}</Text>
                    </View>
                </SafeAreaView>
            </View>

            {/* Bottom Sheet Content */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />
                
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <View style={styles.routeHeader}>
                        <View>
                            <Text style={styles.cityText}>Harare</Text>
                            <Text style={styles.timeText}>Dep: 07:30 AM</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={20} color="#94a3b8" />
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.cityText}>Gweru</Text>
                            <Text style={styles.timeText}>Est: 10:15 AM</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Passengers (2/4 seats)</Text>
                    
                    <PassengerItem name="Sarah J." seat="1A" status="Boarded" />
                    <PassengerItem name="Michael K." seat="1B" status="Waiting" />

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.iconAction}>
                            <Ionicons name="call" size={20} color="#3b82f6" />
                            <Text style={styles.iconActionText}>Call Pax</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconAction}>
                            <Ionicons name="chatbubble" size={20} color="#3b82f6" />
                            <Text style={styles.iconActionText}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconAction, { borderColor: '#fee2e2' }]}>
                            <Ionicons name="warning" size={20} color="#ef4444" />
                            <Text style={[styles.iconActionText, { color: '#ef4444' }]}>SOS</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        onPress={() => setStatus(status === 'Boarding' ? 'Active' : 'Completed')}
                        style={[styles.mainButton, { backgroundColor: status === 'Boarding' ? '#fca311' : '#18181b' }]}
                    >
                        <Text style={[styles.mainButtonText, { color: status === 'Boarding' ? 'black' : 'white' }]}>
                            {status === 'Boarding' ? 'Start Trip' : 'Arrived at Destination'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

function PassengerItem({ name, seat, status }: any) {
    return (
        <View style={styles.paxItem}>
            <View style={styles.paxInfo}>
                <View style={styles.paxAvatar}>
                    <Text style={styles.paxInitial}>{name[0]}</Text>
                </View>
                <View>
                    <Text style={styles.paxName}>{name}</Text>
                    <Text style={styles.paxSeat}>Seat {seat}</Text>
                </View>
            </View>
            <View style={[styles.paxStatus, { backgroundColor: status === 'Boarded' ? '#dcfce7' : '#fef9c3' }]}>
                <Text style={[styles.paxStatusText, { color: status === 'Boarded' ? '#166534' : '#854d0e' }]}>{status}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    mapContainer: { height: height * 0.45, backgroundColor: '#f1f5f9' },
    mapMock: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    mapText: { color: '#94a3b8', fontWeight: '600', marginTop: 12 },
    mapOverlayHeader: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backButton: { height: 44, width: 44, backgroundColor: 'white', borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    statusDot: { height: 8, width: 8, borderRadius: 4, marginRight: 8 },
    statusText: { fontWeight: '700', fontSize: 13 },
    bottomSheet: { flex: 1, backgroundColor: 'white', marginTop: -32, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
    handle: { height: 4, width: 40, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 24 },
    routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    cityText: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    timeText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#64748b', marginBottom: 16 },
    paxItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 20, marginBottom: 12 },
    paxInfo: { flexDirection: 'row', alignItems: 'center' },
    paxAvatar: { height: 40, width: 40, backgroundColor: '#e2e8f0', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    paxInitial: { fontWeight: '700', color: '#475569' },
    paxName: { fontWeight: '700', color: '#1e293b' },
    paxSeat: { fontSize: 12, color: '#64748b', fontWeight: '600' },
    paxStatus: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
    paxStatusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
    actionRow: { flexDirection: 'row', gap: 12, marginVertical: 32 },
    iconAction: { flex: 1, height: 64, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    iconActionText: { fontSize: 12, fontWeight: '700', color: '#3b82f6', marginTop: 4 },
    mainButton: { height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    mainButtonText: { fontSize: 18, fontWeight: '800' }
});
