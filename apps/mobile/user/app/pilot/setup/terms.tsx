import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PilotSetupTermsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [agreed, setAgreed] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Legal</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeIn.duration(600)}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                            <Ionicons name="document-text-outline" size={48} color="#00ff90" />
                        </View>
                    </View>

                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                        Accept DashDrive's Terms{"\n"}& Review Privacy Notice
                    </Text>

                    <Text style={[styles.description, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        By selecting "I Agree" below, I have reviewed and agree to the{" "}
                        <Text style={styles.linkText}>Terms of Use</Text> and acknowledge the{" "}
                        <Text style={styles.linkText}>Privacy Notice</Text>. I am at least 18 years of age.
                    </Text>

                    {/* Checkbox Section */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setAgreed(!agreed)}
                        style={[styles.agreeRow, { borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                    >
                        <Text style={[styles.agreeText, { color: isDark ? '#fff' : '#000' }]}>I Agree</Text>
                        <View style={[
                            styles.checkbox,
                            { borderColor: agreed ? '#00ff90' : (isDark ? '#3f3f46' : '#d4d4d8') },
                            agreed && { backgroundColor: '#00ff90' }
                        ]}>
                            {agreed && <Ionicons name="checkmark" size={16} color="#000" />}
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.footerButtons}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.circleButton, { backgroundColor: isDark ? '#1a1a1a' : '#f4f4f5' }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => agreed && router.push("/pilot/setup/preferences")}
                        disabled={!agreed}
                        style={[
                            styles.nextButton,
                            { backgroundColor: agreed ? '#00ff90' : (isDark ? '#1a1a1a' : '#f4f4f5') }
                        ]}
                    >
                        <Text style={[styles.nextText, { color: agreed ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8') }]}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color={agreed ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8')} />
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 20,
        height: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'UberMoveBold',
        marginLeft: 8,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'UberMoveBold',
        lineHeight: 34,
        marginBottom: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 40,
    },
    linkText: {
        color: '#00ff90',
        textDecorationLine: 'underline',
    },
    agreeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        marginBottom: 40,
    },
    agreeText: {
        fontSize: 16,
        fontFamily: 'UberMoveBold',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    circleButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButton: {
        height: 56,
        paddingHorizontal: 32,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nextText: {
        fontSize: 18,
        fontFamily: 'UberMoveBold',
    },
});
