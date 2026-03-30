import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SupplyHub() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Available");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Supply Hub</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications" size={20} color="black" />
                </TouchableOpacity>
            </View>

            {/* Toggle Tabs */}
            <View style={styles.tabContainer}>
                <View style={styles.tabWrapper}>
                    <TouchableOpacity 
                        onPress={() => setActiveTab("Available")}
                        style={[styles.tab, activeTab === "Available" && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === "Available" && styles.activeTabText]}>Available Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab("Scheduled")}
                        style={[styles.tab, activeTab === "Scheduled" && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === "Scheduled" && styles.activeTabText]}>My Trips</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollContent}>
                {activeTab === "Available" ? (
                    <>
                        <DemandCard 
                            user="Sarah J." 
                            rating="4.9" 
                            from="Harare" 
                            to="Gweru" 
                            pax="2" 
                            proposed="35" 
                            time="Today, 2:00 PM"
                            onPress={() => router.push('/execution' as any)}
                        />
                        <DemandCard 
                            user="Michael K." 
                            rating="4.5" 
                            from="Harare" 
                            to="Bulawayo" 
                            pax="1" 
                            proposed="15" 
                            time="Tomorrow, 7:00 AM"
                            onPress={() => router.push('/execution' as any)}
                        />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="calendar-multiselect" size={64} color="#e5e7eb" />
                        <Text style={styles.emptyText}>No scheduled trips yet.{"\n"}Post a trip to start accepting bookings.</Text>
                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>Plan a Trip</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

function DemandCard({ user, rating, from, to, pax, proposed, time, onPress }: any) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color="white" />
                    </View>
                    <View>
                        <Text style={styles.userName}>{user}</Text>
                        <View style={styles.ratingInfo}>
                            <Ionicons name="star" size={14} color="#fca311" />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>${proposed}</Text>
                </View>
            </View>

            <View style={styles.routeInfo}>
                <Ionicons name="git-branch" size={16} color="#4ade80" style={{ marginRight: 12 }} />
                <Text style={styles.routeText}>{from} → {to}</Text>
            </View>

            <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
                    <Text style={styles.metaText}>{time}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
                    <Text style={styles.metaText}>{pax} px</Text>
                </View>
            </View>

            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.secondaryCardButton}>
                    <Text style={styles.secondaryButtonText}>Bid Counter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPress} style={styles.primaryCardButton}>
                    <Text style={styles.primaryCardButtonText}>Accept Price</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#18181b' },
    iconButton: { height: 40, width: 40, backgroundColor: '#f4f4f5', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    tabContainer: { paddingHorizontal: 24, paddingVertical: 24 },
    tabWrapper: { flexDirection: 'row', backgroundColor: '#f4f4f5', padding: 4, borderRadius: 24 },
    tab: { flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
    activeTab: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    tabText: { fontWeight: '700', color: '#71717a' },
    activeTabText: { color: 'black' },
    scrollContent: { flex: 1, paddingHorizontal: 24 },
    card: { backgroundColor: '#18181b', padding: 24, borderRadius: 32, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { height: 40, width: 40, backgroundColor: '#27272a', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    userName: { color: 'white', fontWeight: '700', fontSize: 18 },
    ratingInfo: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginLeft: 4 },
    priceBadge: { backgroundColor: 'rgba(252,163,17,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    priceText: { color: '#fca311', fontWeight: '800' },
    routeInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    routeText: { color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    metaInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    metaText: { color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
    actionGroup: { flexDirection: 'row', gap: 16 },
    secondaryCardButton: { flex: 1, height: 56, backgroundColor: '#27272a', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { color: 'white', fontWeight: '700' },
    primaryCardButton: { flex: 1, height: 56, backgroundColor: '#fca311', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    primaryCardButtonText: { color: 'black', fontWeight: '700' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyText: { color: '#94a3b8', fontWeight: '700', marginTop: 16, textAlign: 'center' },
    primaryButton: { marginTop: 32, backgroundColor: '#fca311', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16 },
    primaryButtonText: { color: 'black', fontWeight: '700' }
});
