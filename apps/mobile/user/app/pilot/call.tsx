import { Ionicons } from "@expo/vector-icons"; // Refreshing for Metro
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CallScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.3, { duration: 1500 }),
            -1,
            true
        );

        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        router.back();
    };

    const animatedPulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulse.value }],
            opacity: interpolate(pulse.value, [1, 1.3], [0.4, 0]),
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Image / Blur */}
            <View style={styles.backgroundContainer}>
                <View style={[styles.backgroundOverlay, { backgroundColor: '#18181b' }]} />
                <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
            </View>

            {/* Header Content */}
            <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
                {/* Security Badge */}
                <View style={styles.securityBadge}>
                    <Ionicons name="shield-checkmark" size={16} color="#00ff90" />
                    <Text style={styles.securityText}>Encryption Verified</Text>
                </View>

                {/* Rider Info */}
                <View style={styles.avatarContainer}>
                    <Animated.View style={[styles.pulseCircle, animatedPulseStyle]} />
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={60} color="#00ff90" />
                    </View>
                </View>

                <Text style={styles.riderName}>Emma W.</Text>
                <Text style={styles.callStatus}>{formatDuration(callDuration)}</Text>
            </View>

            {/* Call Controls */}
            <View style={[styles.controls, { paddingBottom: insets.bottom + 60 }]}>
                <View style={styles.mainControls}>
                    {/* Mute */}
                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => setIsMuted(!isMuted)}
                            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                        >
                            <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={isMuted ? "#000" : "#fff"} />
                        </TouchableOpacity>
                        <Text style={styles.controlLabel}>Mute</Text>
                    </View>

                    {/* Speaker */}
                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => setIsSpeaker(!isSpeaker)}
                            style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
                        >
                            <Ionicons name={isSpeaker ? "volume-high" : "volume-medium"} size={28} color={isSpeaker ? "#000" : "#fff"} />
                        </TouchableOpacity>
                        <Text style={styles.controlLabel}>Speaker</Text>
                    </View>
                </View>

                {/* End Call */}
                <TouchableOpacity onPress={handleEndCall} style={styles.endCallButton}>
                    <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 40,
        gap: 6,
    },
    securityText: {
        color: '#00ff90',
        fontSize: 12,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(0, 255, 144, 0.3)',
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#00ff90',
    },
    riderName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    callStatus: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: 2,
    },
    controls: {
        alignItems: 'center',
    },
    mainControls: {
        flexDirection: 'row',
        gap: 60,
        marginBottom: 60,
    },
    controlItem: {
        alignItems: 'center',
        gap: 8,
    },
    controlButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButtonActive: {
        backgroundColor: '#fff',
    },
    controlLabel: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.8,
    },
    endCallButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
});
