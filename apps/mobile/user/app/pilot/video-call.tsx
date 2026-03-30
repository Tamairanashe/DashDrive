import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.2, { duration: 2000 }),
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
            opacity: interpolate(pulse.value, [1, 1.2], [0.3, 0]),
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Main Video View (Rider - Mocked with semi-transparent view) */}
            <View style={styles.mainVideo}>
                <View style={[styles.videoPlaceholder, { backgroundColor: '#18181b' }]}>
                    <Ionicons name="person" size={120} color="rgba(0, 255, 144, 0.2)" />
                </View>

                {/* Visual Identity Overlay */}
                <Animated.View entering={FadeIn.delay(500)} style={[styles.identityOverlay, { top: insets.top + 20 }]}>
                    <View style={styles.riderChip}>
                        <Text style={styles.riderName}>Emma W.</Text>
                        <View style={styles.ratingBox}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>4.89</Text>
                        </View>
                    </View>
                    <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
                </Animated.View>
            </View>

            {/* Safety Banner */}
            <View style={[styles.safetyBanner, { top: insets.top + 80 }]}>
                <Ionicons name="shield-checkmark" size={16} color="#00ff90" />
                <Text style={styles.safetyText}>Safety Mode: Verify Rider Identity</Text>
            </View>

            {/* PIP (Pilot Camera - Mocked) */}
            <View style={[styles.pipContainer, { top: insets.top + 140 }]}>
                <View style={styles.pipVideo}>
                    {isVideoOff ? (
                        <View style={styles.videoOffPlaceholder}>
                            <Ionicons name="videocam-off" size={20} color="#71717a" />
                        </View>
                    ) : (
                        <View style={styles.pipActiveVideo}>
                            <Ionicons name="car" size={24} color="#00ff90" />
                        </View>
                    )}
                </View>
            </View>

            {/* Controls */}
            <BlurView intensity={20} tint="dark" style={[styles.controls, { paddingBottom: insets.bottom + 40 }]}>
                <View style={styles.controlRow}>
                    <TouchableOpacity
                        onPress={() => setIsMuted(!isMuted)}
                        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                    >
                        <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color={isMuted ? "#000" : "#fff"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsVideoOff(!isVideoOff)}
                        style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
                    >
                        <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={24} color={isVideoOff ? "#000" : "#fff"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton}>
                        <Ionicons name="camera-reverse" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleEndCall} style={styles.endCallButton}>
                        <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mainVideo: {
        flex: 1,
    },
    videoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    identityOverlay: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    riderChip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    riderName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
    },
    durationText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    safetyBanner: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 144, 0.2)',
    },
    safetyText: {
        color: '#00ff90',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pipContainer: {
        position: 'absolute',
        right: 20,
        width: 100,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: '#000',
    },
    pipVideo: {
        flex: 1,
    },
    pipActiveVideo: {
        flex: 1,
        backgroundColor: '#27272a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoOffPlaceholder: {
        flex: 1,
        backgroundColor: '#18181b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 20,
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButtonActive: {
        backgroundColor: '#fff',
    },
    endCallButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
});
