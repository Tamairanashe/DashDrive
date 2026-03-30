import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSavedPlacesStore } from "../../../src/lib/store";

export default function PilotSetupCompletionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { setIsPilotRegistered } = useSavedPlacesStore();

    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.1, { duration: 1500 }),
            -1,
            true
        );
    }, []);

    const animatedPulse = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 0.2
    }));

    const handleGetStarted = () => {
        setIsPilotRegistered(true);
        router.replace("/pilot");
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={styles.centerContent}>
                <Animated.View entering={FadeInUp.duration(1000)} style={styles.successIconWrapper}>
                    <Animated.View style={[styles.pulseCircle, animatedPulse]} />
                    <View style={styles.successCircle}>
                        <Ionicons name="checkmark-done" size={60} color="#00ff90" />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.textWrapper}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Verification Complete!</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        Welcome to the team, Pilot Alex. Your account is now active and ready for your first trip.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.perksList}>
                    <View style={styles.perkItem}>
                        <View style={styles.perkIcon}>
                            <Ionicons name="flash-outline" size={20} color="#00ff90" />
                        </View>
                        <Text style={[styles.perkText, { color: isDark ? '#fff' : '#000' }]}>Instant payouts available</Text>
                    </View>
                    <View style={styles.perkItem}>
                        <View style={styles.perkIcon}>
                            <Ionicons name="shield-outline" size={20} color="#00ff90" />
                        </View>
                        <Text style={[styles.perkText, { color: isDark ? '#fff' : '#000' }]}>24/7 Pilot support</Text>
                    </View>
                </Animated.View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
                <TouchableOpacity
                    onPress={handleGetStarted}
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Go to Radar</Text>
                    <Ionicons name="radio-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    successIconWrapper: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    pulseCircle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#00ff90',
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#00ff90',
    },
    textWrapper: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'UberMoveBold',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    perksList: {
        width: '100%',
        gap: 16,
    },
    perkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(0, 255, 144, 0.05)',
        padding: 16,
        borderRadius: 20,
    },
    perkIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    perkText: {
        fontSize: 15,
        fontFamily: 'UberMoveMedium',
    },
    footer: {
        paddingHorizontal: 24,
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
        fontFamily: 'UberMoveBold',
    },
});
