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
    View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PilotPromotionsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const renderPromoCard = (title: string, subtitle: string, reward: string, progress: number, color: string, index: number) => (
        <Animated.View
            entering={FadeInRight.delay(index * 100).duration(500)}
            style={[styles.promoCard, { backgroundColor: isDark ? '#111' : '#fff', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}
        >
            <View style={styles.promoHeader}>
                <View style={[styles.promoIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name="gift" size={24} color={color} />
                </View>
                <View style={styles.promoTitleBox}>
                    <Text style={[styles.promoTitle, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
                    <Text style={styles.promoSubtitle}>{subtitle}</Text>
                </View>
                <Text style={[styles.rewardText, { color: color }]}>{reward}</Text>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressTextRow}>
                    <Text style={[styles.progressLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>Progress</Text>
                    <Text style={[styles.progressValue, { color: isDark ? '#fff' : '#000' }]}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
                </View>
            </View>

            <TouchableOpacity style={[styles.viewDetailsButton, { borderTopColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                <Text style={[styles.viewDetailsText, { color: color }]}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color={color} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Promotions</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
                {/* Active Bonus Summary */}
                <View style={[styles.bonusSummary, { backgroundColor: isDark ? '#1a1a1a' : '#f4f4f5' }]}>
                    <Text style={styles.summaryLabel}>POTENTIAL BONUSES THIS WEEK</Text>
                    <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#000' }]}>$450.00</Text>
                    <View style={styles.summaryStats}>
                        <View style={styles.summaryStatItem}>
                            <Ionicons name="flash" size={16} color="#00ff90" />
                            <Text style={[styles.summaryStatText, { color: isDark ? '#fff' : '#000' }]}>3 Active Quests</Text>
                        </View>
                    </View>
                </View>

                {/* Quests Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACTIVE QUESTS</Text>
                    {renderPromoCard("Weekend Warrior", "Complete 50 trips by Sunday", "+$250", 0.65, "#00ff90", 0)}
                    {renderPromoCard("Night Owl", "Complete 10 trips between 10pm - 4am", "+$50", 0.2, "#a855f7", 1)}
                    {renderPromoCard("Safe Driver", "Maintain 5-star rating for 20 trips", "+$150", 0.9, "#3b82f6", 2)}
                </View>

                {/* Surge Map Placeholder */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SURGE OPPORTUNITIES</Text>
                    <TouchableOpacity style={[styles.surgeCard, { backgroundColor: isDark ? '#111' : '#f8f9fa', borderColor: isDark ? '#27272a' : '#f4f4f5' }]}>
                        <View style={styles.surgeIconBox}>
                            <Ionicons name="map" size={32} color="#00ff90" />
                        </View>
                        <View style={styles.surgeContent}>
                            <Text style={[styles.surgeTitle, { color: isDark ? '#fff' : '#000' }]}>Downtown Surge Area</Text>
                            <Text style={styles.surgeDesc}>2.5x Multiplier active in your zone</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#71717a" />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'UberMoveBold',
    },
    scrollContent: {
        paddingTop: 10,
    },
    bonusSummary: {
        margin: 20,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#71717a',
        letterSpacing: 1,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 42,
        fontWeight: 'bold',
        fontFamily: 'UberMoveBold',
        marginBottom: 16,
    },
    summaryStats: {
        flexDirection: 'row',
    },
    summaryStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    summaryStatText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#71717a',
        letterSpacing: 1,
        marginBottom: 16,
    },
    promoCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    promoIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    promoTitleBox: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    promoSubtitle: {
        fontSize: 13,
        color: '#71717a',
    },
    rewardText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressSection: {
        marginBottom: 20,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
    },
    progressValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        gap: 4,
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    surgeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    surgeIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    surgeContent: {
        flex: 1,
    },
    surgeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    surgeDesc: {
        fontSize: 13,
        color: '#71717a',
    },
});
