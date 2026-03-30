import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SAVED_PLACES = [
    { id: 1, name: "Home", address: "44 Warton Road, Stratford, London", icon: "home" },
    { id: 2, name: "Work", address: "25 Bank Street, Canary Wharf, London", icon: "briefcase" },
    { id: 3, name: "Gym", address: "Pure Gym, Westfield Stratford", icon: "fitness" },
    { id: 4, name: "Mum's House", address: "12 Oak Lane, Greenwich", icon: "heart" },
];

export default function SavedPlacesScreen() {
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
                <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Saved Places</Text>
                <TouchableOpacity
                    onPress={() => router.push("/search/choose-place" as any)}
                    className="h-10 w-10 items-center justify-center bg-primary rounded-full"
                >
                    <Ionicons name="add" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {SAVED_PLACES.map((place) => (
                    <TouchableOpacity
                        key={place.id}
                        className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800"
                        onPress={() => router.push("/search/edit-saved" as any)}
                    >
                        <View className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
                            <Ionicons name={place.icon as any} size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-uber-bold dark:text-white">{place.name}</Text>
                            <Text className="text-sm text-accent-gray dark:text-zinc-500 font-uber" numberOfLines={1}>{place.address}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#adadad" />
                    </TouchableOpacity>
                ))}

                {/* Tips */}
                <View className="mt-8 p-4 bg-primary/10 rounded-2xl">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="bulb-outline" size={20} color="#00ff90" />
                        <Text className="ml-2 font-uber-bold text-primary">Quick Tip</Text>
                    </View>
                    <Text className="font-uber text-accent-gray dark:text-zinc-400 text-sm">
                        Save your frequent destinations for faster booking. Tap the + button to add a new place!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
