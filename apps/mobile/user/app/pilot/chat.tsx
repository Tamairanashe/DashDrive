import { Ionicons } from "@expo/vector-icons"; // Refreshing for Metro
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock conversation data
const INITIAL_MESSAGES = [
    { id: '1', text: "Hello! I'm waiting near the entrance.", sender: 'rider', time: '12:04 PM' },
    { id: '2', text: "Got it, I'm about 2 minutes away.", sender: 'pilot', time: '12:05 PM' },
];

const QUICK_REPLIES = [
    "I've arrived",
    "I'm outside",
    "Traffic is heavy",
    "On my way!",
];

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    const handleBack = () => {
        router.back();
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            text: text,
            sender: 'pilot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInputText("");
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
        >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top, backgroundColor: isDark ? '#18181b' : '#fff' }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={isDark ? '#fff' : '#18181b'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.avatarBox}>
                        <Ionicons name="person" size={20} color="#00ff90" />
                    </View>
                    <View>
                        <Text style={[styles.headerName, { color: isDark ? '#fff' : '#18181b' }]}>Emma W.</Text>
                        <Text style={styles.headerStatus}>Rider • Picking up</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/pilot/call" as any)}
                    style={styles.headerCall}
                >
                    <Ionicons name="call" size={24} color="#00ff90" />
                </TouchableOpacity>
            </View>

            {/* Encryption Banner */}
            <View style={[styles.encryptionBanner, { backgroundColor: isDark ? '#111' : '#f8f9fa' }]}>
                <Ionicons name="lock-closed" size={14} color="#71717a" />
                <Text style={styles.encryptionText}>End-to-end encrypted</Text>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messageList}
                contentContainerStyle={styles.messageContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg, index) => (
                    <Animated.View
                        key={msg.id}
                        entering={msg.sender === 'pilot' ? SlideInRight.duration(300) : FadeInUp.duration(300)}
                        style={[
                            styles.messageRow,
                            msg.sender === 'pilot' ? styles.pilotRow : styles.riderRow
                        ]}
                    >
                        <View style={[
                            styles.bubble,
                            msg.sender === 'pilot'
                                ? [styles.pilotBubble, { backgroundColor: '#00ff90' }]
                                : [styles.riderBubble, { backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]
                        ]}>
                            <Text style={[
                                styles.messageText,
                                { color: msg.sender === 'pilot' ? '#000' : (isDark ? '#fff' : '#18181b') }
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                        <Text style={styles.messageTime}>{msg.time}</Text>
                    </Animated.View>
                ))}
            </ScrollView>

            {/* Quick Replies */}
            <View style={styles.quickReplyContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplyScroll}>
                    {QUICK_REPLIES.map((reply) => (
                        <TouchableOpacity
                            key={reply}
                            onPress={() => sendMessage(reply)}
                            style={[styles.quickReplyChip, { backgroundColor: isDark ? '#18181b' : '#f4f4f5' }]}
                        >
                            <Text style={[styles.quickReplyText, { color: isDark ? '#fff' : '#18181b' }]}>{reply}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Input Bar */}
            <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12, backgroundColor: isDark ? '#18181b' : '#fff' }]}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add" size={28} color="#71717a" />
                </TouchableOpacity>
                <TextInput
                    style={[styles.input, { color: isDark ? '#fff' : '#18181b', backgroundColor: isDark ? '#27272a' : '#f4f4f5' }]}
                    placeholder="Type a message..."
                    placeholderTextColor="#a1a1aa"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    onPress={() => sendMessage(inputText)}
                    style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                >
                    <Ionicons name="send" size={24} color="#00ff90" />
                </TouchableOpacity>
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
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 255, 144, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerStatus: {
        fontSize: 12,
        color: '#71717a',
    },
    headerCall: {
        padding: 8,
    },
    encryptionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    encryptionText: {
        fontSize: 12,
        color: '#71717a',
    },
    messageList: {
        flex: 1,
    },
    messageContent: {
        padding: 20,
    },
    messageRow: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    pilotRow: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    riderRow: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    pilotBubble: {
        borderBottomRightRadius: 4,
    },
    riderBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 10,
        color: '#71717a',
        marginTop: 4,
    },
    quickReplyContainer: {
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    quickReplyScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    quickReplyChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 144, 0.2)',
    },
    quickReplyText: {
        fontSize: 14,
        fontWeight: '500',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    attachButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        padding: 10,
    },
});
