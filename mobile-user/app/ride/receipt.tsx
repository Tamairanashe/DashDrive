import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useSavedPlacesStore } from "@/src/lib/store";

export default function ReceiptScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { isBusinessMode } = useSavedPlacesStore();

    const handleDone = () => {
        router.replace("/home" as any);
    };

    const handleReport = () => {
        // Navigate to support/report issue
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between mt-4 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-uber-bold dark:text-white">Trip Receipt</Text>
                    <View className="w-10" />
                </View>

                {/* Trip Info */}
                <Card className="mb-6 p-5">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-sm font-uber text-accent-gray dark:text-zinc-500">Feb 7, 2026 • 3:45 PM</Text>
                        <View className="bg-primary/20 px-3 py-1 rounded-full">
                            <Text className="text-xs font-uber-bold text-primary">Completed</Text>
                        </View>
                    </View>

                    {/* Route */}
                    <View className="mb-4">
                        <View className="flex-row items-start mb-3">
                            <View className="w-6 items-center mr-3">
                                <View className="w-3 h-3 bg-primary rounded-full" />
                                <View className="w-0.5 h-10 bg-zinc-200 dark:bg-zinc-700 my-1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Pickup</Text>
                                <Text className="font-uber-medium dark:text-white">44 Warton Road, Stratford</Text>
                            </View>
                        </View>
                        <View className="flex-row items-start">
                            <View className="w-6 items-center mr-3">
                                <View className="w-3 h-3 bg-secondary dark:bg-white rounded-full" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Dropoff</Text>
                                <Text className="font-uber-medium dark:text-white">Terminal 2, Heathrow Airport</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <View className="items-center flex-1">
                            <Ionicons name="map-outline" size={18} color="#adadad" />
                            <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Distance</Text>
                            <Text className="font-uber-bold dark:text-white">4.2 km</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Ionicons name="time-outline" size={18} color="#adadad" />
                            <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Duration</Text>
                            <Text className="font-uber-bold dark:text-white">12 mins</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Ionicons name="car-outline" size={18} color="#adadad" />
                            <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Type</Text>
                            <Text className="font-uber-bold dark:text-white">Comfort</Text>
                        </View>
                    </View>
                </Card>

                {/* Driver Info */}
                <Card className="mb-6 p-5">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
                            <Ionicons name="person" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-uber-bold text-lg dark:text-white">Sarah M.</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text className="text-sm font-uber text-accent-gray dark:text-zinc-400 ml-1">4.92</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-sm font-uber-medium dark:text-zinc-300">Toyota Prius</Text>
                            <Text className="text-xs text-accent-gray dark:text-zinc-500">AB12 CDE • Silver</Text>
                        </View>
                    </View>
                </Card>

                {/* Fare Breakdown */}
                <Card className="mb-6 p-5">
                    <Text className="font-uber-bold text-lg mb-4 dark:text-white">Fare Breakdown</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-400">Base fare</Text>
                            <Text className="font-uber-medium dark:text-white">£2.50</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-400">Distance (4.2 km)</Text>
                            <Text className="font-uber-medium dark:text-white">£6.30</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-400">Time (12 mins)</Text>
                            <Text className="font-uber-medium dark:text-white">£2.40</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-400">Booking fee</Text>
                            <Text className="font-uber-medium dark:text-white">£1.30</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-primary">Tip</Text>
                            <Text className="font-uber-medium text-primary">£2.00</Text>
                        </View>
                    </View>

                    <View className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-4" />

                    <View className="flex-row justify-between">
                        <Text className="font-uber-bold text-lg dark:text-white">Total</Text>
                        <Text className="font-uber-bold text-lg dark:text-white">£14.50</Text>
                    </View>

                    <View className="flex-row items-center mt-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl">
                        <Ionicons name={isBusinessMode ? "briefcase-outline" : "card-outline"} size={18} color={isBusinessMode ? "#00ff90" : "#adadad"} />
                        <Text className="ml-2 font-uber text-accent-gray dark:text-zinc-400">
                            {isBusinessMode ? "Billed to Company Profile" : "Paid with •••• 4242"}
                        </Text>
                    </View>
                </Card>

                {/* Actions */}
                <View className="flex-row gap-3 mb-4">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"
                        onPress={() => { }}
                    >
                        <Ionicons name="mail-outline" size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        <Text className="ml-2 font-uber-medium dark:text-white">Email Receipt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"
                        onPress={handleReport}
                    >
                        <Ionicons name="flag-outline" size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        <Text className="ml-2 font-uber-medium dark:text-white">Report Issue</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    label="Done"
                    onPress={handleDone}
                    className="mb-10"
                />
            </ScrollView>
        </SafeAreaView>
    );
}
