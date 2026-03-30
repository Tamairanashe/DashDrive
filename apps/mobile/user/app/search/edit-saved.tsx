import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedPlacesStore } from "../../src/lib/store";

export default function EditSavedPlacesScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { home, work, custom, removeHome, removeWork, removeCustom } = useSavedPlacesStore();

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
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Edit Saved Places</Text>
                </View>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-primary font-uber-bold text-base">Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6">
                <EditPlaceRow
                    icon="home-outline"
                    label={home ? home.title : "Add home"}
                    sub={home?.address}
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'home' } } as any)}
                    onDelete={home ? removeHome : undefined}
                    onShare={home ? () => Share.share({ message: `Check out my Home: ${home.address}`, title: 'Home' }) : undefined}
                />
                <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                <EditPlaceRow
                    icon="briefcase-outline"
                    label={work ? work.title : "Add work"}
                    sub={work?.address}
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'work' } } as any)}
                    onDelete={work ? removeWork : undefined}
                    onShare={work ? () => Share.share({ message: `Check out my Work: ${work.address}`, title: 'Work' }) : undefined}
                />
                <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                {custom.map((place) => (
                    <React.Fragment key={place.id}>
                        <EditPlaceRow
                            icon={place.icon}
                            label={place.title}
                            sub={place.address}
                            onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'custom', id: place.id } } as any)}
                            onDelete={() => removeCustom(place.id)}
                            onShare={() => Share.share({ message: `Check out this place: ${place.title}\n${place.address}`, title: place.title })}
                        />
                        <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 ml-14 mb-4" />
                    </React.Fragment>
                ))}
                <EditPlaceRow
                    icon="add"
                    label="Add new"
                    sub="Save your favourite places"
                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'custom' } } as any)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const EditPlaceRow = ({ icon, label, sub, onPress, onDelete, onShare }: { icon: any, label: string, sub?: string, onPress: () => void, onDelete?: () => void, onShare?: () => void }) => (
    <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={onPress} className="flex-1 flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 mr-4">
                <Ionicons name={icon} size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <Text className="text-lg font-uber-bold text-primary">{label}</Text>
                {sub && <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500">{sub}</Text>}
            </View>
        </TouchableOpacity>

        {onShare && (
            <TouchableOpacity
                onPress={onShare}
                className="h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 ml-2"
            >
                <Ionicons name="share-social-outline" size={18} color="#3b82f6" />
            </TouchableOpacity>
        )}

        {onDelete && (
            <TouchableOpacity
                onPress={onDelete}
                className="h-10 w-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 ml-2"
            >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
        )}

        {!onDelete && !onShare && <Ionicons name="chevron-forward" size={18} color="#71717a" />}
    </View>
);
