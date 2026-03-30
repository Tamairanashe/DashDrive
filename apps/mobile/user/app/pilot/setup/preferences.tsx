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

interface PreferenceOption {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const EARNING_OPTIONS: PreferenceOption[] = [
    {
        id: 'ride',
        title: 'Dash Ride',
        description: 'Provide classic ride-sharing services.',
        icon: 'car-outline'
    },
    {
        id: 'delivery',
        title: 'Dash Delivery',
        description: 'Deliver food and small packages.',
        icon: 'cube-outline'
    },
    {
        id: 'intercity',
        title: 'Dash Intercity',
        description: 'Long-distance travel between cities.',
        icon: 'business-outline'
    },
    {
        id: 'freight',
        title: 'Dash Freight',
        description: 'Coming soon: Move heavy loads.',
        icon: 'truck-outline'
    }
];

export default function PilotSetupPreferencesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [selectedOptions, setSelectedOptions] = useState<string[]>(['ride']);

    const toggleOption = (id: string) => {
        if (id === 'freight') return; // Mocking coming soon
        setSelectedOptions(prev =>
            prev.includes(id)
                ? prev.filter(o => o !== id)
                : [...prev, id]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Preferences</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeIn.duration(600)}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                            <Ionicons name="cash-outline" size={48} color="#00ff90" />
                        </View>
                    </View>

                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                        Earn with DashDrive
                    </Text>

                    <Text style={[styles.description, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        Decide when, where, and how you want to earn. Select the services you'd like to provide.
                    </Text>

                    <View style={styles.optionsList}>
                        {EARNING_OPTIONS.map((option) => {
                            const isSelected = selectedOptions.includes(option.id);
                            const isComingSoon = option.id === 'freight';

                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    activeOpacity={isComingSoon ? 1 : 0.8}
                                    onPress={() => toggleOption(option.id)}
                                    style={[
                                        styles.optionCard,
                                        {
                                            backgroundColor: isDark ? '#111' : '#fff',
                                            borderColor: isSelected ? '#00ff90' : (isDark ? '#27272a' : '#e4e4e7'),
                                            opacity: isComingSoon ? 0.5 : 1
                                        }
                                    ]}
                                >
                                    <View style={styles.optionLeft}>
                                        <View style={[styles.optionIcon, { backgroundColor: isSelected ? '#00ff90' : (isDark ? '#27272a' : '#f4f4f5') }]}>
                                            <Ionicons name={option.icon as any} size={24} color={isSelected ? '#000' : (isDark ? '#fff' : '#000')} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.optionTitle, { color: isDark ? '#fff' : '#000' }]}>{option.title}</Text>
                                            <Text style={styles.optionDesc}>{option.description}</Text>
                                        </View>
                                    </View>
                                    {!isComingSoon && (
                                        <View style={[
                                            styles.checkbox,
                                            { borderColor: isSelected ? '#00ff90' : (isDark ? '#3f3f46' : '#d4d4d8') },
                                            isSelected && { backgroundColor: '#00ff90' }
                                        ]}>
                                            {isSelected && <Ionicons name="checkmark" size={12} color="#000" />}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.footerButtons}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.circleButton, { backgroundColor: isDark ? '#1a1a1a' : '#f4f4f5' }]}
                    >
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => selectedOptions.length > 0 && router.push("/pilot/setup/vehicle-info")}
                        disabled={selectedOptions.length === 0}
                        style={[
                            styles.nextButton,
                            { backgroundColor: selectedOptions.length > 0 ? '#00ff90' : (isDark ? '#1a1a1a' : '#f4f4f5') }
                        ]}
                    >
                        <Text style={[styles.nextText, { color: selectedOptions.length > 0 ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8') }]}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color={selectedOptions.length > 0 ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8')} />
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
        paddingBottom: 40,
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
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 32,
    },
    optionsList: {
        gap: 16,
    },
    optionCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: 'UberMoveBold',
        marginBottom: 4,
    },
    optionDesc: {
        fontSize: 12,
        color: '#71717a',
        lineHeight: 18,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
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
