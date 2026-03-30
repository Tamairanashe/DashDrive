import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PilotSetupDocUploadScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const [status, setStatus] = useState<'idle' | 'capturing' | 'analyzing' | 'success'>('idle');

    const handleCapture = () => {
        setStatus('capturing');
        // Simulate camera capture
        setTimeout(() => setStatus('analyzing'), 1500);
        // Simulate AI analysis
        setTimeout(() => setStatus('success'), 3500);
    };

    return (
        <View style={[styles.container, { backgroundColor: '#000' }]}>
            <StatusBar barStyle="light-content" />

            {/* Camera Viewfinder (MOCK) */}
            <View style={styles.viewfinder}>
                {status === 'idle' && (
                    <Animated.View entering={FadeIn} style={styles.guideContainer}>
                        <View style={styles.guideBox} />
                        <Text style={styles.guideText}>Align {params.docTitle} within the frame</Text>
                    </Animated.View>
                )}

                {status === 'capturing' && (
                    <View style={styles.capturingOverlay}>
                        <View style={styles.shutterFlash} />
                    </View>
                )}

                {status === 'analyzing' && (
                    <View style={styles.analyzingOverlay}>
                        <ActivityIndicator size="large" color="#00ff90" />
                        <Text style={styles.analyzingText}>Analyzing document...</Text>
                    </View>
                )}

                {status === 'success' && (
                    <Animated.View entering={FadeIn} style={styles.successOverlay}>
                        <View style={styles.successCircle}>
                            <Ionicons name="checkmark" size={60} color="#00ff90" />
                        </View>
                        <Text style={styles.successText}>Verification Successful</Text>
                        <Text style={styles.successSubtext}>Identity confirmed automatically</Text>
                    </Animated.View>
                )}
            </View>

            {/* Controls */}
            <View style={[styles.controls, { paddingBottom: insets.bottom + 40 }]}>
                <View style={styles.topControls}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.controlTitle}>{params.docTitle}</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="flash" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {status === 'idle' && (
                    <TouchableOpacity onPress={handleCapture} style={styles.shutterButton}>
                        <View style={styles.shutterInner} />
                    </TouchableOpacity>
                )}

                {status === 'success' && (
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.doneButton}
                    >
                        <Text style={styles.doneText}>Continue</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewfinder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideContainer: {
        alignItems: 'center',
        gap: 24,
    },
    guideBox: {
        width: 320,
        height: 200,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#00ff90',
        borderStyle: 'dashed',
    },
    guideText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'UberMoveMedium',
        textAlign: 'center',
    },
    capturingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    shutterFlash: {
        flex: 1,
    },
    analyzingOverlay: {
        alignItems: 'center',
        gap: 16,
    },
    analyzingText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'UberMoveBold',
    },
    successOverlay: {
        alignItems: 'center',
        gap: 16,
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#00ff90',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        color: '#00ff90',
        fontSize: 24,
        fontFamily: 'UberMoveBold',
    },
    successSubtext: {
        color: '#71717a',
        fontSize: 16,
        fontFamily: 'UberMoveMedium',
    },
    controls: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    topControls: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'UberMoveBold',
    },
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    doneButton: {
        backgroundColor: '#00ff90',
        width: '100%',
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'UberMoveBold',
    },
});
