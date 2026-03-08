import { useRouter } from "expo-router";
import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledFontAwesome5, StyledMaterialIcons } from "../../src/lib/interop";

export default function PaymentMethodScreen() {
    const router = useRouter();

    const paymentMethods = [
        {
            id: "cash",
            title: "Cash",
            icon: <StyledMaterialIcons name="payments" size={24} color="#adadad" />,
            onPress: () => router.push({ pathname: "/(tabs)", params: { setupSuccess: "true" } } as any),
        },
        {
            id: "card",
            title: "Add debit/credit card",
            icon: <StyledFontAwesome5 name="plus" size={18} color="#adadad" />,
            onPress: () => router.push("/setup/add-card" as any),
        },
        {
            id: "ecocash",
            title: "EcoCash / Mobile Wallet",
            icon: <StyledMaterialIcons name="phone-iphone" size={24} color="#adadad" />,
            onPress: () => router.push({ pathname: "/(tabs)", params: { setupSuccess: "true" } } as any),
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 px-6 pt-10">
                <Text className="text-4xl font-uber-bold text-secondary dark:text-white mb-4">
                    Set up payment
                </Text>
                <Text className="text-lg font-uber-medium text-accent-gray dark:text-zinc-500 mb-10 leading-6">
                    Pick a preferred payment method for a more convenient ride later.
                </Text>

                <View className="space-y-4">
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            onPress={method.onPress}
                            className="flex-row items-center py-5 border-b border-accent-light/30 dark:border-white/10"
                        >
                            <View className="w-10 items-center justify-center">
                                {method.icon}
                            </View>
                            <Text className="flex-1 ml-4 text-xl font-uber-medium text-secondary dark:text-white">
                                {method.title}
                            </Text>
                            <StyledMaterialIcons name="chevron-right" size={24} color="#adadad" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-auto mb-10">
                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)" as any)}
                        className="w-full py-5 rounded-3xl bg-accent-light/20 dark:bg-white/5 items-center justify-center"
                    >
                        <Text className="text-secondary dark:text-white font-uber-bold text-lg">
                            Set up later
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
