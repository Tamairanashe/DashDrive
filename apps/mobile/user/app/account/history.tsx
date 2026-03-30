import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RIDES = [
    { id: 1, from: "44 Warton Road", to: "Heathrow T2", date: "Feb 7, 2026", time: "3:45 PM", fare: 14.50, status: "completed" },
    { id: 2, from: "Stratford Station", to: "Greenwich Park", date: "Feb 4, 2026", time: "6:15 PM", fare: 8.20, status: "completed" },
    { id: 3, from: "Canary Wharf", to: "Liverpool Street", date: "Feb 2, 2026", time: "9:00 AM", fare: 12.00, status: "completed" },
    { id: 4, from: "King's Cross", to: "Brixton", date: "Jan 30, 2026", time: "7:30 PM", fare: 18.50, status: "completed" },
    { id: 5, from: "Shoreditch", to: "Hackney", date: "Jan 28, 2026", time: "2:00 PM", fare: 6.80, status: "cancelled" },
];

export default function HistoryScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            {/* Header */}
            <View className="flex-row items-center px-6 mt-4 mb-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                >
                    <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Ride History</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {RIDES.map((ride) => (
                    <TouchableOpacity
                        key={ride.id}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mb-3"
                        onPress={() => router.push("/ride/receipt" as any)}
                    >
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-sm text-accent-gray dark:text-zinc-500 font-uber">{ride.date} • {ride.time}</Text>
                            <View className={`px-2 py-1 rounded-full ${ride.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                                }`}>
                                <Text className={`text-xs font-uber-bold ${ride.status === 'completed' ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                    {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-start mb-2">
                            <View className="w-5 items-center mr-3 mt-1">
                                <View className="w-2 h-2 bg-primary rounded-full" />
                                <View className="w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700 my-0.5" />
                                <View className="w-2 h-2 bg-secondary dark:bg-white rounded-full" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white text-sm">{ride.from}</Text>
                                <View className="h-2" />
                                <Text className="font-uber-medium dark:text-white text-sm">{ride.to}</Text>
                            </View>
                            <Text className="font-uber-bold dark:text-white">£{ride.fare.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
