import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";

const TRANSACTIONS = [
    { id: 1, type: "ride", description: "Trip to Heathrow", amount: -14.50, date: "Today, 3:45 PM" },
    { id: 2, type: "topup", description: "Added funds", amount: 50.00, date: "Feb 5, 10:30 AM" },
    { id: 3, type: "ride", description: "Trip to Stratford", amount: -8.20, date: "Feb 4, 6:15 PM" },
    { id: 4, type: "refund", description: "Ride cancellation refund", amount: 3.50, date: "Feb 3, 2:00 PM" },
    { id: 5, type: "ride", description: "Trip to Greenwich", amount: -12.00, date: "Feb 2, 11:00 AM" },
];

export default function WalletScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center px-6 mt-4 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Wallet</Text>
                    <View className="w-10" />
                </View>

                {/* Balance Card */}
                <View className="px-6 mb-6">
                    <Card className="bg-secondary dark:bg-zinc-900 p-6">
                        <Text className="text-white/60 font-uber text-sm mb-1">Available Balance</Text>
                        <Text className="text-white text-4xl font-uber-bold mb-6">£35.30</Text>

                        <View className="flex-row gap-3">
                            <TouchableOpacity className="flex-1 bg-primary py-3 rounded-2xl items-center">
                                <Text className="font-uber-bold text-secondary">Add Funds</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-white/10 py-3 rounded-2xl items-center">
                                <Text className="font-uber-bold text-white">Send</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-6">
                    <View className="flex-row gap-4">
                        <TouchableOpacity className="flex-1 items-center py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                            <Ionicons name="card-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            <Text className="mt-2 font-uber-medium dark:text-white text-sm">Payment Methods</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 items-center py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                            <Ionicons name="pricetag-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            <Text className="mt-2 font-uber-medium dark:text-white text-sm">Promo Codes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 items-center py-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                            <Ionicons name="settings-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            <Text className="mt-2 font-uber-medium dark:text-white text-sm">Auto Top-up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-uber-bold dark:text-white">Recent Transactions</Text>
                        <TouchableOpacity>
                            <Text className="font-uber-medium text-primary">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {TRANSACTIONS.map((tx) => (
                        <TouchableOpacity
                            key={tx.id}
                            className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${tx.amount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-zinc-100 dark:bg-zinc-800'
                                }`}>
                                <Ionicons
                                    name={tx.type === 'ride' ? 'car' : tx.type === 'topup' ? 'add' : 'refresh'}
                                    size={18}
                                    color={tx.amount > 0 ? '#22c55e' : (colorScheme === 'dark' ? '#fff' : '#000')}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white">{tx.description}</Text>
                                <Text className="text-sm text-accent-gray dark:text-zinc-500 font-uber">{tx.date}</Text>
                            </View>
                            <Text className={`font-uber-bold ${tx.amount > 0 ? 'text-green-500' : 'dark:text-white'}`}>
                                {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
