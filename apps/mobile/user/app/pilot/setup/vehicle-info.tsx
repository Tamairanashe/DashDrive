import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PilotSetupVehicleInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [color, setColor] = useState("");

    const isFormValid = make && model && year && licensePlate && color;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Vehicle Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeIn.duration(600)}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                                <Ionicons name="car-sport-outline" size={48} color="#00ff90" />
                            </View>
                        </View>

                        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                            What vehicle will{"\n"}you be driving?
                        </Text>

                        <Text style={[styles.description, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                            Enter your vehicle details. This helps riders identify you and ensures we meet local regulations.
                        </Text>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Make</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDark ? '#111' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                                    placeholder="e.g. Toyota"
                                    placeholderTextColor="#71717a"
                                    value={make}
                                    onChangeText={setMake}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Model</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDark ? '#111' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                                    placeholder="e.g. Prius"
                                    placeholderTextColor="#71717a"
                                    value={model}
                                    onChangeText={setModel}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={styles.inputLabel}>Year</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: isDark ? '#111' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                                        placeholder="2022"
                                        placeholderTextColor="#71717a"
                                        keyboardType="number-pad"
                                        value={year}
                                        onChangeText={setYear}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.inputLabel}>Color</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: isDark ? '#111' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                                        placeholder="Black"
                                        placeholderTextColor="#71717a"
                                        value={color}
                                        onChangeText={setColor}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>License Plate</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDark ? '#111' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
                                    placeholder="KLY890"
                                    placeholderTextColor="#71717a"
                                    autoCapitalize="characters"
                                    value={licensePlate}
                                    onChangeText={setLicensePlate}
                                />
                            </View>
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
                            onPress={() => isFormValid && router.push("/pilot/setup/documents")}
                            disabled={!isFormValid}
                            style={[
                                styles.nextButton,
                                { backgroundColor: isFormValid ? '#00ff90' : (isDark ? '#1a1a1a' : '#f4f4f5') }
                            ]}
                        >
                            <Text style={[styles.nextText, { color: isFormValid ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8') }]}>Next</Text>
                            <Ionicons name="arrow-forward" size={20} color={isFormValid ? '#000' : (isDark ? '#3f3f46' : '#d4d4d8')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
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
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'UberMoveBold',
        color: '#71717a',
    },
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
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
