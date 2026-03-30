import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedPlacesStore } from "../../src/lib/store";

export default function ChoosePlaceScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { home, work, custom } = useSavedPlacesStore();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="px-6 pt-10 flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-lg mr-4"
                    >
                        <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Choose a Place</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/search/edit-saved" as any)}>
                    <Text className="text-primary font-uber-bold text-base">Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                <PlaceRow
                    icon="home-outline"
                    label={home ? home.title : "Add home"}
                    sub={home?.address}
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'home' } } as any)}
                />
                <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                <PlaceRow
                    icon="briefcase-outline"
                    label={work ? work.title : "Add work"}
                    sub={work?.address}
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'work' } } as any)}
                />
                <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                {custom.map((place) => (
                    <React.Fragment key={place.id}>
                        <PlaceRow
                            icon={place.icon}
                            label={place.title}
                            sub={place.address}
                            onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'custom', id: place.id } } as any)}
                        />
                        <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                    </React.Fragment>
                ))}
                <PlaceRow
                    icon="add"
                    label="Add new"
                    sub="Save your favourite places"
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'custom' } } as any)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const PlaceRow = ({ icon, label, sub, onPress }: { icon: any, label: string, sub?: string, onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 mr-4">
            <Ionicons name={icon} size={20} color="#3b82f6" />
        </View>
        <View className="flex-1">
            <Text className="text-lg font-uber-bold text-primary">{label}</Text>
            {sub && <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500">{sub}</Text>}
        </View>
    </TouchableOpacity>
);
