import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";

const CORRECT_CODE = "3045";

export default function OTPScreen() {
    const router = useRouter();
    const { method, source } = useLocalSearchParams();
    const [code, setCode] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(20);
    const [error, setError] = useState(false);
    const inputRefs = React.useRef<any>([]);


    // Notification animation state
    const translateY = useSharedValue(-200);

    const notificationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Show push notification after 3 seconds
        const notificationTimeout = setTimeout(() => {
            translateY.value = withSpring(60, { damping: 15 });

            // Auto-hide after 6 seconds
            setTimeout(() => {
                translateY.value = withTiming(-200, { duration: 500 });
            }, 6000);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(notificationTimeout);
        };
    }, []);

    const handleTextChange = (text: string, index: number) => {
        setError(false);
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        if (newCode.every((digit) => digit !== "")) {
            Keyboard.dismiss();
            handleVerify(newCode.join(""));
        }
    };

    const handleVerify = (enteredCode: string) => {
        if (enteredCode === CORRECT_CODE) {
            // Social auth users already have name from provider, go to home
            // Phone auth users go to register-options to create account
            if (source === "social") {
                router.replace("/(tabs)" as any);
            } else {
                router.replace("/auth/register-options" as any);
            }
        } else {
            setError(true);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && index > 0 && code[index] === "") {
            inputRefs.current[index - 1].focus();
        }
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
                <View
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
                                <Ionicons name="car-sport" size={16} color="#00ff90" />
                            </View>
                            <Text className="text-white/60 text-[10px] font-uber-medium uppercase tracking-widest">
                                DashDrive
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
                        3045 is your DashDrive security code. Do not share it.
                    </Text>
                </View>
            </Animated.View>

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()} className="mb-6 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl">
                        <Ionicons name="arrow-back" size={20} color="#adadad" />
                    </TouchableOpacity>

                    <Text className="mb-2 text-3xl font-uber-bold text-secondary dark:text-white">
                        Enter the code
                    </Text>
                    <Text className="mb-10 text-base font-uber-medium text-accent-gray dark:text-zinc-500">
                        A code was sent to your <Text className="text-black dark:text-white font-uber-bold">{method === 'whatsapp' ? 'WhatsApp' : 'phone'}</Text> at <Text className="text-black dark:text-white font-uber-bold">+44 ********79</Text>
                    </Text>

                    <View className="flex-row justify-between gap-4 mb-4">
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                className={`h-20 w-16 rounded-2xl border-2 bg-primary/5 dark:bg-primary/10 text-center text-3xl font-uber-bold text-black dark:text-white ${error ? 'border-red-500 bg-red-50' : 'border-primary'}`}
                                keyboardType="number-pad"
                                placeholderTextColor="#71717a"
                                maxLength={1}
                                value={code[index]}
                                onChangeText={(text) => handleTextChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </View>

                    {error && (
                        <Text className="mb-6 text-sm font-uber-medium text-red-500 text-center">
                            Invalid code. Please try again.
                        </Text>
                    )}

                    <Text className="text-base font-uber-medium text-accent-gray dark:text-zinc-500">
                        Resend code in <Text className="text-black dark:text-white font-uber-bold">{timer}</Text>
                    </Text>

                    <View className="mt-auto mb-6">
                        <Button
                            label="Verify & Continue"
                            disabled={code.some(digit => digit === "")}
                            onPress={() => handleVerify(code.join(""))}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
