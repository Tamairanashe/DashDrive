import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { StyledFontAwesome5, StyledIonicons, StyledSafeAreaView } from "../../src/lib/interop";

export default function PhoneLoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [method, setMethod] = useState<"sms" | "whatsapp">("sms");

    const handleContinue = () => {
        if (phoneNumber.length >= 10) {
            router.push({
                pathname: "/auth/otp",
                params: { method }
            } as any);
        }
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-8 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl"
                >
                    <StyledIonicons name="arrow-back" size={20} color="#adadad" />
                </TouchableOpacity>

                <Text className="mb-2 text-base font-uber-medium text-accent-gray dark:text-zinc-500">
                    We'll send a code for verification
                </Text>

                <View className="flex-row items-center gap-2 mt-4 mb-8">
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

                <View className="gap-2">
                    <TouchableOpacity
                        onPress={() => setMethod("sms")}
                        className={`flex-row items-center p-4 rounded-2xl border-2 ${method === "sms" ? "border-primary bg-primary/5" : "border-transparent"}`}
                    >
                        <View className="flex-row items-baseline flex-1">
                            <StyledIonicons name="chatbubble-ellipses-outline" size={22} color={method === "sms" ? "#00ff90" : "#adadad"} style={{ marginTop: 4 }} />
                            <View className="ml-4">
                                <Text className="text-lg font-uber-bold text-black dark:text-white">
                                    Get a code via SMS
                                </Text>
                                <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mt-0.5">
                                    Standard text messaging rates may apply.
                                </Text>
                            </View>
                        </View>
                        <View
                            className={`h-6 w-6 rounded-full border-2 items-center justify-center ${method === "sms" ? "border-primary bg-primary" : "border-accent-light dark:border-zinc-800"}`}
                        >
                            {method === "sms" && <View className="h-2.5 w-2.5 rounded-full bg-black" />}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMethod("whatsapp")}
                        className={`flex-row items-center p-4 rounded-2xl border-2 ${method === "whatsapp" ? "border-primary bg-primary/5" : "border-transparent"}`}
                    >
                        <View className="flex-row items-baseline flex-1">
                            <StyledIonicons name="logo-whatsapp" size={22} color={method === "whatsapp" ? "#00ff90" : "#adadad"} style={{ marginTop: 4 }} />
                            <View className="ml-4">
                                <Text className="text-lg font-uber-bold text-black dark:text-white">
                                    Get a code via WhatsApp
                                </Text>
                                <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mt-0.5">
                                    Bolt will not send you anything else without your consent.
                                </Text>
                            </View>
                        </View>
                        <View
                            className={`h-6 w-6 rounded-full border-2 items-center justify-center ${method === "whatsapp" ? "border-primary bg-primary" : "border-accent-light dark:border-zinc-800"}`}
                        >
                            {method === "whatsapp" && <View className="h-2.5 w-2.5 rounded-full bg-black" />}
                        </View>
                    </TouchableOpacity>
                </View>

                <Text className="mt-6 text-sm font-uber-medium text-accent-gray dark:text-zinc-500">
                    Bolt will not send anything without your consent.
                </Text>

                <View className="mt-auto mb-6">
                    <Button
                        label="Continue"
                        disabled={phoneNumber.length < 10}
                        onPress={handleContinue}
                    />
                </View>
            </View>
        </StyledSafeAreaView>
    );
}
