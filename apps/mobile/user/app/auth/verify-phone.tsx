import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { StyledFontAwesome5, StyledIonicons, StyledSafeAreaView } from "../../src/lib/interop";

export default function VerifyPhoneScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [method, setMethod] = useState<"sms" | "whatsapp">("sms");

    const handleContinue = () => {
        if (phoneNumber.length >= 10) {
            router.push({
                pathname: "/auth/otp",
                params: { method, source: "social" }
            } as any);
        }
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-6 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl"
                >
                    <StyledIonicons name="arrow-back" size={20} color="#adadad" />
                </TouchableOpacity>

                {/* Header */}
                <View className="mb-2">
                    <Text className="text-2xl font-uber-bold text-black dark:text-white mb-2">
                        Verify your phone
                    </Text>
                    <Text className="text-base font-uber text-accent-gray dark:text-zinc-500">
                        We need your phone number to contact you about your rides and for security purposes.
                    </Text>
                </View>

                {/* Phone Input */}
                <View className="flex-row items-center gap-2 mt-6 mb-6">
                    <View className="flex-row items-center rounded-2xl border-2 border-accent-light dark:border-zinc-800 bg-accent-light/30 dark:bg-zinc-800/50 px-4 h-16">
                        <Text className="text-lg">🇬🇧</Text>
                        <Text className="ml-2 text-base font-uber-medium text-black dark:text-white">
                            +44
                        </Text>
                        <StyledFontAwesome5
                            name="chevron-down"
                            size={12}
                            color="#adadad"
                            className="ml-2"
                        />
                    </View>
                    <View className="flex-1">
                        <Input
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            containerClassName="mb-0"
                            className="border-primary bg-primary/5 h-16"
                            autoFocus
                        />
                    </View>
                </View>

                {/* Verification Method */}
                <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">
                    Verification method
                </Text>
                <View className="gap-2">
                    <TouchableOpacity
                        onPress={() => setMethod("sms")}
                        className={`flex-row items-center p-4 rounded-2xl border-2 ${method === "sms" ? "border-primary bg-primary/5" : "border-zinc-100 dark:border-zinc-800"}`}
                    >
                        <StyledIonicons name="chatbubble-ellipses-outline" size={22} color={method === "sms" ? "#00ff90" : "#adadad"} />
                        <View className="ml-4 flex-1">
                            <Text className="text-base font-uber-bold text-black dark:text-white">
                                SMS
                            </Text>
                            <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500">
                                Standard rates may apply
                            </Text>
                        </View>
                        <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${method === "sms" ? "border-primary bg-primary" : "border-zinc-200 dark:border-zinc-700"}`}>
                            {method === "sms" && <View className="h-2 w-2 rounded-full bg-black" />}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMethod("whatsapp")}
                        className={`flex-row items-center p-4 rounded-2xl border-2 ${method === "whatsapp" ? "border-primary bg-primary/5" : "border-zinc-100 dark:border-zinc-800"}`}
                    >
                        <StyledIonicons name="logo-whatsapp" size={22} color={method === "whatsapp" ? "#00ff90" : "#adadad"} />
                        <View className="ml-4 flex-1">
                            <Text className="text-base font-uber-bold text-black dark:text-white">
                                WhatsApp
                            </Text>
                            <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500">
                                Free with internet connection
                            </Text>
                        </View>
                        <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${method === "whatsapp" ? "border-primary bg-primary" : "border-zinc-200 dark:border-zinc-700"}`}>
                            {method === "whatsapp" && <View className="h-2 w-2 rounded-full bg-black" />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Why we need this */}
                <View className="mt-6 p-4 bg-primary/10 rounded-2xl flex-row items-start">
                    <StyledIonicons name="information-circle-outline" size={20} color="#00ff90" />
                    <Text className="ml-3 flex-1 text-sm font-uber text-accent-gray dark:text-zinc-400">
                        Your driver will contact you via this number during your ride. We'll also use it for account security.
                    </Text>
                </View>

                <View className="mt-auto mb-6">
                    <Button
                        label="Send verification code"
                        disabled={phoneNumber.length < 10}
                        onPress={handleContinue}
                    />
                </View>
            </View>
        </StyledSafeAreaView>
    );
}
