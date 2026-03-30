import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PilotProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const renderInfoRow = (icon: string, label: string, value: string, isVerified: boolean = false) => (
        <View style={[styles.infoRow, { borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }]}>
            <View style={styles.infoLeft}>
                <Ionicons name={icon as any} size={20} color={isDark ? '#a1a1aa' : '#71717a'} />
                <View>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>{value}</Text>
                </View>
            </View>
            {isVerified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#00ff90" />
                    <Text style={styles.verifiedText}>Verified</Text>
                </View>
            )}
        </View>
    );

    const renderDocumentItem = (title: string, expiry: string, status: 'Active' | 'Under Review' | 'Expired') => (
        <TouchableOpacity style={[styles.docItem, { backgroundColor: isDark ? '#18181b' : '#f8f9fa' }]}>
            <View>
                <Text style={[styles.docTitle, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
                <Text style={styles.docExpiry}>Expires {expiry}</Text>
            </View>
            <View style={[styles.statusChip, status === 'Active' ? styles.statusActive : status === 'Expired' ? styles.statusExpired : styles.statusReview]}>
                <Text style={[styles.statusTabText, status === 'Active' ? styles.activeText : status === 'Expired' ? styles.expiredText : styles.reviewText]}>
                    {status}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Pilot Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
                {/* Profile Basic Info */}
                <View style={styles.profileMain}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                            <Ionicons name="person" size={60} color="#00ff90" />
                        </View>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>4.95</Text>
                            <Ionicons name="star" size={14} color="#000" />
                        </View>
                    </View>
                    <Text style={[styles.pilotName, { color: isDark ? '#fff' : '#000' }]}>Alex Johnson</Text>
                    <Text style={styles.memberSince}>DashPilot since 2022</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statBox, { borderRightWidth: 1, borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Text style={[styles.statVal, { color: isDark ? '#fff' : '#000' }]}>2,450</Text>
                        <Text style={styles.statLab}>Total Trips</Text>
                    </View>
                    <View style={[styles.statBox, { borderRightWidth: 1, borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <Text style={[styles.statVal, { color: isDark ? '#fff' : '#000' }]}>98%</Text>
                        <Text style={styles.statLab}>Acceptance</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statVal, { color: isDark ? '#fff' : '#000' }]}>4.9</Text>
                        <Text style={styles.statLab}>Rating</Text>
                    </View>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
                    <View style={[styles.infoCard, { backgroundColor: isDark ? '#111' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        {renderInfoRow("mail-outline", "Email", "alex.pilot@dashdrive.com", true)}
                        {renderInfoRow("phone-portrait-outline", "Phone", "+1 (555) 123-4567", true)}
                        {renderInfoRow("car-outline", "Vehicle", "Toyota Prius (Black) - KLY890", true)}
                    </View>
                </View>

                {/* Documents */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>DOCUMENTS & COMPLIANCE</Text>
                        <Ionicons name="information-circle-outline" size={18} color="#71717a" />
                    </View>
                    <View style={styles.docList}>
                        {renderDocumentItem("Driver's License", "Dec 2026", "Active")}
                        {renderDocumentItem("Vehicle Insurance", "Mar 2025", "Active")}
                        {renderDocumentItem("Background Check", "Apr 2024", "Under Review")}
                        {renderDocumentItem("Vehicle Permit", "Jan 2024", "Expired")}
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity style={[styles.logoutButton, { borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>Log out of Pilot Mode</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'UberMoveBold',
    },
    editButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    editText: {
        color: '#00ff90',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: 20,
    },
    profileMain: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#00ff90',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#00ff90',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ratingText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    pilotName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 14,
        color: '#71717a',
    },
    statsGrid: {
        flexDirection: 'row',
        marginBottom: 32,
        paddingVertical: 16,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLab: {
        fontSize: 12,
        color: '#71717a',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#71717a',
        letterSpacing: 1,
    },
    infoCard: {
        borderRadius: 16,
        paddingLeft: 16,
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingRight: 16,
        borderBottomWidth: 1,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    infoLabel: {
        fontSize: 12,
        color: '#71717a',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    verifiedText: {
        fontSize: 10,
        color: '#00ff90',
        fontWeight: 'bold',
    },
    docList: {
        gap: 12,
    },
    docItem: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    docTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    docExpiry: {
        fontSize: 12,
        color: '#71717a',
    },
    statusChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
    },
    statusExpired: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    statusReview: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    statusTabText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeText: { color: '#00ff90' },
    expiredText: { color: '#ef4444' },
    reviewText: { color: '#3b82f6' },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
});
