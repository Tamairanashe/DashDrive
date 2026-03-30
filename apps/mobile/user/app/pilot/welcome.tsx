import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSavedPlacesStore } from "../../src/lib/store";

const { width, height } = Dimensions.get('window');

export default function PilotWelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const { isPilotRegistered } = useSavedPlacesStore();

    const handleContinue = () => {
        if (isPilotRegistered) {
            router.replace("/pilot");
        } else {
            router.push("/pilot/setup/welcome");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header / Brand */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={[styles.brandText, { color: isDark ? '#fff' : '#000' }]}>DashDrive</Text>
                <View style={styles.pilotBadge}>
                    <Text style={styles.pilotBadgeText}>PILOT</Text>
                </View>
            </View>

            {/* Illustration Area (Mocked with Icons/Design) */}
            <View style={styles.illustrationContainer}>
                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.illustrationContent}>
                    <View style={[styles.circle, { backgroundColor: isDark ? '#1a1a1a' : '#f4f4f5' }]} />
                    <Ionicons
                        name="car-sport"
                        size={120}
                        color={isDark ? "#00ff90" : "#000"}
                        style={styles.mainIcon}
                    />
                    <View style={styles.statsRow}>
                        <View style={styles.statChip}>
                            <Ionicons name="flash" size={16} color="#00ff90" />
                            <Text style={styles.statText}>Fast Payouts</Text>
                        </View>
                        <View style={styles.statChip}>
                            <Ionicons name="shield-checkmark" size={16} color="#00ff90" />
                            <Text style={styles.statText}>Safe Travels</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* Content Section */}
            <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
                <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                        Welcome to your next-gen cockpit
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        Maximize your earnings with real-time radar, secure video verification, and instant cashouts.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.actionContainer}>
                    <TouchableOpacity
                        onPress={handleContinue}
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} style={styles.secondaryButton}>
                        <Text style={[styles.secondaryButtonText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                            Not now, let's ride as a passenger
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
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
        paddingHorizontal: 24,
        gap: 12,
    },
    brandText: {
        fontSize: 24,
        fontFamily: 'UberMoveBold',
        letterSpacing: -0.5,
    },
    pilotBadge: {
        backgroundColor: '#00ff90',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pilotBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    illustrationContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
    },
    mainIcon: {
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 144, 0.2)',
    },
    statText: {
        color: '#00ff90',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontFamily: 'UberMoveBold',
        lineHeight: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    actionContainer: {
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#00ff90',
        height: 64,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#00ff90',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
