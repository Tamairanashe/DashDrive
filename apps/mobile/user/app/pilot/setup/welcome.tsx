import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

export default function PilotSetupWelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Top Branding Section */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={[styles.brandText, { color: isDark ? '#fff' : '#000' }]}>DashDrive</Text>
            </View>

            {/* Large Image/Illustration Section (Screen 2 reference) */}
            <View style={styles.imageContainer}>
                <Animated.View entering={FadeInUp.duration(1000)} style={styles.imageWrapper}>
                    {/* Placeholder for the illustration from screen 2 */}
                    <View style={[styles.illustrationPlaceholder, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                        <Ionicons name="car-outline" size={120} color="#00ff90" style={{ marginBottom: 20 }} />
                        <View style={styles.floatingElements}>
                            <View style={[styles.floatCircle, { top: -20, left: -40, width: 60, height: 60, backgroundColor: 'rgba(0, 255, 144, 0.1)' }]} />
                            <View style={[styles.floatCircle, { bottom: 40, right: -30, width: 80, height: 80, backgroundColor: 'rgba(59, 130, 246, 0.1)' }]} />
                        </View>
                    </View>
                </Animated.View>
            </View>

            {/* Welcome Text Section */}
            <View style={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
                <Animated.View entering={FadeInDown.delay(300).duration(800)}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Welcome to the{"\n"}Pilot app</Text>
                    
                    <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        Drive, deliver, and earn on your schedule. Setup your profile to get started.
                    </Text>
                </Animated.View>

                {/* Bottom Actions */}
                <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => router.push("/pilot/setup/terms")}
                        style={styles.primaryButton}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.replace("/home")}
                        style={styles.secondaryButton}
                    >
                        <Text style={styles.secondaryText}>Back to Rider Mode</Text>
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
        paddingHorizontal: 24,
    },
    brandText: {
        fontSize: 24,
        fontFamily: 'UberMoveBold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        width: width * 0.85,
        height: height * 0.35,
        borderRadius: 32,
        overflow: 'hidden',
    },
    illustrationPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingElements: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    floatCircle: {
        position: 'absolute',
        borderRadius: 100,
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 36,
        fontFamily: 'UberMoveBold',
        lineHeight: 44,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
    },
    footer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#00ff90',
        height: 64,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#00ff90',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'UberMoveBold',
    },
    secondaryButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    secondaryText: {
        color: '#71717a',
        fontSize: 14,
        fontFamily: 'UberMoveMedium',
    },
});
