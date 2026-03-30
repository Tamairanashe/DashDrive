import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "@/src/lib/interop";

const PAYMENT_METHODS = [
    { id: "1", name: "PayPal", icon: "https://img.icons8.com/color/48/paypal.png" },
    { id: "2", name: "Google Pay", icon: "https://img.icons8.com/color/48/google-logo.png" },
    { id: "3", name: "Apple Pay", icon: "https://img.icons8.com/color/48/apple-pay.png", darkIcon: "https://img.icons8.com/color/48/apple-pay.png" },
    { id: "4", name: "MasterCard", icon: "https://img.icons8.com/color/48/mastercard.png", lastDigits: "•••• •••• •••• 4456" },
];

export default function PaymentMethodsScreen() {
    const { id, seat, reservationId } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [selectedMethod, setSelectedMethod] = useState("4");

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-8">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Payment Methods</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-base mb-8">
                        Select the payment method you want to use.
                    </Text>

                    {PAYMENT_METHODS.map((method) => (
                        <Pressable 
                            key={method.id}
                            onPress={() => setSelectedMethod(method.id)}
                            className="flex-row items-center p-6 mb-4 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                        >
                            <Image source={{ uri: method.icon }} className="h-8 w-10 mr-4" resizeMode="contain" />
                            <View className="flex-1">
                                <Text className="text-lg font-uber-bold text-secondary dark:text-white">{method.name}</Text>
                                {method.lastDigits && (
                                    <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-xs mt-1">{method.lastDigits}</Text>
                                )}
                            </View>
                            <View className={`h-6 w-6 rounded-full border-2 items-center justify-center ${selectedMethod === method.id ? 'border-primary' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                {selectedMethod === method.id && <View className="h-3 w-3 rounded-full bg-primary" />}
                            </View>
                        </Pressable>
                    ))}

                    <Pressable className="bg-primary/5 h-16 rounded-[28px] items-center justify-center border border-primary/20 mt-4 mb-10">
                        <Text className="text-primary font-uber-bold text-lg">Add New Card</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
                <Pressable 
                    onPress={() => router.push({ pathname: "/events/checkout", params: { id, seat, reservationId, method: selectedMethod } } as any)}
                    className="bg-primary h-16 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40 active:scale-[0.98]"
                >
                    <Text className="text-black font-uber-bold text-xl uppercase tracking-wider">Continue</Text>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}
