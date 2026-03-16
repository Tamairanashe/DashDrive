import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import Animated, { FadeInUp } from "react-native-reanimated";
import { api } from "../../src/lib/api";

const { width } = Dimensions.get("window");

export default function EventDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadEventDetails();
        }
    }, [id]);

    const loadEventDetails = async () => {
        setIsLoading(true);
        try {
            const data = await api.getEvent(id as string);
            setEvent(data);
        } catch (error) {
            console.error("Error loading event details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    if (!event) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <Text className="text-zinc-500 font-uber-bold">Event not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4">
                    <Text className="text-primary font-uber-bold">Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const eventDate = new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    const eventTime = new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <View>
                    <Image source={{ uri: event.image_url || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80" }} className="w-full h-[400px]" />
                    <SafeAreaView className="absolute top-0 left-6 right-6 flex-row items-center justify-between" edges={['top']}>
                        <Pressable 
                            onPress={() => router.back()}
                            className="h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
                        >
                            <StyledIonicons name="arrow-back" size={24} color="white" />
                        </Pressable>
                        <View className="flex-row space-x-4">
                            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                <StyledIonicons name="share-outline" size={24} color="white" />
                            </Pressable>
                            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                <StyledIonicons name="heart" size={24} color="#FF5A5F" />
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Content Card */}
                <Animated.View 
                    entering={FadeInUp.duration(600).delay(200)}
                    className="flex-1 px-6 -mt-10 rounded-t-[48px] bg-white dark:bg-black pt-8"
                >
                    <Text className="text-3xl font-uber-bold text-secondary dark:text-white mb-6">
                        {event.title}
                    </Text>

                    {/* Date & Time */}
                    <View className="flex-row items-center mb-6">
                        <View className="h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center mr-4">
                            <StyledIonicons name="calendar" size={24} color="#FFD700" />
                        </View>
                        <View>
                            <Text className="text-lg font-uber-bold text-secondary dark:text-white">{eventDate}</Text>
                            <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-sm">{eventTime} - End Time TBD</Text>
                        </View>
                    </View>

                    {/* Location */}
                    <View className="flex-row items-center mb-10">
                        <View className="h-12 w-12 rounded-2xl bg-primary/10 items-center justify-center mr-4">
                            <StyledIonicons name="location" size={24} color="#FFD700" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-uber-bold text-secondary dark:text-white">{event.venues?.name || "TBA"}</Text>
                            <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-sm" numberOfLines={1}>{event.venues?.address || "Location Details TBA"}</Text>
                        </View>
                        <Pressable className="bg-primary/10 px-4 py-2 rounded-full">
                            <Text className="text-primary font-uber-bold text-xs">Maps</Text>
                        </Pressable>
                    </View>

                    {/* Description */}
                    <Text className="text-xl font-uber-bold text-secondary dark:text-white mb-4">About Event</Text>
                    <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-base mb-10 leading-6">
                        {event.description || "No description provided for this event."}
                    </Text>

                    {/* Organizer */}
                    <View className="flex-row items-center justify-between mb-10">
                        <View className="flex-row items-center">
                            <Image source={{ uri: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=100&q=80" }} className="h-14 w-14 rounded-full mr-4" />
                            <View>
                                <Text className="text-lg font-uber-bold text-secondary dark:text-white">Partner Admin</Text>
                                <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-xs">Verified Organizer</Text>
                            </View>
                        </View>
                        <Pressable className="bg-primary px-6 py-2.5 rounded-full">
                            <Text className="text-black font-uber-bold text-sm">Follow</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between">
                <View>
                    <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-xs">Price</Text>
                    <Text className="text-3xl font-uber-bold text-primary">$45</Text>
                </View>
                <Pressable 
                    onPress={() => router.push({ pathname: "/events/seat-selection", params: { id: id } } as any)}
                    className="bg-primary h-16 px-10 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40 active:scale-[0.98]"
                >
                    <Text className="text-black font-uber-bold text-xl uppercase tracking-wider">Buy Ticket</Text>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}
