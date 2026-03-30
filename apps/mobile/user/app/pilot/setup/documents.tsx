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
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DocumentItem {
    id: string;
    title: string;
    required: boolean;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
}

const REQUIRED_DOCUMENTS: DocumentItem[] = [
    { id: 'license', title: "Driver's License", required: true, status: 'pending' },
    { id: 'national_id', title: 'National ID / Passport', required: true, status: 'pending' },
    { id: 'insurance', title: 'Vehicle Insurance', required: true, status: 'pending' },
    { id: 'car_photo_front', title: 'Vehicle Photo (Front)', required: true, status: 'pending' },
    { id: 'car_photo_side', title: 'Vehicle Photo (Side)', required: true, status: 'pending' },
];

export default function PilotSetupDocumentsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const renderDocItem = (doc: DocumentItem) => (
        <TouchableOpacity
            key={doc.id}
            onPress={() => router.push({
                pathname: "/pilot/setup/doc-upload",
                params: { docId: doc.id, docTitle: doc.title }
            } as any)}
            style={[styles.docCard, { backgroundColor: isDark ? '#111' : '#fff', borderColor: isDark ? '#27272a' : '#e4e4e7' }]}
        >
            <View style={styles.docLeft}>
                <View style={[styles.docIcon, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                    <Ionicons
                        name={doc.id.includes('car') ? "camera-outline" : "document-text-outline"}
                        size={24}
                        color={isDark ? '#fff' : '#000'}
                    />
                </View>
                <View>
                    <Text style={[styles.docTitle, { color: isDark ? '#fff' : '#000' }]}>{doc.title}</Text>
                    <Text style={styles.docStatus}>Ready to upload</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Documents</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeIn.duration(600)}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
                            <Ionicons name="shield-checkmark-outline" size={48} color="#00ff90" />
                        </View>
                    </View>

                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                        Let's verify your{"\n"}information
                    </Text>

                    <Text style={[styles.description, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        We need a few documents to verify your identity and vehicle. This is required for safety and compliance.
                    </Text>

                    <View style={styles.docList}>
                        <Text style={styles.listHeader}>REQUIRED DOCUMENTS</Text>
                        {REQUIRED_DOCUMENTS.map(renderDocItem)}
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

                    {/* In a real app, this would be disabled until all docs are uploaded */}
                    <TouchableOpacity
                        onPress={() => router.push("/pilot/setup/completion")}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Submit All</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
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
    docList: {
        gap: 12,
    },
    listHeader: {
        fontSize: 12,
        fontFamily: 'UberMoveBold',
        color: '#71717a',
        letterSpacing: 1,
        marginBottom: 8,
    },
    docCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    docLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    docIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    docTitle: {
        fontSize: 15,
        fontFamily: 'UberMoveBold',
        marginBottom: 2,
    },
    docStatus: {
        fontSize: 12,
        color: '#71717a',
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
        backgroundColor: '#00ff90',
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
        color: '#000',
    },
});
