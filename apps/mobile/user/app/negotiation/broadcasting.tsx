import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";

// Mock data for driver offers
const MOCK_OFFERS = [
    {
        id: "1",
        name: "John D.",
        rating: 4.96,
        rides: 2667,
        car: "Hyundai Accent",
        distance: "2.3km",
        eta: "13 min",
        amount: "MX$65",
        isPlatinum: false,
    },
    {
        id: "2",
        name: "Sarah M.",
        rating: 4.93,
        rides: 10000,
        car: "Nissan Versa",
        distance: "1km",
        eta: "4 min",
        amount: "MX$65",
        isPlatinum: true,
    },
];

const DriverOfferCard = ({ offer, onAccept, onDecline }: { offer: any; onAccept: () => void; onDecline: () => void }) => {
    return (
        <Card className="mb-4 p-4 border-l-4 border-l-primary">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-accent-light dark:bg-zinc-800 rounded-full mr-3 items-center justify-center">
                        <Ionicons name="person" size={24} color="#adadada" />
                    </View>
                    <View>
                        <View className="flex-row items-center">
                            <Text className="font-uber-medium text-lg mr-2 dark:text-white">{offer.name}</Text>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text className="text-sm ml-1 dark:text-zinc-400">{offer.rating}</Text>
                            <Text className="text-gray-400 dark:text-zinc-600 text-xs ml-1">({offer.rides} rides)</Text>
                        </View>
                        <Text className="text-gray-500 font-uber dark:text-zinc-500">{offer.car}</Text>
                        {offer.isPlatinum && (
                            <Text className="text-purple-600 dark:text-purple-400 text-xs font-uber-medium">Platinum driver</Text>
                        )}
                    </View>
                </View>
                <View className="items-end">
                    <Text className="font-uber-medium dark:text-zinc-300">{offer.eta}</Text>
                    <Text className="text-xs text-gray-400 dark:text-zinc-500">{offer.distance}</Text>
                </View>
            </View>

            <Text className="text-2xl font-uber-bold mb-4 dark:text-white">{offer.amount}</Text>

            <View className="flex-row space-x-3">
                <TouchableOpacity
                    onPress={onDecline}
                    className="flex-1 bg-gray-100 dark:bg-zinc-800 py-3 rounded-xl items-center"
                >
                    <Text className="font-uber-medium text-gray-700 dark:text-zinc-300">Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onAccept}
                    className="flex-2 bg-primary py-3 rounded-xl items-center"
                >
                    <Text className="font-uber-medium text-black">Accept</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

export default function BroadcastingScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [progress] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 40000,
            useNativeDriver: false,
        }).start();
    }, []);

    const progressInterpolate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="px-5 py-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl">
                    <Ionicons name="arrow-back" size={24} color="#adadada" />
                </TouchableOpacity>
                <Text className="text-lg font-uber-medium dark:text-white">Broadcasting...</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-5 pt-2">
                <View className="mb-6">
                    <Text className="text-sm text-gray-500 dark:text-zinc-500 mb-2">6 drivers are viewing your request</Text>
                    <View className="flex-row -space-x-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View key={i} className="w-8 h-8 rounded-full bg-accent-light dark:bg-zinc-800 border-2 border-white dark:border-black items-center justify-center">
                                <Ionicons name="person" size={16} color="#adadada" />
                            </View>
                        ))}
                    </View>
                </View>

                {MOCK_OFFERS.map((offer) => (
                    <DriverOfferCard
                        key={offer.id}
                        offer={offer}
                        onAccept={() => router.replace("/negotiation/tracking" as any)}
                        onDecline={() => { }}
                    />
                ))}

                <View className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl mb-10">
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-uber-medium dark:text-zinc-300">Accept an offer from a driver</Text>
                        <Text className="text-gray-500 dark:text-zinc-500">00:40</Text>
                    </View>
                    <View className="h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <Animated.View
                            style={{ width: progressInterpolate }}
                            className="h-full bg-black dark:bg-primary"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-4 items-center mb-10"
                >
                    <Text className="text-gray-400 dark:text-zinc-600 font-uber-medium uppercase tracking-widest text-xs">Cancel request</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
