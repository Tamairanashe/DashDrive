import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";

export default function EmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    // Notification animation state
    const translateY = useSharedValue(-200);

    const notificationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const triggerNotification = () => {
        translateY.value = withSpring(60, { damping: 15 });
        // Auto-hide after 6 seconds
        setTimeout(() => {
            translateY.value = withTiming(-200, { duration: 500 });
        }, 6000);
    };

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleContinue = () => {
        setIsWaiting(true);
        // Show email verification notification after 2 seconds
        setTimeout(() => {
            triggerNotification();
            // Simulate user clicking the link after 4 seconds
            setTimeout(() => {
                router.replace("/auth/name" as any);
            }, 4000);
        }, 2000);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* Mock Push Notification */}
            <Animated.View
                style={[
                    notificationStyle,
                    {
                        position: "absolute",
                        top: 0,
                        left: 20,
                        right: 20,
                        zIndex: 9999,
                    },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.replace("/auth/name" as any)}
                    style={{
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        padding: 16,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center">
                            <View className="bg-white/10 p-1.5 rounded-lg mr-2">
                                <Ionicons name="mail" size={16} color="#00ff90" />
                            </View>
                            <Text className="text-white/60 text-[10px] font-uber-medium uppercase tracking-widest">
                                Gmail
                            </Text>
                        </View>
                        <Text className="text-white/40 text-[10px] font-uber-medium">
                            now
                        </Text>
                    </View>
                    <Text className="text-white text-[15px] font-uber-bold mb-0.5">
                        DashDrive - Your verification code
                    </Text>
                    <Text className="text-white/70 text-[13px] font-uber-medium">
                        Tap here to verify your identity and continue.
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mb-8 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl"
                    >
                        <Ionicons name="arrow-back" size={20} color="#adadad" />
                    </TouchableOpacity>

                    <Text className="mb-2 text-3xl font-uber-bold text-secondary dark:text-white">
                        {isWaiting ? "Verification sent" : "Enter your email"}
                    </Text>

                    <View className="mt-8">
                        {!isWaiting ? (
                            <>
                                <View
                                    className={`h-20 rounded-2xl border-2 bg-primary/5 dark:bg-primary/10 px-6 justify-center ${isFocused ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <Text className="text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mb-1">
                                        Email
                                    </Text>
                                    <TextInput
                                        className="text-xl font-uber-bold text-black dark:text-white p-0"
                                        placeholder="example@mail.com"
                                        placeholderTextColor="#71717a"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoFocus
                                        value={email}
                                        onChangeText={setEmail}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />
                                </View>
                                <Text className="mt-4 text-base font-uber-medium text-accent-gray dark:text-zinc-500">
                                    We'll send you your trip receipts.
                                </Text>
                            </>
                        ) : (
                            <View className="items-center py-10">
                                <View className="h-20 w-20 items-center justify-center bg-primary/10 rounded-full mb-6">
                                    <Ionicons name="mail-open" size={40} color="#00ff90" />
                                </View>
                                <Text className="text-center text-lg font-uber-medium text-accent-gray dark:text-zinc-500 mb-8 px-4">
                                    We've sent a verification link to{"\n"}
                                    <Text className="text-black dark:text-white font-uber-bold">{email}</Text>
                                </Text>
                                <TouchableOpacity onPress={() => setIsWaiting(false)}>
                                    <Text className="text-primary font-uber-bold">Change email</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {!isWaiting && (
                        <View className="mt-auto mb-6">
                            <Button
                                label="Continue"
                                disabled={!isValidEmail(email)}
                                onPress={handleContinue}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}
