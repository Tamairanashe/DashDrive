import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { StyledFontAwesome } from "../../src/lib/interop";

export default function AddCardScreen() {
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, "");
        const match = cleaned.match(/.{1,4}/g);
        return match ? match.join(" ") : cleaned;
    };

    const handleCardNumberChange = (text: string) => {
        setCardNumber(formatCardNumber(text));
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 px-6 pt-4">
                <View className="flex-row items-center justify-between mb-8">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-[#05A357] text-lg font-uber-medium">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-uber-bold text-secondary dark:text-white">New card</Text>
                    <View className="w-10" />
                </View>

                <View className="space-y-4">
                    {/* Card Number Input */}
                    <View className="bg-accent-light/10 dark:bg-white/5 rounded-2xl p-4 border border-accent-light/30 dark:border-white/10">
                        <Text className="text-accent-gray text-xs font-uber-medium mb-1">Card number</Text>
                        <View className="flex-row items-center">
                            <StyledFontAwesome name="credit-card" size={20} color="#adadad" />
                            <TextInput
                                className="flex-1 ml-3 text-lg font-uber-medium text-secondary dark:text-white"
                                placeholder="1234 5678 9101 1121"
                                placeholderTextColor="#adadad"
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={handleCardNumberChange}
                                maxLength={19}
                            />
                            {cardNumber.length > 0 && (
                                <TouchableOpacity onPress={() => setCardNumber("")}>
                                    <StyledFontAwesome name="times-circle" size={18} color="#adadad" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        {/* Expiry Date */}
                        <View className="flex-1 bg-accent-light/10 dark:bg-white/5 rounded-2xl p-4 border border-accent-light/30 dark:border-white/10">
                            <Text className="text-accent-gray text-xs font-uber-medium mb-1">Expiry date</Text>
                            <TextInput
                                className="text-lg font-uber-medium text-secondary dark:text-white"
                                placeholder="MM/YY"
                                placeholderTextColor="#adadad"
                                keyboardType="numeric"
                                value={expiry}
                                onChangeText={setExpiry}
                                maxLength={5}
                            />
                        </View>

                        {/* CVV */}
                        <View className="flex-1 bg-accent-light/10 dark:bg-white/5 rounded-2xl p-4 border border-accent-light/30 dark:border-white/10">
                            <Text className="text-accent-gray text-xs font-uber-medium mb-1">Secure code</Text>
                            <TextInput
                                className="text-lg font-uber-medium text-secondary dark:text-white"
                                placeholder="CVV"
                                placeholderTextColor="#adadad"
                                keyboardType="numeric"
                                secureTextEntry
                                value={cvv}
                                onChangeText={setCvv}
                                maxLength={3}
                            />
                        </View>
                    </View>
                </View>

                <Text className="mt-8 text-secondary/70 dark:text-white/60 font-uber text-sm leading-5">
                    DashDrive may charge a small amount to confirm your card details. This is immediately refunded. <Text className="text-[#05A357]">Learn more</Text>
                </Text>

                <View className="mt-auto mb-10">
                    <Button
                        label="Add card"
                        className="bg-[#05A357] border-[#05A357]"
                        textClassName="text-white font-uber-bold"
                        disabled={cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3}
                        onPress={() => router.push({ pathname: "/(tabs)", params: { setupSuccess: "true" } } as any)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
